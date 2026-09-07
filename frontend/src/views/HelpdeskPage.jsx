'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  ShieldAlert,
  Send,
  X,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const HelpdeskPage = () => {
  const { tickets, clients, projects, team, addTicket, updateTicket, addTicketReply } = useApi();
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // New ticket form state
  const [ticketForm, setTicketForm] = useState({
    client_id: clients[0]?.id || '',
    project_id: projects[0]?.id || '',
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: team[0]?.id || '',
  });

  const activeTickets = tickets || [];
  const selectedTicket = activeTickets.find((t) => t.id === selectedTicketId) || activeTickets[0] || null;

  const filteredTickets = activeTickets.filter((t) => {
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const criticalTickets = activeTickets.filter(
    (t) => (t.priority === 'critical' || t.priority === 'critical_sla_1hr') && t.status !== 'resolved' && t.status !== 'closed'
  );

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await addTicket(ticketForm);
    setShowCreateModal(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    await addTicketReply(selectedTicket.id, replyMessage, isInternalNote);
    setReplyMessage('');
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    await updateTicket(selectedTicket.id, { status: newStatus });
  };

  const priorityBadges = {
    critical: { label: 'P1 CRITICAL (1 Jam SLA)', border: 'border-coal-500 bg-coal-800 text-lightgray-100 font-bold' },
    critical_sla_1hr: { label: 'P1 CRITICAL (1 Jam SLA)', border: 'border-coal-500 bg-coal-800 text-lightgray-100 font-bold' },
    high: { label: 'High Priority', border: 'border-coal-600 bg-coal-850 text-lightgray-200' },
    medium: { label: 'Medium Priority', border: 'border-coal-700 bg-coal-850 text-lightgray-300' },
    low: { label: 'Low Priority', border: 'border-coal-700 bg-coal-900 text-coal-400' },
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            SLA Helpdesk
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Penanganan tiket insiden dan pemantauan kepatuhan resolusi SLA klien.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Tiket SLA</span>
        </button>
      </div>

      {/* Critical SLA Alert Banner */}
      {criticalTickets.length > 0 && (
        <div className="p-5 rounded-none bg-coal-900 border-2 border-coal-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100 font-bold uppercase">
                  SLA Critical Active
                </span>
                <span className="font-heading font-bold text-sm text-lightgray-100">
                  {criticalTickets[0].ticket_number || criticalTickets[0].ticket_code}
                </span>
              </div>
              <h3 className="font-bold text-sm text-lightgray-200 mt-1">{criticalTickets[0].title}</h3>
              <p className="text-xs text-coal-400">{criticalTickets[0].description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-none bg-coal-850 border border-coal-700 text-right">
              <div className="text-[10px] text-coal-400 font-mono">SLA Target</div>
              <div className="text-xl font-mono font-extrabold text-lightgray-100">60 Menit</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-none bg-coal-850 border border-coal-700">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Semua Prioritas' },
            { id: 'critical', label: 'P1 Critical' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' },
          ].map((pr) => (
            <button
              key={pr.id}
              onClick={() => setPriorityFilter(pr.id)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider transition-colors ${
                priorityFilter === pr.id
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                  : 'text-coal-400 hover:text-lightgray-200 border border-transparent'
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-none text-[11px] font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                  : 'text-coal-400 hover:text-lightgray-200 border border-transparent'
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
                  className={`p-4 rounded-none border transition-colors cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-coal-800 border-coal-500 shadow-sm'
                      : 'bg-coal-850 border-coal-700 hover:border-coal-600 text-coal-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
                      {ticket.ticket_number || ticket.ticket_code}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-none border ${priority.border} ${priority.bg}`}>
                      {priority.label}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-xs text-lightgray-100 leading-snug">{ticket.title}</h4>

                  <div className="text-[11px] text-coal-400 flex items-center gap-2">
                    <span>{ticket.client?.company_name || 'B2B Client'}</span>
                    <span>•</span>
                    <span>{ticket.project?.project_code || 'General'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-coal-400 pt-2 border-t border-coal-800 font-mono">
                    <span>PIC: {ticket.assigned_to_profile?.name || ticket.assigned_engineer?.name || 'Engineer'}</span>
                    <span className="uppercase">{ticket.status}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-none bg-coal-850 border border-dashed border-coal-700 text-center text-xs text-coal-400 font-mono">
              Belum ada tiket insiden atau komplain SLA.
            </div>
          )}
        </div>

        {/* Right 7 Cols: Ticket Incident Room & Investigation */}
        <div className="lg:col-span-7 bg-coal-850 border border-coal-700 rounded-none p-6 space-y-6 flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div className="space-y-4">
                {/* Header & Status Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-coal-700 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
                        {selectedTicket.ticket_number || selectedTicket.ticket_code}
                      </span>
                      <span className="text-xs text-coal-400 font-mono uppercase">Status: {selectedTicket.status}</span>
                    </div>
                    <h2 className="font-heading font-bold text-base text-lightgray-100 mt-1">{selectedTicket.title}</h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['open', 'in_progress', 'resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-2.5 py-1 rounded-none text-xs font-mono uppercase transition-colors ${
                          selectedTicket.status === st
                            ? 'bg-lightgray-100 text-coal-950 font-bold'
                            : 'bg-coal-800 text-lightgray-300 hover:bg-coal-700 border border-coal-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-none bg-coal-900 border border-coal-700 space-y-2 text-xs">
                  <div className="text-coal-400 font-mono text-[11px] uppercase">Deskripsi Insiden & Kendala</div>
                  <p className="text-lightgray-200 leading-relaxed font-sans">{selectedTicket.description}</p>
                </div>

                {/* Replies / Notes Thread */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-coal-400 uppercase tracking-wider">
                    Log Investigasi & Catatan Tim ({selectedTicket.replies?.length || 0})
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedTicket.replies?.map((rep, idx) => (
                      <div key={idx} className="p-3 rounded-none bg-coal-900 border border-coal-700 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-coal-400 font-mono">
                          <span>{rep.user?.name || rep.sender_name || 'Engineer'}</span>
                          <span>{new Date(rep.created_at || Date.now()).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-lightgray-300">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <form onSubmit={handleReplySubmit} className="pt-4 border-t border-coal-700 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tulis catatan investigasi atau update insiden..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-none bg-coal-900 border border-coal-700 text-xs text-lightgray-100 placeholder-coal-400 outline-none focus:border-coal-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className="px-4 py-2.5 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold disabled:opacity-30 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center text-coal-400 text-xs py-16 font-mono">
              Pilih tiket dari daftar di samping untuk melihat rincian SLA.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <h3 className="font-heading font-bold text-base text-lightgray-100">Buat Tiket SLA Helpdesk Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Klien B2B *</label>
                  <select
                    value={ticketForm.client_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, client_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    {(clients || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Proyek Terkait</label>
                  <select
                    value={ticketForm.project_id}
                    onChange={(e) => setTicketForm({ ...ticketForm, project_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    {(projects || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_code || 'PRJ'} - {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Judul Insiden / Masalah *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  placeholder="Gateway API Connection Timeout pada Sandbox..."
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Deskripsi Detail Masalah & Error Log</label>
                <textarea
                  rows={3}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none resize-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Prioritas & SLA Level *</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-semibold"
                >
                  <option value="low">Low Priority (72 Jam)</option>
                  <option value="medium">Medium Priority (24 Jam)</option>
                  <option value="high">High Priority (4 Jam)</option>
                  <option value="critical">P1 CRITICAL (60 MENIT SLA)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coal-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold"
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
