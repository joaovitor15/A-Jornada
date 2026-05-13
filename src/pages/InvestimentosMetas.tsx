import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Sparkles, Settings, CheckCircle2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';

interface InvestimentosMetasProps {
  activeProfileId?: string | null;
}

export const InvestimentosMetas = ({ activeProfileId }: InvestimentosMetasProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllConcluidas, setShowAllConcluidas] = useState(false);
  
  const [aporteBaseAuto, setAporteBaseAuto] = useState<number>(0);
  const [stepAuto, setStepAuto] = useState<number>(25000);
  const [metaGlobal, setMetaGlobal] = useState<number>(1000000);

  const [digitosAporte, setDigitosAporte] = useState('0');
  const [digitosStep, setDigitosStep] = useState('0');
  const [digitosMetaGlobal, setDigitosMetaGlobal] = useState('0');
  
  const [currentTargetAuto, setCurrentTargetAuto] = useState<number>(0);
  const [historyAuto, setHistoryAuto] = useState<any[]>([]);

  // Real patrimonio calculation
  const [ativosCarteira, setAtivosCarteira] = useState<any[]>([]);
  const { data: cotacoesData } = useCotacoesGSheets();

  useEffect(() => {
    async function loadData() {
      if (!activeProfileId) return;

      // 1. Carregar Configurações do Perfil
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

      // 2. Carregar Ativos para Cálculo de Patrimônio
      const { data: ativos } = await supabase
        .from('ativos_carteira')
        .select('*')
        .eq('profile_id', activeProfileId);
        
      if (ativos) setAtivosCarteira(ativos);
      setIsLoaded(true);
    }
    loadData();
  }, [activeProfileId]);

  const patrimonioTotal = useMemo(() => {
    let total = 0;
    ativosCarteira.forEach(ativo => {
      const quoteObj = cotacoesData.find(c => 
        c.TICKER === ativo.ticker_google || 
        c.TICKER === ativo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === 'CURRENCY:' + ativo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === ativo.ticker_original.toUpperCase()
      );

      let price = 0;
      if (quoteObj && quoteObj.ULTIMA_COTACAO !== '#N/A' && quoteObj.ULTIMA_COTACAO !== '') {
        // If it's a number, use it directly. If it's a string, replace comma.
        price = typeof quoteObj.ULTIMA_COTACAO === 'number' ? quoteObj.ULTIMA_COTACAO : parseFloat(String(quoteObj.ULTIMA_COTACAO).replace(',', '.')) || 0;
      }

      // If it's renda-fixa, assume price = 1 and quantity = total value invested
      if (ativo.classe === 'renda-fixa') price = 1;
      
      const quoteUSD = cotacoesData.find(c => c.TICKER === 'CURRENCY:USDBRL');
      const valorDolar = quoteUSD ? (typeof quoteUSD.ULTIMA_COTACAO === 'number' ? quoteUSD.ULTIMA_COTACAO : parseFloat(String(quoteUSD.ULTIMA_COTACAO).replace(',', '.'))) : 1;

      // Apply dollar conversion for US assets
      if (['stocks-us', 'reits-us', 'etfs-us'].includes(ativo.classe) && price > 0) {
        price = price * valorDolar;
      }

      total += price * ativo.qtd;
    });
    return total;
  }, [ativosCarteira, cotacoesData]);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    let storedTarget = Number(localStorage.getItem('@App:currentAutoTarget'));
    let rawHistory = JSON.parse(localStorage.getItem('@App:historicoAutoTargets') || 'null');
    
    let storedHistory = [];
    const currentStep = stepAuto > 0 ? stepAuto : 25000;

    if (!storedTarget || !rawHistory) {
      storedTarget = (Math.floor(patrimonioTotal / currentStep) + 1) * currentStep;
      storedHistory = [];
    } else {
      storedHistory = rawHistory.map((item: any) => {
         if (typeof item === 'number') return { val: item, dateStr: null };
         return item;
      }).filter((item: any) => item.dateStr !== null); // Remove generated past milestones that didn't have a real date
    }

    let modified = false;
    let newTarget = storedTarget;
    let newHistory = [...storedHistory];

    while (newHistory.length > 0 && patrimonioTotal < newHistory[newHistory.length - 1].val) {
       newTarget = newHistory.pop()!.val;
       modified = true;
    }

    while (patrimonioTotal < newTarget - currentStep) {
       newTarget -= currentStep;
       modified = true;
    }

    while (patrimonioTotal >= newTarget) {
       newHistory.push({ val: newTarget, dateStr: new Date().toISOString() });
       newTarget += currentStep;
       modified = true;
    }

    if (modified || storedTarget !== newTarget) {
       localStorage.setItem('@App:currentAutoTarget', String(newTarget));
       localStorage.setItem('@App:historicoAutoTargets', JSON.stringify(newHistory));
    }
    
    setCurrentTargetAuto(newTarget);
    setHistoryAuto(newHistory);
  }, [patrimonioTotal, isLoaded, stepAuto]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAporte = Number(digitosAporte) / 100;
    const parsedStep = Number(digitosStep) / 100;
    const parsedMetaGlobal = Number(digitosMetaGlobal) / 100;
    
    const finalStep = parsedStep > 0 ? parsedStep : 25000;
    const finalMetaGlobal = parsedMetaGlobal > 0 ? parsedMetaGlobal : 1000000;
    
    // Salvar no Local State
    setAporteBaseAuto(parsedAporte);
    setStepAuto(finalStep);
    setMetaGlobal(finalMetaGlobal);

    // Salvar no Supabase
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

    // Backup no LocalStorage
    localStorage.setItem('@App:aporteBaseAuto', String(parsedAporte));
    localStorage.setItem('@App:stepAuto', String(finalStep));
    localStorage.setItem('@App:metaGlobal', String(finalMetaGlobal));
    
    setIsModalOpen(false);
  };

  const handleDigitosKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.key === 'Tab' || e.key === 'Enter') return;
    e.preventDefault();
    if (e.key === 'Backspace') {
      setter(prev => prev.slice(0, -1) || '0');
      return;
    }
    if (!/[0-9]/.test(e.key)) return;
    setter(prev => {
      const novo = prev === '0' ? e.key : prev + e.key;
      if (novo.length > 10) return prev;
      return novo;
    });
  };

  const formatcurrency = (digitos: string) => {
    return 'R$ ' + (Number(digitos) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };
  
  let concluidas = historyAuto.slice().reverse().map((item) => ({
     id: 'concl-' + item.val,
     nome: `Atingir R$ ${item.val.toLocaleString('pt-BR')}`,
     valor_alvo: item.val,
     valor_atual: item.val,
     isAuto: true,
     isConcluida: true,
     dateStr: item.dateStr
  }));

  const currentStepAuto = stepAuto > 0 ? stepAuto : 25000;
  
  const autoMetas = currentTargetAuto > 0 ? Array.from({ length: 2 }).map((_, idx) => {
    const val = currentTargetAuto + (idx * currentStepAuto);
    return {
      id: 'auto-' + (idx + 1),
      nome: `Atingir R$ ${val.toLocaleString('pt-BR')}`,
      valor_alvo: val,
      valor_atual: Math.min(patrimonioTotal, val),
      isAuto: true,
      isConcluida: false
    };
  }) : [];

  const formatGrandMilestone = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000) + (val === 1000000 ? ' Milhão' : ' Milhões');
    }
    if (val >= 1000) {
      return (val / 1000) + ' mil';
    }
    return val.toLocaleString('pt-BR');
  };

  const globalMetas = [
    {
      id: 'global-1',
      nome: `Atingir R$ ${formatGrandMilestone(metaGlobal)}`,
      valor_alvo: metaGlobal,
      valor_atual: Math.min(patrimonioTotal, metaGlobal),
      isAuto: true,
      isGlobal: true,
      isConcluida: patrimonioTotal >= metaGlobal
    }
  ];

  const calculateForecast = (falta: number, mensal: number) => {
    if (!mensal || mensal <= 0) return 'Indefinido';
    const meses = Math.ceil(falta / mensal);
    const dataAlvo = new Date();
    dataAlvo.setMonth(dataAlvo.getMonth() + meses);
    if (dataAlvo.getFullYear() > 2100) return 'Indefinido';
    return dataAlvo.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
  };

  const renderCard = (meta: any) => {
    const progresso = Math.min(100, Math.max(0, (meta.valor_atual / meta.valor_alvo) * 100));
    const faltante = Math.max(0, meta.valor_alvo - meta.valor_atual);
    
    const forecast = calculateForecast(faltante, aporteBaseAuto);

    return (
      <motion.div 
        key={meta.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border flex flex-col gap-4 relative overflow-hidden ${
          meta.isConcluida 
            ? 'border-green-200 dark:border-green-900/50 opacity-80 hover:opacity-100 transition-opacity' 
            : meta.isGlobal
              ? 'border-amber-200 dark:border-amber-900/50 shadow-amber-100/50 dark:shadow-amber-900/10'
              : 'border-blue-200 dark:border-blue-900/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            meta.isConcluida 
              ? 'bg-green-50 text-green-600 dark:bg-green-900/20' 
              : meta.isGlobal
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
          }`}>
            {meta.isConcluida ? <CheckCircle2 size={18} /> : meta.isGlobal ? <Trophy size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
             <h3 className={`font-bold leading-tight ${meta.isConcluida ? 'text-green-800 dark:text-green-400' : 'text-[#0F172A] dark:text-white'}`}>{meta.nome}</h3>
            {meta.isConcluida ? (
               <span className="text-xs text-green-600 dark:text-green-500 font-medium">Marcador alcançado</span>
            ) : aporteBaseAuto > 0 ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Aporte base: R$ {aporteBaseAuto.toLocaleString('pt-BR')} / mês
              </span>
            ) : (
              <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                Configure o aporte para ver a previsão
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1 mt-2">
          <div className="flex justify-between items-end">
            <span className={`text-2xl font-bold tracking-tight ${meta.isConcluida ? 'text-green-700 dark:text-green-400' : meta.isGlobal ? 'text-amber-600 dark:text-amber-400' : 'text-[#0F172A] dark:text-white'}`}>
              {progresso.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
               {meta.isConcluida ? (
                  meta.dateStr ? `Concluído em: ${new Date(meta.dateStr).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}` : 'Concluído'
               ) : `Falta: R$ ${faltante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${meta.isConcluida ? 'bg-green-500' : meta.isGlobal ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500'}`}
            />
          </div>
        </div>

        {!meta.isConcluida && aporteBaseAuto > 0 && forecast && forecast !== 'Indefinido' ? (
          <div className={`flex items-center gap-2 mt-2 py-2 px-3 rounded-lg w-fit ${meta.isGlobal ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
            <Calendar size={14} className={meta.isGlobal ? 'text-amber-500' : 'text-slate-400'} />
            <span className={`text-xs font-medium ${meta.isGlobal ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
              Previsão: <span className={meta.isGlobal ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-[#0F172A] dark:text-white'}>{forecast}</span>
            </span>
          </div>
        ) : meta.isConcluida ? (
           <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit">
              <CheckCircle2 size={14} className="text-green-500 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                 Concluída
              </span>
           </div>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Metas de Investimento</h1>
        </div>
        <button 
          onClick={() => {
            setDigitosAporte(String(Math.round(aporteBaseAuto * 100)));
            setDigitosStep(String(Math.round(stepAuto * 100)));
            setDigitosMetaGlobal(String(Math.round(metaGlobal * 100)));
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-600 text-white px-3 py-2 md:px-4 rounded-xl text-sm font-medium transition-colors"
        >
          <Settings size={16} />
          <span className="hidden md:inline">Configuração</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
            <Trophy size={16} />
            Metas Globais
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {globalMetas.map(renderCard)}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
            Próximos Marcos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoMetas.map(renderCard)}
          </div>
        </div>
        
        {concluidas.length > 0 && (
           <div className="mt-8">
               <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" />
                 Marcos Alcançados ({concluidas.length})
               </h2>
               <div className="gap-4 flex flex-col">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {concluidas.slice(0, 2).map(renderCard)}
                 </div>
                 {concluidas.length > 2 && (
                   <>
                     <AnimatePresence>
                       {showAllConcluidas && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                               {concluidas.slice(2).map(renderCard)}
                            </div>
                          </motion.div>
                       )}
                     </AnimatePresence>
                     
                     <div className="flex justify-center mt-2">
                        <button 
                           onClick={() => setShowAllConcluidas(!showAllConcluidas)}
                           className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors flex items-center flex-col gap-1"
                        >
                           {showAllConcluidas ? 'Ocultar marcos anteriores' : `+ ${concluidas.length - 2} marcos anteriores`}
                           <svg className={`w-4 h-4 transition-transform ${showAllConcluidas ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                        </button>
                     </div>
                   </>
                 )}
               </div>
           </div>
        )}
      </div>

      {/* Modal Configuração */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto md:w-[420px] h-fit bg-white dark:bg-slate-800 shadow-xl rounded-2xl z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700/50">
                <h2 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                   <Settings size={18} className="text-blue-500" />
                   Configurar Metas
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Aporte Mensal Previsto
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosAporte)}
                      value={formatcurrency(digitosAporte)}
                      onChange={() => {}} 
                      className="w-full text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 mt-2">
                      Tamanho do Passo (Intervalo)
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosStep)}
                      value={formatcurrency(digitosStep)}
                      onChange={() => {}} 
                      className="w-full text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-amber-500 dark:text-amber-500 uppercase tracking-wider mb-2 mt-2 flex items-center gap-2">
                      <Trophy size={14} />
                      Grande Meta Global
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => handleDigitosKeyDown(e, setDigitosMetaGlobal)}
                      value={formatcurrency(digitosMetaGlobal)}
                      onChange={() => {}} 
                      className="w-full text-right bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 dark:text-amber-100"
                    />
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-4"
                  >
                    Salvar Configuração
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
