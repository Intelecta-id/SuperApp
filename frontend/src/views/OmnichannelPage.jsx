'use client';

import React, { useState } from 'react';
import {
  MessageSquareShare,
  Globe,
  Terminal,
  Phone,
  Send,
  UserPlus,
  Search,
  X,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';

export const OmnichannelPage = () => {
  const { leads, replyInstagram, convertLeadToProject } = useApi();
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);

  // Convert modal form state
  const [convertForm, setConvertForm] = useState({
    company_name: '',
    pic_name: '',
    pic_email: '',
    project_title: '',
    category: 'webapp_development',
    contract_value: 120000000,
  });

  const activeLeads = leads || [];
  const selectedLead = activeLeads.find((l) => l.id === selectedLeadId) || activeLeads[0] || null;

  const filteredLeads = activeLeads.filter((lead) => {
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const name = lead.client_name || lead.sender_name || '';
    const comp = lead.company_name || '';
    const msg = lead.notes || lead.initial_message || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedLead) return;
    await replyInstagram(selectedLead.id, replyText);
    setReplyText('');
  };

  const openConvertModal = (lead) => {
    const senderName = lead.client_name || lead.sender_name || 'Prospect';
    setConvertForm({
      company_name: lead.company_name || 'PT ' + senderName,
      pic_name: senderName,
      pic_email: lead.email || (lead.sender_contact?.includes('@') ? lead.sender_contact : 'pic@client.id'),
      project_title: `Proyek Solusi ${lead.company_name || senderName}`,
      category: 'webapp_development',
      contract_value: 150000000,
    });
    setShowConvertModal(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    await convertLeadToProject(selectedLead.id, convertForm);
    setShowConvertModal(false);
  };

  const sourceBadges = {
    instagram_dm: { icon: InstagramIcon, label: 'Instagram DM', border: 'border-coal-600' },
    web_contact_form: { icon: Globe, label: 'Web Form', border: 'border-coal-600' },
    web_terminal_cli: { icon: Terminal, label: 'Terminal CLI', border: 'border-coal-600' },
    whatsapp: { icon: Phone, label: 'WhatsApp', border: 'border-coal-600' },
    manual: { icon: MessageSquareShare, label: 'Manual', border: 'border-coal-600' },
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in flex flex-col h-[calc(100vh-3.5rem)] text-lightgray-100 max-w-7xl mx-auto w-full font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-coal-700 pb-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Omnichannel Inbox
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Kelola prospek masuk dari Instagram DM, Form Kontak Web, dan Terminal CLI.
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-coal-900 border border-coal-700 rounded-none overflow-x-auto">
          {[
            { id: 'all', label: 'Semua Channel' },
            { id: 'instagram_dm', label: 'Instagram DM' },
            { id: 'web_contact_form', label: 'Web Form' },
            { id: 'web_terminal_cli', label: 'Terminal CLI' },
            { id: 'whatsapp', label: 'WhatsApp' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSource(tab.id)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
                selectedSource === tab.id
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                  : 'text-coal-400 hover:text-lightgray-200 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Inquiries List & Thread Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Leads Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-coal-850 border border-coal-700 rounded-none flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-coal-700 bg-coal-900">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-coal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari prospek atau isi pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-none bg-coal-850 border border-coal-700 text-xs text-lightgray-100 placeholder-coal-400 outline-none focus:border-coal-500"
              />
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-coal-900">
            {filteredLeads.map((lead) => {
              const isSelected = lead.id === selectedLead?.id;
              const sourceConfig = sourceBadges[lead.source] || sourceBadges.manual;
              const SourceIcon = sourceConfig.icon;
              const sender = lead.client_name || lead.sender_name || 'Prospect';
              const content = lead.notes || lead.initial_message || 'Inbound inquiry via platform.';

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-3 rounded-none border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-coal-800 border-coal-500 shadow-sm'
                      : 'bg-coal-850 border-coal-700 hover:border-coal-600 text-coal-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none border border-coal-600 bg-coal-800 text-lightgray-300 flex items-center gap-1">
                        <SourceIcon className="w-3 h-3 text-lightgray-400" />
                        <span>{sourceConfig.label}</span>
                      </span>
                      <span className="text-xs font-semibold text-lightgray-100">{sender}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-none uppercase font-semibold bg-coal-800 border border-coal-600 text-lightgray-300">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>

                  {lead.company_name && (
                    <div className="text-[11px] text-coal-400 mb-1">{lead.company_name}</div>
                  )}

                  <p className="text-xs text-lightgray-300 line-clamp-2 leading-relaxed mb-2 font-sans">
                    {content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-coal-400 font-mono pt-1.5 border-t border-coal-800">
                    <span>Sumber: {lead.source}</span>
                    <span>{new Date(lead.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
            {filteredLeads.length === 0 && (
              <div className="p-8 text-center text-xs text-coal-400 font-mono">
                Tidak ada data leads ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Thread & Action Workspace (7 Cols) */}
        <div className="lg:col-span-7 bg-coal-850 border border-coal-700 rounded-none flex flex-col overflow-hidden">
          {selectedLead ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-coal-700 bg-coal-900 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-sm text-lightgray-100">
                      {selectedLead.client_name || selectedLead.sender_name}
                    </h2>
                    <span className="text-xs font-mono text-coal-400">
                      ({selectedLead.email || selectedLead.sender_contact || 'No Direct Contact'})
                    </span>
                  </div>
                  <div className="text-[11px] text-coal-400">
                    {selectedLead.company_name ? `${selectedLead.company_name} • ` : ''}
                    Sumber: {selectedLead.source}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedLead.status !== 'converted_to_project' && (
                    <button
                      onClick={() => openConvertModal(selectedLead)}
                      className="px-3 py-1.5 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Konversi ke Proyek</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thread Message Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-coal-900">
                {/* Inbound Message Card */}
                <div className="p-4 rounded-none bg-coal-850 border border-coal-700 space-y-2">
                  <div className="flex items-center justify-between text-xs text-coal-400">
                    <span className="font-mono text-[11px]">Pesan Masuk ({selectedLead.source})</span>
                    <span className="font-mono text-[11px]">
                      {new Date(selectedLead.created_at || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-lightgray-200 leading-relaxed font-sans">
                    {selectedLead.notes || selectedLead.initial_message || 'Inbound prospect inquiry.'}
                  </p>
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 bg-coal-850 border-t border-coal-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-coal-400">
                  <span>Kirim balasan langsung via Meta Graph API / Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    placeholder="Tulis balasan untuk prospek..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-xs text-lightgray-100 placeholder-coal-400 outline-none focus:border-coal-500 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-3 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold disabled:opacity-30 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-coal-400 text-xs font-mono">
              Pilih lead dari daftar di samping untuk melihat riwayat percakapan.
            </div>
          )}
        </div>
      </div>

      {/* Convert Lead to Project Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-lightgray-200" />
                <h3 className="font-heading font-bold text-base text-lightgray-100">Konversi Lead ke Klien & Proyek</h3>
              </div>
              <button onClick={() => setShowConvertModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-coal-400 block mb-1">Nama Perusahaan Klien</label>
                <input
                  type="text"
                  required
                  value={convertForm.company_name}
                  onChange={(e) => setConvertForm({ ...convertForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Nama PIC</label>
                  <input
                    type="text"
                    required
                    value={convertForm.pic_name}
                    onChange={(e) => setConvertForm({ ...convertForm, pic_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Email PIC</label>
                  <input
                    type="email"
                    required
                    value={convertForm.pic_email}
                    onChange={(e) => setConvertForm({ ...convertForm, pic_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Judul Proyek Digital</label>
                <input
                  type="text"
                  required
                  value={convertForm.project_title}
                  onChange={(e) => setConvertForm({ ...convertForm, project_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Kategori Layanan</label>
                  <select
                    value={convertForm.category}
                    onChange={(e) => setConvertForm({ ...convertForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    <option value="web_development">Web Development</option>
                    <option value="mobile_app_development">Mobile App Development</option>
                    <option value="webapp_development">Web App Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Nilai Kontrak (IDR)</label>
                  <input
                    type="number"
                    required
                    value={convertForm.contract_value}
                    onChange={(e) => setConvertForm({ ...convertForm, contract_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coal-700">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold"
                >
                  Konfirmasi & Terbitkan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmnichannelPage;
