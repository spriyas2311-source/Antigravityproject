import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { DiseaseDetectionAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';
import sharp from 'sharp';

export async function createDiseaseAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    res.status(400).json({
      success: false,
      message: 'No image uploaded. Please provide a clear photograph of the affected plant foliage or tissue.',
      error: { code: 'IMAGE_REQUIRED' }
    });
    return;
  }

  const {
    cropName,
    growthStage,
    symptoms,
    affectedPart,
    symptomDurationDays,
    preferredLanguage
  } = req.body;

  try {
    // Sanitize and resize image with Sharp (stripping EXIF metadata for privacy)
    const processedBuffer = await sharp(file.buffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Data = processedBuffer.toString('base64');
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    };

    const prompt = `
Perform a clinical plant pathology and pest identification inspection on this uploaded agricultural image:
- Target Host Crop: ${cropName || 'Unspecified crop'}
- Crop Growth Stage: ${growthStage || 'Unspecified'}
- Affected Plant Organ: ${affectedPart || 'Foliage / Leaf / Stem'}
- Visible Symptoms Described by Farmer: ${symptoms || 'Visual damage visible on foliage'}
- Duration of Symptoms: ${symptomDurationDays ? `${symptomDurationDays} days` : 'Not specified'}

Instructions:
1. Examine visual evidence (lesions, fungal sporulation, chlorosis, insect frass, necrotic spots, vascular wilting).
2. Propose the most probable condition along with confidence level (high | moderate | low) and alternative differential diagnoses.
3. If the photograph is too blurry, dark, or not an agricultural plant, state this clearly and set confidence to low.
4. Provide practical, phased management steps (Cultural/Sanitation, Organic/Bio-control, and safe regulated chemical guidance).
5. ALWAYS state that regulated chemical treatments require local extension officer confirmation and adherence to product label directions.
Strictly adhere to the required JSON schema format.
`;

    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: DiseaseDetectionAIResponseSchema,
      imagePart,
      preferredLanguage: preferredLanguage || 'en'
    });

    // Optionally save image to Supabase Storage if bucket exists
    let storedImagePath: string | null = null;
    try {
      const supabase = getSupabaseAdmin();
      const fileName = `${userId}/${Date.now()}_leaf.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('disease-images')
        .upload(fileName, processedBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (!uploadError && uploadData) {
        storedImagePath = uploadData.path;
      }
    } catch (storageErr: any) {
      // Storage upload failure should not block returning the AI diagnostic result
      console.warn('[STORAGE UPLOAD NOTICE]:', storageErr.message);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('disease_analyses')
      .insert({
        user_id: userId,
        crop_name: cropName || 'General Crop',
        growth_stage: growthStage,
        symptoms: symptoms,
        image_path: storedImagePath || 'processed_in_memory',
        ai_result: aiResult
      })
      .select()
      .single();

    if (error) {
      console.error('[DB SAVE WARNING]: Failed to persist disease analysis:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Disease analysis completed successfully',
      data: data || { ai_result: aiResult }
    });
  } catch (err: any) {
    console.error('[DISEASE DETECTION ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to complete disease analysis',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getDiseaseAnalyses(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('disease_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve disease analyses',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

export async function getDiseaseAnalysisById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('disease_analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    res.status(404).json({
      success: false,
      message: 'Disease report not found',
      error: { code: 'NOT_FOUND' }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
}

