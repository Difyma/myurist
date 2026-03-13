import express from 'express';
import { analyzeChat, getChatAnalysis, getChatAnalyses, demoAnalysis } from '../controllers/chatController.js';
import { protect } from '../middleware/supabaseAuth.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeChat);
router.get('/demo', demoAnalysis);
router.get('/', getChatAnalyses);
router.get('/:id', getChatAnalysis);

export default router;
