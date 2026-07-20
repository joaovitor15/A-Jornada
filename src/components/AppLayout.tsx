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
  Calendar,
  Building2, Users, UserCheck, Home, Star, Crown, Heart, Smile,
  Coffee, Rocket, Award, Target, Zap, Globe, Landmark, PiggyBank,
  DollarSign, GraduationCap, Baby, Dog, Car, Plane, Gamepad2,
  Camera, Gift, Music, Book, Repeat, Banknote, CreditCard,
  LineChart, PieChart, Activity, Menu, X, Sun, Moon, Trophy
} from 'lucide-react';
import { Page } from '../types';
import { SupabaseProfile } from '../hooks/useProfiles';
import { motion, AnimatePresence } from 'motion/react';

import JornadaLogo from './JornadaLogo';

const PROFILE_ICONS: Record<string, any> = {
  User, Building2, Home
};

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onPageChange: (page: Page) => void;
  activeProfile: SupabaseProfile | null;
  profiles: SupabaseProfile[];
  onProfileChange: (id: string) => void;
  updateProfileModules: (id: string, modules: Partial<SupabaseProfile>) => Promise<{ error: any }>;
}

export default function AppLayout({ 
  children, 
  activePage, 
  onPageChange,
  activeProfile,
  profiles,
  onProfileChange,
  updateProfileModules
}: AppLayoutProps) {
  
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const [isDarkMode, setIsDarkMode] = React.useState(false);


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

  const financeiroItems: MenuItem[] = [
    ...(activeProfile?.financeiro_show_dashboard !== false ? [{ id: 'dashboard' as Page, icon: LayoutDashboard, title: 'Dashboard' }] : []),
    ...(activeProfile?.financeiro_show_transacoes !== false ? [{ id: 'transactions' as Page, icon: Wallet, title: 'Transações' }] : []),
    ...(activeProfile?.financeiro_show_cartoes !== false ? [{ id: 'cartoes' as Page, icon: CreditCard, title: 'Cartões' }] : []),
    ...(activeProfile?.financeiro_show_transacoes_recorrentes !== false ? [{ id: 'recorrentes' as Page, icon: Calendar, title: 'Provisões' }] : []),
    ...(activeProfile?.financeiro_show_relatorios !== false ? [{ id: 'relatorios' as Page, icon: BarChart2, title: 'Relatórios' }] : []),
    ...(activeProfile?.financeiro_show_categorias !== false ? [{ id: 'categories' as Page, icon: Tag, title: 'Categorias' }] : []),
    ...(activeProfile?.investimentos_show_ativos !== false ? [{ id: 'investimentos_ativos' as Page, icon: Activity, title: 'Investimentos' }] : []),
    ...(activeProfile?.investimentos_show_operacoes !== false ? [{ id: 'investimentos_cofres' as Page, icon: Shield, title: 'Reserva' }] : [])
  ];

  const menuGroups = [
    { id: 'financeiro', title: 'MENU', items: financeiroItems }
  ].filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-[#0F172A] overflow-hidden font-sans">
      <header className="h-[60px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between px-3 md:px-6 z-50 shrink-0 relative transition-colors duration-300">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-xl text-[#2563EB] dark:text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-[#0F172A] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
          <img src="/logo-app.svg" alt="Jornada Logo" className="w-8 h-8 drop-shadow-sm" />
          <h1 className="text-base md:text-lg font-bold text-[#111827] dark:text-white tracking-tight truncate max-w-[120px] sm:max-w-none">Jornada</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-5">
          {/* PROFILE SELECTOR REFINED */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155] transition-all cursor-pointer group"
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
                <span className="text-[13px] font-bold text-[#0F172A] dark:text-white truncate max-w-[80px] sm:max-w-[150px] md:max-w-[200px]" title={activeProfile?.name || 'Selecione'}>
                  {activeProfile?.name || 'Selecione'}
                </span>
              </div>
              <ChevronDown size={14} className={`text-[#6B7280] dark:text-[#94A3B8] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0B0F19] rounded-xl shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-2 z-[999]"
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
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                            p.is_active 
                              ? 'bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm' 
                              : 'border border-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:shadow-sm'
                          }`}
                        >
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm`}
                            style={{ backgroundColor: p.cor || '#2563EB' }}
                          >
                            <ProfileIcon size={16} />
                          </div>
                          <span className={`text-[13px] font-bold truncate flex-1 text-left transition-colors ${
                            p.is_active ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:group-hover:text-white'
                          }`}>
                            {p.name}
                          </span>
                          {p.is_active && <CheckCircle2 size={16} className="text-[#2563EB] dark:text-[#3B82F6]" />}
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] border border-transparent hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="w-7 h-7 flex items-center justify-center text-[#94A3B8] group-hover:text-[#64748B] dark:text-[#64748B] dark:group-hover:text-[#94A3B8] transition-colors">
                      <Settings size={16} className="transition-transform group-hover:scale-110" />
                    </div>
                    <span className="flex-1 text-left">Configurações</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155] transition-all text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white group"
            title="Alternar Modo Escuro"
          >
            {isDarkMode ? <Sun size={20} className="group-hover:scale-110 transition-transform" /> : <Moon size={20} className="group-hover:scale-110 transition-transform" />}
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

        <aside className={`fixed inset-y-0 left-0 top-[60px] w-[200px] bg-white dark:bg-[#0B0F19] border-r border-[#E2E8F0] dark:border-[#1E293B] flex flex-col items-start py-4 z-40 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col w-full pb-8">
            {menuGroups.map(group => (
              <div key={group.id} className="mb-6 w-full px-4">
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map(item => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          setIsMobileMenuOpen(false); // Close sidebar when a page is selected
                        }}
                        title={item.title || item.id}
                        className="relative mx-auto flex flex-col items-center justify-start w-full group py-1"
                      >
                        <div className={`w-[48px] h-[48px] mb-1.5 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out border ${
                          isActive 
                            ? 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#3B82F6] shadow-sm border-[#E2E8F0] dark:border-[#1E293B] scale-105' 
                            : 'bg-transparent border-transparent text-[#64748B] dark:text-[#94A3B8] group-hover:bg-[#F1F5F9] dark:group-hover:bg-[#1E293B] group-hover:border-[#E2E8F0] dark:group-hover:border-[#334155] group-hover:text-[#0F172A] dark:group-hover:text-white group-hover:scale-105'
                        }`}>
                          <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} className="transition-transform group-hover:scale-110" />
                        </div>
                        <span className={`text-[10px] leading-tight text-center px-1 transition-colors ${
                          isActive ? 'text-[#2563EB] dark:text-[#3B82F6] font-bold' : 'text-[#64748B] dark:text-[#94A3B8] font-medium group-hover:text-[#0F172A] dark:group-hover:text-white'
                        }`}>
                          {item.title}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute top-0 right-3 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white z-10">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

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



