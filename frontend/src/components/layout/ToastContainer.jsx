'use client';

import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-lightgray-200 shrink-0" />,
    danger: <AlertCircle className="w-4 h-4 text-lightgray-200 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-lightgray-200 shrink-0" />,
    info: <Info className="w-4 h-4 text-lightgray-200 shrink-0" />,
  };

  const borders = {
    success: 'border-coal-600 bg-coal-900',
    danger: 'border-coal-500 bg-coal-900',
    warning: 'border-coal-600 bg-coal-900',
    info: 'border-coal-600 bg-coal-900',
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-none border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 text-xs transition-colors animate-slide-in ${borders[toast.type] || borders.info}`}
        >
          <div className="flex items-start gap-2.5">
            {icons[toast.type] || icons.info}
            <div>
              {toast.title && <div className="font-semibold text-lightgray-100 mb-0.5">{toast.title}</div>}
              <div className="text-coal-300 text-[11px] leading-relaxed">{toast.message}</div>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-coal-400 hover:text-lightgray-100 p-0.5 rounded-none transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
