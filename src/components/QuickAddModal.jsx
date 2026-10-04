import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { renderIcon } from '../utils/iconMap';

export const QuickAddModal = ({ isOpen, onClose, defaultType = 'expense' }) => {
  const { addTransaction } = useWallet();

  const [type, setType] = useState(defaultType); // 'expense' or 'income'
  const [selectedCat, setSelectedCat] = useState(EXPENSE_CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [dateStr, setDateStr] = useState('');
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      const now = new Date();
      const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateStr(localISO);
      setTitle(''); // Campo de texto siempre limpio al entrar

      if (defaultType === 'income') {
        setSelectedCat(INCOME_CATEGORIES[0]);
        setPaymentMethod('Transferencia');
      } else {
        setSelectedCat(EXPENSE_CATEGORIES[0]);
        setPaymentMethod('Tarjeta');
      }
      setAmountStr('');
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSelectCategory = (cat) => {
    setSelectedCat(cat);
    // No sobreescribimos 'title', queda como placeholder automático
    if (type === 'expense') {
      if (cat.id === 'bizum_pago') setPaymentMethod('Bizum');
      if (cat.id === 'gasolina') setPaymentMethod('Tarjeta');
    } else {
      if (cat.id === 'nomina') setPaymentMethod('Transferencia');
      if (cat.id === 'bizum_ingreso') setPaymentMethod('Bizum');
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setTitle('');
    if (newType === 'income') {
      setSelectedCat(INCOME_CATEGORIES[0]);
      setPaymentMethod('Transferencia');
    } else {
      setSelectedCat(EXPENSE_CATEGORIES[0]);
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
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    const finalTitle = title.trim() || selectedCat.name;

    addTransaction({
      type,
      title: finalTitle,
      amount: finalAmount,
      category: selectedCat.id,
      paymentMethod,
      isHormiga: type === 'expense' && selectedCat.id !== 'super', // Super normal no cuenta como capricho
      date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
    });

    onClose();
  };

  const methodIcons = {
    Bizum: Smartphone,
    Transferencia: Building2,
    Tarjeta: CreditCard,
    Efectivo: Banknote,
  };

  const currentAmountNum = parseFloat(amountStr) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm transition-opacity duration-200">
      <div
        className="w-full max-w-md h-[550px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera: Selector Gasto / Ingreso */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Gasto</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Ingreso</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Concepto (Letras legibles, placeholder automático) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Concepto
            </label>
            <div className="relative flex items-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mr-2 transition-colors duration-200"
                style={{
                  backgroundColor: `${selectedCat.color}20`,
                  borderColor: `${selectedCat.color}40`,
                  color: selectedCat.color,
                }}
              >
                {renderIcon(selectedCat.icon, 'w-5 h-5')}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`${selectedCat.name} (opcional)`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Categoría
            </label>
            <div className="h-32 overflow-y-auto p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="grid grid-cols-5 gap-1.5">
                {currentCategories.map((cat) => {
                  const isSelected = selectedCat.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 text-center active:scale-95 ${
                        isSelected
                          ? 'bg-slate-800 border-white text-white font-bold shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="mb-1" style={{ color: cat.color }}>
                        {renderIcon(cat.icon, 'w-5 h-5')}
                      </div>
                      <span className="text-xs leading-tight line-clamp-1 w-full">
                        {cat.short || cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Importe */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Importe
              </span>
              <div className="flex items-center gap-1.5">
                {(selectedCat.presets || [5, 10, 20, 50]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmountStr(p.toString())}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition active:scale-90"
                  >
                    {p}€
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-transparent text-3xl font-extrabold text-white font-mono-num focus:outline-none placeholder-slate-700"
              />
              <span className="text-2xl font-bold text-slate-500">€</span>
            </div>
          </div>

          {/* Método */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Método
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
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-slate-800 border-white text-white font-bold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <span className="text-xs">{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fecha y Hora: Android native picker al tocar */}
          <div
            onClick={openNativePicker}
            className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:border-slate-700 transition active:bg-slate-900"
          >
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Fecha y hora:</span>
            </div>

            <input
              ref={dateInputRef}
              type="datetime-local"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="bg-transparent text-xs text-white font-mono-num focus:outline-none cursor-pointer border-0 p-0"
            />
          </div>
        </div>

        {/* Pie */}
        <div className="h-16 p-3 border-t border-slate-800 bg-slate-950 shrink-0 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition active:scale-95"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={currentAmountNum <= 0}
            onClick={handleSave}
            className={`flex-1 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              currentAmountNum > 0
                ? type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>
              Guardar {type === 'income' ? 'Ingreso' : 'Gasto'} ({currentAmountNum > 0 ? `${currentAmountNum.toFixed(2)} €` : '0 €'})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
