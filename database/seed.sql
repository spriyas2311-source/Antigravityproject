-- ============================================================================
-- KRISHI MITRA AI - SEED & REFERENCE DATA SCRIPT
-- Contains ICAR standard benchmarks, regional crop data, and sample farm fixtures
-- ============================================================================

-- Reference table for ICAR Soil Health Benchmarks
CREATE TABLE IF NOT EXISTS public.icar_soil_benchmarks (
    parameter_name TEXT PRIMARY KEY,
    unit TEXT NOT NULL,
    very_low_max NUMERIC(8,2),
    low_max NUMERIC(8,2),
    medium_min NUMERIC(8,2),
    medium_max NUMERIC(8,2),
    high_min NUMERIC(8,2),
    description TEXT
);

INSERT INTO public.icar_soil_benchmarks (parameter_name, unit, very_low_max, low_max, medium_min, medium_max, high_min, description)
VALUES 
    ('AVAILABLE_NITROGEN', 'kg/ha', 140.0, 280.0, 280.0, 560.0, 560.0, 'Alkaline permanganate method (Subbiah and Asija)'),
    ('AVAILABLE_PHOSPHORUS', 'kg/ha', 5.0, 10.0, 10.0, 25.0, 25.0, 'Olsen method for neutral/alkaline soils, Bray for acidic'),
    ('AVAILABLE_POTASSIUM', 'kg/ha', 60.0, 110.0, 110.0, 280.0, 280.0, 'Neutral normal ammonium acetate method'),
    ('ORGANIC_CARBON', '%', 0.25, 0.50, 0.50, 0.75, 0.75, 'Walkley and Black rapid titration method'),
    ('ZINC', 'ppm', 0.30, 0.60, 0.60, 1.20, 1.20, 'DTPA extractable Zinc'),
    ('IRON', 'ppm', 2.50, 4.50, 4.50, 9.00, 9.00, 'DTPA extractable Iron')
ON CONFLICT (parameter_name) DO UPDATE SET 
    unit = EXCLUDED.unit,
    medium_min = EXCLUDED.medium_min,
    medium_max = EXCLUDED.medium_max,
    high_min = EXCLUDED.high_min;

-- Demo Reference: Major Indian Agro-Climatic Zones
CREATE TABLE IF NOT EXISTS public.agro_climatic_zones (
    id SERIAL PRIMARY KEY,
    zone_name TEXT NOT NULL,
    states TEXT[] NOT NULL,
    predominant_soils TEXT[] NOT NULL,
    major_crops TEXT[] NOT NULL
);

INSERT INTO public.agro_climatic_zones (zone_name, states, predominant_soils, major_crops)
VALUES
    ('Southern Plateau and Hills (Zone 10)', ARRAY['Karnataka', 'Andhra Pradesh', 'Tamil Nadu'], ARRAY['Red Loamy', 'Black Cotton', 'Lateritic'], ARRAY['Ragi', 'Pigeon Pea', 'Cotton', 'Maize', 'Groundnut', 'Tomato']),
    ('Western Dry Region (Zone 14)', ARRAY['Rajasthan', 'Gujarat'], ARRAY['Desert Soils', 'Grey Brown Alluvial'], ARRAY['Pearl Millet (Bajra)', 'Mustard', 'Cluster Bean (Guar)', 'Cumin']),
    ('Upper Gangetic Plains (Zone 5)', ARRAY['Uttar Pradesh', 'Uttarakhand'], ARRAY['Alluvial (Sandy Loam to Clay)'], ARRAY['Wheat', 'Rice (Paddy)', 'Sugarcane', 'Potato', 'Mustard']),
    ('Central Plateau and Hills (Zone 8)', ARRAY['Madhya Pradesh', 'Maharashtra', 'Chhattisgarh'], ARRAY['Deep Black (Regur)', 'Medium Black', 'Mixed Red and Black'], ARRAY['Soybean', 'Cotton', 'Chickpea', 'Wheat', 'Sorghum (Jowar)'])
ON CONFLICT DO NOTHING;
