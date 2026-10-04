import React from 'react';
import { Wallet, Settings, Calendar } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const Header = ({ onOpenSettings }) => {
  const { settings } = useWallet();

  // Current formatted date in Spanish
  const todayFormatted = React.useMemo(() => {
    const d = new Date();
    const str = d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* App Title & Current Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl shrink-0">
            <Wallet className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              Mi Cartera
            </h1>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{todayFormatted}</span>
            </p>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Ajustes y Copia de Seguridad"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
