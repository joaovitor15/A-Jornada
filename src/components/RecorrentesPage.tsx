import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Calendar, Check, Edit, Trash2, CreditCard, Tag as TagIcon, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Sparkles, 
  RefreshCw, AlertCircle, Plus, ChevronDown, CheckCircle2, RotateCcw,
  Play, Pause, Info, Wallet, Pencil, Search, XCircle, Landmark, Library, Tag, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecurringModal } from './RecurringModal';
import { useCategories } from '../hooks/useCategories';
import { useProfiles } from '../hooks/useProfiles';
import { ICONS } from '../pages/Categories';

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
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Filters
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'pendentes' | 'lancadas'>('pendentes');
  const [filtroNatureza, setFiltroNatureza] = useState<'despesa' | 'receita'>('despesa');

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
  const [efetivarMostrarOpcoes, setEfetivarMostrarOpcoes] = useState(false);
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
    const excludeTag = `${year}_${monthIndex}`;

    // Update locally first for immediate UI response
    const pIndex = provisoesRaw.findIndex(r => r.id === p.id);
    if (pIndex !== -1) {
      const updatedProvisoes = [...provisoesRaw];
      const currentExclusoes = updatedProvisoes[pIndex].exclusoes_pontuais || [];
      updatedProvisoes[pIndex] = { ...updatedProvisoes[pIndex], exclusoes_pontuais: [...currentExclusoes, excludeTag] };
      setProvisoesRaw(updatedProvisoes);
    }
    setIgnoreProvisaoModal(null);

    if (p.isPago && p.realizationId) {
      await supabase.from('transacoes').delete().eq('id', p.realizationId);
    }

    const currentExclusoes = p.exclusoes_pontuais || [];
    if (!currentExclusoes.includes(excludeTag)) {
      const newExclusoes = [...currentExclusoes, excludeTag];
      await supabase.from('transacoes_recorrentes').update({ exclusoes_pontuais: newExclusoes }).eq('id', p.id);
    }
    
    triggerRefresh();
  };

  const handleUndoIgnoreProvisao = async (p: any) => {
    const monthIndex = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const excludeTag = `${year}_${monthIndex}`;
    
    const pIndex = provisoesRaw.findIndex(r => r.id === p.id);
    if (pIndex !== -1) {
      const updatedProvisoes = [...provisoesRaw];
      const currentExclusoes = updatedProvisoes[pIndex].exclusoes_pontuais || [];
      updatedProvisoes[pIndex] = { ...updatedProvisoes[pIndex], exclusoes_pontuais: currentExclusoes.filter((t: string) => t !== excludeTag) };
      setProvisoesRaw(updatedProvisoes);
    }

    const currentExclusoes = p.exclusoes_pontuais || [];
    const newExclusoes = currentExclusoes.filter((t: string) => t !== excludeTag);
    await supabase.from('transacoes_recorrentes').update({ exclusoes_pontuais: newExclusoes }).eq('id', p.id);
    
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
      
      const startStr = `${startYear - 1}-12-01`;
      const endStr = `${startYear + 1}-01-31`;

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
  const findRealizationForProvision = (rec: any, transactions: any[], year: number, month: number, currentParcela: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const refTag = `(Ref: ${monthStr}/${year})`;

    return transactions.find(t => {
      // Prioritize explicit competence reference (if paid early/late in a different month)
      if (t.recorrente_id === rec.id && t.descricao && t.descricao.includes(refTag)) {
        return true;
      }
      
      // If it has A reference tag but it's NOT the current target's tag, it belongs to another month.
      if (t.descricao && t.descricao.includes('(Ref:') && !t.descricao.includes(refTag)) {
        return false;
      }

      const inTargetMonth = (() => {
        if (!t.data) return false;
        const [y, m, d] = t.data.split('-');
        return parseInt(y, 10) === year && parseInt(m, 10) === month + 1;
      })();

      if (!inTargetMonth) return false;

      // Primary strict FK match within the physical target month
      if (t.recorrente_id === rec.id) {
        // Strict match of parcel parity to allow independent tracks (overlapping) when properly launched.
        // For finite provisions, currentParcela increments per month limit.
        // For infinite provisions, currentParcela is ALWAYS 1, meaning secondary parcels of old tracks 
        // DO NOT satisfy this month's core demand.
        if (t.num_parcelas && t.num_parcelas !== currentParcela) {
          return false;
        }
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
          const diff = Math.abs(t.valor - Math.abs(Number(rec.valor)));
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
        
        // We no longer mathematically jump to the NEXT month if created after its due day.
        // It's better to show it in the current month so the user can see it right after creation.
        // const shiftDay = isBusiness && rec.dia_emissao ? Number(rec.dia_emissao) : (rec.dia_vencimento ? Number(rec.dia_vencimento) : 1);
        // const launchDay = launchDate.getDate();
        // if (launchDay > shiftDay) {
        //   startMonth += 1;
        //   if (startMonth > 11) {
        //     startMonth = 0;
        //     startYear += 1;
        //   }
        // }
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
    if (rec.num_parcelas && rec.num_parcelas > 1) {
      if (monthDiff < 0 || monthDiff >= rec.num_parcelas) {
        shouldRender = false;
      } else {
        currentParcela = monthDiff + 1;
        parcelaTexto = `(${currentParcela}/${rec.num_parcelas})`;
      }
    }

    let effStartYear = isNaN(startYear) ? new Date().getFullYear() : startYear;
    let effStartMonth = isNaN(startMonth) ? new Date().getMonth() : startMonth;

    // 2. Annual options
    let isOffMonth = false;
    if (rec.frequencia === 'anual') {
      const annualTarget = rec.mes_vencimento ? (rec.mes_vencimento - 1) : effStartMonth;
      if (selectedMonth !== annualTarget) {
        if (dashboardPeriodo === 'anual') {
          shouldRender = false;
        } else {
          isOffMonth = true;
        }
      }
    }

    // Check if there is an authorization trigger / realization for this month
    const realization = findRealizationForProvision(rec, realTransactions, selectedYear, selectedMonth, currentParcela);

    const fazerProjecao = rec.frequencia === 'diaria' ? rec.dia_vencimento === 1 : true;
    
    let isPago = !!realization;
    // Para diárias sem projeção, o card atua como template e nunca fica bloqueado como "Já pago neste mês"
    if (rec.frequencia === 'diaria' && !fazerProjecao) {
      isPago = false;
    }

    if (isPago) shouldRender = true; // Always show if there is a physical transaction

    // 3. Past boundary and Year boundary
    
    // Explicit fail-safe: Ensure no projection exists before the actual creation bounding month
    const projectedTimeId = selectedYear * 12 + selectedMonth;
    const creationTimeId = effStartYear * 12 + effStartMonth;

    if (!isPago && projectedTimeId < creationTimeId) {
      shouldRender = false;
    }

    // 4. Inactive/canceled check (ativa === false)
    if (rec.ativa === false && !isPago) {
      shouldRender = false;
    }

    // 5. Ignored/excluded specific occurrence check
    const isIgnored = (rec.exclusoes_pontuais || []).includes(`${selectedYear}_${selectedMonth}`);

    let valorPrevisto = rec.valor !== null ? Math.abs(Number(rec.valor)) : 0;
    
    // Estimativa técnica dinâmica para valores variáveis
    if ((rec.valor === null || rec.valor <= 0) && fazerProjecao) {
      const realizadosAnteriores = realTransactions.filter(t => t.recorrente_id === rec.id);
      if (realizadosAnteriores.length > 0) {
        const soma = realizadosAnteriores.reduce((acc, t) => acc + Math.abs(Number(t.valor)), 0);
        valorPrevisto = soma / realizadosAnteriores.length;
      } else {
        valorPrevisto = Math.abs(Number(rec.valor)) || 0;
      }
    }

    const valorEfetivado = isPago ? Number(realization.valor) : 0;

    return {
      ...rec,
      shouldRender,
      isPago,
      isIgnored,
      isOffMonth,
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

  if (dashboardPeriodo === 'anual') {
     targetProvisoesToComputeStats = [];
     for (let m = 0; m < 12; m++) {
        targetProvisoesToComputeStats.push(...getProcessedProvisoesForDate(selectedDate.getFullYear(), m));
     }
  }

  // Statistics calculation
  const statDespesasPrevistas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statDespesasPagas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && p.isPago && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorEfetivado, 0);

  const statDespesasPendentes = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'despesa' && !p.isPago && !p.isIgnored && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statReceitasPrevistas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'receita' && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statReceitasPendentes = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'receita' && !p.isPago && !p.isIgnored && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const statReceitasRecebidas = targetProvisoesToComputeStats
    .filter(p => p.tipo === 'receita' && p.isPago && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos')
    .reduce((sum, p) => sum + p.valorEfetivado, 0);

  // Accomplished progress
  const despesasCount = targetProvisoesToComputeStats.filter(p => p.tipo === 'despesa' && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos').length;
  const despesasPagasCount = targetProvisoesToComputeStats.filter(p => p.tipo === 'despesa' && p.isPago && !p.isOffMonth && p.categories?.nome?.toLowerCase() !== 'investimentos').length;

  // Filter dynamic list based on state
  let listagemFiltrada = targetProvisoesToComputeStats.filter(p => {
    if (p.tipo !== filtroNatureza) return false;

    // 1. Busca
    if (busca) {
      const termo = busca.toLowerCase();
      const nomeMatch = (p.nome || '').toLowerCase().includes(termo);
      const categoryMatch = (p.categories?.nome || '').toLowerCase().includes(termo);
      if (!nomeMatch && !categoryMatch) return false;
    }

    return true;
  });

  // Remove duplicates if viewing anual, so we don't display 12 cards the same
  if (dashboardPeriodo === 'anual') {
    const seenIds = new Set();
    listagemFiltrada = listagemFiltrada.filter(item => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });
  }

  // Sort: Pending items first, then by Day. Paid or Ignored goes to the bottom.
  listagemFiltrada.sort((a, b) => {
    const getStatusRank = (item: any) => {
      if (item.isPago) return 3;
      if (item.isIgnored) return 2;
      if (item.isOffMonth) return 2;
      return 1; // Pending
    };

    const rankA = getStatusRank(a);
    const rankB = getStatusRank(b);

    if (rankA !== rankB) return rankA - rankB;

    const diaA = a.dia_vencimento || a.dia_emissao || 999;
    const diaB = b.dia_vencimento || b.dia_emissao || 999;
    return diaA - diaB;
  });

  const formatarDataCabecalhoRecorrente = (dataStr: string) => {
    if (dataStr === 'Sem Data') return dashboardPeriodo === 'anual' ? 'AGENDAMENTOS GERAIS DO ANO' : 'AGENDAMENTOS GERAIS DO MÊS';
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

    setEfetivarMostrarOpcoes(false);

    const valorCentavos = (p.valor === null || p.valor <= 0) ? '' : (p.valorPrevisto ? Math.round(p.valorPrevisto * 100).toString() : '');
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
    const yearOrig = selectedDate.getFullYear();
    const monthOrig = selectedDate.getMonth();
    
    if (p.dia_vencimento) {
      let year = yearOrig;
      let month = monthOrig;
      
      if (p.frequencia === 'anual' && p.mes_vencimento) {
        month = p.mes_vencimento - 1;
      }
      
      let targetDay = Number(p.dia_vencimento);
      
      if (isBusiness && p.dia_emissao && targetDay < Number(p.dia_emissao)) {
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
    } else {
      // If no fix day, default to today if in current month, or 1st day of target month
      const maxDayInMonth = new Date(yearOrig, monthOrig + 1, 0).getDate();
      let targetDay = Math.min(new Date().getDate(), maxDayInMonth);
      defaultData = `${yearOrig}-${String(monthOrig + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
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
      
      let descExibida = baseDesc;
      descExibida = `${baseDesc} (Ref: ${monthStr}/${yearStr})`;

      const targetDate = efetivarData;

      const formaPgto = efetivarFormaPagamento;
      const cardId = formaPgto === 'cartao_credito' ? efetivarCartaoId : null;
      let usedParcelas = 1;
      
      // Se não é a primeira vez que algo é lançado para o ano e o model não tinha parcelas e o user quer parcelar AGORA...
      if (formaPgto === 'cartao_credito' && efetivarParcelas > 1) {
        usedParcelas = efetivarParcelas;
      } else if (formaPgto === 'cartao_credito' && provisao.num_parcelas > 1) {
        // Fallback for when they just click 'launch' and it was a registered installment plan in the provision
        usedParcelas = provisao.num_parcelas;
      }

      // Check if there is already an existing transaction linked to this recurrent model in the target month (to update instead of duplicating)
      const targetYear = selectedDate.getFullYear();
      const targetMonth = selectedDate.getMonth();
      const monthStart = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-01`;
      const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthEnd = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(maxDay).padStart(2, '0')}`;

      let checkQuery = supabase
        .from('transacoes')
        .select('id, data, num_parcelas, descricao')
        .eq('profile_id', activeProfileId)
        .eq('recorrente_id', provisao.id);

      // Broaden search to find the explicit reference tag across boundary months
      const targetYearPrev = targetMonth === 0 ? targetYear - 1 : targetYear;
      const targetMonthPrev = targetMonth === 0 ? 12 : targetMonth;
      const targetYearNext = targetMonth === 11 ? targetYear + 1 : targetYear;
      const targetMonthNext = targetMonth === 11 ? 1 : targetMonth + 2;
      
      const broadStart = `${targetYearPrev}-${String(targetMonthPrev).padStart(2, '0')}-01`;
      const nextMaxDay = new Date(targetYearNext, targetMonthNext, 0).getDate();
      const broadEnd = `${targetYearNext}-${String(targetMonthNext).padStart(2, '0')}-${String(nextMaxDay).padStart(2, '0')}`;
      
      checkQuery = checkQuery.gte('data', broadStart).lte('data', broadEnd);

      const { data: existingTransArr, error: checkError } = await checkQuery;

      if (checkError) throw checkError;

      const pNumToMatch = parcelaNum || 1;
      let existingTrans = null;
      
      if (provisao.frequencia !== 'diaria') {
        const refTag = `(Ref: ${String(targetMonth + 1).padStart(2, '0')}/${targetYear})`;
        existingTrans = existingTransArr?.find(t => 
          (t.descricao && t.descricao.includes(refTag)) &&
          (t.num_parcelas === pNumToMatch || (!t.num_parcelas && pNumToMatch === 1))
        ) || existingTransArr?.find(t => 
          // fallback to strict month boundary if refTag is somehow missing
          (t.data && t.data >= monthStart && t.data <= monthEnd) &&
          (t.num_parcelas === pNumToMatch || (!t.num_parcelas && pNumToMatch === 1))
        ) || null;
      }

      if (formaPgto === 'cartao_credito' && usedParcelas > 1) {
        // Handle full auto-launch for credit card installments to reflect completely in the user's extract
        const isFirstParcel = parcelaNum === 1;
        const totalParcelas = usedParcelas;
        
        let transacoesToInsert = [];
        
        // We always start mapping from the first parcel to the end, relying on targetDate as base if it's the first
        // If it's not the first, we just map the specific one they are trying to pay.
        if (isFirstParcel && !existingTrans) {
            const tempDate = new Date(`${targetDate}T12:00:00Z`);
            for (let i = 0; i < totalParcelas; i++) {
                const dt = new Date(tempDate);
                dt.setMonth(dt.getMonth() + i);
                const dataFormatada = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
                
                transacoesToInsert.push({
                   profile_id: activeProfileId,
                   tipo: provisao.tipo,
                   valor: valorNum / totalParcelas,
                   descricao: `${provisao.nome} (${i + 1}/${totalParcelas})`,
                   data: dataFormatada,
                   status: 'pago',
                   recorrente_id: provisao.id,
                   tag_id: provisao.tag_id,
                   forma_pagamento: formaPgto,
                   card_id: cardId,
                   num_parcelas: i + 1
                });
            }
            
            const { error: insertAllError } = await supabase.from('transacoes').insert(transacoesToInsert);
            if (insertAllError) throw insertAllError;
        } else {
            // Regular update or insert for specific parcel if > 1 or already exists
            const novaTransacao = {
              profile_id: activeProfileId,
              descricao: descExibida,
              valor: valorNum / totalParcelas,
              tipo: provisao.tipo,
              status: 'pago',
              forma_pagamento: formaPgto,
              card_id: cardId,
              data: targetDate,
              recorrente_id: provisao.id,
              num_parcelas: parcelaNum || null,
              tag_id: provisao.tag_id
            };
            if (existingTrans) {
              const { error } = await supabase.from('transacoes').update(novaTransacao).eq('id', existingTrans.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('transacoes').insert([novaTransacao]);
              if (error) throw error;
            }
        }
      } else {
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

        if (existingTrans) {
          const { error: updateTransError } = await supabase
            .from('transacoes')
            .update(novaTransacao)
            .eq('id', existingTrans.id);

          if (updateTransError) throw updateTransError;
        } else {
          const { error: insertTransError } = await supabase
            .from('transacoes')
            .insert([novaTransacao]);

          if (insertTransError) throw insertTransError;
        }
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
            Provisão
          </h2>
        </div>

        {/* LADO CENTRO - DATE & PERIOD SELECTOR */}
        <div className="flex flex-col gap-[12px] w-full md:w-auto flex-1 justify-center items-center shrink-0">
          <div className="flex flex-col md:flex-row items-center gap-[12px] w-full md:w-auto justify-center">
            
            <div className="order-2 md:order-1 flex items-center justify-center w-full md:w-auto">
              {/* Mês Dropdown */}
              {dashboardPeriodo === 'mensal' && (
                <div className="relative w-full md:w-auto flex-shrink-0">
                    <button 
                      onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
                      className="w-full md:w-auto flex justify-between md:justify-center items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                    >
                      {nomesMeses[mesAtual - 1]}
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
                            className="absolute left-0 right-0 md:right-auto mt-2 min-w-[200px] md:w-auto bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                          >
                            <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                              {nomesMeses.map((nome, i) => {
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
                                        ? 'bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-white font-bold' 
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
              )}
            </div>

            <div className="order-1 md:order-2 flex items-center justify-center w-full md:w-auto">
              {/* Ano Selector */}
              <div className="flex justify-between md:justify-center items-center gap-[10px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[16px] py-[8px] w-full md:w-auto">
                <button 
                  onClick={() => handleMudarAno(-1)} 
                  className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
                  {anoAtual}
                </span>
                <button 
                  onClick={() => handleMudarAno(1)} 
                  className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center w-full md:w-auto">
            {/* Toggle Mensal/Anual */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1E293B] p-1 rounded-[100px] border border-slate-200 dark:border-[#334155] shrink-0 w-full sm:w-auto">
              <button 
                onClick={() => setDashboardPeriodo('mensal')} 
                className={`flex-1 sm:flex-none px-[16px] py-[6px] rounded-full text-[13px] font-[700] transition-all cursor-pointer ${
                  dashboardPeriodo === 'mensal' 
                    ? 'bg-white dark:bg-[#334155] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setDashboardPeriodo('anual')} 
                className={`flex-1 sm:flex-none px-[16px] py-[6px] rounded-full text-[13px] font-[700] transition-all cursor-pointer ${
                  dashboardPeriodo === 'anual' 
                    ? 'bg-white dark:bg-[#334155] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Anual
              </button>
            </div>
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

      {/* SUMMARY DISPLAYS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-2">
        <div className="bg-white dark:bg-[#1E293B] border border-emerald-500/20 shadow-[0_2px_12px_rgba(16,185,129,0.06)] p-5 rounded-3xl flex flex-col justify-center items-center h-full">
          <span className="text-emerald-600/70 dark:text-emerald-500/70 text-[11px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 w-full justify-center text-center">
            {dashboardPeriodo === 'anual' ? `A Receber em ${anoAtual}` : `A Receber de ${nomesMeses[selectedDate.getMonth()]}`}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">
            +R$ {statReceitasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] border border-rose-500/20 shadow-[0_2px_12px_rgba(225,29,72,0.06)] p-5 rounded-3xl flex flex-col justify-center items-center h-full">
          <span className="text-rose-500/70 text-[11px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 w-full justify-center text-center">
            {dashboardPeriodo === 'anual' ? `A Pagar em ${anoAtual}` : `A Pagar de ${nomesMeses[selectedDate.getMonth()]}`}
          </span>
          <span className="text-rose-600 dark:text-rose-400 text-2xl font-black">
            -R$ {statDespesasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* NATUREZA TABS */}
      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl w-full md:w-max mt-4">
        <button
          onClick={() => setFiltroNatureza('despesa')}
          className={`flex-1 md:w-40 py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${filtroNatureza === 'despesa' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Despesas
        </button>
        <button
          onClick={() => setFiltroNatureza('receita')}
          className={`flex-1 md:w-40 py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${filtroNatureza === 'receita' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Receitas
        </button>
      </div>

      {/* FREQUENCY GROUPED LIST */}
      <div className="space-y-8 mt-8">
        {listagemFiltrada.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <Library size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Nenhum registro encontrado</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Você ainda não tem lançamentos planejados nesta categoria.<br/>
              Clique no botão "Planejar Conta" acima para começar.
            </p>
          </div>
        ) : (
          (['diaria', 'semanal', 'mensal', 'mensal_sem_data', 'anual', 'anual_sem_data'] as const).map(freqKey => {
            const items = listagemFiltrada.filter(p => {
               const freq = p.frequencia || 'mensal';
               const isSemData = !p.dia_vencimento && !p.dia_emissao;
               if (freqKey === 'mensal_sem_data') return freq === 'mensal' && isSemData;
               if (freqKey === 'mensal') return freq === 'mensal' && !isSemData;
               if (freqKey === 'anual_sem_data') return freq === 'anual' && isSemData;
               if (freqKey === 'anual') return freq === 'anual' && !isSemData;
               return freq === freqKey;
            });
            
            if (items.length === 0) return null;

            const freqLabel = {
              diaria: 'Frequência Diária',
              semanal: 'Frequência Semanal',
              mensal: 'Frequência Mensal',
              mensal_sem_data: 'Frequência Mensal, Sem dia fixo',
              anual: 'Frequência Anual',
              anual_sem_data: 'Frequência Anual, Sem dia fixo'
            }[freqKey];

            return (
              <div key={freqKey} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white capitalize">
                    {freqLabel}
                  </h3>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => {
                  const IconComp = ICONS.find(i => i.name === item.categories?.icone)?.component || Landmark;
                  
                  // Calcular Custo para o restante do ano (a partir do mês selecionado)
                  let custoAnual = item.valorPrevisto;
                  
                  const realYear = new Date().getFullYear();
                  let startMonthIndex = selectedDate.getMonth();
                  if (anoAtual > realYear) {
                    startMonthIndex = 0; // Se o ano é posterior, projetamos o ano cheio (desde Janeiro)
                  } else if (anoAtual < realYear) {
                    startMonthIndex = 12; // Se o ano já passou, 0 meses restantes
                  }
                  
                  let mesesRestantes = Math.max(0, 12 - startMonthIndex);
                  
                  let periodoTexto = '';
                  
                  const fazerProjecao = item.frequencia === 'diaria' ? item.dia_vencimento === 1 : true;

                  if (item.frequencia === 'mensal') {
                    let qtd = (item.isPago || item.isIgnored) ? Math.max(0, mesesRestantes - 1) : mesesRestantes;
                    custoAnual = item.valorPrevisto * qtd;
                    periodoTexto = `${qtd} ${qtd === 1 ? 'MÊS' : 'MESES'}`;
                  } else if (item.frequencia === 'diaria') {
                    if (fazerProjecao) {
                      let dias = Math.round((new Date(anoAtual, 11, 31).getTime() - new Date(anoAtual, startMonthIndex, 1).getTime()) / (1000 * 3600 * 24)) + 1;
                      let qtd = (item.isPago || item.isIgnored) ? Math.max(0, dias - 1) : dias;
                      custoAnual = item.valorPrevisto * qtd;
                      periodoTexto = `${qtd} DIAS`;
                    } else {
                      custoAnual = 0;
                      periodoTexto = '';
                    }
                  } else if (item.frequencia === 'semanal') {
                    let semanas = Math.round((new Date(anoAtual, 11, 31).getTime() - new Date(anoAtual, startMonthIndex, 1).getTime()) / (1000 * 3600 * 24) / 7);
                    let qtd = (item.isPago || item.isIgnored) ? Math.max(0, semanas - 1) : semanas;
                    custoAnual = item.valorPrevisto * qtd;
                    periodoTexto = `${qtd} SEM.`;
                  } else if (item.frequencia === 'anual') {
                    let qtd = (item.isPago || item.isIgnored) ? 0 : 1;
                    custoAnual = item.valorPrevisto * qtd;
                    periodoTexto = '';
                  }
                  
                  return (
                  <div 
                    key={item.id}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-[#8B5CF6]" />
                          <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-widest">
                            {item.nome}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[10px] font-bold uppercase tracking-widest leading-none">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            <TagIcon size={12} /> {item.tags?.nome || item.categories?.nome || 'SEM TAG'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          {item.frequencia === 'diaria' ? (
                            <span className="text-[#8B5CF6] dark:text-[#A78BFA] whitespace-nowrap">{item.forma_pagamento === 'cartao_credito' ? `${item.cards?.nome || 'Cartão'}${item.num_parcelas > 1 ? ` (${item.num_parcelas}x)` : ''}` : 'CONTA'}</span>
                          ) : item.dia_vencimento ? (
                            <span className="text-[#8B5CF6] dark:text-[#A78BFA] flex items-center gap-1 whitespace-nowrap">
                              <Calendar size={11} className="inline shrink-0" /> {isBusiness && item.dia_emissao ? `TIRAR DIA ${item.dia_emissao} • PAGAR DIA ${item.dia_vencimento}` : `DIA ${item.dia_vencimento}`} {item.frequencia === 'anual' && item.mes_vencimento ? `DE ${nomesMeses[item.mes_vencimento - 1].toUpperCase()}` : ''}
                              <span className="text-slate-300 dark:text-slate-600 mx-1 inline-block">•</span>
                              <span>{item.forma_pagamento === 'cartao_credito' ? `${item.cards?.nome || 'Cartão'}${item.num_parcelas > 1 ? ` (${item.num_parcelas}x)` : ''}` : 'CONTA'}</span>
                            </span>
                          ) : (
                            <span className="text-amber-500 dark:text-amber-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="whitespace-nowrap">{item.frequencia === 'anual' && item.mes_vencimento ? nomesMeses[item.mes_vencimento - 1].toUpperCase() : 'SEM DIA FIXO'}</span>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="text-[#8B5CF6] dark:text-[#A78BFA] whitespace-nowrap">{item.forma_pagamento === 'cartao_credito' ? `${item.cards?.nome || 'Cartão'}${item.num_parcelas > 1 ? ` (${item.num_parcelas}x)` : ''}` : 'CONTA'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          className="flex items-center justify-center text-[#3B82F6] hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setModalType(item.tipo);
                            setEditingRec(item);
                            setIsModalOpen(true);
                          }}
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className="flex items-center justify-center text-[#EF4444] hover:opacity-80 transition-opacity"
                          onClick={() => setDeleteModal({ isOpen: true, id: item.id, nome: item.nome })}
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 mb-5 border-t border-dashed border-slate-300 dark:border-slate-600 box-border"></div>

                    {/* Stats Grid */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mt-2 mb-5 px-2">
                      <div className="flex flex-col items-center w-full md:w-auto md:flex-1 order-1">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-2 whitespace-nowrap text-center">
                        {dashboardPeriodo === 'anual' ? 'VALOR DA PARCELA' : (item.isOffMonth && !item.isPago && !item.isIgnored ? (item.frequencia === 'anual' ? (item.tipo === 'receita' ? 'VALOR RECEBIDO' : 'VALOR PAGO') : 'FORA DO MÊS ALVO') : (item.isIgnored ? 'NÃO LANÇADO' : (item.isPago ? (item.tipo === 'receita' ? 'VALOR RECEBIDO' : 'VALOR PAGO') : 'VALOR DA PARCELA')))}
                        </p>
                        <div className={`flex flex-col items-center justify-center ${dashboardPeriodo !== 'anual' && item.isIgnored ? 'opacity-50 line-through' : ''}`}>
                          {item.valor === null && (!fazerProjecao || (item.valorPrevisto === 0 && !item.isPago)) ? (
                            <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 mb-1">Valor Variável</span>
                          ) : (
                            <p className="text-2xl font-black text-slate-800 dark:text-white">
                              {formatarMoedaSinal(dashboardPeriodo === 'anual' ? item.valorPrevisto : (item.isPago ? item.valorEfetivado : item.valorPrevisto), true)}
                            </p>
                          )}
                        </div>
                        {(item.valor === null || item.valor < 0) && fazerProjecao && (
                          <span className="text-[9px] font-black bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md mt-1 scale-95 uppercase tracking-wider whitespace-nowrap">
                            Variável estim.
                          </span>
                        )}
                      </div>

                      {fazerProjecao && (
                        <div className="flex flex-col items-center w-full md:w-auto md:flex-1 order-2">
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-2 whitespace-nowrap text-center">CUSTO {anoAtual} {periodoTexto ? `(${periodoTexto})` : ''}</p>
                          <div className="flex flex-col items-center justify-center">
                            {item.valor === null && item.valorPrevisto === 0 && !item.isPago ? (
                              <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 mb-1">Valor Variável</span>
                            ) : (
                              <p className="text-2xl font-black text-slate-800 dark:text-white">
                                {formatarMoedaSinal(item.tipo === 'despesa' ? -custoAnual : custoAnual, true)}
                              </p>
                            )}
                          </div>
                          {(item.valor === null || item.valor < 0) && (
                            <span className="text-[9px] font-black bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md mt-1 scale-95 uppercase tracking-wider whitespace-nowrap">
                              Variável estim.
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto space-y-2">
                      {dashboardPeriodo === 'anual' ? (
                        <div className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                          <LayoutDashboard size={18} />
                          Provisão Contínua {anoAtual}
                        </div>
                      ) : item.isIgnored ? (
                        <button
                          onClick={() => handleUndoIgnoreProvisao(item)} 
                          className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={18} />
                          Desfazer "Não Lançado"
                        </button>
                      ) : item.isPago ? (
                        <div className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                          <CheckCircle2 size={18} />
                          {item.tipo === 'receita' ? 'Já recebido neste mês' : 'Já pago neste mês'}
                        </div>
                      ) : item.isOffMonth ? (
                        <div className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                          <CheckCircle2 size={18} />
                          {item.frequencia === 'anual' ? (item.tipo === 'receita' ? 'Já recebido neste ano' : 'Já pago neste ano') : (item.tipo === 'receita' ? 'Fora do mês' : 'Fora do mês')}
                        </div>
                      ) : (
                        <div className="flex flex-row gap-2">
                          <button 
                            onClick={async () => {
                                handleIgnoreProvisao(item);
                            }}
                            className="flex-1 py-2.5 px-2 rounded-[14px] text-xs sm:text-[13px] font-bold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <XCircle size={16} />
                            Não Lançar
                          </button>
                          <button 
                            onClick={() => handleOpenEfetivarModal(item)}
                            className={`flex-[1.5] py-2.5 px-3 rounded-[14px] text-xs sm:text-[13px] font-bold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                                item.tipo === 'receita' 
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white'
                              }`}
                          >
                            <CheckCircle2 size={16} />
                            Lançar agora
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          );
        })
      )}
      </div>

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
        selectedDate={selectedDate}
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

                {/* Data de Pagamento Input */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Data do Pagamento</label>
                  <input
                    type="date"
                    value={efetivarData}
                    onChange={e => setEfetivarData(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                {/* Input Value - Always show if variable, OR if options are expanded */}
                {(efetivarModal.provisao.valor === null || efetivarModal.provisao.valor < 0 || efetivarMostrarOpcoes) && (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">
                      Valor Efetivado (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">R$</span>
                      <input 
                        type="text"
                        value={centsToFormattedCurrency(efetivarValorStr).replace('R$', '').trim()}
                        onChange={formatCentsChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-base font-black text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                      Você pode alterar o valor exato no momento de lançar caso ele mude neste ciclo (ótimo para gastos variáveis ou reajustes).
                    </p>
                  </div>
                )}

                {/* Payment overrides - ONLY shown if explicitly expanded */}
                {efetivarMostrarOpcoes && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Pagamento</label>
                      <select
                        value={efetivarFormaPagamento}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setEfetivarFormaPagamento(val);
                          if (val === 'cartao_credito' && !efetivarCartaoId && userCards.length > 0) {
                            setEfetivarCartaoId(userCards[0].id);
                          } else if (val === 'conta_corrente') {
                            setEfetivarParcelas(1);
                          }
                        }}
                         className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-[9px] px-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                      >
                        <option value="conta_corrente">Conta / Pix</option>
                        {userCards.length > 0 && <option value="cartao_credito">Cartão de Crédito</option>}
                      </select>
                    </div>
                    
                    {efetivarFormaPagamento === 'cartao_credito' && (
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Cartão</label>
                        <select
                          value={efetivarCartaoId || ''}
                          onChange={(e) => setEfetivarCartaoId(e.target.value)}
                           className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-[9px] px-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#3B82F6]"
                        >
                          {userCards.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {efetivarFormaPagamento === 'cartao_credito' && (
                      <div className="col-span-2 flex items-center gap-3 bg-[#F8FAFC] dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="w-[80px]">
                          <label className="block text-[9px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                            Parcelas
                          </label>
                          <input
                            type="number"
                            min="1"
                            inputMode="numeric"
                            placeholder="1"
                            value={efetivarParcelas}
                            onChange={(e) => setEfetivarParcelas(parseInt(e.target.value) || 1)}
                            className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg px-2 py-1.5 text-xs font-bold text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-all"
                          />
                        </div>

                        {efetivarParcelas > 1 && (
                          <div className="flex-1">
                            <label className="block text-[9px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                              Valor p/ Parcela
                            </label>
                            <div className="w-full h-[28px] bg-slate-100/50 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-[#334155] rounded-lg px-3 flex items-center text-xs font-bold text-[#2563EB] dark:text-blue-400">
                              {formatCurrency((parseCentsToNumber(efetivarValorStr) / efetivarParcelas) || 0)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Não Lançar neste mês?</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  Deseja realmente ignorar o agendamento de <strong className="text-slate-700 dark:text-slate-200">"{ignoreProvisaoModal.provisao.nome}"</strong> para {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}?
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Ele ficará marcado como "Não Lançado", mas voltará a aparecer nos próximos meses.
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
                  Sim, Não Lançar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
