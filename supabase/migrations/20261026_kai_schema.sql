-- ====================================================================
-- PROJECT KAI — SUPABASE DATABASE MIGRATION WITH ROW LEVEL SECURITY
-- ====================================================================
-- Non-destructive schema: creates tables, indexes, triggers, storage bucket,
-- and strict Row Level Security (RLS) policies for complete multi-tenant isolation.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT DEFAULT 'Learner',
    jlpt_target TEXT DEFAULT 'N5',
    daily_goal_minutes INT DEFAULT 20,
    display_mode TEXT DEFAULT 'bilingual',
    romaji_enabled BOOLEAN DEFAULT true,
    furigana_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own profile" ON public.profiles;
CREATE POLICY "Users can only access their own profile"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Trigger to auto-create user profile upon Supabase signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Sensei Apprentice')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. FSRS Spaced Repetition Cards Table
CREATE TABLE IF NOT EXISTS public.fsrs_cards (
    card_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    state INT DEFAULT 0, -- 0: New, 1: Learning, 2: Review, 3: Relearning
    due TIMESTAMPTZ NOT NULL,
    stability FLOAT DEFAULT 0,
    difficulty FLOAT DEFAULT 0,
    elapsed_days FLOAT DEFAULT 0,
    scheduled_days INT DEFAULT 0,
    reps INT DEFAULT 0,
    lapses INT DEFAULT 0,
    last_review TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fsrs_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own FSRS cards" ON public.fsrs_cards;
CREATE POLICY "Users can only access their own FSRS cards"
    ON public.fsrs_cards
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_fsrs_user_due ON public.fsrs_cards(user_id, due);

-- 3. Learning Attempts (Evidence Logs)
CREATE TABLE IF NOT EXISTS public.learning_attempts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    skill TEXT NOT NULL,
    question_type TEXT NOT NULL,
    user_response TEXT NOT NULL,
    expected_response TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    error_category TEXT,
    response_time_ms INT,
    hint_used BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.learning_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own learning attempts" ON public.learning_attempts;
CREATE POLICY "Users can only access their own learning attempts"
    ON public.learning_attempts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_attempts_user_time ON public.learning_attempts(user_id, timestamp DESC);

-- 4. Mistake Notebook Records
CREATE TABLE IF NOT EXISTS public.mistake_records (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    mistaken_input TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    error_category TEXT NOT NULL,
    notes_en TEXT,
    notes_te TEXT,
    frequency INT DEFAULT 1,
    first_occurred TIMESTAMPTZ DEFAULT NOW(),
    last_occurred TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false
);

ALTER TABLE public.mistake_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own mistake records" ON public.mistake_records;
CREATE POLICY "Users can only access their own mistake records"
    ON public.mistake_records
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Private Storage Bucket for Handwriting & Audio Evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('kai-private-evidence', 'kai-private-evidence', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can only upload evidence to their own folder" ON storage.objects;
CREATE POLICY "Users can only upload evidence to their own folder"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'kai-private-evidence' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can only view their own evidence files" ON storage.objects;
CREATE POLICY "Users can only view their own evidence files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'kai-private-evidence' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can only delete their own evidence files" ON storage.objects;
CREATE POLICY "Users can only delete their own evidence files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'kai-private-evidence' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
