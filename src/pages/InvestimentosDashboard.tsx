import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Globe, 
  Bitcoin, 
  Wallet,
  PieChart,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Landmark
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { supabase } from '../supabaseClient';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';

import { SupabaseProfile } from '../hooks/useProfiles';

interface InvestimentosDashboardProps {
  activeProfileId?: string;
  activeProfile?: SupabaseProfile | null;
  updateProfileModules?: (id: string, modules: Partial<SupabaseProfile>) => Promise<{ error: any }>;
  moeda?: 'BRL' | 'USD';
  setMoeda?: (moeda: 'BRL' | 'USD') => void;
}

const CLASSES_DASHBOARD = [
  { id: 'renda-fixa', nome: 'Renda Fixa', cor: '#14B8A6' },
  { id: 'acoes-br', nome: 'Ações Brasil', cor: '#3B82F6' },
  { id: 'fiis', nome: 'FIIs Brasil', cor: '#8B5CF6' },
  { id: 'stocks-us', nome: 'Stocks EUA', cor: '#F59E0B' },
  { id: 'reits-us', nome: 'Reits EUA', cor: '#10B981' },
  { id: 'etfs-us', nome: 'ETF EUA', cor: '#FCD34D' },
  { id: 'cripto', nome: 'Criptomoedas', cor: '#EF4444' },
];

const DEFAULT_OBJECTIVES: Record<string, number> = {
  'fiis': 30,
  'acoes-br': 30,
  'stocks-us': 15,
  'reits-us': 10,
  'etfs-us': 5,
  'renda-fixa': 10,
  'cripto': 0
};

// Helper para formatar moeda
const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'BRL') => {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(value);
};

export function InvestimentosDashboard({ 
  activeProfileId, 
  activeProfile, 
  updateProfileModules,
  moeda: propMoeda,
  setMoeda: propSetMoeda
}: InvestimentosDashboardProps) {
  const [localMoeda, setLocalMoeda] = useState<'BRL' | 'USD'>('BRL');
  const moeda = propMoeda || localMoeda;
  const setMoeda = propSetMoeda || setLocalMoeda;
  
  const [ativosCarteira, setAtivosCarteira] = useState<any[]>([]);
  const { data: cotacoesData, loading: cotacoesLoading, refetch } = useCotacoesGSheets();
  const [objectives, setObjectives] = useState<Record<string, number>>(DEFAULT_OBJECTIVES);
  const [reservaTotal, setReservaTotal] = useState(0);

  useEffect(() => {
    if (activeProfile) {
      if (activeProfile.dashboard_metas_classes && Object.keys(activeProfile.dashboard_metas_classes).length > 0) {
        setObjectives(activeProfile.dashboard_metas_classes);
      }
    }
  }, [activeProfile]);

  useEffect(() => {
    async function loadData() {
      if (!activeProfileId) return;

      // Fetch user assets
      const { data, error } = await supabase
        .from('ativos_carteira')
        .select('*')
        .eq('profile_id', activeProfileId);
        
      if (!error && data) {
        setAtivosCarteira(data);
      }

      // Fetch reserva de emergência
      const { data: cofresData, error: cofresError } = await supabase
        .from('cofres')
        .select('saldo_atual')
        .eq('profile_id', activeProfileId)
        .eq('type', 'reserva');

      if (!cofresError && cofresData) {
        const total = cofresData.reduce((acc, curr) => acc + (Number(curr.saldo_atual) || 0), 0);
        setReservaTotal(total);
      }
    }
    loadData();
  }, [activeProfileId]);

  const handleObjectiveBlur = (id: string, valStr: string) => {
    let val = parseFloat(valStr.replace(',', '.')) || 0;
    const newObjs = { ...objectives, [id]: val };
    setObjectives(newObjs);
    if (activeProfileId && updateProfileModules) {
       updateProfileModules(activeProfileId, { dashboard_metas_classes: newObjs });
    }
  };

  // Calcula valores atuais e distribuição
  const dashboardData = useMemo(() => {
    const quoteDolarObj = cotacoesData.find(c => c.TICKER === 'CURRENCY:USDBRL');
    const valorDolar = quoteDolarObj ? (typeof quoteDolarObj.ULTIMA_COTACAO === 'number' ? quoteDolarObj.ULTIMA_COTACAO : parseFloat(String(quoteDolarObj.ULTIMA_COTACAO).replace(',', '.'))) : 1;

    let patrimonioTotal = 0;
    let sumRendaFixa = 0;
    let sumVariavelBR = 0;
    let sumExterior = 0;
    let sumCripto = 0;

    const mapClassValues = new Map<string, number>();
    CLASSES_DASHBOARD.forEach(c => mapClassValues.set(c.id, 0));

    ativosCarteira.forEach(ativo => {
      const quoteObj = cotacoesData.find(c => 
        c.TICKER === ativo.ticker_google || 
        c.TICKER === ativo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === 'CURRENCY:' + ativo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === ativo.ticker_original.toUpperCase()
      );

      let price = 0;
      if (quoteObj && quoteObj.ULTIMA_COTACAO !== '#N/A' && quoteObj.ULTIMA_COTACAO !== '') {
        price = typeof quoteObj.ULTIMA_COTACAO === 'number' ? quoteObj.ULTIMA_COTACAO : parseFloat(String(quoteObj.ULTIMA_COTACAO).replace(',', '.')) || 0;
      }

      if (ativo.classe === 'renda-fixa') price = 1;
      if (['stocks-us', 'reits-us', 'etfs-us'].includes(ativo.classe) && price > 0) {
        price = price * valorDolar;
      }

      const totalAsset = price * ativo.qtd;

      patrimonioTotal += totalAsset;
      
      if (ativo.classe === 'renda-fixa') sumRendaFixa += totalAsset;
      else if (['acoes-br', 'fiis'].includes(ativo.classe)) sumVariavelBR += totalAsset;
      else if (['stocks-us', 'reits-us', 'etfs-us'].includes(ativo.classe)) sumExterior += totalAsset;
      else if (ativo.classe === 'cripto') sumCripto += totalAsset;

      mapClassValues.set(ativo.classe, (mapClassValues.get(ativo.classe) || 0) + totalAsset);
    });

    const totalObjective = (Object.values(objectives) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

    const distribuicao = CLASSES_DASHBOARD.map(c => {
      const ativosDaClasse = ativosCarteira.filter(a => a.classe === c.id);
      const qtdAtivos = ativosDaClasse.length;
      const totalCotas = c.id === 'renda-fixa' ? 0 : ativosDaClasse.reduce((acc, curr) => acc + (Number(curr.qtd) || 0), 0);
      let valorAtual = mapClassValues.get(c.id) || 0;
      const percentualAtual = patrimonioTotal > 0 ? (valorAtual / patrimonioTotal) * 100 : 0;
      const objetivo = objectives[c.id] || 0;
      const pesoClasse = totalObjective > 0 ? (objetivo / totalObjective) : 0;
      let valorObjetivo = patrimonioTotal * pesoClasse;
      let diferenca = valorObjetivo - valorAtual;

      if (moeda === 'USD') {
        valorAtual = valorAtual / valorDolar;
        valorObjetivo = valorObjetivo / valorDolar;
        diferenca = diferenca / valorDolar;
      }

      return {
        ...c,
        valorAtual,
        percentualAtual,
        objetivo,
        valorObjetivo,
        diferenca,
        qtdAtivos,
        totalCotas,
      };
    });

    const validDistribution = distribuicao.filter(item => item.valorAtual > 0);

    return {
      summaryData: {
        patrimonioGlobal: moeda === 'USD' ? (patrimonioTotal + reservaTotal) / valorDolar : (patrimonioTotal + reservaTotal),
        patrimonioTotal: moeda === 'USD' ? patrimonioTotal / valorDolar : patrimonioTotal,
        rendaFixa: moeda === 'USD' ? sumRendaFixa / valorDolar : sumRendaFixa,
        variavelBR: moeda === 'USD' ? sumVariavelBR / valorDolar : sumVariavelBR,
        exterior: moeda === 'USD' ? sumExterior / valorDolar : sumExterior,
        criptomoedas: moeda === 'USD' ? sumCripto / valorDolar : sumCripto,
        valorDolar
      },
      distribuicaoData: validDistribution
    };
  }, [ativosCarteira, cotacoesData, moeda, objectives, reservaTotal]);

  const { summaryData, distribuicaoData } = dashboardData;
  const totalObjective = (Object.values(objectives) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Bento Grid: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Card - Patrimônio Global */}
        <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] p-6 lg:p-8 shadow-sm dark:shadow-lg flex flex-col justify-between relative overflow-hidden group border border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#3B82F6] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
          
          <div className="flex items-center justify-between relative z-10 mb-6">
            <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[11px] lg:text-xs uppercase tracking-wider">
              <Landmark size={16} className="text-[#64748B] dark:text-[#94A3B8]" />
              Patrimônio Global
            </div>
          </div>
          
          <div className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-white tracking-tight relative z-10">
            {formatCurrency(summaryData.patrimonioGlobal, moeda)}
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-[#94A3B8] relative z-10 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              Investimentos: <span className="text-[#0F172A] dark:text-white font-bold">{formatCurrency(summaryData.patrimonioTotal, moeda)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Reserva de Emergência: <span className="text-[#0F172A] dark:text-white font-bold">{formatCurrency(summaryData.patrimonioGlobal - summaryData.patrimonioTotal, moeda)}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#334155] grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="relative group/tooltip cursor-help w-fit flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider">
                <div className="text-[#14B8A6]">
                  <Wallet size={12} />
                </div>
                Renda Fixa
                
                <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg p-3 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mt-8 -mr-8 w-16 h-16 bg-[#3B82F6] rounded-full blur-xl opacity-20"></div>
                     <div className="relative z-10 flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Representação</span>
                       <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                         {((summaryData.rendaFixa / (summaryData.patrimonioTotal || 1)) * 100).toFixed(1).replace('.', ',')}% <span className="text-xs font-normal text-[#64748B] dark:text-[#94A3B8]">dos Investimentos</span>
                       </span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-[#0F172A] dark:text-white">
                {formatCurrency(summaryData.rendaFixa, moeda)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative group/tooltip cursor-help w-fit flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider">
                <div className="text-[#3B82F6]">
                  <TrendingUp size={12} />
                </div>
                Variável (BR)
                
                <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg p-3 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mt-8 -mr-8 w-16 h-16 bg-[#3B82F6] rounded-full blur-xl opacity-20"></div>
                     <div className="relative z-10 flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Representação</span>
                       <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                         {((summaryData.variavelBR / (summaryData.patrimonioTotal || 1)) * 100).toFixed(1).replace('.', ',')}% <span className="text-xs font-normal text-[#64748B] dark:text-[#94A3B8]">dos Investimentos</span>
                       </span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-[#0F172A] dark:text-white">
                {formatCurrency(summaryData.variavelBR, moeda)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative group/tooltip cursor-help w-fit flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider">
                <div className="text-[#F59E0B]">
                  <Globe size={12} />
                </div>
                Exterior
                
                <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg p-3 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mt-8 -mr-8 w-16 h-16 bg-[#3B82F6] rounded-full blur-xl opacity-20"></div>
                     <div className="relative z-10 flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Representação</span>
                       <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                         {((summaryData.exterior / (summaryData.patrimonioTotal || 1)) * 100).toFixed(1).replace('.', ',')}% <span className="text-xs font-normal text-[#64748B] dark:text-[#94A3B8]">dos Investimentos</span>
                       </span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-[#0F172A] dark:text-white">
                {formatCurrency(summaryData.exterior, moeda)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative group/tooltip cursor-help w-fit flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider">
                <div className="text-[#EF4444]">
                  <Bitcoin size={12} />
                </div>
                Criptomoedas
                
                <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg p-3 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mt-8 -mr-8 w-16 h-16 bg-[#3B82F6] rounded-full blur-xl opacity-20"></div>
                     <div className="relative z-10 flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Representação</span>
                       <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                         {((summaryData.criptomoedas / (summaryData.patrimonioTotal || 1)) * 100).toFixed(1).replace('.', ',')}% <span className="text-xs font-normal text-[#64748B] dark:text-[#94A3B8]">dos Investimentos</span>
                       </span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-[#0F172A] dark:text-white">
                {formatCurrency(summaryData.criptomoedas, moeda)}
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição Atual (Estilo Fundamentei com UI do Patrimônio Global) */}
        <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-[#0B0F19] rounded-[24px] p-6 lg:p-8 shadow-sm dark:shadow-lg flex flex-col relative overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B]">
          
          <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[11px] lg:text-xs uppercase tracking-wider mb-6 relative z-10">
            <PieChart size={16} className="text-[#64748B] dark:text-[#94A3B8]" />
            Diversificação por Ativos
          </div>
          
          <div className="flex flex-col gap-4 relative z-10 w-full overflow-x-auto no-scrollbar">
            <div className="min-w-[600px]">
              {distribuicaoData.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {distribuicaoData.sort((a,b) => b.percentualAtual - a.percentualAtual).map((item, index) => (
                    <div key={index} className="grid grid-cols-[150px_80px_1fr_150px_100px_120px] items-center gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }}></div>
                        <span className="font-bold text-[#0F172A] dark:text-white">{item.nome}</span>
                      </div>
                      
                      <div className="font-bold text-[#0F172A] dark:text-white">
                        {item.percentualAtual.toFixed(1).replace('.', ',')}%
                      </div>
                      
                      <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${Math.min(100, item.percentualAtual)}%`, backgroundColor: item.cor }}
                        ></div>
                      </div>
                      
                      <div className="font-bold text-[#0F172A] dark:text-white whitespace-nowrap text-right">
                        {formatCurrency(item.valorAtual, moeda)}
                      </div>
                      
                      <div className="font-bold text-[#94A3B8] whitespace-nowrap text-right">
                        <span className="text-[#0F172A] dark:text-white">{item.qtdAtivos}</span> {item.qtdAtivos === 1 ? 'ativo' : 'ativos'}
                      </div>
                      
                      <div className="font-bold text-[#94A3B8] whitespace-nowrap text-right">
                        {item.id === 'renda-fixa' ? (
                          <span>-</span>
                        ) : (
                          <><span className="text-[#0F172A] dark:text-white">{Math.floor(item.totalCotas)}</span> {['acoes-br', 'stocks-us'].includes(item.id) ? 'ações' : (item.id === 'cripto' ? 'moedas' : 'cotas')}</>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-[150px_80px_1fr_150px_100px_120px] items-center gap-4 text-sm pt-4 border-t border-[#E2E8F0] dark:border-[#334155] mt-2">
                     <div className="col-start-5 font-bold text-[#94A3B8] text-right">
                       <span className="text-[#0F172A] dark:text-white">{distribuicaoData.reduce((acc, curr) => acc + curr.qtdAtivos, 0)}</span> ativos
                     </div>
                     <div className="col-start-6 font-bold text-[#94A3B8] text-right">
                       <span className="text-[#0F172A] dark:text-white">{distribuicaoData.reduce((acc, curr) => acc + curr.totalCotas, 0).toFixed(0)}</span> totais
                     </div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-10 flex flex-col items-center justify-center text-[#94A3B8]">
                   <PieChart size={32} className="mb-2 opacity-50" />
                   <p className="font-medium text-sm text-center">Sem ativos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 
        =========================================
        Sugestão de Estrutura no Supabase
        =========================================
        
        Tabelas Necessárias:
        
        1. classe_ativos
           - id (UUID)
           - nome (ex: "FIIs Brasil", "Ações Brasil")
           - cor (ex: "#8B5CF6")
           - perfil_id (Relacionamento com profiles - permite classes personalizadas por perfil)
           - ordem (Int, para ordenar na tabela)
           
        2. configuracao_carteira (Objetivos)
           - id (UUID)
           - perfil_id (UUID)
           - classe_ativo_id (UUID)
           - percentual_objetivo (Numeric)
           
        3. ativos
           - id (UUID)
           - perfil_id (UUID)
           - classe_ativo_id (UUID)
           - ticker (ex: "HGLG11", "WEGE3")
           - nome (opcional)
           - quantidade (Numeric)
           - preco_medio (Numeric)
           - cotacao_atual (Numeric, atualizado via API/Worker ou manualmente)
           
        Cálculos Fixos:
        A tabela de "Visão Geral" deve ser gerada agrupando a tabela `ativos` por `classe_ativo_id`.
        A query consolidada puxaria: SUM(quantidade * cotacao_atual) para calcular o "Valor Atual" de cada classe.
        O "Objetivo" vem da tabela `configuracao_carteira`.
      */}
    </div>
  );
}
