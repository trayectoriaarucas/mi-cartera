import React, { useState } from 'react';
import { PiggyBank, CreditCard } from 'lucide-react';
import { SavingsGoals } from './SavingsGoals';
import { FixedExpensesManager } from './FixedExpensesManager';
import { useWallet } from '../context/WalletContext';

export const HuchaUnifiedPage = ({ initialSection = 'huchas' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const { savingsGoals = [], fixedExpenses = [], calculations } = useWallet();
  const { totalSavings = 0, totalFixedPending = 0 } = calculations;

  return (
    <div className="space-y-4 animate-fade-slide">
      {/* Selector elegante para alternar entre Huchas de Ahorro y Gastos Fijos */}
      <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 flex gap-1 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveSection('huchas')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeSection === 'huchas'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Huchas ({totalSavings.toFixed(2)} €)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('fijos')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeSection === 'fijos'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Gastos Fijos ({fixedExpenses.length})</span>
        </button>
      </div>

      {/* Contenido dinámico según la sección activa */}
      {activeSection === 'huchas' ? (
        <SavingsGoals />
      ) : (
        <FixedExpensesManager />
      )}
    </div>
  );
};
