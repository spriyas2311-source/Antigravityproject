import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================
export const SoilTypeEnum = z.enum([
  'ALLUVIAL',
  'BLACK_COTTON_REGUR',
  'RED_SANDY_LOAM',
  'LATERITIC',
  'COASTAL_SALINE',
  'DESERT_ARID'
]);
export type SoilType = z.infer<typeof SoilTypeEnum>;

export const IrrigationTypeEnum = z.enum([
  'DRIP',
  'SPRINKLER',
  'BOREWELL_FLOOD',
  'CANAL_IRRIGATION',
  'RAINFED'
]);
export type IrrigationType = z.infer<typeof IrrigationTypeEnum>;

export const SeasonEnum = z.enum(['KHARIF', 'RABI', 'ZAID', 'PERENNIAL']);
export type Season = z.infer<typeof SeasonEnum>;

export const CropStageEnum = z.enum([
  'SEEDLING_GERMINATION',
  'VEGETATIVE_TILLERING',
  'FLOWERING_REPRODUCTIVE',
  'FRUIT_SET_GRAIN_FILLING',
  'MATURITY_HARVEST'
]);
export type CropStage = z.infer<typeof CropStageEnum>;

export const SeverityLevelEnum = z.enum(['LOW', 'MODERATE', 'SEVERE', 'CRITICAL']);
export type SeverityLevel = z.infer<typeof SeverityLevelEnum>;

export const AdvisoryTypeEnum = z.enum([
  'CROP_RECOMMENDATION',
  'SOIL_HEALTH',
  'FERTIGATION',
  'DISEASE_DIAGNOSIS',
  'CHAT_CONSULTATION'
]);
export type AdvisoryType = z.infer<typeof AdvisoryTypeEnum>;

export const SupportedLanguageEnum = z.enum(['en', 'kn', 'hi']);
export type SupportedLanguage = z.infer<typeof SupportedLanguageEnum>;

// ============================================================================
// FORM INPUT SCHEMAS
// ============================================================================

// 1. Profile Sync Schema
export const ProfileSyncSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone_number: z.string().optional(),
  preferred_language: SupportedLanguageEnum.default('en'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  taluk: z.string().optional(),
  village: z.string().optional()
});
export type ProfileSyncInput = z.infer<typeof ProfileSyncSchema>;

// 2. Farm Registration Schema
export const FarmInputSchema = z.object({
  farm_name: z.string().min(2, 'Farm name must be at least 2 characters'),
  total_area_acres: z.coerce.number().positive('Total area must be greater than zero'),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  primary_soil_type: SoilTypeEnum,
  primary_irrigation: IrrigationTypeEnum,
  notes: z.string().max(500).optional()
});
export type FarmInput = z.infer<typeof FarmInputSchema>;

// 3. Soil Test Entry Schema
export const SoilTestInputSchema = z.object({
  farm_id: z.string().uuid('Valid farm selection is required'),
  test_date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid test date' }),
  ph: z.coerce.number().min(3.0, 'pH must be >= 3.0').max(12.0, 'pH must be <= 12.0'),
  ec_ds_m: z.coerce.number().min(0, 'EC must be non-negative').max(25.0),
  organic_carbon_pct: z.coerce.number().min(0, 'OC% must be non-negative').max(10.0),
  nitrogen_kg_ha: z.coerce.number().min(0, 'Nitrogen must be non-negative').max(1500),
  phosphorus_kg_ha: z.coerce.number().min(0, 'Phosphorus must be non-negative').max(500),
  potassium_kg_ha: z.coerce.number().min(0, 'Potassium must be non-negative').max(2000),
  zinc_ppm: z.coerce.number().min(0).max(100).optional(),
  iron_ppm: z.coerce.number().min(0).max(200).optional(),
  lab_name: z.string().max(150).optional()
});
export type SoilTestInput = z.infer<typeof SoilTestInputSchema>;

// 4. Crop Recommendation Request Schema
export const CropRecommendationRequestSchema = z.object({
  farm_id: z.string().uuid().optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  taluk: z.string().optional(),
  land_area_acres: z.coerce.number().positive('Land area must be greater than zero'),
  soil_type: SoilTypeEnum,
  ph: z.coerce.number().min(3.0).max(12.0).optional(),
  nitrogen: z.coerce.number().min(0).max(1500).optional(),
  phosphorus: z.coerce.number().min(0).max(500).optional(),
  potassium: z.coerce.number().min(0).max(2000).optional(),
  irrigation_type: IrrigationTypeEnum,
  season: SeasonEnum,
  previous_crop: z.string().max(100).optional(),
  farming_objective: z.string().max(200).optional(),
  language: SupportedLanguageEnum.default('en')
});
export type CropRecommendationRequest = z.infer<typeof CropRecommendationRequestSchema>;

// 5. Soil Analysis Request Schema
export const SoilAnalysisRequestSchema = z.object({
  farm_id: z.string().uuid().optional(),
  soil_type: SoilTypeEnum,
  ph: z.coerce.number().min(3.0).max(12.0),
  ec_ds_m: z.coerce.number().min(0).max(25.0).optional(),
  organic_carbon_pct: z.coerce.number().min(0).max(10.0).optional(),
  nitrogen_kg_ha: z.coerce.number().min(0).max(1500).optional(),
  phosphorus_kg_ha: z.coerce.number().min(0).max(500).optional(),
  potassium_kg_ha: z.coerce.number().min(0).max(2000).optional(),
  language: SupportedLanguageEnum.default('en')
});
export type SoilAnalysisRequest = z.infer<typeof SoilAnalysisRequestSchema>;

// 6. Fertigation Advisory Request Schema
export const FertigationRequestSchema = z.object({
  farm_id: z.string().uuid().optional(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: CropStageEnum,
  acreage: z.coerce.number().positive('Acreage must be > 0'),
  soil_type: SoilTypeEnum,
  irrigation_type: IrrigationTypeEnum,
  recent_rainfall_mm: z.coerce.number().min(0).default(0),
  ambient_temperature_celsius: z.coerce.number().optional(),
  language: SupportedLanguageEnum.default('en')
});
export type FertigationRequest = z.infer<typeof FertigationRequestSchema>;

// 7. Disease Diagnosis Metadata Schema
export const DiseaseDiagnosisFormSchema = z.object({
  farm_id: z.string().uuid().optional(),
  crop_name: z.string().min(2, 'Crop name is required'),
  plant_part: z.enum(['LEAF', 'STEM', 'FRUIT_GRAIN', 'ROOT', 'WHOLE_PLANT']),
  symptom_duration_days: z.coerce.number().int().min(1).max(180),
  observed_spread: z.enum(['ISOLATED_PLANTS', 'SMALL_PATCHES', 'WIDESPREAD_FIELD']),
  recent_weather_context: z.enum(['HEAVY_RAIN', 'HIGH_HUMIDITY', 'HEATWAVE', 'NORMAL']),
  language: SupportedLanguageEnum.default('en')
});
export type DiseaseDiagnosisForm = z.infer<typeof DiseaseDiagnosisFormSchema>;

// 8. Chat Message Request Schema
export const ChatMessageRequestSchema = z.object({
  session_id: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  language: SupportedLanguageEnum.default('en'),
  context_farm_id: z.string().uuid().optional()
});
export type ChatMessageRequest = z.infer<typeof ChatMessageRequestSchema>;
