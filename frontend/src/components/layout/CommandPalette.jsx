'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  FolderKanban,
  MessageSquareShare,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import { useApi } from '../../contexts/ApiContext';

export const CommandPalette = ({ isOpen, onClose, onNavigate, onQuickCreate }) => {
  const { clients, projects, leads, tickets } = useApi();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
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

  const filteredClients = (clients || []).filter((c) =>
    (c.company_name || '').toLowerCase().includes(q) || (c.pic_name || '').toLowerCase().includes(q)
  );

  const filteredProjects = (projects || []).filter((p) =>
    (p.title || '').toLowerCase().includes(q) || (p.project_code || '').toLowerCase().includes(q)
  );

  const filteredLeads = (leads || []).filter((l) =>
    (l.client_name || l.sender_name || '').toLowerCase().includes(q) ||
    (l.company_name || '').toLowerCase().includes(q)
  );

  const filteredTickets = (tickets || []).filter((t) =>
    (t.ticket_number || t.ticket_code || '').toLowerCase().includes(q) ||
    (t.title || '').toLowerCase().includes(q)
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-coal-900 border border-coal-600 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-coal-700 flex items-center gap-3 bg-coal-850">
          <Search className="w-4 h-4 text-coal-400" />
          <input
            type="text"
            placeholder="Cari entitas klien, proyek, lead, ticket atau ketik perintah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-lightgray-100 placeholder-coal-400 text-xs outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs custom-scrollbar">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono uppercase text-coal-400 font-semibold tracking-wider">
              Aksi Cepat
            </div>
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => handleSelect('projects', onQuickCreate)}
                className="w-full flex items-center justify-between p-2 rounded-none hover:bg-coal-800 text-coal-200 hover:text-lightgray-100 text-left transition-colors border border-transparent hover:border-coal-600"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Buat Klien atau Proyek Baru</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-coal-400" />
              </button>
              <button
                onClick={() => handleSelect('omnichannel')}
                className="w-full flex items-center justify-between p-2 rounded-none hover:bg-coal-800 text-coal-200 hover:text-lightgray-100 text-left transition-colors border border-transparent hover:border-coal-600"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100">
                    <MessageSquareShare className="w-3.5 h-3.5" />
                  </div>
                  <span>Buka Omnichannel CRM Inbox</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-coal-400" />
              </button>
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-coal-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Proyek Digital ({filteredProjects.length})</span>
                <FolderKanban className="w-3 h-3 text-coal-400" />
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('projects')}
                    className="w-full flex items-center justify-between p-2 rounded-none hover:bg-coal-800 text-coal-200 hover:text-lightgray-100 text-left transition-colors border border-transparent hover:border-coal-600 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-lightgray-300 px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600">
                        {p.project_code || 'PRJ'}
                      </span>
                      <span className="font-medium text-lightgray-200 group-hover:text-white">{p.title}</span>
                    </div>
                    <span className="text-[11px] text-coal-400 font-mono">
                      Rp {((Number(p.contract_value) || 0) / 1000000).toFixed(0)}jt
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-coal-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Klien B2B ({filteredClients.length})</span>
                <Building2 className="w-3 h-3 text-coal-400" />
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredClients.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('clients')}
                    className="w-full flex items-center justify-between p-2 rounded-none hover:bg-coal-800 text-coal-200 hover:text-lightgray-100 text-left transition-colors border border-transparent hover:border-coal-600"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-3.5 h-3.5 text-coal-400" />
                      <div>
                        <div className="font-medium text-lightgray-200">{c.company_name}</div>
                        <div className="text-[10px] text-coal-400">PIC: {c.pic_name}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-coal-400 font-mono uppercase">{c.tier || 'standard'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-coal-400 font-semibold tracking-wider flex items-center justify-between">
                <span>Omnichannel Leads ({filteredLeads.length})</span>
                <MessageSquareShare className="w-3 h-3 text-coal-400" />
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredLeads.slice(0, 3).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect('omnichannel')}
                    className="w-full flex items-center justify-between p-2 rounded-none hover:bg-coal-800 text-coal-200 hover:text-lightgray-100 text-left transition-colors border border-transparent hover:border-coal-600"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300 uppercase">
                        {l.source}
                      </span>
                      <span className="font-medium text-lightgray-200">{l.client_name || l.sender_name}</span>
                    </div>
                    <span className="text-[11px] text-coal-400 truncate max-w-xs">{l.notes || l.initial_message || '-'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-coal-700 bg-coal-950 px-4 flex items-center justify-between text-[11px] text-coal-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigasi</span>
            <span>↵ Buka</span>
            <span>ESC Tutup</span>
          </div>
          <span className="text-lightgray-400">Intelecta OS Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
