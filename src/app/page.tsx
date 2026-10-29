'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { Video, Course } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { BookOpen, Flame, Sparkles, Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Computer Science',
  'AI & Machine Learning',
  'Systems & DevOps',
  'Mathematics & Theory',
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    setVideos(DataStore.getVideos());
    setCourses(DataStore.getCourses());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-9 w-96 bg-[var(--bg-panel)] rounded-[6px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-[var(--bg-panel)] rounded-[8px]" />
          ))}
        </div>
      </div>
    );
  }

  // Filter videos by category
  const filteredVideos = selectedCategory === 'All' 
    ? videos.filter(v => v.visibility === 'public')
    : videos.filter(v => v.visibility === 'public' && v.category.toLowerCase() === selectedCategory.toLowerCase());

  // Popular videos sorted by views_count
  const popularVideos = [...filteredVideos].sort((a, b) => b.views_count - a.views_count).slice(0, 3);
  
  // Recent videos
  const recentVideos = [...filteredVideos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  return (
    <div className="space-y-7">
      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[var(--mauve-magic)] text-[var(--dark-amethyst)] font-bold shadow-sm'
                  : 'bg-[var(--bg-panel)] text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)] border border-[var(--border)]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Immediate Video Feed - Recommended / All Lessons */}
      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-high)] font-mono">
              {selectedCategory === 'All' ? 'Curated Feed' : `${selectedCategory}`}
            </h2>
            <span className="text-xs text-[var(--text-low)] font-mono">
              ({filteredVideos.length})
            </span>
          </div>
          <Link 
            href="/explore" 
            className="text-xs text-[var(--text-mid)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
            <p className="text-sm text-[var(--text-mid)]">No lessons available in this category yet.</p>
          </div>
        )}
      </section>

      {/* Structured Course Tracks Shelf */}
      {courses.length > 0 && selectedCategory === 'All' && (
        <section className="pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-high)] font-mono">
                Structured Courses & Tracks
              </h2>
            </div>
            <Link 
              href="/courses" 
              className="text-xs text-[var(--text-mid)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
            >
              <span>View all tracks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="saaboq-card bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-[6px] overflow-hidden bg-[var(--bg-elevated)] mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-2 right-2 video-duration-badge">
                      {course.total_lessons} Lessons
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[var(--accent)]">
                      {course.difficulty}
                    </span>
                    <span className="text-xs text-[var(--text-low)] truncate">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-high)] line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[var(--text-mid)] line-clamp-2 mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  {course.creator && (
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={course.creator.avatar_url} 
                        alt={course.creator.display_name} 
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="text-xs text-[var(--text-mid)] truncate max-w-[120px]">
                        {course.creator.display_name}
                      </span>
                    </div>
                  )}
                  <Link 
                    href={`/courses#${course.id}`}
                    className="text-xs text-[var(--accent)] hover:underline font-medium flex items-center gap-1"
                  >
                    <span>View track</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Lessons Based on Actual Viewing Data */}
      {popularVideos.length > 0 && selectedCategory === 'All' && (
        <section className="pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3 px-0.5">
            <Flame className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-high)] font-mono">
              Most Studied Lessons
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularVideos.map((video) => (
              <VideoCard key={`pop-${video.id}`} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Published */}
      {recentVideos.length > 0 && selectedCategory === 'All' && (
        <section className="pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3 px-0.5">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-high)] font-mono">
              Recently Published
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVideos.map((video) => (
              <VideoCard key={`rec-${video.id}`} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
