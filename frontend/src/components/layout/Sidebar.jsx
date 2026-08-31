import React from 'react';
import {
  LayoutDashboard,
  MessageSquareShare,
  Building2,
  FolderKanban,
  Receipt,
  Users2,
  LifeBuoy,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { leads, tickets } = useApi();
  const { user, logout } = useAuth();

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const criticalTicketsCount = tickets.filter(
    (t) => t.priority === 'critical_sla_1hr' && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'omnichannel',
      label: 'Omnichannel',
      icon: MessageSquareShare,
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    { id: 'clients', label: 'Direktori Klien', icon: Building2 },
    { id: 'projects', label: 'Proyek & Kanban', icon: FolderKanban },
    { id: 'financial', label: 'Finansial & Invoicing', icon: Receipt },
    { id: 'team', label: 'Talent & /tim Sync', icon: Users2 },
    {
      id: 'helpdesk',
      label: 'SLA Helpdesk',
      icon: LifeBuoy,
      badge: criticalTicketsCount > 0 ? `${criticalTicketsCount} P1 SLA` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse',
    },
    { id: 'settings', label: 'Integrasi & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#07070A] border-r border-white/5 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D0D11] border border-white/10 flex items-center justify-center overflow-hidden p-1 shadow-md shrink-0">
            <img src="/images/logo.png" alt="Intelecta Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm tracking-tight text-white">INTELECTA</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-medium">OS</span>
            </div>
            <span className="text-[11px] text-zinc-400 block -mt-0.5">Operations & Client Hub</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase text-zinc-400 font-semibold">
          Core Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-zinc-800/80 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 3 Core Services Indicator */}
        <div className="pt-5 px-3">
          <div className="p-3 rounded-xl bg-[#0D0D11] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[11px] font-semibold text-zinc-300 font-heading">3 Layanan Inti</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-400 font-sans">
              <div className="flex items-center justify-between">
                <span>• Web Development</span>
                <span className="font-mono text-[10px] text-zinc-400">Next.js 15</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Mobile App Dev</span>
                <span className="font-mono text-[10px] text-zinc-400">Flutter</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Web App Dev</span>
                <span className="font-mono text-[10px] text-zinc-400">SaaS Core</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-white/5 bg-[#0A0A0E]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#14141B]/60 border border-white/5 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Operator'}
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0A0A0E]"></span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Operator Intelecta'}</div>
              <div className="text-[10px] text-zinc-400 font-mono truncate">{user?.email || 'admin@intelecta.id'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Keluar dari sesi (Logout)"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
