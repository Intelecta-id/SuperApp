import React, { useState } from 'react';
import {
  MessageSquareShare,
  Globe,
  Terminal,
  Phone,
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  Filter,
  Search,
  UserPlus,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';

export const OmnichannelPage = () => {
  const { leads, replyInstagram, updateLeadStatus, convertLeadToProject } = useApi();
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || 1);
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

  const selectedLead = leads.find((l) => l.id === selectedLeadId || l.uuid === selectedLeadId) || leads[0];

  const filteredLeads = leads.filter((lead) => {
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesSearch =
      lead.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.initial_message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleApplyAiSuggestion = () => {
    if (selectedLead?.ai_suggested_reply) {
      setReplyText(selectedLead.ai_suggested_reply);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedLead) return;
    replyInstagram(selectedLead.id, replyText);
    setReplyText('');
  };

  const openConvertModal = (lead) => {
    setConvertForm({
      company_name: lead.company_name || 'PT ' + lead.sender_name,
      pic_name: lead.sender_name,
      pic_email: lead.sender_contact?.includes('@') ? lead.sender_contact : 'pic@company.id',
      project_title: `Proyek Solusi ${lead.company_name || lead.sender_name}`,
      category: 'webapp_development',
      contract_value: 150000000,
    });
    setShowConvertModal(true);
  };

  const handleConvertSubmit = (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    convertLeadToProject(selectedLead.id, convertForm);
    setShowConvertModal(false);
  };

  const sourceBadges = {
    instagram_dm: { icon: InstagramIcon, label: 'Instagram DM', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    web_contact_form: { icon: Globe, label: 'Web Form', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    web_terminal_cli: { icon: Terminal, label: 'Terminal CLI', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    whatsapp: { icon: Phone, label: 'WhatsApp', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    manual: { icon: MessageSquareShare, label: 'Manual', color: 'text-zinc-400 bg-zinc-800 border-zinc-700' },
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">OMNICHANNEL INGESTION</span>
            <span className="text-xs font-mono text-zinc-400">• Unified Command Inbox</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Omnichannel Communication Center
          </h1>
          <p className="text-xs text-zinc-400">
            Integrasi langsung Meta Graph API (Instagram DM), Form Kontak Web, dan Terminal CLI Corporate Web.
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D0D11] border border-white/5 rounded-xl overflow-x-auto">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSource === tab.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
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
        <div className="lg:col-span-5 bg-[#0D0D11] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3.5 border-b border-white/5 bg-[#14141B]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari prospek atau isi pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#09090D] border border-white/5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredLeads.map((lead) => {
              const isSelected = lead.id === selectedLead?.id;
              const sourceConfig = sourceBadges[lead.source] || sourceBadges.manual;
              const SourceIcon = sourceConfig.icon;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800/90 border-white/20 shadow-md'
                      : 'bg-[#14141B]/60 border-white/5 hover:border-white/10 hover:bg-[#14141B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${sourceConfig.color}`}>
                        <SourceIcon className="w-3 h-3" />
                        <span>{sourceConfig.label}</span>
                      </span>
                      <span className="text-xs font-semibold text-zinc-100">{lead.sender_name}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        lead.status === 'converted_to_project'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : lead.status === 'qualified'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>

                  {lead.company_name && (
                    <div className="text-[11px] text-zinc-400 mb-1">{lead.company_name}</div>
                  )}

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {lead.initial_message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1.5 border-t border-white/5">
                    <span>Sentiment: {(lead.ai_sentiment_score * 100).toFixed(0)}% Positif</span>
                    <span>{new Date(lead.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Thread & AI Copilot Workspace (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0D0D11] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          {selectedLead ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-white/5 bg-[#14141B] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-sm text-white">{selectedLead.sender_name}</h2>
                    <span className="text-xs font-mono text-zinc-400">({selectedLead.sender_contact || 'No Contact Info'})</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {selectedLead.company_name ? `${selectedLead.company_name} • ` : ''}
                    Sumber: {selectedLead.source}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedLead.status !== 'converted_to_project' && (
                    <button
                      onClick={() => openConvertModal(selectedLead)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>1-Click Konversi ke Proyek</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thread Message Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[#09090D]">
                {/* Inbound Message Card */}
                <div className="p-4 rounded-xl bg-[#14141B] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono text-[11px]">Pesan Masuk ({selectedLead.source})</span>
                    <span className="font-mono text-[11px]">{new Date(selectedLead.created_at || Date.now()).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-zinc-100 leading-relaxed font-sans">{selectedLead.initial_message}</p>
                </div>

                {/* AI Copilot Suggestion Box */}
                {selectedLead.ai_suggested_reply && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 font-heading">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span>Intelecta AI Smart Suggestion</span>
                      </div>
                      <button
                        onClick={handleApplyAiSuggestion}
                        className="text-[11px] font-mono text-blue-300 hover:text-white px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Gunakan Balasan
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      "{selectedLead.ai_suggested_reply}"
                    </p>
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 bg-[#14141B] border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Kirim balasan langsung via Meta Graph API / Email Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    placeholder="Tulis balasan untuk prospek..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#09090D] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-white/25 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
              Pilih lead dari daftar di samping untuk melihat riwayat percakapan.
            </div>
          )}
        </div>
      </div>

      {/* Convert Lead to Project Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-base text-white">Konversi Lead ke Klien & Proyek</h3>
              </div>
              <button onClick={() => setShowConvertModal(false)} className="text-zinc-400 hover:text-zinc-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nama Perusahaan Klien</label>
                <input
                  type="text"
                  required
                  value={convertForm.company_name}
                  onChange={(e) => setConvertForm({ ...convertForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nama PIC</label>
                  <input
                    type="text"
                    required
                    value={convertForm.pic_name}
                    onChange={(e) => setConvertForm({ ...convertForm, pic_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Email PIC</label>
                  <input
                    type="email"
                    required
                    value={convertForm.pic_email}
                    onChange={(e) => setConvertForm({ ...convertForm, pic_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Judul Proyek Digital</label>
                <input
                  type="text"
                  required
                  value={convertForm.project_title}
                  onChange={(e) => setConvertForm({ ...convertForm, project_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Kategori Layanan</label>
                  <select
                    value={convertForm.category}
                    onChange={(e) => setConvertForm({ ...convertForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    <option value="web_development">Web Development</option>
                    <option value="mobile_app_development">Mobile App Development</option>
                    <option value="webapp_development">Web App Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Nilai Kontrak (IDR)</label>
                  <input
                    type="number"
                    required
                    value={convertForm.contract_value}
                    onChange={(e) => setConvertForm({ ...convertForm, contract_value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow"
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
