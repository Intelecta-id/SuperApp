'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Globe,
  Database,
  CreditCard,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';

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
      status: '200 OK — Stored to Supabase',
      time: new Date().toLocaleTimeString(),
    };

    setSimulationLogs((prev) => [newLog, ...prev]);

    // Feed into Supabase leads table
    await addLead({
      source: 'instagram_dm',
      client_name: `IG User @${mockSenderId}`,
      email: `${mockSenderId}@instagram.user`,
      notes: mockMessage,
      status: 'new',
    });

    addToast({
      type: 'success',
      title: 'Webhook Simulasi Berhasil',
      message: 'Event Instagram DM berhasil dicatat ke Supabase dan masuk ke Omnichannel Inbox.',
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
      status: '200 OK — Stored to Supabase',
      time: new Date().toLocaleTimeString(),
    };

    setSimulationLogs((prev) => [newLog, ...prev]);

    await addLead({
      source: 'web_terminal_cli',
      client_name: `Terminal: ${newLog.payload.data.visitor_id}`,
      email: 'lead@corporate-visitor.id',
      notes: 'Command executed: `services --webapp --pricing` (Intent: exploring enterprise webapp packages)',
      status: 'new',
    });

    addToast({
      type: 'info',
      title: 'Terminal Beacon Diterima',
      message: 'Data interaksi terminal landing page tercatat di Supabase leads.',
    });

    setIsSimulating(false);
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Integrasi & Pengaturan
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Status koneksi Supabase PostgreSQL, Meta Graph API, Corporate Web, dan Midtrans.
          </p>
        </div>

        <button
          onClick={refreshAllData}
          className="px-3 py-1.5 bg-coal-850 hover:bg-coal-800 border border-coal-700 hover:border-coal-500 text-lightgray-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Sync</span>
        </button>
      </div>

      {/* Integration Services Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Meta / Instagram API */}
        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
              Ready
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-lightgray-100">Meta Graph API</h3>
            <p className="text-[11px] text-coal-400 mt-0.5">Instagram DM Ingestion</p>
          </div>
          <div className="text-[10px] font-mono text-coal-400 pt-2 border-t border-coal-800">
            HMAC SHA-256 Webhook Active
          </div>
        </div>

        {/* Next.js Corporate Web */}
        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
              Connected
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-lightgray-100">Corporate Web (Next.js)</h3>
            <p className="text-[11px] text-coal-400 mt-0.5">Contact Forms & /tim Sync</p>
          </div>
          <div className="text-[10px] font-mono text-coal-400 pt-2 border-t border-coal-800">
            Vercel Serverless Edge
          </div>
        </div>

        {/* Supabase Engine */}
        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100 font-bold">
              Sub-50ms
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-lightgray-100">Supabase Engine</h3>
            <p className="text-[11px] text-coal-400 mt-0.5">PostgreSQL & Realtime RLS</p>
          </div>
          <div className="text-[10px] font-mono text-coal-400 pt-2 border-t border-coal-800">
            Project: flpiqpmpqwteqkzqkbue
          </div>
        </div>

        {/* Midtrans Payment Gateway */}
        <div className="p-5 rounded-none bg-coal-850 border border-coal-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
              Sandbox Live
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-lightgray-100">Midtrans Gateway</h3>
            <p className="text-[11px] text-coal-400 mt-0.5">Virtual Account, QRIS & Cards</p>
          </div>
          <div className="text-[10px] font-mono text-coal-400 pt-2 border-t border-coal-800">
            Instant Reconciliation
          </div>
        </div>
      </div>

      {/* Webhook Testing Sandbox */}
      <div className="p-6 rounded-none bg-coal-850 border border-coal-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-coal-700 pb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-lightgray-100 uppercase tracking-wider">
              Webhook Testing Simulator
            </h2>
            <p className="text-xs text-coal-400 mt-0.5">
              Kirim payload tiruan untuk menguji ketahanan endpoint ingestion dan alur otomasi omnichannel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateInstagramWebhook}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-none bg-coal-800 hover:bg-coal-750 text-lightgray-200 border border-coal-600 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-lightgray-300" />
              <span>Simulasi Instagram DM</span>
            </button>
            <button
              onClick={handleSimulateCorporateWebBeacon}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-none bg-coal-800 hover:bg-coal-750 text-lightgray-200 border border-coal-600 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-lightgray-300" />
              <span>Simulasi Terminal Beacon</span>
            </button>
          </div>
        </div>

        {/* Live Terminal Output Console */}
        <div className="p-4 rounded-none bg-coal-950 border border-coal-700 font-mono text-xs text-coal-300 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-coal-800 text-coal-400 text-[11px]">
            <span>LIVE WEBHOOK INGESTION STREAM (SUPABASE)</span>
            <span className="text-lightgray-300 font-bold">READY</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {simulationLogs.length > 0 ? (
              simulationLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-none bg-coal-900 border border-coal-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-lightgray-300 font-bold">{log.provider}</span>
                    <span className="text-coal-400">{log.time}</span>
                  </div>
                  <pre className="text-[11px] text-coal-400 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                  <div className="text-[10px] text-lightgray-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-lightgray-300" />
                    <span>{log.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-coal-500 font-mono text-xs">
                Belum ada payload webhook simulasi yang dipicu. Klik tombol simulasi di atas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
