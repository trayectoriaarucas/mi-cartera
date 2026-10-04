import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  X,
  Check
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { FIXED_CATEGORIES } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const FixedExpensesManager = () => {
  const {
    fixedExpenses,
    toggleFixedPaid,
    deleteFixedExpense,
    addFixedExpense,
    requestConfirm,
    selectedMonth,
    calculations: { totalFixedExpected, totalFixedPaid, totalFixedPending },
  } = useWallet();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(FIXED_CATEGORIES[0].id);
  const [dueDay, setDueDay] = useState('1');
  const [frequency, setFrequency] = useState('monthly');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    addFixedExpense({
      name,
      amount: parseFloat(amount),
      category,
      frequency,
      dueDay: parseInt(dueDay, 10) || 1,
    });

    setName('');
    setAmount('');
    setFrequency('monthly');
    setIsAddOpen(false);
  };

  const getCatMeta = (catId) => {
    return FIXED_CATEGORIES.find((c) => c.id === catId) || {
      name: 'Otro Fijo',
      icon: 'FileText',
      color: '#64748b',
    };
  };

  const percentPaid = totalFixedExpected > 0 ? Math.round((totalFixedPaid / totalFixedExpected) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-slide">
      {/* Top Overview */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Gastos Fijos
              </h2>
              <p className="text-xs text-slate-400">
                Compromisos recurrentes del mes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-950/50"
          >
            {isAddOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddOpen ? 'Cerrar' : 'Nuevo Fijo'}</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Previsto</span>
              <span className="text-2xl font-extrabold text-white font-mono-num">
                {totalFixedExpected.toFixed(2)} €
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Estado actual</span>
              <span className="text-xs font-bold text-emerald-400 font-mono-num">
                {totalFixedPaid.toFixed(2)} € pagados ({percentPaid}%)
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${percentPaid}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {totalFixedPaid.toFixed(2)} € pagados
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {totalFixedPending.toFixed(2)} € pendientes
            </span>
          </div>
        </div>
      </div>

      {/* Formulario INLINE (Sin modal emergente) */}
      {isAddOpen && (
        <div className="glass-panel p-4 rounded-3xl border border-indigo-500/40 shadow-xl space-y-3 animate-fade-slide">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Registrar Nuevo Gasto Fijo
            </h3>
            <button
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Nombre del gasto
              </label>
              <input
                type="text"
                required
                placeholder="Nombre del recibo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono-num text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Día de cobro (1-31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono-num text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                Frecuencia
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                    frequency === 'monthly'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                    frequency === 'weekly'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semanal
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                Categoría
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                {FIXED_CATEGORIES.map((c) => {
                  const isSelected = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition active:scale-95 text-left ${
                        isSelected
                          ? 'bg-slate-800 border-white text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span style={{ color: c.color }}>{renderIcon(c.icon, 'w-4 h-4')}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                Guardar Fijo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de gastos fijos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tus Recibos
          </span>
          <span className="text-xs text-slate-500">
            Toca el check para marcar cobrado
          </span>
        </div>

        {fixedExpenses.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-slate-500 border border-slate-800">
            No tienes gastos fijos configurados todavía.
          </div>
        ) : (
          fixedExpenses.map((item) => {
            const isPaid = (item.paidMonths || []).includes(selectedMonth);
            const meta = getCatMeta(item.category);

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl p-3.5 border transition flex items-center justify-between gap-3 ${
                  isPaid
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleFixedPaid(item.id, selectedMonth)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition active:scale-90 shrink-0 ${
                      isPaid
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-900/40'
                        : 'bg-slate-900 border-slate-700 text-transparent hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      borderColor: `${meta.color}30`,
                      color: meta.color,
                    }}
                  >
                    {renderIcon(meta.icon, 'w-5 h-5')}
                  </div>

                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold truncate transition ${
                        isPaid ? 'text-slate-300 line-through opacity-80' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-300">
                        {item.frequency === 'weekly' ? 'Semanal' : `Mensual (día ${item.dueDay})`}
                      </span>
                      <span>&bull;</span>
                      <span>{meta.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white font-mono-num block">
                      {parseFloat(item.amount).toFixed(2)} €
                    </span>
                    <span
                      className={`text-xs font-semibold block ${
                        isPaid ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isPaid ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      requestConfirm({
                        title: '¿Eliminar gasto fijo?',
                        message: `¿Seguro que deseas eliminar "${item.name}" (${item.amount.toFixed(2)} €)?`,
                        confirmText: 'Eliminar',
                        onConfirm: () => deleteFixedExpense(item.id),
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-90"
                    title="Eliminar gasto fijo"
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
