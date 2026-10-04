import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = ({
  isOpen,
  message,
  type = 'success',
  onClose,
  duration = 2800,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const isError = type === 'error';
  const isInfo = type === 'info';

  return (
    <div className="fixed top-4 inset-x-0 z-[110] flex justify-center pointer-events-none px-4 animate-slide-down">
      <div
        className={`pointer-events-auto max-w-sm w-full sm:w-auto px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold ${
          isError
            ? 'bg-rose-950/95 border-rose-800 text-rose-200 shadow-rose-950/50'
            : isInfo
            ? 'bg-slate-900/95 border-slate-700 text-slate-200 shadow-black/60'
            : 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5]" />
          ) : isInfo ? (
            <Info className="w-4 h-4 text-sky-400 shrink-0 stroke-[2.5]" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
          )}
          <span className="truncate text-white">{message}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition shrink-0 ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
