'use client';

import React from 'react';
import Link from 'next/link';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  showCourseBadge?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export function VideoCard({ video }: VideoCardProps) {
  // Course lesson badge formatting per specification: "03/12 • 18:40"
  let badgeText = formatDuration(video.duration_seconds);
  if (video.course && video.lesson_order) {
    const orderStr = video.lesson_order.toString().padStart(2, '0');
    const totalStr = (video.course.total_lessons || 1).toString().padStart(2, '0');
    badgeText = `${orderStr}/${totalStr} • ${badgeText}`;
  }

  return (
    <div className="saaboq-card p-2 rounded-[8px] flex flex-col group">
      {/* Stationary Thumbnail Container with 8px radius */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full overflow-hidden rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)] block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail_url || '/thumbnails/distributed_systems.jpg'}
          alt={video.title}
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />

        {/* Monospace Badge: strictly at most one in bottom-right corner */}
        <div className="absolute bottom-2 right-2 video-duration-badge pointer-events-none select-none">
          {badgeText}
        </div>
      </Link>

      {/* Metadata Section */}
      <div className="flex gap-2.5 mt-2.5 px-0.5">
        {/* Creator Avatar */}
        {video.creator && (
          <Link href={`/channel/${video.creator.username}`} className="shrink-0 mt-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.creator.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={video.creator.display_name}
              className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
            />
          </Link>
        )}

        {/* Title & Channel Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/watch/${video.id}`} className="block">
            <h3 className="text-sm font-medium text-[var(--text-high)] line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors">
              {video.title}
            </h3>
          </Link>

          {video.creator && (
            <Link
              href={`/channel/${video.creator.username}`}
              className="text-xs text-[var(--text-mid)] hover:text-[var(--text-high)] block truncate mt-1 transition-colors"
            >
              {video.creator.display_name}
            </Link>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-low)] mt-0.5 font-mono">
            <span>{video.views_count.toLocaleString()} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.created_at)}</span>
            {video.course && (
              <>
                <span>•</span>
                <span className="text-[var(--text-mid)] truncate max-w-[120px]">{video.course.title}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
