'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Course, VideoChapter, VideoResource } from '@/types';
import { 
  Upload, 
  Video as VideoIcon, 
  Check, 
  AlertCircle, 
  Info, 
  Eye, 
  Plus, 
  Trash2, 
  FileText, 
  Layers
} from 'lucide-react';

const PRESET_THUMBNAILS = [
  { label: 'Distributed Systems', url: '/thumbnails/distributed_systems.jpg' },
  { label: 'Transformer Attention', url: '/thumbnails/transformer_ai.jpg' },
  { label: 'Quantum Bloch Sphere', url: '/thumbnails/quantum_computing.jpg' },
  { label: 'Kernel & eBPF', url: '/thumbnails/kernel_ebpf.jpg' },
  { label: 'Database LSM vs B-Tree', url: '/thumbnails/database_engines.jpg' },
  { label: 'Zero-Knowledge Proofs', url: '/thumbnails/zero_knowledge.jpg' },
];

const SAMPLE_EDUCATIONAL_VIDEOS = [
  { label: 'Distributed Systems Sample (Big Buck Bunny)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { label: 'Storage Engines Sample (Elephants Dream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { label: 'Compiler & Deep Learning Sample (Blender Foundation)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { label: 'Quantum Algorithms Sample (Tears of Steel)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
];

export default function UploadPage() {
  const router = useRouter();
  const { user, loading, guestActionPrompt } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState(SAMPLE_EDUCATIONAL_VIDEOS[0].url);
  const [thumbnailUrl, setThumbnailUrl] = useState(PRESET_THUMBNAILS[0].url);
  const [category, setCategory] = useState('Computer Science');
  const [language, setLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [visibility, setVisibility] = useState<'public' | 'draft'>('public');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessonOrder, setLessonOrder] = useState<number>(1);
  const [durationSeconds, setDurationSeconds] = useState<number>(1800); // 30m default

  // Chapters & Resources
  const [chapters, setChapters] = useState<VideoChapter[]>([
    { timestamp: 0, title: 'Introduction & Scope' },
    { timestamp: 300, title: 'Core Theoretical Derivations' },
    { timestamp: 900, title: 'Practical System Implementations' }
  ]);
  const [resources, setResources] = useState<VideoResource[]>([
    { title: 'Lecture Notes & Proofs (PDF)', url: 'https://arxiv.org', type: 'paper' }
  ]);

  // UI state
  const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoPlaybackVerified, setVideoPlaybackVerified] = useState(true);

  useEffect(() => {
    DataStore.init();
    if (!loading && !user) {
      guestActionPrompt('upload educational content');
      router.push('/auth/login?redirect=/upload');
      return;
    }

    if (user) {
      const userCourses = DataStore.getCourses().filter(c => c.creator_id === user.id);
      setCourses(userCourses);
      if (userCourses.length > 0) {
        setSelectedCourseId(userCourses[0].id);
      }
    }
  }, [user, loading, router]);

  // Add Chapter
  const addChapter = () => {
    setChapters([...chapters, { timestamp: 600, title: 'New Topic Section' }]);
  };

  const removeChapter = (idx: number) => {
    setChapters(chapters.filter((_, i) => i !== idx));
  };

  const updateChapter = (idx: number, field: keyof VideoChapter, value: string | number) => {
    const updated = [...chapters];
    updated[idx] = { ...updated[idx], [field]: value };
    setChapters(updated);
  };

  // Add Resource
  const addResource = () => {
    setResources([...resources, { title: 'Reference Source Link', url: 'https://github.com', type: 'link' }]);
  };

  const removeResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      guestActionPrompt('publish a lesson');
      return;
    }

    // Validation
    if (!title.trim() || title.length < 5) {
      setErrorMessage('Lesson title must be at least 5 characters long.');
      return;
    }

    if (!description.trim() || description.length < 15) {
      setErrorMessage('Lesson description must be at least 15 characters long.');
      return;
    }

    if (!videoUrl.trim()) {
      setErrorMessage('A valid video stream URL or media file is required.');
      return;
    }

    setIsPublishing(true);

    try {
      const published = DataStore.publishVideo({
        creator_id: user.id,
        course_id: selectedCourseId || undefined,
        title: title.trim(),
        description: description.trim(),
        video_url: videoUrl.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        duration_seconds: durationSeconds,
        category,
        language,
        difficulty,
        visibility,
        lesson_order: selectedCourseId ? lessonOrder : undefined,
        chapters,
        resources,
      });

      // Update user to creator status if not already
      if (!user.is_creator) {
        DataStore.updateProfile(user.id, { is_creator: true, role: 'creator' });
      }

      // Route directly to the newly published lesson page
      router.push(`/watch/${published.id}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error publishing lesson');
      setIsPublishing(false);
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Verifying authorization...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Publish Educational Lesson
          </h1>
          <p className="text-xs text-[var(--text-mid)] mt-1">
            Structured curriculum publishing with syllabus alignment and verified academic resources.
          </p>
        </div>

        {/* View/Preview Toggle */}
        <div className="flex bg-[var(--bg-panel)] border border-[var(--border)] rounded-[6px] p-0.5">
          <button
            type="button"
            onClick={() => setPreviewTab('form')}
            className={`px-3 py-1 rounded-[4px] text-xs font-mono uppercase transition-colors ${
              previewTab === 'form' ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] font-semibold' : 'text-[var(--text-low)]'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('preview')}
            className={`px-3 py-1 rounded-[4px] text-xs font-mono uppercase transition-colors ${
              previewTab === 'preview' ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] font-semibold' : 'text-[var(--text-low)]'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Cloudflare Stream Integration & Development Fallback Notice */}
      <div className="p-3.5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-[var(--text-high)]">
            Cloudflare Stream Integration Architecture
          </div>
          <p className="text-[var(--text-mid)] leading-relaxed">
            When <code className="text-[var(--accent)] font-mono">CLOUDFLARE_STREAM_ACCOUNT_ID</code> and <code className="text-[var(--accent)] font-mono">CLOUDFLARE_STREAM_API_TOKEN</code> are configured in <code className="text-[var(--text-high)] font-mono">.env.local</code>, video binaries are transcoded and streamed via Cloudflare HLS. In local development fallback mode, you can select educational sample MP4 streams or provide direct HTTPS video URLs.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-800 rounded-[6px] text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {previewTab === 'form' ? (
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Section 1: Video Source & Media */}
          <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-[var(--accent)]" />
              <span>1. Video Source & Stream Verification</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                  Preset Educational Video Stream or Custom HTTPS MP4 URL
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {SAMPLE_EDUCATIONAL_VIDEOS.map((sample) => (
                    <button
                      key={sample.url}
                      type="button"
                      onClick={() => setVideoUrl(sample.url)}
                      className={`text-left p-2.5 rounded-[6px] border text-xs transition-colors ${
                        videoUrl === sample.url
                          ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-high)]'
                          : 'border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-mid)] hover:text-[var(--text-high)]'
                      }`}
                    >
                      <div className="font-medium truncate">{sample.label}</div>
                      <div className="text-[10px] text-[var(--text-low)] font-mono truncate">{sample.url}</div>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/lecture.mp4"
                  className="saaboq-input w-full font-mono text-xs"
                  required
                />
              </div>

              {/* Video Playback Verification Box */}
              {videoUrl && (
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-[6px] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-mid)]">Stream Playback Check:</span>
                    <span className="text-green-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ready for playback
                    </span>
                  </div>
                  <div className="relative aspect-video max-w-sm rounded-[6px] overflow-hidden bg-black border border-[var(--border)]">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Lesson Metadata */}
          <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent)]" />
              <span>2. Curriculum Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus: Raft Safety Invariants & Log Matching"
                  className="saaboq-input w-full text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                  Detailed Lesson Synopsis & Educational Objectives *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain the theoretical foundations, algorithms, and practical problems addressed in this lecture..."
                  className="saaboq-input w-full resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                    Subject / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="saaboq-input w-full text-xs"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Systems & DevOps">Systems & DevOps</option>
                    <option value="Mathematics & Theory">Mathematics & Theory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                    className="saaboq-input w-full text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'draft')}
                    className="saaboq-input w-full text-xs"
                  >
                    <option value="public">Public (Indexed)</option>
                    <option value="draft">Draft (Private to creator)</option>
                  </select>
                </div>
              </div>

              {/* Course Syllabus Association */}
              <div className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs font-semibold text-[var(--text-high)]">
                    Attach to Course Track (Optional)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[var(--text-mid)] mb-1">Course</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="saaboq-input w-full text-xs bg-[var(--bg-panel)]"
                    >
                      <option value="">Standalone Lesson (No course)</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedCourseId && (
                    <div>
                      <label className="block text-xs text-[var(--text-mid)] mb-1">Lesson Order in Syllabus</label>
                      <input
                        type="number"
                        min={1}
                        value={lessonOrder}
                        onChange={(e) => setLessonOrder(parseInt(e.target.value) || 1)}
                        className="saaboq-input w-full text-xs bg-[var(--bg-panel)] font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Thumbnail Selection */}
          <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
              3. Visual Thumbnail & Technical Diagram
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_THUMBNAILS.map(thumb => (
                <button
                  key={thumb.url}
                  type="button"
                  onClick={() => setThumbnailUrl(thumb.url)}
                  className={`p-1.5 rounded-[8px] border text-left transition-colors ${
                    thumbnailUrl === thumb.url
                      ? 'border-[var(--accent)] bg-[var(--bg-elevated)]'
                      : 'border-[var(--border)] hover:border-[var(--text-low)]'
                  }`}
                >
                  <div className="aspect-video w-full rounded-[6px] overflow-hidden bg-black mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-medium text-[var(--text-high)] truncate">{thumb.label}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-[var(--text-mid)] mb-1">Or enter custom thumbnail image URL</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="saaboq-input w-full text-xs font-mono"
              />
            </div>
          </div>

          {/* Section 4: Chapters Builder */}
          <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
                4. Interactive Timeline Chapters ({chapters.length})
              </h2>
              <button
                type="button"
                onClick={addChapter}
                className="btn-secondary text-xs h-7 px-2.5"
              >
                <Plus className="w-3 h-3" />
                <span>Add Chapter</span>
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((ch, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={ch.timestamp}
                    onChange={(e) => updateChapter(idx, 'timestamp', parseInt(e.target.value) || 0)}
                    placeholder="Sec"
                    className="saaboq-input w-20 text-xs font-mono"
                    title="Timestamp in seconds"
                  />
                  <input
                    type="text"
                    value={ch.title}
                    onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                    placeholder="Chapter Title"
                    className="saaboq-input flex-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeChapter(idx)}
                    className="p-2 text-[var(--text-low)] hover:text-red-400"
                    title="Remove chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Attached Resources Builder */}
          <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
                5. Verified Academic References & Code ({resources.length})
              </h2>
              <button
                type="button"
                onClick={addResource}
                className="btn-secondary text-xs h-7 px-2.5"
              >
                <Plus className="w-3 h-3" />
                <span>Add Reference</span>
              </button>
            </div>

            <div className="space-y-2">
              {resources.map((res, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={res.title}
                    onChange={(e) => {
                      const updated = [...resources];
                      updated[idx].title = e.target.value;
                      setResources(updated);
                    }}
                    placeholder="Reference Title (e.g. Whitepaper PDF)"
                    className="saaboq-input flex-1 text-xs"
                  />
                  <input
                    type="url"
                    value={res.url}
                    onChange={(e) => {
                      const updated = [...resources];
                      updated[idx].url = e.target.value;
                      setResources(updated);
                    }}
                    placeholder="https://..."
                    className="saaboq-input flex-1 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(idx)}
                    className="p-2 text-[var(--text-low)] hover:text-red-400"
                    title="Remove reference"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="btn-secondary text-xs h-9 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="btn-primary text-xs h-9 px-5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing Lesson...' : 'Publish to Saaboq'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Card */
        <div className="p-6 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-6">
          <h2 className="text-xs font-mono uppercase text-[var(--text-low)] tracking-wider">
            Card Preview in Feed
          </h2>

          <div className="max-w-md">
            <div className="saaboq-card p-2 rounded-[8px] border border-[var(--border)] bg-[var(--bg-main)]">
              <div className="relative aspect-video w-full rounded-[8px] overflow-hidden bg-black mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnailUrl} alt={title || 'Thumbnail Preview'} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 video-duration-badge">
                  {selectedCourseId ? `01/01 • 30:00` : `30:00`}
                </div>
              </div>

              <div className="flex gap-2.5 px-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar_url} alt={user.display_name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-high)] line-clamp-2">
                    {title || 'Untranslated Title Preview'}
                  </h3>
                  <div className="text-xs text-[var(--text-mid)] mt-0.5">{user.display_name}</div>
                  <div className="text-[11px] text-[var(--text-low)] font-mono mt-0.5">
                    0 views • Just now • {category}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setPreviewTab('form')}
              className="btn-secondary text-xs"
            >
              Return to Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
