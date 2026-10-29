'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Video } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { Bookmark, Trash2, LogIn } from 'lucide-react';

export default function SavedVideosPage() {
  const { user, loading, guestActionPrompt } = useAuth();
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    if (user) {
      setSavedVideos(DataStore.getSavedVideos(user.id));
    }
    setMounted(true);
  }, [user]);

  const handleRemoveSaved = (videoId: string) => {
    if (!user) return;
    DataStore.toggleSave(user.id, videoId);
    setSavedVideos(DataStore.getSavedVideos(user.id));
  };

  if (!mounted || loading) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading saved library...</div>;
  }

  if (!user) {
    return (
      <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-md mx-auto space-y-4">
        <Bookmark className="w-8 h-8 text-[var(--accent)] mx-auto opacity-70" />
        <h2 className="text-base font-semibold text-[var(--text-high)]">Saved Videos Library</h2>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Sign in to access your bookmarked lectures, review notes, and study queues across devices.
        </p>
        <div className="pt-2">
          <Link href="/auth/login?redirect=/saved" className="btn-primary text-xs inline-flex">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to View Saved</span>
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
            <Bookmark className="w-5 h-5 text-[var(--accent)]" />
            <span>Saved Educational Videos ({savedVideos.length})</span>
          </h1>
          <p className="text-xs text-[var(--text-mid)] mt-1">
            Personal bookmark archive for deep study and reference.
          </p>
        </div>
      </div>

      {savedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedVideos.map((video) => (
            <div key={video.id} className="relative group">
              <VideoCard video={video} />
              <button
                onClick={() => handleRemoveSaved(video.id)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-red-900/90 text-white p-1.5 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove from saved"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <p className="text-xs text-[var(--text-mid)]">You haven&apos;t saved any lessons yet. Click &quot;Save&quot; on any lesson to bookmark it here.</p>
          <Link href="/explore" className="btn-secondary text-xs mt-4 inline-flex">
            Explore Lessons
          </Link>
        </div>
      )}
    </div>
  );
}
