import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Tag
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { renderIcon } from '../utils/iconMap';

const ICON_GROUPS = [
  {
    group: 'Gaming & Ocio',
    icons: [
      { id: 'Gamepad2', name: 'Gaming' },
      { id: 'Sparkles', name: 'Capricho' },
      { id: 'Film', name: 'Cine' },
      { id: 'Music', name: 'Música' },
      { id: 'Beer', name: 'Fiesta' },
      { id: 'Tv', name: 'Series' },
    ],
  },
  {
    group: 'Salud & Deporte',
    icons: [
      { id: 'Dumbbell', name: 'Gimnasio' },
      { id: 'Pill', name: 'Suplementos' },
      { id: 'Stethoscope', name: 'Salud / Vet' },
      { id: 'Heart', name: 'Bienestar' },
    ],
  },
  {
    group: 'Mascotas',
    icons: [
      { id: 'PawPrint', name: 'Huella' },
      { id: 'Dog', name: 'Perro' },
      { id: 'Cat', name: 'Gato' },
    ],
  },
  {
    group: 'Vehículo & Moto',
    icons: [
      { id: 'Fuel', name: 'Gasolina' },
      { id: 'Car', name: 'Coche' },
      { id: 'Wrench', name: 'Taller / Repuesto' },
      { id: 'ShieldCheck', name: 'ITV / Seguro' },
      { id: 'Bike', name: 'Moto / Bici' },
    ],
  },
  {
    group: 'Comida & Delivery',
    icons: [
      { id: 'ShoppingCart', name: 'Súper' },
      { id: 'Cookie', name: 'Snacks' },
      { id: 'Utensils', name: 'Comida' },
      { id: 'Fish', name: 'Sushi' },
      { id: 'Bike', name: 'Delivery' },
      { id: 'Coffee', name: 'Café' },
    ],
  },
  {
    group: 'Personal & Hogar',
    icons: [
      { id: 'Shirt', name: 'Ropa' },
      { id: 'Home', name: 'Casa' },
      { id: 'Smartphone', name: 'Móvil' },
      { id: 'Laptop', name: 'PC / Tech' },
      { id: 'AlertCircle', name: 'Necesario' },
      { id: 'Tag', name: 'General' },
    ],
  },
];

const COLOR_PALETTE = [
  '#8b5cf6', // Violeta
  '#3b82f6', // Azul
  '#06b6d4', // Cyan
  '#10b981', // Esmeralda
  '#14b8a6', // Teal
  '#f59e0b', // Ámbar
  '#f97316', // Naranja
  '#f43f5e', // Rosa Fresa
  '#ec4899', // Rosa
  '#a855f7', // Púrpura
  '#6366f1', // Índigo
  '#64748b', // Pizarra
];

export const NewCategoryPage = ({ onBack, onCreated }) => {
  const { addCustomCategory } = useWallet();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Gamepad2');
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = addCustomCategory({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });

    if (onCreated && newCat) {
      onCreated(newCat);
    } else {
      onBack();
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col animate-fade-slide">
      {/* Barra superior con Volver */}
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
          Nueva Categoría
        </h1>

        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* 1. Vista previa en tiempo real */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 text-center space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
            Vista previa
          </span>

          <div className="flex items-center justify-center py-2">
            <div
              className="px-4 py-2.5 rounded-2xl border text-sm font-bold flex items-center gap-2.5 transition-all shadow-md"
              style={{
                backgroundColor: `${selectedColor}18`,
                borderColor: `${selectedColor}60`,
                color: selectedColor,
              }}
            >
              {renderIcon(selectedIcon, 'w-5 h-5')}
              <span>{name.trim() || 'Nombre de la categoría'}</span>
            </div>
          </div>
        </div>

        {/* 2. Campo Nombre */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Nombre de la categoría
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* 3. Paleta de colores */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Color distintivo
          </label>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Selector de iconos Lucide organizado por categorías */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Elige un icono
          </label>

          <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
            {ICON_GROUPS.map((g) => (
              <div key={g.group} className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {g.group}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {g.icons.map((ic) => {
                    const isSelected = selectedIcon === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setSelectedIcon(ic.id)}
                        className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition active:scale-95 text-left ${
                          isSelected
                            ? 'bg-slate-800 border-white text-white shadow-md ring-1 ring-white/30'
                            : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span style={{ color: isSelected ? selectedColor : undefined }}>
                          {renderIcon(ic.id, 'w-4 h-4 shrink-0')}
                        </span>
                        <span className="truncate">{ic.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Botón Guardar */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
              name.trim()
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Guardar Categoría</span>
          </button>
        </div>
      </form>
    </div>
  );
};
