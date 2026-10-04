export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'casa', name: 'Aportación Casa', icon: 'Home', color: '#10b981' },
  { id: 'amigos', name: 'Bizum / Amigos', icon: 'Users', color: '#6366f1' },
  { id: 'caprichos', name: 'Caprichos', icon: 'Sparkles', color: '#f43f5e' },
  { id: 'dentista', name: 'Dentista', icon: 'Smile', color: '#06b6d4' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', color: '#8b5cf6' },
  { id: 'gasolina', name: 'Gasolina', icon: 'Fuel', color: '#ef4444' },
  { id: 'gimnasio', name: 'Gimnasio', icon: 'Dumbbell', color: '#84cc16' },
  { id: 'itv', name: 'ITV', icon: 'ShieldCheck', color: '#0284c7' },
  { id: 'mascotas', name: 'Mascotas', icon: 'PawPrint', color: '#f59e0b' },
  { id: 'movil', name: 'Móvil', icon: 'Smartphone', color: '#14b8a6' },
  { id: 'necesario', name: 'Necesario', icon: 'AlertCircle', color: '#64748b' },
  { id: 'pedidos', name: 'Pedidos', icon: 'Bike', color: '#ea580c' },
  { id: 'repuestos', name: 'Repuestos', icon: 'Hammer', color: '#d97706' },
  { id: 'ropa', name: 'Ropa', icon: 'Shirt', color: '#a855f7' },
  { id: 'salidas', name: 'Salidas / Ocio', icon: 'UtensilsCrossed', color: '#ec4899' },
  { id: 'seguro_coche', name: 'Seguro Coche', icon: 'Car', color: '#4f46e5' },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie', color: '#eab308' },
  { id: 'suplementos', name: 'Suplementación', icon: 'Pill', color: '#0ea5e9' },
  { id: 'sushi', name: 'Sushi', icon: 'Sushi', color: '#fb7185' },
  { id: 'super', name: 'Súper / Compra', icon: 'ShoppingCart', color: '#22c55e' },
  { id: 'taller', name: 'Taller', icon: 'Wrench', color: '#71717a' },
  { id: 'veterinario', name: 'Veterinario', icon: 'Stethoscope', color: '#0d9488' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'devolucion', name: 'Devolución', icon: 'Banknote', color: '#06b6d4' },
  { id: 'extra', name: 'Dinero Extra', icon: 'Coins', color: '#8b5cf6' },
  { id: 'nomina', name: 'Nómina / Sueldo', icon: 'Briefcase', color: '#10b981' },
];

export const EXPENSE_CATEGORIES = DEFAULT_EXPENSE_CATEGORIES;
export const INCOME_CATEGORIES = DEFAULT_INCOME_CATEGORIES;

export const PAYMENT_METHODS = ['Bizum', 'Tarjeta', 'Transferencia', 'Efectivo'];

export const FIXED_CATEGORIES = [
  { id: 'casa_fijo', name: 'Aportación Casa', icon: 'Home', color: '#10b981' },
  { id: 'gaming_sub', name: 'Gaming / Suscripción', icon: 'Gamepad2', color: '#8b5cf6' },
  { id: 'gimnasio_fijo', name: 'Gimnasio', icon: 'Dumbbell', color: '#84cc16' },
  { id: 'itv_fijo', name: 'ITV', icon: 'ShieldCheck', color: '#0284c7' },
  { id: 'movil_fijo', name: 'Móvil', icon: 'Smartphone', color: '#14b8a6' },
  { id: 'seguro_fijo', name: 'Seguro Coche', icon: 'Car', color: '#4f46e5' },
  { id: 'otros_fijos', name: 'Otro Recibo', icon: 'FileText', color: '#64748b' },
];

export const GOAL_ICONS = [
  { name: 'Gamepad2', label: 'Gaming' },
  { name: 'Dumbbell', label: 'Fitness' },
  { name: 'Car', label: 'Coche / Moto' },
  { name: 'Plane', label: 'Viaje' },
  { name: 'Laptop', label: 'PC / Móvil' },
  { name: 'Shield', label: 'Colchón' },
  { name: 'Sparkles', label: 'Capricho' },
];
