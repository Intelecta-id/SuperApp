'use client';

import React from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  Plus,
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export const Header = ({ onOpenCommandPalette, onQuickAction }) => {
  const { isOpen, setIsOpen, channels } = useChat();

  const totalUnreadChat = (channels || []).reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <header className="h-14 bg-coal-900 border-b border-coal-700 px-6 flex items-center justify-between sticky top-0 z-30 rounded-none">
      {/* Search & Command Palette Bar */}
      <div className="flex items-center gap-3 w-1/3">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-none bg-coal-850 border border-coal-700 text-coal-300 hover:border-coal-500 hover:text-lightgray-200 transition-colors text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-coal-400 group-hover:text-lightgray-200" />
            <span className="text-coal-400 font-sans tracking-tight">Cari klien, proyek, task, leads...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-coal-800 border border-coal-600 text-lightgray-300 rounded-none">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Center/Right Status & Action Widgets */}
      <div className="flex items-center gap-3">
        {/* System Uptime Health Pulse */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-none bg-coal-850 border border-coal-700 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="inline-flex rounded-none h-2 w-2 bg-lightgray-300"></span>
          </span>
          <span className="text-coal-400 text-[11px]">Supabase:</span>
          <span className="text-lightgray-100 font-semibold text-[11px]">Connected</span>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold tracking-tight transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Entitas</span>
        </button>

        {/* Realtime Chat Drawer Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-none border transition-colors ${
            isOpen
              ? 'bg-coal-800 border-lightgray-500 text-lightgray-100'
              : 'bg-coal-850 border-coal-700 text-coal-300 hover:text-lightgray-100 hover:border-coal-500'
          }`}
          title="Buka Realtime Chat Drawer"
        >
          <MessageSquare className="w-4 h-4" />
          {totalUnreadChat > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 bg-lightgray-100 text-[10px] font-mono text-coal-950 rounded-none flex items-center justify-center font-bold border border-coal-900">
              {totalUnreadChat}
            </span>
          )}
        </button>

        {/* Notification Bell */}
        <button className="p-2 rounded-none bg-coal-850 border border-coal-700 text-coal-300 hover:text-lightgray-100 hover:border-coal-500 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
