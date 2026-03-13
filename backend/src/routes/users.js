import express from 'express';
import { protect } from '../middleware/supabaseAuth.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();
router.use(protect);

// Get dashboard stats
router.get('/stats', asyncHandler(async (req, res) => {
  const Contract = (await import('../models/Contract.js')).default;
  const ChatAnalysis = (await import('../models/ChatAnalysis.js')).default;

  const contractsCount = await Contract.countDocuments({ user: req.user.id });
  const chatCount = await ChatAnalysis.countDocuments({ user: req.user.id });
  
  const recentContracts = await Contract.find({ user: req.user.id })
    .select('originalName status analysis.summary createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      contractsAnalyzed: contractsCount,
      chatsAnalyzed: chatCount,
      remainingAnalysis: req.user.subscription.maxAnalysis - req.user.subscription.analysisCount,
      subscription: req.user.subscription.type
    },
    recentActivity: recentContracts
  });
}));

export default router;
