import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart2, 
  FileText, 
  CheckSquare, 
  Wallet, 
  Shield, 
  Tag, 
  LogOut, 
  User, 
  Briefcase, 
  ChevronDown,
  UserPlus,
  CheckCircle2,
  Settings,
  Building2, Users, UserCheck, Home, Star, Crown, Heart, Smile,
  Coffee, Rocket, Award, Target, Zap, Globe, Landmark, PiggyBank,
  DollarSign, GraduationCap, Baby, Dog, Car, Plane, Gamepad2,
  Camera, Gift, Music, Book, Repeat, Banknote, CreditCard,
  LineChart, PieChart, Activity, Menu, X, Sun, Moon, Download
} from 'lucide-react';
import { Page } from '../types';
import { SupabaseProfile } from '../hooks/useProfiles';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PROFILE_ICONS: Record<string, any> = {
  User, Building2, Users, UserCheck, Briefcase, Home, Star, Crown, Heart, Smile,
  Coffee, Rocket, Shield, Award, Target, Zap, Globe, Landmark, PiggyBank,
  Wallet, TrendingUp, BarChart2, DollarSign, GraduationCap, Baby, Dog, Car,
  Plane, Gamepad2, Camera, Gift, Music, Book
};

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onPageChange: (page: Page) => void;
  activeProfile: SupabaseProfile | null;
  profiles: SupabaseProfile[];
  onProfileChange: (id: string) => void;
  updateProfileModules: (id: string, modules: Partial<SupabaseProfile>) => Promise<{ error: any }>;
  selectedGame?: 'cr' | 'bs' | null;
}

export default function AppLayout({ 
  children, 
  activePage, 
  onPageChange,
  activeProfile,
  profiles,
  onProfileChange,
  updateProfileModules,
  selectedGame
}: AppLayoutProps) {
  
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { isInstallable, promptInstall } = usePWAInstall();

  React.useEffect(() => {
    // Check initial preference from localStorage or system
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const [pendingRecorrentesCount, setPendingRecorrentesCount] = useState(0);

  useEffect(() => {
    if (!activeProfile?.id) return;
    
    // Using onSnapshot for real-time badge updates
    const unsubscribe = supabase
      .channel('recorrentes_badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transacoes_recorrentes', filter: `profile_id=eq.${activeProfile.id}` },
        () => fetchPendingCount()
      )
      .subscribe();

    const fetchPendingCount = async () => {
      const { data, error } = await supabase
        .from('transacoes_recorrentes')
        .select('*')
        .eq('profile_id', activeProfile.id)
        .eq('ativa', true);

      if (error) {
        console.error('Error fetching recurring transactions:', error);
        return;
      }
      
      const now = new Date();
      let pendingCount = 0;

      data?.forEach(rec => {
        const lastDate = rec.ultima_lancada ? new Date(rec.ultima_lancada) : null;
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 1 = Seg, 7 = Dom

        let isPending = false;

        if (rec.frequencia === 'diaria') {
          if (!lastDate || (lastDate.getDate() !== currentDay || lastDate.getMonth() !== currentMonth || lastDate.getFullYear() !== currentYear)) {
            isPending = true;
          }
        } else if (rec.frequencia === 'semanal') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - currentDayOfWeek + 1);
          if (!lastDate || lastDate < startOfWeek) {
            if (rec.dia_vencimento <= currentDayOfWeek) {
              isPending = true;
            }
          }
        } else if (rec.frequencia === 'mensal') {
          const lastMonth = lastDate ? lastDate.getMonth() : -1;
          const lastYear = lastDate ? lastDate.getFullYear() : -1;
          
          let targetMonth = currentMonth;
          let targetYear = currentYear;
          
          const isPastEmission = rec.dia_emissao && currentDay >= rec.dia_emissao;
          
          if (isPastEmission) {
            targetMonth++;
            if (targetMonth > 11) {
              targetMonth = 0;
              targetYear++;
            }
          }

          const isPaidForTarget = lastDate && (lastYear > targetYear || (lastYear === targetYear && lastMonth >= targetMonth));
          
          if (!isPaidForTarget) {
            if (rec.dia_vencimento && currentDay >= rec.dia_vencimento) {
              isPending = true;
            } else if (isPastEmission) {
              isPending = true;
            }
          }
        } else if (rec.frequencia === 'anual') {
          if (!lastDate || lastDate.getFullYear() !== currentYear) {
            if (rec.mes_vencimento && rec.dia_vencimento) {
              const vencimento = new Date(currentYear, rec.mes_vencimento - 1, rec.dia_vencimento);
              const diffTime = vencimento.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays <= 30 && diffDays >= 0) {
                isPending = true;
              } else if (diffDays < 0) {
                 isPending = true;
              }
            }
          }
        }

        if (isPending) pendingCount++;
      });
      
      setPendingRecorrentesCount(pendingCount);
    };

    fetchPendingCount();
    
    return () => {
      unsubscribe.unsubscribe();
    };
  }, [activeProfile?.id]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  type MenuItem = {
    id: Page;
    icon: any;
    title: string;
    badge?: number;
  };

  const financeiroItems: MenuItem[] = activeProfile?.enable_sistema_financeiro !== false ? [
    ...(activeProfile?.financeiro_show_dashboard !== false ? [{ id: 'dashboard' as Page, icon: LayoutDashboard, title: 'Dashboard' }] : []),
    ...(activeProfile?.financeiro_show_transacoes !== false ? [{ id: 'transactions' as Page, icon: Wallet, title: 'Transações' }] : []),
    ...(activeProfile?.financeiro_show_cartoes !== false ? [{ id: 'cartoes' as Page, icon: CreditCard, title: 'Cartões' }] : []),
    ...(activeProfile?.financeiro_show_transacoes_recorrentes !== false ? [{ id: 'recorrentes' as Page, icon: Repeat, badge: pendingRecorrentesCount, title: 'Recorrentes' }] : []),
    ...(activeProfile?.financeiro_show_relatorios !== false ? [{ id: 'relatorios' as Page, icon: BarChart2, title: 'Relatórios' }] : []),
    ...(activeProfile?.financeiro_show_categorias !== false ? [{ id: 'categories' as Page, icon: Tag, title: 'Categorias' }] : []),
  ] : [];

  const investimentosItems: MenuItem[] = activeProfile?.investimentos_ativo === true ? [
    ...(activeProfile?.investimentos_show_dashboard !== false ? [{ id: 'investimentos' as Page, icon: PieChart, title: 'Painel' }] : []),
    ...(activeProfile?.investimentos_show_ativos !== false ? [{ id: 'investimentos_ativos' as Page, icon: Activity, title: 'Ativos' }] : []),
    ...(activeProfile?.investimentos_show_ativos !== false ? [{ id: 'investimentos_metas' as Page, icon: Target, title: 'Metas' }] : []),
    ...(activeProfile?.investimentos_show_operacoes !== false ? [{ id: 'investimentos_cofres' as Page, icon: Shield, title: 'Reserva' }] : [])
  ] : [];

  const gameItems: MenuItem[] = activeProfile?.game_ativo === true ? [
    { id: 'game' as Page, icon: Gamepad2, title: 'Jogos' },
    ...((selectedGame === 'cr' && activeProfile?.game_show_clash_royale !== false) ? [
      { id: 'cr_profile' as Page, icon: Crown, title: 'Dados' },
      { id: 'cr_cards' as Page, icon: Book, title: 'Cartas' },
      { id: 'cr_badges' as Page, icon: Award, title: 'Emblemas' }
    ] : []),
    ...((selectedGame === 'bs' && activeProfile?.game_show_brawl_stars !== false) ? [
      { id: 'bs_profile' as Page, icon: Star, title: 'Dados' },
      { id: 'bs_brawlers' as Page, icon: Users, title: 'Brawlers' },
    ] : []),
  ] : [];

  const menuGroups = [
    { id: 'financeiro', title: 'FINANCEIRO', items: financeiroItems },
    { id: 'investimentos', title: 'Investimentos', items: investimentosItems },
    { id: 'game', title: 'Game', items: gameItems },
  ].filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col h-screen bg-[#F4F7FB] dark:bg-[#1A1C1E] overflow-hidden font-sans">
      <header className="h-[64px] bg-white dark:bg-[#1C1B1F] border-b border-[#E2E8F0] dark:border-[#43474E] flex items-center justify-between px-4 md:px-6 z-50 shrink-0 relative transition-all duration-300">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-[#43474E] dark:text-[#C4C6CF] hover:bg-[#F1F5F9] dark:hover:bg-[#43474E] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo-app.svg" alt="Jornada Logo" className="w-8 h-8" />
            <h1 className="text-xl font-medium text-[#1A1C1E] dark:text-[#E2E2E6] tracking-tight">Jornada</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PROFILE SELECTOR REFINED */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#43474E] transition-all cursor-pointer group"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: activeProfile?.cor || '#0061A4' }}
              >
                 {(() => {
                   const ActiveIcon = activeProfile?.icone ? PROFILE_ICONS[activeProfile.icone] || User : User;
                   return <ActiveIcon size={18} strokeWidth={2} />;
                 })()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-[#1A1C1E] dark:text-[#E2E2E6]">{activeProfile?.name || 'Perfil'}</span>
              <ChevronDown size={14} className={`text-[#43474E] dark:text-[#C4C6CF] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-[999]"
                >
                  <p className="px-3 py-2 text-[10px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-widest">Alternar Perfil</p>
                  <div className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar">
                    {profiles.map(p => {
                      const ProfileIcon = p.icone ? PROFILE_ICONS[p.icone] || User : User;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onProfileChange(p.id);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            p.is_active ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]' : 'hover:bg-[#F8FAFC] dark:hover:bg-[#334155]'
                          }`}
                        >
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center`}
                            style={{ 
                              backgroundColor: p.is_active ? 'white' : (p.cor || '#2563EB'),
                              color: p.is_active ? (p.cor || '#2563EB') : 'white'
                            }}
                          >
                            <ProfileIcon size={16} />
                          </div>
                          <span className={`text-[13px] font-medium truncate flex-1 text-left ${
                            p.is_active ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#0F172A] dark:text-[#E2E8F0]'
                          }`}>
                            {p.name}
                          </span>
                          {p.is_active && <CheckCircle2 size={16} className="text-[#2563EB] dark:text-[#60A5FA]" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="my-1 border-t border-[#E2E8F0] dark:border-[#334155]" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageChange('profiles');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                  >
                    <Settings size={15} />
                    Configurações
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Alternar Modo Escuro"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-30" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}

        <aside className={`fixed inset-y-0 left-0 top-[64px] w-[260px] bg-[#FDFCFF] dark:bg-[#1A1C1E] border-r border-[#E2E8F0] dark:border-[#43474E] flex flex-col items-start py-6 z-40 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col w-full pb-8">
            {/* SYSTEM INDICATORS (SIDEBAR) */}
            {activeProfile && (
              <div className="flex items-center justify-center gap-4 w-full px-6 mb-6 pb-6 border-b border-[#E2E2E6] dark:border-[#43474E] shrink-0">
                <button
                  onClick={async () => {
                    const newValue = activeProfile.enable_sistema_financeiro === false;
                    await updateProfileModules(activeProfile.id, { enable_sistema_financeiro: newValue });
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${activeProfile.enable_sistema_financeiro !== false ? 'bg-[#D1E4FF] dark:bg-[#00497D] shadow-sm' : 'bg-[#F1F5F9] dark:bg-[#2D2F31]'}`}
                  title="Financeiro"
                >
                  <Banknote size={24} className={activeProfile.enable_sistema_financeiro !== false ? 'text-[#001D36] dark:text-[#D1E4FF]' : 'text-[#43474E] dark:text-[#C4C6CF]'} />
                </button>

                <button
                  onClick={async () => {
                    const newValue = !activeProfile.investimentos_ativo;
                    await updateProfileModules(activeProfile.id, { investimentos_ativo: newValue });
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${activeProfile.investimentos_ativo ? 'bg-[#D1E4FF] dark:bg-[#00497D] shadow-sm' : 'bg-[#F1F5F9] dark:bg-[#2D2F31]'}`}
                  title="Investimentos"
                >
                  <TrendingUp size={24} className={activeProfile.investimentos_ativo ? 'text-[#001D36] dark:text-[#D1E4FF]' : 'text-[#43474E] dark:text-[#C4C6CF]'} />
                </button>

                <button
                  onClick={async () => {
                    const newValue = !activeProfile.game_ativo;
                    await updateProfileModules(activeProfile.id, { game_ativo: newValue });
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${activeProfile.game_ativo ? 'bg-[#D1E4FF] dark:bg-[#00497D] shadow-sm' : 'bg-[#F1F5F9] dark:bg-[#2D2F31]'}`}
                  title="Game"
                >
                  <Gamepad2 size={24} className={activeProfile.game_ativo ? 'text-[#001D36] dark:text-[#D1E4FF]' : 'text-[#43474E] dark:text-[#C4C6CF]'} />
                </button>
              </div>
            )}

            {menuGroups.map(group => (
              <div key={group.id} className="mb-6 w-full">
                <h3 className="px-6 py-2 text-xs font-medium text-[#43474E] dark:text-[#C4C6CF] uppercase tracking-wider mb-1">
                  {group.title}
                </h3>
                <div className="flex flex-col gap-1 px-4">
                  {group.items.map(item => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group relative ${
                          isActive 
                            ? 'bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF] font-medium' 
                            : 'text-[#43474E] dark:text-[#C4C6CF] hover:bg-[#F1F5F9] dark:hover:bg-[#2D2F31]'
                        }`}
                      >
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm">{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute right-4 w-5 h-5 bg-[#B3261E] dark:bg-[#F2B8B5] text-white dark:text-[#601410] text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <AnimatePresence>
              {isInstallable && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 w-full px-4 mb-2"
                >
                  <button
                    onClick={promptInstall}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-2.5 px-3 rounded-xl font-bold hover:bg-[#1D4ED8] transition-colors shadow-sm"
                  >
                    <Download size={18} />
                    <span className="text-[13px]">Instalar App</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}



