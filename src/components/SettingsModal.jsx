import React, { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  Check,
  Smartphone,
  Flame,
  CreditCard
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const SettingsModal = ({ isOpen, onClose, onOpenPWAInstall }) => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetToDefaults,
    requestConfirm,
    showToast,
    expenses,
    fixedExpenses,
  } = useWallet();

  const [cap, setCap] = useState(settings.monthlyCapHormiga || 200);
  const [income, setIncome] = useState(settings.monthlyIncome || 1650);
  const [userName, setUserName] = useState(settings.userName || '');
  const [yellowThresh, setYellowThresh] = useState(settings.alertThresholdYellow || 65);
  const [redThresh, setRedThresh] = useState(settings.alertThresholdRed || 85);
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      monthlyCapHormiga: parseFloat(cap) || 200,
      monthlyIncome: parseFloat(income) || 0,
      userName: userName.trim(),
      alertThresholdYellow: parseInt(yellowThresh, 10) || 65,
      alertThresholdRed: parseInt(redThresh, 10) || 85,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  // Export JSON file download
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

  // Import JSON file
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
        showToast('¡Datos restaurados con éxito!', 'success');
        onClose();
      } catch (err) {
        showToast('Error al leer el archivo. Asegúrate de que es una copia JSON válida.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'ID,Titulo,Importe,Categoria,GastoHormiga,MetodoPago,Fecha\n';
    expenses.forEach((e) => {
      csv += `"${e.id}","${(e.title || '').replace(/"/g, '""')}",${e.amount},"${e.category}",${e.isHormiga ? 'SI' : 'NO'},"${e.paymentMethod || ''}","${e.date || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MiCartera_Gastos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-[580px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Ajustes & Privacidad
              </h3>
              <p className="text-[11px] text-slate-400">
                100% en tu dispositivo &bull; Sin servidores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {/* Form Settings */}
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Configuración del Tope Mensual
              </h4>
              {savedAlert && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> ¡Guardado!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Tope Gastos Hormiga (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="5"
                    required
                    value={cap}
                    onChange={(e) => setCap(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono-num font-bold focus:outline-none focus:border-emerald-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Defecto recomendado: 200 €
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Ingreso Mensual Base (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="10"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono-num font-bold focus:outline-none focus:border-emerald-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Para calcular margen libre
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Aviso Amarillo (% tope)
                </label>
                <input
                  type="number"
                  min="30"
                  max="90"
                  value={yellowThresh}
                  onChange={(e) => setYellowThresh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Aviso Rojo (% tope)
                </label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={redThresh}
                  onChange={(e) => setRedThresh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-950/40"
            >
              Guardar Cambios de Configuración
            </button>
          </form>

          {/* Backup & Privacy Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Copia de Seguridad y Exportación
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tus finanzas no van a ninguna nube ajena. Descarga tu copia de seguridad periódicamente para guardarla en tu teléfono o PC.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Download JSON */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition group"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition" />
                  <span className="text-xs font-bold">Exportar JSON</span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Guarda todo: gastos, fijos y metas
                </span>
              </button>

              {/* Download CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition group"
              >
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <FileSpreadsheet className="w-4 h-4 group-hover:-translate-y-0.5 transition" />
                  <span className="text-xs font-bold">Exportar Excel/CSV</span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Para hojas de cálculo
                </span>
              </button>
            </div>

            {/* Restore JSON input */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Restaurar Copia</span>
                  <span className="text-[10px] text-slate-400">Importar archivo .json</span>
                </div>
              </div>
              <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition">
                Examinar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Install PWA Prompt & Reset */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPWAInstall();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700/60 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Instrucciones para Instalar en el Móvil (PWA)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                requestConfirm({
                  title: '¿Restablecer datos?',
                  message: 'Se sobrescribirá la información actual con la plantilla de ejemplo inicial.',
                  confirmText: 'Restablecer',
                  onConfirm: () => {
                    resetToDefaults();
                    showToast('Datos de ejemplo restaurados', 'info');
                    onClose();
                  },
                });
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 border border-rose-900/30 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Datos de Ejemplo Iniciales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
