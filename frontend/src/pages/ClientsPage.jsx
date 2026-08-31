import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  Globe,
  FileText,
  FolderKanban,
  Receipt,
  LifeBuoy,
  Edit2,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const ClientsPage = () => {
  const { clients, projects, invoices, tickets, addClient, updateClient, deleteClient } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    pic_name: '',
    pic_email: '',
    pic_phone: '',
    pic_position: '',
    industry: '',
    website: '',
    tax_id: '',
    address: '',
    notes: '',
  });

  const industries = ['all', ...new Set(clients.map((c) => c.industry).filter(Boolean))];

  const filteredClients = clients.filter((client) => {
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    const matchesSearch =
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pic_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      company_name: '',
      pic_name: '',
      pic_email: '',
      pic_phone: '',
      pic_position: '',
      industry: '',
      website: '',
      tax_id: '',
      address: '',
      notes: '',
    });
    setShowClientModal(true);
  };

  const openEditModal = (client) => {
    setIsEditing(true);
    setFormData({
      company_name: client.company_name,
      pic_name: client.pic_name,
      pic_email: client.pic_email,
      pic_phone: client.pic_phone || '',
      pic_position: client.pic_position || '',
      industry: client.industry || '',
      website: client.website || '',
      tax_id: client.tax_id || '',
      address: client.address || '',
      notes: client.notes || '',
    });
    setShowClientModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedClient) {
      updateClient(selectedClient.id, formData);
    } else {
      addClient(formData);
    }
    setShowClientModal(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">B2B ENTERPRISE DIRECTORY</span>
            <span className="text-xs font-mono text-zinc-400">• {clients.length} Perusahaan Terdaftar</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Direktori Klien Korporat
          </h1>
          <p className="text-xs text-zinc-400">
            Pencatatan akun perusahaan klien, kontak PIC, histori kontrak, dan kepatuhan SLA.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Klien B2B</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D11] border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perusahaan, PIC, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                industryFilter === ind
                  ? 'bg-zinc-800 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {ind === 'all' ? 'Semua Industri' : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const clientProjects = projects.filter((p) => p.client_id === client.id);
            const clientInvoices = invoices.filter((inv) => inv.client_id === client.id);
            const totalVal = clientProjects.reduce((acc, p) => acc + (p.contract_value || 0), 0);

            return (
              <div
                key={client.id}
                className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#14141B] border border-white/10 text-zinc-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {client.industry || 'Enterprise B2B'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-zinc-200 transition-colors">
                    {client.company_name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{client.notes || 'Tidak ada catatan tambahan.'}</p>
                </div>

                {/* PIC Details Box */}
                <div className="p-3 rounded-xl bg-[#14141B] border border-white/5 space-y-1.5 text-xs text-zinc-300">
                  <div className="font-semibold text-zinc-200 flex items-center justify-between">
                    <span>{client.pic_name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{client.pic_position || 'PIC'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <Mail className="w-3 h-3" />
                    <span>{client.pic_email}</span>
                  </div>
                  {client.pic_phone && (
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <Phone className="w-3 h-3" />
                      <span>{client.pic_phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">Total Kontrak</div>
                    <div className="font-bold text-white font-mono">
                      Rp {(totalVal / 1000000).toLocaleString('id-ID')}jt
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        openEditModal(client);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0D0D11] border border-dashed border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-white">Belum Ada Klien Terdaftar</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Mulai daftarkan akun perusahaan klien B2B Anda untuk mengelola kontrak, sprint proyek, dan tagihan invoice.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Klien Pertama</span>
          </button>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                {isEditing ? 'Edit Profil Klien B2B' : 'Tambah Klien B2B Baru'}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  placeholder="PT FinTech Nusantara"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nama PIC *</label>
                  <input
                    type="text"
                    required
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Email PIC *</label>
                  <input
                    type="email"
                    required
                    value={formData.pic_email}
                    onChange={(e) => setFormData({ ...formData, pic_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.pic_phone}
                    onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Jabatan PIC</label>
                  <input
                    type="text"
                    value={formData.pic_position}
                    onChange={(e) => setFormData({ ...formData, pic_position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                    placeholder="CTO / Director"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Sektor Industri</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                    placeholder="Fintech / Logistics / Healthcare"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                    placeholder="https://client.id"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Alamat Kantor</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Catatan Khusus Klien</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
