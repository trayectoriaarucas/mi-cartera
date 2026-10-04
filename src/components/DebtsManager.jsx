import React, { useState, useMemo } from 'react';
import {
  HandCoins,
  ArrowRightLeft,
  Plus,
  Check,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const DebtsManager = () => {
  const {
    debts = [],
    addDebt,
    toggleDebtSettled,
    deleteDebt,
    requestConfirm,
    calculations: { totalTheyOweMe = 0, totalIOwe = 0, netDebts = 0 },
  } = useWallet();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filter, setFilter] = useState('pending'); // 'pending' | 'they_owe_me' | 'i_owe' | 'settled'

  // Form state
  const [debtType, setDebtType] = useState('they_owe_me'); // 'they_owe_me' | 'i_owe'
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!person.trim() || !amount) return;

    addDebt({
      type: debtType,
      person: person.trim(),
      amount: parseFloat(amount),
      concept: concept.trim() || 'Bizum / Préstamo',
    });

    setPerson('');
    setAmount('');
    setConcept('');
    setIsAddOpen(false);
  };

  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      if (filter === 'pending') return !d.settled;
      if (filter === 'settled') return d.settled;
      if (filter === 'they_owe_me') return !d.settled && d.type === 'they_owe_me';
      if (filter === 'i_owe') return !d.settled && d.type === 'i_owe';
      return true;
    });
  }, [debts, filter]);

  const pendingCount = debts.filter((d) => !d.settled).length;
  const settledCount = debts.filter((d) => d.settled).length;

  return (
    <div className="space-y-4 animate-fade-slide">
      {/* 1. Cabecera con Métricas */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Deudas y Préstamos
              </h2>
              <p className="text-xs text-slate-400">
                Control de dinero pendiente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-950/40"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Añadir</span>
          </button>
        </div>

        {/* 3 Métricas: Me deben, Debo, Balance neto */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Me deben */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-emerald-500/20">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider mb-0.5">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Te deben
            </span>
            <span className="text-base font-extrabold text-emerald-300 font-mono-num block truncate">
              +{totalTheyOweMe.toFixed(2)} €
            </span>
          </div>

          {/* Debo */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-rose-500/20">
            <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-wider mb-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Debes
            </span>
            <span className="text-base font-extrabold text-rose-300 font-mono-num block truncate">
              -{totalIOwe.toFixed(2)} €
            </span>
          </div>

          {/* Balance neto */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block truncate">
              Neto
            </span>
            <span
              className={`text-base font-extrabold font-mono-num block truncate ${
                netDebts >= 0 ? 'text-teal-300' : 'text-rose-400'
              }`}
            >
              {netDebts >= 0 ? `+${netDebts.toFixed(2)}` : netDebts.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* 2. Formulario para añadir deuda (Plegable, sin modal) */}
      {isAddOpen && (
        <div className="glass-panel p-4 rounded-3xl border border-indigo-500/40 animate-fade-slide shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Nueva Deuda / Préstamo
            </h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-3">
            {/* Selector Me deben vs Debo */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                ¿Quién debe a quién?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDebtType('they_owe_me')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    debtType === 'they_owe_me'
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Me deben a mí</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDebtType('i_owe')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    debtType === 'i_owe'
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Debo yo</span>
                </button>
              </div>
            </div>

            {/* Persona & Importe */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Persona
                </label>
                <input
                  type="text"
                  required
                  placeholder="Persona"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Importe (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold font-mono-num text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Motivo / Concepto
              </label>
              <input
                type="text"
                placeholder="Concepto"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 shadow-md"
              >
                Guardar Deuda
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Pestañas de filtro */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/80 text-xs">
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            filter === 'pending'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('they_owe_me')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            filter === 'they_owe_me'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Me deben
        </button>
        <button
          type="button"
          onClick={() => setFilter('i_owe')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            filter === 'i_owe'
              ? 'bg-rose-600/30 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Debo
        </button>
        <button
          type="button"
          onClick={() => setFilter('settled')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            filter === 'settled'
              ? 'bg-slate-800 text-slate-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Saldadas ({settledCount})
        </button>
      </div>

      {/* 4. Listado de Deudas */}
      <div className="space-y-2">
        {filteredDebts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-6 text-center text-slate-400 border border-slate-800 space-y-1">
            <p className="text-xs font-semibold">
              {filter === 'settled'
                ? 'No tienes deudas saldadas todavía.'
                : 'No hay deudas pendientes en esta sección.'}
            </p>
          </div>
        ) : (
          filteredDebts.map((item) => {
            const isTheyOweMe = item.type === 'they_owe_me';
            const isSettled = item.settled;

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl p-3.5 border transition flex items-center justify-between gap-3 ${
                  isSettled
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-70'
                    : isTheyOweMe
                    ? 'border-emerald-500/20 bg-emerald-950/5 hover:border-emerald-500/40'
                    : 'border-rose-500/20 bg-rose-950/5 hover:border-rose-500/40'
                }`}
              >
                {/* Botón Check para saldar */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleDebtSettled(item.id)}
                    title={isSettled ? 'Reactivar deuda' : 'Marcar como saldada'}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition active:scale-90 shrink-0 ${
                      isSettled
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-900 border-slate-700 text-transparent hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold truncate ${
                          isSettled
                            ? 'text-slate-400 line-through'
                            : 'text-white'
                        }`}
                      >
                        {item.person}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isTheyOweMe
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {isTheyOweMe ? 'Te debe' : 'Debes'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.concept || 'Sin concepto'}
                    </p>
                  </div>
                </div>

                {/* Importe y Acciones */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold font-mono-num block ${
                        isSettled
                          ? 'text-slate-400 line-through'
                          : isTheyOweMe
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isTheyOweMe ? '+' : '-'}{parseFloat(item.amount).toFixed(2)} €
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isSettled ? 'Saldada' : 'Pendiente'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestConfirm({
                        title: '¿Eliminar apunte?',
                        message: `¿Seguro que deseas eliminar el apunte de ${item.person} (${item.amount.toFixed(2)} €)?`,
                        confirmText: 'Eliminar',
                        onConfirm: () => deleteDebt(item.id),
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition active:scale-90"
                    title="Eliminar deuda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
