import React from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  Activity,
  Command,
  Plus,
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export const Header = ({ onOpenCommandPalette, onQuickAction }) => {
  const { isOpen, setIsOpen, channels } = useChat();

  const totalUnreadChat = channels.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <header className="h-16 bg-[#030303]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search & Command Palette Bar */}
      <div className="flex items-center gap-3 w-1/3">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0D0D11] border border-white/5 text-zinc-400 hover:border-white/15 hover:text-zinc-300 transition-all text-xs group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-300" />
            <span className="text-zinc-400 font-sans">Cari klien, proyek, leads, atau perintah...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-white/10 text-zinc-400 rounded-md">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Center/Right Status & Action Widgets */}
      <div className="flex items-center gap-3">
        {/* System Uptime Health Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0D11] border border-white/5 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-400 text-[11px]">System Status:</span>
          <span className="text-emerald-400 font-semibold text-[11px]">99.99% Live</span>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Entitas</span>
        </button>

        {/* Realtime Chat Drawer Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-xl border transition-all ${
            isOpen
              ? 'bg-zinc-800 border-white/20 text-white'
              : 'bg-[#0D0D11] border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
          }`}
          title="Buka Realtime Chat Drawer"
        >
          <MessageSquare className="w-4 h-4" />
          {totalUnreadChat > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-[10px] font-mono text-white rounded-full flex items-center justify-center font-bold ring-2 ring-[#030303]">
              {totalUnreadChat}
            </span>
          )}
        </button>

        {/* Notification Bell */}
        <button className="p-2 rounded-xl bg-[#0D0D11] border border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15 transition-all">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
