import React, { useState, useEffect } from 'react';
import { Landmark, Mail, Lock, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email, password) => Promise<{ error: any }>;
  onRegister: (email, password) => Promise<{ error: any }>;
  onLoginWithGoogle?: () => Promise<{ error: any }>;
}

export default function Login({ onLogin, onRegister, onLoginWithGoogle }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleGoogleLogin = async () => {
    if (!onLoginWithGoogle) return;
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await onLoginWithGoogle();
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao conectar com o Google.');
      setLoading(false);
    }
  };

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
          <div className="w-16 h-16 bg-[#2563EB]/5 dark:bg-[#2563EB]/10 border border-[#2563EB]/10 rounded-2xl flex items-center justify-center mb-4 p-3 shadow-sm">
            <img src="/logo-app.svg" alt="Jornada" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-[22px] font-bold text-[#0F172A] dark:text-white mb-1">Jornada</h1>
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

          {onLoginWithGoogle && (
            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex justify-center items-center">
                <span className="w-full border-t border-[#E2E8F0] dark:border-[#334155]"></span>
                <span className="px-3 text-xs text-[#94A3B8] uppercase bg-white dark:bg-[#1E293B]">ou</span>
                <span className="w-full border-t border-[#E2E8F0] dark:border-[#334155]"></span>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#374151] dark:text-[#CBD5E1] rounded-xl font-medium text-[15px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continuar com Google</span>
              </button>
            </div>
          )}
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
