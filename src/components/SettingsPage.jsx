import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  Flame,
  Settings
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { exportToPDF } from '../utils/pdfExport';

export const SettingsPage = ({ onBack }) => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetToDefaults,
    requestConfirm,
    showToast,
    transactions,
  } = useWallet();

  const [cap, setCap] = useState(settings.monthlyCapHormiga || 200);
  const [userName, setUserName] = useState(settings.userName || 'Cristian');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      monthlyCapHormiga: parseFloat(cap) || 200,
      userName: userName.trim() || 'Cristian',
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nowStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `MiCartera_Backup_${nowStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
        showToast('Copia de seguridad restaurada correctamente.', 'success');
        onBack();
      } catch (err) {
        showToast('El archivo no es una copia válida de Mi Cartera.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExportPDF = () => {
    exportToPDF(transactions, settings.userName || 'Cristian');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col animate-fade-slide">
      {/* Top Bar con Volver */}
      <div className="flex items-center justify-between py-2 mb-3 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>Ajustes & Privacidad</span>
        </h2>

        <div className="w-16"></div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Formulario de Configuración del Tope */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>Tope Mensual de Gastos</span>
            </h3>
            {savedAlert && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-slide">
                <Check className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Límite de presupuesto mensual (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5"
                  required
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-lg font-bold font-mono-num text-white focus:outline-none focus:border-emerald-500 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  €
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-98 shadow-md"
            >
              Guardar Nuevo Tope
            </button>
          </form>
        </div>

        {/* Informes y Exportación */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Informes y Descargas</span>
          </h3>

          {/* Exportar a PDF (solicitado en lugar de Excel) */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-left transition group active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Exportar Informe a PDF
                </span>
                <span className="text-xs text-slate-400">
                  Descarga un extracto limpio en PDF con todos tus movimientos
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-cyan-400 shrink-0" />
          </button>
        </div>

        {/* Copias de seguridad y Privacidad */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Copias de Seguridad (100% Offline)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tus datos viven en la memoria interna de tu móvil. Puedes descargar una copia de seguridad para conservarla en tus archivos o restaurarla.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Exportar JSON */}
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition active:scale-98"
            >
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Download className="w-4 h-4" />
                <span className="text-xs font-bold">Descargar Copia</span>
              </div>
              <span className="text-xs text-slate-400 block leading-tight">
                Archivo .json seguro
              </span>
            </button>

            {/* Restaurar JSON */}
            <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition cursor-pointer active:scale-98 block">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Upload className="w-4 h-4" />
                <span className="text-xs font-bold">Restaurar Copia</span>
              </div>
              <span className="text-xs text-slate-400 block leading-tight">
                Importar archivo
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Restablecer datos */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              requestConfirm({
                title: '¿Restablecer datos?',
                message: 'Se borrarán los datos actuales y se restaurará la configuración inicial.',
                confirmText: 'Restablecer',
                onConfirm: () => {
                  resetToDefaults();
                  showToast('Datos restablecidos con éxito.', 'info');
                  onBack();
                },
              });
            }}
            className="w-full py-3 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-rose-900/30 transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Datos de Ejemplo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
