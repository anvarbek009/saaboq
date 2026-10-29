'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // On watch page, collapse sidebar by default to maximize theater viewing
  const isWatchPage = pathname.startsWith('/watch/');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isWatchPage);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex pt-0">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <main 
          className={`flex-1 transition-all duration-150 p-4 sm:p-6 max-w-7xl mx-auto w-full ${
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
