import React from 'react';
import { Clock, ArrowRight, Plus } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const RecentActivityWidget = ({ onSeeAll, onAdd }) => {
  const { transactions, expenseCategories, incomeCategories } = useWallet();

  const recentList = transactions.slice(0, 4);

  const getCatMeta = (catId, type) => {
    const list = type === 'income' ? (incomeCategories || INCOME_CATEGORIES) : (expenseCategories || EXPENSE_CATEGORIES);
    return (
      list.find((c) => c.id === catId) || {
        name: 'Varios',
        icon: 'Coins',
        color: '#94a3b8',
      }
    );
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const today = new Date();
      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      const timePart = d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (isToday) return `Hoy, ${timePart}`;

      const datePart = d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      });
      return `${datePart}, ${timePart}`;
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Últimos Movimientos
        </h3>
        {transactions.length > 0 && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition active:scale-95"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="py-6 text-center text-slate-400 space-y-2">
          <p className="text-xs">Sin movimientos registrados todavía.</p>
          <button
            type="button"
            onClick={onAdd}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {recentList.map((item) => {
            const isIncome = item.type === 'income';
            const meta = getCatMeta(item.category, item.type);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${meta.color}20`,
                      borderColor: `${meta.color}35`,
                      color: meta.color,
                    }}
                  >
                    {renderIcon(meta.icon, 'w-4 h-4')}
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white truncate block">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{item.paymentMethod || 'Tarjeta'}</span>
                      <span>&bull;</span>
                      <span className="font-mono-num">{formatDateTime(item.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-extrabold font-mono-num ${
                      isIncome ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {isIncome ? `+${item.amount.toFixed(2)}` : `-${item.amount.toFixed(2)}`} €
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
