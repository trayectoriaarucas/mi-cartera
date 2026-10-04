import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { HormigaGauge } from './components/HormigaGauge';
import { SummaryCards } from './components/SummaryCards';
import { DailyExpensesList } from './components/DailyExpensesList';
import { RecentActivityWidget } from './components/RecentActivityWidget';
import { DebtsManager } from './components/DebtsManager';
import { HuchaUnifiedPage } from './components/HuchaUnifiedPage';
import { NewTransactionPage } from './components/NewTransactionPage';
import { SettingsPage } from './components/SettingsPage';
import { BottomNav } from './components/BottomNav';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastNotification } from './components/ToastNotification';

const MainContent = () => {
  const { confirmState, closeConfirm, toastState, closeToast } = useWallet();
  const [activeTab, setActiveTab] = useState('resumen');
  const [previousTab, setPreviousTab] = useState('resumen');

  // Tipo de movimiento al entrar a la página de Añadir
  const [newTransactionType, setNewTransactionType] = useState('expense');

  const openNewTransaction = (type = 'expense') => {
    setNewTransactionType(type);
    navigateTo('nuevo');
  };

  // Integración del botón físico/gestos atrás de Android
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else {
        setActiveTab('resumen');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (tab) => {
    setPreviousTab(activeTab);
    window.history.pushState({ tab }, '');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    const target = (previousTab === 'ajustes' || previousTab === 'nuevo') ? 'resumen' : previousTab;
    setActiveTab(target);
    if (window.history.state && window.history.state.tab) {
      window.history.back();
    }
  };

  const isFullPage = activeTab === 'ajustes' || activeTab === 'nuevo';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header solo en pantallas principales */}
      {!isFullPage && (
        <Header onOpenSettings={() => navigateTo('ajustes')} />
      )}

      {/* Main View Area - Optimizado a pantalla completa para Samsung S25 Ultra */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3.5 sm:px-4 pt-3 pb-24">
        {/* PÁGINA 1: INICIO (Dashboard limpio sin duplicaciones) */}
        {activeTab === 'resumen' && (
          <div className="space-y-4 animate-fade-slide">
            {/* Medidor visual del tope mensual de 200€ */}
            <HormigaGauge onQuickAdd={() => openNewTransaction('expense')} />

            {/* Saldo que va quedando, Huchas y Deudas */}
            <SummaryCards
              onSelectTab={(tab) => {
                if (tab === 'fixed' || tab === 'fijos') navigateTo('hucha');
                if (tab === 'savings' || tab === 'metas' || tab === 'hucha') navigateTo('hucha');
                if (tab === 'deudas') navigateTo('deudas');
                if (tab === 'gastos') navigateTo('movimientos');
              }}
            />

            {/* Vista previa limpia de los últimos movimientos */}
            <RecentActivityWidget
              onSeeAll={() => navigateTo('movimientos')}
              onAdd={() => openNewTransaction('expense')}
            />
          </div>
        )}

        {/* PÁGINA 2: MOVIMIENTOS (EXTRACTO COMPLETO TIPO BANCO) */}
        {activeTab === 'movimientos' && (
          <div className="animate-fade-slide">
            <DailyExpensesList onOpenAdd={() => openNewTransaction('expense')} />
          </div>
        )}

        {/* PÁGINA 3: HUCHA (UNIFICA HUCHAS DE AHORRO Y GASTOS FIJOS) */}
        {(activeTab === 'hucha' || activeTab === 'fijos' || activeTab === 'metas') && (
          <div className="animate-fade-slide">
            <HuchaUnifiedPage initialSection={activeTab === 'fijos' ? 'fijos' : 'huchas'} />
          </div>
        )}

        {/* PÁGINA 4: DEUDAS Y PRÉSTAMOS */}
        {activeTab === 'deudas' && (
          <div className="animate-fade-slide">
            <DebtsManager />
          </div>
        )}

        {/* PÁGINA: AÑADIR MOVIMIENTO (PÁGINA COMPLETA COMO ANTES) */}
        {activeTab === 'nuevo' && (
          <NewTransactionPage
            onBack={navigateBack}
            defaultType={newTransactionType}
          />
        )}

        {/* PÁGINA: AJUSTES & EXPORTAR PDF */}
        {activeTab === 'ajustes' && (
          <SettingsPage onBack={navigateBack} />
        )}
      </main>

      {/* Barra de navegación inferior: 5 pestañas con el botón '+' en el CENTRO EXACTO */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={navigateTo}
        onOpenAdd={() => openNewTransaction('expense')}
      />

      {/* Diálogo de confirmación moderno (elimina avisos feos nativos del navegador) */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        isDanger={confirmState.isDanger}
      />

      {/* Toast de notificaciones elegante */}
      <ToastNotification
        isOpen={toastState.isOpen}
        message={toastState.message}
        type={toastState.type}
        onClose={closeToast}
      />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <MainContent />
    </WalletProvider>
  );
}
