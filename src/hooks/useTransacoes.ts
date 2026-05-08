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
  criado_em: string;
  atualizado_em: string;
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
          card_id: dados.card_id
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
      const { error: err } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);

      if (err) {
        console.error('Erro ao excluir transação:', err);
        throw err;
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
