export type UserRole = 'viewer' | 'creator' | 'admin';
export type VideoVisibility = 'public' | 'unlisted' | 'draft';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  expertise: string[];
  is_creator: boolean;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  creator_id: string;
  creator?: UserProfile;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  category: string;
  difficulty: DifficultyLevel;
  total_lessons: number;
  created_at: string;
}

export interface VideoChapter {
  timestamp: number; // in seconds
  title: string;
}

export interface VideoResource {
  title: string;
  url: string;
  type?: 'pdf' | 'code' | 'paper' | 'link';
}

export interface Video {
  id: string;
  creator_id: string;
  creator?: UserProfile;
  course_id?: string;
  course?: Course;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  views_count: number;
  likes_count: number;
  category: string;
  language: string;
  difficulty: DifficultyLevel;
  visibility: VideoVisibility;
  lesson_order?: number;
  resources?: VideoResource[];
  chapters?: VideoChapter[];
  created_at: string;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  user?: UserProfile;
  content: string;
  parent_id?: string;
  created_at: string;
}

export interface WatchProgress {
  user_id: string;
  video_id: string;
  progress_seconds: number;
  completed: boolean;
  updated_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  content_type: 'video' | 'comment' | 'course';
  content_id: string;
  content_title?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolution_notes?: string;
  created_at: string;
}
