-- ============================================================================
-- KRISHI MITRA AI - COMPLETE PRODUCTION DATABASE MIGRATION SCRIPT
-- PostgreSQL 15+ / Supabase Schema with PostGIS & Row Level Security (RLS)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'extension_officer', 'agronomist', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE soil_type_enum AS ENUM (
        'ALLUVIAL', 
        'BLACK_COTTON_REGUR', 
        'RED_SANDY_LOAM', 
        'LATERITIC', 
        'COASTAL_SALINE', 
        'DESERT_ARID'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE irrigation_type_enum AS ENUM (
        'DRIP', 
        'SPRINKLER', 
        'BOREWELL_FLOOD', 
        'CANAL_IRRIGATION', 
        'RAINFED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE season_enum AS ENUM ('KHARIF', 'RABI', 'ZAID', 'PERENNIAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_stage_enum AS ENUM (
        'SEEDLING_GERMINATION', 
        'VEGETATIVE_TILLERING', 
        'FLOWERING_REPRODUCTIVE', 
        'FRUIT_SET_GRAIN_FILLING', 
        'MATURITY_HARVEST'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level_enum AS ENUM ('LOW', 'MODERATE', 'SEVERE', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE advisory_type_enum AS ENUM (
        'CROP_RECOMMENDATION', 
        'SOIL_HEALTH', 
        'FERTIGATION', 
        'DISEASE_DIAGNOSIS', 
        'CHAT_CONSULTATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. PROFILES (Tied to Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'hi')),
    state TEXT NOT NULL DEFAULT 'Karnataka',
    district TEXT NOT NULL,
    taluk TEXT,
    village TEXT,
    role user_role NOT NULL DEFAULT 'farmer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 4. FARMS (Holdings / Land parcels)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    total_area_acres NUMERIC(6, 2) NOT NULL CHECK (total_area_acres > 0),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    primary_soil_type soil_type_enum NOT NULL,
    primary_irrigation irrigation_type_enum NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 5. SOIL TESTS (Historical laboratory records)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.soil_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ph NUMERIC(3, 1) NOT NULL CHECK (ph BETWEEN 3.0 AND 12.0),
    ec_ds_m NUMERIC(4, 2) NOT NULL CHECK (ec_ds_m >= 0),
    organic_carbon_pct NUMERIC(4, 2) NOT NULL CHECK (organic_carbon_pct >= 0 AND organic_carbon_pct <= 10.0),
    nitrogen_kg_ha NUMERIC(6, 2) NOT NULL CHECK (nitrogen_kg_ha >= 0),
    phosphorus_kg_ha NUMERIC(6, 2) NOT NULL CHECK (phosphorus_kg_ha >= 0),
    potassium_kg_ha NUMERIC(6, 2) NOT NULL CHECK (potassium_kg_ha >= 0),
    zinc_ppm NUMERIC(5, 2) CHECK (zinc_ppm >= 0),
    iron_ppm NUMERIC(5, 2) CHECK (iron_ppm >= 0),
    lab_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 6. FIELD CYCLES (Active planting batches)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.field_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    season season_enum NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    current_stage crop_stage_enum NOT NULL DEFAULT 'SEEDLING_GERMINATION',
    allocated_acres NUMERIC(6, 2) NOT NULL CHECK (allocated_acres > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 7. ADVISORY REPORTS (Unified historical audit vault)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.advisory_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    field_cycle_id UUID REFERENCES public.field_cycles(id) ON DELETE SET NULL,
    advisory_type advisory_type_enum NOT NULL,
    title TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    input_snapshot JSONB NOT NULL,
    recommendations_payload JSONB NOT NULL,
    vernacular_summary TEXT,
    audio_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 8. DISEASE DIAGNOSES (Multimodal pathology scans)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.disease_diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    plant_part TEXT NOT NULL,
    diagnosed_disease TEXT NOT NULL,
    pathogen_type TEXT NOT NULL,
    scientific_name TEXT,
    severity severity_level_enum NOT NULL,
    confidence_pct NUMERIC(5, 2) NOT NULL,
    diagnostic_symptoms TEXT[] NOT NULL,
    cultural_remedies TEXT[] NOT NULL,
    biological_remedies TEXT[] NOT NULL,
    chemical_remedies JSONB NOT NULL,
    vernacular_audio_script TEXT,
    is_plant_tissue_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 9. CHAT SESSIONS & MESSAGES (Krishi Mitra Assistant)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Farming Consultation',
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 10. INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_tests_farm ON public.soil_tests(farm_id);
CREATE INDEX IF NOT EXISTS idx_field_cycles_farm ON public.field_cycles(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_user ON public.advisory_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_type ON public.advisory_reports(advisory_type);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user ON public.disease_diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);

-- ============================================================================
-- 11. AUTOMATIC TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_farms_updated_at ON public.farms;
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_field_cycles_updated_at ON public.field_cycles;
CREATE TRIGGER update_field_cycles_updated_at BEFORE UPDATE ON public.field_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Farms Policies
DROP POLICY IF EXISTS "Users can view own farms" ON public.farms;
CREATE POLICY "Users can view own farms" ON public.farms FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own farms" ON public.farms;
CREATE POLICY "Users can insert own farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own farms" ON public.farms;
CREATE POLICY "Users can update own farms" ON public.farms FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own farms" ON public.farms;
CREATE POLICY "Users can delete own farms" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Soil Tests Policies
DROP POLICY IF EXISTS "Users can view own soil tests" ON public.soil_tests;
CREATE POLICY "Users can view own soil tests" ON public.soil_tests FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = soil_tests.farm_id AND farms.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own soil tests" ON public.soil_tests;
CREATE POLICY "Users can insert own soil tests" ON public.soil_tests FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = soil_tests.farm_id AND farms.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own soil tests" ON public.soil_tests;
CREATE POLICY "Users can update own soil tests" ON public.soil_tests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = soil_tests.farm_id AND farms.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own soil tests" ON public.soil_tests;
CREATE POLICY "Users can delete own soil tests" ON public.soil_tests FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = soil_tests.farm_id AND farms.user_id = auth.uid()));

-- Field Cycles Policies
DROP POLICY IF EXISTS "Users can view own field cycles" ON public.field_cycles;
CREATE POLICY "Users can view own field cycles" ON public.field_cycles FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = field_cycles.farm_id AND farms.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage own field cycles" ON public.field_cycles;
CREATE POLICY "Users can manage own field cycles" ON public.field_cycles FOR ALL 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = field_cycles.farm_id AND farms.user_id = auth.uid()));

-- Advisory Reports Policies
DROP POLICY IF EXISTS "Users can view own advisory reports" ON public.advisory_reports;
CREATE POLICY "Users can view own advisory reports" ON public.advisory_reports FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own advisory reports" ON public.advisory_reports;
CREATE POLICY "Users can insert own advisory reports" ON public.advisory_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own advisory reports" ON public.advisory_reports;
CREATE POLICY "Users can delete own advisory reports" ON public.advisory_reports FOR DELETE USING (auth.uid() = user_id);

-- Disease Diagnoses Policies
DROP POLICY IF EXISTS "Users can view own diagnoses" ON public.disease_diagnoses;
CREATE POLICY "Users can view own diagnoses" ON public.disease_diagnoses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own diagnoses" ON public.disease_diagnoses;
CREATE POLICY "Users can insert own diagnoses" ON public.disease_diagnoses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own diagnoses" ON public.disease_diagnoses;
CREATE POLICY "Users can delete own diagnoses" ON public.disease_diagnoses FOR DELETE USING (auth.uid() = user_id);

-- Chat Sessions & Messages Policies
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view messages of own sessions" ON public.chat_messages;
CREATE POLICY "Users can view messages of own sessions" ON public.chat_messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert messages into own sessions" ON public.chat_messages;
CREATE POLICY "Users can insert messages into own sessions" ON public.chat_messages FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));
