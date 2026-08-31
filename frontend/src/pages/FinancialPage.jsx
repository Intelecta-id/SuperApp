import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  DollarSign,
  CreditCard,
  Building2,
  X,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

export const FinancialPage = () => {
  const { invoices, clients, projects, addInvoice, generatePaymentLink, markInvoicePaid } = useApi();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePaymentModal, setActivePaymentModal] = useState(null);

  const [invoiceForm, setInvoiceForm] = useState({
    client_id: clients[0]?.id || 1,
    project_id: projects[0]?.id || 1,
    title: '',
    amount: 50000000,
    tax_amount: 5500000,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const totalContracted = projects.reduce((acc, p) => acc + (p.contract_value || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.payment_status === 'paid')
    .reduce((acc, inv) => acc + (inv.total_payable || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.payment_status !== 'paid')
    .reduce((acc, inv) => acc + (inv.total_payable || 0), 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.payment_status === statusFilter;
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addInvoice(invoiceForm);
    setShowCreateModal(false);
  };

  const handleGeneratePayment = async (inv) => {
    const link = await generatePaymentLink(inv.uuid || inv.id);
    setActivePaymentModal({
      invoice: inv,
      paymentUrl: link,
      paymentRef: inv.payment_gateway_ref || 'MID-TOKEN-8891',
    });
  };

  const statusPills = {
    paid: { label: 'Paid / Lunas', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    pending_gateway: { label: 'Pending Gateway', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    unpaid: { label: 'Unpaid', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
    overdue: { label: 'Overdue', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">FINANCIAL & BILLING HUB</span>
            <span className="text-xs font-mono text-zinc-400">• Midtrans / Gateway Integrated</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Finansial & Invoicing
          </h1>
          <p className="text-xs text-zinc-400">
            Penerbitan tagihan invoice termin proyek, integrasi link pembayaran instan, dan rekonsiliasi cashflow.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Invoice Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-2">
          <div className="text-xs text-zinc-400">Total Pembayaran Lunas</div>
          <div className="text-2xl font-extrabold font-heading text-emerald-400">
            Rp {(totalPaid / 1000000).toLocaleString('id-ID')} Juta
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Realized Revenue Cash-in</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-2">
          <div className="text-xs text-zinc-400">Tagihan Belum Dibayar</div>
          <div className="text-2xl font-extrabold font-heading text-amber-400">
            Rp {(totalPending / 1000000).toLocaleString('id-ID')} Juta
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Outstanding Receivable</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-2">
          <div className="text-xs text-zinc-400">Total Nilai Kontrak Proyek</div>
          <div className="text-2xl font-extrabold font-heading text-white">
            Rp {(totalContracted / 1000000).toLocaleString('id-ID')} Juta
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Combined Portfolio Pipeline</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D11] border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor invoice, klien, atau judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'paid', label: 'Paid / Lunas' },
            { id: 'pending_gateway', label: 'Pending Gateway' },
            { id: 'unpaid', label: 'Unpaid' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-zinc-800 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-[#0D0D11] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#14141B] border-b border-white/5 text-[11px] font-mono text-zinc-400 uppercase">
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
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const status = statusPills[inv.payment_status] || statusPills.unpaid;
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        {inv.invoice_number}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-zinc-100">{inv.client?.company_name || 'PT Klien'}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{inv.project?.project_code || 'General Retainer'}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate text-zinc-300">{inv.title}</td>
                      <td className="p-4 font-mono text-zinc-400 whitespace-nowrap">{inv.due_date}</td>
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        Rp {Number(inv.total_payable).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        {inv.payment_status !== 'paid' && (
                          <>
                            <button
                              onClick={() => handleGeneratePayment(inv)}
                              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[11px] font-medium transition-colors"
                            >
                              Generate Link
                            </button>
                            <button
                              onClick={() => markInvoicePaid(inv.uuid || inv.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                            >
                              Tandai Lunas
                            </button>
                          </>
                        )}
                        {inv.payment_status === 'paid' && (
                          <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-base text-white">Buat Invoice Tagihan Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Pilih Klien *</label>
                  <select
                    value={invoiceForm.client_id}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
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
                  <label className="text-zinc-400 block mb-1">Proyek Terkait</label>
                  <select
                    value={invoiceForm.project_id}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, project_id: e.target.value })}
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
                <label className="text-zinc-400 block mb-1">Judul / Uraian Termin Tagihan *</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.title}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                  placeholder="Termin 1 (DP 40%): Architecture Setup & Sprint 1 Deliverables"
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nominal Pokok (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => {
                      const amt = Number(e.target.value);
                      setInvoiceForm({ ...invoiceForm, amount: amt, tax_amount: amt * 0.11 });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">PPN 11% (IDR)</label>
                  <input
                    type="number"
                    value={invoiceForm.tax_amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tax_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Tanggal Jatuh Tempo *</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                />
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
                  Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal Simulator */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>MIDTRANS PAYMENT GATEWAY SANDBOX</span>
              </div>
              <button onClick={() => setActivePaymentModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#14141B] border border-white/5 space-y-2 text-left text-xs">
              <div className="text-zinc-400 text-[11px]">Invoice Tagihan</div>
              <div className="font-bold text-white font-mono">{activePaymentModal.invoice?.invoice_number}</div>
              <div className="text-xs text-zinc-200">{activePaymentModal.invoice?.client?.company_name}</div>
              <div className="text-lg font-extrabold text-emerald-400 font-mono mt-2">
                Rp {Number(activePaymentModal.invoice?.total_payable).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white text-zinc-950 flex flex-col items-center justify-center gap-2">
              <QrCode className="w-32 h-32" />
              <span className="text-[11px] font-mono text-zinc-600">Scan QRIS / Virtual Account Ready</span>
            </div>

            <div className="text-[11px] text-zinc-400 font-mono truncate">
              URL: {activePaymentModal.paymentUrl}
            </div>

            <button
              onClick={() => {
                markInvoicePaid(activePaymentModal.invoice.uuid || activePaymentModal.invoice.id);
                setActivePaymentModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
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
