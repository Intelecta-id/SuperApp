'use client';

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
  LogOut,
} from 'lucide-react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { leads, tickets } = useApi();
  const { user, logout } = useAuth();

  const newLeadsCount = (leads || []).filter((l) => l.status === 'new').length;
  const criticalTicketsCount = (tickets || []).filter(
    (t) => (t.priority === 'critical' || t.priority === 'critical_sla_1hr') && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'omnichannel',
      label: 'Omnichannel CRM',
      icon: MessageSquareShare,
      badge: newLeadsCount > 0 ? newLeadsCount : null,
    },
    { id: 'clients', label: 'Direktori Klien', icon: Building2 },
    { id: 'projects', label: 'Proyek & Kanban', icon: FolderKanban },
    { id: 'financial', label: 'Finansial & Invoice', icon: Receipt },
    { id: 'team', label: 'Tim & Talent', icon: Users2 },
    {
      id: 'helpdesk',
      label: 'SLA Helpdesk',
      icon: LifeBuoy,
      badge: criticalTicketsCount > 0 ? `${criticalTicketsCount} P1` : null,
      badgeAlert: criticalTicketsCount > 0,
    },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-coal-900 border-r border-coal-700 flex flex-col h-screen select-none shrink-0 font-sans">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-coal-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-coal-800 border border-coal-600 flex items-center justify-center p-1 shrink-0">
            <img src="/images/logo.png" alt="Intelecta" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs tracking-wider text-lightgray-100">INTELECTA</span>
              <span className="text-[9px] px-1 py-0.2 bg-coal-800 text-coal-400 font-mono border border-coal-700">OS</span>
            </div>
            <span className="text-[10px] text-coal-400 font-mono">Operations Console</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-coal-500 font-semibold">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors group ${
                isActive
                  ? 'bg-coal-800 text-lightgray-100 border-l-2 border-lightgray-200 font-medium'
                  : 'text-coal-400 hover:text-lightgray-200 hover:bg-coal-850 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-lightgray-100' : 'text-coal-500 group-hover:text-lightgray-300'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                    item.badgeAlert
                      ? 'bg-coal-800 text-lightgray-100 border-lightgray-400 font-bold'
                      : 'bg-coal-850 text-lightgray-300 border-coal-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-coal-700 bg-coal-950">
        <div className="flex items-center justify-between p-2 bg-coal-900 border border-coal-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Operator'}
                className="w-7 h-7 object-cover border border-coal-600"
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-lightgray-200 border border-coal-900"></span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-lightgray-200 truncate">{user?.name || 'Fabian S.'}</div>
              <div className="text-[10px] text-coal-400 font-mono truncate">{user?.email || 'admin@intelecta.id'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Keluar (Logout)"
            className="p-1 text-coal-400 hover:text-lightgray-100 hover:bg-coal-800 border border-transparent hover:border-coal-600 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
