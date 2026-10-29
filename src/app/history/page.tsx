'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Video, WatchProgress } from '@/types';
import { History, Play, CheckCircle2, RotateCcw, LogIn } from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [historyItems, setHistoryItems] = useState<{ video: Video; progress: WatchProgress }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    if (user) {
      setHistoryItems(DataStore.getWatchHistory(user.id));
    }
    setMounted(true);
  }, [user]);

  if (!mounted || loading) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading study history...</div>;
  }

  if (!user) {
    return (
      <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-md mx-auto space-y-4">
        <History className="w-8 h-8 text-[var(--accent)] mx-auto opacity-70" />
        <h2 className="text-base font-semibold text-[var(--text-high)]">Watch & Progress History</h2>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Sign in to automatically track your lesson progress, resume long lectures from your exact minute, and track course completion milestones.
        </p>
        <div className="pt-2">
          <Link href="/auth/login?redirect=/history" className="btn-primary text-xs inline-flex">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Enable History</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--accent)]" />
            <span>Learning History & Course Progress</span>
          </h1>
          <p className="text-xs text-[var(--text-mid)] mt-1">
            Track your technical lecture progress and resume unfinished topics.
          </p>
        </div>
      </div>

      {historyItems.length > 0 ? (
        <div className="space-y-3">
          {historyItems.map(({ video, progress }) => {
            const progressPercent = Math.min(100, Math.round((progress.progress_seconds / video.duration_seconds) * 100));
            return (
              <div
                key={video.id}
                className="p-3 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative aspect-video w-32 rounded-[6px] overflow-hidden bg-black shrink-0 border border-[var(--border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    {/* Progress Bar overlay on thumbnail */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                      <div className="h-full bg-[var(--accent)]" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--accent)]">
                        {video.category}
                      </span>
                      {progress.completed && (
                        <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>

                    <Link href={`/watch/${video.id}`} className="text-sm font-semibold text-[var(--text-high)] hover:text-[var(--accent)] truncate block transition-colors">
                      {video.title}
                    </Link>

                    <div className="text-xs text-[var(--text-low)] font-mono mt-1">
                      Watched: {formatDuration(progress.progress_seconds)} / {formatDuration(video.duration_seconds)} ({progressPercent}%)
                    </div>
                  </div>
                </div>

                <Link
                  href={`/watch/${video.id}`}
                  className="btn-primary text-xs h-8 px-3 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Lesson</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <p className="text-xs text-[var(--text-mid)]">No watch history recorded yet. Open any lecture to begin tracking your study progress.</p>
          <Link href="/" className="btn-secondary text-xs mt-4 inline-flex">
            Browse Feed
          </Link>
        </div>
      )}
    </div>
  );
}
