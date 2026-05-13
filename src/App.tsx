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
import GamePage from './pages/GamePage';
import CRProfilePage from './pages/CRProfilePage';
import CRCardsPage from './pages/CRCardsPage';
import CRBadgesPage from './pages/CRBadgesPage';
import BSProfilePage from './pages/BSProfilePage';
import BSBrawlersPage from './pages/BSBrawlersPage';

export default function App() {
  const { user, loading: authLoading, login, cadastrar, logout } = useAuth();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activePage, setActivePage] = useState<Page>(() => {
    return (localStorage.getItem('activePage') as Page) || 'dashboard';
  });
  const [selectedGame, setSelectedGame] = useState<'cr' | 'bs' | null>(() => {
    return (localStorage.getItem('selected_game') as 'cr' | 'bs' | null) || null;
  });

  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  useEffect(() => {
    if (selectedGame) {
      localStorage.setItem('selected_game', selectedGame);
    } else {
      localStorage.removeItem('selected_game');
    }
  }, [selectedGame]);
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

    const finPages: Page[] = ['dashboard', 'transactions', 'categories', 'recorrentes', 'relatorios', 'cartoes'];
    const invPages: Page[] = ['investimentos', 'investimentos_ativos', 'investimentos_cofres'];
    const gamePages: Page[] = ['game', 'cr_profile', 'cr_cards', 'cr_badges', 'bs_profile'];

    const finActive = activeProfile.enable_sistema_financeiro !== false;
    const invActive = activeProfile.investimentos_ativo === true;
    const gameActive = activeProfile.game_ativo === true;

    if (finPages.includes(activePage)) {
      if (!finActive) {
        if (invActive) setActivePage('investimentos');
        else if (gameActive) setActivePage('game');
      }
    } else if (invPages.includes(activePage)) {
      if (!invActive) {
        if (finActive) setActivePage('dashboard');
        else if (gameActive) setActivePage('game');
      }
    } else if (gamePages.includes(activePage)) {
      if (!gameActive) {
        if (finActive) setActivePage('dashboard');
        else if (invActive) setActivePage('investimentos');
      }
    }
  }, [activeProfile?.enable_sistema_financeiro, activeProfile?.investimentos_ativo, activeProfile?.game_ativo, activeProfile?.id, activePage]);

  if (!hasLoaded && (authLoading || profilesLoading)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-colors">
        <Loader2 size={40} className="text-[#2563EB] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">A Jornada</h2>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium text-sm">Carregando perfil e configurações...</p>
      </div>
    );
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
    const crPages = ['cr_profile', 'cr_cards', 'cr_badges'];
    const bsPages = ['bs_profile', 'bs_brawlers'];
    
    if (page === 'game') {
      setSelectedGame(null);
      localStorage.removeItem('selected_game');
    } else if (!crPages.includes(page) && !bsPages.includes(page)) {
      setSelectedGame(null);
      localStorage.removeItem('selected_game');
    }
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
    const finActive = activeProfile?.enable_sistema_financeiro !== false;

    switch (activePage) {
      case 'dashboard':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_dashboard !== false, 
          'Sistema Financeiro', 
          'Dashboard', 
          <Dashboard activeProfileName={activeProfile?.name || 'Usuário'} activeProfileId={activeProfile?.id} />
        );
      case 'transactions':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_transacoes !== false, 
          'Sistema Financeiro', 
          'Transações', 
          <TransactionsPage activeProfileId={activeProfile?.id} />
        );
      case 'profiles':
        return <ProfilesPage {...profilesHook} />;
      case 'categories':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_categorias !== false, 
          'Sistema Financeiro', 
          'Categorias', 
          <Categories activeProfile={activeProfile} />
        );
      case 'recorrentes':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_transacoes_recorrentes !== false, 
          'Sistema Financeiro', 
          'Despesas Recorrentes', 
          <RecorrentesPage activeProfileId={activeProfile?.id} />
        );
      case 'relatorios':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_relatorios !== false, 
          'Sistema Financeiro', 
          'Relatórios', 
          <RelatoriosPage activeProfileId={activeProfile?.id} />
        );
      case 'cartoes':
        return renderContentWithGuard(
          finActive, 
          activeProfile?.financeiro_show_cartoes !== false, 
          'Sistema Financeiro', 
          'Cartões', 
          <CardsPage activeProfileId={activeProfile?.id} />
        );
      case 'investimentos':
        return renderContentWithGuard(
          activeProfile?.investimentos_ativo === true,
          true,
          'Sistema de Investimentos',
          'Investimentos',
          <InvestimentosDashboard activeProfileId={activeProfile?.id} activeProfile={activeProfile} updateProfileModules={profilesHook.updateProfileModules} />
        );
      case 'investimentos_ativos':
        return renderContentWithGuard(
          activeProfile?.investimentos_ativo === true,
          activeProfile?.investimentos_show_ativos !== false,
          'Sistema de Investimentos',
          'Meus Ativos',
          <InvestimentosAtivos activeProfileId={activeProfile?.id} />
        );
      case 'investimentos_cofres':
        return renderContentWithGuard(
          activeProfile?.investimentos_ativo === true,
          activeProfile?.investimentos_show_operacoes !== false,
          'Sistema de Investimentos',
          'Cofres & Provisões',
          <InvestimentosCofres activeProfileId={activeProfile?.id} />
        );
      case 'game':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Módulo Game',
          <GamePage 
            activeProfileId={activeProfile?.id} 
            activeProfile={activeProfile}
            onPageChange={setActivePage}
            onSelectGame={setSelectedGame}
          />
        );
      case 'cr_profile':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Perfil Clash Royale',
          <CRProfilePage activeProfileId={activeProfile?.id} />
        );
      case 'cr_cards':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Cartas Clash Royale',
          <CRCardsPage activeProfileId={activeProfile?.id} />
        );
      case 'cr_badges':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Emblemas Clash Royale',
          <CRBadgesPage activeProfileId={activeProfile?.id} />
        );
      case 'bs_profile':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Perfil Brawl Stars',
          <BSProfilePage activeProfileId={activeProfile?.id} />
        );
      case 'bs_brawlers':
        return renderContentWithGuard(
          activeProfile?.game_ativo === true,
          true,
          'Sistema Game',
          'Brawlers',
          <BSBrawlersPage activeProfileId={activeProfile?.id} />
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
      selectedGame={selectedGame}
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
