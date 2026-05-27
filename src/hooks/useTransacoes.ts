import { useState } from 'react';
import { supabase } from '../supabaseClient';

export interface Transacao {
  id: string;
  profile_id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  data: string;
  valor: number;
  forma_pagamento: string;
  tag_id: string;
  card_id?: string;
  recorrente_id?: string;
  num_parcelas?: number;
  status: 'previsto' | 'pago';
  valor_previsto?: number;
  criado_em: string;
  atualizado_em: string;
  cards?: {
    id: string;
    nome: string;
  };
  tags?: {
    id: string;
    nome: string;
    categories?: {
      id: string;
      nome: string;
      icone: string;
      cor: string;
    }
  };
}

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarTransacoesMes = async (profileId: string, mes: number, ano: number) => {
    setLoading(true);
    setError(null);
    try {
      const mesFormatado = String(mes).padStart(2, '0');
      const inicio = `${ano}-${mesFormatado}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const fim = `${ano}-${mesFormatado}-${ultimoDia}`;

      const { data, error: err } = await supabase
        .from('transacoes')
        .select(`
          *,
          cards ( id, nome ),
          tags (
            id,
            nome,
            categories!tags_category_id_fkey (
              id,
              nome,
              icone,
              cor
            )
          )
        `)
        .eq('profile_id', profileId)
        .gte('data', inicio)
        .lte('data', fim)
        .order('data', { ascending: false });

      if (err) {
        console.error('Erro ao carregar transações:', err);
        setError(err.message);
        return [];
      }

      const result = (data || []) as any as Transacao[];
      setTransacoes(result);
      return result;
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const carregarTransacoesAno = async (profileId: string, ano: number) => {
    setLoading(true);
    setError(null);
    try {
      const inicio = `${ano}-01-01`;
      const fim = `${ano}-12-31`;

      const { data, error: err } = await supabase
        .from('transacoes')
        .select(`
          *,
          cards ( id, nome ),
          tags (
            id,
            nome,
            categories!tags_category_id_fkey (
              id,
              nome,
              icone,
              cor
            )
          )
        `)
        .eq('profile_id', profileId)
        .gte('data', inicio)
        .lte('data', fim)
        .order('data', { ascending: false });

      if (err) {
        console.error('Erro ao carregar transações por ano:', err);
        setError(err.message);
        return [];
      }

      const result = (data || []) as any as Transacao[];
      setTransacoes(result);
      return result;
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const criarTransacao = async (dados: {
    profile_id: string;
    tipo: 'receita' | 'despesa';
    descricao: string;
    tag_id: string;
    data: string;
    valor: number;
    forma_pagamento: string;
    card_id?: string;
    recorrente_id?: string;
    num_parcelas?: number;
    status?: 'previsto' | 'pago';
    valor_previsto?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('transacoes')
        .insert({
          profile_id: dados.profile_id,
          tipo: dados.tipo,
          descricao: dados.descricao,
          tag_id: dados.tag_id,
          data: dados.data,
          valor: dados.valor,
          forma_pagamento: dados.forma_pagamento,
          card_id: dados.card_id,
          recorrente_id: dados.recorrente_id,
          num_parcelas: dados.num_parcelas,
          status: dados.status || 'pago',
          valor_previsto: dados.valor_previsto !== undefined ? dados.valor_previsto : dados.valor
        })
        .select()
        .single();

      if (err) {
        console.error('Erro ao criar transação:', err);
        throw err;
      }

      return { data, success: true };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const editarTransacao = async (id: string, dados: {
    tipo?: 'receita' | 'despesa';
    descricao?: string;
    tag_id?: string;
    data?: string;
    valor?: number;
    forma_pagamento?: string;
    card_id?: string | null;
    recorrente_id?: string | null;
    num_parcelas?: number | null;
    status?: 'previsto' | 'pago';
    valor_previsto?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('transacoes')
        .update({
          ...dados,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (err) {
        console.error('Erro ao editar transação:', err);
        throw err;
      }

      return { data, success: true };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const excluirTransacao = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get the transaction details before deleting to check if it's recurring
      // Wrapped in try/catch to handle cases where columns might be missing temporarily
      let tx: any = null;
      try {
        const { data } = await supabase
          .from('transacoes')
          .select('recorrente_id, data')
          .eq('id', id)
          .single();
        tx = data;
      } catch (e) {
        console.warn('Could not fetch recurring info for transaction', e);
      }

      const { error: err } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);

      if (err) {
        console.error('Erro ao excluir transação:', err);
        throw err;
      }

      // If it was a recurring transaction, we need to update the status in the recurring table
      if (tx?.recorrente_id) {
        // Find the most recent transaction for this recurring item (excluding the one we just deleted)
        const { data: lastTx } = await supabase
          .from('transacoes')
          .select('data')
          .eq('recorrente_id', tx.recorrente_id)
          .order('data', { ascending: false })
          .limit(1);

        const newLastDate = lastTx && lastTx.length > 0 ? `${lastTx[0].data}T12:00:00Z` : null;

        await supabase
          .from('transacoes_recorrentes')
          .update({ ultima_lancada: newLastDate })
          .eq('id', tx.recorrente_id);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    transacoes,
    loading,
    error,
    carregarTransacoesMes,
    carregarTransacoesAno,
    criarTransacao,
    editarTransacao,
    excluirTransacao
  };
}
