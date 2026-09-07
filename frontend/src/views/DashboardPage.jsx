'use client';

import React from 'react';
import {
  TrendingUp,
  FolderKanban,
  MessageSquareShare,
  LifeBuoy,
  ArrowUpRight,
  Plus,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const DashboardPage = ({ onNavigate, onQuickCreate }) => {
  const { clients, projects, tasks, leads, invoices, tickets } = useApi();

  const totalContractValue = (projects || []).reduce((acc, p) => acc + (Number(p.contract_value) || 0), 0);
  const totalPaidRevenue = (invoices || [])
    .filter((inv) => inv.payment_status === 'paid')
    .reduce((acc, inv) => acc + (Number(inv.total_payable || inv.amount) || 0), 0);

  const activeProjects = (projects || []).filter((p) => p.status === 'active_sprint' || p.status === 'scoping' || p.status === 'uat');
  const newLeads = (leads || []).filter((l) => l.status === 'new');
  const criticalTickets = (tickets || []).filter(
    (t) => (t.priority === 'critical' || t.priority === 'critical_sla_1hr') && t.status !== 'resolved' && t.status !== 'closed'
  );

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Dashboard Operasional
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Ringkasan proyek aktif, pipeline klien, antrean leads omnichannel, dan status helpdesk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('omnichannel')}
            className="px-3 py-1.5 bg-coal-850 hover:bg-coal-800 text-xs font-medium text-lightgray-200 border border-coal-700 hover:border-coal-600 transition-colors flex items-center gap-2"
          >
            <MessageSquareShare className="w-3.5 h-3.5 text-coal-400" />
            <span>Inbox Leads ({newLeads.length})</span>
          </button>
          <button
            onClick={onQuickCreate}
            className="px-3 py-1.5 bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Critical SLA Incident Bar (Only when exists) */}
      {criticalTickets.length > 0 && (
        <div className="p-3.5 bg-coal-900 border border-coal-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-lightgray-200 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-lightgray-100">
                Insiden Kritis SLA ({criticalTickets[0].ticket_number || criticalTickets[0].ticket_code}):
              </span>{' '}
              <span className="text-xs text-coal-300">{criticalTickets[0].title}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('helpdesk')}
            className="px-2.5 py-1 bg-lightgray-100 text-coal-950 text-xs font-bold hover:bg-white transition-colors"
          >
            Buka Tiket
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-coal-900 border border-coal-700">
          <div className="text-[11px] font-mono text-coal-400 uppercase">Nilai Kontrak Pipeline</div>
          <div className="text-xl font-bold font-mono text-lightgray-100 mt-1">
            Rp {(totalContractValue / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[10px] text-coal-400 font-mono mt-1">
            Terbayar: Rp {(totalPaidRevenue / 1000000).toLocaleString('id-ID')} Jt
          </div>
        </div>

        <div className="p-4 bg-coal-900 border border-coal-700">
          <div className="text-[11px] font-mono text-coal-400 uppercase">Proyek Berjalan</div>
          <div className="text-xl font-bold font-mono text-lightgray-100 mt-1">
            {activeProjects.length}{' '}
            <span className="text-xs font-normal text-coal-400 font-sans">dari {(projects || []).length} proyek</span>
          </div>
          <div className="text-[10px] text-coal-400 font-mono mt-1">
            {(tasks || []).filter((t) => t.status === 'in_progress').length} tasks in progress
          </div>
        </div>

        <div className="p-4 bg-coal-900 border border-coal-700">
          <div className="text-[11px] font-mono text-coal-400 uppercase">Leads Omnichannel</div>
          <div className="text-xl font-bold font-mono text-lightgray-100 mt-1">
            {(leads || []).length}{' '}
            <span className="text-xs font-normal text-lightgray-300 font-sans">({newLeads.length} belum direspon)</span>
          </div>
          <div className="text-[10px] text-coal-400 font-mono mt-1">
            Instagram & Form Web
          </div>
        </div>

        <div className="p-4 bg-coal-900 border border-coal-700">
          <div className="text-[11px] font-mono text-coal-400 uppercase">Tiket Helpdesk</div>
          <div className="text-xl font-bold font-mono text-lightgray-100 mt-1">
            {(tickets || []).filter((t) => t.status === 'open').length}{' '}
            <span className="text-xs font-normal text-coal-400 font-sans">open</span>
          </div>
          <div className="text-[10px] text-coal-400 font-mono mt-1">
            Target SLA 60 menit
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Active Projects & Sprints */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Projects Table */}
          <div className="bg-coal-900 border border-coal-700">
            <div className="px-4 py-3 border-b border-coal-700 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold text-lightgray-200 uppercase tracking-wider">
                Proyek Digital Berjalan
              </h2>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-coal-400 hover:text-lightgray-100 font-mono flex items-center gap-1 transition-colors"
              >
                <span>Semua Proyek</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-coal-800">
              {(projects || []).length > 0 ? (
                projects.slice(0, 5).map((proj) => {
                  const pTasks = (tasks || []).filter((t) => t.project_id === proj.id);
                  const completedCount = pTasks.filter((t) => t.status === 'done').length;
                  const progressPct = pTasks.length ? Math.round((completedCount / pTasks.length) * 100) : 0;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => onNavigate('projects')}
                      className="p-3.5 hover:bg-coal-850 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] px-1 py-0.2 bg-coal-800 text-coal-300 border border-coal-700">
                            {proj.project_code || 'PRJ'}
                          </span>
                          <span className="text-xs font-semibold text-lightgray-100 truncate">{proj.title}</span>
                        </div>
                        <div className="text-[11px] text-coal-400 mt-1 flex items-center gap-3">
                          <span>{proj.client?.company_name || 'Klien B2B'}</span>
                          <span>•</span>
                          <span className="font-mono">Rp {(Number(proj.contract_value || 0) / 1000000).toLocaleString('id-ID')} Jt</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-24 text-right">
                          <div className="text-[10px] font-mono text-coal-400 mb-1">{progressPct}% Selesai</div>
                          <div className="w-full h-1 bg-coal-800 border border-coal-700">
                            <div className="h-full bg-lightgray-300" style={{ width: `${progressPct}%` }}></div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 uppercase bg-coal-800 text-coal-300 border border-coal-700">
                          {proj.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-coal-400 font-mono">
                  Belum ada proyek terdaftar.
                </div>
              )}
            </div>
          </div>

          {/* Active Tasks Backlog */}
          <div className="bg-coal-900 border border-coal-700">
            <div className="px-4 py-3 border-b border-coal-700 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold text-lightgray-200 uppercase tracking-wider">
                Task Sprint Berjalan
              </h2>
              <span className="text-xs font-mono text-coal-400">{(tasks || []).length} Total</span>
            </div>

            <div className="divide-y divide-coal-800">
              {(tasks || []).length > 0 ? (
                tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-lightgray-200 truncate">{task.title}</div>
                      <div className="text-[10px] text-coal-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{task.project_code || 'PRJ'}</span>
                        <span>•</span>
                        <span>{task.assignee?.name || 'Assigned'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                      <span className="text-coal-400">{task.story_points || 3} SP</span>
                      <span className="px-1.5 py-0.2 bg-coal-800 border border-coal-700 text-lightgray-300 uppercase">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-coal-400 font-mono">
                  Belum ada task aktif di sprint.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Omnichannel Queue & Helpdesk */}
        <div className="lg:col-span-5 space-y-5">
          {/* Omnichannel Leads Inflow */}
          <div className="bg-coal-900 border border-coal-700">
            <div className="px-4 py-3 border-b border-coal-700 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold text-lightgray-200 uppercase tracking-wider">
                Inbound Leads Terbaru
              </h2>
              <button
                onClick={() => onNavigate('omnichannel')}
                className="text-xs text-coal-400 hover:text-lightgray-100 font-mono flex items-center gap-1 transition-colors"
              >
                <span>Buka Triage</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-coal-800">
              {(leads || []).length > 0 ? (
                leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onNavigate('omnichannel')}
                    className="p-3.5 hover:bg-coal-850 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1 py-0.2 bg-coal-800 border border-coal-700 text-lightgray-300 uppercase">
                          {lead.source}
                        </span>
                        <span className="text-xs font-medium text-lightgray-100 truncate">
                          {lead.client_name || lead.sender_name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-coal-400 uppercase">{lead.status}</span>
                    </div>
                    <p className="text-xs text-coal-400 line-clamp-2 leading-relaxed">
                      {lead.notes || lead.initial_message || 'Inbound prospect message.'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-coal-400 font-mono">
                  Belum ada pesan inbound lead masuk.
                </div>
              )}
            </div>
          </div>

          {/* Quick Technical Status */}
          <div className="p-4 bg-coal-900 border border-coal-700 space-y-3">
            <div className="text-[11px] font-mono uppercase text-coal-400 tracking-wider">
              Status Infrastruktur & Data
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-coal-950 border border-coal-800">
                <span className="text-coal-400">Database (PostgreSQL)</span>
                <span className="text-lightgray-200">Supabase Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-coal-950 border border-coal-800">
                <span className="text-coal-400">Frontend Engine</span>
                <span className="text-lightgray-200">Next.js 15 App Router</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-coal-950 border border-coal-800">
                <span className="text-coal-400">Realtime Channel</span>
                <span className="text-lightgray-200">Supabase Websockets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
