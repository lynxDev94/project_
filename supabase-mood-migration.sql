-- =====================================================
-- Mood Entries Migration
-- =====================================================
-- Run this in Supabase SQL Editor to add the mood_entries table.
-- One mood score (1-100) per user per day.
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 100),
    entry_date DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created
ON public.mood_entries (user_id, created_at DESC);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mood entries" ON public.mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON public.mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON public.mood_entries
    FOR UPDATE USING (auth.uid() = user_id);
