import React from 'react';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  DownloadCloud,
  CheckCircle2,
  WifiOff
} from 'lucide-react';

export const PWAInstallModal = ({ isOpen, onClose, deferredPrompt, onInstallClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-md h-[540px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Instalar en tu Móvil
              </h3>
              <p className="text-[10px] text-slate-400">
                PWA Offline sin conexión
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto text-slate-300 text-xs flex-1">
          {deferredPrompt && (
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
              <span className="text-xs font-bold text-emerald-300 block">
                Instalación directa disponible
              </span>
              <button
                type="button"
                onClick={onInstallClick}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Instalar Ahora</span>
              </button>
            </div>
          )}

          {/* iOS Safari */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-white block">
              iPhone o iPad (Safari)
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>Abre esta página en Safari.</li>
              <li>
                Pulsa el botón de <strong>Compartir</strong> (icono con la flecha arriba).
              </li>
              <li>
                Selecciona <strong>Añadir a pantalla de inicio</strong>.
              </li>
              <li>Pulsa Añadir arriba a la derecha.</li>
            </ol>
          </div>

          {/* Android */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-white block">
              Android (Chrome o Edge)
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>Toca el menú de tres puntos arriba a la derecha.</li>
              <li>
                Selecciona <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla principal</strong>.
              </li>
              <li>Confirma en el aviso del sistema.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 p-3 border-t border-slate-800 bg-slate-950 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
