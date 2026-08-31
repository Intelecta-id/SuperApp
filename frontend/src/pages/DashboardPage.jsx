import React from 'react';
import {
  TrendingUp,
  FolderKanban,
  MessageSquareShare,
  LifeBuoy,
  Building2,
  ArrowUpRight,
  Sparkles,
  Layers,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { useChat } from '../contexts/ChatContext';

export const DashboardPage = ({ onNavigate, onQuickCreate }) => {
  const { clients, projects, tasks, leads, invoices, tickets } = useApi();
  const { openChatWithChannel } = useChat();

  const totalContractValue = projects.reduce((acc, p) => acc + (p.contract_value || 0), 0);
  const totalPaidRevenue = invoices
    .filter((inv) => inv.payment_status === 'paid')
    .reduce((acc, inv) => acc + (inv.total_payable || 0), 0);
  const totalPendingInvoices = invoices
    .filter((inv) => inv.payment_status !== 'paid')
    .reduce((acc, inv) => acc + (inv.total_payable || 0), 0);

  const activeProjects = projects.filter((p) => p.status === 'active_sprint' || p.status === 'scoping' || p.status === 'uat');
  const newLeads = leads.filter((l) => l.status === 'new');
  const criticalTickets = tickets.filter((t) => t.priority === 'critical_sla_1hr' && t.status !== 'resolved' && t.status !== 'closed');

  const webDevCount = projects.filter((p) => p.category === 'web_development').length;
  const mobileDevCount = projects.filter((p) => p.category === 'mobile_app_development').length;
  const webAppDevCount = projects.filter((p) => p.category === 'webapp_development').length;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">INTELECTA INTERNAL OPERATIONS</span>
            <span className="text-xs font-mono text-zinc-400">• Command Center v1.0</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-sm text-zinc-400">
            Pusat kendali direktori klien, sprint aktif 3 layanan inti, omnichannel leads, dan SLA ticketing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('omnichannel')}
            className="px-4 py-2 rounded-xl bg-[#0D0D11] hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-white/5 transition-all flex items-center gap-2"
          >
            <MessageSquareShare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Omnichannel Inbox ({newLeads.length})</span>
          </button>
          <button
            onClick={onQuickCreate}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold transition-all shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Proyek / Klien Baru</span>
          </button>
        </div>
      </div>

      {/* Critical SLA Alert Banner (If Any Critical Ticket) */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-300 font-heading">
                🚨 CRITICAL SLA INCIDENT DETECTED ({criticalTickets[0].ticket_code})
              </div>
              <div className="text-xs text-rose-200/80">
                {criticalTickets[0].title} — Target resolusi SLA 60 menit.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('helpdesk')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
          >
            Buka Incident Room
          </button>
        </div>
      )}

      {/* Bento Grid KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contracted Value */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium font-sans">Total Nilai Kontrak</span>
            <TrendingUp className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-white">
            Rp {(totalContractValue / 1000000).toLocaleString('id-ID')} Juta
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Terbayar: Rp {(totalPaidRevenue / 1000000).toLocaleString('id-ID')}jt</span>
            <span className="text-emerald-400 font-semibold">Active Run</span>
          </div>
        </div>

        {/* Active Projects & 3 Core Offerings */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium font-sans">Proyek Digital Aktif</span>
            <FolderKanban className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-white">
            {activeProjects.length} <span className="text-sm font-normal text-zinc-400">Proyek</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Web: {webDevCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Mobile: {mobileDevCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">WebApp: {webAppDevCount}</span>
          </div>
        </div>

        {/* Omnichannel Inbound Rate */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium font-sans">Inbound Leads Omnichannel</span>
            <MessageSquareShare className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-white">
            {leads.length} <span className="text-sm font-normal text-emerald-400 font-sans">({newLeads.length} Baru)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>Instagram & Web Form</span>
            <span className="text-blue-400">AI Auto-Assisted</span>
          </div>
        </div>

        {/* SLA Compliance & Health */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium font-sans">Kepatuhan SLA Helpdesk</span>
            <LifeBuoy className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-white">
            99.4% <span className="text-sm font-normal text-zinc-400 font-mono">On-Time</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Open: {tickets.filter((t) => t.status === 'open').length} Tiket</span>
            <span className="text-emerald-400">SLA 1 Jam Ready</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Sprints Kanban Summary & Live Omnichannel Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Sprints & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sprints Section */}
          <div className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-base text-white">Sprint & Delivery Tracker</h2>
                <p className="text-xs text-zinc-400">Pengerjaan sprint aktif untuk 3 portofolio layanan digital Intelecta.</p>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1 transition-colors"
              >
                <span>Buka Board Lengkap</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => {
                  const projectTasks = tasks.filter((t) => t.project_id === project.id);
                  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
                  const progressPct = projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 40;

                  const categoryIcons = {
                    web_development: <Globe className="w-4 h-4 text-blue-400" />,
                    mobile_app_development: <Smartphone className="w-4 h-4 text-purple-400" />,
                    webapp_development: <Layers className="w-4 h-4 text-emerald-400" />,
                  };

                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl bg-[#14141B] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-zinc-900 border border-white/5 shrink-0 mt-0.5">
                          {categoryIcons[project.category] || <Layers className="w-4 h-4 text-zinc-400" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {project.project_code}
                            </span>
                            <span className="text-xs font-semibold text-zinc-200 truncate">{project.title}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-3 font-mono">
                            <span>Klien: {project.client?.company_name || 'B2B Client'}</span>
                            <span>•</span>
                            <span>Rp {(project.contract_value / 1000000).toLocaleString('id-ID')}jt</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                            <span>Progress</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white"
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          onClick={() => openChatWithChannel(`proj_${project.project_code}`)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
                        >
                          Diskusi
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-xl bg-[#14141B]/40 border border-dashed border-white/5 text-center text-xs text-zinc-500 font-mono">
                  Belum ada proyek aktif. Klik tombol <span className="text-white">"Buat Proyek Baru"</span> di atas untuk menambahkan portofolio.
                </div>
              )}
            </div>
          </div>

          {/* Quick Tasks Grid */}
          <div className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-base text-white">Sprint Tasks Prioritas Tinggi</h2>
              <span className="text-xs font-mono text-zinc-400">{tasks.length} Total Tasks</span>
            </div>
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-3.5 rounded-xl bg-[#14141B] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">{task.project_code}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                          task.status === 'done'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-zinc-200 leading-snug">{task.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/5 font-mono">
                      <span>{task.assignee?.name || 'Unassigned'}</span>
                      <span>{task.story_points} SP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#14141B]/40 border border-dashed border-white/5 text-center text-xs text-zinc-500 font-mono">
                Belum ada task sprint yang tercatat.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Omnichannel Stream & 3 Core Offerings Showcase */}
        <div className="space-y-6">
          {/* Omnichannel Inquiries Feed */}
          <div className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquareShare className="w-4 h-4 text-emerald-400" />
                <h2 className="font-heading font-bold text-base text-white">Live Inbound Leads</h2>
              </div>
              <button
                onClick={() => onNavigate('omnichannel')}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Semua ({leads.length})
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {leads.length > 0 ? (
                leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onNavigate('omnichannel')}
                    className="p-3.5 rounded-xl bg-[#14141B] border border-white/5 hover:border-white/15 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                          {lead.source.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          {lead.sender_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Score: {(lead.ai_sentiment_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{lead.initial_message}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-xl bg-[#14141B]/40 border border-dashed border-white/5 text-center text-xs text-zinc-500 font-mono">
                  Belum ada pesan inbound lead masuk.
                </div>
              )}
            </div>
          </div>

          {/* Core Services Capability Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#14141B] to-[#0A0A0E] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <h3 className="font-heading font-bold text-sm text-white">3 Layanan Inti Intelecta</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">1. Web Development</div>
                  <div className="text-[11px] text-zinc-400">Company Profile, E-Commerce, Landing Pages</div>
                </div>
                <Globe className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">2. Mobile App Development</div>
                  <div className="text-[11px] text-zinc-400">iOS & Android via Flutter & Native</div>
                </div>
                <Smartphone className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">3. Web App Development</div>
                  <div className="text-[11px] text-zinc-400">SaaS Platforms, Custom ERP, Portals</div>
                </div>
                <Layers className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
