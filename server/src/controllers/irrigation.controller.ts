import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { IrrigationAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function createIrrigationAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const {
    cropName,
    growthStage,
    soilType,
    irrigationMethod,
    waterAvailability,
    environmentalData,
    preferredLanguage
  } = req.body;

  const prompt = `
Generate a science-backed irrigation management advisory for the following crop situation:
- Crop: ${cropName}
- Phenological Stage: ${growthStage}
- Soil Texture/Type: ${soilType}
- Irrigation Method: ${irrigationMethod}
- Water Availability: ${waterAvailability}
- Ambient / Environmental Data: ${environmentalData ? JSON.stringify(environmentalData) : 'Typical regional conditions'}

Provide guidance on:
- Key water requirements for this growth stage (e.g. flowering/grain filling sensitivity).
- Water stress indicators the farmer should visually check before irrigating.
- Suggested monitoring frequency and water conservation practices.
- Drainage precautions to prevent root asphyxiation / damping-off.
Strictly adhere to the required JSON schema format.
`;

  try {
    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: IrrigationAIResponseSchema,
      preferredLanguage: preferredLanguage || 'en'
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('irrigation_advisories')
      .insert({
        user_id: userId,
        crop_name: cropName,
        growth_stage: growthStage,
        soil_type: soilType,
        irrigation_method: irrigationMethod,
        water_availability: waterAvailability,
        environmental_data: environmentalData || {},
        ai_result: aiResult
      })
      .select()
      .single();

    if (error) {
      console.error('[DB SAVE WARNING]: Failed to persist irrigation advisory:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Irrigation advisory generated successfully',
      data: data || { ai_result: aiResult }
    });
  } catch (err: any) {
    console.error('[IRRIGATION ADVISORY ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate irrigation advisory',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getIrrigationAdvisories(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('irrigation_advisories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve irrigation advisories',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

