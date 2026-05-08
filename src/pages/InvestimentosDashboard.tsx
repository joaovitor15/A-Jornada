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
  RefreshCw
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { supabase } from '../supabaseClient';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';

interface InvestimentosDashboardProps {
  activeProfileId?: string;
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

export function InvestimentosDashboard({ activeProfileId }: InvestimentosDashboardProps) {
  const [moeda, setMoeda] = useState<'BRL' | 'USD'>('BRL');
  
  const [ativosCarteira, setAtivosCarteira] = useState<any[]>([]);
  const { data: cotacoesData, loading: cotacoesLoading, refetch } = useCotacoesGSheets();
  const [comprasMes, setComprasMes] = useState(2); // Quantidade de classes para comprar
  const [objectives, setObjectives] = useState<Record<string, number>>(DEFAULT_OBJECTIVES);

  useEffect(() => {
    async function loadData() {
      if (!activeProfileId) return;
      // Load saved class objectives from localStorage
      const savedObjs = localStorage.getItem(`metas_classes_${activeProfileId}`);
      if (savedObjs) {
        try { setObjectives(JSON.parse(savedObjs)); } catch (e) {}
      }
      const savedCompras = localStorage.getItem(`compras_mes_dashboard_${activeProfileId}`);
      if (savedCompras) {
        try { setComprasMes(parseInt(savedCompras, 10)); } catch (e) {}
      }

      // Fetch user assets
      const { data, error } = await supabase
        .from('ativos_carteira')
        .select('*')
        .eq('profile_id', activeProfileId);
        
      if (!error && data) {
        setAtivosCarteira(data);
      }
    }
    loadData();
  }, [activeProfileId]);

  const handleObjectiveBlur = (id: string, valStr: string) => {
    let val = parseFloat(valStr.replace(',', '.')) || 0;
    const newObjs = { ...objectives, [id]: val };
    setObjectives(newObjs);
    localStorage.setItem(`metas_classes_${activeProfileId}`, JSON.stringify(newObjs));
  };

  const handleComprasMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
    setComprasMes(val);
    localStorage.setItem(`compras_mes_dashboard_${activeProfileId}`, val.toString());
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

    const distribuicao = CLASSES_DASHBOARD.map(c => {
      let valorAtual = mapClassValues.get(c.id) || 0;
      const percentualAtual = patrimonioTotal > 0 ? (valorAtual / patrimonioTotal) * 100 : 0;
      const objetivo = objectives[c.id] || 0;
      let valorObjetivo = (patrimonioTotal * objetivo) / 100;
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
      };
    });

    // Ordenar para achar os TOP COMPRAS (maior diferença positiva em relação ao objetivo)
    // Se a diferença é negativa ou 0, não precisa de compra
    const classesParaComprar = [...distribuicao]
      .filter(c => c.diferenca > 0)
      .sort((a, b) => b.diferenca - a.diferenca)
      .slice(0, comprasMes)
      .map(c => c.id);

    const tableData = distribuicao.map(item => {
      let status = 'MANTER';
      let statusColor = 'bg-slate-100 text-slate-500';

      if (classesParaComprar.includes(item.id)) {
        status = 'COMPRA';
        statusColor = 'bg-green-100 text-green-700';
      } else if (item.diferenca > 0) {
        status = 'ESPERE';
        statusColor = 'bg-amber-100 text-amber-700';
      } else {
        status = 'MANTER';
        statusColor = 'bg-slate-100 text-slate-500';
      }

      return {
        ...item,
        status,
        statusColor
      };
    });

    const validDistribution = distribuicao.filter(item => item.valorAtual > 0);

    return {
      summaryData: {
        patrimonioTotal: moeda === 'USD' ? patrimonioTotal / valorDolar : patrimonioTotal,
        rendaFixa: moeda === 'USD' ? sumRendaFixa / valorDolar : sumRendaFixa,
        variavelBR: moeda === 'USD' ? sumVariavelBR / valorDolar : sumVariavelBR,
        exterior: moeda === 'USD' ? sumExterior / valorDolar : sumExterior,
        criptomoedas: moeda === 'USD' ? sumCripto / valorDolar : sumCripto,
        valorDolar
      },
      distribuicaoData: validDistribution,
      tableData
    };
  }, [ativosCarteira, cotacoesData, moeda, comprasMes, objectives]);

  const { summaryData, distribuicaoData, tableData } = dashboardData;
  const totalObjective = (Object.values(objectives) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header e Toggle de Moeda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <PieChart className="text-[#0F172A]" size={24} />
              Visão Geral da Carteira
            </h2>
            <button 
              onClick={refetch} 
              disabled={cotacoesLoading}
              className={`p-1.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] shadow-sm ${cotacoesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={16} className={cotacoesLoading ? "animate-spin" : ""} />
            </button>
          </div>
          <p className="text-[#64748B] text-sm mt-1">Análise de Alocação e Rebalanceamento Consolidado</p>
        </div>
        
        <div className="flex gap-[10px]">
          <button
            onClick={() => setMoeda('BRL')}
            className={`flex items-center justify-center gap-2 rounded-[100px] py-[6px] px-[16px] text-[14px] font-[700] transition-all duration-200 ${
              moeda === 'BRL'
                ? "bg-[#DCFCE7] text-[#16A34A] border-[1.5px] border-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.2)]"
                : "bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            R$ BRL
          </button>
          <button
            onClick={() => setMoeda('USD')}
            className={`flex items-center justify-center gap-2 rounded-[100px] py-[6px] px-[16px] text-[14px] font-[700] transition-all duration-200 ${
              moeda === 'USD'
                ? "bg-[#FEE2E2] text-[#EF4444] border-[1.5px] border-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.2)]"
                : "bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1 - Patrimônio Total */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B82F6]"></div>
          <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[11px] uppercase tracking-wider mb-2">
            <Building2 size={14} />
            Patrimônio Total
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {formatCurrency(summaryData.patrimonioTotal, moeda)}
          </div>
        </div>

        {/* Card 2 - Renda Fixa */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#14B8A6]"></div>
          <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[11px] uppercase tracking-wider mb-2">
            <Wallet size={14} />
            Renda Fixa
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {formatCurrency(summaryData.rendaFixa, moeda)}
          </div>
        </div>

        {/* Card 3 - Variável (BR) */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8B5CF6]"></div>
          <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[11px] uppercase tracking-wider mb-2">
            <TrendingUp size={14} />
            Variável (BR)
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {formatCurrency(summaryData.variavelBR, moeda)}
          </div>
        </div>

        {/* Card 4 - Exterior */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F59E0B]"></div>
          <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[11px] uppercase tracking-wider mb-2">
            <Globe size={14} />
            Exterior
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {formatCurrency(summaryData.exterior, moeda)}
          </div>
        </div>

        {/* Card 5 - Criptomoedas */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EF4444]"></div>
          <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[11px] uppercase tracking-wider mb-2">
            <Bitcoin size={14} />
            Criptomoedas
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {formatCurrency(summaryData.criptomoedas, moeda)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição Atual */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 lg:col-span-1 flex flex-col">
          <h3 className="font-bold text-[#0F172A] flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-[#64748B]" />
            Distribuição Atual
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-full h-64 relative">
              {distribuicaoData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={distribuicaoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="valorAtual"
                      nameKey="nome"
                      stroke="none"
                    >
                      {distribuicaoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value, moeda), name]}
                      separator=": "
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8]">
                   <PieChart size={32} className="mb-2 opacity-50" />
                   <p className="font-medium text-sm">Sem ativos com saldo</p>
                </div>
              )}
            </div>

            {/* Legendas Personalizadas */}
            <div className="w-full mt-4 flex flex-col gap-2">
              {distribuicaoData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                    <span className="font-medium text-[#475569]">{item.nome}</span>
                  </div>
                  <span className="font-bold text-[#0F172A]">{item.percentualAtual.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Rebalanceamento */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 min-w-[600px]">
             <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
               <SlidersHorizontal size={18} className="text-[#64748B]" />
               Rebalanceamento
             </h3>
             <div className="flex items-center gap-3">
               <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-sm font-bold text-[#475569] flex items-center gap-2">
                 <span>COMPRAS MÊS:</span>
                 <input
                   type="text"
                   value={comprasMes}
                   onChange={handleComprasMesChange}
                   className="w-10 bg-transparent border-b border-[#CBD5E1] text-[#2563EB] font-black outline-none text-center focus:border-[#2563EB]"
                 />
               </div>
               <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${totalObjective === 100 ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                 Total: {totalObjective}% {totalObjective === 100 ? '✓' : '⚠️'}
               </div>
             </div>
          </div>

          <div className="min-w-[600px]">
            {/* Header da Tabela */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#E2E8F0] mb-4 text-[10px] font-[800] text-[#94A3B8] uppercase tracking-wider">
              <div className="col-span-3">Classe de Ativo</div>
              <div className="col-span-3">Valor Atual</div>
              <div className="col-span-2 text-center">Objetivo %</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Falta Aportar</div>
            </div>

            {/* Linhas da Tabela */}
            <div className="space-y-4">
              {tableData.map((row, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: row.cor }}></div>
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">{row.nome}</p>
                      <p className="text-xs text-[#64748B]">Atual: {row.percentualAtual.toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <p className="font-bold text-[#0F172A] text-sm">{formatCurrency(row.valorAtual, moeda)}</p>
                  </div>
                  
                  <div className="col-span-2 pl-2 flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <input
                        type="text"
                        defaultValue={row.objetivo}
                        onBlur={(e) => handleObjectiveBlur(row.id, e.target.value)}
                        className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-1 py-0.5 text-xs font-bold text-[#0F172A] text-center w-12 outline-none focus:border-[#2563EB]"
                      />
                      <span className="text-[#94A3B8] text-xs font-bold">%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full" 
                         style={{ 
                           width: `${Math.min(row.objetivo, 100)}%`, 
                           backgroundColor: row.cor 
                         }}
                       ></div>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${row.statusColor}`}>
                      {row.status}
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    {row.status === 'COMPRA' && row.diferenca > 0 ? (
                      <span className="font-bold text-[#16A34A] text-sm">+ {formatCurrency(row.diferenca, moeda)}</span>
                    ) : (
                      <span className="text-[#94A3B8] font-bold">-</span>
                    )}
                  </div>
                </div>
              ))}
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
