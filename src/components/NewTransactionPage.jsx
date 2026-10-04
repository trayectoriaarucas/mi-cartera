import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Repeat,
  Search,
  X
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { PAYMENT_METHODS } from '../data/categories';
import { renderIcon } from '../utils/iconMap';
import { CategoryPickerPage } from './CategoryPickerPage';

export const NewTransactionPage = ({ onBack, defaultType = 'expense' }) => {
  const {
    addTransaction,
    expenseCategories,
    incomeCategories,
    showToast,
  } = useWallet();

  const [subView, setSubView] = useState('form'); // 'form' | 'picker'
  const [type, setType] = useState(defaultType); // 'expense' or 'income'
  const [selectedCatId, setSelectedCatId] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [dateStr, setDateStr] = useState('');

  // Gasto fijo recurrence
  const [isFixed, setIsFixed] = useState(false);
  const [frequency, setFrequency] = useState('mensual'); // 'mensual' | 'semanal'

  const dateInputRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateStr(localISO);
    setTitle('');
    setIsFixed(false);
    setSelectedCatId('');
    setCategoryQuery('');

    if (defaultType === 'income') {
      setPaymentMethod('Transferencia');
    } else {
      setPaymentMethod('Tarjeta');
    }
  }, [defaultType]);

  // Handle hardware / gesture back button for subviews
  useEffect(() => {
    const handlePopState = () => {
      if (subView === 'picker') {
        setSubView('form');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [subView]);

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  // Categoría seleccionada actualmente (NO arbitraria)
  const selectedCat = useMemo(() => {
    if (!selectedCatId) return null;
    return currentCategories.find((c) => c.id === selectedCatId) || null;
  }, [currentCategories, selectedCatId]);

  // Sugerencias filtradas en tiempo real mientras el usuario escribe la categoría desde fuera
  const matchingCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return currentCategories;
    return currentCategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [currentCategories, categoryQuery]);

  const handleCategoryQueryChange = (val) => {
    setCategoryQuery(val);
    const q = val.trim().toLowerCase();
    if (!q) {
      setSelectedCatId('');
      return;
    }

    // Auto-selección si coincide exactamente con el nombre de alguna categoría
    const exact = currentCategories.find((c) => c.name.toLowerCase() === q);
    if (exact) {
      setSelectedCatId(exact.id);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCatId(cat.id);
    setCategoryQuery(cat.name);
    setSubView('form');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setTitle('');
    setIsFixed(false);
    setSelectedCatId('');
    setCategoryQuery('');
    if (newType === 'income') {
      setPaymentMethod('Transferencia');
    } else {
      setPaymentMethod('Tarjeta');
    }
  };

  const openNativePicker = () => {
    if (dateInputRef.current) {
      try {
        if (dateInputRef.current.showPicker) {
          dateInputRef.current.showPicker();
        } else {
          dateInputRef.current.focus();
        }
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const finalAmount = parseFloat(amountStr);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('Introduce un importe válido', 'error');
      return;
    }

    if (!selectedCat) {
      showToast('Selecciona o escribe una categoría', 'error');
      return;
    }

    const finalTitle = title.trim() || selectedCat.name;

    addTransaction({
      type,
      title: finalTitle,
      amount: finalAmount,
      category: selectedCat.id,
      paymentMethod,
      isHormiga: type === 'expense',
      isFixed,
      frequency,
      date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
    });

    onBack();
  };

  const methodIcons = {
    Bizum: Smartphone,
    Tarjeta: CreditCard,
    Transferencia: Building2,
    Efectivo: Banknote,
  };

  const currentAmountNum = parseFloat(amountStr) || 0;

  // 1. Sub-página: Selector de Categorías (Página completa limpia ordenada A-Z)
  if (subView === 'picker') {
    return (
      <CategoryPickerPage
        onBack={() => setSubView('form')}
        onSelectCategory={(cat) => handleSelectCategory(cat)}
        selectedCategoryId={selectedCatId}
        type={type}
      />
    );
  }

  // 2. Vista principal del formulario: limpio, directo y moderno
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col animate-fade-slide">
      {/* Barra superior con Volver y Selector Gasto / Ingreso */}
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
          Añadir {type === 'income' ? 'Ingreso' : 'Gasto'}
        </h1>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Gasto</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Ingreso</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* 1. Nombre */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Nombre
          </label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition"
          />
        </div>

        {/* 2. Importe */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Importe
          </span>

          <div className="flex items-center">
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-transparent text-4xl sm:text-5xl font-extrabold text-white font-mono-num focus:outline-none placeholder-slate-700"
            />
            <span className="text-3xl font-extrabold text-slate-400 ml-2">€</span>
          </div>
        </div>

        {/* 2. Categoría: Escribir desde fuera o entrar a buscarla */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categoría
            </span>
            <button
              type="button"
              onClick={() => {
                window.history.pushState({ sub: 'picker' }, '');
                setSubView('picker');
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 active:scale-95 transition"
            >
              <span>Ver todas (A-Z)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Si ya hay categoría elegida, muestra la tarjeta con opción de cambiar */}
          {selectedCat ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 animate-fade-slide">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-md"
                  style={{
                    backgroundColor: `${selectedCat.color}20`,
                    borderColor: `${selectedCat.color}40`,
                    color: selectedCat.color,
                  }}
                >
                  {renderIcon(selectedCat.icon, 'w-5 h-5')}
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white block truncate">
                    {selectedCat.name}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold block">
                    Categoría seleccionada
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCatId('');
                  setCategoryQuery('');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition active:scale-95"
              >
                <span>Cambiar</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Si no hay categoría seleccionada, escribe directamente desde fuera */
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={categoryQuery}
                  onChange={(e) => handleCategoryQueryChange(e.target.value)}
                  placeholder="Escribir categoría..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                {categoryQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryQuery('');
                      setSelectedCatId('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sugerencias en botones táctiles directos */}
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto">
                {matchingCategories.slice(0, 10).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition active:scale-95"
                  >
                    <span style={{ color: cat.color }}>
                      {renderIcon(cat.icon, 'w-3.5 h-3.5')}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Método de pago */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            ¿Cómo se realizó?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const IconComponent = methodIcons[m] || CreditCard;
              const isSelected = paymentMethod === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2.5 px-1 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-slate-800 border-slate-500 text-white font-bold shadow-md ring-1 ring-white/30'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mb-1 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{m}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Gasto fijo recurrente */}
        {type === 'expense' && (
          <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    ¿Es un gasto fijo o recurrente?
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Se guardará en tu lista de Gastos Fijos
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isFixed}
                onClick={() => setIsFixed(!isFixed)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out p-0.5 flex items-center shrink-0 ${
                  isFixed ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
              </button>
            </div>

            {isFixed && (
              <div className="pt-2 border-t border-slate-800/80 animate-fade-slide">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  ¿Cada cuánto se paga?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('mensual')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                      frequency === 'mensual'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cada Mes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('semanal')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                      frequency === 'semanal'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cada Semana
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Fecha y Hora nativa Android */}
        <div
          onClick={openNativePicker}
          className="glass-panel rounded-3xl p-4 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition active:bg-slate-900"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fecha y Hora:
            </span>
          </div>

          <input
            ref={dateInputRef}
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="bg-transparent text-sm text-white font-mono-num font-semibold focus:outline-none cursor-pointer border-0 p-0"
          />
        </div>

        {/* 7. Botón Añadir */}
        <div className="pt-2">
          <button
            type="button"
            disabled={currentAmountNum <= 0 || !selectedCat}
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
              currentAmountNum > 0 && selectedCat
                ? type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-950/70'
                  : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-rose-950/70'
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>
              {currentAmountNum > 0 && selectedCat
                ? `Añadir ${type === 'income' ? 'Ingreso' : 'Gasto'} (${currentAmountNum.toFixed(2)} €)`
                : !selectedCat && currentAmountNum > 0
                ? 'Elige o escribe una categoría'
                : `Añadir ${type === 'income' ? 'Ingreso' : 'Gasto'}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
