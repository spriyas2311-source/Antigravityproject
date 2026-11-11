-- ============================================================================
-- SUPABASE MIGRATION: 001_initial_schema.sql
-- AI-Powered Agriculture Crop Advisory Assistant
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. REUSABLE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. FARMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'hi')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_farmer_profiles_updated_at ON public.farmer_profiles;
CREATE TRIGGER set_farmer_profiles_updated_at
BEFORE UPDATE ON public.farmer_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.farmer_profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CROP RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location JSONB NOT NULL,
    soil_data JSONB NOT NULL,
    farming_data JSONB NOT NULL,
    ai_result JSONB NOT NULL,
    model_name TEXT,
    prompt_version TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user
ON public.crop_recommendations(user_id, created_at DESC);

-- 5. SOIL ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.soil_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    soil_type TEXT NOT NULL,
    ph NUMERIC(4,2),
    nitrogen NUMERIC,
    phosphorus NUMERIC,
    potassium NUMERIC,
    nutrient_unit TEXT,
    organic_carbon NUMERIC,
    electrical_conductivity NUMERIC,
    soil_test_date DATE,
    ai_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soil_analyses_user
ON public.soil_analyses(user_id, created_at DESC);

-- 6. FERTILIZER ADVISORIES TABLE
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    soil_data JSONB,
    land_area NUMERIC NOT NULL,
    land_unit TEXT NOT NULL,
    previous_fertilizer TEXT,
    ai_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fertilizer_user
ON public.fertilizer_advisories(user_id, created_at DESC);

-- 7. IRRIGATION ADVISORIES TABLE
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    irrigation_method TEXT NOT NULL,
    water_availability TEXT NOT NULL,
    environmental_data JSONB,
    ai_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_irrigation_user
ON public.irrigation_advisories(user_id, created_at DESC);

-- 8. DISEASE ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT,
    symptoms TEXT,
    image_path TEXT,
    ai_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disease_user
ON public.disease_analyses(user_id, created_at DESC);

-- 9. CHAT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Agricultural Consultation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user
ON public.chat_conversations(user_id, updated_at DESC);

DROP TRIGGER IF EXISTS set_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER set_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation
ON public.chat_messages(conversation_id, created_at ASC);

-- 11. ADVISORY SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.advisory_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisory_type TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    source_url TEXT,
    region TEXT,
    published_at DATE,
    verified_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisory_sources_type
ON public.advisory_sources(advisory_type, is_active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_sources ENABLE ROW LEVEL SECURITY;

-- Farmer Profiles Policies
CREATE POLICY "Users can read own profile"
ON public.farmer_profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.farmer_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.farmer_profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON public.farmer_profiles FOR DELETE TO authenticated
USING (auth.uid() = id);

-- Crop Recommendations Policies
CREATE POLICY "Users read own recommendations"
ON public.crop_recommendations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own recommendations"
ON public.crop_recommendations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own recommendations"
ON public.crop_recommendations FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Soil Analyses Policies
CREATE POLICY "Users read own soil analyses"
ON public.soil_analyses FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own soil analyses"
ON public.soil_analyses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own soil analyses"
ON public.soil_analyses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Fertilizer Advisories Policies
CREATE POLICY "Users read own fertilizer advisories"
ON public.fertilizer_advisories FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own fertilizer advisories"
ON public.fertilizer_advisories FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own fertilizer advisories"
ON public.fertilizer_advisories FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Irrigation Advisories Policies
CREATE POLICY "Users read own irrigation advisories"
ON public.irrigation_advisories FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own irrigation advisories"
ON public.irrigation_advisories FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own irrigation advisories"
ON public.irrigation_advisories FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Disease Analyses Policies
CREATE POLICY "Users read own disease analyses"
ON public.disease_analyses FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own disease analyses"
ON public.disease_analyses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own disease analyses"
ON public.disease_analyses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Chat Conversations Policies
CREATE POLICY "Users read own chat conversations"
ON public.chat_conversations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own chat conversations"
ON public.chat_conversations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own chat conversations"
ON public.chat_conversations FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own chat conversations"
ON public.chat_conversations FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users read messages of own conversations"
ON public.chat_messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.chat_conversations 
        WHERE chat_conversations.id = chat_messages.conversation_id 
        AND chat_conversations.user_id = auth.uid()
    )
);

CREATE POLICY "Users create messages in own conversations"
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.chat_conversations 
        WHERE chat_conversations.id = chat_messages.conversation_id 
        AND chat_conversations.user_id = auth.uid()
    )
);

CREATE POLICY "Users delete own chat messages"
ON public.chat_messages FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Advisory Sources Policies (Public/Authenticated Read-only)
CREATE POLICY "Authenticated users read active sources"
ON public.advisory_sources FOR SELECT TO authenticated
USING (is_active = TRUE);

