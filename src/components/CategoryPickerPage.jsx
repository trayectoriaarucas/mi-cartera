import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Check,
  Trash2,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { renderIcon } from '../utils/iconMap';

export const CategoryPickerPage = ({
  onBack,
  onSelectCategory,
  selectedCategoryId,
  type = 'expense',
}) => {
  const {
    expenseCategories,
    incomeCategories,
    deleteCustomCategory,
    requestConfirm,
  } = useWallet();
  const [search, setSearch] = useState('');

  const rawList = type === 'income' ? incomeCategories : expenseCategories;

  // Ordenadas estrictamente por orden alfabético
  const sortedCategories = useMemo(() => {
    const list = [...rawList];
    return list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [rawList]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedCategories;
    return sortedCategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [sortedCategories, search]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col animate-fade-slide">
      {/* Barra superior con Volver y Título */}
      <div className="flex items-center justify-between py-2 mb-3 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <h1 className="text-xs font-bold text-white uppercase tracking-wider">
          Categorías (A-Z)
        </h1>

        <div className="w-16" />
      </div>

      {/* Buscador rápido */}
      <div className="relative mb-3.5">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar categoría..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Rejilla de Categorías Ordenadas Alfabéticamente */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-6">
        {filteredCategories.length === 0 ? (
          <div className="glass-panel rounded-3xl p-6 text-center text-slate-400 border border-slate-800">
            <p className="text-xs">No hay categorías que coincidan con "{search}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat);
                    onBack();
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-slate-800/95 border-white text-white shadow-lg ring-1 ring-white/40'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${cat.color}20`,
                      borderColor: `${cat.color}40`,
                      color: cat.color,
                    }}
                  >
                    {renderIcon(cat.icon, 'w-4 h-4')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block truncate">
                      {cat.name}
                    </span>
                  </div>

                  {cat.id.startsWith('custom-') && (
                    <button
                      type="button"
                      title="Eliminar categoría personalizada"
                      onClick={(e) => {
                        e.stopPropagation();
                        requestConfirm({
                          title: '¿Eliminar categoría?',
                          message: `¿Deseas eliminar la categoría personalizada "${cat.name}"?`,
                          confirmText: 'Eliminar',
                          onConfirm: () => deleteCustomCategory(cat.id),
                        });
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-90 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
