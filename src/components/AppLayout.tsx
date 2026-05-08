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
  LineChart, PieChart, Activity
} from 'lucide-react';
import { Page } from '../types';
import { SupabaseProfile } from '../hooks/useProfiles';
import { motion, AnimatePresence } from 'motion/react';

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
  
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const settingsRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsSettingsOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };
  
  const [pendingRecorrentesCount, setPendingRecorrentesCount] = useState(0);

  useEffect(() => {
    if (!activeProfile?.id) return;
    
    const fetchPendingRecorrentes = async () => {
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
            // Se hoje ainda não foi lançada, tá pendente
            isPending = true;
          }
        } else if (rec.frequencia === 'semanal') {
          // Simplificando pra semana atual
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - currentDayOfWeek + 1);
          if (!lastDate || lastDate < startOfWeek) {
            if (rec.dia_vencimento <= currentDayOfWeek) {
              isPending = true;
            }
          }
        } else if (rec.frequencia === 'mensal') {
          if (!lastDate || (lastDate.getMonth() !== currentMonth || lastDate.getFullYear() !== currentYear)) {
            if (rec.dia_vencimento && currentDay >= rec.dia_vencimento) {
              isPending = true;
            }
          }
        } else if (rec.frequencia === 'anual') {
          if (!lastDate || lastDate.getFullYear() !== currentYear) {
            if (rec.mes_vencimento && rec.dia_vencimento) {
              const vencimento = new Date(currentYear, rec.mes_vencimento - 1, rec.dia_vencimento);
              const diffTime = vencimento.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays <= 30 && diffDays >= 0) { // nos próximos 30 dias ou atrasado esse ano
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

    fetchPendingRecorrentes();
  }, [activeProfile?.id, activePage]); // reload if activePage changes (e.g. they came back from recorrentes)

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  const menuItems = [
    ...(activeProfile?.enable_sistema_financeiro !== false ? [
      ...(activeProfile?.financeiro_show_dashboard !== false ? [{ id: 'dashboard' as Page, icon: LayoutDashboard }] : []),
      ...(activeProfile?.financeiro_show_transacoes !== false ? [{ id: 'transactions' as Page, icon: Wallet }] : []),
      ...(activeProfile?.financeiro_show_cartoes !== false ? [{ id: 'cartoes' as Page, icon: CreditCard }] : []),
      ...(activeProfile?.financeiro_show_transacoes_recorrentes !== false ? [{ id: 'recorrentes' as Page, icon: Repeat, badge: pendingRecorrentesCount }] : []),
      ...(activeProfile?.financeiro_show_relatorios !== false ? [{ id: 'relatorios' as Page, icon: BarChart2 }] : []),
      ...(activeProfile?.financeiro_show_categorias !== false ? [{ id: 'categories' as Page, icon: Tag }] : []),
    ] : []),
    ...(activeProfile?.investimentos_ativo === true ? [
      ...(activeProfile?.investimentos_show_dashboard !== false ? [{ id: 'investimentos' as Page, icon: PieChart }] : []),
      ...(activeProfile?.investimentos_show_ativos !== false ? [{ id: 'investimentos_ativos' as Page, icon: Activity }] : []),
      ...(activeProfile?.investimentos_show_operacoes !== false ? [{ id: 'investimentos_cofres' as Page, icon: Shield }] : [])
    ] : []),
    ...(activeProfile?.game_ativo === true ? [
      { id: 'game' as Page, icon: Gamepad2, title: 'Game' },
      ...(selectedGame === 'cr' ? [
        { id: 'cr_profile' as Page, icon: Crown, title: 'Perfil CR' },
        { id: 'cr_cards' as Page, icon: Book, title: 'Cartas CR' },
        { id: 'cr_badges' as Page, icon: Award, title: 'Emblemas CR' }
      ] : []),
      ...(selectedGame === 'bs' ? [
        { id: 'bs_profile' as Page, icon: Star, title: 'Perfil BS' },
        { id: 'bs_brawlers' as Page, icon: Users, title: 'Brawlers' },
      ] : []),
    ] : [])
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden font-sans">
      <header className="h-[60px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-[#2563EB]">
             <Wallet size={24} fill="currentColor" fillOpacity={0.1} />
          </div>
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">A Jornada</h1>
        </div>

        <div className="flex items-center gap-5">
          {/* SYSTEM INDICATORS */}
          {activeProfile && (
            <div className="flex items-center gap-2 pr-4 border-r border-[#E5E7EB]">
              {/* Indicador de Sistema Financeiro */}
              <button
                onClick={async () => {
                  const newValue = activeProfile.enable_sistema_financeiro === false;
                  await updateProfileModules(activeProfile.id, { enable_sistema_financeiro: newValue });
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-50`}
                title={activeProfile.enable_sistema_financeiro !== false ? "Desativar Sistema Financeiro" : "Ativar Sistema Financeiro"}
              >
                <Banknote size={18} strokeWidth={2} className={activeProfile.enable_sistema_financeiro !== false ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
              </button>

              {/* Indicador de Sistema de Investimentos */}
              <button
                onClick={async () => {
                  const newValue = !activeProfile.investimentos_ativo;
                  await updateProfileModules(activeProfile.id, { investimentos_ativo: newValue });
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-50`}
                title={activeProfile.investimentos_ativo ? "Desativar Sistema de Investimentos" : "Ativar Sistema de Investimentos"}
              >
                <TrendingUp size={18} strokeWidth={2} className={activeProfile.investimentos_ativo ? 'text-[#16A34A]' : 'text-[#94A3B8]'} />
              </button>

              {/* Indicador de Sistema Game */}
              <button
                onClick={async () => {
                  const newValue = !activeProfile.game_ativo;
                  await updateProfileModules(activeProfile.id, { game_ativo: newValue });
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-50`}
                title={activeProfile.game_ativo ? "Desativar Sistema Game" : "Ativar Sistema Game"}
              >
                <Gamepad2 size={18} strokeWidth={2} className={activeProfile.game_ativo ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'} />
              </button>
            </div>
          )}

          {/* PROFILE SELECTOR REFINED */}
          <div className="relative pr-2 border-r border-[#E5E7EB]" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: activeProfile?.cor || '#2563EB' }}
              >
                 {(() => {
                   const ActiveIcon = activeProfile?.icone ? PROFILE_ICONS[activeProfile.icone] || User : User;
                   return <ActiveIcon size={18} strokeWidth={2.5} />;
                 })()}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[13px] font-bold text-[#0F172A]">{activeProfile?.name || 'Selecione'}</span>
              </div>
              <ChevronDown size={14} className={`text-[#6B7280] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-2 z-[999]"
                >
                  <p className="px-3 py-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Alternar Perfil</p>
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
                            p.is_active ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
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
                            p.is_active ? 'text-[#2563EB]' : 'text-[#0F172A]'
                          }`}>
                            {p.name}
                          </span>
                          {p.is_active && <CheckCircle2 size={16} className="text-[#2563EB]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-[#6B7280] hover:text-[#2563EB] transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-gray-50"
            >
              <Settings size={18} />
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-[180px] bg-white rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.10)] border border-[#E2E8F0] p-[6px] z-[999]"
                >
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageChange('profiles');
                      setIsSettingsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                  >
                    <UserPlus size={15} className="text-[#2563EB]" />
                    Novo Perfil
                  </button>
                  <div className="my-[6px] border-t border-[#E2E8F0]" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <LogOut size={15} className="text-[#EF4444]" />
                    Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[64px] bg-white border-r border-[#E5E7EB] flex flex-col items-center py-4 z-30 shrink-0">
          <div className="flex-1 w-full flex flex-col items-center gap-3">
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  title={item.title || item.id}
                  className={`relative flex items-center justify-center transition-all duration-200 ease-in-out w-[40px] h-[40px] rounded-full ${
                    isActive 
                      ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-sm' 
                      : 'bg-transparent text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#4B5563]'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-[-2px] right-[-2px] w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}



