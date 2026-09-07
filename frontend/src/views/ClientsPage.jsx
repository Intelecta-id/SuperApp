'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const ClientsPage = () => {
  const { clients, projects, addClient, updateClient, deleteClient } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    pic_name: '',
    email: '',
    phone: '',
    tier: 'standard',
    status: 'active',
    contract_value: 0,
    notes: '',
  });

  const tiers = ['all', 'standard', 'enterprise', 'retainer'];

  const filteredClients = (clients || []).filter((client) => {
    const matchesTier = tierFilter === 'all' || (client.tier || 'standard') === tierFilter;
    const matchesSearch =
      (client.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.pic_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email || client.pic_email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedClient(null);
    setFormData({
      company_name: '',
      pic_name: '',
      email: '',
      phone: '',
      tier: 'standard',
      status: 'active',
      contract_value: 0,
      notes: '',
    });
    setShowClientModal(true);
  };

  const openEditModal = (client) => {
    setIsEditing(true);
    setSelectedClient(client);
    setFormData({
      company_name: client.company_name || '',
      pic_name: client.pic_name || '',
      email: client.email || client.pic_email || '',
      phone: client.phone || client.pic_phone || '',
      tier: client.tier || 'standard',
      status: client.status || 'active',
      contract_value: Number(client.contract_value) || 0,
      notes: client.notes || '',
    });
    setShowClientModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && selectedClient) {
      await updateClient(selectedClient.id, formData);
    } else {
      await addClient(formData);
    }
    setShowClientModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Direktori Klien
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Kelola profil perusahaan klien B2B, kontak PIC, dan riwayat kemitraan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3 py-1.5 bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Klien</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-none bg-coal-850 border border-coal-700">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-coal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perusahaan, PIC, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-xs text-lightgray-100 placeholder-coal-400 outline-none focus:border-coal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider transition-colors ${
                tierFilter === t
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                  : 'text-coal-400 hover:text-lightgray-200 border border-transparent'
              }`}
            >
              {t === 'all' ? 'Semua Tier' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const clientProjects = (projects || []).filter((p) => p.client_id === client.id);
            const totalVal = clientProjects.reduce((acc, p) => acc + (Number(p.contract_value) || 0), 0);

            return (
              <div
                key={client.id}
                className="p-6 rounded-none bg-coal-850 border border-coal-700 hover:border-coal-500 transition-colors flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300 uppercase">
                      {client.tier || 'standard'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-lightgray-100 group-hover:text-white transition-colors">
                    {client.company_name}
                  </h3>
                  <p className="text-xs text-coal-400 mt-1 line-clamp-2">{client.notes || 'Tidak ada catatan tambahan.'}</p>
                </div>

                {/* PIC Details Box */}
                <div className="p-3 rounded-none bg-coal-900 border border-coal-700 space-y-1.5 text-xs text-coal-300">
                  <div className="font-semibold text-lightgray-200 flex items-center justify-between">
                    <span>{client.pic_name}</span>
                    <span className="text-[10px] text-coal-400 font-mono uppercase">{client.status || 'ACTIVE'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-coal-400">
                    <Mail className="w-3 h-3 text-coal-400" />
                    <span>{client.email || client.pic_email || 'pic@company.com'}</span>
                  </div>
                  {(client.phone || client.pic_phone) && (
                    <div className="flex items-center gap-2 text-[11px] text-coal-400">
                      <Phone className="w-3 h-3 text-coal-400" />
                      <span>{client.phone || client.pic_phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats Footer */}
                <div className="pt-3 border-t border-coal-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-coal-400 font-mono">Total Kontrak</div>
                    <div className="font-bold text-lightgray-100 font-mono">
                      Rp {(totalVal / 1000000).toLocaleString('id-ID')}jt
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(client)}
                      className="p-1.5 rounded-none bg-coal-800 hover:bg-coal-700 border border-coal-600 text-lightgray-200 transition-colors"
                      title="Edit Klien"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-1.5 rounded-none bg-coal-900 hover:bg-coal-800 border border-coal-700 text-coal-400 hover:text-lightgray-100 transition-colors"
                      title="Hapus Klien"
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
        <div className="p-12 rounded-none bg-coal-850 border border-dashed border-coal-700 text-center space-y-3">
          <div className="w-12 h-12 rounded-none bg-coal-800 border border-coal-600 text-coal-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-lightgray-100">Belum Ada Klien Terdaftar</h3>
          <p className="text-xs text-coal-400 max-w-sm mx-auto">
            Mulai daftarkan akun perusahaan klien B2B Anda untuk mengelola kontrak dan sprint proyek.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Klien Pertama</span>
          </button>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <h3 className="font-heading font-bold text-base text-lightgray-100">
                {isEditing ? 'Edit Profil Klien B2B' : 'Tambah Klien B2B Baru'}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-coal-400 block mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  placeholder="PT FinTech Nusantara"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Nama PIC *</label>
                  <input
                    type="text"
                    required
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Email PIC *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Tier Kemitraan</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="retainer">Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Catatan Klien</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coal-700">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold"
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
