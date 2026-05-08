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

  // Carregar dados dos Cards
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchCards = async () => {
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
    };

    fetchCards();
  }, [activeProfileId, mesSelecionado, anoSelecionado, isTransactionModalOpen]);

  // Carregar dados do Gráfico Anual
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchGrafico = async () => {
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
        <div className="bg-white p-[12px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E2E8F0] min-w-[200px]">
          <p className="font-bold text-[#0F172A] mb-[8px]">{payload[0].payload.mesCompleto} {anoSelecionado}</p>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#16A34A] font-semibold flex items-center justify-between gap-[16px]">
              Receitas: <span>{formatarValor(payload[0].value)}</span>
            </p>
            <p className="text-[13px] text-[#EF4444] font-semibold flex items-center justify-between gap-[16px]">
              Despesas: <span>{formatarValor(payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[24px] bg-[#F8FAFC]">
      {/* 1. CABEÇALHO DA PÁGINA */}
      <div className="relative flex justify-center items-center mb-[24px]">
        {/* LADO CENTRO - Filtros de período */}
        <div className="flex gap-[12px]">
          {/* Dropdown de Mês */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="flex items-center gap-[8px] bg-white border-[1.5px] border-[#E2E8F0] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              {mesesCompletos[mesSelecionado - 1]}
              <ChevronDown size={14} className={`text-[#64748B] transition-transform ${dropdownMesAberto ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownMesAberto && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropdownMesAberto(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 min-w-[200px] bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-2 z-30"
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
                                ? 'bg-slate-100 text-slate-700 font-bold' 
                                : 'text-slate-600 font-medium hover:bg-slate-50'
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

          <div className="flex items-center gap-[10px] bg-white border-[1.5px] border-[#E2E8F0] rounded-[100px] px-[16px] py-[8px]">
            <button onClick={() => setAnoSelecionado(prev => prev - 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[14px] font-[600] text-[#0F172A] min-w-[60px] text-center">
              {anoSelecionado}
            </span>
            <button onClick={() => setAnoSelecionado(prev => prev + 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* LADO DIREITO - Nova Transação */}
        <div className="absolute right-0">
          <button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-[6px] rounded-[100px] px-[22px] py-[10px] text-white font-[700] text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-transform cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            <Plus size={15} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {/* CARD 1 — RECEITAS */}
        <div className="bg-white rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#F0FDF4] rounded-full text-[#16A34A] w-[32px] h-[32px] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] font-bold tracking-wider">
              Receitas
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-[800] text-[#16A34A] leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#16A34A]" />
        </div>

        {/* CARD 2 — DESPESAS */}
        <div className="bg-white rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#FEF2F2] rounded-full text-[#EF4444] w-[32px] h-[32px] flex items-center justify-center">
              <TrendingDown size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] font-bold tracking-wider">
              Despesas
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-[800] text-[#EF4444] leading-tight flex-wrap break-all">{formatarValor(despesasValor)}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EF4444]" />
        </div>

        {/* CARD 3 — SALDO TOTAL */}
        <div className="bg-white rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#EFF6FF] rounded-full text-[#2563EB] w-[32px] h-[32px] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] font-bold tracking-wider">
              Saldo Total
            </span>
          </div>
          <div className="flex flex-col">
            <span className={`text-[28px] font-[800] leading-tight flex-wrap break-all ${saldoTotal < 0 ? 'text-[#EF4444]' : 'text-[#2563EB]'}`}>
              {formatarValor(saldoTotal)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#2563EB]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CardFaturaDashboard activeProfileId={activeProfileId} />
      </div>

      {/* 3. GRÁFICO ANUAL */}
      <div className="bg-white rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-[24px]">
          <div>
            <h3 className="text-[16px] font-[700] text-[#0F172A]">Resumo Financeiro</h3>
            <p className="text-[12px] text-[#94A3B8]">{anoSelecionado}</p>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A]"></div>
                <span className="text-[12px] font-[600] text-[#64748B]">— Receitas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#EF4444]"></div>
                <span className="text-[12px] font-[600] text-[#64748B]">— Despesas</span>
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
        <div className="w-full dashboard-chart-container" style={{ height: 280, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
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


