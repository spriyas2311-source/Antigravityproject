import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { SoilAnalysisAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function createSoilAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const {
    soilType,
    ph,
    nitrogen,
    phosphorus,
    potassium,
    nutrientUnit,
    organicCarbon,
    electricalConductivity,
    soilTestDate,
    preferredLanguage
  } = req.body;

  const prompt = `
Perform a professional soil health assessment based on the following laboratory soil analysis data:
- Soil Classification: ${soilType}
- Soil Reaction (pH): ${ph}
- Nutrient Measurements (Unit: ${nutrientUnit || 'kg/ha for NPK, % for OC, dS/m for EC'}):
  * Available Nitrogen: ${nitrogen !== undefined ? nitrogen : 'Not provided'}
  * Available Phosphorus: ${phosphorus !== undefined ? phosphorus : 'Not provided'}
  * Available Potassium: ${potassium !== undefined ? potassium : 'Not provided'}
  * Organic Carbon (%): ${organicCarbon !== undefined ? organicCarbon : 'Not provided'}
  * Electrical Conductivity (dS/m): ${electricalConductivity !== undefined ? electricalConductivity : 'Not provided'}
- Date of Soil Sample Test: ${soilTestDate || 'Recent'}

Evaluate the soil condition against standard ICAR (Indian Council of Agricultural Research) ratings.
Highlight any nutrient fixation risks (e.g. Phosphorus fixation if acidic or alkaline), salinity/alkalinity hazards, and recommend practical organic amendments or pH buffers.
Strictly adhere to the required JSON schema format.
`;

  try {
    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: SoilAnalysisAIResponseSchema,
      preferredLanguage: preferredLanguage || 'en'
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('soil_analyses')
      .insert({
        user_id: userId,
        soil_type: soilType,
        ph,
        nitrogen,
        phosphorus,
        potassium,
        nutrient_unit: nutrientUnit,
        organic_carbon: organicCarbon,
        electrical_conductivity: electricalConductivity,
        soil_test_date: soilTestDate,
        ai_result: aiResult
      })
      .select()
      .single();

    if (error) {
      console.error('[DB SAVE WARNING]: Failed to persist soil analysis:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Soil analysis completed successfully',
      data: data || { ai_result: aiResult }
    });
  } catch (err: any) {
    console.error('[SOIL ADVISORY ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate soil analysis',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getSoilAnalyses(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('soil_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve soil analyses',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

export async function getSoilAnalysisById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('soil_analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    res.status(404).json({
      success: false,
      message: 'Soil analysis report not found',
      error: { code: 'NOT_FOUND' }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
}

