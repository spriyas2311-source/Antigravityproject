import { z } from 'zod';

// ============================================================================
// 1. CROP RECOMMENDATION RESPONSE SCHEMA
// ============================================================================
export const CropRecommendationItemSchema = z.object({
  crop_name: z.string(),
  suitability_score: z.number().int().min(0).max(100),
  reason: z.string(),
  soil_compatibility: z.string(),
  climate_compatibility: z.string(),
  water_requirements: z.string(),
  growing_season: z.string(),
  estimated_duration: z.string(),
  management_tips: z.array(z.string()),
  potential_risks: z.array(z.string())
});

export const CropRecommendationAIResponseSchema = z.object({
  summary: z.string(),
  overall_confidence: z.enum(['high', 'moderate', 'low']),
  recommendations: z.array(CropRecommendationItemSchema).min(1),
  missing_information: z.array(z.string()).default([]),
  precautions: z.array(z.string()).default([]),
  disclaimer: z.string()
});
export type CropRecommendationAIResponse = z.infer<typeof CropRecommendationAIResponseSchema>;

// ============================================================================
// 2. SOIL ANALYSIS RESPONSE SCHEMA
// ============================================================================
export const SoilAnalysisAIResponseSchema = z.object({
  summary: z.string(),
  soil_condition: z.string(),
  ph_assessment: z.object({
    value: z.number(),
    interpretation: z.string()
  }),
  nutrient_assessment: z.object({
    nitrogen: z.string(),
    phosphorus: z.string(),
    potassium: z.string()
  }),
  potential_issues: z.array(z.string()).default([]),
  improvement_recommendations: z.array(z.string()).default([]),
  suitable_crop_considerations: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  confidence: z.enum(['high', 'moderate', 'low']),
  disclaimer: z.string()
});
export type SoilAnalysisAIResponse = z.infer<typeof SoilAnalysisAIResponseSchema>;

// ============================================================================
// 3. FERTILIZER ADVISORY RESPONSE SCHEMA
// ============================================================================
export const FertilizerCategorySchema = z.object({
  category: z.string(),
  purpose: z.string(),
  timing: z.string(),
  precautions: z.array(z.string()).default([])
});

export const FertilizerAIResponseSchema = z.object({
  summary: z.string(),
  crop_name: z.string(),
  growth_stage: z.string(),
  nutrient_observations: z.array(z.string()).default([]),
  fertilizer_categories: z.array(FertilizerCategorySchema).default([]),
  organic_alternatives: z.array(z.string()).default([]),
  soil_management_tips: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  confidence: z.enum(['high', 'moderate', 'low']),
  safety_warning: z.string()
});
export type FertilizerAIResponse = z.infer<typeof FertilizerAIResponseSchema>;

// ============================================================================
// 4. IRRIGATION ADVISORY RESPONSE SCHEMA
// ============================================================================
export const IrrigationAIResponseSchema = z.object({
  summary: z.string(),
  crop_name: z.string(),
  growth_stage: z.string(),
  water_management_observations: z.array(z.string()).default([]),
  irrigation_recommendations: z.array(z.string()).default([]),
  water_conservation_methods: z.array(z.string()).default([]),
  drainage_considerations: z.array(z.string()).default([]),
  weather_considerations: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  confidence: z.enum(['high', 'moderate', 'low']),
  disclaimer: z.string()
});
export type IrrigationAIResponse = z.infer<typeof IrrigationAIResponseSchema>;

// ============================================================================
// 5. DISEASE DETECTION RESPONSE SCHEMA
// ============================================================================
export const PossibleConditionSchema = z.object({
  condition_name: z.string(),
  confidence: z.enum(['high', 'moderate', 'low']),
  visual_evidence: z.array(z.string()),
  alternative_explanations: z.array(z.string())
});

export const DiseaseDetectionAIResponseSchema = z.object({
  summary: z.string(),
  crop_name: z.string(),
  possible_conditions: z.array(PossibleConditionSchema).default([]),
  observed_symptoms: z.array(z.string()).default([]),
  recommended_next_steps: z.array(z.string()).default([]),
  prevention_measures: z.array(z.string()).default([]),
  professional_assistance_required: z.boolean().default(true),
  additional_information_needed: z.array(z.string()).default([]),
  safety_warning: z.string(),
  disclaimer: z.string()
});
export type DiseaseDetectionAIResponse = z.infer<typeof DiseaseDetectionAIResponseSchema>;

// ============================================================================
// 6. CHATBOT RESPONSE SCHEMA
// ============================================================================
export const ChatbotAIResponseSchema = z.object({
  answer: z.string(),
  category: z.enum(['crop', 'soil', 'fertilizer', 'irrigation', 'disease', 'general']),
  key_points: z.array(z.string()).default([]),
  follow_up_question: z.string().default(''),
  confidence: z.enum(['high', 'moderate', 'low']),
  disclaimer: z.string()
});
export type ChatbotAIResponse = z.infer<typeof ChatbotAIResponseSchema>;

