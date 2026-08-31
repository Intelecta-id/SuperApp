import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    danger: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-[#0A1A12]/95',
    danger: 'border-rose-500/40 bg-[#1A0A0E]/95 shadow-rose-950/50',
    warning: 'border-amber-500/30 bg-[#1A150A]/95',
    info: 'border-blue-500/30 bg-[#0A121A]/95',
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-start justify-between gap-3 text-xs transition-all animate-slide-in ${borders[toast.type] || borders.info}`}
        >
          <div className="flex items-start gap-2.5">
            {icons[toast.type] || icons.info}
            <div>
              {toast.title && <div className="font-semibold text-zinc-100 mb-0.5">{toast.title}</div>}
              <div className="text-zinc-300 text-[11px] leading-relaxed">{toast.message}</div>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
