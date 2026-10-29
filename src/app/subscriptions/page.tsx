'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { UserProfile, Video } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { Users, LogIn } from 'lucide-react';

export default function SubscriptionsPage() {
  const { user, loading } = useAuth();
  const [followedCreators, setFollowedCreators] = useState<UserProfile[]>([]);
  const [feedVideos, setFeedVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    if (user) {
      const allUsers = DataStore.getAllUsers();
      const subs = allUsers.filter(u => DataStore.isSubscribed(user.id, u.id));
      setFollowedCreators(subs);

      const subIds = subs.map(s => s.id);
      const videos = DataStore.getVideos().filter(v => subIds.includes(v.creator_id) && v.visibility === 'public');
      setFeedVideos(videos);
    }
    setMounted(true);
  }, [user]);

  if (!mounted || loading) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading educator subscriptions...</div>;
  }

  if (!user) {
    return (
      <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-md mx-auto space-y-4">
        <Users className="w-8 h-8 text-[var(--accent)] mx-auto opacity-70" />
        <h2 className="text-base font-semibold text-[var(--text-high)]">Educator Subscriptions</h2>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Sign in to subscribe to verified researchers, computer scientists, and educators to curate your personal technical feed.
        </p>
        <div className="pt-2">
          <Link href="/auth/login?redirect=/subscriptions" className="btn-primary text-xs inline-flex">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to View Subscriptions</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--accent)]" />
          <span>Followed Educators ({followedCreators.length})</span>
        </h1>
        <p className="text-xs text-[var(--text-mid)] mt-1">
          Recent lesson dispatches from educators you follow.
        </p>
      </div>

      {/* Subscribed Educators Avatar Bar */}
      {followedCreators.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {followedCreators.map(creator => (
            <Link
              key={creator.id}
              href={`/channel/${creator.username}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--bg-panel)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-[var(--text-high)]">{creator.display_name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Subscription Feed */}
      {feedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px]">
          <p className="text-xs text-[var(--text-mid)]">
            {followedCreators.length === 0
              ? 'You are not currently subscribed to any educators. Browse the feed to find verified instructors.'
              : 'No new lessons published by your subscribed educators yet.'}
          </p>
          <Link href="/explore" className="btn-secondary text-xs mt-4 inline-flex">
            Discover Educators
          </Link>
        </div>
      )}
    </div>
  );
}
