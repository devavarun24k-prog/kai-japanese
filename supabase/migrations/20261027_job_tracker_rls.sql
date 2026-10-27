-- supabase/migrations/20261027_job_tracker_rls.sql
-- Migration: Job Tracker Pipeline & Verified Sources Tables with Row Level Security (RLS)
-- NOTE: Run this migration in your Supabase SQL Editor if using authenticated backend sync.

-- 1. Create table for tracked job applications
CREATE TABLE IF NOT EXISTS public.job_applications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for public.job_applications: strictly private to each authenticated user
CREATE POLICY "Users can select own tracked jobs"
    ON public.job_applications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracked jobs"
    ON public.job_applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracked jobs"
    ON public.job_applications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracked jobs"
    ON public.job_applications
    FOR DELETE
    USING (auth.uid() = user_id);

-- 2. Create table for user-curated verified sources
CREATE TABLE IF NOT EXISTS public.job_verified_sources (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.job_verified_sources ENABLE ROW LEVEL SECURITY;

-- Policies for public.job_verified_sources: strictly private to each authenticated user
CREATE POLICY "Users can select own verified sources"
    ON public.job_verified_sources
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verified sources"
    ON public.job_verified_sources
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verified sources"
    ON public.job_verified_sources
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own verified sources"
    ON public.job_verified_sources
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for performant lookups by user_id
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_verified_sources_user ON public.job_verified_sources(user_id);
