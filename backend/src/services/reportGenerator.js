import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { Packer } from 'docx';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate DOCX analysis report
 * @param {Object} contract - Contract data with analysis
 * @returns {Promise<Buffer>} DOCX file buffer
 */
export async function generateAnalysisReport(contract) {
  const analysis = contract.analysis;
  const originalName = contract.originalName || 'Договор';
  
  // Group risks by level
  const highRisks = analysis.risks.filter(r => r.level === 'high');
  const mediumRisks = analysis.risks.filter(r => r.level === 'medium');
  const lowRisks = analysis.risks.filter(r => r.level === 'low');

  const children = [
    // Title
    new Paragraph({
      text: 'ЮРИДИЧЕСКИЙ АНАЛИЗ ДОГОВОРА',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    
    // Contract info
    new Paragraph({
      children: [
        new TextRun({ text: 'Наименование документа: ', bold: true }),
        new TextRun(originalName)
      ],
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: 'Дата анализа: ', bold: true }),
        new TextRun(new Date(contract.analyzedAt || contract.updatedAt).toLocaleDateString('ru-RU'))
      ],
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: 'Тип договора: ', bold: true }),
        new TextRun(getContractTypeLabel(contract.contractType))
      ],
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: 'Роль заказчика анализа: ', bold: true }),
        new TextRun(contract.userRole === 'executor' ? 'Исполнитель' : 'Заказчик')
      ],
      spacing: { after: 400 }
    }),
    
    // Summary section
    new Paragraph({
      text: 'СВОДКА ПО РИСКАМ',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `Критических рисков: `, bold: true }),
        new TextRun({ text: `${analysis.summary.highRisks}`, color: 'FF0000' })
      ],
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `Средних рисков: `, bold: true }),
        new TextRun({ text: `${analysis.summary.mediumRisks}`, color: 'FF6600' })
      ],
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `Замечаний: `, bold: true }),
        new TextRun({ text: `${analysis.summary.lowRisks}`, color: '009900' })
      ],
      spacing: { after: 100 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: `Общий балл риска: `, bold: true }),
        new TextRun({ text: `${analysis.summary.totalScore}/100`, bold: true })
      ],
      spacing: { after: 400 }
    }),
  ];

  // High risks section
  if (highRisks.length > 0) {
    children.push(
      new Paragraph({
        text: 'КРИТИЧЕСКИЕ РИСКИ',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    highRisks.forEach((risk, index) => {
      children.push(...createRiskSection(risk, index + 1, 'high'));
    });
  }

  // Medium risks section
  if (mediumRisks.length > 0) {
    children.push(
      new Paragraph({
        text: 'СРЕДНИЕ РИСКИ',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    mediumRisks.forEach((risk, index) => {
      children.push(...createRiskSection(risk, index + 1, 'medium'));
    });
  }

  // Low risks section
  if (lowRisks.length > 0) {
    children.push(
      new Paragraph({
        text: 'ЗАМЕЧАНИЯ',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    lowRisks.forEach((risk, index) => {
      children.push(...createRiskSection(risk, index + 1, 'low'));
    });
  }

  // Recommendations section
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    children.push(
      new Paragraph({
        text: 'ОБЩИЕ РЕКОМЕНДАЦИИ',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    analysis.recommendations.forEach((rec, index) => {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${rec}`,
          spacing: { after: 100 },
          bullet: { level: 0 }
        })
      );
    });
  }

  // Footer
  children.push(
    new Paragraph({
      text: '',
      spacing: { before: 600 }
    }),
    new Paragraph({
      text: 'Документ подготовлен сервисом LegalFlow',
      alignment: AlignmentType.CENTER,
      italics: true,
      color: '666666'
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  return await Packer.toBuffer(doc);
}

function createRiskSection(risk, index, level) {
  const levelLabels = {
    high: 'КРИТИЧЕСКИЙ',
    medium: 'СРЕДНИЙ',
    low: 'НИЗКИЙ'
  };

  const levelColors = {
    high: 'FF0000',
    medium: 'FF6600',
    low: '009900'
  };

  const paragraphs = [];

  // Risk title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${index}. `, bold: true }),
        new TextRun({ text: risk.title, bold: true })
      ],
      spacing: { before: 200, after: 100 },
      border: {
        bottom: {
          color: levelColors[level],
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      }
    })
  );

  // Risk level badge
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Уровень риска: ', bold: true }),
        new TextRun({ text: levelLabels[level], color: levelColors[level], bold: true })
      ],
      spacing: { after: 100 }
    })
  );

  // Clause reference
  if (risk.clause) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Пункт договора: ', bold: true }),
          new TextRun(risk.clause)
        ],
        spacing: { after: 100 }
      })
    );
  }

  // Legal article
  if (risk.article) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Норма права: ', bold: true }),
          new TextRun(risk.article)
        ],
        spacing: { after: 100 }
      })
    );
  }

  // Quote from contract
  if (risk.text) {
    paragraphs.push(
      new Paragraph({
        text: 'Цитата из договора:',
        italics: true,
        spacing: { before: 100, after: 50 }
      }),
      new Paragraph({
        text: `"${risk.text}"`,
        shading: { fill: 'F5F5F5' },
        spacing: { after: 100 },
        indent: { left: 400, right: 400 }
      })
    );
  }

  // Description
  if (risk.description) {
    paragraphs.push(
      new Paragraph({
        text: risk.description,
        spacing: { after: 100 }
      })
    );
  }

  // Recommendation
  if (risk.recommendation) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Рекомендация: ', bold: true, color: '0066CC' })
        ],
        spacing: { before: 100, after: 50 }
      }),
      new Paragraph({
        text: risk.recommendation,
        spacing: { after: 200 },
        shading: { fill: 'E6F3FF' },
        indent: { left: 200 }
      })
    );
  }

  return paragraphs;
}

function getContractTypeLabel(type) {
  const labels = {
    podryad: 'Договор подряда',
    services: 'Договор оказания услуг',
    supply: 'Договор поставки',
    nda: 'NDA (соглашение о конфиденциальности)',
    agency: 'Агентский договор',
    oferta: 'Договор оферты',
    other: 'Прочий договор'
  };
  return labels[type] || labels.other;
}
