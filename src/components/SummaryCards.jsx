import React from 'react';
import {
  Wallet,
  PiggyBank,
  HandCoins,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const SummaryCards = ({ onSelectTab }) => {
  const { calculations } = useWallet();

  const {
    balance,
    totalSavings = 0,
    netDebts = 0,
    totalTheyOweMe = 0,
    totalIOwe = 0,
  } = calculations;

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* 1. Saldo / Qué va quedando */}
      <div
        onClick={() => onSelectTab && onSelectTab('gastos')}
        className={`glass-panel p-3 rounded-2xl border transition cursor-pointer group active:scale-98 ${
          balance >= 0 ? 'border-teal-500/30' : 'border-rose-500/30'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Va quedando
          </span>
          <div className="p-1 rounded-lg bg-teal-500/10 text-teal-400">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div
          className={`text-lg sm:text-xl font-extrabold font-mono-num mb-0.5 truncate ${
            balance >= 0 ? 'text-teal-300' : 'text-rose-400'
          }`}
        >
          {balance >= 0 ? `+${balance.toFixed(2)}` : balance.toFixed(2)} €
        </div>
        <span className="text-[10px] text-slate-400 block font-medium truncate">
          Balance
        </span>
      </div>

      {/* 2. Total Guardado en Huchas */}
      <div
        onClick={() => onSelectTab && onSelectTab('hucha')}
        className="glass-panel p-3 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition cursor-pointer group active:scale-98"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Huchas
          </span>
          <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
            <PiggyBank className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-lg sm:text-xl font-extrabold text-white font-mono-num mb-0.5 truncate">
          {totalSavings.toFixed(2)} €
        </div>
        <span className="text-[10px] text-purple-300 block font-medium truncate">
          Ahorrado
        </span>
      </div>

      {/* 3. Deudas / Pendientes (Icono HandCoins) */}
      <div
        onClick={() => onSelectTab && onSelectTab('deudas')}
        className="glass-panel p-3 rounded-2xl border border-slate-800/80 hover:border-indigo-500/30 transition cursor-pointer group active:scale-98"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Deudas
          </span>
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
            <HandCoins className="w-3.5 h-3.5" />
          </div>
        </div>
        <div
          className={`text-lg sm:text-xl font-extrabold font-mono-num mb-0.5 truncate ${
            netDebts >= 0 ? 'text-teal-300' : 'text-rose-400'
          }`}
        >
          {netDebts >= 0 ? `+${netDebts.toFixed(2)}` : netDebts.toFixed(2)} €
        </div>
        <span className="text-[10px] text-indigo-300 block font-medium truncate">
          {totalTheyOweMe > 0
            ? `+${totalTheyOweMe.toFixed(2)} €`
            : totalIOwe > 0
            ? `-${totalIOwe.toFixed(2)} €`
            : 'Al día'}
        </span>
      </div>
    </div>
  );
};
