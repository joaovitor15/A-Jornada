import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, ReceiptText, FastForward, Check } from 'lucide-react';
import { useCards, Card } from '../hooks/useCards';
import * as LucideIcons from 'lucide-react';
import { calcularPeriodoFatura, helperCalcularPeriodo } from '../utils/faturaUtils';

interface CardFaturaDashboardProps {
  activeProfileId: string;
  setActivePage?: (page: string) => void;
}

export function CardFaturaDashboard({ activeProfileId, setActivePage }: CardFaturaDashboardProps) {
  const { cards, loading, refresh: refreshCards } = useCards(activeProfileId);
  const [transacoesCard, setTransacoesCard] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [anteciparFaturaModal, setAnteciparFaturaModal] = useState<Card | null>(null);
  const [anteciparValor, setAnteciparValor] = useState("0");
  const [anteciparParcelasModal, setAnteciparParcelasModal] = useState<Card | null>(null);
  const [anteciparParcelasSelecionadas, setAnteciparParcelasSelecionadas] = useState<string[]>([]);
  const [anteciparParcelasValor, setAnteciparParcelasValor] = useState("0");
  const [faturaVisualizar, setFaturaVisualizar] = useState<Card | null>(null);
  const [faturaVisualizarTab, setFaturaVisualizarTab] = useState<'PROXIMAS' | 'HISTORICO'>('PROXIMAS');
  const [faturaOffsetVisualizar, setFaturaOffsetVisualizar] = useState<number | null>(null);
  const [viewingOffset, setViewingOffset] = useState(0);
  const [confirmarPagamento, setConfirmarPagamento] = useState<{cardId: string, valor: number, nome?: string} | null>(null);

  const getOrCreateFaturaTags = async () => {
    if (!activeProfileId) return { tagAntecipacaoId: null, tagPagamentoId: null };
    
    // Se não tem, precisamos criar uma categoria e a tag
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
            .insert({ profile_id: activeProfileId, nome: 'Cartão de Crédito', cor: '#ef4444', icone: 'credit-card', tipo: 'despesa' })
            .select()
            .single();
        if (catError) console.error("Erro ao criar categoria de Fatura:", catError);
        categoryId = newCat?.id;
    }
    
    if (!categoryId) return { tagAntecipacaoId: null, tagPagamentoId: null };

    // Busca tag "Antecipação"
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
            .insert({ profile_id: activeProfileId, category_id: categoryId, categoria_id: categoryId, nome: 'Antecipação' })
            .select()
            .single();
        if (tagAntError) console.error("Erro ao criar tag de Antecipação:", tagAntError);
        tagAntecipacaoId = newTagAnt?.id;
    }

    // Busca tag "Pagamento Fatura"
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
            .insert({ profile_id: activeProfileId, category_id: categoryId, categoria_id: categoryId, nome: 'Pagamento Fatura' })
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
            <div className="flex justify-between mt-2">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-2 mt-auto flex-col sm:flex-row">
             <div className="flex-1 py-5 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
             <div className="flex-1 py-5 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  // Constantes de visualização e estados
  const card = cards[0];
  const transacoesAtivas = transacoesCard.filter(t => t.status !== 'ignorado');

  // 1. DADOS GLOBAIS DE CRÉDITO E LIMITE DO CARTÃO
  const globalDespesas = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa').reduce((acc, t) => acc + Number(t.valor), 0);
  const globalCreditos = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita').reduce((acc, t) => acc + Number(t.valor), 0);
  const globalLimitUsed = globalDespesas - globalCreditos;

  // Calculando Crédito Disponível (quando o saldo usado é negativo = tem crédito sobrando)
  const creditoDisponivel = globalLimitUsed < 0 ? Math.abs(globalLimitUsed) : 0;
  // O limite efetivo agora adiciona o crédito disponível ao limite do cartão
  const limiteEfetivo = card.limite + creditoDisponivel;
  
  // Limite usado apenas considera a parcela que "come" o limite do cartão (não negativo)
  const limiteUsadoPositivo = globalLimitUsed > 0 ? globalLimitUsed : 0;
  // O que sobra puramente do limite do cartão (após descontar gastos que excederam o crédito)
  const limiteDisponivel = card.limite - limiteUsadoPositivo;


  // 2. RECUPERAR A FATURA ATIVA NA VISUALIZAÇÃO
  const periodoCard = helperCalcularPeriodo(card.dia_fechamento_fatura, card.dia_vencimento_fatura, viewingOffset);
  const periodoCardAtual = helperCalcularPeriodo(card.dia_fechamento_fatura, card.dia_vencimento_fatura, 0);
  
  // 3. FIFO DE PAGAMENTOS (DISTRIBUIÇÃO DA DÍVIDA)
  const despesasPassado = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data < periodoCardAtual.inicioStr).reduce((acc, t) => acc + Number(t.valor), 0);
  const despesasAberto = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data >= periodoCardAtual.inicioStr && t.data <= periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);
  const despesasFuturo = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data > periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);

  let creditosRestantes = globalCreditos;

  const unpaidPassado = Math.max(0, despesasPassado - creditosRestantes);
  creditosRestantes = Math.max(0, creditosRestantes - despesasPassado);

  const unpaidAberto = Math.max(0, despesasAberto - creditosRestantes);
  creditosRestantes = Math.max(0, creditosRestantes - despesasAberto);

  const unpaidFuturo = Math.max(0, despesasFuturo - creditosRestantes);
  creditosRestantes = Math.max(0, creditosRestantes - despesasFuturo);

  const excedenteCredito = creditosRestantes;

  // O valor exibido contextualmente na fatura depende do offset visualizado
  let valorFaturaAtualView = 0;
  if (viewingOffset < 0) {
      valorFaturaAtualView = unpaidPassado;
  } else if (viewingOffset === 0) {
      valorFaturaAtualView = excedenteCredito > 0 ? -excedenteCredito : unpaidAberto;
  } else {
      valorFaturaAtualView = unpaidFuturo;
  }

  const hoje = new Date();
  
  // Status da Fatura Contextual (a que está sendo exibida)
  let statusContextual: 'ABERTA' | 'FECHADA' | 'VENCIDA' | 'PAGA' | 'FUTURA' = 'ABERTA';
  if (viewingOffset < 0) {
      if (valorFaturaAtualView <= 0.01 && despesasPassado > 0.01) {
          statusContextual = 'PAGA'; // Mês fechado e pago
      } else if (valorFaturaAtualView <= 0.01 && despesasPassado <= 0.01) {
          statusContextual = 'PAGA'; // Sem gastos no passado
      } else if (hoje > periodoCard.vencimento) {
          statusContextual = 'VENCIDA';
      } else {
          statusContextual = 'FECHADA';
      }
  } else if (viewingOffset === 0) {
      statusContextual = 'ABERTA';
  } else {
      statusContextual = 'FUTURA';
  }

  const statusColors = {
    ABERTA: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    FECHADA: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    VENCIDA: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
    PAGA: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    FUTURA: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
  };

  // Nomenclatura da fatura ajustada: exibir o mês ("Maio") ao invés do intervalo de dias
  const nomeMesStr = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(periodoCard.vencimento);
  const nomeMes = nomeMesStr.charAt(0).toUpperCase() + nomeMesStr.slice(1);

  // 4. RECUPERAR A FATURA PASSADA PARA O BOTÃO/LINK DE ACESSO RÁPIDO
  const periodoAnterior = helperCalcularPeriodo(card.dia_fechamento_fatura, card.dia_vencimento_fatura, -1);
  const temFaturaAnteriorPendente = unpaidPassado > 0.01;
  const mesAnteriorStr = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(periodoAnterior.vencimento);
  const mesFaturaAnterior = mesAnteriorStr.charAt(0).toUpperCase() + mesAnteriorStr.slice(1);

  // 5. LÓGICA DA BARRA DE PROGRESSO GLOBAL (FIFO)
  const _limiteBase = limiteEfetivo || 1; // previne divisão por zero
  const pctVerde = Math.min((excedenteCredito / _limiteBase) * 100, 100);
  const pctVermelho = Math.min((unpaidPassado / _limiteBase) * 100, 100 - pctVerde);
  const pctAzul = Math.min((unpaidAberto / _limiteBase) * 100, 100 - pctVerde - pctVermelho);
  const pctAmarelo = Math.min((unpaidFuturo / _limiteBase) * 100, 100 - pctVerde - pctVermelho - pctAzul);
  const pctDisponivel = Math.max(0, 100 - pctVerde - pctVermelho - pctAzul - pctAmarelo);

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
        const currentMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
        const mesCapitalizado = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

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
        
        setRefreshTrigger(p => p + 1);
        refreshCards();
        setConfirmarPagamento(null);
        setViewingOffset(0);
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
        setRefreshTrigger(p => p + 1);
        refreshCards();
        setViewingOffset(0);
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

    const parcelasSelecionadasFull = transacoesAtivas.filter(t => anteciparParcelasSelecionadas.includes(t.id));
    
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
        const discountFactor = valorPago / totalOriginal;
        let remainingToAnticipate = valorPago;

        for (let i = 0; i < parcelasSelecionadasFull.length; i++) {
            const t = parcelasSelecionadasFull[i];
            const isLast = i === parcelasSelecionadasFull.length - 1;
            
            let newValue = 0;
            if (isLast) {
                // To avoid floating point issues, the last one takes whatever is remaining
                newValue = Number(remainingToAnticipate.toFixed(2));
            } else {
                newValue = Number((Number(t.valor) * discountFactor).toFixed(2));
                remainingToAnticipate -= newValue;
            }

            const { error: errUpdate } = await supabase.from('transacoes').update({
                data: dataAtual,
                valor: newValue,
                descricao: t.descricao.includes('(Antecipada)') ? t.descricao : `${t.descricao} (Antecipada)`
            }).eq('id', t.id);
            if (errUpdate) throw errUpdate;
        }

        alert("Parcelas antecipadas com sucesso!");
        setAnteciparParcelasModal(null);
        setAnteciparParcelasSelecionadas([]);
        setAnteciparParcelasValor("0");
        setRefreshTrigger(p => p + 1);
        refreshCards();
        setViewingOffset(0);

    } catch (e: any) {
        console.error("Erro ao antecipar parcelas:", e.message);
        alert("Erro ao antecipar parcelas: " + e.message);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden flex flex-col h-full min-h-[280px]">
        <div className="p-6 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] relative z-10">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                <CreditCard size={20} style={{ color: card.cor }} />
                {card.nome}
            </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="cursor-pointer group/label" 
              onClick={() => setFaturaVisualizar(card)}
            >
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1 group-hover/label:text-blue-500 transition-colors">
                Fatura de {nomeMes} <ReceiptText size={12} />
              </span>
              <div className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 transition-colors">
                Vencimento: {new Date(periodoCard.vencimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <div 
              className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border ${statusColors[statusContextual]}`}
            >
              {statusContextual}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 block">Valor Total</span>
                <div className={`text-xl font-black ${valorFaturaAtualView < 0 ? 'text-emerald-500' : (statusContextual === 'ABERTA' || statusContextual === 'FUTURA') ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>
                  R$ {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                  }).format(valorFaturaAtualView)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 block">Limite Total</span>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 dark:text-slate-300">
                  R$ {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                  }).format(card.limite)}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden flex">
                {pctVerde > 0 && (
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${pctVerde}%` }}
                    title={`Crédito: R$ ${excedenteCredito.toFixed(2)}`}
                  ></div>
                )}
                {pctVermelho > 0 && (
                  <div 
                    className={`h-full bg-red-500 transition-all duration-1000 ease-out ${pctVerde > 0 ? 'border-l border-white/20' : ''}`}
                    style={{ width: `${pctVermelho}%` }}
                    title={`Faturas Passadas: R$ ${unpaidPassado.toFixed(2)}`}
                  ></div>
                )}
                {pctAzul > 0 && (
                  <div 
                    className={`h-full bg-blue-500 transition-all duration-1000 ease-out ${(pctVerde > 0 || pctVermelho > 0) ? 'border-l border-white/20' : ''}`}
                    style={{ width: `${pctAzul}%` }}
                    title={`Fatura Atual: R$ ${unpaidAberto.toFixed(2)}`}
                  ></div>
                )}
                {pctAmarelo > 0 && (
                  <div 
                    className={`h-full bg-amber-400 transition-all duration-1000 ease-out ${(pctVerde > 0 || pctVermelho > 0 || pctAzul > 0) ? 'border-l border-white/20' : ''}`}
                    style={{ width: `${pctAmarelo}%` }}
                    title={`Parcelamentos Futuros: R$ ${unpaidFuturo.toFixed(2)}`}
                  ></div>
                )}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-1.5">
                <div className="flex gap-2">
                  {pctVerde > 0 && (
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Crédito</span>
                  )}
                  {pctVermelho > 0 && (
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Pendente</span>
                  )}
                  {pctAzul > 0 && (
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Atual</span>
                  )}
                  {pctAmarelo > 0 && (
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Futuro</span>
                  )}
                </div>
                <span>Restam R$ {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                  }).format(limiteDisponivel)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            {statusContextual !== 'ABERTA' && statusContextual !== 'FUTURA' && valorFaturaAtualView > 0.01 && (
              <button 
                onClick={() => setConfirmarPagamento({cardId: card.id, valor: valorFaturaAtualView, nome: card.nome})}
                className="btn-salvar flex-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                PAGAR FATURA
              </button>
            )}
            {statusContextual !== 'ABERTA' && statusContextual !== 'FUTURA' && valorFaturaAtualView <= 0.01 && (
              <div className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-[12px] text-center tracking-wide flex items-center justify-center">
                FATURA PAGA
              </div>
            )}
            {statusContextual === 'ABERTA' && (
              <button 
                onClick={() => setAnteciparFaturaModal(card)}
                className="flex-1 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/40 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-[11px] tracking-wide transition-all cursor-pointer"
                title="Antecipar Pagamento"
              >
                ANTECIPAR PAGAMENTO PARCIAL
              </button>
            )}
            
            {statusContextual === 'ABERTA' && unpaidFuturo > 0.01 && (
              <button 
                onClick={() => {
                    setAnteciparParcelasModal(card);
                    setAnteciparParcelasSelecionadas([]);
                    setAnteciparParcelasValor("0");
                }}
                className="px-3.5 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 dark:hover:from-amber-900/30 dark:hover:to-amber-800/40 text-amber-600 dark:text-amber-400 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center"
                title="Antecipar Parcelas"
              >
                <LucideIcons.FastForward size={16} />
              </button>
            )}
            
            {/* Botão de Toggle Contextual */}
            {viewingOffset === 0 && temFaturaAnteriorPendente && (
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   setViewingOffset(-1);
                 }}
                 className="flex-1 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 dark:hover:from-[#1E293B] dark:hover:to-[#334155] text-slate-600 dark:text-slate-300 rounded-xl font-bold text-[11px] tracking-wide transition-all cursor-pointer flex justify-center items-center"
                 title="Ver Fatura Anterior"
               >
                 Ver Fatura Fechada de {mesFaturaAnterior}
               </button>
            )}
            
            {viewingOffset < 0 && (
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   setViewingOffset(0);
                 }}
                 className="flex-1 py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 dark:hover:from-[#1E293B] dark:hover:to-[#334155] text-slate-600 dark:text-slate-300 rounded-xl font-bold text-[11px] tracking-wide transition-all cursor-pointer flex justify-center items-center"
                 title="Ver Fatura Aberta"
               >
                 Voltar à Fatura Aberta
               </button>
            )}
          </div>
          <div className="flex mt-6">
             <button
               onClick={() => setActivePage?.('cartoes')}
               className="w-full py-3 bg-transparent border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-[#64748B] dark:text-[#94A3B8] font-bold text-[12px] tracking-wide hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/40 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all flex items-center justify-center gap-2 group shadow-sm"
             >
               Gerenciar Cartões
               <LucideIcons.ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
             </button>
          </div>
        </div>
      </div>

      {anteciparFaturaModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden text-center">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Antecipar Fatura
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6">
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
                <button
                  onClick={() => setAnteciparFaturaModal(null)}
                  className="btn-cancelar flex-1"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmAntecipar}
                  className="btn-salvar flex-1"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
         {anteciparParcelasModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-center">
            <div className="p-6 pb-2 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Antecipar Parcelas
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4">
                 Selecione as despesas futuras que deseja antecipar neste cartão. 
                 <strong> Atenção: O valor de antecipação não é calculado automaticamente. Você deve inserir o valor abaixo.</strong>
               </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-[#0B0F19]/50">
               <div className="space-y-3">
                 {transacoesAtivas
                    .filter(t => t.card_id === anteciparParcelasModal.id && t.data > (calcularPeriodoFatura(anteciparParcelasModal.dia_fechamento_fatura, anteciparParcelasModal.dia_vencimento_fatura) as any).fimStr && t.tipo === 'despesa')
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .map(t => (
                        <label key={t.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] cursor-pointer transition-colors text-left">
                          <input 
                            type="checkbox" 
                            checked={anteciparParcelasSelecionadas.includes(t.id)}
                            onChange={(e) => {
                               if (e.target.checked) setAnteciparParcelasSelecionadas([...anteciparParcelasSelecionadas, t.id]);
                               else setAnteciparParcelasSelecionadas(anteciparParcelasSelecionadas.filter(id => id !== t.id));
                            }}
                            className="w-4 h-4 text-amber-500 rounded border-[#E2E8F0] dark:border-[#334155] focus:ring-amber-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.descricao || 'Parcela'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{new Date(t.data).toLocaleDateString('pt-BR')} • R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </label>
                    ))
                 }
                 {transacoesAtivas.filter(t => t.card_id === anteciparParcelasModal.id && t.data > (calcularPeriodoFatura(anteciparParcelasModal.dia_fechamento_fatura, anteciparParcelasModal.dia_vencimento_fatura) as any).fimStr && t.tipo === 'despesa').length === 0 && (
                    <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">Nenhuma parcela futura encontrada.</div>
                 )}
               </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] sticky bottom-0">
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
                <button
                  onClick={() => setAnteciparParcelasModal(null)}
                  className="btn-cancelar flex-1"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleConfirmAnteciparParcelas()}
                  className="btn-salvar flex-1"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmarPagamento && (
        <div className="fixed inset-0 bg-black/60 dark:bg-[#0F172AB3] backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Pagar Fatura</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6">
              Deseja marcar a fatura do cartão <strong className="text-slate-700 dark:text-slate-200">{confirmarPagamento.nome}</strong> no valor de <strong className="text-slate-700 dark:text-slate-200">R$ {confirmarPagamento.valor.toFixed(2)}</strong> como paga?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarPagamento(null)}
                className="btn-cancelar flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePaga(confirmarPagamento.cardId, confirmarPagamento.valor)}
                className="btn-salvar flex-1"
              >
                <Check size={18} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {faturaVisualizar && (
        <div className="fixed inset-0 bg-black/40 dark:bg-[#0F172AB3] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[32px] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            
            {faturaOffsetVisualizar !== null ? (
              /* ESTADO 2: DETALHE DA FATURA */
              <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
                {(() => {
                  const periodo = helperCalcularPeriodo(faturaVisualizar.dia_fechamento_fatura, faturaVisualizar.dia_vencimento_fatura, faturaOffsetVisualizar);
                  const nomeMesStr = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(periodo.vencimento);
                  const nomeMes = nomeMesStr.charAt(0).toUpperCase() + nomeMesStr.slice(1);
                  const transacoesFatura = transacoesAtivas
                    .filter(t => t.card_id === faturaVisualizar.id && t.data <= (periodo as any).fimStr && t.data >= (periodo as any).inicioStr)
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
                  const despesasFatura = transacoesFatura.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + Number(t.valor), 0);
                  const creditosFatura = transacoesFatura.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + Number(t.valor), 0);
                  const valorFaturaItem = despesasFatura - creditosFatura;

                  return (
                    <>
                      {/* Cabecalho do Detalhe */}
                      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] shrink-0 rounded-t-[32px]">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setFaturaOffsetVisualizar(null)}
                            className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors"
                          >
                            <LucideIcons.ArrowLeft size={20} />
                          </button>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Fatura de {nomeMes}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">{periodo.label}</p>
                          </div>
                        </div>
                      </div>

                      {/* Resumo */}
                      <div className="px-6 pt-6 shrink-0">
                         <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                               <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Valor da Fatura</span>
                               <span className="text-2xl font-black text-slate-800 dark:text-slate-100">R$ {valorFaturaItem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="text-right">
                               {creditosFatura > 0 && <span className="text-xs font-bold text-emerald-500 block mb-0.5">Pagamentos: -R$ {creditosFatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>}
                               <span className="text-xs font-bold text-red-400 block">Despesas: R$ {despesasFatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                         </div>
                         {faturaOffsetVisualizar < 0 && valorFaturaItem > 0.01 && (
                            <button 
                              onClick={() => {
                                  setFaturaVisualizar(null);
                                  setFaturaOffsetVisualizar(null);
                                  setConfirmarPagamento({cardId: faturaVisualizar.id, valor: valorFaturaItem, nome: faturaVisualizar.nome});
                              }}
                              className="btn-salvar flex-1"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                              PAGAR FATURA
                            </button>
                         )}
                      </div>

                      {/* Lista de Transações */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-3">
                         <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Transações</h4>
                         {transacoesFatura.length === 0 ? (
                           <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-medium">Nenhuma transação nesta fatura.</div>
                         ) : (
                           transacoesFatura.map(t => (
                             <div key={t.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                               <div className="flex items-center gap-3">
                                 <div className="flex justify-end mt-[14px]">
                                    {t.tipo === 'despesa' ? <LucideIcons.ArrowDownRight size={14} /> : <LucideIcons.ArrowUpRight size={14} />}
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{t.descricao}</span>
                                   <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{new Date(t.data).toLocaleDateString('pt-BR')}</span>
                                 </div>
                               </div>
                               <span className={`font-bold text-sm ${t.tipo === 'despesa' ? 'text-red-500' : 'text-emerald-500'}`}>
                                 {t.tipo === 'despesa' ? '-' : '+'} R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              /* ESTADO 1: PÍLULAS (PRÓXIMAS / HISTÓRICO) */
              <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] shrink-0 rounded-t-[32px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{backgroundColor: faturaVisualizar.cor}}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Detalhes - {faturaVisualizar.nome}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Vencimento dia {faturaVisualizar.dia_vencimento_fatura}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFaturaVisualizar(null)} 
                      className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                      title="Fechar"
                    >
                      <LucideIcons.X size={20} />
                    </button>
                  </div>

                  {/* Tabs Nav */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setFaturaVisualizarTab('PROXIMAS')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${faturaVisualizarTab === 'PROXIMAS' ? 'bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300'}`}
                    >
                      Próximas Faturas
                    </button>
                    <button
                      onClick={() => setFaturaVisualizarTab('HISTORICO')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${faturaVisualizarTab === 'HISTORICO' ? 'bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300'}`}
                    >
                      Histórico
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {(() => {
                    const offsets = faturaVisualizarTab === 'PROXIMAS' 
                      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                      : [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12];

                    const items = offsets.map((offset) => {
                      const periodo = helperCalcularPeriodo(faturaVisualizar.dia_fechamento_fatura, faturaVisualizar.dia_vencimento_fatura, offset);
                      const nomeMesStr = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(periodo.vencimento);
                      const nomeMes = nomeMesStr.charAt(0).toUpperCase() + nomeMesStr.slice(1);
                      const hoje = new Date();
                      
                      const valorFaturaItem = transacoesAtivas
                        .filter(t => t.card_id === faturaVisualizar.id && t.data <= (periodo as any).fimStr && t.data >= (periodo as any).inicioStr)
                        .reduce((acc, t) => t.tipo === 'despesa' ? acc + Number(t.valor) : acc - Number(t.valor), 0);
                        
                      // Só mostra se for a atual (0) ou se tiver valor, ou para historico mostra todas que tiveram coisas
                      if (faturaVisualizarTab === 'PROXIMAS' && offset > 0 && valorFaturaItem === 0) return null;
                      if (faturaVisualizarTab === 'HISTORICO' && valorFaturaItem === 0) return null; // Oculta meses vazios antigos

                      let statusLabel = '';
                      let statusColor = '';
                      
                      if (offset < 0) {
                        if (valorFaturaItem <= 0) {
                          statusLabel = 'PAGA';
                          statusColor = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
                        } else if (hoje > periodo.vencimento) {
                          statusLabel = 'VENCIDA';
                          statusColor = 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800';
                        } else {
                          statusLabel = 'FECHADA';
                          statusColor = 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800'; // Vermelha
                        }
                      } else if (offset === 0) {
                        statusLabel = 'Fatura Atual';
                        statusColor = 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'; // Azul
                      } else {
                        statusLabel = 'Fatura Futura';
                        statusColor = 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'; // Amarelo
                      }

                      return (
                        <div 
                          key={offset} 
                          onClick={() => setFaturaOffsetVisualizar(offset)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${offset === 0 ? 'border-blue-200 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-900/10 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/50' : 'border-slate-100 dark:border-slate-700/50 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] hover:border-slate-300 dark:border-slate-600'} group`}
                        >
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors">{nomeMes}</h4>
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded-md border ${statusColor}`}>
                                  {statusLabel}
                                </span>
                             </div>
                             <div className="text-right flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                   <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 block">Total Previsto</span>
                                   <span className={`text-xl font-black ${valorFaturaItem < 0 ? 'text-emerald-500' : statusLabel === 'Fatura Atual' ? 'text-blue-600' : statusLabel === 'FECHADA' || statusLabel === 'VENCIDA' ? 'text-red-500' : statusLabel === 'PAGA' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                     R$ {Math.max(0, valorFaturaItem).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                   </span>
                                </div>
                                <LucideIcons.ChevronRight size={20} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
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
                      )
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
