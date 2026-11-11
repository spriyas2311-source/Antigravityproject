import { Router } from 'express';
import {
  createCropRecommendation,
  getCropRecommendations,
  getCropRecommendationById,
  deleteCropRecommendation
} from '../controllers/crop.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const cropInputSchema = z.object({
  state: z.string().min(2),
  district: z.string().min(2),
  village: z.string().optional(),
  soilType: z.string().min(2),
  soilPH: z.coerce.number().min(0).max(14),
  nitrogen: z.coerce.number().optional(),
  phosphorus: z.coerce.number().optional(),
  potassium: z.coerce.number().optional(),
  nutrientUnit: z.string().optional(),
  landArea: z.coerce.number().positive(),
  landUnit: z.enum(['acre', 'hectare']),
  irrigationAvailability: z.enum(['rainfed', 'limited', 'available']),
  season: z.enum(['kharif', 'rabi', 'zaid', 'other']),
  previousCrop: z.string().optional(),
  farmingObjective: z.string().optional(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional()
});

router.post('/', validateBody(cropInputSchema), createCropRecommendation);
router.get('/', getCropRecommendations);
router.get('/:id', getCropRecommendationById);
router.delete('/:id', deleteCropRecommendation);

export default router;

