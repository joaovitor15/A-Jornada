import React, { useState, useEffect, useRef } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ChevronDown, Check, PieChart, Clock, CreditCard, LayoutDashboard } from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { supabase } from '../supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { CardFaturaDashboard } from './CardFaturaDashboard';
import { CardFaturaMini } from './CardFaturaMini';
import { CardProvisoesDashboard } from './CardProvisoesDashboard';
import { useProfiles } from '../hooks/useProfiles';

interface DashboardProps {
  activeProfileName: string;
  activeProfileId: string;
  activeProfileType?: string;
  setActivePage?: (page: any) => void;
}

export const Dashboard = ({ activeProfileName, activeProfileId, activeProfileType, setActivePage }: DashboardProps) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { profiles } = useProfiles();
  const currentProfile = profiles.find(p => p.id === activeProfileId);
  
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);

  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora ou apertar Escape
  useEffect(() => {
    const fecharFora = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownMesAberto(false);
      }
    };
    const fecharEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownMesAberto(false);
      }
    };
    document.addEventListener('mousedown', fecharFora);
    document.addEventListener('keydown', fecharEsc);
    return () => {
      document.removeEventListener('mousedown', fecharFora);
      document.removeEventListener('keydown', fecharEsc);
    };
  }, []);

  const selecionarMes = (index: number) => {
    setMesSelecionado(index + 1);
    setDropdownMesAberto(false);
  };

  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [receitasValor, setReceitasValor] = useState(0);
  const [receitasNoMes, setReceitasNoMes] = useState(0);
  const [despesasValor, setDespesasValor] = useState(0);
  const [investimentosValor, setInvestimentosValor] = useState(0);
  const [cartoesValor, setCartoesValor] = useState(0);
  const [cartoesDisplayTotal, setCartoesDisplayTotal] = useState(0);
  const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);
  const [cartoesPago, setCartoesPago] = useState(false);
  const [receitasPago, setReceitasPago] = useState(0);
  const [receitasPrevisto, setReceitasPrevisto] = useState(0);
  const [despesasPago, setDespesasPago] = useState(0);
  const [despesasPrevisto, setDespesasPrevisto] = useState(0);
  const [despesasValorExibicao, setDespesasValorExibicao] = useState(0);
  const [despesasPrevistoExibicao, setDespesasPrevistoExibicao] = useState(0);
  const [investimentosPrevisto, setInvestimentosPrevisto] = useState(0);
  const [economiaDespesas, setEconomiaDespesas] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [pendingProvisions, setPendingProvisions] = useState<any[]>([]);
  const [lancamentosRapidos, setLancamentosRapidos] = useState<any[]>([]);

  // Carregar dados dos Cards
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchCards = async () => {
      setIsCardsLoading(true);
      const ms = mesSelecionado;
      const an = anoSelecionado;
      const mesStr = ms.toString().padStart(2, '0');
      const ultimoDia = new Date(an, ms, 0).getDate();
      const currentMonthPrefix = `${an}-${mesStr}`;

      
      const { data: antDataAll } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )`)
        .eq('profile_id', activeProfileId)
        .gte('data', `${currentMonthPrefix}-01`).lte('data', `${currentMonthPrefix}-${ultimoDia}`);

      const antDataAllToUse = antDataAll || [];
      const { data: recorrentesRaw, error: recError } = await supabase
        .from('transacoes_recorrentes')
        .select('*, categories (id, nome, cor), tags (id, nome)')
        .eq('profile_id', activeProfileId)
        .eq('ativa', true);

      
      
      
      const combinedPending: any[] = [];
      const lancamentosRapidos: any[] = [];
      
      
      
      const dspsArr = antDataAllToUse.filter(t => t.tipo === 'despesa' && t.card_id === null && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      const recsArr = antDataAllToUse.filter(t => t.tipo === 'receita' && t.card_id === null && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      const invesArr = dspsArr.filter(t => (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos');
      
      let sumRecsPago = 0;
      recsArr.forEach(t => {
          if (t.status !== 'previsto') {
              const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
              const isFarmacia = activeProfileType === 'empresa' && (tagCat === 'farmácia popular' || tagCat === 'farmacia popular');
              if (!isFarmacia) sumRecsPago += Number(t.valor) || 0;
          }
      });
      

      let currentRecsPago = 0;
      let currentRecsPrev = 0;
      let currentDspsPago = 0;
      let currentDspsPrev = 0;
      let currentInvesPago = 0;
      let currentInvesPrev = 0;

      recsArr.forEach(t => {
          if (t.status === 'previsto') currentRecsPrev += (t.valor_previsto || t.valor || 0);
          else currentRecsPago += (t.valor || 0);
      });

      const dspsArrFull = antDataAllToUse.filter(t => t.tipo === 'despesa' && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      let currentDspsPagoExibicao = 0;
      let currentDspsPrevExibicao = 0;
      
      dspsArrFull.forEach(t => {
          const isInvest = (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos';
          if (!isInvest) {
              if (t.status === 'previsto') currentDspsPrevExibicao += (t.valor_previsto || t.valor || 0);
              else currentDspsPagoExibicao += (t.valor || 0);
          }
      });

      dspsArr.forEach(t => {
          const isInvest = (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos';
          if (isInvest) {
              if (t.status === 'previsto') currentInvesPrev += (t.valor_previsto || t.valor || 0);
              else currentInvesPago += (t.valor || 0);
          } else {
              if (t.status === 'previsto') currentDspsPrev += (t.valor_previsto || t.valor || 0);
              else currentDspsPago += (t.valor || 0);
          }
      });
      
      let currentDspsPrevRec = 0;
      let currentRecsPrevRec = 0;
      let currentInvesPrevRec = 0;
      let currentDspsPrevRecExibicao = 0;
      
      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {
                  lancamentosRapidos.push({
                      id: `rec-${rec.id}`,
                      recorrente_id: rec.id,
                      descricao: rec.nome,
                      valor: Number(rec.valor) || 0,
                      tags: rec.tags,
                      categories: rec.categories,
                      isRecurrent: true,
                      tipo: rec.tipo,
                      recurrentSource: rec
                  });
                  return;
              }
              
              const recCat = rec.categories?.nome?.toLowerCase();
              const isInvest = recCat === 'investimentos';

              
              const launchDateStr = rec.ultima_lancada || rec.created_at;
              let startYear = new Date().getFullYear();
              let startMonth = new Date().getMonth();
              if (launchDateStr) {
                  const launchDate = new Date(launchDateStr);
                  startYear = launchDate.getFullYear();
                  startMonth = launchDate.getMonth();
              }
              
              const targetYear = an;
              const targetMonth = ms - 1;
              const monthDiff = (targetYear - startYear) * 12 + (targetMonth - startMonth);
              
              let shouldRender = true;
              if (rec.num_parcelas && rec.num_parcelas > 1) {
                  if (monthDiff < 0 || monthDiff >= rec.num_parcelas) shouldRender = false;
              }
              if (rec.frequencia === 'anual') {
                  const tMonth = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
                  if (targetMonth !== tMonth) shouldRender = false;
              }
              
              if (shouldRender) {
                  const dtPrefix = `${targetYear}-${String(targetMonth+1).padStart(2, '0')}`;
                  const launched = antDataAllToUse.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                  if (!launched) {
                      // For EXIBICAO (Includes cards)
                      if (rec.tipo === 'despesa' && !isInvest) {
                          currentDspsPrevRecExibicao += Number(rec.valor) || 0;
                      }
                      
                      // For Saldo Final (Excludes cards)
                      if (rec.card_id === null) {
                          if (rec.tipo === 'receita') currentRecsPrevRec += Number(rec.valor) || 0;
                          else if (rec.tipo === 'despesa') {
                              if (isInvest) currentInvesPrevRec += Number(rec.valor) || 0;
                              else currentDspsPrevRec += Number(rec.valor) || 0;
                          }
                      }
                      
                      const tDay = rec.dia_vencimento || 1;
                      if (true) {
                        combinedPending.push({
                          id: `rec-${rec.id}`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: dtPrefix + '-' + String(tDay).padStart(2, '0'),
                          tipo: rec.tipo,
                          status: 'previsto',
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                      });
                  }
              }
              }
          });
      }
      

      setDespesasValor(currentDspsPago);
      setInvestimentosValor(currentInvesPago);
      
      setReceitasPago(currentRecsPago);
      setReceitasPrevisto(currentRecsPrev + currentRecsPrevRec);
      setDespesasPago(currentDspsPago);
      setDespesasPrevisto(currentDspsPrev + currentDspsPrevRec);
      
      setDespesasValorExibicao(currentDspsPago);
      setDespesasPrevistoExibicao(currentDspsPrevExibicao + currentDspsPrevRecExibicao);
      
      setInvestimentosPrevisto(currentInvesPrev + currentInvesPrevRec);
      
      setEconomiaDespesas(Math.max(0, (currentDspsPrev + currentDspsPrevRec) - currentDspsPago));
      
      setReceitasValor(sumRecsPago);
      
      
      setCartoesValor(0);
      
      
      setCartoesPago(false);
      setCartoesDisplayTotal(0);

      if (dspsArrFull) {
        dspsArrFull.forEach(d => {
            if (d.status === 'previsto') combinedPending.push(d);
        });
      }
      
      if (recsArr) {
        recsArr.forEach(d => {
            if (d.status === 'previsto') combinedPending.push(d);
        });
      }
      
      if (invesArr) {
        invesArr.forEach(d => {
            // Only investments of type "despesa" that are predicted
            if (d.status === 'previsto' && d.tipo === 'despesa') combinedPending.push(d);
        });
      }
      combinedPending.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      setPendingProvisions(combinedPending);
      setLancamentosRapidos(lancamentosRapidos);

      setIsCardsLoading(false);
    };

    fetchCards();
  }, [activeProfileId, mesSelecionado, anoSelecionado, isTransactionModalOpen, refreshTrigger]);

  // Carregar dados do Gráfico Anual
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchGrafico = async () => {
      setIsChartLoading(true);
      const { data: transacoesAno } = await supabase
        .from('transacoes')
        .select(`
          *,
          tags ( categories!tags_category_id_fkey ( nome ) )
        `)
        .eq('profile_id', activeProfileId)
        .is('card_id', null)
        .gte('data', `${anoSelecionado}-01-01`)
        .lte('data', `${anoSelecionado}-12-31`);

      const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const dados = Array.from({ length: 12 }, (_, i) => ({
        mes: meses[i],
        mesIndex: i + 1,
        receitas: 0,
        despesas: 0,
        investimentos: 0,
        saldoFinal: 0,
        mesCompleto: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][i]
      }));

      (transacoesAno || []).forEach(t => {
        // Ignorar previsões futuras do gráfico de fluxo financeiro realizado
        if (t.status === 'previsto') return;
        if (t.card_id) return;

        const dateParts = t.data.split('-');
        if (dateParts.length >= 2) {
          const mes = parseInt(dateParts[1], 10) - 1;
          if (mes >= 0 && mes < 12) {
            const catName = t.tags?.categories?.nome;
            const isFarmacia = activeProfileType === 'empresa' && catName && (catName.toLowerCase() === 'farmácia popular' || catName.toLowerCase() === 'farmacia popular');
            
            if (t.tipo === 'despesa' && catName?.toLowerCase() === 'investimentos') {
               dados[mes].investimentos += t.valor || 0;
            } else if (t.tipo === 'receita' && !isFarmacia) {
              dados[mes].receitas += t.valor || 0;
            } else if (t.tipo === 'despesa' && !isFarmacia) {
              dados[mes].despesas += t.valor || 0;
            }
          }
        }
      });

      dados.forEach(d => {
        d.saldoFinal = d.receitas - d.despesas - d.investimentos;
      });

      setDadosGrafico(dados);
      setIsChartLoading(false);
    };

    fetchGrafico();
  }, [activeProfileId, anoSelecionado, isTransactionModalOpen, refreshTrigger]);
  
  const targetMesVencimento = mesSelecionado;
  const targetAnoVencimento = anoSelecionado;
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevistoExibicao - faturaCartaoPendente;

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mesesCompletos = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const CustomDot = (props: any) => {
    const { cx, cy, payload, color } = props;
    if (payload.mesIndex === mesSelecionado) {
      let activeColor = color;
      if (color === '#16A34A') activeColor = '#15803D';
      if (color === '#EF4444') activeColor = '#DC2626';
      
      return (
        <circle cx={cx} cy={cy} r={6} fill={activeColor} stroke="#fff" strokeWidth={2} className="cursor-pointer focus:outline-none" style={{ outline: 'none' }} />
      );
    }
    return <circle cx={cx} cy={cy} r={4} fill={color} className="cursor-pointer focus:outline-none" style={{ outline: 'none' }} />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E293B] p-[12px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E2E8F0] dark:border-[#334155] min-w-[200px]">
          <p className="font-bold text-[#0F172A] dark:text-white mb-[8px]">{payload[0].payload.mesCompleto} {anoSelecionado}</p>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#16A34A] dark:text-green-400 font-semibold flex items-center justify-between gap-[16px]">
              Receitas: <span>{formatarValor(payload[0].payload.receitas)}</span>
            </p>
            <p className="text-[13px] text-[#EF4444] dark:text-red-400 font-semibold flex items-center justify-between gap-[16px]">
              Despesas: <span>{formatarValor(payload[0].payload.despesas)}</span>
            </p>
            <p className="text-[13px] text-[#CA8A04] dark:text-yellow-400 font-semibold flex items-center justify-between gap-[16px]">
              Investimentos: <span>{formatarValor(payload[0].payload.investimentos)}</span>
            </p>
            <p className="text-[13px] text-[#3B82F6] dark:text-blue-400 font-semibold flex items-center justify-between gap-[16px]">
              Saldo Final: <span>{formatarValor(payload[0].payload.saldoFinal)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[24px] bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen">
      {/* 1. CABEÇALHO */}
      <div className="flex justify-between items-center mb-[24px]">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard size={28} className="text-[#3B82F6]" />
            Dashboard
          </h2>
        </div>
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="btn-salvar !p-3 lg:!px-[24px] lg:!py-[12px] !rounded-full lg:!rounded-xl flex-shrink-0 ml-4"
        >
          <Plus size={20} strokeWidth={3} className="lg:w-[15px] lg:h-[15px] transition-transform group-hover:scale-110" />
          <span className="hidden lg:inline uppercase">Nova Transação</span>
        </button>
      </div>

      {/* 2. NAVEGAÇÃO TEMPORAL */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[16px] p-[16px_20px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm mb-[24px]">
        <div className="w-full">
          <div className="flex justify-center items-center gap-[16px] mb-[14px]">
            <button 
              onClick={() => setAnoSelecionado(prev => prev - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors shadow-sm"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <span className="text-[18px] font-black text-[#0F172A] dark:text-white tracking-tight">
              {anoSelecionado}
            </span>
            <button 
              onClick={() => setAnoSelecionado(prev => prev + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors shadow-sm"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Desktop Month Pills */}
          <div className="hidden md:flex gap-[8px] justify-center w-full flex-wrap pb-1">
            {MESES.map((nomeMes, index) => {
              const ativo = index + 1 === mesSelecionado;
              return (
                <button
                  key={nomeMes}
                  onClick={() => selecionarMes(index)}
                  className={`px-5 py-2 rounded-full font-bold text-[13px] transition-all whitespace-nowrap ${
                    ativo 
                      ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                      : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  {nomeMes}
                </button>
              );
            })}
          </div>

          {/* Mobile Month Dropdown */}
          <div className="md:hidden relative w-full" ref={dropdownRef}>
            <button
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] text-[14px] font-[600] text-[#0F172A] dark:text-white transition-all focus:border-[#2563EB]"
            >
              <span className="flex items-center gap-2">
                {mesesCompletos[mesSelecionado - 1]}
              </span>
              <ChevronDown size={18} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform duration-200 ${dropdownMesAberto ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownMesAberto && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] shadow-lg overflow-hidden z-50 max-h-[250px] overflow-y-auto"
                >
                  {mesesCompletos.map((nome, i) => {
                    const isActive = mesSelecionado === i + 1;
                    return (
                      <button
                        key={nome}
                        onClick={() => { selecionarMes(i); setDropdownMesAberto(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-[#1E293B] last:border-b-0 transition-colors ${
                          isActive 
                            ? 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#3B82F6]' 
                            : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/50'
                        }`}
                      >
                        <span className="font-[600] text-[14px]">{nome}</span>
                        {isActive && <Check size={16} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {/* CARD 1 — RECEITAS */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#16A34A] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          <div className="flex items-start justify-between mb-[16px] relative z-10">
            <div className="p-[6px] bg-[#F0FDF4] dark:bg-green-900/20 rounded-full text-[#16A34A] dark:text-green-500 w-[32px] h-[32px] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Receitas
            </span>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <>
                <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#16A34A] dark:text-green-500 leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>
                
              </>
            )}
          </div>
        </div>

        {/* CARD 2 — INVESTIMENTOS */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#10B981] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          <div className="flex items-start justify-between mb-[16px] relative z-10">
            <div className="p-[6px] bg-[#ECFDF5] dark:bg-emerald-900/20 rounded-full text-[#10B981] dark:text-emerald-500 w-[32px] h-[32px] flex items-center justify-center">
              <PieChart size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Investimentos
            </span>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#10B981] dark:text-emerald-500 leading-tight flex-wrap break-all">{formatarValor(investimentosValor)}</span>
            )}
          </div>
        </div>

        {/* CARD 3 — PROVISÃO */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#F59E0B] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          <div className="flex items-start justify-between mb-[16px] relative z-10">
            <div className="p-[6px] bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-500 dark:text-amber-400 w-[32px] h-[32px] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Provisão
            </span>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-amber-500 dark:text-amber-400 leading-tight flex-wrap break-all">{formatarValor(despesasPrevistoExibicao)}</span>
            )}
          </div>
        </div>

        {currentProfile?.financeiro_show_cartoes !== false && (
          <CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onTotalChange={setFaturaCartaoPendente} />
        )}

        {/* CARD 5 — DESPESAS */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#EF4444] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          <div className="flex items-start justify-between mb-[16px] relative z-10">
            <div className="p-[6px] bg-[#FEF2F2] dark:bg-red-900/20 rounded-full text-[#EF4444] dark:text-red-500 w-[32px] h-[32px] flex items-center justify-center">
              <TrendingDown size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Despesas
            </span>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#EF4444] dark:text-red-500 leading-tight flex-wrap break-all">{formatarValor(despesasValorExibicao)}</span>
            )}
          </div>
        </div>

        {/* CARD 6 — SALDO TOTAL */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#2563EB] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          <div className="flex items-start justify-between mb-[16px] relative z-10">
            <div className="p-[6px] bg-[#EFF6FF] dark:bg-blue-900/20 rounded-full text-[#2563EB] dark:text-blue-500 w-[32px] h-[32px] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
              Saldo do Mês
            </span>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className={`text-[20px] 2xl:text-[24px] font-[800] leading-tight flex-wrap break-all ${saldoTotal === 0 ? 'text-slate-800 dark:text-white' : (saldoTotal < 0 ? 'text-[#EF4444] dark:text-red-500' : 'text-[#2563EB] dark:text-blue-500')}`}>
                {formatarValor(saldoTotal)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch pt-2">
        {currentProfile?.financeiro_show_cartoes !== false && (
          <CardFaturaDashboard activeProfileId={activeProfileId} setActivePage={setActivePage} mesSelecionado={mesSelecionado} anoSelecionado={anoSelecionado} />
        )}
        <CardProvisoesDashboard activeProfileId={activeProfileId} setActivePage={setActivePage} mesSelecionado={mesSelecionado} anoSelecionado={anoSelecionado} refreshTrigger={refreshTrigger} />
      </div>

      {/* 3. GRÁFICO ANUAL */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-[24px]">
          <div>
            <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Resumo Financeiro</h3>
            <p className="text-[12px] text-[#94A3B8] dark:text-[#64748B] dark:text-[#94A3B8]">{anoSelecionado}</p>
          </div>

          <div className="flex items-center gap-[16px] flex-wrap">
            <div className="flex gap-[16px] flex-wrap">
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A] dark:bg-green-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Receitas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#EF4444] dark:bg-red-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Despesas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#CA8A04] dark:bg-yellow-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Investimentos</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#3B82F6] dark:bg-blue-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Saldo do Mês</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .dashboard-chart-container .recharts-wrapper, 
          .dashboard-chart-container .recharts-wrapper *, 
          .dashboard-chart-container .recharts-surface, 
          .dashboard-chart-container .recharts-surface:focus,
          .dashboard-chart-container svg { 
            outline: none !important; 
          }
        `}</style>
        <div className="w-full dashboard-chart-container relative" style={{ height: 280, minHeight: 280 }}>
          {isChartLoading ? (
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-1 pb-[30px] pt-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-t-md" style={{ height: `${Math.max(15, Math.random() * 85 + 15)}%`, opacity: 0.7 }}></div>
              ))}
              {/* x-axis fake labels */}
              <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between px-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-6 h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280} minWidth={1} minHeight={1}>
              <AreaChart 
                data={dadosGrafico} 
                onClick={(e) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    const clickMes = Number(e.activeTooltipIndex) + 1;
                    setMesSelecionado(clickMes);
                  }
                }} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0FDF4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F0FDF4" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEF2F2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FEF2F2" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInvestimentos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEF9C3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FEF9C3" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSaldoFinal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DBEAFE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#DBEAFE" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="mes" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94A3B8' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94A3B8' }} 
                tickFormatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`} 
              />
              <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="receitas" 
                stroke="#16A34A" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorReceitas)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#16A34A" />}
              />
              <Area 
                type="monotone" 
                dataKey="despesas" 
                stroke="#EF4444" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorDespesas)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#EF4444" />}
              />
              <Area 
                type="monotone" 
                dataKey="investimentos" 
                stroke="#CA8A04" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorInvestimentos)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#CA8A04" />}
              />
              <Area 
                type="monotone" 
                dataKey="saldoFinal" 
                stroke="#3B82F6" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorSaldoFinal)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#3B82F6" />}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {activeProfileId && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          perfilId={activeProfileId}
        />
      )}
    </div>
  );
};


