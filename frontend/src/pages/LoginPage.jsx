import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('rian@intelecta.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res?.success) {
      addToast({
        type: 'success',
        title: 'Autentikasi Berhasil',
        message: 'Selamat datang kembali di Intelecta SuperApp Command Center.',
      });
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsSubmitting(true);
    const res = await login(demoEmail, 'password123');
    setIsSubmitting(false);

    if (res?.success) {
      addToast({
        type: 'success',
        title: 'Demo Operator Login Berhasil',
        message: `Masuk sebagai ${demoEmail}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-zinc-100 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D0D11] border border-white/10 p-2.5 shadow-2xl mb-1">
            <img src="/images/logo.png" alt="Intelecta Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Intelecta SuperApp
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Internal Command Center & Client Management Hub
          </p>
        </div>

        {/* Login Card */}
        <div className="p-7 rounded-2xl bg-[#0D0D11]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="text-xs font-mono text-zinc-400">OPERATOR ACCESS</div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sanctum v1.0</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Email Operator</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@intelecta.id"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 placeholder-zinc-500 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 placeholder-zinc-500 outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting || loading ? 'Memverifikasi...' : 'Masuk ke Command Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="text-[11px] font-mono text-zinc-500 text-center uppercase tracking-wider">
              Pilih Profil Operator (1-Click Login)
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rian@intelecta.id')}
                className="p-2.5 rounded-xl bg-[#14141B] hover:bg-zinc-800 border border-white/5 hover:border-white/15 text-left text-zinc-300 transition-all flex flex-col"
              >
                <span className="font-semibold text-white truncate">Rian Pratama</span>
                <span className="text-[10px] text-zinc-500 font-mono">rian@intelecta.id</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sarah@intelecta.id')}
                className="p-2.5 rounded-xl bg-[#14141B] hover:bg-zinc-800 border border-white/5 hover:border-white/15 text-left text-zinc-300 transition-all flex flex-col"
              >
                <span className="font-semibold text-white truncate">Sarah Dian</span>
                <span className="text-[10px] text-zinc-500 font-mono">sarah@intelecta.id</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Services Indicators Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-zinc-400 pt-2">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" /> Web Dev
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> Mobile App
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" /> WebApp
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
