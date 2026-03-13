import express from 'express';
import { 
  uploadContract, 
  getContracts, 
  getContract, 
  deleteContract,
  generateContract,
  getGeneratedContracts,
  getAnalysisStatus,
  downloadAnalysisReport
} from '../controllers/contractController.js';
import { protect } from '../middleware/auth.js';
import { uploadContract as uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadMiddleware.single('file'), uploadContract);
router.get('/', getContracts);
router.get('/generated', getGeneratedContracts);
router.post('/generate', generateContract);
router.get('/:id/status', getAnalysisStatus);
router.get('/:id/report', downloadAnalysisReport);
router.get('/:id', getContract);
router.delete('/:id', deleteContract);

export default router;
