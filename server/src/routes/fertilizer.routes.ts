import { Router } from 'express';
import { createFertilizerAdvisory, getFertilizerAdvisories } from '../controllers/fertilizer.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const fertilizerInputSchema = z.object({
  cropName: z.string().min(2),
  growthStage: z.string().min(2),
  soilType: z.string().optional(),
  soilData: z.record(z.any()).optional(),
  landArea: z.coerce.number().positive(),
  landUnit: z.string().min(1),
  previousFertilizer: z.string().optional(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional()
});

router.post('/', validateBody(fertilizerInputSchema), createFertilizerAdvisory);
router.get('/', getFertilizerAdvisories);

export default router;

