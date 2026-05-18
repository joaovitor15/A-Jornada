import React, { useState, useEffect, useRef } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { supabase } from '../supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { CardFaturaDashboard } from './CardFaturaDashboard';

interface DashboardProps {
  activeProfileName: string;
  activeProfileId: string;
}

export const Dashboard = ({ activeProfileName, activeProfileId }: DashboardProps) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  
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

  const [receitasValor, setReceitasValor] = useState(0);
  const [despesasValor, setDespesasValor] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Carregar dados dos Cards
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchCards = async () => {
      setIsCardsLoading(true);
      const ms = mesSelecionado;
      const an = anoSelecionado;
      const mesStr = ms.toString().padStart(2, '0');
      const ultimoDia = new Date(an, ms, 0).getDate();

      const { data: receitas } = await supabase
        .from('transacoes')
        .select('valor')
        .eq('profile_id', activeProfileId)
        .eq('tipo', 'receita')
        .is('card_id', null)
        .gte('data', `${an}-${mesStr}-01`)
        .lte('data', `${an}-${mesStr}-${ultimoDia}`);

      const { data: despesas } = await supabase
        .from('transacoes')
        .select('valor')
        .eq('profile_id', activeProfileId)
        .eq('tipo', 'despesa')
        .is('card_id', null)
        .gte('data', `${an}-${mesStr}-01`)
        .lte('data', `${an}-${mesStr}-${ultimoDia}`);

      const sumReceitas = (receitas || []).reduce((acc, obj) => acc + (obj.valor || 0), 0);
      const sumDespesas = (despesas || []).reduce((acc, obj) => acc + (obj.valor || 0), 0);

      setReceitasValor(sumReceitas);
      setDespesasValor(sumDespesas);
      setIsCardsLoading(false);
    };

    fetchCards();
  }, [activeProfileId, mesSelecionado, anoSelecionado, isTransactionModalOpen]);

  // Carregar dados do Gráfico Anual
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchGrafico = async () => {
      setIsChartLoading(true);
      const { data: transacoesAno } = await supabase
        .from('transacoes')
        .select('valor, tipo, data')
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
        mesCompleto: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][i]
      }));

      (transacoesAno || []).forEach(t => {
        const dateParts = t.data.split('-');
        if (dateParts.length >= 2) {
          const mes = parseInt(dateParts[1], 10) - 1;
          if (mes >= 0 && mes < 12) {
            if (t.tipo === 'receita') {
              dados[mes].receitas += t.valor || 0;
            } else {
              dados[mes].despesas += t.valor || 0;
            }
          }
        }
      });

      setDadosGrafico(dados);
      setIsChartLoading(false);
    };

    fetchGrafico();
  }, [activeProfileId, anoSelecionado, isTransactionModalOpen]);
  
  const saldoTotal = receitasValor - despesasValor;

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

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
              Receitas: <span>{formatarValor(payload[0].value)}</span>
            </p>
            <p className="text-[13px] text-[#EF4444] dark:text-red-400 font-semibold flex items-center justify-between gap-[16px]">
              Despesas: <span>{formatarValor(payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-[16px] md:p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[20px] md:gap-[24px] pb-[100px] md:pb-[24px] relative">
      {/* 1. CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-[12px] md:relative mb-[8px] md:mb-[24px]">
        
        {/* FAB para Nova Transação - Fixado no mobile, normal no desktop */}
        <div className="fixed bottom-6 right-6 z-40 md:absolute md:top-0 md:right-0 md:bottom-auto">
          <button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-[12px] rounded-[16px] px-[16px] py-[16px] md:py-[12px] md:px-[24px] bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF] font-[600] text-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all cursor-pointer active:scale-95"
          >
            <Plus size={24} strokeWidth={2.5} />
            <span className="hidden md:inline">Nova Transação</span>
          </button>
        </div>

        {/* LADO CENTRO - Filtros de período */}
        <div className="flex flex-col md:flex-row gap-[12px] w-full md:w-auto">
          {/* Ano */}
          <div className="flex justify-between md:justify-center items-center gap-[10px] bg-[#EDF1F9] dark:bg-[#2D2F31] rounded-[24px] px-[16px] py-[10px]">
            <button onClick={() => setAnoSelecionado(prev => prev - 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
              {anoSelecionado}
            </span>
            <button onClick={() => setAnoSelecionado(prev => prev + 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dropdown de Mês - mobile: order 2, desktop: order 1 */}
          <div className="relative order-2 md:order-1 w-full md:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="w-full md:w-auto flex justify-between md:justify-center items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
            >
              {mesesCompletos[mesSelecionado - 1]}
              <ChevronDown size={14} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform ${dropdownMesAberto ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownMesAberto && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropdownMesAberto(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 min-w-[200px] w-full md:w-auto bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                  >
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                      {mesesCompletos.map((nome, i) => {
                        const isActive = mesSelecionado === i + 1;
                        return (
                          <button 
                            key={nome}
                            onClick={() => selecionarMes(i)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                              isActive 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold' 
                                : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="flex-1 text-left">{nome}</span>
                            {isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {/* CARD 1 — RECEITAS */}
        <div className="bg-[#E7F3E8] dark:bg-[#192B1C] rounded-[28px] p-[24px] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-[12px]">
            <div className="p-[8px] bg-white/50 dark:bg-black/20 rounded-[12px] text-[#1D6F31] dark:text-[#4ADE80] w-[40px] h-[40px] flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <span className="text-[12px] text-[#1D6F31]/70 dark:text-[#4ADE80]/70 font-bold tracking-wider">
              Receitas
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-32 bg-white/30 dark:bg-white/10 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[28px] font-[800] text-[#1D6F31] dark:text-[#4ADE80] leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>
            )}
          </div>
        </div>

        {/* CARD 2 — DESPESAS */}
        <div className="bg-[#FBE9E7] dark:bg-[#2D1B19] rounded-[28px] p-[24px] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-[12px]">
            <div className="p-[8px] bg-white/50 dark:bg-black/20 rounded-[12px] text-[#B91C1C] dark:text-[#F87171] w-[40px] h-[40px] flex items-center justify-center">
              <TrendingDown size={22} />
            </div>
            <span className="text-[12px] text-[#B91C1C]/70 dark:text-[#F87171]/70 font-bold tracking-wider">
              Despesas
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-32 bg-white/30 dark:bg-white/10 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[28px] font-[800] text-[#B91C1C] dark:text-[#F87171] leading-tight flex-wrap break-all">{formatarValor(despesasValor)}</span>
            )}
          </div>
        </div>

        {/* CARD 3 — SALDO TOTAL */}
        <div className="bg-[#E3F2FD] dark:bg-[#1A2634] rounded-[28px] p-[24px] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-[12px]">
            <div className="p-[8px] bg-white/50 dark:bg-black/20 rounded-[12px] text-[#0D47A1] dark:text-[#60A5FA] w-[40px] h-[40px] flex items-center justify-center">
              <Wallet size={22} />
            </div>
            <span className="text-[12px] text-[#0D47A1]/70 dark:text-[#60A5FA]/70 font-bold tracking-wider">
              Saldo Total
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-32 bg-white/30 dark:bg-white/10 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className={`text-[28px] font-[800] leading-tight flex-wrap break-all ${saldoTotal < 0 ? 'text-[#B91C1C] dark:text-[#F87171]' : 'text-[#0D47A1] dark:text-[#60A5FA]'}`}>
                {formatarValor(saldoTotal)}
              </span>
            )}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CardFaturaDashboard activeProfileId={activeProfileId} />
      </div>

      {/* 3. GRÁFICO ANUAL */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-[24px]">
          <div>
            <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Resumo Financeiro</h3>
            <p className="text-[12px] text-[#94A3B8] dark:text-[#64748B] dark:text-[#94A3B8]">{anoSelecionado}</p>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A] dark:bg-green-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Receitas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#EF4444] dark:bg-red-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Despesas</span>
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


