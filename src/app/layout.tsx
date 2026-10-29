import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { GuestPromptModal } from '@/components/auth/GuestPromptModal';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Saaboq — Distraction-Free Educational Video Platform',
  description: 'Structured, high-density educational video streaming for computer science, distributed systems, deep learning, and advanced mathematics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--bg-main)] text-[var(--text-high)] antialiased min-h-screen">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
          <GuestPromptModal />
        </AuthProvider>
      </body>
    </html>
  );
}
