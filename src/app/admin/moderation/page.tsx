'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { ContentReport } from '@/types';
import { ShieldAlert, CheckCircle, XCircle, Trash2, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ModerationPage() {
  const { user, switchUser, loading } = useAuth();
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [mounted, setMounted] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    DataStore.init();
    setReports(DataStore.getReports());
    setMounted(true);
  }, []);

  const refreshReports = () => {
    setReports(DataStore.getReports());
  };

  const handleDismissReport = (reportId: string) => {
    DataStore.updateReportStatus(reportId, 'dismissed', 'Reviewed by admin; content meets academic standards.');
    refreshReports();
    setActionMessage('Report marked as dismissed.');
    setTimeout(() => setActionMessage(''), 2000);
  };

  const handleResolveAndKeep = (reportId: string) => {
    DataStore.updateReportStatus(reportId, 'resolved', 'Flagged issue reviewed and resolved.');
    refreshReports();
    setActionMessage('Report marked as resolved.');
    setTimeout(() => setActionMessage(''), 2000);
  };

  const handleDeleteContent = (report: ContentReport) => {
    if (!user) return;
    try {
      if (report.content_type === 'video') {
        DataStore.deleteVideo(report.content_id, user.id);
      } else if (report.content_type === 'comment') {
        DataStore.deleteComment(report.content_id, user.id);
      }
      DataStore.updateReportStatus(report.id, 'resolved', 'Content deleted due to policy violation.');
      refreshReports();
      setActionMessage('Violating content deleted and report resolved.');
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting content');
    }
  };

  if (!mounted || loading) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Checking administrator authorization...</div>;
  }

  // Admin access gate per requirement
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] max-w-lg mx-auto text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-base font-semibold text-[var(--text-high)]">
          Protected Administrative Route
        </h2>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Access restricted. This endpoint is strictly reserved for platform administrators to moderate reported content and govern curriculum integrity.
        </p>

        <div className="pt-3 border-t border-[var(--border)]">
          <button
            onClick={() => switchUser('admin')}
            className="btn-primary text-xs"
          >
            Switch to Platform Admin (Demo Persona)
          </button>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const pastReports = reports.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[var(--accent)]" />
            <span>Curriculum Moderation Queue</span>
          </h1>
          <p className="text-xs text-[var(--text-mid)] mt-1">
            Review user-flagged lectures, inaccuracies, and algorithmic spam reports.
          </p>
        </div>

        <div className="text-xs text-[var(--text-low)] font-mono">
          Logged in as: <strong className="text-[var(--accent)]">{user.display_name}</strong>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-green-950/40 border border-green-800 rounded-[6px] text-xs text-green-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Pending Reports Section */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Pending Reports ({pendingReports.length})
          </h2>
          <span className="text-xs text-[var(--text-low)] font-mono">Requires Admin Decision</span>
        </div>

        {pendingReports.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {pendingReports.map(report => (
              <div key={report.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-red-950/40 border border-red-800 text-red-400 rounded">
                      {report.content_type}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-high)]">
                      {report.content_title || report.content_id}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--text-mid)]">
                    Report Reason: <span className="text-[var(--text-high)] font-medium">&quot;{report.reason}&quot;</span>
                  </div>

                  <div className="text-[11px] text-[var(--text-low)] font-mono">
                    Reported at {new Date(report.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {report.content_type === 'video' && (
                    <Link
                      href={`/watch/${report.content_id}`}
                      target="_blank"
                      className="btn-secondary text-xs h-8 px-2.5"
                      title="Inspect lesson"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>
                  )}

                  <button
                    onClick={() => handleDismissReport(report.id)}
                    className="p-1.5 text-[var(--text-mid)] hover:text-green-400 hover:bg-[var(--bg-elevated)] rounded text-xs flex items-center gap-1 transition-colors"
                    title="Dismiss report as invalid"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>

                  <button
                    onClick={() => handleDeleteContent(report)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-2.5 py-1.5 rounded-[6px] flex items-center gap-1 transition-colors"
                    title="Delete content and resolve"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Content</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-mid)]">
            The moderation queue is clear. No pending flagged reports.
          </div>
        )}
      </div>

      {/* Historical Resolved/Dismissed Reports */}
      {pastReports.length > 0 && (
        <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-4 space-y-3">
          <h2 className="text-xs font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
            Past Moderation History ({pastReports.length})
          </h2>

          <div className="divide-y divide-[var(--border)]">
            {pastReports.map(r => (
              <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[var(--text-high)]">{r.content_title || r.content_id}</span>
                  <div className="text-[11px] text-[var(--text-low)] mt-0.5">
                    Action: {r.status} • {r.resolution_notes}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase ${
                  r.status === 'resolved' ? 'text-green-400 bg-green-950/40' : 'text-gray-400 bg-gray-900'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
