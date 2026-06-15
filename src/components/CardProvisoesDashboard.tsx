import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Calendar, CheckCircle2, Clock, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';

interface CardProvisoesDashboardProps {
  activeProfileId: string;
  setActivePage?: (page: string) => void;
  mesSelecionado?: number;
  anoSelecionado?: number;
  refreshTrigger?: number;
}

export function CardProvisoesDashboard({ activeProfileId, setActivePage, mesSelecionado, anoSelecionado, refreshTrigger }: CardProvisoesDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
      despesas: { pendentes: 0, pagas: 0, ignoradas: 0, total: 0 },
      receitas: { pendentes: 0, pagas: 0, ignoradas: 0, total: 0 }
  });

  useEffect(() => {
    if (!activeProfileId) return;

    const fetchStats = async () => {
      setLoading(true);
      const now = new Date();
      const currentYear = anoSelecionado || now.getFullYear();
      const currentMonth = mesSelecionado ? mesSelecionado - 1 : now.getMonth();
      
      const startBoundary = new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0];
      const endBoundary = new Date(currentYear, currentMonth + 2, 0).toISOString().split('T')[0];

      const [recRes, transRes] = await Promise.all([
        supabase
          .from('transacoes_recorrentes')
          .select('*')
          .eq('profile_id', activeProfileId)
          .eq('ativa', true),
        supabase
          .from('transacoes')
          .select('id, data, recorrente_id, descricao')
          .eq('profile_id', activeProfileId)
          .not('recorrente_id', 'is', null)
          .gte('data', startBoundary)
          .lte('data', endBoundary)
      ]);

      if (recRes.error) {
        console.error('Error fetching recurring transactions:', recRes.error);
        setLoading(false);
        return;
      }

      const recorrentes = recRes.data || [];
      const transacoes = transRes.data || [];

      const findRealization = (rec: any, year: number, month: number) => {
        const monthStr = String(month + 1).padStart(2, '0');
        const refTag = `(Ref: ${monthStr}/${year})`;
        
        return transacoes.find((t: any) => {
            if (t.recorrente_id !== rec.id) return false;

            if (t.descricao && t.descricao.includes('(Ref:')) {
               return t.descricao.includes(refTag);
            }
            
            if (!t.data) return false;
            const [y, m, d] = t.data.split('-');
            return parseInt(y, 10) === year && parseInt(m, 10) === (month + 1);
        });
      };

      let dPendentes = 0, dPagas = 0, dIgnoradas = 0;
      let rPendentes = 0, rPagas = 0, rIgnoradas = 0;

      recorrentes.forEach((rec) => {
        if (rec.lancamento_rapido === true) return;
        
        const freq = (rec.frequencia || 'mensal').toLowerCase();
        if (freq === 'diaria' || freq === 'semanal' || freq === 'diária') return;

        const isPago = !!findRealization(rec, currentYear, currentMonth);

        const launchDateStr = rec.ultima_lancada;
        
        // Ignorar "fantasmas" que não possuem ultima_lancada, da mesma forma que a página Recorrentes os ignora.
        if (!launchDateStr) {
            return;
        }

        let effStartYear = currentYear;
        let effStartMonth = currentMonth;
        
        const launchDate = new Date(launchDateStr);
        effStartYear = launchDate.getFullYear();
        effStartMonth = launchDate.getMonth();

        const projectedTimeId = currentYear * 12 + currentMonth;
        const creationTimeId = effStartYear * 12 + effStartMonth;

        if (!isPago && projectedTimeId < creationTimeId) {
            return;
        }

        const monthDiff = projectedTimeId - creationTimeId;
        if (rec.num_parcelas && rec.num_parcelas > 0) {
            if (monthDiff < 0 || monthDiff >= rec.num_parcelas) {
                return;
            }
        }

        if (rec.ativa === false && !isPago) {
            return;
        }

        const excludeTag = `${currentYear}_${currentMonth}`;
        
        let isIgnoredLocally = false;
        if (rec.exclusoes_pontuais) {
           if (Array.isArray(rec.exclusoes_pontuais)) {
               isIgnoredLocally = rec.exclusoes_pontuais.includes(excludeTag);
           } else if (typeof rec.exclusoes_pontuais === 'string') {
               isIgnoredLocally = rec.exclusoes_pontuais.includes(excludeTag);
           }
        }

        let isOffMonth = false;
        if (freq === 'anual') {
           let annualTarget = currentMonth;
           if (rec.mes_vencimento) {
             annualTarget = rec.mes_vencimento - 1;
           } else {
             annualTarget = effStartMonth;
           }
           isOffMonth = currentMonth !== annualTarget;
        }

        if (!isOffMonth) {
            const isDespesa = rec.tipo === 'despesa';
            if (isPago) {
                if (isDespesa) dPagas++; else rPagas++;
            } else if (isIgnoredLocally) {
                if (isDespesa) dIgnoradas++; else rIgnoradas++;
            } else {
                if (isDespesa) dPendentes++; else rPendentes++;
            }
        }
      });

      setStats({ 
          despesas: { pendentes: dPendentes, pagas: dPagas, ignoradas: dIgnoradas, total: dPendentes + dPagas + dIgnoradas },
          receitas: { pendentes: rPendentes, pagas: rPagas, ignoradas: rIgnoradas, total: rPendentes + rPagas + rIgnoradas }
      });
      setLoading(false);
    };

    fetchStats();
  }, [activeProfileId, mesSelecionado, anoSelecionado, refreshTrigger]);

  const mesesCompletos = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const mesCapitalizado = mesesCompletos[mesSelecionado ? mesSelecionado - 1 : new Date().getMonth()];

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-[24px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full min-h-[300px] animate-pulse">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="space-y-4 mb-6">
            <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendentesTotal = stats.despesas.pendentes + stats.receitas.pendentes;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[24px] border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden flex flex-col h-full min-h-[280px]">
      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              Provisões Fixas
          </h3>
          <div className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-black tracking-widest border ${pendentesTotal > 0 ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'}`}>
            {mesCapitalizado}
          </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-5">
        
        {/* DESPESAS */}
        <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-700 p-4 relative overflow-hidden group hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
            
            <div className="flex items-start justify-between relative z-10 mb-4">
               <div className="flex-1 text-left">
                 <div className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div> DESPESAS
                 </div>
                 <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.despesas.total}</div>
               </div>
               {(stats.despesas.total >= 0) && (
                 <>
                   <div className="flex-1 text-center">
                     <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Não Pagas</div>
                     <div className="text-xl font-black text-slate-700 dark:text-slate-200">{stats.despesas.pendentes}</div>
                   </div>
                   <div className="flex-1 text-right">
                     <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Pagas</div>
                     <div className="text-xl font-black text-slate-700 dark:text-slate-200">{stats.despesas.pagas}</div>
                   </div>
                 </>
               )}
            </div>

            <div className="relative z-10">
               <div className="w-full h-1.5 rounded-full bg-red-400 shadow-sm" />
            </div>
        </div>

        {/* RECEITAS */}
        <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-700 p-4 relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors">
            
            <div className="flex items-start justify-between relative z-10 mb-4">
               <div className="flex-1 text-left">
                 <div className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div> RECEITAS
                 </div>
                 <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.receitas.total}</div>
               </div>
               {(stats.receitas.total >= 0) && (
                 <>
                   <div className="flex-1 text-center">
                     <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Não Recebido</div>
                     <div className="text-xl font-black text-slate-700 dark:text-slate-200">{stats.receitas.pendentes}</div>
                   </div>
                   <div className="flex-1 text-right">
                     <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Recebido</div>
                     <div className="text-xl font-black text-slate-700 dark:text-slate-200">{stats.receitas.pagas}</div>
                   </div>
                 </>
               )}
            </div>

            <div className="relative z-10">
               <div className="w-full h-1.5 rounded-full bg-emerald-400 shadow-sm" />
            </div>
        </div>

        <div className="flex mt-1">
          <button 
            onClick={() => setActivePage?.('recorrentes')}
            className="w-full py-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-[12px] tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2 group shadow-sm">
            Gerenciar Provisões
            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
