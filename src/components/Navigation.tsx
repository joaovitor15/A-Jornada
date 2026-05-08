import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  BarChart3, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ activePage, onPageChange, isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as Page, label: 'Transações', icon: ArrowLeftRight },
    { id: 'profiles' as Page, label: 'Perfis', icon: Users },
    { id: 'reports' as Page, label: 'Relatórios', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Configurações', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="hidden md:flex flex-col bg-white border-r border-[--color-brand-light] h-screen sticky top-0 transition-all duration-300 ease-in-out z-20"
    >
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-[--color-brand-dark] text-xl truncate"
            >
              Finanças Pro
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-[--color-brand-light] rounded-full transition-colors text-[--color-brand-primary]"
          id="sidebar-toggle"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center p-3 rounded-2xl transition-all duration-200 group ${
              activePage === item.id 
                ? 'bg-[--color-brand-primary] text-white shadow-md' 
                : 'text-slate-500 hover:bg-[--color-brand-light] hover:text-[--color-brand-primary]'
            }`}
            id={`nav-${item.id}`}
          >
            <item.icon size={22} className={activePage === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>
      
      {isOpen && (
        <div className="p-6 text-xs text-slate-400 border-t border-[--color-brand-light]">
          v1.0.0 • © 2024
        </div>
      )}
    </motion.aside>
  );
};

export const BottomNav = ({ activePage, onPageChange }: { activePage: Page, onPageChange: (page: Page) => void }) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Início', icon: LayoutDashboard },
    { id: 'transactions' as Page, label: 'Transação', icon: ArrowLeftRight },
    { id: 'reports' as Page, label: 'Relatos', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[--color-brand-light] px-6 py-3 flex justify-between items-center z-30">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activePage === item.id ? 'text-[--color-brand-primary]' : 'text-slate-400'
          }`}
          id={`mobile-nav-${item.id}`}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
          {activePage === item.id && (
            <motion.div layoutId="activeTabMobile" className="w-1 h-1 rounded-full bg-[--color-brand-primary]" />
          )}
        </button>
      ))}
    </nav>
  );
};
