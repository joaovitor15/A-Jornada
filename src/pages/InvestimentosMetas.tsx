import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Sparkles, Settings, CheckCircle2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';

interface InvestimentosMetasProps {
  activeProfileId?: string | null;
}

export const InvestimentosMetas = ({ activeProfileId }: InvestimentosMetasProps) => {
    
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllConcluidas, setShowAllConcluidas] = useState(false);
  
  const [aporteBaseAuto, setAporteBaseAuto] = useState<number>(0);
  const [stepAuto, setStepAuto] = useState<number>(25000);
  const [metaGlobal, setMetaGlobal] = useState<number>(1000000);

        
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

    const isYellow = meta.isGlobal;
    const accentColorClass = isYellow ? 'bg-amber-500' : 'bg-[#3B82F6]';
    const textAccentClass = isYellow ? 'text-amber-500' : 'text-[#3B82F6]';
    
    return (
      <motion.div 
        key={meta.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] p-6 lg:p-8 shadow-sm dark:shadow-lg flex flex-col gap-4 relative overflow-hidden group border border-[#E2E8F0] dark:border-[#1E293B] ${meta.isConcluida ? 'opacity-80 hover:opacity-100' : ''}`}
      >
        <div className={`absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 ${accentColorClass} rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700`}></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[11px] lg:text-xs uppercase tracking-wider">
            {meta.isConcluida ? <CheckCircle2 size={16} className="text-green-500" /> : meta.isGlobal ? <Trophy size={16} className={textAccentClass} /> : <Sparkles size={16} className={textAccentClass} />}
            {meta.nome}
          </div>
        </div>

        <div className="space-y-2 mt-2 relative z-10">
          <div className="flex justify-between items-end">
            <span className="text-4xl md:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
              {progresso.toFixed(1)}%
            </span>
            <span className="text-sm text-[#94A3B8] font-medium">
               {meta.isConcluida ? (
                  meta.dateStr ? `Concluído em: ${new Date(meta.dateStr).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}` : 'Concluído'
               ) : `Falta: R$ ${faltante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full h-2 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${meta.isConcluida ? 'bg-green-500' : accentColorClass}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#94A3B8] relative z-10 font-medium mt-2">
          {!meta.isConcluida && aporteBaseAuto > 0 && forecast && forecast !== 'Indefinido' ? (
            <div className="flex items-center gap-2 w-fit">
              <Calendar size={14} className={textAccentClass} />
              <span>
                Previsão: <span className="text-[#0F172A] dark:text-white font-bold">{forecast}</span>
              </span>
            </div>
          ) : meta.isConcluida ? (
             <div className="flex items-center gap-2 w-fit">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-green-600 dark:text-green-400">
                   Alcançada
                </span>
             </div>
          ) : (
            <div className="flex items-center gap-2 w-fit">
              <Settings size={14} className="text-[#94A3B8]" />
              <span>Configure o aporte na sua conta</span>
            </div>
          )}
          
          {!meta.isConcluida && aporteBaseAuto > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
              <span>Aporte: R$ {aporteBaseAuto.toLocaleString('pt-BR')} / mês</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      

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

      </div>
  );
};
