import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Flame,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const HormigaGauge = ({ onQuickAdd }) => {
  const {
    calculations: {
      hormigaSpent,
      hormigaCap,
      hormigaRemaining,
      hormigaPercent,
      semaforo,
      daysLeft,
      dailyAllowance,
      monthTransactions,
    },
    settings,
    expenseCategories,
  } = useWallet();

  // Status configuration
  const statusConfig = {
    safe: {
      label: 'Bajo Control',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      barColor: 'from-emerald-500 to-teal-400',
      textColor: 'text-emerald-400',
      icon: CheckCircle2,
      message: `Buen ritmo: te quedan ${hormigaRemaining.toFixed(2)} € para este mes.`,
      cardGlow: 'border-emerald-500/20 shadow-emerald-950/20',
    },
    warning: {
      label: 'Precaución',
      badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      barColor: 'from-yellow-500 to-amber-500',
      textColor: 'text-amber-400',
      icon: AlertTriangle,
      message: `Has consumido el ${hormigaPercent}% de tu tope mensual.`,
      cardGlow: 'border-amber-500/30 shadow-amber-950/30',
    },
    danger: {
      label: 'Límite Próximo',
      badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      barColor: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
      icon: Flame,
      message: `Atención: solo te quedan ${hormigaRemaining.toFixed(2)} € de margen este mes.`,
      cardGlow: 'border-orange-500/40 shadow-orange-950/40',
    },
    exceeded: {
      label: 'Tope Superado',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
      barColor: 'from-red-600 to-rose-500',
      textColor: 'text-red-400',
      icon: AlertCircle,
      message: `Has superado tu tope de ${hormigaCap} € en +${Math.abs(hormigaRemaining).toFixed(2)} €.`,
      cardGlow: 'border-red-500/60 shadow-red-950/50 animate-danger-glow',
    },
  };

  const currentStatus = statusConfig[semaforo] || statusConfig.safe;
  const StatusIcon = currentStatus.icon;

  // Top spend categories
  const topCategories = React.useMemo(() => {
    const map = {};
    (monthTransactions || []).forEach((t) => {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + (parseFloat(t.amount) || 0);
      }
    });

    return (expenseCategories || EXPENSE_CATEGORIES).map((cat) => ({
      ...cat,
      spent: map[cat.id] ? Math.round(map[cat.id] * 100) / 100 : 0,
    }))
      .filter((cat) => cat.spent > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);
  }, [monthTransactions, expenseCategories]);

  const clampedPercent = Math.min(100, Math.max(0, hormigaPercent));

  return (
    <div
      className={`glass-panel rounded-3xl p-4 sm:p-5 border transition-all duration-300 shadow-xl relative overflow-hidden ${currentStatus.cardGlow}`}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none ${
          semaforo === 'exceeded'
            ? 'bg-red-600'
            : semaforo === 'danger'
            ? 'bg-orange-600'
            : semaforo === 'warning'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Tope de Gastos del Mes
            </h2>
            <p className="text-xs text-slate-400">
              Límite fijado en <strong className="text-white">{hormigaCap} €</strong>
            </p>
          </div>
        </div>

        {/* Semáforo Pill Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${currentStatus.badgeBg}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{currentStatus.label}</span>
        </div>
      </div>

      {/* Main Figures: Spent vs Cap */}
      <div className="my-3 relative z-10">
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono-num">
              {hormigaSpent.toFixed(2)}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-400">
              € gastados
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-medium text-slate-400 block">
              {hormigaRemaining >= 0 ? 'Margen libre' : 'Excedido'}
            </span>
            <span
              className={`text-lg sm:text-xl font-bold font-mono-num ${
                hormigaRemaining >= 0 ? currentStatus.textColor : 'text-red-400 font-black'
              }`}
            >
              {hormigaRemaining >= 0
                ? `${hormigaRemaining.toFixed(2)} €`
                : `+${Math.abs(hormigaRemaining).toFixed(2)} €`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full h-3.5 p-0.5 border border-slate-800 relative overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${currentStatus.barColor}`}
            style={{ width: `${clampedPercent}%` }}
          />

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/50"
            style={{ left: `${settings.alertThresholdYellow || 65}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-400/60"
            style={{ left: `${settings.alertThresholdRed || 85}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 mt-1 font-mono-num">
          <span>0 €</span>
          <span>{hormigaPercent}% consumido</span>
          <span>{hormigaCap} € tope</span>
        </div>
      </div>

      {/* Daily allowance & Days left */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/50">
          <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Días restantes
          </span>
          <span className="text-sm font-bold text-white font-mono-num">
            {daysLeft} días del mes
          </span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/50">
          <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-0.5">
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            Límite diario
          </span>
          <span className="text-sm font-bold font-mono-num text-cyan-300">
            {hormigaRemaining > 0 ? `${dailyAllowance} €` : '0.00 €'}
            <span className="text-xs font-normal text-slate-400"> /día</span>
          </span>
        </div>
      </div>

      {/* Top Categories Pills */}
      {topCategories.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-1.5">
          {topCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300"
            >
              <span style={{ color: cat.color }}>{renderIcon(cat.icon, 'w-3.5 h-3.5')}</span>
              <span>{cat.short}:</span>
              <span className="font-bold text-white font-mono-num">{cat.spent.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
