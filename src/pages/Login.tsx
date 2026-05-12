import React, { useState, useEffect } from 'react';
import { Landmark, Mail, Lock, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email, password) => Promise<{ error: any }>;
  onRegister: (email, password) => Promise<{ error: any }>;
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await onLogin(email, password)
        : await onRegister(email, password);

      if (authError) {
        setError(authError.message);
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F7FF] dark:bg-[#0F172A] flex items-center justify-center p-4 font-sans relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white dark:bg-[#1E293B] rounded-[20px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative"
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#0F172A] transition-colors text-[#64748B] dark:text-[#94A3B8]"
            title="Alternar Modo Escuro"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* TOPO DO CARD */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/30 mb-4">
            <Landmark size={24} className="text-white" />
          </div>
          <h1 className="text-[22px] font-bold text-[#0F172A] dark:text-white mb-1">Finanças Pro</h1>
          <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8]">Gerencie suas finanças com facilidade</p>
        </div>

        {/* ABAS */}
        <div className="flex gap-2 p-1 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-xl mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${
              isLogin ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            } rounded-lg`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${
              !isLogin ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            } rounded-lg`}
          >
            Criar Conta
          </button>
        </div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FEF2F2] dark:bg-rose-950/40 border border-[#FECACA] dark:border-rose-900/50 rounded-lg p-3 flex items-start gap-3 mb-6"
          >
            <AlertCircle size={18} className="text-[#EF4444] mt-0.5" />
            <p className="text-[13px] text-[#DC2626] font-medium leading-tight">{error}</p>
          </motion.div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#374151] dark:text-[#CBD5E1]">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#9CA3AF] group-focus-within:text-[#2563EB] transition-colors" />
              </div>
              <input
                required
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-200 rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 outline-none placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#374151] dark:text-[#CBD5E1]">Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#9CA3AF] group-focus-within:text-[#2563EB] transition-colors" />
              </div>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-200 rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 outline-none placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 bg-[#2563EB] text-white rounded-xl font-semibold text-[15px] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-blue-900/20 mt-2 ${
              loading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Aguarde...</span>
              </>
            ) : (
              <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
            )}
          </button>
        </form>

        {!isLogin && (
          <p className="mt-8 text-center text-[12px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Ao criar uma conta, você concorda com nossos <br />
            <span className="text-[#2563EB] font-medium hover:underline cursor-pointer">Termos de Serviço</span> e <span className="text-[#2563EB] font-medium hover:underline cursor-pointer">Privacidade</span>.
          </p>
        )}
      </motion.div>
    </div>
  );
}
