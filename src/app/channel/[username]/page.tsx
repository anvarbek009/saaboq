'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { UserProfile, Video, Course } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { VideoCard } from '@/components/video/VideoCard';
import { CheckCircle2, BookOpen, Video as VideoIcon, Info, Users } from 'lucide-react';

export default function ChannelPage() {
  const params = useParams();
  const username = params.username as string;
  const { user, guestActionPrompt } = useAuth();

  const [creator, setCreator] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'lessons' | 'courses' | 'about'>('lessons');
  const [subCount, setSubCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    const profile = DataStore.getUserByUsername(username);
    if (!profile) {
      setMounted(true);
      return;
    }

    setCreator(profile);
    const creatorVideos = DataStore.getVideosByCreator(profile.id).filter(v => v.visibility === 'public');
    setVideos(creatorVideos);

    const allCourses = DataStore.getCourses().filter(c => c.creator_id === profile.id);
    setCourses(allCourses);

    setSubCount(DataStore.getSubscriberCount(profile.id));

    if (user) {
      setIsSubscribed(DataStore.isSubscribed(user.id, profile.id));
    }
    setMounted(true);
  }, [username, user]);

  const handleToggleSubscribe = () => {
    if (!user) {
      guestActionPrompt('subscribe to this creator');
      return;
    }
    if (!creator) return;

    const sub = DataStore.toggleSubscription(user.id, creator.id);
    setIsSubscribed(sub);
    setSubCount(prev => sub ? prev + 1 : Math.max(0, prev - 1));
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading channel profile...</div>;
  }

  if (!creator) {
    return (
      <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-lg mx-auto">
        <h2 className="text-base font-semibold text-[var(--text-high)]">Educator Not Found</h2>
        <p className="text-xs text-[var(--text-mid)] mt-1">There is no registered educator with username @{username}.</p>
        <Link href="/" className="btn-primary text-xs mt-4 inline-flex">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channel Banner */}
      <div className="h-40 sm:h-52 w-full rounded-[8px] overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] relative">
        {creator.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creator.banner_url}
            alt={creator.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[var(--steel-900)] to-[var(--steel-800)]" />
        )}
      </div>

      {/* Profile Header Card */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={creator.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={creator.display_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-[var(--text-high)]">{creator.display_name}</h1>
              {creator.is_creator && (
                <span className="text-[10px] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent)] font-mono px-1.5 py-0.5 rounded">
                  Verified Educator
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-low)] font-mono mt-0.5">
              @{creator.username} • {subCount} scholars • {videos.length} lessons
            </div>
            {creator.expertise && creator.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {creator.expertise.map(exp => (
                  <span key={exp} className="text-[10px] text-[var(--text-mid)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-[4px] font-mono">
                    {exp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subscribe / Edit Channel Button */}
        {user?.id === creator.id ? (
          <Link href="/dashboard" className="btn-secondary text-xs">
            Manage Studio
          </Link>
        ) : (
          <button
            onClick={handleToggleSubscribe}
            className={`text-xs px-4 py-2 rounded-[6px] font-medium transition-colors ${
              isSubscribed
                ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] border border-[var(--border)]'
                : 'btn-primary'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      {/* Channel Navigation Tabs */}
      <div className="flex border-b border-[var(--border)] gap-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'lessons'
              ? 'text-[var(--text-high)] font-semibold border-b-2 border-b-[var(--accent)]'
              : 'text-[var(--text-mid)] hover:text-[var(--text-high)]'
          }`}
        >
          Lessons ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'courses'
              ? 'text-[var(--text-high)] font-semibold border-b-2 border-b-[var(--accent)]'
              : 'text-[var(--text-mid)] hover:text-[var(--text-high)]'
          }`}
        >
          Courses & Tracks ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'about'
              ? 'text-[var(--text-high)] font-semibold border-b-2 border-b-[var(--accent)]'
              : 'text-[var(--text-mid)] hover:text-[var(--text-high)]'
          }`}
        >
          Curriculum Philosophy & Bio
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'lessons' && (
        <div>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
              <p className="text-xs text-[var(--text-mid)]">No public lessons published yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.id} className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] flex gap-4">
              <div className="relative aspect-video w-36 rounded-[6px] overflow-hidden bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-[var(--accent)]">
                  {course.difficulty} • {course.total_lessons} Lessons
                </span>
                <h3 className="text-sm font-semibold text-[var(--text-high)] line-clamp-1 mt-0.5">
                  {course.title}
                </h3>
                <p className="text-xs text-[var(--text-mid)] line-clamp-2 mt-1">
                  {course.description}
                </p>
                <Link href={`/courses#${course.id}`} className="text-xs text-[var(--accent)] hover:underline font-mono mt-2 inline-block">
                  View Syllabus →
                </Link>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-2 p-8 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
              <p className="text-xs text-[var(--text-mid)]">No structured courses published under this channel yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4 max-w-2xl">
          <h3 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            About the Educator
          </h3>
          <p className="text-sm text-[var(--text-mid)] leading-relaxed whitespace-pre-line">
            {creator.bio || 'Educator dedicated to deep, distraction-free technical instruction.'}
          </p>

          <div className="pt-3 border-t border-[var(--border)]">
            <h4 className="text-xs font-mono uppercase text-[var(--text-low)] mb-2">Core Domains of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {creator.expertise?.map(e => (
                <span key={e} className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[4px] text-xs text-[var(--text-high)]">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
