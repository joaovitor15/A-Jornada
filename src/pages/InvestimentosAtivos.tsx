import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark,
  Building2, 
  TrendingUp, 
  Globe, 
  Bitcoin, 
  Wallet,
  Activity,
  Plus,
  ShoppingCart,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp as GraphIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ArrowRight,
  SlidersHorizontal,
  PieChart,
  Target,
  Settings,
  ArrowRightLeft, ArrowUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';
import { supabase } from '../supabaseClient';

import { InvestimentosDashboard } from './InvestimentosDashboard';
import { InvestimentosMetas } from './InvestimentosMetas';
import { ConfiguracaoMetasInline } from '../components/ConfiguracaoMetasInline';

interface InvestimentosAtivosProps {
  activeProfileId?: string;
  activeProfile?: any;
  updateProfileModules?: (id: string, modules: any) => Promise<{ error: any }>;
}

const CLASSES_ATIVOS_OPCOES = [
  { id: 'renda-fixa', nome: 'Renda Fixa', icone: ShieldCheck, cor: '#10B981' },
  { id: 'acoes-br', nome: 'Ações Brasil', icone: GraphIcon, cor: '#3B82F6' },
  { id: 'fiis', nome: 'FIIs', icone: Building2, cor: '#8B5CF6' },
  { id: 'stocks-us', nome: 'Stocks', icone: Globe, cor: '#0EA5E9' },
  { id: 'reits-us', nome: 'REITs', icone: Wallet, cor: '#14B8A6' },
  { id: 'etfs-us', nome: 'ETF USA', icone: TrendingUp, cor: '#F59E0B' },
  { id: 'cripto', nome: 'Criptomoedas', icone: Bitcoin, cor: '#F59E0B' },
];

const getCategoriaProps = (id: string) => {
  return CLASSES_ATIVOS_OPCOES.find(c => c.id === id) || { id: 'outros', nome: 'Outros', icone: Activity, cor: '#64748B' };
}

const formatCurrency = (value: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(value);
};

const formatPercent = (value: number) => {
  return (value || 0).toFixed(1).replace('.', ',') + '%';
};

const formatQuantity = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8 }).format(value);
};


const CustomDropdown = ({ value, onChange, options, placeholder = "Selecione..." }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-4 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white font-medium outline-none transition-colors shadow-sm cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 text-[#64748B] dark:text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-[999] w-full mt-2 bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] overflow-y-auto max-h-60 flex flex-col py-1.5">
          {options.map(opt => {
            const isSelected = value === opt.value;
            return (
              <div 
                key={opt.value}
                className={`px-4 py-2 cursor-pointer text-[#0F172A] dark:text-[#E2E8F0] font-medium transition-all text-sm
                  ${isSelected 
                    ? 'bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/5 text-[#2563EB] dark:text-[#3B82F6] dark:from-[#3B82F6]/20 dark:to-[#60A5FA]/10' 
                    : 'hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
                  }
                `}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function InvestimentosAtivos({ activeProfileId, activeProfile, updateProfileModules }: InvestimentosAtivosProps) {
  const { data: cotacoesData, loading: cotacoesLoading, error: cotacoesError, refetch, addTickerSync, deleteTickerSync } = useCotacoesGSheets();
  
  // Local state for the user's portfolio holding via Supabase
  const [meusAtivosPersistidos, setMeusAtivosPersistidos] = useState<any[]>([]);
  const [isLoadingAtivos, setIsLoadingAtivos] = useState(true);
  const [dashboardMetas, setDashboardMetas] = useState<Record<string, number>>({});

  // Load ativos from Supabase
  useEffect(() => {
    async function loadAtivos() {
      if (!activeProfileId) return;
      
      // Load Metas do Profile
      const metas = activeProfile?.dashboard_metas_classes ?? { 'fiis': 30, 'acoes-br': 30, 'stocks-us': 15, 'reits-us': 10, 'etfs-us': 5, 'renda-fixa': 10, 'cripto': 0 };
      setDashboardMetas(metas);

      try {
        const { data, error } = await supabase
          .from('ativos_carteira')
          .select('*')
          .eq('profile_id', activeProfileId);
          
        if (error) throw error;
        setMeusAtivosPersistidos(data || []);
      } catch (err) {
        console.error('Erro ao carregar ativos:', err);
      } finally {
        setIsLoadingAtivos(false);
      }

      // Nao precisa mais load Compras Mes por Classe
    }
    loadAtivos();
  }, [activeProfileId, activeProfile]);

  const handleObjectiveChange = (id: string, valStr: string) => {
    let val = parseFloat(valStr.replace(',', '.')) || 0;
    const newObjs = { ...dashboardMetas, [id]: val };
    setDashboardMetas(newObjs);
  };

  const handleObjectiveSave = async (id: string, valStr: string) => {
    let val = parseFloat(valStr.replace(',', '.')) || 0;
    const newObjs = { ...dashboardMetas, [id]: val };
    if (activeProfileId) {
      try {
        await supabase
          .from('profiles')
          .update({ dashboard_metas_classes: newObjs })
          .eq('id', activeProfileId);
      } catch (err) {
        console.error('Erro ao atualizar metas', err);
      }
    }
  };

  // Modal Novo Ativo state
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'posicoes' | 'metas' | 'configurações'>('visao_geral');
  const [isOpenObjetivos, setIsOpenObjetivos] = useState(false);
  const [totalFormat, setTotalFormat] = useState<'financeiro' | 'porcentagem' | 'quantidade' | 'distancia'>('financeiro');
  const [moeda, setMoeda] = useState<'BRL' | 'USD'>('BRL');
  const [searchTicker, setSearchTicker] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection(column === 'total' ? 'asc' : 'desc');
    }
  };
  const [filterClasse, setFilterClasse] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novoAtivo, setNovoAtivo] = useState({ classe: 'acoes-br', ticker: '', qtd: '' });

  // Nova Ordem Modal state
  const [isOrdemModalOpen, setIsOrdemModalOpen] = useState(false);
  const [ordemType, setOrdemType] = useState<'compra' | 'venda' | 'ajuste'>('compra');
  const [ordemClasse, setOrdemClasse] = useState('todas');
  const [ordemAtivoId, setOrdemAtivoId] = useState('');
  const [ordemQtd, setOrdemQtd] = useState('');

  const inputNovoAtivoQtdRef = React.useRef<HTMLInputElement>(null);
  const inputOrdemQtdRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNovoAtivoQtdRef.current) {
      const length = inputNovoAtivoQtdRef.current.value.length;
      inputNovoAtivoQtdRef.current.setSelectionRange(length, length);
    }
  }, [novoAtivo.qtd]);

  useEffect(() => {
    if (inputOrdemQtdRef.current) {
      const length = inputOrdemQtdRef.current.value.length;
      inputOrdemQtdRef.current.setSelectionRange(length, length);
    }
  }, [ordemQtd]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setTimeout(() => {
      const length = target.value.length;
      target.setSelectionRange(length, length);
    }, 50);
  };

  const handleSaveNovoAtivo = async () => {
    if (!novoAtivo.ticker || !activeProfileId) return;
    setIsSubmitting(true);

    let rawTicker = novoAtivo.ticker.toUpperCase().trim();
    let formattedTicker = rawTicker;

    // Formatar Ticker de acordo com o que o Google Finance aceita 
    if (novoAtivo.classe === 'acoes-br' || novoAtivo.classe === 'fiis') {
      if (!formattedTicker.startsWith('BVMF:')) formattedTicker = `BVMF:${formattedTicker}`;
    } else if (novoAtivo.classe === 'renda-fixa') {
      // Renda Fixa não precisa da bolsa. Vamos adicionar um prefixo interno
      formattedTicker = `RENDA-FIXA:${formattedTicker}`;
    } else if (novoAtivo.classe === 'cripto') {
      // Para cripto, formato exato como do backend do App Script: adiciona apenas BRL
      if (formattedTicker.toUpperCase() === 'BTC') formattedTicker = 'BTCBRL';
      else if (formattedTicker.toUpperCase() === 'ETH') formattedTicker = 'ETHBRL';
      else if (!formattedTicker.includes(':') && !formattedTicker.toUpperCase().endsWith('BRL') && !formattedTicker.toUpperCase().endsWith('USD')) {
        formattedTicker = `${formattedTicker.toUpperCase()}BRL`;
      }
    }

    // Acionar a sincronização com o Google Sheets APENAS SE não for renda fixa
    if (novoAtivo.classe !== 'renda-fixa') {
      try {
        await addTickerSync(formattedTicker);
      } catch (err) {
        console.error("Erro no Sync", err);
      }
    }
    
    // Garantir que a taxa de conversão do dollar do EUA existirá se comprou ativo dolarizado
    if (['stocks-us', 'reits-us', 'etfs-us'].includes(novoAtivo.classe)) {
      setTimeout(() => addTickerSync("CURRENCY:USDBRL"), 1500); // Executa no background com delay
    }

    // Salvar no Supabase
    try {
      const rawQtd = novoAtivo.qtd || '0';
      let parsedQtd = 0;
      
      if (novoAtivo.classe === 'renda-fixa') {
        // Renda fixa is always formatted as 1.234,56
        parsedQtd = parseFloat(rawQtd.replace(/\./g, '').replace(',', '.')) || 0;
      } else {
        // For others, identify if it's using comma or dot as decimal
        // If it has both, comma is almost certainly decimal in Brazil (1.500,00)
        // If it has only one, and it's a dot, it might be US format (1.5)
        const hasComma = rawQtd.includes(',');
        const hasDot = rawQtd.includes('.');
        
        if (hasComma && hasDot) {
          parsedQtd = parseFloat(rawQtd.replace(/\./g, '').replace(',', '.')) || 0;
        } else if (hasComma) {
          parsedQtd = parseFloat(rawQtd.replace(',', '.')) || 0;
        } else {
          parsedQtd = parseFloat(rawQtd) || 0;
        }
      }

      const dbAtivo = {
        profile_id: activeProfileId,
        classe: novoAtivo.classe,
        ticker_original: rawTicker,
        ticker_google: formattedTicker,
        qtd: parsedQtd,
        objetivo: 0
      };

      const { data, error } = await supabase
        .from('ativos_carteira')
        .insert(dbAtivo)
        .select()
        .single();

      if (error) throw error;
      setMeusAtivosPersistidos(prev => [...prev, data]);
    } catch (err) {
      console.error('Erro ao salvar ativo:', err);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNovoAtivo({ classe: 'acoes-br', ticker: '', qtd: '' });
    }
  };

  const deleteAtivo = async (id: string) => {
    const ativo = meusAtivosPersistidos.find(a => a.id === id);
    if (ativo) {
       try {
         const { error } = await supabase.from('ativos_carteira').delete().eq('id', id);
         if (error) throw error;
         setMeusAtivosPersistidos(prev => prev.filter(a => a.id !== id));
         await deleteTickerSync(ativo.ticker_google);
       } catch (err) {
         console.error('Erro ao deletar ativo:', err);
       }
    }
  };

  const handleObjetivoChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setMeusAtivosPersistidos(prev => prev.map(a => a.id === id ? { ...a, objetivo: num } : a));
  };

  const handleObjetivoBlur = async (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    try {
      const { error } = await supabase.from('ativos_carteira').update({ objetivo: num }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar objetivo', err);
    }
  };

  const handleOpenOrdemModal = (ativoId?: string) => {
    setOrdemType('compra');
    setOrdemQtd('');
    if (ativoId) {
      const ativo = meusAtivosPersistidos.find(a => a.id === ativoId);
      if (ativo) {
        setOrdemClasse(ativo.classe);
        setOrdemAtivoId(ativoId);
      }
    } else {
      setOrdemClasse('todas');
      setOrdemAtivoId('');
    }
    setIsOrdemModalOpen(true);
  };

  const handleSaveOrdem = async () => {
    if (!ordemAtivoId || !ordemQtd || !activeProfileId) return;
    
    const ativo = meusAtivosPersistidos.find(a => a.id === ordemAtivoId);
    if (!ativo) return;

    setIsSubmitting(true);
    try {
      const parsedQtdForOrdem = parseFloat(
        ordemClasse === 'renda-fixa'
          ? ordemQtd.replace(/\./g, '').replace(',', '.')
          : ordemQtd.replace(',', '.')
      ) || 0;
      let newQtd = ativo.qtd;
      if (ordemType === 'compra') newQtd += parsedQtdForOrdem;
      else if (ordemType === 'venda') newQtd -= parsedQtdForOrdem;
      else if (ordemType === 'ajuste') newQtd = parsedQtdForOrdem;
      
      const { error } = await supabase
        .from('ativos_carteira')
        .update({ qtd: newQtd })
        .eq('id', ordemAtivoId);
        
      if (error) throw error;
      
      setMeusAtivosPersistidos(prev => prev.map(a => a.id === ordemAtivoId ? { ...a, qtd: newQtd } : a));
      setIsOrdemModalOpen(false);
      setOrdemAtivoId('');
      setOrdemQtd('');
      setOrdemClasse('todas');
      setOrdemType('compra');
    } catch (err) {
      console.error('Erro ao salvar ordem:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAtivoForOrdem = meusAtivosPersistidos.find(a => a.id === ordemAtivoId);
  const currentQtdForOrdem = currentAtivoForOrdem?.qtd || 0;
  const parsedQtdForOrdem = parseFloat(
    ordemClasse === 'renda-fixa'
      ? ordemQtd.replace(/\./g, '').replace(',', '.')
      : ordemQtd.replace(',', '.')
  ) || 0;
  const newQtdForOrdem = ordemType === 'compra' ? currentQtdForOrdem + parsedQtdForOrdem : (ordemType === 'venda' ? currentQtdForOrdem - parsedQtdForOrdem : parsedQtdForOrdem);

  const ativosForOrdem = meusAtivosPersistidos
    .filter(a => (ordemClasse === 'todas' ? a.classe !== 'renda-fixa' : a.classe === ordemClasse))
    .sort((a, b) => a.ticker_original.localeCompare(b.ticker_original));

  const dynamicClassesData = useMemo(() => {
    // 1. Acha a cotação do Dolar pra BRL para converter os ativos de EUA!
    const quoteDolarObj = cotacoesData.find(c => c.TICKER === 'CURRENCY:USDBRL');
    const valorDolar = quoteDolarObj ? (typeof quoteDolarObj.ULTIMA_COTACAO === 'number' ? quoteDolarObj.ULTIMA_COTACAO : parseFloat(String(quoteDolarObj.ULTIMA_COTACAO).replace(',', '.'))) : 1;

    // 2. Agrupa os itens do PORTFÓLIO por categoria e calcula patrimônio total
    const groupedMap = new Map<string, any>();
    let patrimonioTotal = 0;

    meusAtivosPersistidos.forEach(ativoInfo => {
      const cat = getCategoriaProps(ativoInfo.classe);
      if (!groupedMap.has(cat.id)) {
        groupedMap.set(cat.id, {
          ...cat,
          valorTotal: 0,
          metaAtingida: 0,
          totalCotas: 0,
          ativos: []
        });
      }

      const group = groupedMap.get(cat.id);
      
      const quoteObj = cotacoesData.find(c => 
        c.TICKER === ativoInfo.ticker_google || 
        c.TICKER === ativoInfo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === 'CURRENCY:' + ativoInfo.ticker_original.toUpperCase() + 'BRL' ||
        c.TICKER === ativoInfo.ticker_original.toUpperCase()
      );
      
      let price = 0;
      let hasValidQuote = false;
      let syncStatus = 'sincronizando_pendente'; 

      if (quoteObj) {
        if (quoteObj.ULTIMA_COTACAO !== '#N/A' && quoteObj.ULTIMA_COTACAO !== '') {
          price = typeof quoteObj.ULTIMA_COTACAO === 'number' 
            ? quoteObj.ULTIMA_COTACAO 
            : parseFloat(String(quoteObj.ULTIMA_COTACAO).replace(',', '.')) || 0;
          
          hasValidQuote = true;
          syncStatus = 'ok';
        } else {
          syncStatus = 'aguardando_google';
        }
      }

      if (ativoInfo.classe === 'renda-fixa') {
        price = 1; 
        hasValidQuote = true;
      }

      if (['stocks-us', 'reits-us', 'etfs-us'].includes(ativoInfo.classe) && price > 0) {
         if (moeda === 'BRL') {
           price = price * valorDolar;
         }
      } else if (price > 0 && moeda === 'USD') {
         price = price / valorDolar;
      }

      const assetTotal = price * ativoInfo.qtd;
      const isSyncing = !hasValidQuote && ativoInfo.classe !== 'renda-fixa';
      
      patrimonioTotal += assetTotal;

      group.ativos.push({
        id: ativoInfo.id,
        ticker: ativoInfo.ticker_original,
        tickerGoogle: ativoInfo.ticker_google,
        qtd: ativoInfo.qtd,
        cotacao: price,
        total: assetTotal,
        objetivo: ativoInfo.objetivo,
        isSyncing,
        syncStatus,
        status: 'MONITORANDO',
        statusColor: 'bg-blue-50 text-blue-700',
        diferenca: 0,
        percentualAtual: 0
      });

      group.valorTotal += assetTotal;
      group.totalCotas += ativoInfo.qtd;
      group.metaAtingida += ativoInfo.objetivo;
    });

    // 3. Descobrir quais CLASSES estão em 'COMPRA' com base nas metas
    const somaNotasClasses = CLASSES_ATIVOS_OPCOES.reduce((acc, c) => acc + (dashboardMetas[c.id] || 0), 0);
    
    const classesDiferenca = CLASSES_ATIVOS_OPCOES.map(c => {
      const valorAtual = groupedMap.get(c.id)?.valorTotal || 0;
      const objetivo = dashboardMetas[c.id] || 0;
      const pesoClasse = somaNotasClasses > 0 ? (objetivo / somaNotasClasses) : 0;
      const valorObjetivo = patrimonioTotal * pesoClasse;
      const diferenca = valorObjetivo - valorAtual;
      
      const percentualAtual = patrimonioTotal > 0 ? (valorAtual / patrimonioTotal) * 100 : 0;
      
      let status = 'MANTER';
      let statusColor = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
      if (diferenca > 0) {
         status = 'COMPRA';
         statusColor = 'bg-green-100 text-green-700';
      }

      return { 
        id: c.id, 
        nome: c.nome,
        cor: c.cor,
        diferenca, 
        valorObjetivo, 
        valorAtual, 
        objetivo,
        percentualAtual,
        status,
        statusColor
      };
    });

    // 4. Calcular o rebalanceamento interno DENTRO de cada Classe
    groupedMap.forEach(group => {
      const classInfo = classesDiferenca.find(c => c.id === group.id);
      const globalClassDiferenca = classInfo?.diferenca || 0;
      const classIsCompra = globalClassDiferenca > 0;
      
      const targetClassTotal = classIsCompra 
        ? group.valorTotal + globalClassDiferenca 
        : group.valorTotal;

      // SOMA DAS NOTAS/PESOS DA CLASSE
      const somaPesos = group.ativos.reduce((acc: number, ativo: any) => acc + (ativo.objetivo || 0), 0);

      group.ativos.forEach((ativo: any) => {
        ativo.percentualAtualGlobal = patrimonioTotal > 0 ? (ativo.total / patrimonioTotal) * 100 : 0;
        
        // Pesos Globais (Lógica Fundamentei/myProfit)
        const pesoNaClasse = somaPesos > 0 ? (ativo.objetivo / somaPesos) : 0;
        const notaClasse = dashboardMetas[group.id] || 0;
        const pesoClasseGlobal = somaNotasClasses > 0 ? (notaClasse / somaNotasClasses) : 0;
        
        // Percentual Ideal na Carteira Toda
        const percentualIdealGlobal = pesoClasseGlobal * pesoNaClasse;
        
        // Alvo Financeiro Global do Ativo
        const valorObjetivoGlobal = patrimonioTotal * percentualIdealGlobal;
        
        // Diferença Financeira Global (Atual - Alvo). Negativo = Falta comprar, Positivo = Passou
        ativo.diferenca = ativo.total - valorObjetivoGlobal;

        // Diferença em Porcentagem Global (Atual % - Ideal %)
        ativo.diferencaPorcentagem = ativo.percentualAtualGlobal - (percentualIdealGlobal * 100);
        ativo.percentualIdeal = percentualIdealGlobal * 100;
      });

      group.ativos.forEach((ativo: any) => {
        if (ativo.diferenca < 0) {
          ativo.status = 'COMPRA';
          ativo.statusColor = 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
        } else {
          ativo.status = 'MANTER';
          ativo.statusColor = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
        }
      });
      
      group.classIsCompra = classIsCompra;
    });

    return {
      classesForAccordion: Array.from(groupedMap.values()).sort((a, b) => {
        const indexA = CLASSES_ATIVOS_OPCOES.findIndex(c => c.id === a.id);
        const indexB = CLASSES_ATIVOS_OPCOES.findIndex(c => c.id === b.id);
        return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999);
      }),
      classesParaCard: classesDiferenca
    };
  }, [cotacoesData, meusAtivosPersistidos, activeProfileId, activeProfile, dashboardMetas]);

  const displayData = dynamicClassesData.classesForAccordion;
  const cardData = dynamicClassesData.classesParaCard;
  
  const totalObjective = (Object.values(dashboardMetas) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

  const allAtivos = useMemo(() => {
    return displayData.flatMap(classe => 
      classe.ativos.map((ativo: any) => ({
        ...ativo,
        classeId: classe.id,
        classeNome: classe.nome,
        classeCor: classe.cor
      }))
    ).sort((a, b) => b.total - a.total);
  }, [displayData]);

  const filteredAtivos = useMemo(() => {
    let result = allAtivos.filter(ativo => {
      const matchesSearch = searchTicker === '' || ativo.ticker.toLowerCase().includes(searchTicker.toLowerCase());
      const matchesClasse = filterClasse === 'todas' || ativo.classeId === filterClasse;
      return matchesSearch && matchesClasse;
    });

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let valA, valB;
        if (sortColumn === 'nome') {
          valA = a.ticker.toLowerCase();
          valB = b.ticker.toLowerCase();
        } else if (sortColumn === 'cotacao') {
          valA = a.cotacao || 0;
          valB = b.cotacao || 0;
        } else if (sortColumn === 'patrimonio') {
          valA = a.total || 0;
          valB = b.total || 0;
        } else if (sortColumn === 'total') {
          valA = a.diferenca || 0;
          valB = b.diferenca || 0;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [allAtivos, searchTicker, filterClasse, sortColumn, sortDirection]);

  const renderDiferenca = (ativo: any) => {
    const dif = ativo.diferenca || 0; // Negativo = Falta Comprar (Comprar), Positivo = Passou (Aguardar)
    const isPositive = dif >= 0; // Se passou ou está na meta
    const absDif = Math.abs(dif);

    if (totalFormat === 'financeiro') {
      if (isPositive) return '—';
      return formatCurrency(absDif, moeda);
    }
    
    if (totalFormat === 'porcentagem') {
      const pctDiff = ativo.diferencaPorcentagem || 0;
      const pctPrefix = pctDiff > 0 ? '+' : '';
      return pctPrefix + Math.abs(pctDiff).toFixed(1).replace('.', ',') + '%';
    }
    
    if (totalFormat === 'quantidade') {
      if (isPositive) return '—';
      if (ativo.classeId === 'renda-fixa') {
        return formatCurrency(absDif, moeda);
      }
      const cotacao = ativo.cotacao || 1;
      const qtyDiff = Math.trunc(dif / cotacao);
      return formatQuantity(Math.abs(qtyDiff));
    }
    
    if (totalFormat === 'distancia') {
      const targetValue = ativo.total - dif;
      if (targetValue === 0) return '0.00%';
      if (ativo.total === 0) return '-100.00%';
      const dist = (dif / targetValue) * 100;
      const distPrefix = dist > 0 ? '+' : '';
      return distPrefix + Math.abs(dist).toFixed(2) + '%';
    }
    
    if (isPositive) return '—';
    return formatCurrency(absDif, moeda);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header and Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <Landmark className="text-[#0F172A] dark:text-white" size={28} strokeWidth={2.5} />
              Meus Investimentos
            </h2>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {(activeTab === 'visao_geral' || activeTab === 'posicoes') && (
              <div className="flex gap-2">
                <div className="inline-flex bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-full shrink-0">
                <button 
                  onClick={() => setMoeda('BRL')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    moeda === 'BRL'
                      ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm border border-[#E2E8F0] dark:border-[#1E293B]' 
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white border border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  BRL
                </button>
                <button 
                  onClick={() => setMoeda('USD')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    moeda === 'USD'
                      ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm border border-[#E2E8F0] dark:border-[#1E293B]' 
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white border border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  USD
                </button>
              </div>
              </div>
            )}
            <div className="flex bg-[#F1F5F9] dark:bg-[#0F172A] rounded-2xl p-1.5 shrink-0">
              <button 
                onClick={() => refetch(true)} 
                disabled={cotacoesLoading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B] ${cotacoesLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={16} className={cotacoesLoading ? 'animate-spin' : ''} />
                {cotacoesLoading ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        {!isLoadingAtivos && displayData.length > 0 && (
          <div className="flex gap-2 self-start flex-wrap">
            {[
              { id: 'visao_geral', label: 'Investimentos', icon: PieChart },
              { id: 'posicoes', label: 'Posições', icon: SlidersHorizontal },
              { id: 'metas', label: 'Metas', icon: Target },
              { id: 'configurações', label: 'Configurações', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                    : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <tab.icon size={16} strokeWidth={2.5} />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error and Sync Controls */}
      {cotacoesError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Erro ao carregar cotações</h4>
            <p className="text-sm mt-1">{cotacoesError}</p>
          </div>
        </div>
      )}

      {isLoadingAtivos && (
        <div className="flex flex-col items-center justify-center py-20 text-[#64748B] dark:text-[#94A3B8]">
          <RefreshCw size={32} className="animate-spin mb-4 text-[#3B82F6]" />
          <p className="font-medium">Carregando seus ativos...</p>
        </div>
      )}

      {cotacoesLoading && !isLoadingAtivos && displayData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#64748B] dark:text-[#94A3B8]">
          <RefreshCw size={32} className="animate-spin mb-4 text-[#3B82F6]" />
          <p className="font-medium">Sincronizando cotações do Google Sheets...</p>
        </div>
      )}

      {!cotacoesLoading && !isLoadingAtivos && displayData.length === 0 && !cotacoesError && (
        <div className="bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] p-12 text-center shadow-sm dark:shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2563EB] rounded-full blur-3xl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"></div>
           <div className="mb-6 text-[#3B82F6] relative z-10">
             <Landmark size={48} strokeWidth={1.5} />
           </div>
           <h3 className="text-2xl font-black text-[#0F172A] dark:text-white mb-3 tracking-tight relative z-10">Nenhum ativo na carteira</h3>
           <p className="max-w-md mx-auto mb-8 text-[#64748B] dark:text-[#94A3B8] relative z-10 leading-relaxed">
             Sua carteira de investimentos está vazia. Comece adicionando o seu primeiro ativo para acompanhar a sua distribuição e cotações.
           </p>
           <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-salvar flex-1"
            >
              
              <span className="relative z-10 flex items-center gap-2"><Plus size={18} strokeWidth={3} /> Adicionar Primeiro Ativo</span>
           </button>
        </div>
      )}



      {/* Visão Geral Tab */}
      {activeTab === 'visao_geral' && (
        <InvestimentosDashboard 
          activeProfileId={activeProfileId} 
          activeProfile={activeProfile} 
          updateProfileModules={updateProfileModules} 
          moeda={moeda}
          setMoeda={setMoeda}
        />
      )}

      {/* Metas Tab */}
      {activeTab === 'metas' && (
        <InvestimentosMetas activeProfileId={activeProfileId} />
      )}

      {/* Configurações Tab */}
      {activeTab === 'configurações' && !isLoadingAtivos && displayData.length > 0 && (
        <div className="space-y-6">
          

          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm dark:shadow-lg p-[20px] md:p-6 lg:p-8 overflow-hidden flex flex-col relative group">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#3B82F6] rounded-full blur-3xl opacity-[0.10] group-hover:opacity-[0.15] dark:opacity-[0.10] dark:group-hover:opacity-[0.15] transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <h3 className="font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                   <PieChart size={18} className="text-[#3B82F6]" />
                   Objetivos da Carteira
                 </h3>
                 <button 
                   onClick={() => setIsOpenObjetivos(!isOpenObjetivos)}
                   className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] text-[#0F172A] dark:text-white px-3 py-2 md:px-4 rounded-xl text-sm font-medium transition-colors shadow-sm"
                 >
                   <Settings size={16} className="text-[#3B82F6]" />
                   <span className="hidden md:inline">{isOpenObjetivos ? 'Cancelar' : 'Editar Objetivos'}</span>
                 </button>
               </div>
               
               <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                 Configure as metas ideais para a distribuição do seu patrimônio.
               </p>
               
               {isOpenObjetivos && (
                 <div className="mt-2 flex">
                   <div className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-bold text-center border ${totalObjective === 100 ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800 text-red-700 dark:text-red-400'}`}>
                     Total: {totalObjective}% {totalObjective !== 100 && '(Ajuste para 100%)'}
                   </div>
                 </div>
               )}
            </div>

            <AnimatePresence>
              {isOpenObjetivos && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden relative z-10"
                >
                  <div className="space-y-6 md:space-y-8 mt-8">
                    {cardData.map((row, index) => (
                       <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                         <div className="flex items-center gap-3 w-40 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: row.cor}}></div>
                            <span className="font-bold text-[#0F172A] dark:text-white text-sm">{row.nome}</span>
                         </div>
                         
                         <div className="flex items-center gap-4 flex-1">
                           <div className="bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#334155] rounded-lg px-3 py-1.5 w-16 text-center shrink-0 shadow-sm">
                             <span className="font-bold text-sm text-[#0F172A] dark:text-white">{row.objetivo}%</span>
                           </div>
                           
                           <input 
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={row.objetivo}
                              onChange={(e) => handleObjectiveChange(row.id, e.target.value)}
                              onMouseUp={(e) => handleObjectiveSave(row.id, e.currentTarget.value)}
                              onTouchEnd={(e) => handleObjectiveSave(row.id, e.currentTarget.value)}
                              className="w-full h-1.5 bg-[#E2E8F0] dark:bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                           />
                         </div>
                       </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <ConfiguracaoMetasInline activeProfileId={activeProfileId} />
        </div>
      )}

      {/* Lista de Ativos Plana (Estilo Fundamentei) */}
      {activeTab === 'posicoes' && !isLoadingAtivos && (
        <div className="bg-white dark:bg-[#0B0F19] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-visible p-[20px] md:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 relative z-20">
            <div className="relative w-full sm:flex-1">
              <input 
                type="text" 
                placeholder="Nome Ativo" 
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                autoComplete="off"
                className="w-full border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-4 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white font-medium outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] transition-colors shadow-sm dark:[color-scheme:dark]"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <div className="relative z-[60]">
                <CustomDropdown 
                  value={filterClasse}
                  onChange={(val) => setFilterClasse(val)}
                  options={[
                    { value: 'todas', label: filterClasse === 'todas' ? 'Filtre por classe' : 'Remover filtro' },
                    ...CLASSES_ATIVOS_OPCOES.map(opt => ({ value: opt.id, label: opt.nome }))
                  ]}
                />
              </div>
            </div>
            <div className="w-full sm:w-[200px]">
              <div className="relative z-[55]">
                <CustomDropdown 
                  value={totalFormat}
                  onChange={(val) => setTotalFormat(val as any)}
                  options={[
                    { value: 'porcentagem', label: 'Total em (%)' },
                    { value: 'financeiro', label: 'Total em (R$)' },
                    { value: 'quantidade', label: 'Total em Qtd' },
                    { value: 'distancia', label: 'Distância %' }
                  ]}
                />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <button 
                onClick={() => { setNovoAtivo({ classe: "acoes-br", ticker: "", qtd: "" }); setIsModalOpen(true); }}
                className="flex items-center justify-center gap-0 md:gap-[8px] border border-[#E2E8F0] dark:border-[#1E293B] bg-transparent dark:bg-transparent text-[#2563EB] dark:text-[#3B82F6] hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] rounded-[100px] w-full md:w-auto h-[44px] md:h-auto px-[22px] py-[10px] font-bold text-[14px] shadow-sm transition-all group cursor-pointer"
              >
                <Plus size={20} strokeWidth={3} className="md:w-[15px] md:h-[15px] transition-transform group-hover:scale-110 mr-1 md:mr-0" />
                <span className="uppercase">Novo Ativo</span>
              </button>
            </div>
          </div>
          
          {filteredAtivos.length > 0 ? (
          <>
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-col w-full overflow-x-auto">
              <div className="min-w-[800px] pb-2">
                <div className="grid grid-cols-[1.2fr_0.95fr_1fr_1.1fr_0.8fr_1.2fr_70px] gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-3 text-[11px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider items-center select-none">
<div className="text-left pl-2 text-nowrap cursor-pointer group flex items-center justify-start gap-1 hover:text-[#0F172A] dark:hover:text-white transition-colors" onClick={() => handleSort('nome')}>
  Nome
  <span className="flex flex-col opacity-0 group-hover:opacity-50 transition-opacity" style={{ opacity: sortColumn === 'nome' ? 1 : undefined }}>
    <ArrowUp size={10} className={sortColumn === 'nome' && sortDirection === 'asc' ? 'text-blue-500' : ''} style={{ marginBottom: '-3px' }} />
    <ArrowDown size={10} className={sortColumn === 'nome' && sortDirection === 'desc' ? 'text-blue-500' : ''} />
  </span>
</div>
  <div className="text-center">Quant.</div>
<div className="text-center cursor-pointer group flex items-center justify-center gap-1 hover:text-[#0F172A] dark:hover:text-white transition-colors" onClick={() => handleSort('cotacao')}>
  Cotação
  <span className="flex flex-col opacity-0 group-hover:opacity-50 transition-opacity" style={{ opacity: sortColumn === 'cotacao' ? 1 : undefined }}>
    <ArrowUp size={10} className={sortColumn === 'cotacao' && sortDirection === 'asc' ? 'text-blue-500' : ''} style={{ marginBottom: '-3px' }} />
    <ArrowDown size={10} className={sortColumn === 'cotacao' && sortDirection === 'desc' ? 'text-blue-500' : ''} />
  </span>
</div>
<div className="text-center cursor-pointer group flex items-center justify-center gap-1 hover:text-[#0F172A] dark:hover:text-white transition-colors" onClick={() => handleSort('patrimonio')}>
  Patrimônio
  <span className="flex flex-col opacity-0 group-hover:opacity-50 transition-opacity" style={{ opacity: sortColumn === 'patrimonio' ? 1 : undefined }}>
    <ArrowUp size={10} className={sortColumn === 'patrimonio' && sortDirection === 'asc' ? 'text-blue-500' : ''} style={{ marginBottom: '-3px' }} />
    <ArrowDown size={10} className={sortColumn === 'patrimonio' && sortDirection === 'desc' ? 'text-blue-500' : ''} />
  </span>
</div>
  <div className="text-center">Objetivo</div>
<div className="text-center cursor-pointer group flex items-center justify-center gap-1 hover:text-[#0F172A] dark:hover:text-white transition-colors" onClick={() => handleSort('total')}>
  Total
  <span className="flex flex-col opacity-0 group-hover:opacity-50 transition-opacity" style={{ opacity: sortColumn === 'total' ? 1 : undefined }}>
    <ArrowUp size={10} className={sortColumn === 'total' && sortDirection === 'asc' ? 'text-blue-500' : ''} style={{ marginBottom: '-3px' }} />
    <ArrowDown size={10} className={sortColumn === 'total' && sortDirection === 'desc' ? 'text-blue-500' : ''} />
  </span>
</div>
  <div className="text-right pr-2">Ações</div>
</div>

                <div className="space-y-1">
                  {filteredAtivos.map((ativo: any, index: number) => (
                    <div key={index} className="grid grid-cols-[1.2fr_0.95fr_1fr_1.1fr_0.8fr_1.2fr_70px] gap-2 items-center py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] rounded-xl transition-colors px-2 border-b border-[#E2E8F0] dark:border-[#1E293B] last:border-0">
                      
                      <div className="text-left pl-2 flex flex-col gap-0.5">
                        <span className="font-bold text-[#0F172A] dark:text-white text-[14px]" style={{ color: ativo.classeCor }}>{ativo.ticker}</span>
                        <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">{ativo.classeNome}</span>
                      </div>
                      
                      <div className="text-center flex justify-center">
                        {ativo.classeId === 'renda-fixa' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenOrdemModal(ativo.id); }} 
                            className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-full p-1.5 text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] bg-white dark:bg-[#0B0F19] transition-colors"
                            title="Atualizar Direto"
                          >
                            <RefreshCw size={14} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <div className="inline-flex items-center justify-center gap-1.5">
                            <div className="border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A] rounded-full px-3 py-1 flex items-center justify-center">
                              <span className="text-[14px] text-[#0F172A] dark:text-white font-bold">
                                {formatQuantity(ativo.qtd)}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenOrdemModal(ativo.id); }} 
                              className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-full p-1.5 text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] bg-white dark:bg-[#0B0F19] transition-colors"
                              title="Nova Ordem"
                            >
                              <ArrowRightLeft size={14} strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <span className="text-[14px] text-[#0F172A] dark:text-white font-medium text-nowrap">
                          {ativo.classeId === 'renda-fixa' ? formatCurrency(ativo.qtd, moeda) : formatCurrency(ativo.cotacao, moeda)}
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[14px] text-[#2563EB] dark:text-blue-400 font-bold text-nowrap">
                          {ativo.total === 0 && ativo.isSyncing ? '--' : formatCurrency(ativo.total, moeda)}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center items-center">
                        <div className="flex items-center justify-center gap-0.5 border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A] rounded-full px-2 py-0.5">
                          <input 
                            type="text"
                            inputMode="numeric"
                            className="bg-transparent text-[13px] font-bold text-[#0F172A] dark:text-white text-center w-8 outline-none"
                            value={ativo.objetivo}
                            onChange={(e) => handleObjetivoChange(ativo.id, e.target.value.replace(/[^0-9.]/g, ''))}
                            onBlur={(e) => handleObjetivoBlur(ativo.id, e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="text-center flex justify-center">
                        <div className={`px-3 py-1 rounded-full font-bold text-[13px] whitespace-nowrap ${(ativo.diferenca ?? 0) >= 0 ? (totalFormat === 'financeiro' || totalFormat === 'quantidade' ? 'text-[#64748B] dark:text-[#94A3B8]' : 'bg-[#DCFCE7] dark:bg-green-900/20 text-[#16A34A] dark:text-green-400') : 'bg-[#FEE2E2] dark:bg-red-900/20 text-[#EF4444] dark:text-red-400'}`}>
                          {renderDiferenca(ativo)}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); deleteAtivo(ativo.id); }} className="p-1.5 text-[#64748B] dark:text-[#94A3B8] hover:text-[#EF4444] dark:hover:text-red-400 hover:bg-[#FEE2E2] dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredAtivos.map((ativo: any, index: number) => (
                <div key={index} className="bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[20px] p-4 flex flex-col gap-4 shadow-sm relative">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#0F172A] dark:text-white text-[16px]" style={{ color: ativo.classeCor }}>{ativo.ticker}</span>
                      <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] px-1.5 py-0.5 rounded-md">{ativo.classeNome}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteAtivo(ativo.id); }} 
                        className="p-2 text-[#EF4444] dark:text-red-400 hover:bg-[#FEE2E2] dark:hover:bg-red-900/20 bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Main Data */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Preço Atual</span>
                      <span className="font-bold text-[#0F172A] dark:text-white">{ativo.classeId === 'renda-fixa' ? formatCurrency(ativo.qtd, moeda) : formatCurrency(ativo.cotacao, moeda)}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Posição</span>
                      <span className="font-bold text-[#0F172A] dark:text-white">{ativo.classeId === 'renda-fixa' ? '-' : formatQuantity(ativo.qtd)}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Total ({moeda})</span>
                      <span className="font-black text-[#0F172A] dark:text-white">{ativo.total === 0 && ativo.isSyncing ? '--' : formatCurrency(ativo.total, moeda)}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">% Ideal</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#E2E8F0] dark:bg-[#334155] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(ativo.percentualIdeal || 0, 100)}%`, backgroundColor: ativo.classeCor }}></div>
                        </div>
                        <span className="font-bold text-[#0F172A] dark:text-white">{formatPercent(ativo.percentualIdeal || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Stats */}
                  <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-0.5">Objetivo</span>
                      <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#1E293B] px-2 py-1 rounded-md">
                        <input 
                          type="text"
                          inputMode="numeric"
                          className="bg-transparent text-[13px] font-bold text-[#0F172A] dark:text-white text-center w-8 outline-none"
                          value={ativo.objetivo}
                          onChange={(e) => handleObjetivoChange(ativo.id, e.target.value.replace(/[^0-9.]/g, ''))}
                          onBlur={(e) => handleObjetivoBlur(ativo.id, e.target.value)}
                        />
                        <span className="text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8]">%</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-[13px] whitespace-nowrap ${(ativo.diferenca ?? 0) >= 0 ? (totalFormat === 'financeiro' || totalFormat === 'quantidade' ? 'text-[#64748B] dark:text-[#94A3B8]' : 'bg-[#DCFCE7] dark:bg-green-900/20 text-[#16A34A] dark:text-green-400') : 'bg-[#FEE2E2] dark:bg-red-900/20 text-[#EF4444] dark:text-red-400'}`}>
                      {renderDiferenca(ativo)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
          ) : (
            <div className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
              Nenhum ativo encontrado nesta classe.
            </div>
          )}
        </div>
      )}

      {/* Modal Adicionar Novo Ativo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A80] dark:bg-black/60 backdrop-blur-[4px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] shadow-2xl w-full max-w-[340px] overflow-visible flex flex-col max-h-[90vh] relative group"
          >
             <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] dark:border-[#1E293B] relative z-10">
              <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">Adicionar Novo Ativo</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#94A3B8] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-visible relative z-20">
              <div>
                <label className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Classe do Ativo
                </label>
                <div className="relative z-[70]">
                  <CustomDropdown 
                    value={novoAtivo.classe}
                    onChange={(val) => setNovoAtivo({...novoAtivo, classe: val})}
                    options={CLASSES_ATIVOS_OPCOES.map(opt => ({ value: opt.id, label: opt.nome }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Nome
                </label>
                <input 
                  type="text"
                  placeholder="Ticker do ativo (Ex: ITUB3)"
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white font-bold outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] transition-colors uppercase shadow-sm"
                  value={novoAtivo.ticker}
                  onChange={(e) => setNovoAtivo({...novoAtivo, ticker: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-transparent border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-end gap-3 relative z-10">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="btn-cancelar flex-1"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNovoAtivo}
                disabled={isSubmitting || !novoAtivo.ticker}
                className="btn-salvar flex-1"
              >
                
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                       <RefreshCw size={18} className="animate-spin" />
                       Salvando...
                    </>
                  ) : 'Salvar Ativo' }
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Nova Ordem */}
      {isOrdemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A80] dark:bg-black/60 backdrop-blur-[4px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] shadow-2xl w-full max-w-[420px] overflow-visible flex flex-col max-h-[90vh] relative group"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <h2 className="font-bold text-[#0F172A] dark:text-white text-lg">Nova Ordem</h2>
              <button 
                onClick={() => setIsOrdemModalOpen(false)}
                className="text-[#94A3B8] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-[12px] overflow-y-auto">
              
              {/* Info do Ativo - Somente Texto */}
              <div className="flex flex-col items-center justify-center mb-1">
                <span className="text-[20px] font-black text-[#0F172A] dark:text-white tracking-tight">
                  {currentAtivoForOrdem?.ticker_original || currentAtivoForOrdem?.ticker || ''}
                </span>
              </div>

              {/* Tipo de Ordem */}
              <div className="flex gap-[10px]">
                <button 
                  onClick={() => setOrdemType('compra')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-[8px] px-[16px] text-[14px] font-[800] transition-all duration-200 cursor-pointer ${
                    ordemType === 'compra' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)]' 
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {ordemClasse === 'renda-fixa' ? 'Aporte' : 'Compra'}
                </button>
                <button 
                  onClick={() => setOrdemType('venda')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-[8px] px-[16px] text-[14px] font-[800] transition-all duration-200 cursor-pointer ${
                    ordemType === 'venda' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]' 
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {ordemClasse === 'renda-fixa' ? 'Resgate' : 'Venda'}
                </button>
                <button 
                  onClick={() => setOrdemType('ajuste')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-[8px] px-[16px] text-[14px] font-[800] transition-all duration-200 cursor-pointer ${
                    ordemType === 'ajuste' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)]' 
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {ordemClasse === 'renda-fixa' ? 'Total Atual' : 'Ajustar'}
                </button>
              </div>

              {/* Input Valor / Quantidade */}
              <div>
                <label className="block text-[12px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px] text-center">
                  {ordemClasse === 'renda-fixa' ? 'Valor (R$)' : 'Quantidade'}
                </label>
                <div className="relative">
                  <input 
                    ref={inputOrdemQtdRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    onFocus={handleInputFocus}
                    onClick={handleInputFocus}
                    className={`w-full border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-4 py-1.5 text-center text-[22px] font-black bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all shadow-inner focus:border-blue-500 dark:focus:border-blue-500 ${ordemType === 'compra' ? 'text-green-600 dark:text-green-400' : (ordemType === 'venda' ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400')}`}
                    value={ordemQtd}
                    onChange={(e) => {
                      if (ordemClasse === 'renda-fixa') {
                        const digits = e.target.value.replace(/\D/g, '');
                        if (digits) {
                          const num = parseInt(digits, 10) / 100;
                          setOrdemQtd(num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                        } else {
                          setOrdemQtd('');
                        }
                      } else {
                        const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                        setOrdemQtd(val);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Preview Qtd / Valor */}
              <div className="w-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-2xl p-4 flex justify-between items-center shadow-lg border border-[#334155] dark:border-[#1E293B]"> 
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[10px] font-[800] text-[#94A3B8] uppercase tracking-widest mb-1">Atual</span>
                  <span className="font-[800] text-white text-[18px]">
                    {ordemClasse === 'renda-fixa' ? formatCurrency(currentQtdForOrdem, moeda) : formatQuantity(currentQtdForOrdem)}
                  </span>
                </div>
                
                <div className="text-[#475569] flex items-center justify-center px-4">
                  <div className="w-8 h-8 rounded-full bg-[#334155] dark:bg-[#1E293B] flex items-center justify-center shadow-inner">
                    <ArrowRight size={14} className="text-[#94A3B8]" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[10px] font-[800] text-[#94A3B8] uppercase tracking-widest mb-1">
                    {ordemClasse === 'renda-fixa' ? 'Novo Valor' : 'Nova QTD'}
                  </span>
                  <span className={`font-[800] text-[18px] ${
                    ordemAtivoId ? (ordemType === 'compra' ? 'text-[#4ADE80]' : (ordemType === 'venda' ? 'text-[#F87171]' : 'text-[#60A5FA]')) : 'text-white'
                  }`}>
                    {ordemAtivoId ? (ordemClasse === 'renda-fixa' ? formatCurrency(newQtdForOrdem < 0 ? 0 : newQtdForOrdem, moeda) : formatQuantity(newQtdForOrdem < 0 ? 0 : newQtdForOrdem)) : '0'}
                  </span>
                </div>
              </div>

            </div>

            <div className="p-4 bg-transparent border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-center gap-3 rounded-b-[24px]">
              <button 
                onClick={() => setIsOrdemModalOpen(false)}
                disabled={isSubmitting}
                className="btn-cancelar flex-1"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveOrdem}
                disabled={isSubmitting || !ordemAtivoId || !ordemQtd || parsedQtdForOrdem <= 0 || newQtdForOrdem < 0}
                className="btn-salvar flex-1"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Ordem'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
