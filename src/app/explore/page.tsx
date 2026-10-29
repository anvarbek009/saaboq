'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataStore } from '@/lib/store';
import { Video } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Computer Science', 'AI & Machine Learning', 'Systems & DevOps', 'Mathematics & Theory'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { label: 'Recently Published', value: 'newest' },
  { label: 'Most Studied (Views)', value: 'views' },
  { label: 'Duration (Longest first)', value: 'duration' },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState(initialSort);
  const [videos, setVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);

  // Debounce search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Load and filter videos
  useEffect(() => {
    DataStore.init();
    let results = DataStore.searchVideos(debouncedQuery, category, difficulty);

    // Apply sorting
    if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'views') {
      results.sort((a, b) => b.views_count - a.views_count);
    } else if (sortBy === 'duration') {
      results.sort((a, b) => b.duration_seconds - a.duration_seconds);
    }

    setVideos(results);
    setMounted(true);
  }, [debouncedQuery, category, difficulty, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setCategory('All');
    setDifficulty('All');
    setSortBy('newest');
  };

  const hasActiveFilters = query.trim() !== '' || category !== 'All' || difficulty !== 'All' || sortBy !== 'newest';

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
          Explore Curriculum
        </h1>
        <p className="text-xs text-[var(--text-mid)] mt-1">
          Search indexed educational videos, verified lecture series, and mathematical derivations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keywords, algorithms, educators, or concepts..."
            className="saaboq-input w-full h-10 pl-9 pr-8"
          />
          <Search className="w-4 h-4 text-[var(--text-low)] absolute left-3 top-3" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-[var(--text-low)] hover:text-[var(--text-high)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-mid)]">
              <span>Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="saaboq-input text-xs py-1 px-2 h-8"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-mid)]">
              <span>Level:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="saaboq-input text-xs py-1 px-2 h-8"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-mid)]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="saaboq-input text-xs py-1 px-2 h-8"
              >
                {SORT_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[var(--text-low)] hover:text-[var(--text-high)] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="text-xs text-[var(--text-mid)] font-mono">
            Showing <strong className="text-[var(--text-high)]">{videos.length}</strong> verified lessons
            {debouncedQuery && <span> matching &quot;{debouncedQuery}&quot;</span>}
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
            <SlidersHorizontal className="w-8 h-8 text-[var(--text-low)] mx-auto mb-3 opacity-60" />
            <h3 className="text-sm font-semibold text-[var(--text-high)]">No Matching Lessons Found</h3>
            <p className="text-xs text-[var(--text-mid)] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any lessons matching your criteria. Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-secondary text-xs mt-4 inline-flex"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading curriculum index...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
