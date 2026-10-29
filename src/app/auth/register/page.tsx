'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'viewer' | 'creator'>('viewer');
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (displayName.length < 2) {
      setError('Display name must be at least 2 characters long.');
      return;
    }

    setLoadingState(true);

    try {
      await register(username.trim(), displayName.trim(), role);
      router.push(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoadingState(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] space-y-6 shadow-2xl">
      <div className="text-center space-y-1">
        <div className="w-10 h-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] flex items-center justify-center mx-auto text-[var(--accent)]">
          <UserPlus className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
          Create Saaboq Account
        </h1>
        <p className="text-xs text-[var(--text-mid)]">
          Join a dedicated community of engineers, researchers, and students.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 rounded-[6px] text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
            Full Name or Display Name *
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Maya Lin"
            className="saaboq-input w-full text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
            Unique Username *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[var(--text-low)] font-mono">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="mayalin"
              className="saaboq-input w-full text-xs pl-7 font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="saaboq-input w-full text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-mid)] mb-1">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`p-2.5 rounded-[6px] border text-left text-xs transition-colors ${
                role === 'viewer'
                  ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-high)] font-medium'
                  : 'border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-mid)]'
              }`}
            >
              <div className="font-semibold">Viewer / Student</div>
              <div className="text-[10px] text-[var(--text-low)]">Save lectures & track progress</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`p-2.5 rounded-[6px] border text-left text-xs transition-colors ${
                role === 'creator'
                  ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-high)] font-medium'
                  : 'border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-mid)]'
              }`}
            >
              <div className="font-semibold">Educator / Creator</div>
              <div className="text-[10px] text-[var(--text-low)]">Publish lessons & courses</div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingState}
          className="btn-primary w-full text-xs py-2.5 font-semibold"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{loadingState ? 'Creating Account...' : 'Create Free Account'}</span>
        </button>
      </form>

      <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-mid)]">
        Already have an account?{' '}
        <Link href={`/auth/login?redirect=${redirect}`} className="text-[var(--accent)] hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
