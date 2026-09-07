'use client';

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from './CommandPalette';

export const AppLayout = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab, children }) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const pathname = usePathname() || '/';
  const router = useRouter();

  const derivedTab = useMemo(() => {
    if (propActiveTab) return propActiveTab;
    if (pathname === '/') return 'dashboard';
    const segment = pathname.split('/')[1];
    return segment || 'dashboard';
  }, [pathname, propActiveTab]);

  const handleNavigate = (tabId) => {
    if (propSetActiveTab) {
      propSetActiveTab(tabId);
    }
    const targetPath = tabId === 'dashboard' ? '/' : `/${tabId}`;
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  return (
    <div className="flex h-screen bg-coal-950 text-lightgray-100 font-sans overflow-hidden rounded-none">
      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onQuickCreate={() => handleNavigate('projects')}
      />

      {/* Sidebar Navigation */}
      <Sidebar activeTab={derivedTab} setActiveTab={handleNavigate} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-coal-950">
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onQuickAction={() => handleNavigate('projects')}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-coal-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
