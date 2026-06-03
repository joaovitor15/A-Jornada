import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Calendar, Check, Edit, Trash2, CreditCard, Tag as TagIcon, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Sparkles, 
  RefreshCw, AlertCircle, Plus, ChevronDown, CheckCircle2, RotateCcw,
  Play, Pause, Info, Wallet, Pencil, Search, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecurringModal } from './RecurringModal';
import { useCategories } from '../hooks/useCategories';
import { useProfiles } from '../hooks/useProfiles';

interface RecorrentesPageProps {
  activeProfileId?: string;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_COMPLETOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const RecorrentesPage = ({ activeProfileId }: RecorrentesPageProps) => {
  // Competency Calendar Date State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  const anoAtual = selectedDate.getFullYear();
  const mesAtual = selectedDate.getMonth() + 1;

  // Filters
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'pendentes' | 'lancadas'>('pendentes');

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [provisoesRaw, setProvisoesRaw] = useState<any[]>([]);
  const [realTransactions, setRealTransactions] = useState<any[]>([]);

  // Modal State for New/Edit Model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState<'receita' | 'despesa'>('despesa');
  const [editingRec, setEditingRec] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'lancamento' | 'modelos' | 'dashboard' | 'direto'>('lancamento');

  // Efetivacao / Lançamento Modal State
  const [efetivarModal, setEfetivarModal] = useState<{
    isOpen: boolean;
    provisao: any;
    parcelaNum?: number;
  } | null>(null);
  const [efetivarValorStr, setEfetivarValorStr] = useState('0');
  const [efetivarFormaPagamento, setEfetivarFormaPagamento] = useState('conta_corrente');
  const [efetivarCartaoId, setEfetivarCartaoId] = useState<string | null>(null);
  const [efetivarParcelas, setEfetivarParcelas] = useState(1);
  const [efetivarData, setEfetivarData] = useState('');


  
  // Quick Launching cards options
  const [userCards, setUserCards] = useState<any[]>([]);

  // States for Lançamento Rápido (Lançamento Direto)
  const [rapidoDesc, setRapidoDesc] = useState('Rendimento MP');
  const [rapidoTipo, setRapidoTipo] = useState<'receita' | 'despesa'>('receita');
  const [rapidoValorStr, setRapidoValorStr] = useState('0');
  const [rapidoData, setRapidoData] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [rapidoFormaPgto, setRapidoFormaPgto] = useState<'conta_corrente' | 'cartao_credito'>('conta_corrente');
  const [rapidoCardId, setRapidoCardId] = useState<string>('');
  const [rapidoTagId, setRapidoTagId] = useState<string>('');
  const [rapidoSucessoMsg, setRapidoSucessoMsg] = useState('');
  const [lancandoRapido, setLancandoRapido] = useState(false);

  // Confirmation Delete / State Controls
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; nome: string } | null>(null);

  // Cancel subscription future launches modal state
  const [cancelFutureModal, setCancelFutureModal] = useState<{
    isOpen: boolean;
    rec: any;
  } | null>(null);
  const [cancelingFuture, setCancelingFuture] = useState(false);

  const [reactivateModal, setReactivateModal] = useState<{
    isOpen: boolean;
    rec: any;
  } | null>(null);
  const [reactivating, setReactivating] = useState(false);

  // Exclusoes/Ignorados de provisoes por mes especifico
  const [ignoredProvisoes, setIgnoredProvisoes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('provisoes_ignoradas');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Custom Modal for individual provision exclusion
  const [ignoreProvisaoModal, setIgnoreProvisaoModal] = useState<{ isOpen: boolean; provisao: any } | null>(null);

  const [dashboardPeriodo, setDashboardPeriodo] = useState<'mensal' | 'anual'>('mensal');

  const handleIgnoreProvisao = (p: any) => {
    setIgnoreProvisaoModal({ isOpen: true, provisao: p });
  };

  const executeIgnoreProvisao = async () => {
    if (!ignoreProvisaoModal?.provisao) return;
    const p = ignoreProvisaoModal.provisao;
    const monthIndex = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const key = `${p.id}_${year}_${monthIndex}`;

    if (p.isPago && p.realizationId) {
      await supabase.from('transacoes').delete().eq('id', p.realizationId);
    }

    const newIgnored = [...ignoredProvisoes, key];
    setIgnoredProvisoes(newIgnored);
    localStorage.setItem('provisoes_ignoradas', JSON.stringify(newIgnored));
    
    setIgnoreProvisaoModal(null);
    triggerRefresh();
  };

  const { categories, tags } = useCategories(activeProfileId);
  const { profiles } = useProfiles();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const isBusiness = activeProfile?.tipo === 'empresa';

  // Navigation handlers
  const handleMudarAno = (increment: number) => {
    setSelectedDate(prev => new Date(prev.getFullYear() + increment, prev.getMonth(), 1));
  };

  const handleMudarMes = (mesIndex: number) => {
    setSelectedDate(prev => new Date(prev.getFullYear(), mesIndex, 1));
  };

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleCurrentMonth = () => {
    const today = new Date();
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Fetch Database Info
  const fetchProvisoesAndRealizations = async () => {
    if (!activeProfileId) return;
    setLoading(true);

    try {
      // 1. Fetch recurrent models (the specifications)
      const { data: rawRecDocs, error: recError } = await supabase
        .from('transacoes_recorrentes')
        .select(`
          *,
          categories ( id, nome, icone, cor ),
          tags ( id, nome ),
          cards ( id, nome )
        `)
        .eq('profile_id', activeProfileId);

      if (recError) throw recError;
      setProvisoesRaw(rawRecDocs || []);

      // 2. Fetch real transactions of the selected year
      const startYear = selectedDate.getFullYear();
      
      const startStr = `${startYear}-01-01`;
      const endStr = `${startYear}-12-31`;

      const { data: realTransDocs, error: transError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('profile_id', activeProfileId)
        .gte('data', startStr)
        .lte('data', endStr);

      if (transError) throw transError;
      setRealTransactions(realTransDocs || []);

      // 3. Keep cards list updated for pocket choices
      const { data: cardDocs } = await supabase
        .from('cards')
        .select('*')
        .eq('profile_id', activeProfileId);
      setUserCards(cardDocs || []);

    } catch (err) {
      console.error("Erro ao carregar dados de Provisões:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvisoesAndRealizations();
  }, [activeProfileId, selectedDate]);

  // Synchronize available tags with selection when Type changes in Lançamento Rápido
  useEffect(() => {
    if (!tags || tags.length === 0) return;
    const filtered = tags.filter(tag => {
      const cat = categories.find(c => c.id === tag.category_id);
      return cat && cat.tipo === rapidoTipo;
    });

    const isStillValid = filtered.some(t => t.id === rapidoTagId);
    if (!isStillValid) {
      if (filtered.length > 0) {
        setRapidoTagId(filtered[0].id);
      } else {
        setRapidoTagId('');
      }
    }
  }, [rapidoTipo, tags, categories]);

  // Submit direct log posting values directly to real transactions
  const handleLancarDireto = async () => {
    if (!rapidoDesc.trim()) {
      alert("Por favor, digite uma descrição para o lançamento rápido.");
      return;
    }
    const valFloat = parseCentsToNumber(rapidoValorStr);
    if (valFloat <= 0) {
      alert("Por favor, informe um valor maior que R$ 0,00.");
      return;
    }
    if (!rapidoTagId) {
      alert("Por favor, selecione uma tag.");
      return;
    }

    setLancandoRapido(true);
    try {
      const novaTransacao = {
        profile_id: activeProfileId,
        descricao: rapidoDesc.trim(),
        valor: valFloat,
        tipo: rapidoTipo,
        forma_pagamento: rapidoFormaPgto,
        card_id: rapidoFormaPgto === 'cartao_credito' ? (rapidoCardId || null) : null,
        data: rapidoData,
        recorrente_id: null, // this is a direct/instant post, no planner template links
        num_parcelas: null,
        tag_id: rapidoTagId
      };

      const { error } = await supabase
        .from('transacoes')
        .insert([novaTransacao]);

      if (error) throw error;

      // Show friendly immediate feedback
      setRapidoSucessoMsg(`Sucesso! Lançado R$ ${valFloat.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para "${rapidoDesc.trim()}" directly.`);
      setRapidoValorStr('0'); // clean value input

      // Reload lists and graphs
      triggerRefresh();

      setTimeout(() => {
        setRapidoSucessoMsg('');
      }, 5000);

    } catch (err) {
      console.error("Erro ao efetuar lançamento direto:", err);
      alert("Ocorrência de falha ao salvar a transação no banco de dados.");
    } finally {
      setLancandoRapido(false);
    }
  };

  // Force manual refresh
  const triggerRefresh = () => {
    fetchProvisoesAndRealizations();
  };

  // Format Currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Format currency from cents representation on state
  const formatCentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setEfetivarValorStr('0');
      return;
    }
    setEfetivarValorStr(val);
  };

  const parseCentsToNumber = (centsStr: string) => {
    return parseFloat(centsStr) / 100 || 0;
  };

  const handleRapidoValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setRapidoValorStr('0');
      return;
    }
    setRapidoValorStr(val);
  };

  const centsToFormattedCurrency = (centsStr: string) => {
    const valueNum = parseCentsToNumber(centsStr);
    return formatCurrency(valueNum);
  };

  // Helper helper to locate a realization transaction for any recurrent model (by FK or robust fallback details)
  const findRealizationForProvision = (rec: any, transactions: any[], year: number, month: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const refTag = `(Ref: ${monthStr}/${year})`;

    return transactions.find(t => {
      // Prioritize explicit competence reference (if paid early/late in a different month)
      if (t.recorrente_id === rec.id && t.descricao && t.descricao.includes(refTag)) {
        return true;
      }

      const inTargetMonth = (() => {
        if (!t.data) return false;
        const [y, m, d] = t.data.split('-');
        return parseInt(y, 10) === year && parseInt(m, 10) === month + 1;
      })();

      if (!inTargetMonth) return false;

      // Primary strict FK match within the physical target month
      if (t.recorrente_id === rec.id) {
        return true;
      }
      
      // Stop here if it maps to another recurring item
      if (t.recorrente_id) return false;

      const safeDesc = t.descricao || '';
      const cleanRecName = rec.nome || '';
      const nameMatch = safeDesc.toLowerCase().includes(cleanRecName.toLowerCase()) || 
                        cleanRecName.toLowerCase().includes(safeDesc.toLowerCase());

      const tipoMatch = t.tipo === rec.tipo;

      if (nameMatch && tipoMatch) {
        if (rec.valor !== null && rec.valor !== 0) {
          const diff = Math.abs(t.valor - Number(rec.valor));
          if (diff > 0.01) return false;
        }

        let dayMatches = true;
        if (rec.dia_vencimento) {
          try {
            const tDay = new Date(t.data + 'T12:00:00Z').getUTCDate();
            dayMatches = tDay === Number(rec.dia_vencimento);
          } catch (e) {}
        }
        return dayMatches;
      }
      return false;
    });
  };

  // Logic to process provision item variables and parcelations for the selected month list.
  // Returns highly detailed objects ready for render.
  const getProcessedProvisoesForDate = (targetYear: number, targetMonth: number) => {
    return provisoesRaw.filter(rec => rec.lancamento_rapido !== true).map(rec => {
      // 1. Initial Creation bounds
      // Determine the starting projection month based EXACTLY on data_lancamento (ultima_lancada).
      // Ignore data_criacao so we only rely on the explicit user action of launching it.
      const launchDateStr = rec.ultima_lancada;
      
      let startYear = new Date().getFullYear();
      let startMonth = new Date().getMonth();
      let shouldRender = true;
      
      if (!launchDateStr) {
          shouldRender = false;
      } else {
        const launchDate = new Date(launchDateStr);
        startYear = launchDate.getFullYear();
        startMonth = launchDate.getMonth();
        
        // If the recurring transaction is launched AFTER its due day for the month, 
        // the first occurrence will mathematically jump to the NEXT month.
        const shiftDay = isBusiness && rec.dia_emissao ? Number(rec.dia_emissao) : (rec.dia_vencimento ? Number(rec.dia_vencimento) : 1);
        const launchDay = launchDate.getDate();
        if (launchDay > shiftDay) {
          startMonth += 1;
          if (startMonth > 11) {
            startMonth = 0;
            startYear += 1;
          }
        }
      }

      // 2. Active Year bound
      // The active year is determined by when it was launched.
      // This ensures the projection only happens for the active year.
      const activeYear = launchDateStr ? new Date(launchDateStr).getFullYear() : startYear;

      const selectedYear = targetYear;
      const selectedMonth = targetMonth;

    // Months difference from start to selected
    const monthDiff = (selectedYear - startYear) * 12 + (selectedMonth - startMonth);

    // Filter validation logic
    let parcelaTexto = '';
    let currentParcela = 1;

    // 1. Parcel options
    if (rec.num_parcelas && rec.num_parcelas > 0) {
      if (monthDiff < 0 || monthDiff >= rec.num_parcelas) {
        shouldRender = false;
      } else {
        currentParcela = monthDiff + 1;
        parcelaTexto = `(${currentParcela}/${rec.num_parcelas})`;
      }
    }

    // 2. Annual options
    if (rec.frequencia === 'anual') {
      const annualTarget = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
      if (selectedMonth !== annualTarget) {
        shouldRender = false;
      }
    }

    // Check if there is an authorization trigger / realization for this month
    const realization = findRealizationForProvision(rec, realTransactions, selectedYear, selectedMonth);

    const isPago = !!realization;
    if (isPago) shouldRender = true; // Always show if there is a physical transaction

    // 3. Past boundary and Year boundary
    
    // Explicit fail-safe: Ensure no projection exists before the actual creation bounding month
    let effStartYear = isNaN(startYear) ? new Date().getFullYear() : startYear;
    let effStartMonth = isNaN(startMonth) ? new Date().getMonth() : startMonth;
    
    const projectedTimeId = selectedYear * 12 + selectedMonth;
    const creationTimeId = effStartYear * 12 + effStartMonth;

    if (!isPago && projectedTimeId < creationTimeId) {
      shouldRender = false;
    }

    // "ao mudar o ano não deveria ter nada é até dezembro e pronto"
    // However, if we correctly bumped it right across the year boundary, activeYear will just be the creation year.
    // If they launch in late Dec 2026, it jumps to Jan 2027. activeYear = 2026. selectedYear = 2027.
    // So we must check activeYear carefully. If target year is simply DIFFERENT from activeYear and it wasn't a valid projection bound, skip.
    else if (!isPago && projectedTimeId >= creationTimeId && selectedYear > effStartYear) {
      // If we crossed into a new year beyond effStartYear, and it wasn't an explicit parcel crossing, hide it based on user constraint: "ao mudar o ano não deveria ter nada"
      // Skipped for 'empresa' because they explicitly requested infinite recurrence preservation due to early invoice payments.
      if (!rec.num_parcelas && !isBusiness) {
         shouldRender = false;
      }
    }

    // 4. Inactive/canceled check (ativa === false)
    if (rec.ativa === false && !isPago) {
      shouldRender = false;
    }

    // 5. Ignored/excluded specific occurrence check
    const isIgnored = ignoredProvisoes.includes(`${rec.id}_${selectedYear}_${selectedMonth}`);
    if (isIgnored && !isPago) {
      shouldRender = false;
    }

    const valorPrevisto = rec.valor !== null ? Number(rec.valor) : 0;
    const valorEfetivado = isPago ? Number(realization.valor) : 0;

    return {
      ...rec,
      shouldRender,
      isPago,
      parcelaTexto,
      currentParcela,
      realizationId: realization?.id || null,
      realizationData: realization?.data || null,
      valorPrevisto,
      valorEfetivado,
      formaPagamentoReal: realization?.forma_pagamento || rec.forma_pagamento
    };
  }).filter(p => p.shouldRender);
  }; // End getProcessedProvisoesForDate

  // The actual selected month list
  const processedProvisoes = getProcessedProvisoesForDate(selectedDate.getFullYear(), selectedDate.getMonth());

  // Dashboard Stats logic (can expand to entire year if "anual")
  let targetProvisoesToComputeStats = processedProvisoes;

  if (activeTab === 'dashboard' && dashboardPeriodo === 'anual') {
     targetProvisoesToComputeStats = [];
     for (let m = 0; m < 12; m++) {
        targetProvisoesToComputeStats.push(...getProcessedProvisoesForDate(selectedDate.getFullYear(), m));
     }
  }

  // Statistics calculation
  const statDespesasPrevistas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statDespesasPagas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && p.isPago && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorEfetivado, 0);

  const statDespesasPendentes = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && !p.isPago && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statReceitasPrevistas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'receita' && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statReceitasRecebidas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'receita' && p.isPago && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorEfetivado, 0);

  // Accomplished progress
  const despesasCount = targetProvisoesToComputeStats.filter(p => p.tipo === 'despesa' && p.categories?.nome?.toLowerCase() !== 'investimentos').length;
  const despesasPagasCount = targetProvisoesToComputeStats.filter(p => p.tipo === 'despesa' && p.isPago && p.categories?.nome?.toLowerCase() !== 'investimentos').length;

  // Filter dynamic list based on state
  const listagemFiltrada = processedProvisoes.filter(p => {
    // Hide data_variavel from lancamento tab only in business profile
    const isDataVariavel = !p.dia_vencimento && !p.dia_emissao && !p.lancamento_rapido && isBusiness;
    if (isDataVariavel) return false;

    // 1. Busca
    if (busca) {
      const termo = busca.toLowerCase();
      const nomeMatch = (p.nome || '').toLowerCase().includes(termo);
      const categoryMatch = (p.categories?.nome || '').toLowerCase().includes(termo);
      if (!nomeMatch && !categoryMatch) return false;
    }

    // 2. Situação
    if (filtroTipo === 'pendentes' && p.isPago) return false;
    if (filtroTipo === 'lancadas' && !p.isPago) return false;

    return true;
  });

  const formatarDataCabecalhoRecorrente = (dataStr: string) => {
    if (dataStr === 'Sem Data') return 'AGENDAMENTOS GERAIS DO MÊS';
    const parts = dataStr.split('-');
    if (parts.length !== 3) return dataStr;
    const [ano, mes, dia] = parts;
    const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const diaSemana = diasSemana[data.getDay()].toUpperCase();
    
    const nomeMes = data.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();

    return `${diaSemana}, ${dia} DE ${nomeMes}`;
  };

  const calcularTotalDiaRecorrente = (provisoesDia: any[]) => {
    return provisoesDia.reduce((acc, p) => {
      const valor = p.isPago ? p.valorEfetivado : p.valorPrevisto;
      return acc + (p.tipo === 'receita' ? valor : -valor);
    }, 0);
  };

  const formatarMoedaSinal = (valor: number, mostrarSinal = false) => {
    const abs = Math.abs(valor);
    const formatado = abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (mostrarSinal) {
      if (valor > 0) return `+R$ ${formatado}`;
      if (valor < 0) return `-R$ ${formatado}`;
      return `R$ ${formatado}`;
    }
    return formatado;
  };

  const provisoesAgrupadas = listagemFiltrada.reduce((grupos: Record<string, any[]>, p) => {
    let dataGroup = 'Sem Data';
    if (p.isPago && p.realizationData) {
      dataGroup = p.realizationData;
    } else if (p.dia_vencimento || p.dia_emissao) {
      const targetDay = isBusiness && p.dia_emissao ? p.dia_emissao : (p.dia_vencimento || 1);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      dataGroup = `${year}-${String(month).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
    } else {
      if (p.frequencia === 'anual' && p.mes_vencimento && (p.dia_vencimento || p.dia_emissao)) {
         const targetDay = isBusiness && p.dia_emissao ? p.dia_emissao : (p.dia_vencimento || 1);
         const year = selectedDate.getFullYear();
         dataGroup = `${year}-${String(p.mes_vencimento).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
      } else {
         const year = selectedDate.getFullYear();
         const month = selectedDate.getMonth() + 1;
         dataGroup = `${year}-${String(month).padStart(2, '0')}-01`;
      }
    }
    
    if (!grupos[dataGroup]) grupos[dataGroup] = [];
    grupos[dataGroup].push(p);
    return grupos;
  }, {});

  // Action handlers
  const handleOpenEfetivarModal = (p: any) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setEfetivarModal({
      isOpen: true,
      provisao: p,
      parcelaNum: p.currentParcela
    });

    const valorCentavos = p.valorPrevisto ? Math.round(p.valorPrevisto * 100).toString() : '0';
    setEfetivarValorStr(valorCentavos);
    
    // Check if there are credit cards registered
    const hasCards = userCards.length > 0;
    let defaultForma = p.forma_pagamento === 'cartao_credito' ? 'cartao_credito' : 'conta_corrente';
    if (defaultForma === 'cartao_credito' && !hasCards) {
      defaultForma = 'conta_corrente';
    }

    setEfetivarFormaPagamento(defaultForma);
    setEfetivarCartaoId(hasCards ? (p.card_id || userCards[0]?.id || null) : null);
    setEfetivarParcelas(1); // Default to 1
    
    let defaultData = todayStr;
    if (isBusiness && p.dia_vencimento) {
      let year = selectedDate.getFullYear();
      let month = selectedDate.getMonth();
      
      if (p.frequencia === 'anual' && p.mes_vencimento) {
        month = p.mes_vencimento - 1;
      }
      
      let targetDay = Number(p.dia_vencimento);
      
      if (p.dia_emissao && targetDay < Number(p.dia_emissao)) {
          month += 1;
          if (month > 11) {
              month = 0;
              year += 1;
          }
      }
      
      const maxDayInMonth = new Date(year, month + 1, 0).getDate();
      if (targetDay > maxDayInMonth) targetDay = maxDayInMonth;
      if (targetDay < 1) targetDay = 1;
      
      defaultData = `${year}-${String(month + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
    }
    
    setEfetivarData(defaultData);
  };

  const handleExecuteEfetivacao = async () => {
    if (!efetivarModal) return;
    const { provisao, parcelaNum } = efetivarModal;
    
    const valorNum = parseCentsToNumber(efetivarValorStr);
    if (valorNum <= 0) {
      alert('Por favor informe um valor maior que R$ 0,00.');
      return;
    }

    try {
      const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yearStr = selectedDate.getFullYear();
      
      let baseDesc = parcelaNum && provisao.num_parcelas > 1 
        ? `${provisao.nome} (${parcelaNum}/${provisao.num_parcelas})`
        : provisao.nome;
        
      const isBusiness = activeProfileId && profiles.find(p => p.id === activeProfileId)?.tipo === 'empresa';
      
      const descExibida = baseDesc;

      const targetDate = isBusiness ? efetivarData : (() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        let targetDay = provisao.dia_vencimento ? Number(provisao.dia_vencimento) : 1;
        
        // ensure within bounds of the month
        const maxDayInMonth = new Date(year, month + 1, 0).getDate();
        if (targetDay > maxDayInMonth) targetDay = maxDayInMonth;
        if (targetDay < 1) targetDay = 1;

        return `${year}-${String(month + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
      })();

      const formaPgto = provisao.forma_pagamento === 'cartao_credito' ? 'cartao_credito' : 'conta_corrente';
      const cardId = formaPgto === 'cartao_credito' ? provisao.card_id : null;

      const novaTransacao = {
        profile_id: activeProfileId,
        descricao: descExibida,
        valor: valorNum,
        tipo: provisao.tipo,
        status: 'pago',
        forma_pagamento: formaPgto,
        card_id: cardId,
        data: targetDate,
        recorrente_id: provisao.id,
        num_parcelas: parcelaNum || null,
        tag_id: provisao.tag_id
      };

      // Check if there is already an existing transaction linked to this recurrent model in the target month (to update instead of duplicating)
      const targetYear = selectedDate.getFullYear();
      const targetMonth = selectedDate.getMonth();
      const monthStart = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-01`;
      const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthEnd = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(maxDay).padStart(2, '0')}`;

      const { data: existingTrans, error: checkError } = await supabase
        .from('transacoes')
        .select('id')
        .eq('profile_id', activeProfileId)
        .eq('recorrente_id', provisao.id)
        .gte('data', monthStart)
        .lte('data', monthEnd)
        .limit(1)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingTrans) {
        // Update the existing transaction instead of duplicating!
        const { error: updateTransError } = await supabase
          .from('transacoes')
          .update(novaTransacao)
          .eq('id', existingTrans.id);

        if (updateTransError) throw updateTransError;
      } else {
        // Insert a new transaction
        const { error: insertTransError } = await supabase
          .from('transacoes')
          .insert([novaTransacao]);

        if (insertTransError) throw insertTransError;
      }

      // Do NOT update ultima_lancada on the parent model here. 
      // ultima_lancada is strictly used as the projection generation anchor when creating or 'launching for the year'.

      setEfetivarModal(null);
      triggerRefresh();
    } catch (err) {
      console.error('Erro ao efetivar transacao:', err);
      alert('Falha ao efetivar provisão.');
    }
  };

  const handleCancelFutureLaunches = (rec: any) => {
    setCancelFutureModal({
      isOpen: true,
      rec
    });
  };

  const executeCancelFutureLaunches = async () => {
    if (!cancelFutureModal?.rec || !activeProfileId) return;
    const rec = cancelFutureModal.rec;

    setCancelingFuture(true);
    try {
      // Update the recurrent template itself to set ativa = false and ultima_lancada = null so the model un-projects entirely
      const { error: updateRecError } = await supabase
        .from('transacoes_recorrentes')
        .update({ ativa: false, ultima_lancada: null })
        .eq('profile_id', activeProfileId)
        .eq('id', rec.id);

      if (updateRecError) throw updateRecError;

      setCancelFutureModal(null);
      await fetchProvisoesAndRealizations();
      alert('Assinatura cancelada com sucesso!');
    } catch (err: any) {
      console.error("Erro ao cancelar assinatura futura:", err);
      alert('Erro ao cancelar assinatura: ' + (err?.message || err));
    } finally {
      setCancelingFuture(false);
    }
  };

  const executeReactivateRecurrence = async () => {
    if (!activeProfileId || !reactivateModal?.rec) return;
    const rec = reactivateModal.rec;
    setReactivating(true);
    try {
      // O usuário solicitou salvar a data de lançamento na exata data de hoje.
      // Isso se torna o âncora de data para a projeção no sistema.
      const now = new Date();
      let newLastLaunched = now.toISOString();

      const { error } = await supabase
        .from('transacoes_recorrentes')
        .update({ ativa: true, ultima_lancada: newLastLaunched })
        .eq('profile_id', activeProfileId)
        .eq('id', rec.id);

      if (error) throw error;
      await fetchProvisoesAndRealizations();
      setReactivateModal(null);
      setActiveTab('lancamento');
      setBusca(rec.nome);
    } catch (err: any) {
      console.error("Erro ao reativar assinatura:", err);
      alert('Erro ao reativar assinatura: ' + (err?.message || err));
    } finally {
      setReactivating(false);
    }
  };

  const handleExcluirModelo = (rec: any) => {
    setDeleteModal({ isOpen: true, id: rec.id, nome: rec.nome });
  };

  const executeExcluirModelo = async () => {
    if (!deleteModal?.id || !activeProfileId) return;
    try {
      // Disassociate past transactions to prevent DB crashes if constraints are rigid
      const { error: updateError } = await supabase
        .from('transacoes')
        .update({ recorrente_id: null })
        .eq('profile_id', activeProfileId)
        .eq('recorrente_id', deleteModal.id);

      if (updateError) throw updateError;

      // Delete the model template itself
      const { error: deleteRecError } = await supabase
        .from('transacoes_recorrentes')
        .delete()
        .eq('profile_id', activeProfileId)
        .eq('id', deleteModal.id);

      if (deleteRecError) throw deleteRecError;

      setDeleteModal(null);
      await fetchProvisoesAndRealizations();
      alert('Modelo de recorrência excluído com sucesso!');
    } catch (err: any) {
      console.error("Erro ao excluir o modelo:", err);
      alert('Erro ao remover modelo recorrido: ' + (err?.message || err));
    }
  };

  // Bulk logic removed: the new "Lançar para o ano" uses agenda projection instead of DB physical rows.

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
            <Calendar size={28} className="text-[#3B82F6]" />
            Lançamentos Futuros
          </h2>

          {/* TABS DE SELEÇÃO: LANÇAMENTO | CONTAS | DASHBOARD */}
          <div className="flex gap-4 sm:gap-6 border-b-0 pb-1">
            <button
              onClick={() => setActiveTab('lancamento')}
              className={`pb-1 text-xs font-black tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'lancamento'
                  ? 'text-[#3B82F6] dark:text-[#60A5FA]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-bold'
              }`}
            >
              LANÇAMENTO
              {activeTab === 'lancamento' && (
                <motion.div 
                  layoutId="activeRecurringTabLine"
                  className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#3B82F6] rounded-full" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('modelos')}
              className={`pb-1 text-xs font-black tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'modelos'
                  ? 'text-[#3B82F6] dark:text-[#60A5FA]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-bold'
              }`}
            >
              CONTAS
              {activeTab === 'modelos' && (
                <motion.div 
                  layoutId="activeRecurringTabLine"
                  className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#3B82F6] rounded-full" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('direto')}
              className={`pb-1 text-xs font-black tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'direto'
                  ? 'text-[#3B82F6] dark:text-[#60A5FA]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-bold'
              }`}
            >
              LANÇAMENTO RÁPIDO
              {activeTab === 'direto' && (
                <motion.div 
                  layoutId="activeRecurringTabLine"
                  className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#3B82F6] rounded-full" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-1 text-xs font-black tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-[#3B82F6] dark:text-[#60A5FA]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-bold'
              }`}
            >
              DASHBOARD
              {activeTab === 'dashboard' && (
                <motion.div 
                  layoutId="activeRecurringTabLine"
                  className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#3B82F6] rounded-full" 
                />
              )}
            </button>
          </div>
        </div>

        {/* BUTTON ACTION DESIGN */}
        <div className="relative w-full md:w-auto shrink-0 select-none">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all cursor-pointer border-none"
          >
            <Plus size={15} strokeWidth={2.5} />
            Planejar Conta <ChevronDown size={14} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[100%] mt-2 right-0 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-1.5 min-w-[200px] z-50 overflow-hidden"
              >
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('receita');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#DCFCE7] dark:hover:bg-green-950/40 transition-colors cursor-pointer group"
                >
                  <TrendingUp size={15} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Planejar Recebimento</span>
                </div>
                <div className="border-t border-slate-100 dark:border-[#334155] my-1" />
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('despesa');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 transition-colors cursor-pointer group"
                >
                  <TrendingDown size={15} className="text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Planejar Pagamento</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. NAVEGAÇÃO TEMPORAL TABULAR DE MESES */}
      {activeTab === 'lancamento' && (
        <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] p-[16px_20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* MOBILE: Dropdown + Ano */}
          <div className="flex md:hidden flex-col gap-[12px] w-full items-center justify-center">
            {/* Ano */}
            <div className="flex justify-between items-center gap-[10px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[16px] py-[8px] w-full">
              <button onClick={() => handleMudarAno(-1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]  border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] transition-colors cursor-pointer">
                <ChevronLeft size={14} />
              </button>
              <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
                {anoAtual}
              </span>
              <button onClick={() => handleMudarAno(1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]  border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] transition-colors cursor-pointer">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Dropdown de Mês */}
            <div className="relative w-full">
              <button 
                onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
                className="w-full flex justify-between items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] dark:bg-[#0F172A]  transition-colors cursor-pointer"
              >
                {MESES_COMPLETOS[mesAtual - 1]}
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
                      className="absolute left-0 right-0 mt-2 min-w-[200px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                    >
                      <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                        {MESES_COMPLETOS.map((nome, i) => {
                          const isActive = mesAtual === i + 1;
                          return (
                            <button 
                              key={nome}
                              onClick={() => {
                                handleMudarMes(i);
                                setDropdownMesAberto(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                                isActive 
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold' 
                                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <span className="flex-1 text-left">{nome}</span>
                              {isActive && <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>}
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

          {/* TABLET / DESKTOP: Ano centralizado e meses em linha */}
          <div className="hidden md:block w-full">
            <div className="flex justify-center items-center gap-[16px] mb-[14px]">
              <button 
                onClick={() => handleMudarAno(-1)}
                className="p-[4px_8px] rounded-[8px] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white cursor-pointer transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[16px] font-[800] text-[#0F172A] dark:text-white">
                {anoAtual}
              </span>
              <button 
                onClick={() => handleMudarAno(1)}
                className="p-[4px_8px] rounded-[8px] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white cursor-pointer transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="flex gap-[6px] justify-center w-full">
              {MESES.map((nomeMes, index) => {
                const ativo = index + 1 === mesAtual;
                return (
                  <button
                    key={nomeMes}
                    onClick={() => handleMudarMes(index)}
                    className={`rounded-[100px] p-[6px_14px] text-[13px] font-[600] cursor-pointer transition-all border-[1.5px] ${
                      ativo 
                        ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#2563EB] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.15)]'
                        : 'bg-[#F8FAFC] dark:bg-[#0F172A]  text-[#64748B] dark:text-[#94A3B8] border-transparent dark:border-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white'
                    }`}
                  >
                    {nomeMes}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. NAVEGAÇÃO TEMPORAL (DASHBOARD) - Idêntica à tela de Relatórios */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col items-center justify-center gap-[24px] mb-4">
           <div className="flex flex-col md:flex-row items-center justify-center gap-[12px] w-full max-w-[600px]">
               {/* ANO SELECTOR */}
               <div className="order-1 md:order-2 flex justify-between items-center bg-white dark:bg-[#1E293B] rounded-[100px] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] px-[16px] py-[8px] min-w-[140px] shadow-sm">
                  <button onClick={() => handleMudarAno(-1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"><ChevronLeft size={14} /></button>
                  <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">{anoAtual}</span>
                  <button onClick={() => handleMudarAno(1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"><ChevronRight size={14} /></button>
               </div>

               {/* MÊS SELECTOR (Somente se mensal) */}
               {dashboardPeriodo === 'mensal' && (
                 <div className="order-2 md:order-1 relative w-full md:w-auto bg-white dark:bg-[#1E293B] rounded-[100px] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] px-[20px] py-[8px] shadow-sm flex items-center justify-between md:justify-center cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors">
                    <select 
                       value={mesAtual - 1} 
                       onChange={e => handleMudarMes(Number(e.target.value))}
                       className="w-full bg-transparent border-none text-[14px] font-[600] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none md:pr-6 md:min-w-[100px]"
                       style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                       {MESES_COMPLETOS.map((m, i) => <option key={m} value={i} className="text-[#0F172A] bg-white dark:bg-[#0F172A] dark:text-white">{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="text-[#64748B] dark:text-[#94A3B8] absolute right-[16px] pointer-events-none" />
                 </div>
               )}
           </div>

           {/* RADIO TIPO PERÍODO */}
           <div className="flex items-center justify-center gap-[12px]">
              <button 
                onClick={() => setDashboardPeriodo('mensal')} 
                className={`flex items-center justify-center rounded-[100px] py-[8px] px-[24px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                    dashboardPeriodo === 'mensal' 
                      ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#2563EB] dark:text-[#60A5FA] border-[1.5px] border-[#2563EB] dark:border-[#3B82F6] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#334155]'
                }`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setDashboardPeriodo('anual')} 
                className={`flex items-center justify-center rounded-[100px] py-[8px] px-[24px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                    dashboardPeriodo === 'anual' 
                      ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#2563EB] dark:text-[#60A5FA] border-[1.5px] border-[#2563EB] dark:border-[#3B82F6] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#334155]'
                }`}
              >
                Anual
              </button>
           </div>
        </div>
      )}

      {/* Month components separated */}

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Previsto Despesas */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-slate-200 dark:border-[#334155] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2 select-none">
                <TrendingDown size={14} className="text-red-400" />
                Despesas Previstas
              </span>
              <span className="text-xl font-black text-slate-800 dark:text-white block">
                {formatCurrency(statDespesasPrevistas)}
              </span>
            </div>
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Contas mapeadas no mês</span>
              <span className="font-bold text-slate-600 dark:text-slate-300">{despesasCount} itens</span>
            </div>
          </div>

          {/* Card 2: Pago Despesas */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-slate-200 dark:border-[#334155] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2 select-none">
                <CheckCircle2 size={11} className="text-emerald-500" />
                Despesas Efetivadas
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">
                {formatCurrency(statDespesasPagas)}
              </span>
            </div>
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Saldo restante em aberto</span>
              <span className="font-bold text-red-500">{formatCurrency(statDespesasPendentes)}</span>
            </div>
          </div>

          {/* Card 3: Receitas Planejadas */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-slate-200 dark:border-[#334155] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2 select-none">
                <TrendingUp size={14} className="text-emerald-400" />
                Receitas Planejadas
              </span>
              <span className="text-xl font-black text-indigo-500 dark:text-indigo-400 block">
                {formatCurrency(statReceitasPrevistas)}
              </span>
            </div>
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Receitas Efetivadas</span>
              <span className="font-bold text-emerald-500">{formatCurrency(statReceitasRecebidas)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lancamento' && (
        <>
          {/* FILTER & CONTROL BAR (TRANSACTIONS FORMAT) */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] p-[14px_20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center gap-[12px]">
            <div className="relative w-full lg:flex-1">
              <Search size={15} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#64748B]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por descrição, tag ou valor..."
                className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] p-[9px_12px_9px_36px] text-[13px] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] text-[#0F172A] dark:text-white"
              />
            </div>
            
            <div className="flex gap-[6px] w-full lg:w-auto pb-1 lg:pb-0">
              <button
                onClick={() => setFiltroTipo('pendentes')}
                className={`flex-1 lg:flex-none rounded-[100px] py-[7px] px-[8px] sm:px-[16px] text-[11px] sm:text-[13px] font-[600] border-[1.5px] transition-colors ${
                  filtroTipo === 'pendentes'
                    ? 'bg-[#0F172A] dark:bg-[#334155] text-[#FFFFFF] dark:text-white border-[#0F172A] dark:border-[#334155]'
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]'
                }`}
              >
                NÃO LANÇADO
              </button>
              <button
                onClick={() => setFiltroTipo('lancadas')}
                className={`flex-1 lg:flex-none rounded-[100px] py-[7px] px-[8px] sm:px-[16px] text-[11px] sm:text-[13px] font-[600] border-[1.5px] transition-colors ${
                  filtroTipo === 'lancadas'
                    ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[#16A34A]'
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]'
                }`}
              >
                LANÇADA
              </button>
            </div>
          </div>

          {/* CORE LIST VIEW */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800">
              <RefreshCw size={36} className="text-[#3B82F6] animate-spin mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Atualizando provisões...</p>
            </div>
          ) : listagemFiltrada.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#334155] p-6 text-center">
              <Calendar size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-black text-sm mb-1">Nenhuma provisão encontrada</p>
              <p className="text-slate-400 text-xs max-w-md">Não há planejamentos periódicos criados ou adequados aos filtros no mês de {MESES_COMPLETOS[selectedDate.getMonth()]} de {selectedDate.getFullYear()}. Defina suas contas no botão superior.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#F1F5F9] dark:border-[#334155] shadow-sm overflow-hidden flex flex-col">
              <div>
                {(Object.entries(provisoesAgrupadas) as [string, any[]][]).sort((a, b) => a[0].localeCompare(b[0])).map(([dataStr, provisoesDia]) => {
                  const totalDia = calcularTotalDiaRecorrente(provisoesDia);
                  return (
                    <div key={dataStr}>
                      {/* SEPARADOR DO DIA */}
                      <div className="bg-[#F8FAFC] dark:bg-[#0F172A]  p-[8px_20px] flex justify-between items-center border-b-[1px] border-[#F1F5F9] dark:border-[#334155]">
                        <span className="text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-[0.05em]">
                          {formatarDataCabecalhoRecorrente(dataStr)}
                        </span>
                        <span className={`text-[12px] font-[700] ${totalDia === 0 ? 'text-[#64748B] dark:text-[#94A3B8]' : (totalDia > 0 ? 'text-[#16A34A]' : 'text-[#EF4444]')}`}>
                          {formatarMoedaSinal(totalDia, true)}
                        </span>
                      </div>

                      {/* LINHAS DE PROVISÃO */}
                      <div>
                        {provisoesDia.map((p) => {
                          const cat = p.categories;
                          const categoryColor = cat?.cor || '#64748B';
                          
                          return (
                            <div 
                              key={p.id} 
                              className="p-[14px_20px] flex items-center justify-between gap-[14px] border-b-[1px] border-[#F8FAFC] dark:border-[#0F172A] transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#0F172A] group relative"
                            >
                              <div className="flex items-center gap-[14px] flex-1 min-w-0">
                                {/* CÍRCULO TIPO */}
                                <div className={`w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center ${
                                  p.tipo === 'receita' ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A]' : 'bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444]'
                                }`}>
                                  {p.tipo === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                </div>

                                {/* DESCRIÇÃO E DETALHES */}
                                <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                                  <div className="text-[14px] font-[600] text-[#0F172A] dark:text-white whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2">
                                    {p.nome}
                                  </div>
                                  
                                  <div className="flex items-center gap-[8px] flex-wrap">
                                    {/* CATEGORIA */}
                                    <span style={{
                                      padding: '2px 8px',
                                      borderRadius: '100px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      background: `${categoryColor}20`,
                                      color: categoryColor,
                                      border: `1px solid ${categoryColor}40`
                                    }}>
                                      {cat?.nome || 'Sem categoria'} {p.parcelaTexto}
                                    </span>

                                    {/* SITUAÇÃO BADGE */}
                                    {p.isPago ? (
                                      <span className="inline-flex items-center gap-[4px] px-[6px] py-[1.5px] rounded-[100px] text-[10px] font-[800] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-wider select-none">
                                        Lançada
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-[4px] px-[6px] py-[1.5px] rounded-[100px] text-[10px] font-[800] bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A] uppercase tracking-wider dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900 select-none">
                                        Agendada
                                      </span>
                                    )}

                                    {/* DETALHES PLANO */}
                                    <div className="flex items-center gap-[6px] text-[11px] text-[#94A3B8] dark:text-[#64748B]">
                                      <Wallet size={12} />
                                      <span className="italic">
                                        {p.isPago ? (
                                          p.formaPagamentoReal === 'cartao_credito' ? 'Crédito' : 'Conta'
                                        ) : (
                                          p.forma_pagamento === 'cartao_credito' ? 'Crédito' : 'Conta'
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* VALOR E AÇÕES */}
                              <div className="flex items-center gap-[12px] shrink-0">
                                <div className={`text-[15px] font-[700] whitespace-nowrap text-right ${
                                  !p.isPago && p.valorPrevisto === 0 ? 'text-slate-800 dark:text-white' : (p.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]')
                                }`}>
                                  {formatarMoedaSinal(p.tipo === 'receita' ? (p.isPago ? p.valorEfetivado : p.valorPrevisto) : -(p.isPago ? p.valorEfetivado : p.valorPrevisto), true)}
                                </div>
                                
                                <div className="flex items-center gap-[4px] opacity-100 md:opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleOpenEfetivarModal(p)}
                                      className="flex items-center gap-1 p-[4px_10px] rounded-[8px] bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#CA8A04] transition-colors cursor-pointer text-[11px] font-[700] mr-1"
                                      title="Efetivar Transação"
                                    >
                                      <Check size={11} strokeWidth={3} />
                                      Efetivar
                                    </button>
                                  <button
                                    onClick={() => {
                                      setEditingRec(p);
                                      setIsModalOpen(true);
                                    }}
                                    className="p-[6px] rounded-[8px] text-[#CBD5E1] dark:text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:bg-[#1E3A8A] dark:hover:bg-[#1E3A8A] transition-colors"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleIgnoreProvisao(p)}
                                    className="p-[6px] rounded-[8px] text-[#CBD5E1] dark:text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D] transition-colors"
                                    title="Excluir este lançamento específico"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'modelos' && (
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800">
              <RefreshCw size={36} className="text-[#3B82F6] animate-spin mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Carregando contas...</p>
            </div>
          ) : provisoesRaw.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#334155] p-6 text-center">
              <Calendar size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-black text-sm mb-1">Nenhuma conta cadastrada</p>
              <p className="text-slate-400 text-xs max-w-md">Crie suas contas recorrentes clicando no botão "Planejar Conta" no topo.</p>
            </div>
          ) : (() => {
            const contasNormais = provisoesRaw.filter(r => r.lancamento_rapido !== true);
            const variaveis = contasNormais.filter(r => !r.dia_vencimento && !r.dia_emissao && isBusiness);
            const mensais = contasNormais.filter(r => r.frequencia === 'mensal' && !(!r.dia_vencimento && !r.dia_emissao && isBusiness));
            const anuais = contasNormais.filter(r => r.frequencia === 'anual' && !(!r.dia_vencimento && !r.dia_emissao && isBusiness));
            const outrasFrequencias = contasNormais.filter(r => r.frequencia !== 'mensal' && r.frequencia !== 'anual' && !(!r.dia_vencimento && !r.dia_emissao && isBusiness));

            const renderCardModel = (rec: any) => {
              const cat = rec.categories;
              const categoryColor = cat?.cor || '#64748B';
              const valorPrevisto = rec.valor !== null ? Number(rec.valor) : null;
              const cardName = rec.cards?.nome;

              const launchDateStr = rec.ultima_lancada;
              const isScheduledForYear = !!launchDateStr && new Date(launchDateStr).getFullYear() === selectedDate.getFullYear() && rec.ativa !== false;

              // Find calculated provision occurrence from processedProvisoes if any to support modals/actions
              const matchingProvisao = processedProvisoes.find(p => p.id === rec.id && p.shouldRender !== false);
              
              let isEfetivadoThisMonth = matchingProvisao ? matchingProvisao.isPago : false;
              const isDataVariavel = !rec.dia_vencimento && !rec.dia_emissao && !rec.lancamento_rapido && isBusiness;
              
              if (!matchingProvisao && isDataVariavel) {
                 const paidThisMonth = realTransactions.some(t => 
                     t.recorrente_id === rec.id && 
                     t.status === 'pago' && 
                     new Date(t.data).getFullYear() === selectedDate.getFullYear() && 
                     new Date(t.data).getMonth() === selectedDate.getMonth()
                 );
                 isEfetivadoThisMonth = paidThisMonth;
              }
              
              // If it's data_variavel, it's always pending unless paid.
              const isProjectedThisMonth = !!matchingProvisao || isDataVariavel;

              return (
                <div
                  key={rec.id}
                  id={`model-card-${rec.id}`}
                  className="bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-blue-200 dark:hover:border-blue-900 transition-all gap-5 min-h-[200px]"
                >
                  <div className="space-y-4">
                    {/* Upper row: Title and Badge */}
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base font-black text-slate-800 dark:text-white leading-tight tracking-tight max-w-[70%] truncate">
                        {rec.nome}
                      </h4>
                      {isEfetivadoThisMonth ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 uppercase select-none shrink-0" title="Foi pago/efetivado neste mês">
                          LANÇADO
                        </span>
                      ) : isDataVariavel ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 uppercase select-none shrink-0" title="Pendente de efetivação neste mês">
                          PENDENTE NO MÊS
                        </span>
                      ) : isProjectedThisMonth ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 uppercase select-none shrink-0" title="Aparece pendente na sua agenda deste mês">
                          PENDENTE NO MÊS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 uppercase select-none shrink-0" title="Não aparece na agenda selecionada">
                          NÃO PROJETADO
                        </span>
                      )}
                    </div>

                    {/* Value block */}
                    <div>
                      {valorPrevisto !== null ? (
                        <p className={`text-xl font-black ${valorPrevisto === 0 ? 'text-slate-800 dark:text-white' : (rec.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]')}`}>
                          {valorPrevisto === 0 ? '' : (rec.tipo === 'receita' ? '+' : '-')} {formatCurrency(Math.abs(valorPrevisto))}
                        </p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold italic">
                          Valor Variável
                        </p>
                      )}
                    </div>

                    {/* Meta Row: Day or frequency, and Account */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-550 font-bold">
                      <div className="flex items-center gap-1.5 leading-none">
                        <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>
                          {rec.frequencia === 'mensal' ? (isBusiness && rec.dia_emissao ? `Tirar: Dia ${rec.dia_emissao} • Pagar: ${!rec.dia_vencimento ? 'Dia Variável' : `Dia ${rec.dia_vencimento}`}` : `${!rec.dia_vencimento ? 'Dia Variável' : `Dia ${rec.dia_vencimento}`}`) : ''}
                          {rec.frequencia === 'anual' ? (isBusiness && rec.dia_emissao ? `Tirar: Dia ${rec.dia_emissao} • Pagar: ${!rec.dia_vencimento ? 'Dia Variável' : `Dia ${rec.dia_vencimento}`}/${rec.mes_vencimento ? MESES[rec.mes_vencimento - 1] : '?'}` : `${!rec.dia_vencimento ? 'Dia Variável' : `Dia ${rec.dia_vencimento}`}/${rec.mes_vencimento ? MESES[rec.mes_vencimento - 1] : '?'}`) : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 leading-none">
                        <CreditCard size={13} className="text-slate-400 dark:text-slate-500" />
                        <span className="truncate max-w-[140px]">
                          {cardName || (rec.forma_pagamento === 'cartao_credito' ? 'Cartão' : 'Conta')}
                          {rec.num_parcelas && rec.num_parcelas > 1 ? ` (${rec.num_parcelas}x)` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover action bar or footer buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-1 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isDataVariavel ? (
                        <button
                          onClick={() => {
                            const mockProvisao = { ...rec, valorPrevisto: rec.valor !== null ? Number(rec.valor) : 0, isPago: false };
                            handleOpenEfetivarModal(mockProvisao);
                          }}
                          disabled={isEfetivadoThisMonth}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all text-center ${isEfetivadoThisMonth ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800' : 'bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#CA8A04] border border-[#FEF08A] cursor-pointer'}`}
                          title={isEfetivadoThisMonth ? "Já efetivado neste mês" : "Efetivar Pagamento"}
                        >
                          <Check size={10} strokeWidth={3} />
                          Efetivar
                        </button>
                      ) : isScheduledForYear ? (
                        <button
                          onClick={() => {
                            handleCancelFutureLaunches(rec);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[11px] font-[800] border border-orange-100 dark:border-orange-900/40 transition-all text-center cursor-pointer"
                          title="Cancelar agenda deste modelo"
                        >
                          <AlertCircle size={10} strokeWidth={3} />
                          Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setReactivateModal({ isOpen: true, rec });
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold border border-blue-100 dark:border-blue-900/45 transition-all text-center cursor-pointer"
                          title="Lançar/Agendar para o ano selecionado"
                        >
                          <Play size={10} fill="currentColor" />
                          Lançar
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingRec(rec);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 dark:text-slate-550 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                        title="Editar Modelo"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleExcluirModelo(rec)}
                        className="p-2 rounded-xl text-slate-400 dark:text-slate-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                        title="Excluir Modelo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-10">
                {mensais.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest text-slate-450 dark:text-slate-500 uppercase select-none">
                      MENSAIS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mensais.map(renderCardModel)}
                    </div>
                  </div>
                )}

                {anuais.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest text-slate-450 dark:text-slate-500 uppercase select-none">
                      ANUAIS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {anuais.map(renderCardModel)}
                    </div>
                  </div>
                )}

                {outrasFrequencias.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest text-slate-450 dark:text-slate-500 uppercase select-none">
                      OUTRAS CONTAS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {outrasFrequencias.map(renderCardModel)}
                    </div>
                  </div>
                )}

                {variaveis.length > 0 && (
                  <div className="space-y-4 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black tracking-widest text-slate-450 dark:text-slate-500 uppercase select-none flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      CONTAS COM DIA VARIÁVEL
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {variaveis.map(renderCardModel)}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'direto' && (
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800">
              <RefreshCw size={36} className="text-[#3B82F6] animate-spin mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Carregando lançamentos rápidos...</p>
            </div>
          ) : provisoesRaw.filter(r => r.lancamento_rapido === true).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#334155] p-6 text-center">
              <Calendar size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-black text-sm mb-1">Nenhum lançamento rápido cadastrado</p>
              <p className="text-slate-400 text-xs max-w-md">Crie suas contas com Lançamento Rápido ativado para ver aqui.</p>
            </div>
          ) : (() => {
            const contasRapidas = provisoesRaw.filter(r => r.lancamento_rapido === true);
            const mensais = contasRapidas.filter(r => r.frequencia === 'mensal');
            const anuais = contasRapidas.filter(r => r.frequencia === 'anual');
            const outrasFrequencias = contasRapidas.filter(r => r.frequencia !== 'mensal' && r.frequencia !== 'anual');

            const renderCardModel = (rec: any) => {
              const cat = rec.categories;
              const categoryColor = cat?.cor || '#64748B';
              const valorPrevisto = rec.valor !== null ? Number(rec.valor) : null;
              const cardName = rec.cards?.nome;

              return (
                <div
                  key={rec.id}
                  id={`model-card-${rec.id}`}
                  className="bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-blue-200 dark:hover:border-blue-900 transition-all gap-5 min-h-[160px]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base font-black text-slate-800 dark:text-white leading-tight tracking-tight max-w-[70%] truncate">
                        {rec.nome}
                      </h4>
                      {/* Removing badge because "Lancamento Rapido" does not track past/future agendamento status */}
                    </div>

                    <div>
                      {valorPrevisto !== null ? (
                        <p className={`text-xl font-black ${valorPrevisto === 0 ? 'text-slate-800 dark:text-white' : (rec.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]')}`}>
                          {valorPrevisto === 0 ? '' : (rec.tipo === 'receita' ? '+' : '-')} {formatCurrency(Math.abs(valorPrevisto))}
                        </p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold italic">
                          Valor Variável
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-550 font-bold">
                      <div className="flex items-center gap-1.5 leading-none">
                        <CreditCard size={13} className="text-slate-400 dark:text-slate-500" />
                        <span className="truncate max-w-[140px]">
                          {cardName || (rec.forma_pagamento === 'cartao_credito' ? 'Cartão' : 'Conta')}
                          {rec.num_parcelas && rec.num_parcelas > 1 ? ` (${rec.num_parcelas}x)` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-1 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            const p = {
                              ...rec,
                              valorPrevisto: rec.valor || 0,
                              currentParcela: null
                            };
                            handleOpenEfetivarModal(p);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-[0_4px_14px_rgba(59,130,246,0.25)] transition-all text-center cursor-pointer"
                          title="Efetivar Lançamento"
                        >
                          <Check size={13} strokeWidth={3} />
                          Efetivar
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingRec(rec);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 dark:text-slate-550 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                        title="Editar Modelo"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleExcluirModelo(rec)}
                        className="p-2 rounded-xl text-slate-400 dark:text-slate-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                        title="Excluir Modelo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-10">
                {contasRapidas.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contasRapidas.map(renderCardModel)}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {false && activeTab === 'direto' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA ESQUERDA: FORMULÁRIO DE LANÇAMENTO (7 COLS) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] rounded-[24px] p-6 md:p-8 border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-white leading-tight flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500 animate-pulse" />
                Lançamento Rápido no Extrato
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                Insira movimentações avulsas direto na conta corrente ou de crédito, ideal para rendimentos e consumos frequentes.
              </p>
            </div>

            {/* FEEDBACK DE SUCESSO */}
            <AnimatePresence>
              {rapidoSucessoMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1">
                      Lançado no Extrato!
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                      {rapidoSucessoMsg}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORMULÁRIO */}
            <div className="space-y-5">
              
              {/* TIPO */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                  Tipo de Lançamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRapidoTipo('receita')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold border-[1.5px] transition-all cursor-pointer ${
                      rapidoTipo === 'receita'
                        ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.1)]'
                        : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <TrendingUp size={14} strokeWidth={2.5} />
                    RECEITA (+)
                  </button>
                  <button
                    onClick={() => setRapidoTipo('despesa')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold border-[1.5px] transition-all cursor-pointer ${
                      rapidoTipo === 'despesa'
                        ? 'bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444] border-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.1)]'
                        : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <TrendingDown size={14} strokeWidth={2.5} />
                    DESPESA (-)
                  </button>
                </div>
              </div>

              {/* VALOR COPIADO DO TEMA */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                  Valor em Reais (BRL)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400 dark:text-slate-500 select-none">
                    R$
                  </div>
                  <input
                    type="text"
                    value={(() => {
                      const centsNum = parseInt(rapidoValorStr) || 0;
                      return (centsNum / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                    })()}
                    onChange={handleRapidoValorChange}
                    className="w-full text-2xl font-black pl-14 pr-4 py-4 rounded-[14px] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all font-mono tracking-tight animate-none"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Digite os números continuamente. O sistema formatará as casas decimais.
                </p>
              </div>

              {/* DETALHES COMPLEMENTARES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                    Descrição do Item
                  </label>
                  <input
                    type="text"
                    value={rapidoDesc}
                    onChange={(e) => setRapidoDesc(e.target.value)}
                    placeholder="Ex: Rendimento MP"
                    className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-3 text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                    Data do Lançamento
                  </label>
                  <input
                    type="date"
                    value={rapidoData}
                    onChange={(e) => setRapidoData(e.target.value)}
                    className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-3 text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* TAG / CATEGORIA */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                  Tag / Categoria Associada
                </label>
                <div className="relative">
                  <select
                    value={rapidoTagId}
                    onChange={(e) => setRapidoTagId(e.target.value)}
                    className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-3 pr-10 text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    {!rapidoTagId && <option value="">Selecione uma tag...</option>}
                    {tags.map((tag) => {
                      const cat = categories.find(c => c.id === tag.category_id);
                      if (!cat || cat.tipo !== rapidoTipo) return null;
                      return (
                        <option key={tag.id} value={tag.id}>
                          {cat.nome} &rarr; {tag.nome}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
                </div>
              </div>

              {/* MEIO DE PAGAMENTO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                    Forma de Pagamento
                  </label>
                  <div className="relative">
                    <select
                      value={rapidoFormaPgto}
                      onChange={(e) => {
                        const val = e.target.value as 'conta_corrente' | 'cartao_credito';
                        setRapidoFormaPgto(val);
                        if (val === 'cartao_credito' && userCards.length > 0 && !rapidoCardId) {
                          setRapidoCardId(userCards[0].id);
                        }
                      }}
                      className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-3 pr-10 text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="conta_corrente">{isBusiness ? 'Conta' : 'Conta Corrente / Saldo'}</option>
                      {userCards.length > 0 && <option value="cartao_credito">Cartão de Crédito</option>}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
                  </div>
                </div>

                {rapidoFormaPgto === 'cartao_credito' && userCards.length > 0 && (
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8] dark:text-[#64748B] block mb-2 select-none">
                      Escolher Cartão
                    </label>
                    <div className="relative">
                      <select
                        value={rapidoCardId}
                        onChange={(e) => setRapidoCardId(e.target.value)}
                        className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-3 pr-10 text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                        {userCards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.nome}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÃO */}
              <button
                onClick={handleLancarDireto}
                disabled={lancandoRapido}
                className="w-full py-4 rounded-[16px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 select-none border-none"
              >
                {lancandoRapido ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Efetuando Lançamento Direto...
                  </>
                ) : (
                  <>
                    <Plus size={15} strokeWidth={2.5} />
                    Lançar no Extrato Agora
                  </>
                )}
              </button>

            </div>
          </div>

          {/* COLUNA DIREITA: MODELOS DE FREQUENTES */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <h4 className="text-sm font-black text-[#0F172A] dark:text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                💡 Atalhos Diários
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-5 font-bold leading-relaxed">
                Clique nos atalhos rápidos abaixo para preencher o formulário instantaneamente e facilitar o seu lançamento.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { nome: 'Rendimento MP', tipo: 'receita', tagsBusca: ['Rendimento', 'Investimento', 'Outros'] },
                  { nome: 'Rendimento Nubank', tipo: 'receita', tagsBusca: ['Rendimento', 'Investimento', 'Outros'] },
                  { nome: 'Rendimento PicPay', tipo: 'receita', tagsBusca: ['Rendimento', 'Investimento', 'Outros'] },
                  { nome: 'Pix Recebido', tipo: 'receita', tagsBusca: ['Vendas', 'Presta', 'Outros'] },
                  { nome: 'Café / Padaria', tipo: 'despesa', tagsBusca: ['Alimentação', 'Consumo', 'Outros'] },
                  { nome: 'Tarifa / Serviços', tipo: 'despesa', tagsBusca: ['Tarifas', 'Outros'] },
                ].map((preset) => {
                  const isRevenue = preset.tipo === 'receita';
                  return (
                    <div
                      key={preset.nome}
                      onClick={() => {
                        setRapidoDesc(preset.nome);
                        setRapidoTipo(preset.tipo as 'receita' | 'despesa');
                        
                        // Pick best matching tag for the preset
                        const bestTag = (() => {
                          for (const searchName of preset.tagsBusca) {
                            const found = tags.find(t => {
                              const c = categories.find(cat => cat.id === t.category_id);
                              return c && c.tipo === preset.tipo && t.nome.toLowerCase().includes(searchName.toLowerCase());
                            });
                            if (found) return found.id;
                          }
                          const matchingTags = tags.filter(t => {
                            const c = categories.find(cat => cat.id === t.category_id);
                            return c && c.tipo === preset.tipo;
                          });
                          return matchingTags[0]?.id || '';
                        })();

                        if (bestTag) {
                          setRapidoTagId(bestTag);
                        }
                      }}
                      className="group flex items-center justify-between p-4 rounded-2xl border-[1.5px] border-slate-100 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-700/50 hover:bg-[#F8FAFC] dark:hover:bg-[#000000]/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isRevenue ? 'bg-emerald-50 dark:bg-green-950/40 text-[#16A34A]' : 'bg-red-50 dark:bg-red-950/40 text-[#EF4444]'
                        }`}>
                          {isRevenue ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            {preset.nome}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {isRevenue ? 'Rendimento / Entrada' : 'Saída Direta'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                        Usar &rarr;
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD EXPLICATIVO */}
            <div className="bg-blue-50/50 dark:bg-blue-950/10 border-dashed border-2 border-blue-100 dark:border-blue-900/50 rounded-[24px] p-6">
              <h5 className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Info size={13} className="text-blue-600 dark:text-blue-400" />
                Como funciona o acúmulo?
              </h5>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed font-semibold">
                Se você costuma acumular vários dias de rendimento (ex: Mercado Pago) antes de registrar, basta clicar no atalho <strong>Rendimento MP</strong>, ajustar a data se preferir e digitar o valor consolidado de todos os dias. Isso alimentará seu extrato de saldo real sem sujar seu cronograma de contas agendadas!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RECURRING MODAL COMPONENT */}
      <RecurringModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          setEditingRec(null);
          triggerRefresh();
        }}
        recorrencia={editingRec}
        activeProfileId={activeProfileId}
        categories={categories}
        tags={tags}
        initialType={modalType}
      />

      {/* EFETIVAR / COMPROMISSO MODAL */}
      <AnimatePresence>
        {efetivarModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Efetivar Provisão</h3>
                <p className="text-xs text-slate-400 font-medium">Confirme o valor para o lançamento real no seu caixa.</p>
              </div>

              {/* Form elements */}
              <div className="space-y-4">
                {/* Description info */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Descrição</span>
                  <p className="font-extrabold text-slate-750 dark:text-slate-200 text-sm">
                    {efetivarModal.provisao.nome} {efetivarModal.provisao.num_parcelas > 1 ? `(${efetivarModal.parcelaNum}/${efetivarModal.provisao.num_parcelas})` : ''}
                    {efetivarModal.provisao.valor !== null && ` - ${formatCurrency(efetivarModal.provisao.valor)}`}
                  </p>
                </div>

                {/* Data de Pagamento Input - Only for Empresa */}
                {isBusiness && (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Data de Pagamento</label>
                    <input
                      type="date"
                      value={efetivarData}
                      onChange={e => setEfetivarData(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                )}

                {/* Input Value - only shown if variable/null value */}
                {efetivarModal.provisao.valor === null && (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Valor Efetivado (R$)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">R$</span>
                      <input 
                        type="text"
                        value={centsToFormattedCurrency(efetivarValorStr).replace('R$', '').trim()}
                        onChange={formatCentsChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-base font-black text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  onClick={() => setEfetivarModal(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-[#334155] rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteEfetivacao}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-black text-white hover:scale-102 transition-all active:scale-95"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* DELETE DIALOG MODAL */}
      <AnimatePresence>
        {deleteModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-sm w-full p-6 space-y-4 shadow-2xl text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Remover Provisão?</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Deseja realmente excluir o modelo de provisão "{deleteModal.nome}"? Lançamentos futuros não serão mais exibidos.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeExcluirModelo}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-black text-white hover:scale-102 transition-all active:scale-95"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* REACTIVATE / LAUNCH FOR YEAR MODAL */}
      <AnimatePresence>
        {reactivateModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-sm w-full p-6 space-y-4 shadow-2xl text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
                <Play size={22} fill="currentColor" />
              </div>
              
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Confirmar Lançamento na Agenda?</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  Deseja projetar as parcelas de <strong className="text-slate-700 dark:text-slate-200">"{reactivateModal.rec.nome}"</strong> na agenda até dezembro de {selectedDate.getFullYear()}?
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Todos os meses subsequentes serão ativados.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  disabled={reactivating}
                  onClick={() => setReactivateModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  disabled={reactivating}
                  onClick={executeReactivateRecurrence}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5 hover:scale-102 transition-all active:scale-95"
                >
                  {reactivating ? (
                    <>
                      <RotateCcw size={12} className="animate-spin" />
                      Lançando...
                    </>
                  ) : (
                    'Confirmar Lançamento'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCEL FUTURE LAUNCHES MODAL */}
      <AnimatePresence>
        {cancelFutureModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
                <XCircle size={22} />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">
                  Cancelar Assinatura?
                </h3>
                <p className="text-xs text-slate-400 font-medium px-2">
                  Deseja realmente cancelar a assinatura <strong className="text-slate-700 dark:text-slate-200">"{cancelFutureModal.rec.nome}"</strong>?
                </p>

                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl border border-orange-100/50 dark:border-orange-950/30 text-xs text-slate-650 dark:text-slate-350 text-left space-y-2.5">
                  <div className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Fim de Cobranças:</strong> Interrompe a geração e lembretes de novas ocorrências a partir do mês atual.
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Histórico Preservado:</strong> Todos os seus lançamentos reais realizados continuam salvos e intactos no banco de dados.
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Modelo de Conta Mantido:</strong> O modelo recorrente continuará disponível na aba "CONTAS" como <strong className="text-orange-600 dark:text-orange-400 font-extrabold">CANCELADA</strong>, permitindo que você reative a assinatura no futuro quando desejar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  disabled={cancelingFuture}
                  onClick={() => setCancelFutureModal(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Manter Assinatura
                </button>
                <button
                  disabled={cancelingFuture}
                  onClick={executeCancelFutureLaunches}
                  className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-black text-white hover:scale-102 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {cancelingFuture ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    'Cancelar Assinatura'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXCLUSÃO/IGNORAR DE PROVISÃO INDIVIDUAL */}
      <AnimatePresence>
        {ignoreProvisaoModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-sm w-full p-6 space-y-4 shadow-2xl text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Excluir Lançamento?</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  Deseja realmente ignorar/excluir o agendamento de <strong className="text-slate-700 dark:text-slate-200">"{ignoreProvisaoModal.provisao.nome}"</strong> para {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}?
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Esta ação excluirá apenas este lançamento específico deste mês.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIgnoreProvisaoModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeIgnoreProvisao}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-black text-white hover:scale-102 transition-all active:scale-95"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
