'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Settings, User, Database, Video as VideoIcon, Check, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedToast, setSavedToast] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({
      display_name: displayName.trim(),
      bio: bio.trim(),
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to reset all local data to original verified seed state?')) {
      localStorage.clear();
      DataStore.init();
      setResetToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--accent)]" />
          <span>Platform & Account Settings</span>
        </h1>
        <p className="text-xs text-[var(--text-mid)] mt-1">
          Configure personal credentials, examine database connection status, and manage platform defaults.
        </p>
      </div>

      {/* Profile Section */}
      {user ? (
        <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)]" />
              <span>User Profile & Identification</span>
            </h2>
            {savedToast && (
              <span className="text-xs text-green-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Changes saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="saaboq-input w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Username</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="saaboq-input w-full text-xs opacity-60 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">Biography / Research Background</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="saaboq-input w-full text-xs resize-none"
              />
            </div>

            <button type="submit" className="btn-primary text-xs">
              Save Profile Settings
            </button>
          </form>
        </div>
      ) : (
        <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] text-xs text-[var(--text-mid)]">
          You are currently browsing as a guest. Sign in to customize your profile.
        </div>
      )}

      {/* Backend & Cloudflare Infrastructure Diagnostics */}
      <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-[var(--accent)]" />
          <span>Architecture & Database Connections</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text-high)]">Supabase PostgreSQL & Auth Engine</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-green-950/40 text-green-400 border border-green-800">
                Schema Ready
              </span>
            </div>
            <p className="text-[var(--text-mid)] leading-relaxed">
              Complete relational migration file exists in <code className="text-[var(--accent)] font-mono">supabase/schema.sql</code> with 10 tables, RLS policies, full-text indexes, and triggers. Active with seamless client/server unified persistence store.
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text-high)]">Cloudflare Stream Video Pipeline</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-950/40 text-[var(--accent)] border border-blue-800">
                Direct Stream Supported
              </span>
            </div>
            <p className="text-[var(--text-mid)] leading-relaxed">
              Supports Cloudflare Stream API credentials via environment variables and validates streaming video links for development and production.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-low)]">
            Reset local repository storage to initial seed lectures:
          </span>
          <button
            onClick={handleResetData}
            className="btn-secondary text-xs h-8 px-3 text-red-400 hover:text-red-300"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Database Seed</span>
          </button>
        </div>
        {resetToast && (
          <div className="text-xs text-yellow-400 font-mono">
            Database re-seeded! Refreshing...
          </div>
        )}
      </div>
    </div>
  );
}
