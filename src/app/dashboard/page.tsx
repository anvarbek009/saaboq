'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Video, Course } from '@/types';
import { 
  Upload, 
  Trash2, 
  Edit3, 
  Plus, 
  Eye, 
  Users, 
  BookOpen, 
  Video as VideoIcon, 
  Check, 
  AlertTriangle,
  X
} from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subCount, setSubCount] = useState(0);

  // Edit Video Modal state
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVisibility, setEditVisibility] = useState<'public' | 'draft'>('public');

  // Delete confirmation modal state
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // New Course Modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Computer Science');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Profile Edit State
  const [profileDisplayName, setProfileDisplayName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  useEffect(() => {
    DataStore.init();
    if (!loading && !user) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    if (user) {
      const userVideos = DataStore.getVideosByCreator(user.id);
      setVideos(userVideos);

      const userCourses = DataStore.getCourses().filter(c => c.creator_id === user.id);
      setCourses(userCourses);

      setSubCount(DataStore.getSubscriberCount(user.id));

      setProfileDisplayName(user.display_name);
      setProfileBio(user.bio || '');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading Creator Studio...</div>;
  }

  // Calculate real view stats
  const totalViews = videos.reduce((acc, v) => acc + (v.views_count || 0), 0);
  const totalLikes = videos.reduce((acc, v) => acc + (v.likes_count || 0), 0);

  // Save Video Edits
  const handleSaveVideoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    DataStore.updateVideo(editingVideo.id, {
      title: editTitle,
      description: editDescription,
      visibility: editVisibility,
    });

    setVideos(DataStore.getVideosByCreator(user.id));
    setEditingVideo(null);
  };

  // Confirm and Execute Delete
  const handleExecuteDelete = () => {
    if (!deletingVideoId) return;
    try {
      DataStore.deleteVideo(deletingVideoId, user.id);
      setVideos(DataStore.getVideosByCreator(user.id));
      setDeletingVideoId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting video');
    }
  };

  // Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    DataStore.createCourse({
      creator_id: user.id,
      title: newCourseTitle.trim(),
      slug: newCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCourseDesc.trim(),
      thumbnail_url: '/thumbnails/distributed_systems.jpg',
      category: newCourseCategory,
      difficulty: newCourseDifficulty,
    });

    setCourses(DataStore.getCourses().filter(c => c.creator_id === user.id));
    setNewCourseTitle('');
    setNewCourseDesc('');
    setCourseModalOpen(false);
  };

  // Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: profileDisplayName.trim(),
      bio: profileBio.trim(),
      is_creator: true,
      role: 'creator',
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Creator Studio & Content Management
          </h1>
          <p className="text-xs text-[var(--text-mid)] mt-1">
            Manage your educational courses, lessons, and real academic audience analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCourseModalOpen(true)}
            className="btn-secondary text-xs h-9 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Course</span>
          </button>

          <Link
            href="/upload"
            className="btn-primary text-xs h-9 px-3"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Lesson</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-low)] font-mono uppercase">
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Total Views</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-high)] font-mono mt-1">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-[var(--text-low)] mt-0.5">Across all lessons</div>
        </div>

        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-low)] font-mono uppercase">
            <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Scholars / Subs</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-high)] font-mono mt-1">
            {subCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-[var(--text-low)] mt-0.5">Subscribed students</div>
        </div>

        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-low)] font-mono uppercase">
            <VideoIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Published Lessons</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-high)] font-mono mt-1">
            {videos.length}
          </div>
          <div className="text-[10px] text-[var(--text-low)] mt-0.5">Live video modules</div>
        </div>

        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-low)] font-mono uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Structured Tracks</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-high)] font-mono mt-1">
            {courses.length}
          </div>
          <div className="text-[10px] text-[var(--text-low)] mt-0.5">Organized curricula</div>
        </div>
      </div>

      {/* Lessons Table Section */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Your Published Lessons ({videos.length})
          </h2>
          <span className="text-xs text-[var(--text-low)] font-mono">
            Full ownership and deletion control
          </span>
        </div>

        {videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-mid)] font-mono uppercase text-[11px] border-b border-[var(--border)]">
                <tr>
                  <th className="py-2.5 px-4">Lesson Title</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--text-high)] max-w-xs">
                      <div className="truncate">{vid.title}</div>
                      {vid.course && (
                        <div className="text-[11px] text-[var(--text-low)] truncate">
                          Course: {vid.course.title} (Lesson {vid.lesson_order})
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase ${
                        vid.visibility === 'public'
                          ? 'bg-green-950/40 text-green-400 border border-green-800'
                          : 'bg-yellow-950/40 text-yellow-400 border border-yellow-800'
                      }`}>
                        {vid.visibility}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[var(--text-mid)]">{vid.category}</td>
                    <td className="py-3 px-3 font-mono text-[var(--text-mid)]">{formatDuration(vid.duration_seconds)}</td>
                    <td className="py-3 px-3 font-mono text-[var(--text-mid)]">{vid.views_count.toLocaleString()}</td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingVideo(vid);
                          setEditTitle(vid.title);
                          setEditDescription(vid.description);
                          setEditVisibility(vid.visibility as 'public' | 'draft');
                        }}
                        className="p-1.5 text-[var(--text-mid)] hover:text-[var(--accent)] hover:bg-[var(--bg-main)] rounded transition-colors"
                        title="Edit lesson details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingVideoId(vid.id)}
                        className="p-1.5 text-[var(--text-mid)] hover:text-red-400 hover:bg-[var(--bg-main)] rounded transition-colors"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/watch/${vid.id}`}
                        className="p-1.5 text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-main)] rounded inline-block transition-colors"
                        title="Watch lesson"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-mid)]">
            You haven&apos;t published any lessons yet. Click &quot;Upload Lesson&quot; to begin.
          </div>
        )}
      </div>

      {/* Courses Management Section */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Your Courses & Playlists ({courses.length})
          </h2>
          <button
            onClick={() => setCourseModalOpen(true)}
            className="text-xs text-[var(--accent)] hover:underline font-mono"
          >
            + Create New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {courses.map(c => (
            <div key={c.id} className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-high)]">{c.title}</div>
                <div className="text-[11px] text-[var(--text-low)] font-mono mt-0.5">
                  {c.category} • {c.difficulty} • {c.total_lessons} Lessons
                </div>
              </div>
              <Link href={`/courses#${c.id}`} className="text-xs text-[var(--accent)] hover:underline font-mono">
                View →
              </Link>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-xs text-[var(--text-low)] col-span-2">No courses created yet.</p>
          )}
        </div>
      </div>

      {/* Profile Details Edit Card */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5 space-y-4 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Educator Channel Details
          </h2>
          {profileSavedToast && (
            <span className="text-xs text-green-400 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Display Name</label>
            <input
              type="text"
              value={profileDisplayName}
              onChange={(e) => setProfileDisplayName(e.target.value)}
              className="saaboq-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Academic & Teaching Bio</label>
            <textarea
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              rows={3}
              className="saaboq-input w-full resize-none"
              placeholder="Describe your domain focus, past research or industry experience..."
            />
          </div>

          <button type="submit" className="btn-primary text-xs">
            Save Profile Updates
          </button>
        </form>
      </div>

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase">Edit Lesson Details</h3>
              <button onClick={() => setEditingVideo(null)} className="text-[var(--text-low)] hover:text-[var(--text-high)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Lesson Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="saaboq-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="saaboq-input w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Visibility</label>
                <select
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value as 'public' | 'draft')}
                  className="saaboq-input w-full"
                >
                  <option value="public">Public</option>
                  <option value="draft">Draft (Private)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button type="button" onClick={() => setEditingVideo(null)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-semibold text-[var(--text-high)]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[var(--text-mid)] mb-4 leading-relaxed">
              Are you sure you want to delete this educational lesson? This action permanently removes the lesson and its associated comments.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setDeletingVideoId(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button onClick={handleExecuteDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-3 py-1.5 rounded-[6px] transition-colors">
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase">Create Course Track</h3>
              <button onClick={() => setCourseModalOpen(false)} className="text-[var(--text-low)] hover:text-[var(--text-high)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Course Title</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Internals"
                  className="saaboq-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Description / Syllabus Overview</label>
                <textarea
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  rows={3}
                  placeholder="Outline the core concepts taught across this syllabus..."
                  className="saaboq-input w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="saaboq-input w-full text-xs"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Systems & DevOps">Systems & DevOps</option>
                    <option value="Mathematics & Theory">Mathematics & Theory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Difficulty</label>
                  <select
                    value={newCourseDifficulty}
                    onChange={(e) => setNewCourseDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                    className="saaboq-input w-full text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button type="button" onClick={() => setCourseModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
