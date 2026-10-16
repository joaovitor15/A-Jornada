import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, ReceiptText, FastForward, Check, ChevronRight, ArrowLeft, ArrowDownRight, X, Calendar, History, Eye } from 'lucide-react';
import { useCards, Card } from '../hooks/useCards';
import { calcularFaturaCard, FaturaCalculada, helperCalcularPeriodoParaMes } from '../utils/faturaUtils';

interface CardFaturaDashboardProps {
  activeProfileId: string;
  setActivePage?: (page: string) => void;
  mesSelecionado?: number;
  anoSelecionado?: number;
  onTotalChange?: (total: number) => void;
}

export function CardFaturaDashboard({
  activeProfileId,
  setActivePage,
  mesSelecionado,
  anoSelecionado,
  onTotalChange
}: CardFaturaDashboardProps) {
  const { cards, loading, refresh: refreshCards } = useCards(activeProfileId);
  const [transacoesCard, setTransacoesCard] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Modo de visualização: ABERTA por padrão (sempre exibe a fatura em aberto), com opção de inspecionar FECHADA
  const [viewMode, setViewMode] = useState<'AUTO' | 'ABERTA' | 'FECHADA'>('ABERTA');

  const [anteciparFaturaModal, setAnteciparFaturaModal] = useState<Card | null>(null);
  const [anteciparValor, setAnteciparValor] = useState("0");
  const [anteciparParcelasModal, setAnteciparParcelasModal] = useState<Card | null>(null);
  const [anteciparParcelasSelecionadas, setAnteciparParcelasSelecionadas] = useState<string[]>([]);
  const [anteciparParcelasValor, setAnteciparParcelasValor] = useState("0");

  const [faturaVisualizar, setFaturaVisualizar] = useState<Card | null>(null);
  const [faturaVisualizarTab, setFaturaVisualizarTab] = useState<'PROXIMAS' | 'HISTORICO'>('PROXIMAS');
  const [faturaAnoMesVisualizar, setFaturaAnoMesVisualizar] = useState<{ ano: number; mes: number } | null>(null);

  const [confirmarPagamento, setConfirmarPagamento] = useState<{ cardId: string; valor: number; nome?: string } | null>(null);

  const getOrCreateFaturaTags = async () => {
    if (!activeProfileId) return { tagAntecipacaoId: null, tagPagamentoId: null };

    let { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('profile_id', activeProfileId)
      .ilike('nome', 'Cartão de Crédito')
      .limit(1)
      .single();

    let categoryId = cat?.id;
    if (!categoryId) {
      const { data: newCat, error: catError } = await supabase
        .from('categories')
        .insert({
          profile_id: activeProfileId,
          nome: 'Cartão de Crédito',
          cor: '#ef4444',
          icone: 'credit-card',
          tipo: 'despesa'
        })
        .select()
        .single();
      if (catError) console.error("Erro ao criar categoria de Fatura:", catError);
      categoryId = newCat?.id;
    }

    if (!categoryId) return { tagAntecipacaoId: null, tagPagamentoId: null };

    let { data: tagAnt } = await supabase
      .from('tags')
      .select('id')
      .eq('profile_id', activeProfileId)
      .ilike('nome', 'Antecipação')
      .limit(1)
      .single();

    let tagAntecipacaoId = tagAnt?.id;
    if (!tagAntecipacaoId) {
      const { data: newTagAnt, error: tagAntError } = await supabase
        .from('tags')
        .insert({
          profile_id: activeProfileId,
          category_id: categoryId,
          categoria_id: categoryId,
          nome: 'Antecipação'
        })
        .select()
        .single();
      if (tagAntError) console.error("Erro ao criar tag de Antecipação:", tagAntError);
      tagAntecipacaoId = newTagAnt?.id;
    }

    let { data: tagPag } = await supabase
      .from('tags')
      .select('id')
      .eq('profile_id', activeProfileId)
      .ilike('nome', 'Pagamento Fatura')
      .limit(1)
      .single();

    let tagPagamentoId = tagPag?.id;
    if (!tagPagamentoId) {
      const { data: newTagPag, error: tagPagError } = await supabase
        .from('tags')
        .insert({
          profile_id: activeProfileId,
          category_id: categoryId,
          categoria_id: categoryId,
          nome: 'Pagamento Fatura'
        })
        .select()
        .single();
      if (tagPagError) console.error("Erro ao criar tag de Pagamento Fatura:", tagPagError);
      tagPagamentoId = newTagPag?.id;
    }

    return { tagAntecipacaoId, tagPagamentoId };
  };

  useEffect(() => {
    async function fetchTodosGastos() {
      if (!activeProfileId || !cards.length) return;

      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq('profile_id', activeProfileId)
        .not('card_id', 'is', null);

      if (!error && data) {
        setTransacoesCard(data);
      }
    }
    fetchTodosGastos();
  }, [activeProfileId, cards, refreshTrigger]);

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const anoRef = anoSelecionado || new Date().getFullYear();
  const mesRef = mesSelecionado || (new Date().getMonth() + 1);

  // 1. Fatura do mês selecionado
  const faturaMes: FaturaCalculada = activeCard
    ? calcularFaturaCard(activeCard, transacoesCard, anoRef, mesRef)
    : ({} as any);

  // 2. Fatura atualmente em aberto para o cartão ativo:
  // Um mês é considerado fechado se a data de fechamento já passou (hoje > pHoje.fim)
  // OU se a fatura do mês já foi fechada/paga (faturaMes.status === 'PAGA' ou faturaMes.status === 'FECHADA' com valorPendente <= 0.01).
  // Quando o mês fecha/é pago, a fatura em aberto passa a ser o ciclo seguinte (abertaMes)!
  const hoje = new Date();
  const hojeAno = hoje.getFullYear();
  const hojeMes = hoje.getMonth() + 1;
  const pHoje = activeCard
    ? helperCalcularPeriodoParaMes(
        activeCard.dia_fechamento_fatura,
        activeCard.dia_vencimento_fatura,
        hojeAno,
        hojeMes
      )
    : null;

  const faturaHojeMes = activeCard
    ? calcularFaturaCard(activeCard, transacoesCard, hojeAno, hojeMes)
    : null;

  const hojeMesFechadaOuPaga = Boolean(
    (pHoje && hoje > pHoje.fim) ||
    (faturaHojeMes && (faturaHojeMes.status === 'FECHADA' || faturaHojeMes.status === 'VENCIDA' || faturaHojeMes.status === 'PAGA') && faturaHojeMes.valorPendente <= 0.01) ||
    (faturaMes && faturaMes.status === 'PAGA')
  );

  let abertaAno = hojeAno;
  let abertaMes = hojeMes;
  if (hojeMesFechadaOuPaga) {
    abertaMes += 1;
    if (abertaMes > 12) {
      abertaMes = 1;
      abertaAno += 1;
    }
  }
  const faturaAberta: FaturaCalculada = activeCard
    ? calcularFaturaCard(activeCard, transacoesCard, abertaAno, abertaMes)
    : ({} as any);

  // Determinar qual fatura exibir no card principal do Dashboard:
  // Se estiver em modo AUTO:
  // Se a fatura do mês está fechada e pendente de pagamento -> exibe ela com botão "PAGAR FATURA"
  // Assim que paga (ou se já está PAGA) -> transiciona automaticamente para a FATURA EM ABERTO!
  const temFaturaFechadaPendente =
    faturaMes &&
    (faturaMes.status === 'FECHADA' || faturaMes.status === 'VENCIDA') &&
    faturaMes.valorPendente > 0.01;

  let faturaExibida: FaturaCalculada = faturaMes;
  let faturaExibidaAno = anoRef;
  let faturaExibidaMes = mesRef;

  if (viewMode === 'FECHADA') {
    faturaExibida = faturaMes;
    faturaExibidaAno = anoRef;
    faturaExibidaMes = mesRef;
  } else {
    // Sempre exibe a Fatura em Aberto (independente do mês selecionado)
    faturaExibida = faturaAberta;
    faturaExibidaAno = abertaAno;
    faturaExibidaMes = abertaMes;
  }

  // Notificar Dashboard sobre o total pendente dos cartões no mês selecionado
  useEffect(() => {
    if (onTotalChange && cards.length > 0) {
      let tot = 0;
      cards.forEach((c) => {
        const f = calcularFaturaCard(c, transacoesCard, anoRef, mesRef);
        tot += f.valorPendente;
      });
      onTotalChange(tot);
    }
  }, [cards, transacoesCard, anoRef, mesRef, onTotalChange]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full min-h-[300px] animate-pulse">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-md mb-2"></div>
                <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              </div>
              <div className="flex flex-col items-end">
                <div className="h-3 w-16 mb-2 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-6"></div>
          </div>
          <div className="flex gap-2 mt-auto">
            <div className="flex-1 py-5 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0 || !activeCard) {
    return (
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden flex flex-col h-full min-h-[280px]">
        <div className="p-6 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] relative z-10">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            <CreditCard size={20} className="text-[#8B5CF6]" />
            Faturas de Cartão
          </h3>
          <span className="px-2.5 py-1 rounded-full uppercase text-[10px] font-black tracking-widest border bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700">
            Cartões
          </span>
        </div>
        <div className="p-6 flex flex-col items-center justify-center flex-1 text-center relative z-10 gap-3">
          <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-900/20 text-[#8B5CF6] dark:text-violet-400 flex items-center justify-center shadow-inner">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Nenhum cartão cadastrado</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Cadastre seus cartões de crédito para acompanhar faturas, limites e pagamentos diretamente aqui ao lado das provisões.
            </p>
          </div>
          {setActivePage && (
            <button
              onClick={() => setActivePage('cartoes')}
              className="mt-2 px-4 py-2 bg-[#8B5CF6] hover:bg-violet-600 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Gerenciar Cartões</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!faturaExibida.periodo) return null;

  const statusColors = {
    ABERTA: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    FECHADA: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    VENCIDA: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
    PAGA: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    FUTURA: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
  };

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const nomeMesExibido = nomesMeses[(faturaExibidaMes || 1) - 1];

  // Valor a exibir no card principal:
  const valorExibido =
    faturaExibida.status === 'PAGA'
      ? faturaExibida.totalFatura
      : faturaExibida.valorPendente;

  // Barra de limite
  const baseLimite = faturaExibida.limiteEfetivo || activeCard.limite || 1;
  const pctUsado = Math.min(100, (faturaExibida.limiteUsado / baseLimite) * 100);
  const pctCredito = faturaExibida.creditoDisponivel > 0 ? Math.min(100, (faturaExibida.creditoDisponivel / baseLimite) * 100) : 0;

  // Parcelas futuras
  const temParcelasFuturas = transacoesCard.some(
    (t) => t.card_id === activeCard.id && t.tipo === 'despesa' && t.data > faturaExibida.periodo.fimStr && t.status !== 'ignorado'
  );

  const handlePaga = async (cardId: string, valor: number) => {
    try {
      const localToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const { tagPagamentoId } = await getOrCreateFaturaTags();
      const mesCapitalizado = nomeMesExibido;

      const { error: errorCaixa } = await supabase.from('transacoes').insert({
        profile_id: activeProfileId,
        tipo: 'despesa',
        descricao: `Pagamento da fatura (${mesCapitalizado})`,
        data: localToday(),
        valor: valor,
        forma_pagamento: 'conta',
        ...(tagPagamentoId && { tag_id: tagPagamentoId })
      });
      if (errorCaixa) throw errorCaixa;

      const { error: errorCard } = await supabase.from('transacoes').insert({
        profile_id: activeProfileId,
        tipo: 'receita',
        descricao: `Pagamento da fatura (${mesCapitalizado})`,
        data: localToday(),
        valor: valor,
        forma_pagamento: 'conta',
        card_id: cardId,
        ...(tagPagamentoId && { tag_id: tagPagamentoId })
      });
      if (errorCard) throw errorCard;

      setRefreshTrigger((p) => p + 1);
      refreshCards();
      setConfirmarPagamento(null);

      // Ao pagar a fatura fechada, direciona imediatamente para a fatura em aberto!
      setViewMode('ABERTA');
      let nextAbertaMes = mesRef + 1;
      let nextAbertaAno = anoRef;
      if (nextAbertaMes > 12) {
        nextAbertaMes = 1;
        nextAbertaAno += 1;
      }
      if (faturaAnoMesVisualizar) {
        setFaturaAnoMesVisualizar({ ano: nextAbertaAno, mes: nextAbertaMes });
      }
    } catch (err: any) {
      console.error("Erro ao pagar fatura: " + err.message);
    }
  };

  const handleConfirmAntecipar = async () => {
    if (!activeProfileId || !anteciparFaturaModal) return;
    const valorNum = parseInt(anteciparValor) / 100;
    if (valorNum <= 0) {
      alert("O valor de antecipação deve ser maior que zero.");
      return;
    }

    try {
      const localToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const { tagAntecipacaoId } = await getOrCreateFaturaTags();
      const currentMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
      const mesCapitalizado = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

      const { error: errorCaixa } = await supabase.from('transacoes').insert({
        profile_id: activeProfileId,
        tipo: 'despesa',
        descricao: `Antecipação Fatura (${mesCapitalizado})`,
        data: localToday(),
        valor: valorNum,
        forma_pagamento: 'conta',
        ...(tagAntecipacaoId && { tag_id: tagAntecipacaoId })
      });

      if (errorCaixa) throw errorCaixa;

      const { error: errorCard } = await supabase.from('transacoes').insert({
        profile_id: activeProfileId,
        tipo: 'receita',
        descricao: `Antecipação Fatura (${mesCapitalizado})`,
        data: localToday(),
        valor: valorNum,
        forma_pagamento: 'conta',
        card_id: anteciparFaturaModal.id,
        ...(tagAntecipacaoId && { tag_id: tagAntecipacaoId })
      });

      if (errorCard) throw errorCard;

      alert("Antecipação realizada com sucesso!");
      setAnteciparFaturaModal(null);
      setAnteciparValor("0");
      setRefreshTrigger((p) => p + 1);
      refreshCards();
    } catch (e: any) {
      console.error("Erro ao antecipar: ", e.message);
      alert("Erro ao antecipar: " + e.message);
    }
  };

  const handleConfirmAnteciparParcelas = async () => {
    if (!activeProfileId || !anteciparParcelasModal) return;
    if (anteciparParcelasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma parcela para antecipar.");
      return;
    }

    const valorPago = parseInt(anteciparParcelasValor) / 100;
    if (valorPago <= 0) {
      alert("O valor de antecipação deve ser maior que zero.");
      return;
    }

    const transacoesAtivas = transacoesCard.filter((t) => t.status !== 'ignorado');
    const parcelasSelecionadasFull = transacoesAtivas.filter((t) =>
      anteciparParcelasSelecionadas.includes(t.id)
    );

    try {
      const localToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };
      const dataAtual = localToday();
      const totalOriginal = parcelasSelecionadasFull.reduce((acc, t) => acc + Number(t.valor), 0);
      const discountFactor = valorPago / (totalOriginal || 1);
      let remainingToAnticipate = valorPago;

      for (let i = 0; i < parcelasSelecionadasFull.length; i++) {
        const t = parcelasSelecionadasFull[i];
        const isLast = i === parcelasSelecionadasFull.length - 1;

        let newValue = 0;
        if (isLast) {
          newValue = Number(remainingToAnticipate.toFixed(2));
        } else {
          newValue = Number((Number(t.valor) * discountFactor).toFixed(2));
          remainingToAnticipate -= newValue;
        }

        const { error: errUpdate } = await supabase
          .from('transacoes')
          .update({
            data: dataAtual,
            valor: newValue,
            descricao: t.descricao.includes('(Antecipada)') ? t.descricao : `${t.descricao} (Antecipada)`
          })
          .eq('id', t.id);
        if (errUpdate) throw errUpdate;
      }

      alert("Parcelas antecipadas com sucesso!");
      setAnteciparParcelasModal(null);
      setAnteciparParcelasSelecionadas([]);
      setAnteciparParcelasValor("0");
      setRefreshTrigger((p) => p + 1);
      refreshCards();
    } catch (e: any) {
      console.error("Erro ao antecipar parcelas:", e.message);
      alert("Erro ao antecipar parcelas: " + e.message);
    }
  };

  const cardGradientStyle = {
    background: `linear-gradient(135deg, ${activeCard.cor || "#2563EB"} 0%, color-mix(in srgb, ${activeCard.cor || "#2563EB"} 55%, black) 100%)`
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0B0F19] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden flex flex-col h-full min-h-[320px] transition-all hover:shadow-md group">
        {/* Seletor de Cartões se houver mais de um */}
        {cards.length > 1 && (
          <div className="px-6 pt-3 pb-0 flex gap-2 overflow-x-auto border-b border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#070B12]/50">
            {cards.map((c) => {
              const isSelected = c.id === activeCard.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCardId(c.id)}
                  className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.cor || '#3b82f6' }}></div>
                  {c.nome}
                </button>
              );
            })}
          </div>
        )}

        {/* HEADER COM VISUAL DE CARTÃO MODERNO COM GRADIENTE */}
        <div
          onClick={() => {
            setFaturaVisualizar(activeCard);
            setFaturaAnoMesVisualizar({ ano: faturaExibidaAno, mes: faturaExibidaMes });
          }}
          className="p-6 text-white relative overflow-hidden shrink-0 cursor-pointer transition-transform duration-300"
          style={cardGradientStyle}
          title="Clique para conferir os lançamentos da fatura"
        >
          {/* Efeitos decorativos de fundo */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-black/15 rounded-full -ml-10 -mb-10 blur-xl"></div>

          {/* Topo do cartão: Ícone + Nome + Vencimento + Botão Ver Fatura */}
          <div className="flex justify-between items-start relative z-10 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shrink-0 shadow-sm">
                <CreditCard size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-[17px] tracking-tight text-white truncate">
                    {activeCard.nome}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/25">
                    {faturaExibida.status}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-white/80 flex items-center gap-1.5 mt-0.5">
                  <span>Venc. dia {activeCard.dia_vencimento_fatura}</span>
                  <span>•</span>
                  <span className="opacity-90">{faturaExibida.periodo.label}</span>
                </div>
              </div>
            </div>

            {/* Alternador de visualização rápida (Aberta vs Fechada) */}
            <div className="flex items-center gap-2 shrink-0">
              {temFaturaFechadaPendente && (
                <div
                  className="flex items-center gap-1 bg-black/25 p-1 rounded-xl backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('ABERTA')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      faturaExibida === faturaAberta
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Aberta
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('FECHADA')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
                      faturaExibida === faturaMes
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Fechada
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFaturaVisualizar(activeCard);
                  setFaturaAnoMesVisualizar(null);
                }}
                className="p-2 bg-white/15 hover:bg-white/25 rounded-xl backdrop-blur-md transition-all text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Ver todas as faturas"
              >
                <span>Ver Faturas</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Valor Principal em destaque */}
          <div className="relative z-10 pt-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 mb-0.5 block">
                  {faturaExibida.status === 'PAGA'
                    ? `Fatura de ${nomeMesExibido} (Paga)`
                    : faturaExibida.status === 'ABERTA'
                    ? `Fatura em Aberto (${nomeMesExibido})`
                    : `Valor a Pagar (${nomeMesExibido})`}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  R${' '}
                  {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2
                  }).format(valorExibido)}
                </div>
                {faturaExibida.saldoAnteriorNaoPago > 0 && faturaExibida.status !== 'PAGA' && (
                  <span className="text-[10px] text-amber-200 font-bold block mt-1">
                    Inclui R$ {faturaExibida.saldoAnteriorNaoPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} anterior
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 mb-0.5 block">
                  Limite Total
                </span>
                <div className="text-sm font-bold text-white/90">
                  R${' '}
                  {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2
                  }).format(activeCard.limite)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORPO DO CARD COM BARRA DE LIMITE E AÇÕES */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {pctCredito > 0 && (
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${pctCredito}%` }}
                    title={`Crédito: R$ ${faturaExibida.creditoDisponivel.toFixed(2)}`}
                  ></div>
                )}
                {pctUsado > 0 && (
                  <div
                    className="h-full bg-blue-500 transition-all duration-700"
                    style={{ width: `${pctUsado}%` }}
                    title={`Limite Usado: R$ ${faturaExibida.limiteUsado.toFixed(2)}`}
                  ></div>
                )}
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                <span>Usado: R$ {new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(faturaExibida.limiteUsado)}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Restam R$ {new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(faturaExibida.limiteDisponivel)}</span>
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="space-y-3 mt-auto">
            <div className="flex gap-2">
              {(faturaExibida.status === 'FECHADA' || faturaExibida.status === 'VENCIDA') && faturaExibida.valorPendente > 0.01 && (
                <button
                  onClick={() =>
                    setConfirmarPagamento({
                      cardId: activeCard.id,
                      valor: faturaExibida.valorPendente,
                      nome: activeCard.nome
                    })
                  }
                  className="btn-salvar flex-1 cursor-pointer py-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  PAGAR FATURA
                </button>
              )}

              {faturaExibida.status === 'PAGA' && (
                <div className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-[12px] text-center tracking-wide flex items-center justify-center">
                  FATURA PAGA
                </div>
              )}

              {faturaExibida.status === 'ABERTA' && (
                <button
                  onClick={() => setAnteciparFaturaModal(activeCard)}
                  className="flex-1 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/40 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-[11px] tracking-wide transition-all cursor-pointer"
                  title="Antecipar Pagamento"
                >
                  ANTECIPAR PAGAMENTO PARCIAL
                </button>
              )}

              {faturaExibida.status === 'ABERTA' && temParcelasFuturas && (
                <button
                  onClick={() => {
                    setAnteciparParcelasModal(activeCard);
                    setAnteciparParcelasSelecionadas([]);
                    setAnteciparParcelasValor("0");
                  }}
                  className="px-3.5 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 dark:hover:from-amber-900/30 dark:hover:to-amber-800/40 text-amber-600 dark:text-amber-400 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center"
                  title="Antecipar Parcelas"
                >
                  <FastForward size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setActivePage?.('cartoes')}
              className="w-full py-2.5 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-[#64748B] dark:text-[#94A3B8] font-bold text-[12px] tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Gerenciar Cartões
              <ChevronRight size={15} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Antecipar Fatura */}
      {anteciparFaturaModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden text-center">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Antecipar Fatura
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Insira o valor que deseja antecipar para o cartão <strong className="text-slate-700 dark:text-slate-200">{anteciparFaturaModal.nome}</strong>.
              </p>

              <div className="mb-6 text-left">
                <label className="block text-[11px] font-[800] text-[#64748B] uppercase tracking-wider mb-2">
                  Valor a Antecipar
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={(parseInt(anteciparValor) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setAnteciparValor(val || "0");
                    }}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setAnteciparFaturaModal(null)} className="btn-cancelar flex-1 cursor-pointer">
                  Cancelar
                </button>
                <button onClick={handleConfirmAntecipar} className="btn-salvar flex-1 cursor-pointer">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Antecipar Parcelas */}
      {anteciparParcelasModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B] shrink-0">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                Antecipar Parcelas Futuras
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecione as compras parceladas futuras que deseja antecipar para o cartão <strong className="text-slate-700 dark:text-slate-200">{anteciparParcelasModal.nome}</strong>.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {transacoesCard
                .filter(
                  (t) =>
                    t.card_id === anteciparParcelasModal.id &&
                    t.tipo === 'despesa' &&
                    t.data > faturaExibida.periodo.fimStr &&
                    t.status !== 'ignorado'
                )
                .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                .map((t) => {
                  const isChecked = anteciparParcelasSelecionadas.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        let novaLista: string[];
                        if (isChecked) {
                          novaLista = anteciparParcelasSelecionadas.filter((id) => id !== t.id);
                        } else {
                          novaLista = [...anteciparParcelasSelecionadas, t.id];
                        }
                        setAnteciparParcelasSelecionadas(novaLista);

                        const totalSel = transacoesCard
                          .filter((item) => novaLista.includes(item.id))
                          .reduce((acc, item) => acc + Number(item.valor), 0);
                        setAnteciparParcelasValor(Math.round(totalSel * 100).toString());
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.descricao}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Previsão: {new Date(t.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        R$ {Number(t.valor).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="p-6 border-t border-[#E2E8F0] dark:border-[#1E293B] sticky bottom-0">
              <div className="text-left mb-6">
                <label className="block text-[11px] font-[800] text-[#64748B] uppercase tracking-wider mb-2">
                  Valor Total da Antecipação
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={(parseFloat(anteciparParcelasValor) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setAnteciparParcelasValor(val || "0");
                    }}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setAnteciparParcelasModal(null)} className="btn-cancelar flex-1 cursor-pointer">
                  Cancelar
                </button>
                <button onClick={handleConfirmAnteciparParcelas} className="btn-salvar flex-1 cursor-pointer">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Pagamento */}
      {confirmarPagamento && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Pagar Fatura</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deseja marcar a fatura do cartão <strong className="text-slate-700 dark:text-slate-200">{confirmarPagamento.nome}</strong> no valor de <strong className="text-slate-700 dark:text-slate-200">R$ {confirmarPagamento.valor.toFixed(2)}</strong> como paga?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarPagamento(null)} className="btn-cancelar flex-1 cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => handlePaga(confirmarPagamento.cardId, confirmarPagamento.valor)}
                className="btn-salvar flex-1 cursor-pointer"
              >
                <Check size={18} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização da Fatura (Próximas e Histórico) */}
      {faturaVisualizar && (
        <div className="fixed inset-0 bg-black/50 dark:bg-[#0F172AB3] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B0F19] rounded-[32px] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100 dark:border-slate-800">
            {faturaAnoMesVisualizar !== null ? (
              /* ESTADO 2: DETALHE DA FATURA SELECIONADA */
              <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
                {(() => {
                  const itemFatura = calcularFaturaCard(
                    faturaVisualizar,
                    transacoesCard,
                    faturaAnoMesVisualizar.ano,
                    faturaAnoMesVisualizar.mes
                  );
                  const nomeMesItem = nomesMeses[(faturaAnoMesVisualizar.mes || 1) - 1];

                  const isFutura =
                    faturaAnoMesVisualizar.ano > hojeAno ||
                    (faturaAnoMesVisualizar.ano === hojeAno && faturaAnoMesVisualizar.mes > hojeMes);

                  const modalGradientStyle = {
                    background: `linear-gradient(135deg, ${faturaVisualizar.cor || "#2563EB"} 0%, color-mix(in srgb, ${faturaVisualizar.cor || "#2563EB"} 55%, black) 100%)`
                  };

                  return (
                    <>
                      {/* HEADER MODERNO COM GRADIENTE DO CARTÃO */}
                      <div
                        className="p-6 text-white relative overflow-hidden shrink-0 rounded-t-[32px]"
                        style={modalGradientStyle}
                      >
                        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-28 h-28 bg-black/15 rounded-full -ml-10 -mb-10 blur-xl"></div>

                        <div className="flex items-center justify-between relative z-10 mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setFaturaAnoMesVisualizar(null)}
                              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md"
                              title="Voltar para a lista"
                            >
                              <ArrowLeft size={20} />
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-white text-lg">Fatura de {nomeMesItem}</h3>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/25">
                                  {itemFatura.status}
                                </span>
                              </div>
                              <p className="text-xs text-white/80 font-medium">{itemFatura.periodo.label}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setFaturaVisualizar(null);
                              setFaturaAnoMesVisualizar(null);
                            }}
                            className="p-2 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer backdrop-blur-md"
                            title="Fechar"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="flex justify-between items-end relative z-10 pt-2">
                          <div>
                            <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest block mb-0.5">
                              {itemFatura.status === 'PAGA'
                                ? 'Total Pago'
                                : isFutura
                                ? 'Parcelamento Previsto'
                                : 'Valor a Pagar'}
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-white">
                              R${' '}
                              {(isFutura
                                ? itemFatura.despesasTotal
                                : itemFatura.status === 'PAGA'
                                ? itemFatura.totalFatura
                                : itemFatura.valorPendente
                              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          {(itemFatura.status === 'FECHADA' || itemFatura.status === 'VENCIDA') && itemFatura.valorPendente > 0.01 && (
                            <button
                              onClick={() => {
                                setFaturaVisualizar(null);
                                setFaturaAnoMesVisualizar(null);
                                setConfirmarPagamento({
                                  cardId: faturaVisualizar.id,
                                  valor: itemFatura.valorPendente,
                                  nome: faturaVisualizar.nome
                                });
                              }}
                              className="py-2 px-4 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                              PAGAR FATURA
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sub-header compacto com resumo */}
                      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070B12]/40 flex flex-wrap justify-between items-center gap-2 text-xs shrink-0">
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
                          <span>Compras: <strong className="text-slate-700 dark:text-slate-200">R$ {itemFatura.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                          {itemFatura.pago > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Já Pago: <strong className="font-bold">R$ {itemFatura.pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                            </span>
                          )}
                          {itemFatura.saldoAnteriorNaoPago > 0 && itemFatura.status !== 'PAGA' && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              Em aberto anterior: R$ {itemFatura.saldoAnteriorNaoPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5">
                        <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                          Transações da Fatura ({itemFatura.despesasCiclo.length})
                        </h4>
                        {itemFatura.despesasCiclo.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            Nenhuma despesa lançada nesta fatura.
                          </div>
                        ) : (
                          itemFatura.despesasCiclo.map((t) => (
                            <div
                              key={t.id}
                              className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#070B12]/50 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
                                  <ArrowDownRight size={17} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[260px]">
                                    {t.descricao}
                                  </span>
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                    {new Date(t.data).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <span className="font-black text-sm text-red-500">
                                - R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* ESTADO 1: LISTA (PRÓXIMAS / HISTÓRICO) */
              <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] shrink-0 rounded-t-[32px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: faturaVisualizar.cor || '#3b82f6' }}
                      >
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          Faturas - {faturaVisualizar.nome}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Vencimento dia {faturaVisualizar.dia_vencimento_fatura}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFaturaVisualizar(null)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title="Fechar"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tabs Nav (Estilo Investimentos - rounded-full sem caixa em volta) */}
                  <div className="flex gap-2 self-start flex-wrap">
                    {[
                      { id: 'PROXIMAS', label: 'Próximas Faturas', icon: Calendar },
                      { id: 'HISTORICO', label: 'Histórico', icon: History }
                    ].map(tab => {
                      const isActive = faturaVisualizarTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setFaturaVisualizarTab(tab.id as any)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-white dark:bg-[#070B12] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-md border border-[#E2E8F0] dark:border-[#1E293B]'
                              : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <tab.icon size={16} strokeWidth={2.5} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {(() => {
                    const mesesOffset =
                      faturaVisualizarTab === 'PROXIMAS'
                        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                        : [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12];

                    const items = mesesOffset.map((offset) => {
                      const d = new Date(abertaAno, abertaMes - 1 + offset, 1);
                      const tAno = d.getFullYear();
                      const tMes = d.getMonth() + 1;

                      const itemFatura = calcularFaturaCard(faturaVisualizar, transacoesCard, tAno, tMes);
                      const nomeMesItem = nomesMeses[(tMes || 1) - 1];

                      // REGRA: Nas próximas faturas (meses futuros além da fatura em aberto atual),
                      // NÃO deve aparecer se não tiver parcelamento/compras neste mês futuro!
                      // Só aparece se houver parcelamento (despesasTotal > 0)!
                      if (faturaVisualizarTab === 'PROXIMAS' && offset > 0 && itemFatura.despesasTotal <= 0.001) {
                        return null;
                      }

                      // Se for histórico e não tiver gastos nem débitos, oculta
                      if (faturaVisualizarTab === 'HISTORICO' && itemFatura.totalFatura <= 0.001 && itemFatura.despesasTotal <= 0.001) {
                        return null;
                      }

                      // REGRA: Para meses futuros, o valor exibido é EXCLUSIVAMENTE o parcelamento daquele mês (despesasTotal),
                      // e NÃO o valor total acumulado da fatura anterior (pois a fatura anterior será paga no dia de vencimento)!
                      const valorLinha =
                        faturaVisualizarTab === 'PROXIMAS' && offset > 0
                          ? itemFatura.despesasTotal
                          : itemFatura.status === 'PAGA'
                          ? itemFatura.totalFatura
                          : itemFatura.valorPendente;

                      return (
                        <div
                          key={`${tAno}-${tMes}`}
                          onClick={() => setFaturaAnoMesVisualizar({ ano: tAno, mes: tMes })}
                          className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070B12]/40 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors shrink-0">
                                <ReceiptText size={18} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                                    {nomeMesItem} {tAno}
                                  </h4>
                                  {offset === 0 && faturaVisualizarTab === 'PROXIMAS' && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                                      Atual
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-extrabold uppercase tracking-widest mt-0.5 inline-block px-2 py-0.5 rounded-md border ${
                                    statusColors[itemFatura.status]
                                  }`}
                                >
                                  {itemFatura.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 block">
                                  {offset > 0
                                    ? 'Parcelamento Previsto'
                                    : itemFatura.status === 'PAGA'
                                    ? 'Total Pago'
                                    : 'Valor a Pagar'}
                                </span>
                                <span
                                  className={`text-lg sm:text-xl font-black ${
                                    itemFatura.status === 'PAGA'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : itemFatura.status === 'FECHADA' || itemFatura.status === 'VENCIDA'
                                      ? 'text-red-500'
                                      : 'text-blue-600 dark:text-blue-400'
                                  }`}
                                >
                                  R$ {valorLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        </div>
                      );
                    });

                    const filteredItems = items.filter(Boolean);
                    if (filteredItems.length === 0) {
                      return (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                          <ReceiptText size={32} className="mx-auto mb-3 opacity-30" />
                          <p className="font-medium text-sm">Nenhuma fatura encontrada aqui.</p>
                        </div>
                      );
                    }

                    return filteredItems;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
