import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Kimi API (Moonshot AI) - compatible with OpenAI SDK
const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY,
  baseURL: 'https://api.moonshot.cn/v1',
});

/**
 * Analyze contract text using Kimi AI
 * @param {string} contractText - Extracted contract text
 * @param {string} contractType - Type of contract (podryad, services, supply, etc.)
 * @param {string} userRole - User's role (executor, customer)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeContractWithAI(contractText, contractType, userRole) {
  if (!process.env.KIMI_API_KEY) {
    throw new Error('KIMI_API_KEY is not configured');
  }

  const prompt = buildAnalysisPrompt(contractText, contractType, userRole);

  try {
    const response = await kimi.chat.completions.create({
      model: 'moonshot-v1-128k', // Kimi model with 128k context
      messages: [
        {
          role: 'system',
          content: `Вы - эксперт по юридическому анализу договоров. Ваша задача - проанализировать договор и выявить риски, которые могут быть невыгодны для указанной стороны. Отвечайте ТОЛЬКО в формате JSON без Markdown форматирования.`
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
    
    // Validate and normalize response
    return normalizeAnalysis(analysis);
    
  } catch (error) {
    console.error('Kimi API analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

function buildAnalysisPrompt(contractText, contractType, userRole) {
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

  return `
Проанализируй следующий ${typeLabel} с позиции ${roleLabel}.

ТЕКСТ ДОГОВОРА:
---
${contractText.slice(0, 50000)}
---

ЗАДАЧА:
Выяви риски и проблемные пункты, которые могут быть невыгодны для ${roleLabel}. Для каждого риска укажи:
1. Уровень риска: high (высокий - критичные проблемы), medium (средний - требуют внимания), low (низкий - замечания)
2. Заголовок - краткое название проблемы
3. Текст - цитата из договора (точная формулировка)
4. Статья ГК РФ или другой закон
5. Описание - почему это проблема для ${roleLabel}
6. Рекомендация - как исправить

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
 * Fallback mock analysis for testing without Kimi API
 */
export function getMockAnalysis(contractType, userRole) {
  const risks = [
    {
      level: 'high',
      title: 'Одностороннее изменение объема работ',
      text: '«Заказчик вправе в одностороннем порядке изменить объем работ»',
      article: 'Ст. 310 ГК РФ',
      description: `Изменение договора возможно только по соглашению сторон. Данная формулировка дает заказчику неограниченное право менять ТЗ.`,
      recommendation: 'Заменить на: «Изменения возможны только при согласовании сторон дополнительным соглашением с корректировкой стоимости и сроков»'
    },
    {
      level: 'high',
      title: 'Неограниченная ответственность исполнителя',
      text: '«Исполнитель несет ответственность за все убытки Заказчика»',
      article: 'Ст. 15, 393 ГК РФ',
      description: 'Отсутствие ограничения ответственности может привести к требованиям о возмещении недополученной прибыли, косвенных убытков.',
      recommendation: 'Добавить: «Ответственность Исполнителя ограничена размером оплаты по настоящему договору»'
    },
    {
      level: 'medium',
      title: 'Несоразмерная неустойка',
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
