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
  views INTEGER NOT NULL DEFAULT 0,
  thumb_url TEXT,
  video_url TEXT NOT NULL,
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

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

-- User interaction data used by favorites, ratings, and playback progress.
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.video_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progress_sec INTEGER NOT NULL DEFAULT 0 CHECK (progress_sec >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.watch_history (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) <= 300),
  author_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON public.watch_history(user_id, watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON public.comments(video_id, created_at);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites" ON public.favorites
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users manage own ratings" ON public.ratings;
CREATE POLICY "Users manage own ratings" ON public.ratings
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users manage own video progress" ON public.video_progress;
CREATE POLICY "Users manage own video progress" ON public.video_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users manage own watch history" ON public.watch_history;
CREATE POLICY "Users manage own watch history" ON public.watch_history
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Comments readable by all" ON public.comments;
CREATE POLICY "Comments readable by all" ON public.comments
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.increment_video_views(video_id_input TEXT)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.videos
  SET views = views + 1
  WHERE id = video_id_input
  RETURNING views;
$$;

REVOKE ALL ON FUNCTION public.increment_video_views(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_video_views(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.rate_video(video_id_input TEXT, rating_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  up_count BIGINT;
  down_count BIGINT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to rate videos';
  END IF;
  IF rating_input IS NULL OR rating_input NOT IN ('up', 'down') THEN
    RAISE EXCEPTION 'Rating must be up or down';
  END IF;

  PERFORM 1 FROM public.videos WHERE id = video_id_input FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Video not found';
  END IF;

  INSERT INTO public.ratings (user_id, video_id, rating)
  VALUES (auth.uid(), video_id_input, rating_input)
  ON CONFLICT (user_id, video_id) DO UPDATE
    SET rating = EXCLUDED.rating, updated_at = NOW();

  SELECT COUNT(*) FILTER (WHERE rating = 'up'),
         COUNT(*) FILTER (WHERE rating = 'down')
  INTO up_count, down_count
  FROM public.ratings
  WHERE video_id = video_id_input;

  UPDATE public.videos
  SET likes = up_count, dislikes = down_count
  WHERE id = video_id_input;

  RETURN jsonb_build_object('likes', up_count, 'dislikes', down_count);
END;
$$;

REVOKE ALL ON FUNCTION public.rate_video(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_video(TEXT, TEXT) TO authenticated;

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
  ('v1', 'Global University Campus Tour & Student Life Overview', 'EduNetwork', 'universities', ARRAY['newest', 'campus'], 765, '50K views', '2 days ago', 2, 1204, 31, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://picsum.photos/seed/azigi1/320/180'),
  ('v2', 'Introduction to Data Science & Analytics Lecture Series', 'UniLectures', 'universities', ARRAY['trending', 'lecture'], 2720, '15K views', '5 hours ago', 0, 934, 12, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://picsum.photos/seed/azigi3/320/180'),
  ('v3', 'Dance Challenge Compilation: Viral TikTok Moves', 'DanceCraze', 'tiktokers', ARRAY['trending', 'dance', 'newest'], 180, '840K views', '1 day ago', 1, 45210, 892, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 'https://picsum.photos/seed/azigi13/320/180'),
  ('v4', 'Neon Dance Party Live Stream (18+)', 'ClubPulse', 'live-18', ARRAY['trending', 'dance'], 0, '77K watching', 'streaming now', 0, 6654, 130, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'https://picsum.photos/seed/azigi10/320/180')
ON CONFLICT (id) DO UPDATE
  SET video_url = EXCLUDED.video_url
  WHERE videos.video_url = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
