import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { CropRecommendationAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';
import { ENV } from '../config/env.js';

export async function createCropRecommendation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const {
    state,
    district,
    village,
    soilType,
    soilPH,
    nitrogen,
    phosphorus,
    potassium,
    nutrientUnit,
    landArea,
    landUnit,
    irrigationAvailability,
    season,
    previousCrop,
    farmingObjective,
    preferredLanguage
  } = req.body;

  const prompt = `
Analyze the following agricultural profile for a farm in India:
- Geographical Location: State: ${state}, District: ${district}, Village: ${village || 'Not specified'}
- Soil Information:
  * Soil Type: ${soilType}
  * Soil pH: ${soilPH}
  * Available Nitrogen: ${nitrogen !== undefined ? `${nitrogen} ${nutrientUnit || 'kg/ha'}` : 'Not measured'}
  * Available Phosphorus: ${phosphorus !== undefined ? `${phosphorus} ${nutrientUnit || 'kg/ha'}` : 'Not measured'}
  * Available Potassium: ${potassium !== undefined ? `${potassium} ${nutrientUnit || 'kg/ha'}` : 'Not measured'}
- Land & Water:
  * Total Area: ${landArea} ${landUnit}
  * Irrigation Availability: ${irrigationAvailability}
- Season & Planning:
  * Current/Target Season: ${season}
  * Previous Crop Harvested: ${previousCrop || 'None reported'}
  * Farming Objective: ${farmingObjective || 'Optimal balanced yield and market profitability'}

Recommend the top 3-4 crops that are agronomically compatible with these specific soil, climate, and water conditions.
Ensure recommendations consider crop rotation benefits (breaking pest cycles from ${previousCrop || 'previous plantings'}).
Strictly adhere to the required JSON schema format.
`;

  try {
    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: CropRecommendationAIResponseSchema,
      preferredLanguage: preferredLanguage || 'en'
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('crop_recommendations')
      .insert({
        user_id: userId,
        location: { state, district, village },
        soil_data: { soilType, soilPH, nitrogen, phosphorus, potassium, nutrientUnit },
        farming_data: { landArea, landUnit, irrigationAvailability, season, previousCrop, farmingObjective },
        ai_result: aiResult,
        model_name: ENV.GEMINI_MODEL,
        prompt_version: 'v1.0-structured'
      })
      .select()
      .single();

    if (error) {
      console.error('[DB SAVE WARNING]: Failed to persist recommendation:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: data || { ai_result: aiResult }
    });
  } catch (err: any) {
    console.error('[CROP ADVISORY ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate crop recommendation',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getCropRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('crop_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve crop recommendations',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

export async function getCropRecommendationById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('crop_recommendations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    res.status(404).json({
      success: false,
      message: 'Crop recommendation not found',
      error: { code: 'NOT_FOUND' }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
}

export async function deleteCropRecommendation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('crop_recommendations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete recommendation',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Crop recommendation deleted successfully'
  });
}

