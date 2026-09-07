'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  CreditCard,
  X,
  QrCode,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const FinancialPage = () => {
  const { invoices, clients, projects, addInvoice, generatePaymentLink, markInvoicePaid } = useApi();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePaymentModal, setActivePaymentModal] = useState(null);

  const [invoiceForm, setInvoiceForm] = useState({
    client_id: clients[0]?.id || '',
    project_id: projects[0]?.id || '',
    title: '',
    amount: 50000000,
    tax_amount: 5500000,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const totalContracted = (projects || []).reduce((acc, p) => acc + (Number(p.contract_value) || 0), 0);
  const totalPaid = (invoices || [])
    .filter((inv) => inv.payment_status === 'paid')
    .reduce((acc, inv) => acc + (Number(inv.total_payable || inv.amount) || 0), 0);
  const totalPending = (invoices || [])
    .filter((inv) => inv.payment_status !== 'paid')
    .reduce((acc, inv) => acc + (Number(inv.total_payable || inv.amount) || 0), 0);

  const filteredInvoices = (invoices || []).filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.payment_status === statusFilter;
    const matchesSearch =
      (inv.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await addInvoice(invoiceForm);
    setShowCreateModal(false);
  };

  const handleGeneratePayment = async (inv) => {
    const link = await generatePaymentLink(inv.id);
    setActivePaymentModal({
      invoice: inv,
      paymentUrl: link,
      paymentRef: inv.midtrans_snap_token || 'MID-TOKEN-LIVE',
    });
  };

  const statusPills = {
    paid: { label: 'Paid / Lunas', border: 'border-lightgray-400', bg: 'bg-coal-800 text-lightgray-100' },
    pending_gateway: { label: 'Pending Gateway', border: 'border-coal-600', bg: 'bg-coal-850 text-lightgray-300' },
    unpaid: { label: 'Unpaid', border: 'border-coal-700', bg: 'bg-coal-900 text-coal-400' },
    overdue: { label: 'Overdue', border: 'border-lightgray-500', bg: 'bg-coal-800 text-lightgray-200' },
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Finansial & Invoice
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Penerbitan tagihan invoice termin proyek dan pelacakan status pembayaran klien.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-2">
          <div className="text-xs font-medium text-coal-400 uppercase tracking-wider">Total Pembayaran Lunas</div>
          <div className="text-2xl font-extrabold font-heading text-lightgray-100">
            Rp {(totalPaid / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[11px] text-coal-400 font-mono">Realized Revenue Cash-in</div>
        </div>

        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-2">
          <div className="text-xs font-medium text-coal-400 uppercase tracking-wider">Tagihan Belum Dibayar</div>
          <div className="text-2xl font-extrabold font-heading text-lightgray-200">
            Rp {(totalPending / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[11px] text-coal-400 font-mono">Outstanding Receivable</div>
        </div>

        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-2">
          <div className="text-xs font-medium text-coal-400 uppercase tracking-wider">Total Nilai Kontrak</div>
          <div className="text-2xl font-extrabold font-heading text-lightgray-100">
            Rp {(totalContracted / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[11px] text-coal-400 font-mono">Pipeline Portfolio Value</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-none bg-coal-850 border border-coal-700">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-coal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor invoice, klien, atau judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-none bg-coal-900 border border-coal-700 text-xs text-lightgray-100 placeholder-coal-400 outline-none focus:border-coal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'paid', label: 'Paid / Lunas' },
            { id: 'pending_gateway', label: 'Pending Gateway' },
            { id: 'unpaid', label: 'Unpaid' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider transition-colors ${
                statusFilter === st.id
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                  : 'text-coal-400 hover:text-lightgray-200 border border-transparent'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-none bg-coal-850 border border-coal-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-coal-300">
            <thead className="bg-coal-900 border-b border-coal-700 text-[11px] font-mono text-coal-400 uppercase">
              <tr>
                <th className="p-4">No. Invoice</th>
                <th className="p-4">Klien & Proyek</th>
                <th className="p-4">Uraian Termin</th>
                <th className="p-4">Jatuh Tempo</th>
                <th className="p-4">Total Tagihan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const status = statusPills[inv.payment_status] || statusPills.unpaid;
                  return (
                    <tr key={inv.id} className="hover:bg-coal-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-lightgray-100 whitespace-nowrap">
                        {inv.invoice_number}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-lightgray-200">{inv.client?.company_name || 'B2B Client'}</div>
                        <div className="text-[10px] text-coal-400 font-mono">{inv.project?.project_code || 'PRJ'}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate text-coal-300">{inv.title}</td>
                      <td className="p-4 font-mono text-coal-400 whitespace-nowrap">{inv.due_date}</td>
                      <td className="p-4 font-mono font-bold text-lightgray-100 whitespace-nowrap">
                        Rp {Number(inv.total_payable || inv.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-none border ${status.border} ${status.bg}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        {inv.payment_status !== 'paid' && (
                          <>
                            <button
                              onClick={() => handleGeneratePayment(inv)}
                              className="px-2.5 py-1 rounded-none bg-coal-800 hover:bg-coal-700 text-lightgray-200 border border-coal-600 text-[11px] font-medium transition-colors"
                            >
                              Generate Link
                            </button>
                            <button
                              onClick={() => markInvoicePaid(inv.id)}
                              className="px-2.5 py-1 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-bold text-[11px] transition-colors"
                            >
                              Tandai Lunas
                            </button>
                          </>
                        )}
                        {inv.payment_status === 'paid' && (
                          <span className="text-[11px] text-lightgray-300 font-mono flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-coal-400 font-mono">
                    Belum ada tagihan invoice yang diterbitkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <h3 className="font-heading font-bold text-base text-lightgray-100">Buat Invoice Tagihan Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Pilih Klien *</label>
                  <select
                    value={invoiceForm.client_id}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
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
                    value={invoiceForm.project_id}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, project_id: e.target.value })}
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
                <label className="text-coal-400 block mb-1">Judul / Uraian Termin Tagihan *</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.title}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                  placeholder="Termin 1 (DP 40%): Architecture Setup & Sprint 1 Deliverables"
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Nominal Pokok (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => {
                      const amt = Number(e.target.value);
                      setInvoiceForm({ ...invoiceForm, amount: amt, tax_amount: amt * 0.11 });
                    }}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">PPN 11% (IDR)</label>
                  <input
                    type="number"
                    value={invoiceForm.tax_amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tax_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Tanggal Jatuh Tempo *</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                />
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
                  Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal Simulator */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5 text-center">
            <div className="flex justify-between items-center border-b border-coal-700 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-lightgray-200">
                <CreditCard className="w-4 h-4 text-lightgray-300" />
                <span>PAYMENT GATEWAY PORTAL</span>
              </div>
              <button onClick={() => setActivePaymentModal(null)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-none bg-coal-850 border border-coal-700 space-y-2 text-left text-xs">
              <div className="text-coal-400 text-[11px]">Invoice Tagihan</div>
              <div className="font-bold text-lightgray-100 font-mono">{activePaymentModal.invoice?.invoice_number}</div>
              <div className="text-xs text-coal-300">{activePaymentModal.invoice?.client?.company_name}</div>
              <div className="text-lg font-extrabold text-lightgray-100 font-mono mt-2">
                Rp {Number(activePaymentModal.invoice?.total_payable || activePaymentModal.invoice?.amount).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-4 rounded-none bg-coal-950 border border-coal-700 text-lightgray-100 flex flex-col items-center justify-center gap-2">
              <QrCode className="w-28 h-28 text-lightgray-200" />
              <span className="text-[11px] font-mono text-coal-400">Scan QRIS / Virtual Account Ready</span>
            </div>

            <button
              onClick={() => {
                markInvoicePaid(activePaymentModal.invoice.id);
                setActivePaymentModal(null);
              }}
              className="w-full py-2.5 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-bold shadow-sm transition-colors"
            >
              Simulasikan Pembayaran Berhasil (Webhook Callback)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPage;
