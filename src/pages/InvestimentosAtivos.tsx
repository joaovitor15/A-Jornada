import React, { useState, useMemo, useEffect } from 'react';
import { 
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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCotacoesGSheets } from '../hooks/useCotacoesGSheets';
import { supabase } from '../supabaseClient';

interface InvestimentosAtivosProps {
  activeProfileId?: string;
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatQuantity = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8 }).format(value);
};

export function InvestimentosAtivos({ activeProfileId }: InvestimentosAtivosProps) {
  const [expandedClasses, setExpandedClasses] = useState<string[]>(['acoes-br', 'fiis']);
  const { data: cotacoesData, loading: cotacoesLoading, error: cotacoesError, refetch, addTickerSync, deleteTickerSync } = useCotacoesGSheets();
  
  // Local state for the user's portfolio holding via Supabase
  const [meusAtivosPersistidos, setMeusAtivosPersistidos] = useState<any[]>([]);
  const [isLoadingAtivos, setIsLoadingAtivos] = useState(true);
  const [comprasMesClasses, setComprasMesClasses] = useState<Record<string, number>>({});

  // Load ativos from Supabase
  useEffect(() => {
    async function loadAtivos() {
      if (!activeProfileId) return;
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

      // Load Compras Mes por Classe
      const savedCC: Record<string, number> = {};
      CLASSES_ATIVOS_OPCOES.forEach(c => {
         const valStr = localStorage.getItem(`compras_mes_classe_${activeProfileId}_${c.id}`);
         if (valStr) savedCC[c.id] = parseInt(valStr, 10);
      });
      setComprasMesClasses(savedCC);
    }
    loadAtivos();
  }, [activeProfileId]);

  const handleComprasMesClasseChange = (classeId: string, value: string) => {
    const val = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setComprasMesClasses(prev => ({ ...prev, [classeId]: val }));
    if (activeProfileId) {
      localStorage.setItem(`compras_mes_classe_${activeProfileId}_${classeId}`, val.toString());
    }
  };

  // Modal Novo Ativo state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novoAtivo, setNovoAtivo] = useState({ classe: 'acoes-br', ticker: '', qtd: '' });

  // Nova Ordem Modal state
  const [isOrdemModalOpen, setIsOrdemModalOpen] = useState(false);
  const [ordemType, setOrdemType] = useState<'compra' | 'venda' | 'ajuste'>('compra');
  const [ordemClasse, setOrdemClasse] = useState('todas');
  const [ordemAtivoId, setOrdemAtivoId] = useState('');
  const [ordemQtd, setOrdemQtd] = useState('');

  const toggleClass = (id: string) => {
    setExpandedClasses(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSaveNovoAtivo = async () => {
    if (!novoAtivo.ticker || !novoAtivo.qtd || !activeProfileId) return;
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
      const dbAtivo = {
        profile_id: activeProfileId,
        classe: novoAtivo.classe,
        ticker_original: rawTicker,
        ticker_google: formattedTicker,
        qtd: parseFloat(novoAtivo.qtd.replace(/\./g, '').replace(',', '.')) || parseFloat(novoAtivo.qtd) || 0,
        objetivo: 0
      };

      const { data, error } = await supabase
        .from('ativos_carteira')
        .insert(dbAtivo)
        .select()
        .single();

      if (error) throw error;
      setMeusAtivosPersistidos(prev => [...prev, data]);
      setExpandedClasses(prev => prev.includes(novoAtivo.classe) ? prev : [...prev, novoAtivo.classe]);
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

  const ativosForOrdemSelect = meusAtivosPersistidos
    .filter(a => (ordemClasse === 'todas' ? a.classe !== 'renda-fixa' : a.classe === ordemClasse))
    .sort((a, b) => a.ticker_original.localeCompare(b.ticker_original));

  const dynamicClassesData = useMemo(() => {
    // 1. Acha a cotação do Dolar pra BRL para converter os ativos de EUA!
    const quoteDolarObj = cotacoesData.find(c => c.TICKER === 'CURRENCY:USDBRL');
    const valorDolar = quoteDolarObj ? (typeof quoteDolarObj.ULTIMA_COTACAO === 'number' ? quoteDolarObj.ULTIMA_COTACAO : parseFloat(String(quoteDolarObj.ULTIMA_COTACAO).replace(',', '.'))) : 1;

    // 2. Agrupa os itens do PORTFÓLIO por categoria e calcula patrimônio total
    const groupedMap = new Map<string, any>();
    let patrimonioTotal = 0;
    
    // Obter Metas e Compras Mês do Dashboard do localStorage para saber se a Classe tem 'COMPRA'
    const dashboardMetasRaw = localStorage.getItem(`metas_classes_${activeProfileId}`);
    const dashboardMetas = dashboardMetasRaw ? JSON.parse(dashboardMetasRaw) : { 'fiis': 30, 'acoes-br': 30, 'stocks-us': 15, 'reits-us': 10, 'etfs-us': 5, 'renda-fixa': 10, 'cripto': 0 };
    const dashboardComprasMes = parseInt(localStorage.getItem(`compras_mes_dashboard_${activeProfileId}`) || '2', 10);

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
         price = price * valorDolar;
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

    // 3. Descobrir quais CLASSES estão em 'COMPRA' no Dashboard
    const classesDiferenca = CLASSES_ATIVOS_OPCOES.map(c => {
      const valorAtual = groupedMap.get(c.id)?.valorTotal || 0;
      const objetivo = dashboardMetas[c.id] || 0;
      const valorObjetivo = (patrimonioTotal * objetivo) / 100;
      const diferenca = valorObjetivo - valorAtual;
      return { id: c.id, diferenca };
    });

    const classesParaComprar = classesDiferenca
      .filter(c => c.diferenca > 0)
      .sort((a, b) => b.diferenca - a.diferenca)
      .slice(0, dashboardComprasMes)
      .map(c => c.id);

    // 4. Calcular o rebalanceamento interno DENTRO de cada Classe
    groupedMap.forEach(group => {
      const classIsCompra = classesParaComprar.includes(group.id);
      const comprasMesClasse = comprasMesClasses[group.id] ?? 1;
      
      const globalClassDiferenca = classesDiferenca.find(c => c.id === group.id)?.diferenca || 0;
      const targetClassTotal = classIsCompra && globalClassDiferenca > 0 
        ? group.valorTotal + globalClassDiferenca 
        : group.valorTotal;

      // Calcular % Atual e Diferença para os ativos dentro da classe
      group.ativos.forEach((ativo: any) => {
        ativo.percentualAtual = group.valorTotal > 0 ? (ativo.total / group.valorTotal) * 100 : 0;
        const valorObjetivo = (targetClassTotal * ativo.objetivo) / 100;
        ativo.diferenca = valorObjetivo - ativo.total;
      });

      // Encontrar Top Compras DENTRO da Classe
      const ativosParaComprarSimplificado = classIsCompra
        ? [...group.ativos]
            .sort((a, b) => b.diferenca - a.diferenca)
            .slice(0, comprasMesClasse)
            .map(a => a.id)
        : [...group.ativos]
            .filter(a => a.diferenca > 0)
            .sort((a, b) => b.diferenca - a.diferenca)
            .slice(0, comprasMesClasse)
            .map(a => a.id);

      group.ativos.forEach((ativo: any) => {
        if (!classIsCompra) {
          ativo.status = ativo.diferenca > 0 ? 'ESPERE' : 'MANTER';
          ativo.statusColor = ativo.diferenca > 0 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
        } else if (ativosParaComprarSimplificado.includes(ativo.id)) {
          ativo.status = 'COMPRA';
          ativo.statusColor = 'bg-green-100 text-green-700';
          // Force a positive diferenca if the asset was selected to absorb the class purchase
          if (ativo.diferenca <= 0) {
            ativo.diferenca = Math.max(globalClassDiferenca / ativosParaComprarSimplificado.length, 0);
          }
        } else if (ativo.diferenca > 0) {
          ativo.status = 'ESPERE';
          ativo.statusColor = 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
        } else {
          ativo.status = 'MANTER';
          ativo.statusColor = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
        }
      });
      
      group.classIsCompra = classIsCompra;
      group.comprasMesClasse = comprasMesClasse;
    });

    return Array.from(groupedMap.values()).sort((a, b) => {
      const indexA = CLASSES_ATIVOS_OPCOES.findIndex(c => c.id === a.id);
      const indexB = CLASSES_ATIVOS_OPCOES.findIndex(c => c.id === b.id);
      return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999);
    });
  }, [cotacoesData, meusAtivosPersistidos, activeProfileId, comprasMesClasses]);

  const displayData = dynamicClassesData;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
            <Activity className="text-[#0F172A] dark:text-white" size={24} />
            Meus Ativos
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">Gerencie e balanceie os ativos.</p>
        </div>
        
        <div className="flex items-center gap-[12px] w-full md:w-auto mt-4 md:mt-0 justify-end">
          <button 
            onClick={refetch} 
            disabled={cotacoesLoading}
            className={`w-[44px] h-[44px] md:w-auto md:h-auto rounded-full md:rounded-[100px] md:px-[16px] md:py-[10px] text-sm font-[700] transition-colors flex items-center justify-center border-[1.5px] border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] shadow-sm shrink-0 ${cotacoesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Sincronizar cotações do Google Sheets"
          >
            <RefreshCw size={18} className={cotacoesLoading ? "animate-spin" : ""} />
            <span className="hidden md:inline ml-2">Sincronizar</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-[44px] h-[44px] md:w-auto md:h-auto rounded-full md:rounded-[100px] md:px-[22px] md:py-[10px] text-white font-[700] md:text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-transform cursor-pointer flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            title="Novo Ativo"
          >
            <Plus size={18} className="md:w-4 md:h-4" />
            <span className="hidden md:inline ml-[6px]">NOVO ATIVO</span>
          </button>

          <button 
            onClick={() => handleOpenOrdemModal()} 
            className="w-[44px] h-[44px] md:w-auto md:h-auto rounded-full md:rounded-[100px] md:px-[22px] md:py-[10px] text-white font-[700] md:text-[14px] shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:-translate-y-[1px] transition-transform cursor-pointer flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            title="Nova Compra"
          >
            <ShoppingCart size={18} className="md:w-4 md:h-4" />
            <span className="hidden md:inline ml-[6px]">NOVA COMPRA</span>
          </button>
        </div>
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
        <div className="bg-white dark:bg-[#1E293B] border-2 border-dashed border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-12 text-center text-[#64748B] dark:text-[#94A3B8]">
           <Wallet className="mx-auto text-[#CBD5E1] dark:text-[#94A3B8] mb-4" size={48} />
           <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Nenhum ativo cadastrado</h3>
           <p className="max-w-sm mx-auto mb-6">Comece adicionando seus ativos aqui para que as cotações sejam sincronizadas juntamente com seu Google Sheets.</p>
           <button onClick={() => setIsModalOpen(true)} className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-[#1D4ED8]">
             Cadastrar Primeiro Ativo
           </button>
        </div>
      )}

      {/* Classes de Ativos (Accordion) */}
      <div className="space-y-4">
        {displayData.map((classe) => {
          const isExpanded = expandedClasses.includes(classe.id);
          const Icon = classe.icone;

          return (
            <div key={classe.id} className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden transition-all duration-200">
              {/* Cabeçalho do Accordion */}
              <button 
                onClick={() => toggleClass(classe.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" 
                    style={{ backgroundColor: `${classe.cor}15`, color: classe.cor }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-[#0F172A] dark:text-white">{classe.nome}</h3>
                    <div className="bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] px-2 py-0.5 rounded-md text-xs font-bold">
                      {classe.ativos.length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {classe.totalCotas && (
                    <div className="hidden md:flex bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-3 py-1 rounded-lg text-xs font-bold text-[#64748B] dark:text-[#94A3B8] items-center gap-1">
                      <span>#</span> {classe.totalCotas.toLocaleString('pt-BR')} cotas
                    </div>
                  )}
                  
                  <div className="text-right hidden sm:block">
                    <div className="text-base font-bold text-[#2563EB] dark:text-blue-400">
                      {formatCurrency(classe.valorTotal)}
                    </div>
                  </div>

                  {!classe.classIsCompra && (
                    <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Não Recomendada
                    </div>
                  )}

                  <div className={`hidden md:flex px-3 py-1 rounded-lg text-xs font-bold items-center gap-1.5 ${classe.metaAtingida === 100 ? 'bg-green-50 text-green-700' : classe.metaAtingida > 100 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                    Meta Ideal: {classe.metaAtingida}% 
                  </div>

                  <div className="text-[#94A3B8] dark:text-[#94A3B8]">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </button>

              {/* Corpo do Accordion (Tabela) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#E2E8F0] dark:border-[#334155] px-5 py-4 bg-[#F8FAFC] dark:bg-[#0F172A]/50 dark:bg-black/60">
                      
                      {classe.ativos.length > 0 ? (
                        <div className="w-full">
                          
                          {/* Desktop Layout */}
                          <div className="hidden md:flex flex-col w-full">
                            {/* Cabeçalho da Tabela */}
                            <div className="grid grid-cols-[1fr_0.95fr_1fr_1.1fr_0.8fr_0.9fr_1.2fr_70px] gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#334155] mb-3 text-[11px] font-[800] text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider items-center">
                              <div className="text-left pl-2 text-nowrap">Ativo</div>
                              <div className="text-center">Quant.</div>
                              <div className="text-center">Cotação</div>
                              <div className="text-center">Valor Total</div>
                              <div className="text-center">Objetivo</div>
                              <div className="text-center">Status</div>
                              <div className="text-center">Aporte</div>
                              <div className="text-right pr-2">Ações</div>
                            </div>

                            {/* Linhas da Tabela */}
                            <div className="space-y-1">
                              {classe.ativos.map((ativo: any, index: number) => (
                                <div key={index} className="grid grid-cols-[1fr_0.95fr_1fr_1.1fr_0.8fr_0.9fr_1.2fr_70px] gap-2 items-center py-2 hover:bg-white dark:bg-[#1E293B] rounded-xl transition-colors px-2">
                                  
                                  <div className="text-left pl-2 truncate" title={ativo.ticker}>
                                    <span className="font-bold text-[#0F172A] dark:text-white text-[14px] leading-none">{ativo.ticker}</span>
                                  </div>
                                  
                                  <div className="text-center">
                                    <span className="text-[15px] text-[#0F172A] dark:text-white font-medium leading-none">
                                      {formatQuantity(ativo.qtd)}
                                    </span>
                                  </div>

                                  <div className="text-center">
                                    <span className="text-[14px] text-[#0F172A] dark:text-white font-medium text-nowrap leading-none">
                                      {formatCurrency(ativo.cotacao)}
                                    </span>
                                  </div>

                                  <div className="text-center">
                                    <span className="text-[14px] text-[#0F172A] dark:text-white font-bold text-nowrap leading-none">
                                      {ativo.total === 0 && ativo.isSyncing ? '--' : formatCurrency(ativo.total)}
                                    </span>
                                  </div>

                                  <div className="flex flex-col justify-center items-center">
                                    <div className="flex items-center justify-center gap-0.5">
                                      <input 
                                        type="text"
                                        inputMode="numeric"
                                        className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded px-1 py-0.5 text-[12px] font-bold text-[#0F172A] dark:text-white text-center w-9 outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                                        value={ativo.objetivo}
                                        onChange={(e) => handleObjetivoChange(ativo.id, e.target.value.replace(/[^0-9.]/g, ''))}
                                        onBlur={(e) => handleObjetivoBlur(ativo.id, e.target.value)}
                                      />
                                      <span className="text-[#94A3B8] dark:text-[#94A3B8] text-[11px] font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-center">
                                    <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ativo.statusColor} whitespace-nowrap`}>
                                      {ativo.status}
                                    </div>
                                  </div>

                                  <div className="text-center">
                                    {ativo.status === 'COMPRA' && (ativo.diferenca ?? 0) > 0 ? (
                                      <span className="font-bold text-[#16A34A] dark:text-green-400 text-[15px] whitespace-nowrap">+ {formatCurrency(ativo.diferenca)}</span>
                                    ) : (
                                      <span className="text-[#94A3B8] dark:text-[#94A3B8] text-[12px] font-medium">-</span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-end gap-1">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleOpenOrdemModal(ativo.id); }} 
                                      className={`p-1.5 rounded-lg transition-colors ${classe.id === 'renda-fixa' ? 'text-[#2563EB] dark:text-blue-400 hover:bg-[#EFF6FF]' : 'text-[#10B981] hover:bg-[#D1FAE5]'}`} 
                                      title={classe.id === 'renda-fixa' ? "Atualizar Direto" : "Nova Ordem"}
                                    >
                                      {classe.id === 'renda-fixa' ? <RefreshCw size={16} /> : <ShoppingCart size={16} />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteAtivo(ativo.id); }} className="p-1.5 text-[#EF4444] dark:text-red-400 hover:bg-[#FEE2E2] dark:bg-red-900/20 rounded-lg transition-colors" title="Excluir">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mobile Layout */}
                          <div className="md:hidden flex flex-col gap-3">
                            {classe.ativos.map((ativo: any, index: number) => (
                              <div key={index} className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex flex-col gap-4 shadow-sm relative">
                                {/* Header */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-[#0F172A] dark:text-white text-[16px]">{ativo.ticker}</span>
                                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${ativo.statusColor}`}>
                                      {ativo.status}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleOpenOrdemModal(ativo.id); }} 
                                      className={`p-2 rounded-xl transition-colors ${classe.id === 'renda-fixa' ? 'text-[#2563EB] dark:text-blue-400 bg-[#EFF6FF]' : 'text-[#10B981] bg-[#D1FAE5]'}`} 
                                    >
                                      {classe.id === 'renda-fixa' ? <RefreshCw size={16} /> : <ShoppingCart size={16} />}
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); deleteAtivo(ativo.id); }} 
                                      className="p-2 text-[#EF4444] dark:text-red-400 bg-[#FEE2E2] dark:bg-red-900/20 rounded-xl transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>

                                {/* Main Data */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Valor Total</span>
                                    <span className="font-bold text-[#0F172A] dark:text-white text-[15px]">{ativo.total === 0 && ativo.isSyncing ? '--' : formatCurrency(ativo.total)}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Aporte/Dif.</span>
                                    {ativo.status === 'COMPRA' && (ativo.diferenca ?? 0) > 0 ? (
                                      <span className="font-bold text-[#16A34A] dark:text-green-400 text-[14px] bg-[#DCFCE7] dark:bg-green-900/20 px-2 py-0.5 rounded-md inline-block whitespace-nowrap">+ {formatCurrency(ativo.diferenca)}</span>
                                    ) : (
                                      <span className="text-[#94A3B8] dark:text-[#94A3B8] font-bold">-</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Quantidade</span>
                                    <span className="font-medium text-[#0F172A] dark:text-white text-[14px]">{formatQuantity(ativo.qtd)}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider mb-1">Cotação</span>
                                    <span className="font-medium text-[#0F172A] dark:text-white text-[14px]">{formatCurrency(ativo.cotacao)}</span>
                                  </div>
                                </div>

                                {/* Objetivos Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#334155] mt-1 gap-2">
                                  <span className="text-[11px] font-[800] text-[#94A3B8] dark:text-[#94A3B8] uppercase tracking-wider">Objetivo</span>
                                  <div className="flex items-center gap-1.5">
                                    <input 
                                      type="text"
                                      inputMode="numeric"
                                      className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#475569] rounded-md px-2 py-1.5 text-[14px] font-bold text-[#0F172A] dark:text-white text-center w-14 outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                                      value={ativo.objetivo}
                                      onChange={(e) => handleObjetivoChange(ativo.id, e.target.value.replace(/[^0-9.]/g, ''))}
                                      onBlur={(e) => handleObjetivoBlur(ativo.id, e.target.value)}
                                    />
                                    <span className="text-[#94A3B8] dark:text-[#94A3B8] text-[13px] font-bold">%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      ) : null}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

       {/* Modal Novo Ativo */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 dark:bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
          >
             <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] dark:border-[#334155]">
              <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">Adicionar Novo Ativo</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#94A3B8] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Classe do Ativo
                </label>
                <select 
                  className="w-full border-2 border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white font-medium outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors appearance-none"
                  value={novoAtivo.classe}
                  onChange={(e) => setNovoAtivo({...novoAtivo, classe: e.target.value})}
                >
                  {CLASSES_ATIVOS_OPCOES.map(opt => (
                     <option key={opt.id} value={opt.id}>{opt.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                    Ticker (Símbolo)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: ITUB3, AAPL, O, BTC" 
                    className="w-full border-2 border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[#0F172A] dark:text-white font-bold outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors uppercase"
                    value={novoAtivo.ticker}
                    onChange={(e) => setNovoAtivo({...novoAtivo, ticker: e.target.value})}
                  />
                  <p className="text-[10px] text-[#94A3B8] dark:text-[#94A3B8] mt-1 font-medium">Basta digitar o ticker livremente. Não é necessário informar a bolsa (NASDAQ, NYSE).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                    Quantidade Inicial
                  </label>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    placeholder="Ex: 100 ou 0,50" 
                    className="w-full border-2 border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[#0F172A] dark:text-white font-medium outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors"
                    value={novoAtivo.qtd}
                    onChange={(e) => setNovoAtivo({...novoAtivo, qtd: e.target.value.replace(/[^0-9.,]/g, '')})}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:bg-[#475569] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNovoAtivo}
                disabled={isSubmitting || !novoAtivo.ticker || !novoAtivo.qtd}
                className={`bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold shadow hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 ${isSubmitting || !novoAtivo.ticker || !novoAtivo.qtd ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                     <RefreshCw size={18} className="animate-spin" />
                     Salvando...
                  </>
                ) : 'Salvar Ativo' }
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
            className="bg-[#FFFFFF] rounded-[24px] p-[20px] w-full max-w-[420px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-[800] text-[#0F172A] dark:text-white">Nova Ordem</h2>
              <button 
                onClick={() => setIsOrdemModalOpen(false)}
                className="text-[#94A3B8] dark:text-[#94A3B8] hover:text-[#0F172A] dark:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex gap-[10px] mb-[18px]">
              <button 
                onClick={() => setOrdemType('compra')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                  ordemType === 'compra' 
                    ? 'bg-[#DCFCE7] dark:bg-green-900/20 text-[#16A34A] dark:text-green-400 border-[1.5px] border-[#16A34A] dark:border-green-500/50 shadow-[0_2px_8px_rgba(22,163,74,0.2)]' 
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#334155]'
                }`}
              >
                {ordemClasse === 'renda-fixa' ? 'Aporte' : 'Compra'}
              </button>
              <button 
                onClick={() => setOrdemType('venda')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                  ordemType === 'venda' 
                    ? 'bg-[#FEE2E2] dark:bg-red-900/20 text-[#EF4444] dark:text-red-400 border-[1.5px] border-[#EF4444] dark:border-red-500/50 shadow-[0_2px_8px_rgba(239,68,68,0.2)]' 
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#334155]'
                }`}
              >
                {ordemClasse === 'renda-fixa' ? 'Resgate' : 'Venda'}
              </button>
              <button 
                onClick={() => setOrdemType('ajuste')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                  ordemType === 'ajuste' 
                    ? 'bg-[#EFF6FF] text-[#2563EB] dark:text-blue-400 border-[1.5px] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#334155]'
                }`}
              >
                {ordemClasse === 'renda-fixa' ? 'Total Atual' : 'Ajustar'}
              </button>
            </div>

            <div className="space-y-[14px]">
              <div className="flex gap-[14px]">
                 <div className="flex-1">
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Classe</label>
                    <select 
                      className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none transition-all focus:border-[#2563EB] dark:focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] appearance-none cursor-pointer"
                      value={ordemClasse}
                      onChange={(e) => {
                         setOrdemClasse(e.target.value);
                         setOrdemAtivoId('');
                         setOrdemQtd('');
                      }}
                    >
                      <option value="todas">Todas</option>
                      {CLASSES_ATIVOS_OPCOES.filter(c => c.id !== 'renda-fixa' || ordemClasse === 'renda-fixa').map(opt => (
                         <option key={opt.id} value={opt.id}>{opt.nome}</option>
                      ))}
                    </select>
                 </div>
                 
                 <div className="flex-1">
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Ativo</label>
                    <div className="relative">
                      <select
                        className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none transition-all focus:border-[#2563EB] dark:focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] appearance-none cursor-pointer"
                        value={ordemAtivoId}
                        onChange={(e) => setOrdemAtivoId(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {ativosForOrdemSelect.map(ativo => (
                          <option key={ativo.id} value={ativo.id}>
                            {ativo.ticker_original}
                          </option>
                        ))}
                      </select>
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px] text-center">{ordemClasse === 'renda-fixa' ? 'Valor (R$)' : 'Quantidade (Cotas)'}</label>
                <input 
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  className={`w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-center text-[18px] font-[800] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] dark:focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] ${ordemType === 'compra' ? 'text-[#16A34A] dark:text-green-400' : (ordemType === 'venda' ? 'text-[#EF4444] dark:text-red-400' : 'text-[#2563EB] dark:text-blue-400')}`}
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
                      setOrdemQtd(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
                    }
                  }}
                />
              </div>

              {/* Preview Qtd */}
              <div className="w-full bg-[#F1F5F9] dark:bg-[#334155] rounded-[14px] p-[16px] flex justify-between items-center mt-[14px]">
                 <div className="flex flex-col items-center flex-1">
                   <span className="text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Atual</span>
                   <span className="font-[800] text-[#0F172A] dark:text-white mt-1 text-[16px]">{formatQuantity(currentQtdForOrdem)}</span>
                 </div>
                 
                 <div className="text-[#94A3B8] dark:text-[#94A3B8] px-2 flex items-center justify-center">
                    <ArrowRight size={16} />
                 </div>

                 <div className="flex flex-col items-center flex-1">
                   <span className="text-[11px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Nova QTD</span>
                   <span className={`font-[800] mt-1 text-[16px] ${ordemAtivoId ? (ordemType === 'compra' ? 'text-[#16A34A] dark:text-green-400' : (ordemType === 'venda' ? 'text-[#EF4444] dark:text-red-400' : 'text-[#2563EB] dark:text-blue-400')) : 'text-[#0F172A] dark:text-white'}`}>
                      {ordemAtivoId ? formatQuantity(newQtdForOrdem < 0 ? 0 : newQtdForOrdem) : '0'}
                   </span>
                 </div>
              </div>
            </div>

            <div className="flex gap-[10px] mt-[24px]">
              <button 
                onClick={() => setIsOrdemModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[100px] py-[12px] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveOrdem}
                disabled={isSubmitting || !ordemAtivoId || !ordemQtd || parsedQtdForOrdem <= 0 || newQtdForOrdem < 0}
                className={`flex-1 text-white font-[700] text-[14px] rounded-[100px] py-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:-translate-y-[1px] ${
                  ordemType === 'compra' ? 'bg-[#16A34A] hover:bg-[#15803d]' : (ordemType === 'venda' ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-[0_4px_14px_rgba(239,68,68,0.3)]' : 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_14px_rgba(37,99,235,0.3)]')
                } ${isSubmitting || !ordemAtivoId || !ordemQtd || parsedQtdForOrdem <= 0 || newQtdForOrdem < 0 ? 'opacity-50 cursor-not-allowed hidden-hover' : ''}`}
              >
                {isSubmitting ? (
                  <>
                     <RefreshCw size={16} className="animate-spin" />
                     Salvando...
                  </>
                ) : 'Salvar Ordem' }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
