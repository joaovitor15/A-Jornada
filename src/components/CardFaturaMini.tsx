import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { helperCalcularPeriodo, helperCalcularPeriodoParaMes } from '../utils/faturaUtils';

export function CardFaturaMini({ activeProfileId, anoSelecionado, mesSelecionado, onTotalChange }: { activeProfileId: string, anoSelecionado: number, mesSelecionado: number, onTotalChange?: (total: number) => void }) {
  const { cards, loading } = useCards(activeProfileId);
  const [transacoesCard, setTransacoesCard] = useState<any[]>([]);
  const [transacoesLoading, setTransacoesLoading] = useState(true);

  useEffect(() => {
    async function fetchTodosGastos() {
      if (!activeProfileId || !cards.length) {
        setTransacoesLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq('profile_id', activeProfileId)
        .not('card_id', 'is', null);

      if (!error && data) {
         setTransacoesCard(data);
      }
      setTransacoesLoading(false);
    }
    fetchTodosGastos();
  }, [activeProfileId, cards]);

  // Compute total before any early returns to respect Rules of Hooks
  let totalPendente = 0;
  let valorFaturaAtualView = 0;
  let unpaidPassado = 0;
  
  if (cards.length > 0) {
    const card = cards[0];
    const transacoesAtivas = transacoesCard.filter(t => t.status !== 'ignorado');

    const globalDespesas = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa').reduce((acc, t) => acc + Number(t.valor), 0);
    const fimDoMesSelecionado = new Date(anoSelecionado, mesSelecionado, 0).toISOString().split('T')[0];
  const globalCreditos = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita' && t.data <= fimDoMesSelecionado).reduce((acc, t) => acc + Number(t.valor), 0);

    const periodoCardAtual = helperCalcularPeriodoParaMes(card.dia_fechamento_fatura, card.dia_vencimento_fatura, anoSelecionado, mesSelecionado);

    const despesasPassado = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data < periodoCardAtual.inicioStr).reduce((acc, t) => acc + Number(t.valor), 0);
    const despesasAberto = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data >= periodoCardAtual.inicioStr && t.data <= periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);

    let creditosRestantes = globalCreditos;
    unpaidPassado = Math.max(0, despesasPassado - creditosRestantes);
    creditosRestantes = Math.max(0, creditosRestantes - despesasPassado);

    const unpaidAberto = Math.max(0, despesasAberto - creditosRestantes);
    creditosRestantes = Math.max(0, creditosRestantes - despesasAberto);

    const excedenteCredito = creditosRestantes;
    valorFaturaAtualView = excedenteCredito > 0 ? -excedenteCredito : unpaidAberto;
    totalPendente = unpaidPassado + valorFaturaAtualView;
  }

  // Hook ALWAYS executed in the same order
  useEffect(() => {
    if (onTotalChange) {
      // Avoid passing back values during loading to prevent janky calculations
      if (loading || transacoesLoading) {
         onTotalChange(0);
      } else {
         onTotalChange(Math.max(0, valorFaturaAtualView));
      }
    }
  }, [valorFaturaAtualView, onTotalChange, loading, transacoesLoading]);

  if (loading || transacoesLoading) {
    return (
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
            <div className="flex flex-col relative z-10">
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-8"></div>
            </div>
        </div>
    );
  }

  if (cards.length === 0) {
    return null; // Do not render if no cards
  }

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  return (
    <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#8B5CF6] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
      <div className="flex items-start justify-between mb-[16px] relative z-10">
        <div className="p-[6px] bg-[#F5F3FF] dark:bg-violet-900/20 rounded-full text-[#8B5CF6] dark:text-violet-500 w-[32px] h-[32px] flex items-center justify-center">
          <CreditCard size={18} />
        </div>
        <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
          Fatura Cartão
        </span>
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#8B5CF6] dark:text-violet-500 leading-tight flex-wrap break-all">
          {formatarValor(Math.max(0, unpaidPassado + valorFaturaAtualView))}
        </span>
      </div>
    </div>
  );
}
