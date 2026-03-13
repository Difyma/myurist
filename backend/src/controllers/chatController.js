import ChatAnalysis from '../models/ChatAnalysis.js';
import { asyncHandler } from '../middleware/error.js';

// Analyze chat
export const analyzeChat = asyncHandler(async (req, res) => {
  const { source, messages } = req.body;

  const chatAnalysis = await ChatAnalysis.create({
    user: req.user.id,
    source,
    messages: messages.map((msg, idx) => ({
      ...msg,
      isSignificant: idx === 2 || idx === 4 || idx === 6 || idx === 10 // Mock significance
    })),
    status: 'analyzing'
  });

  // Trigger async analysis
  analyzeChatAsync(chatAnalysis._id);

  res.status(201).json({
    success: true,
    analysis: {
      id: chatAnalysis._id,
      status: 'analyzing'
    }
  });
});

// Get chat analysis
export const getChatAnalysis = asyncHandler(async (req, res) => {
  const analysis = await ChatAnalysis.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  res.json({
    success: true,
    analysis
  });
});

// Get all chat analyses
export const getChatAnalyses = asyncHandler(async (req, res) => {
  const analyses = await ChatAnalysis.find({ user: req.user.id })
    .select('source status analysis.riskLevel createdAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: analyses.length,
    analyses
  });
});

// Demo chat analysis
export const demoAnalysis = asyncHandler(async (req, res) => {
  const demoMessages = [
    { sender: 'other', text: 'Привет! Готовы начать проект по разработке сайта?', time: '10:05' },
    { sender: 'me', text: 'Да, готов. Стоимость 150 000 ₽, срок 3 недели', time: '10:07' },
    { sender: 'other', text: 'Отлично, договорились. Давай без договора, по-честному', time: '10:08' },
    { sender: 'me', text: 'Хорошо, но предоплату 50% нужно', time: '10:10' },
    { sender: 'other', text: 'Ок, перевожу. Только сделай еще логотип в подарок', time: '10:12' },
    { sender: 'me', text: 'Договорились, логотип бонусом', time: '10:15' },
    { sender: 'other', text: 'И еще нужно подключить оплату на сайте, это ведь входит?', time: '10:20' },
    { sender: 'me', text: 'Это отдельно 20 000 ₽', time: '10:25' },
    { sender: 'other', text: 'Но ты же сказал "полный сайт под ключ"', time: '10:26' },
    { sender: 'me', text: 'Под ключ - это дизайн и верстка. Интеграции отдельно', time: '10:30' },
    { sender: 'other', text: 'Давай так, ты делаешь оплату, а я тебе отличный отзыв напишу', time: '10:32' },
    { sender: 'me', text: 'Ладно, только чтобы больше ничего не добавлялось', time: '10:35' }
  ];

  const demoFindings = [
    {
      type: 'risk',
      level: 'high',
      title: 'Отсутствие письменного договора',
      description: '"Давай без договора, по-честному" — признание устной формы',
      relatedMessages: [2],
      recommendation: 'Оформить письменный договор или акт сдачи-приемки'
    },
    {
      type: 'scope_change',
      level: 'medium',
      title: 'Изменение предмета договора',
      description: 'Добавление логотипа и интеграции выходит за рамки договоренности',
      relatedMessages: [4, 6],
      recommendation: 'Фиксировать объем работ в ТЗ до начала работ'
    },
    {
      type: 'payment_confirmation',
      level: 'low',
      title: 'Подтверждение предоплаты',
      description: 'Согласие на предоплату 50% зафиксировано',
      relatedMessages: [3, 4],
      recommendation: 'Сохранить подтверждения перевода'
    }
  ];

  const analysis = await ChatAnalysis.create({
    user: req.user.id,
    source: 'telegram',
    messages: demoMessages,
    analysis: {
      findings: demoFindings,
      summary: 'Обнаружены риски отсутствия договора и изменения объема работ',
      riskLevel: 'high'
    },
    status: 'completed'
  });

  res.json({
    success: true,
    analysis
  });
});

async function analyzeChatAsync(analysisId) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await ChatAnalysis.findByIdAndUpdate(analysisId, {
      status: 'completed',
      'analysis.summary': 'Анализ завершен',
      'analysis.riskLevel': 'medium'
    });
  } catch (error) {
    console.error('Chat analysis error:', error);
    await ChatAnalysis.findByIdAndUpdate(analysisId, { status: 'failed' });
  }
}
