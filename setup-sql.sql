-- ZIGI UNI X - Supabase Database Schema Setup
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
CREATE POLICY "Allow public read" ON videos
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert videos (for upload dashboard)
CREATE POLICY "Allow insert for authenticated users" ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed sample data (optional - remove if you want to start fresh)
INSERT INTO videos (id, title, channel, category, tags, duration_sec, views_text, age_text, days_ago, likes, dislikes, video_url, thumb_url)
VALUES 
  ('v1', 'Global University Campus Tour & Student Life Overview', 'EduNetwork', 'universities', ARRAY['newest', 'campus'], 765, '50K views', '2 days ago', 2, 1204, 31, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://picsum.photos/seed/azigi1/320/180'),
  ('v2', 'Introduction to Data Science & Analytics Lecture Series', 'UniLectures', 'universities', ARRAY['trending', 'lecture'], 2720, '15K views', '5 hours ago', 0, 934, 12, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://picsum.photos/seed/azigi3/320/180'),
  ('v3', 'Dance Challenge Compilation: Viral TikTok Moves', 'DanceCraze', 'tiktokers', ARRAY['trending', 'dance', 'newest'], 180, '840K views', '1 day ago', 1, 45210, 892, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://picsum.photos/seed/azigi13/320/180'),
  ('v4', 'Neon Dance Party Live Stream (18+)', 'ClubPulse', 'live-18', ARRAY['trending', 'dance'], 0, '77K watching', 'streaming now', 0, 6654, 130, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'https://picsum.photos/seed/azigi10/320/180')
ON CONFLICT (id) DO NOTHING;
