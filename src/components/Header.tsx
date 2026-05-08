import { Bell, ChevronDown, User } from 'lucide-react';
import { Profile } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeProfile: Profile;
  profiles: Profile[];
  onProfileChange: (profile: Profile) => void;
}

export const Header = ({ activeProfile, profiles, onProfileChange }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 md:h-20 bg-white border-b border-[--color-brand-light] flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-bold text-slate-800">Financeiro</h1>
        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">Painel de Controle</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-[--color-brand-primary] transition-colors relative" id="notif-btn">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-[--color-brand-light] mx-1"></div>

        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 md:gap-3 p-1 pr-2 rounded-full hover:bg-[--color-brand-light] transition-all"
            id="profile-switcher"
          >
            <div 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ backgroundColor: activeProfile.color }}
            >
              {activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-slate-700">{activeProfile.name}</span>
              <span className="text-[10px] text-slate-400">Ativo agora</span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[--color-brand-light] p-2 z-30"
                >
                  <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Trocar Perfil</p>
                  <div className="space-y-1">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          onProfileChange(profile);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors ${
                          activeProfile.id === profile.id ? 'bg-[--color-brand-light]' : 'hover:bg-slate-50'
                        }`}
                        id={`switch-to-${profile.id}`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: profile.color }}
                        >
                          {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{profile.name}</span>
                        {activeProfile.id === profile.id && (
                          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[--color-brand-light]">
                    <button className="w-full flex items-center gap-3 p-2 rounded-xl text-slate-500 hover:text-[--color-brand-primary] transition-colors text-sm font-medium">
                      <User size={16} />
                      Gerenciar Perfis
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
