import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from './CommandPalette';
import ToastContainer from './ToastContainer';
import FloatingChatDrawer from '../chat/FloatingChatDrawer';

export const AppLayout = ({ activeTab, setActiveTab, children }) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans overflow-hidden">
      {/* Toast Notifications Overlay */}
      <ToastContainer />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onQuickCreate={() => setActiveTab('projects')}
      />

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onQuickAction={() => setActiveTab('projects')}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Floating Realtime Chat Drawer */}
      <FloatingChatDrawer />
    </div>
  );
};

export default AppLayout;
