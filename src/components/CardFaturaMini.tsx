import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { calcularFaturaCard, helperCalcularMesFechamentoParaVencimento } from '../utils/faturaUtils';

export function CardFaturaMini({
  activeProfileId,
  anoSelecionado,
  mesSelecionado,
  setActivePage,
  onTotalChange
}: {
  activeProfileId: string;
  anoSelecionado: number;
  mesSelecionado: number;
  setActivePage?: (page: string) => void;
  onTotalChange?: (total: number) => void;
}) {
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
        .from('transacoes')
        .select('*')
        .eq('profile_id', activeProfileId)
        .not('card_id', 'is', null);

      if (!error && data) {
        setTransacoesCard(data);
      }
      setTransacoesLoading(false);
    }
    fetchTodosGastos();
  }, [activeProfileId, cards]);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const nomeMes = nomesMeses[(mesSelecionado || 1) - 1];

  // Calcula apenas a fatura cujo VENCIMENTO ocorre no mês selecionado
  let totalPendente = 0;
  let totalGasto = 0;
  let temFaturaNoMes = false;

  if (cards.length > 0) {
    cards.forEach((c) => {
      const { anoFechamento, mesFechamento } = helperCalcularMesFechamentoParaVencimento(
        c.dia_fechamento_fatura,
        c.dia_vencimento_fatura,
        anoSelecionado,
        mesSelecionado
      );
      const f = calcularFaturaCard(c, transacoesCard, anoFechamento, mesFechamento);
      totalPendente += f.valorPendente;
      totalGasto += f.totalFatura;
      if (f.totalFatura > 0 || f.despesasTotal > 0 || f.valorPendente > 0) {
        temFaturaNoMes = true;
      }
    });
  }

  // Notificar Dashboard sobre o total pendente para abater no saldo do mês
  useEffect(() => {
    if (onTotalChange) {
      if (loading || transacoesLoading) {
        onTotalChange(0);
      } else {
        onTotalChange(Math.max(0, totalPendente));
      }
    }
  }, [totalPendente, onTotalChange, loading, transacoesLoading]);

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

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
    return (
      <div
        onClick={() => setActivePage?.('cartoes')}
        className={`bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group ${
          setActivePage ? 'cursor-pointer hover:border-violet-300 dark:hover:border-violet-900/50 transition-all hover:shadow-md' : ''
        }`}
      >
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#8B5CF6] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
        <div className="flex items-start justify-between mb-[16px] relative z-10">
          <div className="p-[6px] bg-[#F5F3FF] dark:bg-violet-900/20 rounded-full text-[#8B5CF6] dark:text-violet-500 w-[32px] h-[32px] flex items-center justify-center">
            <CreditCard size={18} />
          </div>
          <div className="flex items-center gap-1">
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              {`Fatura de ${nomeMes}`}
            </span>
            {setActivePage && <ChevronRight size={14} className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />}
          </div>
        </div>
        <div className="flex flex-col relative z-10">
          <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#8B5CF6] dark:text-violet-500 leading-tight flex-wrap break-all">
            R$ 0,00
          </span>
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] mt-1 group-hover:text-violet-500 transition-colors">
            Nenhum cartão cadastrado
          </span>
        </div>
      </div>
    );
  }

  const isFaturaPaga = totalPendente <= 0.01;

  return (
    <div
      onClick={() => setActivePage?.('cartoes')}
      className={`bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group ${
        setActivePage ? 'cursor-pointer hover:border-violet-300 dark:hover:border-violet-900/50 transition-all hover:shadow-md' : ''
      }`}
    >
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#8B5CF6] rounded-full blur-3xl opacity-[0.15] group-hover:opacity-[0.25] dark:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-700"></div>
      <div className="flex items-start justify-between mb-[16px] relative z-10">
        <div className="p-[6px] bg-[#F5F3FF] dark:bg-violet-900/20 rounded-full text-[#8B5CF6] dark:text-violet-500 w-[32px] h-[32px] flex items-center justify-center">
          <CreditCard size={18} />
        </div>
        <div className="flex items-center gap-1">
          <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
            {cards.length > 1 ? `Fatura de ${nomeMes} (${cards.length})` : `Fatura de ${nomeMes}`}
          </span>
          {setActivePage && <ChevronRight size={14} className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />}
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#8B5CF6] dark:text-violet-500 leading-tight flex-wrap break-all">
          {formatarValor(totalPendente)}
        </span>
        {isFaturaPaga ? (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-500" />
            Fatura paga
          </span>
        ) : (
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Não paga
          </span>
        )}
      </div>
    </div>
  );
}
