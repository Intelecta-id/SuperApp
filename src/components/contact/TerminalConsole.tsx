"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlyphTerminal, GlyphCornerDownLeft } from "@/components/ui/TechnicalGlyphs";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export const TerminalConsole: React.FC = () => {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: "initial",
      command: "sys-info",
      output: (
        <div className="space-y-1 text-zinc-300">
          <p className="text-white font-bold">INTELECTA ENTERPRISE ARCHITECTURE SHELL [v3.0.0-PROD]</p>
          <p className="text-zinc-400">
            Ketik <span className="text-white font-semibold underline">help</span> untuk panduan inspeksi topologi sistem dan estimasi kapasitas.
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode;

    switch (trimmed) {
      case "help":
        output = (
          <div className="space-y-1.5 text-zinc-300">
            <p className="text-zinc-400">Perintah diagnostik & arsitektur yang didukung:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] pt-1 font-mono">
              <div><span className="text-white font-bold">cluster status</span> - Status node multi-region</div>
              <div><span className="text-white font-bold">latency test</span> - Benchmark kecepatan respon P99</div>
              <div><span className="text-white font-bold">security check</span> - Verifikasi audit ISO 27001</div>
              <div><span className="text-white font-bold">layanan</span> - 4 pilar solusi utama Intelecta</div>
              <div><span className="text-white font-bold">kontak</span> - Saluran komunikasi resmi</div>
              <div><span className="text-white font-bold">clear</span> - Bersihkan riwayat konsol</div>
            </div>
          </div>
        );
        break;

      case "cluster status":
      case "cluster":
        output = (
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            <p className="text-emerald-400 font-bold">TOPOLOGI MULTI-REGION ACTIVE-ACTIVE: OPTIMAL</p>
            <p className="text-zinc-400">+ Region AP-Southeast-1 (Jakarta DC-1): 48 Nodes [HEALTHY]</p>
            <p className="text-zinc-400">+ Region AP-Southeast-3 (Jakarta DC-2): 48 Nodes [HEALTHY]</p>
            <p className="text-zinc-400">+ Quorum Replication Sync: 0.4ms latency (Synchronous)</p>
            <p className="text-white">+ Ketersediaan Operasional: 99.998% SLA</p>
          </div>
        );
        break;

      case "latency test":
      case "latency":
        output = (
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            <p className="text-white font-bold">BENCHMARK THROUGHPUT & LATENSI EKSTREM:</p>
            <p className="text-emerald-400">+ P50 Ingestion Latency: 2.1 ms</p>
            <p className="text-emerald-400">+ P90 Execution Latency: 4.8 ms</p>
            <p className="text-emerald-400">+ P99 Edge Network Latency: 8.2 ms</p>
            <p className="text-zinc-400">+ Evaluasi Konkurensi: 120,000 req/sec tanpa packet drop</p>
          </div>
        );
        break;

      case "security check":
      case "security":
        output = (
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            <p className="text-white font-bold">AUDIT POSTUR KEAMANAN ZERO TRUST:</p>
            <p className="text-zinc-300">+ Enkripsi Data: AES-256 GCM (At-Rest) & TLS 1.3 (In-Transit)</p>
            <p className="text-zinc-300">+ Mutual TLS (mTLS): Diwajibkan di 100% Service Mesh</p>
            <p className="text-zinc-300">+ Standar Sertifikasi: ISO/IEC 27001:2022 & Kepatuhan UU PDP</p>
            <p className="text-emerald-400 font-bold">+ Status Kerentanan: 0 Critical / 0 High</p>
          </div>
        );
        break;

      case "layanan":
      case "services":
        output = (
          <div className="space-y-2 text-zinc-300">
            <p className="text-white font-bold">[1] AI & Machine Learning Engineering</p>
            <p className="text-zinc-400 text-xs">Model LLM enterprise privat, RAG, agentic automation.</p>
            <p className="text-white font-bold">[2] Cloud Infrastructure & High-Availability</p>
            <p className="text-zinc-400 text-xs">Kubernetes multi-region, GitOps, 99.99% SLA uptime.</p>
            <p className="text-white font-bold">[3] Cybersecurity Zero Trust</p>
            <p className="text-zinc-400 text-xs">Audit ISO 27001, automated threat hunting, ZTNA.</p>
            <p className="text-white font-bold">[4] Enterprise Distributed Systems</p>
            <p className="text-zinc-400 text-xs">Distributed microservices, sub-10ms latency APIs.</p>
          </div>
        );
        break;

      case "kontak":
      case "contact":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p><span className="text-zinc-400">Email:</span> contact@intelecta.id</p>
            <p><span className="text-zinc-400">WhatsApp:</span> +62 812-8900-1926</p>
            <p><span className="text-zinc-400">Kantor:</span> SCBD Tower One, Level 28, Jakarta Selatan 12190</p>
          </div>
        );
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      default:
        output = (
          <p className="text-red-400 text-xs">
            Perintah &apos;{trimmed}&apos; tidak dikenali. Ketik &apos;help&apos; untuk melihat daftar perintah.
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmd,
        output,
      },
    ]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(inputVal);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-[#08080A] p-6 font-mono text-xs shadow-2xl backdrop-blur-2xl cursor-text"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-sm bg-zinc-600" />
          <div className="h-2.5 w-2.5 rounded-sm bg-zinc-500" />
          <div className="h-2.5 w-2.5 rounded-sm bg-white" />
          <span className="ml-2 font-mono text-[11px] text-zinc-400">
            architect@intelecta-cluster: ~
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <GlyphTerminal className="h-3.5 w-3.5" />
          <span>SHELL v3.0</span>
        </div>
      </div>

      {/* Output Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4 text-xs">
        {history.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-400 font-bold">architect@intelecta:~$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Line */}
      <div className="flex items-center gap-2 border-t border-white/10 pt-4">
        <span className="text-emerald-400 font-bold shrink-0">architect@intelecta:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ketik 'help' lalu tekan Enter..."
          className="flex-1 bg-transparent text-white placeholder-zinc-600 focus:outline-none"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          aria-label="Kirim perintah"
          className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
        >
          <GlyphCornerDownLeft className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
