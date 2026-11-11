import { Router } from 'express';
import {
  createDiseaseAnalysis,
  getDiseaseAnalyses,
  getDiseaseAnalysisById
} from '../controllers/disease.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', uploadImage.single('image'), createDiseaseAnalysis);
router.get('/', getDiseaseAnalyses);
router.get('/:id', getDiseaseAnalysisById);

export default router;

