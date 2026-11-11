import { Router } from 'express';
import { createIrrigationAdvisory, getIrrigationAdvisories } from '../controllers/irrigation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const irrigationInputSchema = z.object({
  cropName: z.string().min(2),
  growthStage: z.string().min(2),
  soilType: z.string().min(2),
  irrigationMethod: z.string().min(2),
  waterAvailability: z.string().min(2),
  environmentalData: z.record(z.any()).optional(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional()
});

router.post('/', validateBody(irrigationInputSchema), createIrrigationAdvisory);
router.get('/', getIrrigationAdvisories);

export default router;

