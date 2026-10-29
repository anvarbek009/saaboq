-- ====================================================================
-- Saaboq Database Schema (Supabase PostgreSQL)
-- Distraction-Free Educational Video Platform
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
-- Linked to auth.users if Supabase Auth is enabled
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  expertise TEXT[], -- e.g. ["Distributed Systems", "Database Internals", "Compilers"]
  is_creator BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'creator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. Courses / Playlists Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL, -- e.g. 'Computer Science', 'Artificial Intelligence', 'Systems'
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_creator ON public.courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);

-- 4. Videos / Lessons Table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  views_count BIGINT DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  category TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'draft')),
  lesson_order INTEGER DEFAULT 1,
  resources JSONB DEFAULT '[]'::jsonb, -- e.g. [{"title": "Raft Consensus Whitepaper", "url": "https://..."}]
  chapters JSONB DEFAULT '[]'::jsonb,  -- e.g. [{"timestamp": 0, "title": "Overview"}, {"timestamp": 240, "title": "Leader Election"}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_creator ON public.videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_course ON public.videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility ON public.videos(visibility);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_views ON public.videos(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_videos_created ON public.videos(created_at DESC);

-- Full-text search index on video title & description
CREATE INDEX IF NOT EXISTS idx_videos_fts ON public.videos USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  subscriber_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (subscriber_id, creator_id),
  CONSTRAINT no_self_subscribe CHECK (subscriber_id != creator_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON public.subscriptions(creator_id);

-- 6. Video Likes Table
CREATE TABLE IF NOT EXISTS public.video_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_video ON public.video_likes(video_id);

-- 7. Saved Videos (Bookmarks / Watch Later)
CREATE TABLE IF NOT EXISTS public.saved_videos (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_videos_user ON public.saved_videos(user_id);

-- 8. Watch History & Progress Tracking
CREATE TABLE IF NOT EXISTS public.watch_history (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_history_user_updated ON public.watch_history(user_id, updated_at DESC);

-- 9. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_video ON public.comments(video_id);

-- 10. Reports Table (Content Moderation Queue)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'comment', 'course')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read; Only user can update own profile
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses: Anyone can view; Creator can insert/update/delete
CREATE POLICY "Public courses are viewable by everyone" 
  ON public.courses FOR SELECT USING (true);

CREATE POLICY "Creators can insert courses" 
  ON public.courses FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own courses" 
  ON public.courses FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own courses" 
  ON public.courses FOR DELETE USING (auth.uid() = creator_id);

-- Videos: Public can view public videos; Creator can view own drafts
CREATE POLICY "Public videos are viewable by everyone" 
  ON public.videos FOR SELECT USING (
    visibility = 'public' OR auth.uid() = creator_id
  );

CREATE POLICY "Creators can insert videos" 
  ON public.videos FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own videos" 
  ON public.videos FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own videos" 
  ON public.videos FOR DELETE USING (auth.uid() = creator_id);

-- Subscriptions: User can read own and creators' counts, insert/delete own
CREATE POLICY "Anyone can view subscriptions" 
  ON public.subscriptions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can subscribe" 
  ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can unsubscribe" 
  ON public.subscriptions FOR DELETE USING (auth.uid() = subscriber_id);

-- Likes: Anyone can view count; User can like/unlike own
CREATE POLICY "Anyone can view likes" 
  ON public.video_likes FOR SELECT USING (true);

CREATE POLICY "Users can like videos" 
  ON public.video_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike videos" 
  ON public.video_likes FOR DELETE USING (auth.uid() = user_id);

-- Saved Videos: User can only see/modify their own
CREATE POLICY "Users can view own saved videos" 
  ON public.saved_videos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save videos" 
  ON public.saved_videos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved videos" 
  ON public.saved_videos FOR DELETE USING (auth.uid() = user_id);

-- Watch History: User can only see/modify their own
CREATE POLICY "Users can view own watch history" 
  ON public.watch_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can record watch history" 
  ON public.watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history" 
  ON public.watch_history FOR UPDATE USING (auth.uid() = user_id);

-- Comments: Everyone can read; Users can insert/update/delete own
CREATE POLICY "Anyone can view comments" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Reports: Authenticated can insert; Admins can view/update
CREATE POLICY "Users can submit reports" 
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports" 
  ON public.reports FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update reports" 
  ON public.reports FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
