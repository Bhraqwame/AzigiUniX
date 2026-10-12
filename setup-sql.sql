-- AZIGI UNI X - Supabase Database Schema Setup
-- Run this in your Supabase SQL Editor

-- Create videos table (if not exists, for idempotency)
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  duration_sec INTEGER DEFAULT 0,
  live BOOLEAN DEFAULT FALSE,
  views_text TEXT DEFAULT '0 views',
  age_text TEXT DEFAULT 'just now',
  days_ago INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  thumb_url TEXT,
  video_url TEXT NOT NULL,
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Row Level Security (RLS) - recommended for production
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read videos (public read)
DROP POLICY IF EXISTS "Allow public read" ON videos;
CREATE POLICY "Allow public read" ON videos
  FOR SELECT
  USING (true);

-- Profiles are required by Creator Studio to verify admin access.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_profile()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Only trusted admins may publish through Creator Studio.
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON videos;
CREATE POLICY "Allow insert for authenticated users" ON videos
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_profile());

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'client');
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin_profile());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed sample data (optional - remove if you want to start fresh)
INSERT INTO videos (id, title, channel, category, tags, duration_sec, views_text, age_text, days_ago, likes, dislikes, video_url, thumb_url)
VALUES 
  ('v1', 'Global University Campus Tour & Student Life Overview', 'EduNetwork', 'universities', ARRAY['newest', 'campus'], 765, '50K views', '2 days ago', 2, 1204, 31, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://picsum.photos/seed/azigi1/320/180'),
  ('v2', 'Introduction to Data Science & Analytics Lecture Series', 'UniLectures', 'universities', ARRAY['trending', 'lecture'], 2720, '15K views', '5 hours ago', 0, 934, 12, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://picsum.photos/seed/azigi3/320/180'),
  ('v3', 'Dance Challenge Compilation: Viral TikTok Moves', 'DanceCraze', 'tiktokers', ARRAY['trending', 'dance', 'newest'], 180, '840K views', '1 day ago', 1, 45210, 892, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://picsum.photos/seed/azigi13/320/180'),
  ('v4', 'Neon Dance Party Live Stream (18+)', 'ClubPulse', 'live-18', ARRAY['trending', 'dance'], 0, '77K watching', 'streaming now', 0, 6654, 130, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://picsum.photos/seed/azigi10/320/180')
ON CONFLICT (id) DO NOTHING;
