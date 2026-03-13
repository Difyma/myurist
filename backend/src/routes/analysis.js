import express from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();
router.use(protect);

// Risk calculation
router.post('/risks/calculate', asyncHandler(async (req, res) => {
  const { amount, penaltyRate, days, fine, unilateral } = req.body;

  const penaltySum = amount * (penaltyRate / 100) * days;
  const damages = unilateral ? amount * 0.5 : 0;
  const total = Math.min(penaltySum + fine + damages, amount * 3);
  const annualRate = penaltyRate * 365;

  res.json({
    success: true,
    calculation: {
      penaltySum,
      damages,
      fine: fine || 0,
      total,
      annualRate,
      article333Risk: annualRate > 50
    },
    recommendations: [
      ...(annualRate > 50 ? ['Неустойка может быть снижена судом по ст. 333 ГК РФ'] : []),
      ...(penaltySum > amount ? ['Неустойка превышает сумму договора'] : []),
      'Ограничьте ответственность размером договора'
    ]
  });
}));

// Contract templates
router.get('/templates', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    templates: [
      { id: 'dev', name: 'Разработка ПО/сайта', icon: 'code' },
      { id: 'marketing', name: 'Маркетинговые услуги', icon: 'bullhorn' },
      { id: 'saas', name: 'SaaS/Подписка', icon: 'cloud' },
      { id: 'freelance', name: 'Фриланс/Аутсорс', icon: 'user-tie' },
      { id: 'consulting', name: 'Консалтинг', icon: 'briefcase' }
    ]
  });
}));

export default router;
