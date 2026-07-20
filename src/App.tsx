/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { TransactionsPage } from './components/TransactionsPage';
import ProfilesPage from './components/ProfilesPage';
import Categories from './pages/Categories';
import Login from './pages/Login';
import { Page } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { useProfiles } from './hooks/useProfiles';
import { useAuth } from './hooks/useAuth';
import { Loader2, ShieldAlert, EyeOff, Wrench } from 'lucide-react';

import { RecorrentesPage } from './components/RecorrentesPage';
import { RelatoriosPage } from './components/RelatoriosPage';
import { CardsPage } from './pages/Cards';
import { InvestimentosDashboard } from './pages/InvestimentosDashboard';
import { InvestimentosAtivos } from './pages/InvestimentosAtivos';
import { InvestimentosCofres } from './pages/InvestimentosCofres';

export default function App() {
  const { user, loading: authLoading, login, cadastrar, logout } = useAuth();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activePage, setActivePage] = useState<Page>(() => {
    return (localStorage.getItem('activePage') as Page) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  const profilesHook = useProfiles();
  const { profiles, setProfileActive, loading: profilesLoading } = profilesHook;

  useEffect(() => {
    if (!authLoading && !profilesLoading && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [authLoading, profilesLoading, hasLoaded]);
  
  const activeProfile = profiles.find(p => p.is_active) || profiles[0] || null;

  useEffect(() => {
    if (!profilesLoading && profiles.length === 0 && activePage !== 'profiles') {
      setActivePage('profiles');
      return;
    }
    
    if (!activeProfile) return;
    
    // We don't need to force redirect away from pages anymore since we removed the "enable_sistema_*" concept.
    // The user will just see whatever pages they have enabled in their sidebar.
  }, [activeProfile?.id, activePage]);

  if (authLoading && !user && !hasLoaded) {
    return null;
  }

  if (!user) {
    return <Login onLogin={login} onRegister={cadastrar} />;
  }

  const handleProfileChange = async (id: string) => {
    await setProfileActive(id);
    localStorage.setItem('activeProfileId', id);
  };

  const handlePageChange = (page: Page) => {
    setActivePage(page);
  };

  const renderContentWithGuard = (
    isModuleActive: boolean,
    isFeatureActive: boolean,
    moduleName: string,
    featureName: string,
    content: React.ReactNode
  ) => {
    if (!isModuleActive) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">Módulo Desativado</h3>
          <p className="text-[#64748B] dark:text-gray-400 max-w-sm">O {moduleName} está desativado para este perfil. Ative-o na barra lateral para acessar.</p>
        </div>
      );
    }
    if (!isFeatureActive) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center mb-4">
            <EyeOff size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">Página Oculta</h3>
          <p className="text-[#64748B] dark:text-gray-400 max-w-sm">A tela de <strong>{featureName}</strong> foi ocultada nas configurações do seu perfil.</p>
        </div>
      );
    }
    return content;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_dashboard !== false, 
          'Módulos', 
          'Dashboard', 
          <Dashboard activeProfileName={activeProfile?.name || 'Usuário'} activeProfileId={activeProfile?.id} activeProfileType={activeProfile?.tipo} setActivePage={setActivePage} />
        );
      case 'transactions':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_transacoes !== false, 
          'Módulos', 
          'Transações', 
          <TransactionsPage activeProfileId={activeProfile?.id} />
        );
      case 'profiles':
        return <ProfilesPage {...profilesHook} />;
      case 'categories':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_categorias !== false, 
          'Módulos', 
          'Categorias', 
          <Categories activeProfile={activeProfile} />
        );
      case 'recorrentes':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_transacoes_recorrentes !== false, 
          'Módulos', 
          'Provisões & Recorrências', 
          <RecorrentesPage activeProfileId={activeProfile?.id} />
        );
      case 'relatorios':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_relatorios !== false, 
          'Módulos', 
          'Relatórios', 
          <RelatoriosPage activeProfileId={activeProfile?.id} />
        );
      case 'cartoes':
        return renderContentWithGuard(
          true, 
          activeProfile?.financeiro_show_cartoes !== false, 
          'Módulos', 
          'Cartões', 
          <CardsPage activeProfileId={activeProfile?.id} />
        );
      case 'investimentos':
        return renderContentWithGuard(
          true,
          true,
          'Módulos',
          'Investimentos',
          <InvestimentosDashboard activeProfileId={activeProfile?.id} activeProfile={activeProfile} updateProfileModules={profilesHook.updateProfileModules} />
        );
      case 'investimentos_ativos':
        return renderContentWithGuard(
          true,
          activeProfile?.investimentos_show_ativos !== false,
          'Módulos',
          'Meus Ativos',
          <InvestimentosAtivos activeProfileId={activeProfile?.id} activeProfile={activeProfile} updateProfileModules={profilesHook.updateProfileModules} />
        );
      case 'investimentos_cofres':
        return renderContentWithGuard(
          true,
          activeProfile?.investimentos_show_operacoes !== false,
          'Módulos',
          'Reservas',
          <InvestimentosCofres activeProfileId={activeProfile?.id} />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <Wrench size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Página em Construção</h3>
            <p className="text-[#64748B] max-w-sm">Esta funcionalidade está sendo desenvolvida e logo estará disponível para você.</p>
          </div>
        );
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      onPageChange={handlePageChange}
      activeProfile={activeProfile}
      profiles={profiles}
      onProfileChange={handleProfileChange}
      updateProfileModules={profilesHook.updateProfileModules}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage + (activeProfile?.id || 'none')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transitionEnd: {
              transform: 'none',
              filter: 'none'
            }
          }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
