import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar elemento?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  isDanger = true,
}) => {
  // Manejar tecla Escape y botón atrás de Android
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque de cristal */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-200 animate-fade-in"
      />

      {/* Tarjeta de diálogo moderna One UI / Material Dark */}
      <div className="relative z-10 w-full max-w-sm bg-slate-950 border border-slate-800/90 rounded-[28px] p-5 shadow-2xl animate-modal-pop space-y-4">
        <div className="flex items-start gap-3.5">
          {/* Icono de advertencia o papelera con resplandor */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
              isDanger
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-rose-950/40'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-amber-950/40'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-sm font-bold text-white leading-snug mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed break-words font-medium">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition active:scale-90 shrink-0 -mr-1 -mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition active:scale-95"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`w-full py-3 px-3 rounded-2xl text-white text-xs font-bold transition active:scale-95 shadow-xl flex items-center justify-center gap-1.5 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/80 ring-1 ring-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/80 ring-1 ring-emerald-500/30'
            }`}
          >
            {isDanger && <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
