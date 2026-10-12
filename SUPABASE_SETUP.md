# Supabase Setup Guide for AZIGI UNI X

This guide will help you connect your video streaming platform to Supabase for database and storage.

## What You'll Need

1. [Supabase account](https://supabase.com/)
2. A Supabase project

## Setup Steps

### 1. Create a Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com/)
2. Click "New Project"
3. Choose your organization, project name, database password, and region
4. Wait for the project to be set up (takes ~2 minutes)

### 2. Get Your Project Credentials
1. Go to Project Settings > API
2. Copy your `Project URL` (looks like `https://xxxxx.supabase.co`)
3. Copy your `anon public` key

### 3. Set Up Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Run the following SQL to create the videos table:

```sql
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Row Level Security (RLS) optional but recommended
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON videos FOR SELECT USING (true);

-- Favorites table (linked to authenticated users)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Ratings table (up/down votes)
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  rating TEXT CHECK (rating IN ('up', 'down')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watch history table
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Profiles table for user roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id, watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable RLS on interaction tables
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/manage their own data; comments are readable by all, writable by authenticated
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own ratings" ON ratings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Comments readable by all" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users manage own history" ON watch_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'client');
-- Use a SECURITY DEFINER helper so the policy does not recursively query profiles under RLS.
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
CREATE POLICY "Allow insert for authenticated users" ON videos
  FOR INSERT TO authenticated WITH CHECK (public.is_admin_profile());
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT TO authenticated USING (public.is_admin_profile());

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Set Up Storage for Videos
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `videos` (make it public if you want direct URLs)
3. Create another bucket called `thumbnails` (public)

### 5. Update Your Project with Credentials

Open `supabase-config.js` and replace the placeholders:
```js
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
```

### 6. Add Supabase Client to Your HTML

Make sure `supabase-config.js` is loaded in your HTML (it should be added already).

### 7. (Optional) Seed Sample Data

You can add sample videos via the Table Editor or run this SQL:

```sql
INSERT INTO videos (id, title, channel, category, tags, duration_sec, views_text, age_text, days_ago, likes, dislikes, video_url, thumb_url)
VALUES 
  ('v1', 'Global University Campus Tour & Student Life Overview', 'EduNetwork', 'universities', ARRAY['newest', 'campus'], 765, '50K views', '2 days ago', 2, 1204, 31, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://picsum.photos/seed/azigi1/320/180')
```

## Notes

- The app now fetches videos from Supabase and falls back to local data if there's an error
- RLS is enabled with public read access - adjust based on your needs
- The upload dashboard is now available in the footer and header (for logged-in users)
- To upload, provide a video URL that you've already stored (e.g., in Supabase Storage, R2, or GCP)
- Sign-in and registration use Supabase Auth; the current user is cached in local storage for the interface.

## Creator Studio Admin Access

Creating the `profiles` table does not create a sign-in account. First create the owner account in Supabase **Authentication → Users → Add user**, or use the site's **Register** form and confirm the email if confirmation is enabled. Set a strong, unique password directly in Supabase or in the site's form; do not put passwords in project files or share them in chat. The signup trigger creates a `client` profile automatically.

If Creator Studio reports `Could not find the table 'public.profiles' in the schema cache`, the project is missing its profiles table. Run the current `setup-sql.sql` in the Supabase SQL Editor (it is safe to rerun), then wait briefly for the API schema cache to refresh and retry. This creates the profile table and signup trigger; it does not set or store an account password.

After creating and confirming the owner account, run the following in the Supabase SQL Editor. Replace `owner@example.com` with the exact email used for that account. The block stops with an error if no matching Auth user exists, and otherwise creates or promotes that user's profile:

```sql
DO $$
DECLARE
  owner_id UUID;
  owner_name TEXT;
BEGIN
  SELECT id, raw_user_meta_data->>'full_name'
  INTO owner_id, owner_name
  FROM auth.users
  WHERE lower(email) = lower('owner@example.com')
  LIMIT 1;

  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'No Supabase Auth user found for owner@example.com';
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (owner_id, owner_name, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END;
$$;
```

Run this only for a trusted owner account. If the account already has an active session, sign out and back in after changing its role.

For an existing project that used the older setup guide, also replace its recursive admin profile policy:

```sql
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

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin_profile());
```

## Video Upload Flow

1. Log in as admin (Gabby)
2. Click "Admin" in the footer or the upload button in the header
3. Fill in the form:
   - Title (required)
   - Channel (required)
   - Category (required)
   - Duration in seconds (optional)
   - Tags (comma-separated)
   - Thumbnail URL (optional)
   - Video URL (required) - the direct URL to the video file
4. Click "Upload Video" - it saves to Supabase database
5. For actual file storage, upload video files to Supabase Storage or external storage (R2, S3, etc.) and paste the URL

**Note:** The upload form currently saves video metadata to the database. Actual video files are NOT uploaded to Supabase Storage by this form - you need to store the video file separately and provide the URL. This keeps uploads fast and avoids large file transfer issues.

Need help with any step? Let me know!