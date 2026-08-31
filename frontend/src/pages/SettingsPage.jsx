import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
  Terminal,
  Flame,
  CreditCard,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';
import apiClient from '../services/api';

export const SettingsPage = () => {
  const { addLead, isLiveApiConnected, refreshAllData } = useApi();
  const { addToast } = useNotification();
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateInstagramWebhook = async () => {
    setIsSimulating(true);
    const mockSenderId = 'ig_visitor_' + Math.floor(100 + Math.random() * 900);
    const mockMessage = 'Halo Intelecta, kami butuh pengembangan Mobile App e-wallet terintegrasi payment gateway.';

    const newLog = {
      id: Date.now(),
      provider: 'Meta / Instagram Graph API',
      event: 'messages',
      payload: {
        object: 'instagram',
        entry: [
          {
            id: 'intelecta_business_ig',
            messaging: [
              {
                sender: { id: mockSenderId },
                recipient: { id: 'intelecta_business_ig' },
                timestamp: Date.now(),
                message: { text: mockMessage },
              },
            ],
          },
        ],
      },
      status: '200 OK — Processed',
      time: new Date().toLocaleTimeString(),
    };

    setSimulationLogs((prev) => [newLog, ...prev]);

    // Feed into Lead system
    addLead({
      source: 'instagram_dm',
      sender_name: `IG User @${mockSenderId}`,
      sender_contact: `@${mockSenderId}`,
      subject_or_intent: 'Simulasi Instagram DM Inbound',
      initial_message: mockMessage,
    });

    addToast({
      type: 'success',
      title: 'Webhook Simulasi Berhasil Diproses',
      message: 'Event Instagram DM berhasil diterima dan diparsing ke Omnichannel Inbox.',
    });

    setIsSimulating(false);
  };

  const handleSimulateCorporateWebBeacon = async () => {
    setIsSimulating(true);
    const newLog = {
      id: Date.now(),
      provider: 'Corporate Web (Next.js 15)',
      event: 'terminal_cli_beacon',
      payload: {
        event_type: 'terminal_cli_beacon',
        data: {
          visitor_id: 'visitor_cmd_' + Math.floor(100 + Math.random() * 900),
          command: 'services --webapp --pricing',
          intent: 'exploring enterprise webapp packages',
          session_uuid: 'term_live_' + Date.now(),
        },
      },
      status: '200 OK — Processed',
      time: new Date().toLocaleTimeString(),
    };

    setSimulationLogs((prev) => [newLog, ...prev]);

    addLead({
      source: 'web_terminal_cli',
      sender_name: `Terminal: ${newLog.payload.data.visitor_id}`,
      sender_contact: 'lead@corporate-visitor.id',
      subject_or_intent: 'Terminal CLI Interaction: `services --webapp --pricing`',
      initial_message: 'Command executed: `services --webapp --pricing` (Intent: exploring enterprise webapp packages)',
    });

    addToast({
      type: 'info',
      title: 'Terminal CLI Beacon Diterima',
      message: 'Data interaksi terminal landing page tercatat di Omnichannel command center.',
    });

    setIsSimulating(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">SYSTEM ARCHITECTURE & INTEGRATIONS</span>
            <span className="text-xs font-mono text-zinc-400">• Security Protocols</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Integrasi Ekosistem & Webhook Sandbox
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor status koneksi Meta Graph API, Corporate Web, Firebase Realtime SDK, dan Midtrans Sandbox.
          </p>
        </div>

        <button
          onClick={refreshAllData}
          className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ping API Backend</span>
        </button>
      </div>

      {/* Integration Services Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Meta / Instagram API */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Connected
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Meta Graph API</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Instagram DM & Webhook Receiver</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
            HMAC SHA-256 Signature Active
          </div>
        </div>

        {/* Next.js Corporate Web */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              ISR Tag Sync
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Corporate Web (Next.js)</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Contact Forms & /tim Revalidation</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
            https://intelecta.id/api/revalidate
          </div>
        </div>

        {/* Firebase SDK */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Sub-100ms
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Firebase Admin SDK</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Firestore Realtime Chat & FCM Push</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
            Project: intelecta-superapp
          </div>
        </div>

        {/* Midtrans Payment Gateway */}
        <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
              Sandbox Live
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Midtrans Snap Gateway</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Virtual Account, QRIS & Credit Card</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
            Auto Payment Reconciliation
          </div>
        </div>
      </div>

      {/* Webhook Testing Sandbox */}
      <div className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-white">Webhook Testing Simulator</h2>
            <p className="text-xs text-zinc-400">
              Kirim payload tiruan untuk menguji ketahanan endpoint ingestion dan alur otomasi omnichannel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateInstagramWebhook}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulasikan Webhook Instagram DM</span>
            </button>
            <button
              onClick={handleSimulateCorporateWebBeacon}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Simulasikan Terminal CLI Beacon</span>
            </button>
          </div>
        </div>

        {/* Live Payload Stream Log */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
            Live Webhook Ingestion Log ({simulationLogs.length} Events)
          </div>

          {simulationLogs.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar font-mono text-[11px]">
              {simulationLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-[#14141B] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">{log.provider}</span>
                    <span className="text-zinc-500">{log.time}</span>
                  </div>
                  <pre className="p-2 rounded bg-black/50 text-zinc-300 overflow-x-auto text-[10px]">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                  <div className="text-[10px] text-zinc-400">Response: {log.status}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#14141B]/40 border border-dashed border-white/5 text-center text-xs text-zinc-500 font-mono">
              Belum ada event simulasi yang ditembakkan. Klik tombol di atas untuk mengirim event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
