import React, { useState, useEffect } from 'react';
import { Settings, X, Calendar, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';

export const ConfiguracaoMetasInline = ({ activeProfileId }: { activeProfileId?: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [aporteBaseAuto, setAporteBaseAuto] = useState<number>(0);
  const [stepAuto, setStepAuto] = useState<number>(25000);
  const [metaGlobal, setMetaGlobal] = useState<number>(1000000);

  const [digitosAporte, setDigitosAporte] = useState('0');
  const [digitosStep, setDigitosStep] = useState('0');
  const [digitosMetaGlobal, setDigitosMetaGlobal] = useState('0');

  useEffect(() => {
    async function loadData() {
      if (!activeProfileId) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('aporte_mensal_meta, step_meta, meta_global_valor')
        .eq('id', activeProfileId)
        .single();
        
      if (profile) {
        const aporte = profile.aporte_mensal_meta || 0;
        const step = profile.step_meta || 25000;
        const meta = profile.meta_global_valor || 1000000;
        setAporteBaseAuto(aporte);
        setStepAuto(step);
        setMetaGlobal(meta);
        setDigitosAporte(String(Math.round(aporte * 100)));
        setDigitosStep(String(Math.round(step * 100)));
        setDigitosMetaGlobal(String(Math.round(meta * 100)));
      }
    }
    loadData();
  }, [activeProfileId]);

  const handleDigitosKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setFunction: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setFunction(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setFunction(prev => prev === '0' ? e.key : prev + e.key);
    }
  };

  const formatcurrency = (digitosStr: string) => {
    const num = Number(digitosStr) / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAporte = Number(digitosAporte) / 100;
    const parsedStep = Number(digitosStep) / 100;
    const parsedMetaGlobal = Number(digitosMetaGlobal) / 100;
    
    const finalStep = parsedStep > 0 ? parsedStep : 25000;
    const finalMetaGlobal = parsedMetaGlobal > 0 ? parsedMetaGlobal : 1000000;
    
    setAporteBaseAuto(parsedAporte);
    setStepAuto(finalStep);
    setMetaGlobal(finalMetaGlobal);

    if (activeProfileId) {
      await supabase
        .from('profiles')
        .update({
          aporte_mensal_meta: parsedAporte,
          step_meta: finalStep,
          meta_global_valor: finalMetaGlobal
        })
        .eq('id', activeProfileId);
    }

    localStorage.setItem('@App:aporteBaseAuto', String(parsedAporte));
    localStorage.setItem('@App:stepAuto', String(finalStep));
    localStorage.setItem('@App:metaGlobal', String(finalMetaGlobal));
    
    setIsOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm dark:shadow-lg p-[20px] md:p-6 lg:p-8 overflow-hidden flex flex-col relative group">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-[0.10] group-hover:opacity-[0.15] dark:opacity-[0.10] dark:group-hover:opacity-[0.15] transition-opacity duration-700"></div>
      
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            Configuração de Metas
          </h3>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] text-[#0F172A] dark:text-white px-3 py-2 md:px-4 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <Settings size={16} className="text-amber-500" />
            <span className="hidden md:inline">{isOpen ? 'Cancelar' : 'Editar Metas'}</span>
          </button>
        </div>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          Defina seu aporte mensal, intervalo dos próximos marcos e a meta financeira global.
        </p>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSaveConfig} className="pt-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                      Aporte Mensal Previsto
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosAporte)}
                      value={formatcurrency(digitosAporte)}
                      onChange={() => {}} 
                      className="w-full text-right bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-inset focus:ring-amber-500 dark:text-white shadow-sm"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2 mt-2">
                      Tamanho do Passo (Intervalo)
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosStep)}
                      value={formatcurrency(digitosStep)}
                      onChange={() => {}} 
                      className="w-full text-right bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-inset focus:ring-amber-500 dark:text-white shadow-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2 mt-2">
                      Alvo da Meta Global
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosMetaGlobal)}
                      value={formatcurrency(digitosMetaGlobal)}
                      onChange={() => {}} 
                      className="w-full text-right bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-inset focus:ring-amber-500 dark:text-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-end">
                  <button 
                    type="submit" 
                    className="btn-salvar flex-1"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Also we need to import Trophy from lucide-react if not imported. I'll just add it to the imports in the file.
