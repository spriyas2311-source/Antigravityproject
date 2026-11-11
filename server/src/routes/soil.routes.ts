import { Router } from 'express';
import { createSoilAnalysis, getSoilAnalyses, getSoilAnalysisById } from '../controllers/soil.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const soilInputSchema = z.object({
  soilType: z.string().min(2),
  ph: z.coerce.number().min(0).max(14),
  nitrogen: z.coerce.number().optional(),
  phosphorus: z.coerce.number().optional(),
  potassium: z.coerce.number().optional(),
  nutrientUnit: z.string().optional(),
  organicCarbon: z.coerce.number().optional(),
  electricalConductivity: z.coerce.number().optional(),
  soilTestDate: z.string().optional(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional()
});

router.post('/', validateBody(soilInputSchema), createSoilAnalysis);
router.get('/', getSoilAnalyses);
router.get('/:id', getSoilAnalysisById);

export default router;

