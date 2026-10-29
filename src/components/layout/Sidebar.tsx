'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Compass, 
  Flame, 
  Users, 
  Bookmark, 
  History, 
  BookOpen, 
  User, 
  Settings,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Popular', href: '/explore?sort=views', icon: Flame },
    { name: 'Courses', href: '/courses', icon: BookOpen },
  ];

  const libraryNav = [
    { name: 'Subscriptions', href: '/subscriptions', icon: Users, authRequired: true },
    { name: 'Saved Videos', href: '/saved', icon: Bookmark, authRequired: true },
    { name: 'Watch History', href: '/history', icon: History, authRequired: true },
  ];

  const creatorNav = user ? [
    { name: 'My Channel', href: `/channel/${user.username}`, icon: User },
    { name: 'Creator Studio', href: '/dashboard', icon: LayoutDashboard },
  ] : [];

  return (
    <aside 
      className={`fixed top-14 left-0 bottom-0 bg-[var(--bg-panel)] border-r border-[var(--border)] z-30 transition-all duration-150 flex flex-col justify-between overflow-y-auto ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="py-3 px-2 space-y-4">
        {/* Main Section */}
        <div>
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] font-semibold' 
                      : 'text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && <div className="nav-active-indicator" />}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Library Section */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-[var(--text-low)]">
              Library
            </div>
          )}
          <div className="space-y-0.5">
            {libraryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] font-semibold' 
                      : 'text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && <div className="nav-active-indicator" />}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Creator Section */}
        {creatorNav.length > 0 && (
          <div>
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-[var(--text-low)]">
                Studio
              </div>
            )}
            <div className="space-y-0.5">
              {creatorNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                      isActive 
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-high)] font-semibold' 
                        : 'text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)]'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.name : undefined}
                  >
                    {isActive && <div className="nav-active-indicator" />}
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Moderation if admin */}
        {user?.role === 'admin' && (
          <div>
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-[var(--accent)]">
                Administration
              </div>
            )}
            <Link
              href="/admin/moderation"
              className={`relative flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                pathname === '/admin/moderation'
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent)] font-semibold'
                  : 'text-[var(--accent)] hover:bg-[var(--bg-elevated)]'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? 'Admin Moderation' : undefined}
            >
              {pathname === '/admin/moderation' && <div className="nav-active-indicator" />}
              <ShieldAlert className="w-4 h-4 shrink-0 text-[var(--accent)]" />
              {!collapsed && <span>Moderation Queue</span>}
            </Link>
          </div>
        )}
      </div>

      {/* Footer / Settings */}
      <div className="p-2 border-t border-[var(--border)]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs text-[var(--text-mid)] hover:text-[var(--text-high)] hover:bg-[var(--bg-elevated)] transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
