import OpenAI from 'openai';
import dotenv from 'dotenv';
import { extractClauses, enhanceRisksWithClauses } from './clauseExtractor.js';

dotenv.config();

// OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze contract text using OpenAI
 * @param {string} contractText - Extracted contract text
 * @param {string} contractType - Type of contract (podryad, services, supply, etc.)
 * @param {string} userRole - User's role (executor, customer)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeContractWithAI(contractText, contractType, userRole) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  // Extract clauses from the contract for reference
  const clauses = extractClauses(contractText);
  console.log(`Extracted ${clauses.length} clauses from contract`);

  const prompt = buildAnalysisPrompt(contractText, contractType, userRole, clauses);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // OpenAI model
      messages: [
        {
          role: 'system',
          content: `Вы - эксперт по юридическому анализу договоров. Ваша задача - проанализировать договор и выявить риски, которые могут быть невыгодны для указанной стороны. Отвечайте ТОЛЬКО в формате JSON без Markdown форматирования. Для каждого риска указывайте конкретный номер пункта/статьи договора.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response (handle potential markdown code blocks)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || 
                      content.match(/```\s*([\s\S]*?)```/) ||
                      [null, content];
    
    const jsonStr = jsonMatch[1] || content;
    const analysis = JSON.parse(jsonStr.trim());
    
    // Enhance risks with clause references
    if (analysis.risks && clauses.length > 0) {
      analysis.risks = enhanceRisksWithClauses(analysis.risks, clauses);
    }
    
    // Validate and normalize response
    return normalizeAnalysis(analysis);
    
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

function buildAnalysisPrompt(contractText, contractType, userRole, clauses) {
  const typeLabels = {
    podryad: 'договор подряда',
    services: 'договор оказания услуг',
    supply: 'договор поставки',
    nda: 'соглашение о конфиденциальности (NDA)',
    agency: 'агентский договор',
    oferta: 'договор оферты',
    other: 'договор'
  };

  const roleLabels = {
    executor: 'исполнитель (подрядчик, поставщик услуг)',
    customer: 'заказчик (клиент, потребитель услуг)'
  };

  const typeLabel = typeLabels[contractType] || typeLabels.other;
  const roleLabel = roleLabels[userRole] || roleLabels.executor;

  // Build clause reference section
  let clauseSection = '';
  if (clauses && clauses.length > 0) {
    clauseSection = `
СТРУКТУРА ДОГОВОРА (номера пунктов/статей):
${clauses.slice(0, 50).map(c => `- Пункт ${c.number}: ${c.text.slice(0, 80)}...`).join('\n')}
`;
  }

  return `
Проанализируй следующий ${typeLabel} с позиции ${roleLabel}.

ТЕКСТ ДОГОВОРА:
---
${contractText.slice(0, 40000)}
---
${clauseSection}

ЗАДАЧА:
Выяви риски и проблемные пункты, которые могут быть невыгодны для ${roleLabel}. Для каждого риска укажи:
1. Уровень риска: high (высокий - критичные проблемы), medium (средний - требуют внимания), low (низкий - замечания)
2. Заголовок - краткое название проблемы
3. clause - номер пункта/статьи договора (например: "4.2", "Статья 5", "п. 3.1") - найди по цитате
4. Текст - цитата из договора (точная формулировка)
5. Статья ГК РФ или другой закон
6. Описание - почему это проблема для ${roleLabel}
7. Рекомендация - как исправить

Обрати особое внимание на:
- Одностороннее изменение условий
- Неограниченную ответственность
- Несоразмерную неустойку
- Передачу прав без оплаты
- Отсутствие сроков рассмотрения
- Неясные формулировки

Ответь в формате JSON:
{
  "risks": [
    {
      "level": "high|medium|low",
      "title": "Название риска",
      "clause": "Номер пункта/статьи (например: 4.2)",
      "text": "Цитата из договора",
      "article": "Ст. XXX ГК РФ",
      "description": "Почему это проблема",
      "recommendation": "Как исправить"
    }
  ],
  "summary": {
    "highRisks": число,
    "mediumRisks": число,
    "lowRisks": число,
    "totalScore": число от 0 до 100 (чем выше, тем хуже)
  },
  "recommendations": ["Общая рекомендация 1", "Общая рекомендация 2"]
}

Верни ТОЛЬКО JSON, без Markdown, без комментариев.`;
}

function normalizeAnalysis(analysis) {
  // Ensure all required fields exist
  const normalized = {
    risks: [],
    summary: {
      highRisks: 0,
      mediumRisks: 0,
      lowRisks: 0,
      totalScore: 50
    },
    recommendations: []
  };

  if (analysis.risks && Array.isArray(analysis.risks)) {
    normalized.risks = analysis.risks.map(risk => ({
      level: ['high', 'medium', 'low'].includes(risk.level) ? risk.level : 'medium',
      title: risk.title || 'Неизвестный риск',
      text: risk.text || '',
      article: risk.article || '',
      description: risk.description || '',
      recommendation: risk.recommendation || ''
    }));
  }

  if (analysis.summary) {
    normalized.summary = {
      highRisks: analysis.summary.highRisks || normalized.risks.filter(r => r.level === 'high').length,
      mediumRisks: analysis.summary.mediumRisks || normalized.risks.filter(r => r.level === 'medium').length,
      lowRisks: analysis.summary.lowRisks || normalized.risks.filter(r => r.level === 'low').length,
      totalScore: analysis.summary.totalScore || calculateRiskScore(normalized.risks)
    };
  } else {
    // Calculate from risks
    normalized.summary = {
      highRisks: normalized.risks.filter(r => r.level === 'high').length,
      mediumRisks: normalized.risks.filter(r => r.level === 'medium').length,
      lowRisks: normalized.risks.filter(r => r.level === 'low').length,
      totalScore: calculateRiskScore(normalized.risks)
    };
  }

  if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
    normalized.recommendations = analysis.recommendations;
  }

  return normalized;
}

function calculateRiskScore(risks) {
  const weights = { high: 20, medium: 10, low: 5 };
  const total = risks.reduce((sum, risk) => sum + (weights[risk.level] || 0), 0);
  return Math.min(100, total);
}

/**
 * Fallback mock analysis for testing without OpenAI API
 */
export function getMockAnalysis(contractType, userRole) {
  const risks = [
    {
      level: 'high',
      title: 'Одностороннее изменение объема работ',
      clause: '4.2',
      text: '«Заказчик вправе в одностороннем порядке изменить объем работ»',
      article: 'Ст. 310 ГК РФ',
      description: `Изменение договора возможно только по соглашению сторон. Данная формулировка дает заказчику неограниченное право менять ТЗ.`,
      recommendation: 'Заменить на: «Изменения возможны только при согласовании сторон дополнительным соглашением с корректировкой стоимости и сроков»'
    },
    {
      level: 'high',
      title: 'Неограниченная ответственность исполнителя',
      clause: '8.1',
      text: '«Исполнитель несет ответственность за все убытки Заказчика»',
      article: 'Ст. 15, 393 ГК РФ',
      description: 'Отсутствие ограничения ответственности может привести к требованиям о возмещении недополученной прибыли, косвенных убытков.',
      recommendation: 'Добавить: «Ответственность Исполнителя ограничена размером оплаты по настоящему договору»'
    },
    {
      level: 'medium',
      title: 'Несоразмерная неустойка',
      clause: '6.1',
      text: '«Неустойка 1% за каждый день просрочки»',
      article: 'Ст. 333 ГК РФ',
      description: '365% годовых значительно превышает ключевую ставку ЦБ. Суд снизит неустойку, но процесс займет время.',
      recommendation: 'Установить 0,1% (36,5% годовых) или фиксированную сумму за день просрочки'
    }
  ];

  // Adjust based on role
  if (userRole === 'customer') {
    risks[0].description = 'Как заказчик, вы можете потерять гибкость в управлении проектом.';
    risks[1].description = 'Хотя это защищает ваши интересы, чрезмерная ответственность может отпугнуть исполнителей.';
  }

  return {
    risks,
    summary: {
      highRisks: risks.filter(r => r.level === 'high').length,
      mediumRisks: risks.filter(r => r.level === 'medium').length,
      lowRisks: 0,
      totalScore: 35
    },
    recommendations: [
      'Внесите правки в критические пункты',
      'Согласуйте сроки и порядок изменений',
      'Установите разумные лимиты ответственности'
    ]
  };
}
