import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { FertilizerAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function createFertilizerAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const {
    cropName,
    growthStage,
    soilType,
    soilData,
    landArea,
    landUnit,
    previousFertilizer,
    preferredLanguage
  } = req.body;

  const prompt = `
Generate a contextual fertilizer and nutrient management advisory for the following crop planting:
- Selected Crop: ${cropName}
- Current Growth Stage: ${growthStage}
- Land Area: ${landArea} ${landUnit}
- Soil Type: ${soilType || 'Typical Indian agricultural soil'}
- Soil Test Information: ${soilData ? JSON.stringify(soilData) : 'No recent lab test supplied (provide general stage-wise recommendations)'}
- Previously Applied Fertilizers: ${previousFertilizer || 'None reported'}

Guidelines:
- Provide nutrient requirement assessments and identify potential nutrient gaps for this specific growth stage.
- Suggest suitable fertilizer categories (e.g. Basal vs. Top-dressing, Water-soluble fertigation vs. Soil application, Organic alternatives like FYM/Vermicompost).
- DO NOT prescribe unverified rigid chemical quantities without validated soil tests; state clearly where official KVK/university guidance should be verified.
- Include essential precautions and soil health practices.
Strictly adhere to the required JSON schema format.
`;

  try {
    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: FertilizerAIResponseSchema,
      preferredLanguage: preferredLanguage || 'en'
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('fertilizer_advisories')
      .insert({
        user_id: userId,
        crop_name: cropName,
        growth_stage: growthStage,
        soil_data: soilData || { soilType },
        land_area: landArea,
        land_unit: landUnit,
        previous_fertilizer: previousFertilizer,
        ai_result: aiResult
      })
      .select()
      .single();

    if (error) {
      console.error('[DB SAVE WARNING]: Failed to persist fertilizer advisory:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Fertilizer advisory generated successfully',
      data: data || { ai_result: aiResult }
    });
  } catch (err: any) {
    console.error('[FERTILIZER ADVISORY ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate fertilizer advisory',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getFertilizerAdvisories(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('fertilizer_advisories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve fertilizer advisories',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

