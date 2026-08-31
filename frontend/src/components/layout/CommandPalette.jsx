import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  FolderKanban,
  MessageSquareShare,
  LifeBuoy,
  Plus,
  ArrowRight,
  X,
  Receipt,
  Users2,
} from 'lucide-react';
import { useApi } from '../../contexts/ApiContext';
import { useChat } from '../../contexts/ChatContext';

export const CommandPalette = ({ isOpen, onClose, onNavigate, onQuickCreate }) => {
  const { clients, projects, leads, tickets } = useApi();
  const { openChatWithChannel } = useChat();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const filteredClients = clients.filter((c) =>
    c.company_name.toLowerCase().includes(q) || c.pic_name.toLowerCase().includes(q)
  );

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(q) || p.project_code.toLowerCase().includes(q)
  );

  const filteredLeads = leads.filter((l) =>
    l.sender_name.toLowerCase().includes(q) || (l.company_name && l.company_name.toLowerCase().includes(q))
  );

  const filteredTickets = tickets.filter((t) =>
    t.ticket_code.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
  );

  const handleSelect = (tab, actionCallback) => {
    if (actionCallback) {
      actionCallback();
    }
    if (tab) {
      onNavigate(tab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#14141B]">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Ketik nama klien, kode proyek, lead Instagram, atau perintah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm outline-none font-sans"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs custom-scrollbar">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Aksi Cepat
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSelect('projects', onQuickCreate)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-zinc-300 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Buat Klien atau Proyek Baru</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => handleSelect('omnichannel')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-zinc-300 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                    <MessageSquareShare className="w-3.5 h-3.5" />
                  </div>
                  <span>Buka Omnichannel Inbox (Instagram DM & Web Leads)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Proyek Digital ({filteredProjects.length})</span>
                <FolderKanban className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                {filteredProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('projects')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-zinc-300 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800">
                        {p.project_code}
                      </span>
                      <span className="font-medium text-zinc-200 group-hover:text-white">{p.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Rp {(p.contract_value / 1000000).toFixed(0)}jt
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Klien B2B ({filteredClients.length})</span>
                <Building2 className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                {filteredClients.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('clients')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-zinc-300 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      <div>
                        <div className="font-medium text-zinc-200">{c.company_name}</div>
                        <div className="text-[10px] text-zinc-400">PIC: {c.pic_name} ({c.industry || 'B2B'})</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">{c.projects_count || 1} Proyek</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inbound Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Omnichannel Leads ({filteredLeads.length})</span>
                <MessageSquareShare className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                {filteredLeads.slice(0, 3).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect('omnichannel')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-zinc-300 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                        {l.source.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-zinc-200">{l.sender_name}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 truncate max-w-xs">{l.initial_message}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-white/5 bg-[#08080C] px-4 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigasi</span>
            <span>↵ Buka</span>
            <span>ESC Tutup</span>
          </div>
          <span>Intelecta OS Core Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
