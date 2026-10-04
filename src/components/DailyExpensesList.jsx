import React, { useState, useMemo } from 'react';
import {
  Clock,
  Trash2,
  Plus,
  Search,
  Calendar,
  X,
  Filter
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const DailyExpensesList = ({ onOpenAdd }) => {
  const {
    timeRange,
    setTimeRange,
    transactions = [],
    deleteTransaction,
    requestConfirm,
    expenseCategories,
    incomeCategories,
  } = useWallet();

  // Estados de filtro
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getCatMeta = (catId, type) => {
    const list = type === 'income' ? (incomeCategories || INCOME_CATEGORIES) : (expenseCategories || EXPENSE_CATEGORIES);
    return (
      list.find((c) => c.id === catId) || {
        name: 'Varios',
        icon: 'Tag',
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

  // Filtrado reactivo completo: Por texto, importe, fecha nativa y tipo
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return transactions.filter((item) => {
      // 1. Filtro de tipo (Gasto / Ingreso)
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }

      // 2. Filtro de fechas con calendario nativo
      if (startDate || endDate) {
        const itemDateStr = item.date ? item.date.slice(0, 10) : '';
        if (startDate && itemDateStr < startDate) return false;
        if (endDate && itemDateStr > endDate) return false;
      } else if (timeRange !== 'all') {
        // Si no hay rango de fecha manual, aplicamos el selector de período rápido
        const now = new Date();
        const itemDate = new Date(item.date);

        if (timeRange === 'day') {
          const isToday =
            itemDate.getDate() === now.getDate() &&
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (timeRange === 'week') {
          const dayOfWeek = now.getDay() || 7;
          const monday = new Date(now);
          monday.setDate(now.getDate() - dayOfWeek + 1);
          monday.setHours(0, 0, 0, 0);
          if (itemDate < monday) return false;
        } else if (timeRange === 'month') {
          const isCurrentMonth =
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();
          if (!isCurrentMonth) return false;
        }
      }

      // 3. Filtro de búsqueda por texto o cantidad
      if (q) {
        const catMeta = getCatMeta(item.category, item.type);
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const notesMatch = (item.notes || '').toLowerCase().includes(q);
        const catMatch = (catMeta.name || '').toLowerCase().includes(q);
        const methodMatch = (item.paymentMethod || '').toLowerCase().includes(q);

        // Búsqueda por importe numérico (ej: "15" encuentra 15, 15.50, etc.)
        const amtStr = String(item.amount || '');
        const amtFixed = (item.amount || 0).toFixed(2);
        const amountMatch = amtStr.includes(q) || amtFixed.includes(q);

        if (!titleMatch && !notesMatch && !catMatch && !methodMatch && !amountMatch) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filterType, searchQuery, startDate, endDate, timeRange, expenseCategories, incomeCategories]);

  // Cálculos dinámicos según los movimientos filtrados
  const { filteredIn, filteredOut, filteredBalance } = useMemo(() => {
    let tin = 0;
    let tout = 0;
    filteredList.forEach((t) => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'income') tin += amt;
      else tout += amt;
    });
    return {
      filteredIn: Math.round(tin * 100) / 100,
      filteredOut: Math.round(tout * 100) / 100,
      filteredBalance: Math.round((tin - tout) * 100) / 100,
    };
  }, [filteredList]);

  const hasActiveFilters = searchQuery || startDate || endDate || filterType !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setFilterType('all');
    setTimeRange('all');
  };

  return (
    <div className="space-y-3.5 animate-fade-slide">
      {/* 1. Barra de Búsqueda rápida por texto o cantidad */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar concepto o importe..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón para desplegar el selector de calendario nativo */}
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`p-2.5 rounded-2xl border transition active:scale-95 flex items-center justify-center shrink-0 ${
            isCalendarOpen || startDate || endDate
              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Filtrar por fecha en calendario"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Selector con calendario nativo de Android (Desde / Hasta) */}
      {isCalendarOpen && (
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-700 bg-slate-950/80 space-y-2.5 animate-fade-slide">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Filtrar por Calendario
            </span>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Limpiar fecha
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Desde:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono-num font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Hasta:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono-num font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Selector de período rápido si no se usan fechas manuales */}
      {!startDate && !endDate && (
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-1">
          {[
            { id: 'all', label: 'Todo' },
            { id: 'month', label: 'Este Mes' },
            { id: 'week', label: 'Esta Semana' },
            { id: 'day', label: 'Hoy' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeRange(tab.id)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 ${
                timeRange === tab.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 4. Resumen reactivo de la búsqueda/período actual */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-bold text-emerald-400 block mb-0.5">
            Ingresos
          </span>
          <span className="text-base font-extrabold text-white font-mono-num block">
            +{filteredIn.toFixed(2)} €
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-bold text-rose-400 block mb-0.5">
            Gastos
          </span>
          <span className="text-base font-extrabold text-white font-mono-num block">
            -{filteredOut.toFixed(2)} €
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-bold text-slate-300 block mb-0.5">
            Saldo
          </span>
          <span
            className={`text-base font-extrabold font-mono-num block ${
              filteredBalance >= 0 ? 'text-teal-300' : 'text-rose-400'
            }`}
          >
            {filteredBalance >= 0 ? `+${filteredBalance.toFixed(2)}` : filteredBalance.toFixed(2)} €
          </span>
        </div>
      </div>

      {/* 5. Filtros de tipo (Todos, Gastos, Ingresos) + Botón Añadir */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({filteredList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterType === 'expense'
                ? 'bg-rose-500/20 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gastos
          </button>
          <button
            type="button"
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterType === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ingresos
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition"
            >
              Limpiar
            </button>
          )}

          <button
            onClick={onOpenAdd}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* 6. Listado de Movimientos filtrados */}
      {filteredList.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-center text-slate-400 border border-slate-800 space-y-2">
          <p className="text-xs">No se encontraron movimientos con los filtros actuales.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredList.map((item) => {
            const isIncome = item.type === 'income';
            const meta = getCatMeta(item.category, item.type);

            return (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-3 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
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
                    {renderIcon(meta.icon, 'w-5 h-5')}
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white truncate block leading-tight">
                      {item.title}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-300">
                        {meta.name}
                      </span>
                      <span>&bull;</span>
                      <span className="text-slate-400">
                        {item.paymentMethod || 'Tarjeta'}
                      </span>
                      <span>&bull;</span>
                      <span className="text-slate-400 font-mono-num flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {formatDateTime(item.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-base font-extrabold font-mono-num ${
                      isIncome ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {isIncome ? `+${item.amount.toFixed(2)}` : `-${item.amount.toFixed(2)}`} €
                  </span>

                  <button
                    onClick={() => {
                      requestConfirm({
                        title: '¿Eliminar movimiento?',
                        message: `¿Seguro que deseas eliminar "${item.title}" (${item.amount.toFixed(2)} €)?`,
                        confirmText: 'Eliminar',
                        onConfirm: () => deleteTransaction(item.id),
                      });
                    }}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-90"
                    title="Eliminar movimiento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
