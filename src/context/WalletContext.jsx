import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getInitialData } from '../data/initialData';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../data/categories';

const STORAGE_KEY = 'mi_cartera_data_clean_v2';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const getNowMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getNowMonth);
  const [timeRange, setTimeRange] = useState('all'); // Default 'all' so all transactions are visible immediately

  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) return parsed;
      }
    } catch (err) {
      console.warn('Error reading LocalStorage:', err);
    }
    return getInitialData();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving to LocalStorage:', err);
    }
  }, [data]);

  // Combined categories: default + custom user created categories (sin duplicados)
  const expenseCategories = useMemo(() => {
    const customClean = (data.customCategories || []).filter((custom) => {
      return !DEFAULT_EXPENSE_CATEGORIES.some(
        (def) => def.name.toLowerCase() === custom.name.toLowerCase() || def.id === custom.id
      );
    });
    return [...DEFAULT_EXPENSE_CATEGORIES, ...customClean];
  }, [data.customCategories]);

  // Limpieza automática en LocalStorage si existían categorías creadas antes que ahora son por defecto
  useEffect(() => {
    if (data.customCategories && data.customCategories.length > 0) {
      const filtered = data.customCategories.filter(
        (custom) => !DEFAULT_EXPENSE_CATEGORIES.some(
          (def) => def.name.toLowerCase() === custom.name.toLowerCase() || def.id === custom.id
        )
      );
      if (filtered.length !== data.customCategories.length) {
        setData((prev) => ({
          ...prev,
          customCategories: filtered,
        }));
      }
    }
  }, [data.customCategories]);

  const incomeCategories = useMemo(() => {
    return DEFAULT_INCOME_CATEGORIES;
  }, []);

  const addCustomCategory = (catData) => {
    const name = typeof catData === 'object' ? catData.name : catData;
    const icon = typeof catData === 'object' && catData.icon ? catData.icon : 'Tag';
    const color = typeof catData === 'object' && catData.color ? catData.color : '#38bdf8';

    if (!name || !name.trim()) return null;
    const newCat = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      icon,
      color,
    };
    setData((prev) => ({
      ...prev,
      customCategories: [...(prev.customCategories || []), newCat],
    }));
    return newCat;
  };

  const deleteCustomCategory = (id) => {
    setData((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).filter((c) => c.id !== id),
    }));
  };

  // Add transaction (expense or income), with option to save as fixed expense
  const addTransaction = ({
    type = 'expense',
    title,
    amount,
    category,
    paymentMethod = 'Tarjeta',
    isHormiga = true,
    isFixed = false,
    frequency = 'mensual',
    date,
    notes = '',
  }) => {
    const finalAmount = parseFloat(amount) || 0;
    const finalTitle = title ? title.trim() : (type === 'income' ? 'Ingreso' : 'Gasto');
    const finalDate = date || new Date().toISOString();

    const newTx = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      title: finalTitle,
      amount: finalAmount,
      category: category || (type === 'income' ? 'nomina' : 'caprichos'),
      paymentMethod,
      isHormiga: type === 'expense' ? isHormiga : false,
      date: finalDate,
      notes,
    };

    let updatedFixed = data.fixedExpenses || [];
    if (type === 'expense' && isFixed) {
      const newFixed = {
        id: 'fix-' + Date.now(),
        name: finalTitle,
        amount: finalAmount,
        category: category || 'otros_fijos',
        frequency: frequency || 'mensual',
        dueDay: new Date(finalDate).getDate(),
        active: true,
        paidMonths: [selectedMonth],
      };
      updatedFixed = [...updatedFixed, newFixed];
    }

    setData((prev) => ({
      ...prev,
      transactions: [newTx, ...(prev.transactions || [])],
      fixedExpenses: updatedFixed,
    }));

    return newTx;
  };

  const deleteTransaction = (id) => {
    setData((prev) => ({
      ...prev,
      transactions: (prev.transactions || []).filter((t) => t.id !== id),
    }));
  };

  const updateTransaction = (id, fields) => {
    setData((prev) => ({
      ...prev,
      transactions: (prev.transactions || []).map((t) =>
        t.id === id ? { ...t, ...fields } : t
      ),
    }));
  };

  // Fixed Expenses
  const addFixedExpense = ({ name, amount, category, frequency = 'mensual', dueDay }) => {
    const newFixed = {
      id: 'fix-' + Date.now(),
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      category: category || 'otros_fijos',
      frequency: frequency || 'mensual',
      dueDay: parseInt(dueDay, 10) || 1,
      active: true,
      paidMonths: [],
    };
    setData((prev) => ({
      ...prev,
      fixedExpenses: [...(prev.fixedExpenses || []), newFixed],
    }));
  };

  const toggleFixedPaid = (id, monthKey = selectedMonth) => {
    setData((prev) => {
      const targetItem = (prev.fixedExpenses || []).find((item) => item.id === id);
      if (!targetItem) return prev;

      const paidMonths = targetItem.paidMonths || [];
      const isPaid = paidMonths.includes(monthKey);

      let updatedTransactions = prev.transactions || [];

      if (!isPaid) {
        // Al marcarlo como pagado este mes, se añade el gasto automáticamente
        const now = new Date();
        const autoTx = {
          id: 'tx-fix-' + id + '-' + monthKey,
          type: 'expense',
          title: targetItem.name,
          amount: parseFloat(targetItem.amount) || 0,
          category: targetItem.category || 'otros_fijos',
          paymentMethod: 'Tarjeta',
          isHormiga: true,
          isFixed: true,
          fixedExpenseId: id,
          fixedMonth: monthKey,
          date: `${monthKey}-${String(targetItem.dueDay || now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00.000Z`,
          notes: 'Cobro fijo mensual',
        };

        const exists = updatedTransactions.some(
          (t) => t.id === autoTx.id || (t.fixedExpenseId === id && t.fixedMonth === monthKey)
        );
        if (!exists) {
          updatedTransactions = [autoTx, ...updatedTransactions];
        }
      } else {
        // Al desmarcarlo, se retira el gasto vinculado
        updatedTransactions = updatedTransactions.filter(
          (t) => !(t.fixedExpenseId === id && t.fixedMonth === monthKey) && t.id !== ('tx-fix-' + id + '-' + monthKey)
        );
      }

      const updatedFixed = (prev.fixedExpenses || []).map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          paidMonths: isPaid
            ? paidMonths.filter((m) => m !== monthKey)
            : [...paidMonths, monthKey],
        };
      });

      return {
        ...prev,
        transactions: updatedTransactions,
        fixedExpenses: updatedFixed,
      };
    });
  };

  const deleteFixedExpense = (id) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: (prev.fixedExpenses || []).filter((e) => e.id !== id),
    }));
  };

  // Savings goals
  const addSavingsGoal = ({ title, targetAmount, currentAmount = 0, icon = 'Gamepad2', color = '#8b5cf6' }) => {
    const newGoal = {
      id: 'goal-' + Date.now(),
      title: title.trim(),
      targetAmount: parseFloat(targetAmount) || 100,
      currentAmount: parseFloat(currentAmount) || 0,
      icon,
      color,
      history: currentAmount > 0 ? [
        {
          id: 'h-' + Date.now(),
          amount: parseFloat(currentAmount),
          date: new Date().toISOString(),
          note: 'Aporte inicial'
        }
      ] : [],
    };
    setData((prev) => ({
      ...prev,
      savingsGoals: [...(prev.savingsGoals || []), newGoal],
    }));
  };

  const depositToGoal = (goalId, amount, note = 'Aportación') => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) return;

    setData((prev) => ({
      ...prev,
      savingsGoals: (prev.savingsGoals || []).map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          currentAmount: Math.round((g.currentAmount + numAmount) * 100) / 100,
          history: [
            {
              id: 'h-' + Date.now(),
              amount: numAmount,
              date: new Date().toISOString(),
              note: note || 'Aportación',
            },
            ...(g.history || []),
          ],
        };
      }),
    }));
  };

  const withdrawFromGoal = (goalId, amount, note = 'Retiro') => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) return;

    setData((prev) => ({
      ...prev,
      savingsGoals: (prev.savingsGoals || []).map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          currentAmount: Math.max(0, Math.round((g.currentAmount - numAmount) * 100) / 100),
          history: [
            {
              id: 'h-' + Date.now(),
              amount: -numAmount,
              date: new Date().toISOString(),
              note: note || 'Retirada',
            },
            ...(g.history || []),
          ],
        };
      }),
    }));
  };

  const deleteSavingsGoal = (goalId) => {
    setData((prev) => ({
      ...prev,
      savingsGoals: (prev.savingsGoals || []).filter((g) => g.id !== goalId),
    }));
  };

  // Debts management
  const addDebt = ({ type = 'they_owe_me', person, amount, concept }) => {
    if (!person || !person.trim() || !amount) return null;
    const newDebt = {
      id: 'debt-' + Date.now(),
      type, // 'they_owe_me' (Me deben) | 'i_owe' (Debo)
      person: person.trim(),
      amount: parseFloat(amount) || 0,
      concept: (concept || '').trim(),
      settled: false,
      date: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      debts: [newDebt, ...(prev.debts || [])],
    }));
    return newDebt;
  };

  const toggleDebtSettled = (id) => {
    setData((prev) => ({
      ...prev,
      debts: (prev.debts || []).map((d) =>
        d.id === id ? { ...d, settled: !d.settled } : d
      ),
    }));
  };

  const deleteDebt = (id) => {
    setData((prev) => ({
      ...prev,
      debts: (prev.debts || []).filter((d) => d.id !== id),
    }));
  };

  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const resetToDefaults = () => {
    const fresh = getInitialData();
    setData(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  const importData = (importedData) => {
    if (!importedData) throw new Error('Archivo no válido.');
    setData(importedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData));
  };

  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  // Calculations
  const calculations = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const getStartOfWeek = () => {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const startOfWeek = getStartOfWeek();

    const transactions = data.transactions || [];

    const rangeTransactions = transactions.filter((t) => {
      if (!t.date) return false;
      const tDate = new Date(t.date);

      if (timeRange === 'day') return t.date.startsWith(todayStr);
      if (timeRange === 'week') return tDate >= startOfWeek && tDate <= now;
      if (timeRange === 'month') return t.date.startsWith(selectedMonth);
      return true; // 'all'
    });

    let totalIn = 0;
    let totalOut = 0;

    rangeTransactions.forEach((t) => {
      const val = parseFloat(t.amount) || 0;
      if (t.type === 'income') totalIn += val;
      else totalOut += val;
    });

    totalIn = Math.round(totalIn * 100) / 100;
    totalOut = Math.round(totalOut * 100) / 100;
    const balance = Math.round((totalIn - totalOut) * 100) / 100;

    // Monthly cap 200€ calculation
    const monthTransactions = transactions.filter(
      (t) => t.date && t.date.startsWith(selectedMonth)
    );

    let hormigaSpent = 0;
    monthTransactions.forEach((t) => {
      if (t.type === 'expense') {
        hormigaSpent += parseFloat(t.amount) || 0;
      }
    });
    hormigaSpent = Math.round(hormigaSpent * 100) / 100;

    const cap = parseFloat(data.settings?.monthlyCapHormiga) || 200;
    const hormigaRemaining = Math.round((cap - hormigaSpent) * 100) / 100;
    const hormigaPercent = Math.min(200, Math.round((hormigaSpent / cap) * 100));

    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const currentDay = (now.getFullYear() === year && now.getMonth() + 1 === month)
      ? now.getDate()
      : 1;
    const daysLeft = Math.max(1, totalDaysInMonth - currentDay + 1);
    const dailyAllowance = hormigaRemaining > 0 ? (hormigaRemaining / daysLeft).toFixed(2) : 0;

    let semaforo = 'safe';
    if (hormigaSpent >= cap) {
      semaforo = 'exceeded';
    } else if (hormigaPercent >= (data.settings?.alertThresholdRed || 85)) {
      semaforo = 'danger';
    } else if (hormigaPercent >= (data.settings?.alertThresholdYellow || 65)) {
      semaforo = 'warning';
    }

    let totalFixedExpected = 0;
    let totalFixedPaid = 0;
    (data.fixedExpenses || []).forEach((item) => {
      if (item.active !== false) {
        const amt = parseFloat(item.amount) || 0;
        totalFixedExpected += amt;
        if ((item.paidMonths || []).includes(selectedMonth)) {
          totalFixedPaid += amt;
        }
      }
    });

    const totalSavings = (data.savingsGoals || []).reduce(
      (sum, g) => sum + (parseFloat(g.currentAmount) || 0),
      0
    );

    // Debts totals
    let totalTheyOweMe = 0;
    let totalIOwe = 0;
    (data.debts || []).forEach((d) => {
      if (!d.settled) {
        if (d.type === 'they_owe_me') {
          totalTheyOweMe += parseFloat(d.amount) || 0;
        } else {
          totalIOwe += parseFloat(d.amount) || 0;
        }
      }
    });
    totalTheyOweMe = Math.round(totalTheyOweMe * 100) / 100;
    totalIOwe = Math.round(totalIOwe * 100) / 100;
    const netDebts = Math.round((totalTheyOweMe - totalIOwe) * 100) / 100;

    return {
      rangeTransactions,
      monthTransactions,
      totalIn,
      totalOut,
      balance,
      hormigaSpent,
      hormigaCap: cap,
      hormigaRemaining,
      hormigaPercent,
      semaforo,
      daysLeft,
      dailyAllowance,
      totalFixedExpected,
      totalFixedPaid,
      totalFixedPending: Math.round((totalFixedExpected - totalFixedPaid) * 100) / 100,
      totalSavings,
      totalTheyOweMe,
      totalIOwe,
      netDebts,
    };
  }, [data, selectedMonth, timeRange]);

  // Estado y funciones del modal de confirmación moderno (sustituye a window.confirm)
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    isDanger: true,
    onConfirm: null,
  });

  const requestConfirm = ({
    title = '¿Eliminar elemento?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Eliminar',
    cancelText = 'Cancelar',
    isDanger = true,
    onConfirm,
  }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      isDanger,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  // Estado y funciones del toast de notificación moderno (sustituye a window.alert)
  const [toastState, setToastState] = useState({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    setToastState({ isOpen: true, message, type });
  };

  const closeToast = () => {
    setToastState((prev) => ({ ...prev, isOpen: false }));
  };

  const value = {
    data,
    settings: data.settings || {},
    transactions: data.transactions || [],
    fixedExpenses: data.fixedExpenses || [],
    savingsGoals: data.savingsGoals || [],
    debts: data.debts || [],
    expenseCategories,
    incomeCategories,
    addCustomCategory,
    deleteCustomCategory,
    selectedMonth,
    setSelectedMonth,
    timeRange,
    setTimeRange,
    calculations,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addFixedExpense,
    toggleFixedPaid,
    deleteFixedExpense,
    addSavingsGoal,
    depositToGoal,
    withdrawFromGoal,
    deleteSavingsGoal,
    addDebt,
    toggleDebtSettled,
    deleteDebt,
    updateSettings,
    resetToDefaults,
    importData,
    exportData,
    confirmState,
    requestConfirm,
    closeConfirm,
    toastState,
    showToast,
    closeToast,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
