import React, { useState } from 'react';
import {
  PiggyBank,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWallet } from '../context/WalletContext';
import { GOAL_ICONS } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const SavingsGoals = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    depositToGoal,
    withdrawFromGoal,
    deleteSavingsGoal,
    requestConfirm,
    calculations: { totalSavings },
  } = useWallet();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeDepositId, setActiveDepositId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState({});

  // Form nueva meta
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newIcon, setNewIcon] = useState('Gamepad2');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleDepositSubmit = (goal, e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (isWithdraw) {
      withdrawFromGoal(goal.id, amt, 'Retiro');
    } else {
      depositToGoal(goal.id, amt, 'Aportación');
      if (goal.currentAmount + amt >= goal.targetAmount) {
        triggerConfetti();
      }
    }

    setActiveDepositId(null);
    setDepositAmount('');
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    addSavingsGoal({
      title: newTitle,
      targetAmount: parseFloat(newTarget),
      currentAmount: parseFloat(newCurrent) || 0,
      icon: newIcon,
      color: '#8b5cf6',
    });

    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
    setIsAddOpen(false);
  };

  const toggleHistory = (goalId) => {
    setExpandedHistory((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  return (
    <div className="space-y-4 animate-fade-slide">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Metas y Huchas
              </h2>
              <p className="text-xs text-slate-400">
                Objetivos personales de ahorro
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-purple-950/50"
          >
            {isAddOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddOpen ? 'Cerrar' : 'Nueva Meta'}</span>
          </button>
        </div>

        <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
              Total Ahorrado
            </span>
            <span className="text-2xl font-extrabold text-white font-mono-num">
              {totalSavings.toFixed(2)} €
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
            {savingsGoals.length} {savingsGoals.length === 1 ? 'meta' : 'metas'}
          </span>
        </div>
      </div>

      {/* Formulario INLINE Nueva Meta (Sin modales) */}
      {isAddOpen && (
        <div className="glass-panel p-4 rounded-3xl border border-purple-500/40 shadow-xl space-y-3 animate-fade-slide">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Crear Nueva Meta
            </h3>
            <button
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateGoal} className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Nombre de la meta
              </label>
              <input
                type="text"
                required
                placeholder="Nombre de la meta"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Objetivo (€)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="500"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono-num text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Ahorro inicial (€)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="0"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono-num text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-2">
                {GOAL_ICONS.map((ic) => (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setNewIcon(ic.name)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition active:scale-95 ${
                      newIcon === ic.name
                        ? 'bg-purple-600 border-white text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {renderIcon(ic.name, 'w-5 h-5 mb-0.5')}
                    <span className="text-xs">{ic.label}</span>
                  </button>
                ))}
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
                className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition active:scale-95 shadow-md"
              >
                Crear Meta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Metas */}
      <div className="space-y-3">
        {savingsGoals.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-slate-400 border border-slate-800">
            No tienes metas de ahorro todavía.
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const current = parseFloat(goal.currentAmount) || 0;
            const target = parseFloat(goal.targetAmount) || 1;
            const percent = Math.min(100, Math.round((current / target) * 100));
            const isCompleted = current >= target;
            const isDepositOpen = activeDepositId === goal.id;
            const isExpanded = !!expandedHistory[goal.id];

            return (
              <div
                key={goal.id}
                className={`glass-panel rounded-3xl p-4 border transition ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-slate-800'
                }`}
              >
                {/* Header de la Meta */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${goal.color || '#8b5cf6'}20`,
                        borderColor: `${goal.color || '#8b5cf6'}40`,
                        color: goal.color || '#8b5cf6',
                      }}
                    >
                      {renderIcon(goal.icon || 'Gamepad2', 'w-5 h-5')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {goal.title}
                        </h3>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            Completada
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Objetivo: {target.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      requestConfirm({
                        title: '¿Eliminar hucha / meta?',
                        message: `¿Seguro que deseas eliminar la meta "${goal.title}"?`,
                        confirmText: 'Eliminar',
                        onConfirm: () => deleteSavingsGoal(goal.id),
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-1.5 my-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <div className="font-mono-num">
                      <span className="text-lg font-extrabold text-white">
                        {current.toFixed(2)} €
                      </span>
                      <span className="text-slate-400 text-xs ml-1">
                        / {target.toFixed(2)} €
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400 font-mono-num text-sm">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Acciones directas INLINE */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (isDepositOpen && !isWithdraw) {
                          setActiveDepositId(null);
                        } else {
                          setActiveDepositId(goal.id);
                          setIsWithdraw(false);
                          setDepositAmount('');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Aportar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isDepositOpen && isWithdraw) {
                          setActiveDepositId(null);
                        } else {
                          setActiveDepositId(goal.id);
                          setIsWithdraw(true);
                          setDepositAmount('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition active:scale-95"
                    >
                      <span>Retirar</span>
                    </button>
                  </div>

                  {goal.history && goal.history.length > 0 && (
                    <button
                      onClick={() => toggleHistory(goal.id)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 py-1 px-2"
                    >
                      <span>{goal.history.length} aportes</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Formulario INLINE para Aportar / Retirar (Sin modales emergentes) */}
                {isDepositOpen && (
                  <form
                    onSubmit={(e) => handleDepositSubmit(goal, e)}
                    className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 animate-fade-slide"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-slate-300">
                        {isWithdraw ? 'Retirar dinero de esta meta' : 'Ingresar ahorro a esta meta'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveDepositId(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        required
                        autoFocus
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold font-mono-num text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 shrink-0 ${
                          isWithdraw ? 'bg-rose-600' : 'bg-emerald-600'
                        }`}
                      >
                        Confirmar
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {[10, 20, 50, 100].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setDepositAmount(val.toString())}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-750 text-slate-300 hover:text-white active:scale-95"
                        >
                          +{val}€
                        </button>
                      ))}
                    </div>
                  </form>
                )}

                {/* Historial desplegable */}
                {isExpanded && goal.history && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 animate-fade-slide">
                    <span className="text-xs uppercase font-bold text-slate-500 block">
                      Movimientos:
                    </span>
                    {goal.history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        <div className="flex items-center gap-1.5">
                          {h.amount > 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span className="text-slate-300">{h.note}</span>
                        </div>
                        <span
                          className={`font-mono-num font-bold ${
                            h.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {h.amount > 0 ? `+${h.amount.toFixed(2)}` : h.amount.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
