'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DataStore } from '@/lib/store';
import { Video, Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Flag, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  Code2, 
  Send, 
  Trash2, 
  BookOpen, 
  Play
} from 'lucide-react';
import { VideoCard } from '@/components/video/VideoCard';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const { user, guestActionPrompt } = useAuth();

  const [video, setVideo] = useState<Video | null>(null);
  const [courseLessons, setCourseLessons] = useState<Video[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Interactive state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  
  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate educational content');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Playback & Tracking
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasRecordedViewRef = useRef(false);

  useEffect(() => {
    DataStore.init();
    const v = DataStore.getVideoById(videoId);
    if (!v) {
      return;
    }

    setVideo(v);
    setLikesCount(v.likes_count);

    if (v.course_id) {
      const lessons = DataStore.getCourseLessons(v.course_id);
      setCourseLessons(lessons);
    } else {
      setCourseLessons([]);
    }

    // Related videos from same category or overall
    const all = DataStore.getVideos().filter(item => item.id !== v.id && item.visibility === 'public');
    const sameCat = all.filter(item => item.category === v.category);
    setRelatedVideos(sameCat.length >= 3 ? sameCat.slice(0, 5) : all.slice(0, 5));

    // Comments
    setComments(DataStore.getCommentsForVideo(v.id));

    // User interactions state
    if (user) {
      setIsLiked(DataStore.isVideoLiked(user.id, v.id));
      setIsSaved(DataStore.isSaved(user.id, v.id));
      if (v.creator) {
        setIsSubscribed(DataStore.isSubscribed(user.id, v.creator.id));
      }
    }

    if (v.creator) {
      setSubCount(DataStore.getSubscriberCount(v.creator.id));
    }

    // Record view once per session/visit
    if (!hasRecordedViewRef.current) {
      DataStore.recordView(v.id);
      hasRecordedViewRef.current = true;
    }
  }, [videoId, user]);

  // Handle Video Time Update to track progress
  const handleTimeUpdate = () => {
    if (!videoRef.current || !video || !user) return;
    const currentTime = Math.floor(videoRef.current.currentTime);
    const duration = Math.floor(videoRef.current.duration) || video.duration_seconds;
    const isCompleted = currentTime >= duration * 0.9;
    
    // Save progress periodically (e.g. every 5 seconds)
    if (currentTime % 5 === 0 && currentTime > 0) {
      DataStore.recordProgress(user.id, video.id, currentTime, isCompleted);
    }
  };

  const jumpToChapter = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  // Like / Unlike
  const handleToggleLike = () => {
    if (!user) {
      guestActionPrompt('like this lesson');
      return;
    }
    if (!video) return;
    const res = DataStore.toggleLike(user.id, video.id);
    setIsLiked(res.liked);
    setLikesCount(res.count);
  };

  // Save / Bookmark
  const handleToggleSave = () => {
    if (!user) {
      guestActionPrompt('save this lesson to your library');
      return;
    }
    if (!video) return;
    const saved = DataStore.toggleSave(user.id, video.id);
    setIsSaved(saved);
  };

  // Subscribe
  const handleToggleSubscribe = () => {
    if (!user) {
      guestActionPrompt('subscribe to this educator');
      return;
    }
    if (!video?.creator) return;
    const sub = DataStore.toggleSubscription(user.id, video.creator.id);
    setIsSubscribed(sub);
    setSubCount(prev => sub ? prev + 1 : Math.max(0, prev - 1));
  };

  // Share action
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Post Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      guestActionPrompt('post a comment');
      return;
    }
    if (!newComment.trim() || !video) return;

    const created = DataStore.addComment(video.id, user.id, newComment.trim());
    setComments([created, ...comments]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;
    try {
      DataStore.deleteComment(commentId, user.id);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error deleting comment');
    }
  };

  // Submit report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      guestActionPrompt('report this content');
      return;
    }
    if (!video) return;

    DataStore.submitReport(user.id, 'video', video.id, reportReason);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalOpen(false);
    }, 1500);
  };

  if (!video) {
    return (
      <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-lg mx-auto mt-10">
        <h2 className="text-base font-semibold text-[var(--text-high)]">Lesson Not Found</h2>
        <p className="text-xs text-[var(--text-mid)] mt-1.5">The requested lesson does not exist or has been removed.</p>
        <Link href="/" className="btn-primary text-xs mt-4 inline-flex">
          Return to Feed
        </Link>
      </div>
    );
  }

  // Find previous and next lesson in course if part of course
  const currentLessonIndex = courseLessons.findIndex(l => l.id === video.id);
  const prevLesson = currentLessonIndex > 0 ? courseLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < courseLessons.length - 1 
    ? courseLessons[currentLessonIndex + 1] 
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left/Main Column: Player, Video Info, Chapters, Comments */}
      <div className="lg:col-span-2 space-y-4">
        {/* Responsive Video Player */}
        <div className="relative aspect-video w-full rounded-[8px] overflow-hidden bg-black border border-[var(--border)]">
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url}
            controls
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Course Lesson Order Navigation (if course) */}
        {courseLessons.length > 0 && (
          <div className="flex items-center justify-between bg-[var(--bg-panel)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-medium text-[var(--text-high)] truncate max-w-[280px]">
                {video.course?.title}
              </span>
              <span className="text-[var(--text-low)] font-mono">
                (Lesson {video.lesson_order} of {video.course?.total_lessons})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson ? (
                <Link
                  href={`/watch/${prevLesson.id}`}
                  className="p-1 hover:bg-[var(--bg-elevated)] rounded text-[var(--text-mid)] hover:text-[var(--text-high)] flex items-center gap-1"
                  title={`Previous: ${prevLesson.title}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Link>
              ) : (
                <span className="p-1 opacity-30 text-[var(--text-low)] flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </span>
              )}

              {nextLesson ? (
                <Link
                  href={`/watch/${nextLesson.id}`}
                  className="p-1 hover:bg-[var(--bg-elevated)] rounded text-[var(--accent)] hover:text-white flex items-center gap-1 font-medium"
                  title={`Next: ${nextLesson.title}`}
                >
                  <span className="hidden sm:inline">Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="p-1 opacity-30 text-[var(--text-low)] flex items-center gap-1">
                  <span className="hidden sm:inline">Completed</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Video Title & Primary Metadata */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-[var(--text-high)] leading-snug">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-[var(--border)]">
            {/* Creator info */}
            {video.creator && (
              <div className="flex items-center gap-3">
                <Link href={`/channel/${video.creator.username}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.creator.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={video.creator.display_name}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                  />
                </Link>

                <div>
                  <Link
                    href={`/channel/${video.creator.username}`}
                    className="text-sm font-medium text-[var(--text-high)] hover:text-[var(--accent)] block leading-tight transition-colors"
                  >
                    {video.creator.display_name}
                  </Link>
                  <span className="text-xs text-[var(--text-low)] font-mono">
                    {subCount} scholars
                  </span>
                </div>

                <button
                  onClick={handleToggleSubscribe}
                  className={`ml-2 text-xs px-3 py-1.5 rounded-[6px] font-medium transition-colors ${
                    isSubscribed
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] border border-[var(--border)]'
                      : 'btn-primary'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            )}

            {/* Action Buttons: Like, Save, Share, Report */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleToggleLike}
                className={`btn-secondary text-xs h-8 px-3 ${isLiked ? 'text-[var(--accent)] border-[var(--accent)]' : ''}`}
                title="Like this lesson"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[var(--accent)]' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`btn-secondary text-xs h-8 px-3 ${isSaved ? 'text-[var(--accent)] border-[var(--accent)]' : ''}`}
                title="Save to your bookmarks"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[var(--accent)]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="btn-secondary text-xs h-8 px-3"
                title="Copy share link"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="p-2 text-[var(--text-low)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)] rounded-[6px] transition-colors"
                title="Report content"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Description & Objective Panel */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-mid)] font-mono">
            <span>{video.views_count.toLocaleString()} views</span>
            <span>•</span>
            <span>Published {new Date(video.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-[var(--accent)]">{video.category}</span>
            <span>•</span>
            <span className="text-[var(--text-low)]">{video.difficulty}</span>
          </div>

          <p className="text-sm text-[var(--text-high)] leading-relaxed whitespace-pre-line">
            {video.description}
          </p>

          {/* Chapters & Timestamps */}
          {video.chapters && video.chapters.length > 0 && (
            <div className="pt-3 border-t border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-mid)] mb-2">
                Lesson Chapters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {video.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToChapter(ch.timestamp)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] bg-[var(--bg-elevated)] hover:bg-[var(--steel-600)] text-left text-xs transition-colors group"
                  >
                    <span className="font-mono text-[var(--accent)] group-hover:underline">
                      {formatDuration(ch.timestamp)}
                    </span>
                    <span className="text-[var(--text-high)] truncate">
                      {ch.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attached Verified Resources & Papers */}
          {video.resources && video.resources.length > 0 && (
            <div className="pt-3 border-t border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-mid)] mb-2">
                Verified Resources & Academic References
              </h4>
              <div className="space-y-1.5">
                {video.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--steel-600)] rounded-[6px] text-xs text-[var(--text-high)] transition-colors border border-[var(--border)] group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {res.type === 'code' ? (
                        <Code2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      )}
                      <span className="truncate">{res.title}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[var(--text-low)] group-hover:text-[var(--accent)] shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
              Discussion & Clarifications ({comments.length})
            </h3>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Ask a conceptual question or share an insight..." : "Sign in to post questions or insights..."}
              className="saaboq-input flex-1 h-9"
              disabled={!user}
            />
            <button
              type="submit"
              disabled={!user || !newComment.trim()}
              className="btn-primary text-xs h-9 px-3 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-2">
            {comments.map((comment) => (
              <div 
                key={comment.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-[6px] bg-[var(--bg-elevated)] border border-[var(--border)]"
              >
                <div className="flex items-start gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comment.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={comment.user?.display_name || 'Scholar'}
                    className="w-7 h-7 rounded-full object-cover mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-high)]">
                        {comment.user?.display_name || 'Anonymous Scholar'}
                      </span>
                      <span className="text-[10px] text-[var(--text-low)] font-mono">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-mid)] mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {user && (user.id === comment.user_id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-[var(--text-low)] hover:text-red-400 p-1"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Course Playlist Drawer & Related Educational Lessons */}
      <div className="space-y-6">
        {/* Course Lessons Syllabus Panel */}
        {courseLessons.length > 0 && (
          <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] overflow-hidden">
            <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                Course Track Syllabus
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-high)] truncate mt-0.5">
                {video.course?.title}
              </h3>
              <div className="text-xs text-[var(--text-mid)] mt-1 font-mono">
                {currentLessonIndex + 1} of {courseLessons.length} lessons
              </div>
            </div>

            <div className="divide-y divide-[var(--border)] max-h-[380px] overflow-y-auto">
              {courseLessons.map((lesson, idx) => {
                const isCurrent = lesson.id === video.id;
                return (
                  <Link
                    key={lesson.id}
                    href={`/watch/${lesson.id}`}
                    className={`flex items-center gap-3 p-2.5 transition-colors ${
                      isCurrent 
                        ? 'bg-[var(--bg-elevated)] border-l-2 border-l-[var(--accent)]' 
                        : 'hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <div className="w-5 text-center font-mono text-xs text-[var(--text-low)]">
                      {isCurrent ? (
                        <Play className="w-3.5 h-3.5 text-[var(--accent)] fill-[var(--accent)] mx-auto" />
                      ) : (
                        (idx + 1).toString().padStart(2, '0')
                      )}
                    </div>

                    <div className="relative aspect-video w-20 rounded-[4px] overflow-hidden bg-black shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={lesson.thumbnail_url} 
                        alt={lesson.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium line-clamp-1 ${isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-high)]'}`}>
                        {lesson.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-low)] font-mono mt-0.5">
                        {formatDuration(lesson.duration_seconds)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Educational Lessons */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-mid)] px-1">
            Related Curriculum Lessons
          </h3>

          <div className="space-y-2">
            {relatedVideos.map((rel) => (
              <VideoCard key={rel.id} video={rel} />
            ))}
          </div>
        </div>
      </div>

      {/* Moderation Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5">
            <h3 className="text-base font-semibold text-[var(--text-high)]">Report Content to Platform Admins</h3>
            <p className="text-xs text-[var(--text-mid)] mt-1">
              Help maintain Saaboq as a rigorous, distraction-free educational repository.
            </p>

            {reportSuccess ? (
              <div className="p-3 my-4 bg-green-950/40 border border-green-800 rounded-[6px] text-xs text-green-300 text-center font-mono">
                Report submitted successfully. Administrators will review this case.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 my-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1.5">
                    Reason for report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="saaboq-input w-full"
                  >
                    <option value="Inaccurate educational content">Inaccurate educational content / factual errors</option>
                    <option value="Entertainment / clickbait algorithm violation">Entertainment / clickbait algorithm violation</option>
                    <option value="Copyright or intellectual property infringement">Copyright or IP infringement</option>
                    <option value="Spam or promotional advertising">Spam or promotional advertising</option>
                    <option value="Inappropriate or offensive speech">Inappropriate or offensive speech</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
