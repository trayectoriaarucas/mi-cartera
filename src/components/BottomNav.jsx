import React from 'react';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Plus,
  PiggyBank,
  HandCoins,
} from 'lucide-react';

export const BottomNav = ({ activeTab, onChangeTab, onOpenAdd }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 select-none">
      <div className="max-w-xl mx-auto grid grid-cols-5 gap-1 items-center">
        {/* Tab 1: Inicio */}
        <button
          type="button"
          onClick={() => onChangeTab('resumen')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'resumen'
              ? 'text-emerald-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Inicio</span>
        </button>

        {/* Tab 2: Movimientos (Icono ArrowRightLeft) */}
        <button
          type="button"
          onClick={() => onChangeTab('movimientos')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'movimientos'
              ? 'text-emerald-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Movimientos</span>
        </button>

        {/* Tab 3: Botón Añadir (CIRCULAR, CENTRADO, SIN TEXTO) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenAdd}
            aria-label="Añadir movimiento"
            className={`-mt-5 w-12 h-12 rounded-full border-2 border-slate-950 shadow-xl flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer ${
              activeTab === 'nuevo'
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 ring-2 ring-emerald-400 shadow-emerald-500/50 scale-105'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-950/90'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab 4: Hucha (Unifica Fijos y Huchas de ahorro) */}
        <button
          type="button"
          onClick={() => onChangeTab('hucha')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'hucha' || activeTab === 'fijos' || activeTab === 'metas'
              ? 'text-emerald-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PiggyBank className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Hucha</span>
        </button>

        {/* Tab 5: Deudas (Icono HandCoins) */}
        <button
          type="button"
          onClick={() => onChangeTab('deudas')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'deudas'
              ? 'text-emerald-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HandCoins className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Deudas</span>
        </button>
      </div>
    </nav>
  );
};
