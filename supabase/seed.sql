-- ============================================================================
-- SUPABASE SEED: seed.sql
-- Reference Data & Trusted Agricultural Sources
-- ============================================================================

INSERT INTO public.advisory_sources (advisory_type, title, organization, source_url, region, published_at, verified_at, is_active)
VALUES
    ('crop', 'Crop Production Guidelines & Package of Practices', 'Indian Council of Agricultural Research (ICAR)', 'https://icar.org.in', 'National / All India', '2025-01-15', NOW(), TRUE),
    ('soil', 'Soil Health Management Standards & NPK Ratings', 'Department of Agriculture & Farmers Welfare, Ministry of Agriculture', 'https://soilhealth.dac.gov.in', 'National', '2024-06-10', NOW(), TRUE),
    ('fertilizer', 'Integrated Nutrient Management in Field Crops', 'University of Agricultural Sciences, Bangalore (UASB)', 'https://uasbangalore.edu.in', 'South India (Karnataka)', '2024-08-20', NOW(), TRUE),
    ('irrigation', 'Water Management & Micro-Irrigation Guidelines', 'National Mission on Micro Irrigation (Pradhan Mantri Krishi Sinchayee Yojana)', 'https://pmksy.gov.in', 'National', '2024-11-01', NOW(), TRUE),
    ('disease', 'Major Insect Pests and Diseases of Field Crops & Their IPM', 'Directorate of Plant Protection, Quarantine & Storage (DPPQ&S)', 'https://ppqs.gov.in', 'National', '2025-02-12', NOW(), TRUE),
    ('weather', 'Agrometeorological Advisory Services (AAS)', 'India Meteorological Department (IMD) - Mausam', 'https://mausam.imd.gov.in', 'National & Agrometeorological Field Units', '2026-01-01', NOW(), TRUE)
ON CONFLICT DO NOTHING;

