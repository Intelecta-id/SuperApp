import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  FolderKanban,
  User,
  Search,
  X,
  MessageSquare,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const HelpdeskPage = () => {
  const { tickets, clients, projects, team, addTicket, updateTicket, addTicketReply } = useApi();
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || 1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // New ticket form state
  const [ticketForm, setTicketForm] = useState({
    client_id: clients[0]?.id || 1,
    project_id: projects[0]?.id || 1,
    title: '',
    description: '',
    priority: 'medium',
    assigned_engineer_id: team[0]?.id || 1,
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId || t.uuid === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const criticalTickets = tickets.filter(
    (t) => t.priority === 'critical_sla_1hr' && t.status !== 'resolved' && t.status !== 'closed'
  );

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addTicket(ticketForm);
    setShowCreateModal(false);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    addTicketReply(selectedTicket.id, replyMessage, isInternalNote);
    setReplyMessage('');
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    updateTicket(selectedTicket.id, { status: newStatus });
  };

  const priorityBadges = {
    critical_sla_1hr: { label: 'P1 CRITICAL (1 Jam SLA)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' },
    high: { label: 'High Priority', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    medium: { label: 'Medium', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    low: { label: 'Low', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">INCIDENT COMMAND & SLA SLA-1HR</span>
            <span className="text-xs font-mono text-zinc-400">• Enterprise Support</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            SLA Helpdesk & Incident Room
          </h1>
          <p className="text-xs text-zinc-400">
            Penanganan insiden produksi, pelacakan kepatuhan SLA 60 menit, dan Root Cause Analysis (RCA) logger.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tiket SLA Baru</span>
        </button>
      </div>

      {/* Critical SLA Alert Banner */}
      {criticalTickets.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-[#0D0D11] border border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                  SLA CRITICAL ACTIVE
                </span>
                <span className="font-heading font-bold text-sm text-white">{criticalTickets[0].ticket_code}</span>
              </div>
              <h3 className="font-bold text-sm text-rose-200 mt-1">{criticalTickets[0].title}</h3>
              <p className="text-xs text-rose-300/80">{criticalTickets[0].description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 text-right">
              <div className="text-[10px] text-zinc-400 font-mono">Sisa Waktu SLA</div>
              <div className="text-xl font-mono font-extrabold text-rose-400">42m : 18s</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D11] border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Semua Prioritas' },
            { id: 'critical_sla_1hr', label: 'P1 Critical SLA 1hr' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' },
          ].map((pr) => (
            <button
              key={pr.id}
              onClick={() => setPriorityFilter(pr.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                priorityFilter === pr.id
                  ? 'bg-zinc-800 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {['all', 'open', 'investigating', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                statusFilter === st ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Tickets List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicket?.id;
              const priority = priorityBadges[ticket.priority] || priorityBadges.medium;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-zinc-800/90 border-white/20 shadow-md ring-1 ring-white/10'
                      : 'bg-[#0D0D11] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-200">
                      {ticket.ticket_code}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-xs text-white leading-snug">{ticket.title}</h4>

                  <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                    <span>{ticket.client?.company_name || 'PT Klien'}</span>
                    <span>•</span>
                    <span>{ticket.project?.project_code || 'General'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/5 font-mono">
                    <span>PIC: {ticket.assigned_engineer?.name || 'Unassigned'}</span>
                    <span className="capitalize">{ticket.status}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-2xl bg-[#0D0D11] border border-dashed border-white/10 text-center text-xs text-zinc-500 font-mono">
              Belum ada tiket insiden atau komplain SLA.
            </div>
          )}
        </div>

        {/* Right 7 Cols: Ticket Incident Room & Investigation */}
        <div className="lg:col-span-7 bg-[#0D0D11] border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div className="space-y-4">
                {/* Header & Status Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {selectedTicket.ticket_code}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Status: {selectedTicket.status}</span>
                    </div>
                    <h2 className="font-heading font-bold text-base text-white mt-1">{selectedTicket.title}</h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['open', 'investigating', 'resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                          selectedTicket.status === st
                            ? 'bg-white text-zinc-950 font-bold'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-xl bg-[#14141B] border border-white/5 space-y-2 text-xs">
                  <div className="text-zinc-400 font-mono text-[11px]">Deskripsi Insiden & Kendala</div>
                  <p className="text-zinc-200 leading-relaxed font-sans">{selectedTicket.description}</p>
                </div>

                {/* Replies / Notes Thread */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Log Investigasi & Catatan Engineer ({selectedTicket.replies?.length || 0})
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedTicket.replies?.map((rep, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#14141B] border border-white/5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                          <span>{rep.user?.name || 'Engineer'}</span>
                          <span>{new Date(rep.created_at || Date.now()).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-zinc-300">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <form onSubmit={handleReplySubmit} className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tulis catatan investigasi atau update progress insiden..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#14141B] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center text-zinc-500 text-xs py-16">
              Pilih tiket dari daftar di samping untuk melihat rincian SLA.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-base text-white">Buat Tiket SLA Helpdesk Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Klien B2B *</label>
                  <select
                    value={ticketForm.client_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, client_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Proyek Terkait *</label>
                  <select
                    value={ticketForm.project_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, project_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_code} - {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Judul Insiden / Masalah *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  placeholder="Gateway API Connection Timeout pada Sandbox..."
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Deskripsi Detail Masalah & Error Log</label>
                <textarea
                  rows={3}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Prioritas & SLA Level *</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-semibold"
                  >
                    <option value="low">Low Priority (72 Jam)</option>
                    <option value="medium">Medium Priority (24 Jam)</option>
                    <option value="high">High Priority (4 Jam)</option>
                    <option value="critical_sla_1hr">🚨 P1 CRITICAL (60 MENIT SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Tugaskan Engineer</label>
                  <select
                    value={ticketForm.assigned_engineer_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, assigned_engineer_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    {team.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold"
                >
                  Buat Tiket SLA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpdeskPage;
