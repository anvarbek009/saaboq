'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';

export function GuestPromptModal() {
  const { promptModalOpen, promptMessage, closePromptModal, switchUser } = useAuth();

  if (!promptModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closePromptModal}
          className="absolute top-4 right-4 text-[var(--text-low)] hover:text-[var(--text-high)] p-1 rounded-[6px]"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[6px] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-high)]">Account Required</h3>
            <p className="text-xs text-[var(--text-mid)]">Sign in to save and sync your learning</p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-[var(--text-mid)] mb-5 leading-relaxed">
          {promptMessage || 'You can freely watch public educational videos as a guest, but an account is required to bookmark lessons, subscribe to educators, track watch progress, and post comments.'}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={closePromptModal}
              className="btn-primary text-xs py-2 text-center"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/auth/register"
              onClick={closePromptModal}
              className="btn-secondary text-xs py-2 text-center"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Quick Demo Switcher Button for Instant Testing */}
          <button
            onClick={() => {
              switchUser('julian_dev');
              closePromptModal();
            }}
            className="w-full py-2 px-3 text-xs text-[var(--text-high)] bg-[var(--bg-elevated)] hover:bg-[var(--steel-600)] border border-[var(--border)] rounded-[6px] flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Instant Demo Sign-In as <strong>Julian (Viewer)</strong></span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--border)] text-center">
          <button
            onClick={closePromptModal}
            className="text-xs text-[var(--text-low)] hover:text-[var(--text-mid)] transition-colors"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
}
