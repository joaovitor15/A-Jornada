import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface EAFCObservacao {
  id: string;
  profile_id: string;
  nome: string;
  valor: number;
  prioridade: number;
  comprado: boolean;
  tipo: string;
  created_at: string;
}

export function useEAFCObservacao(profileId?: string) {
  const [observacoes, setObservacoes] = useState<EAFCObservacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      fetchObservacoes();
    } else {
      setObservacoes([]);
      setLoading(false);
    }
  }, [profileId]);

  const fetchObservacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eafc_observacao')
        .select('*')
        .eq('profile_id', profileId)
        .order('comprado', { ascending: true })
        .order('prioridade', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setObservacoes(data || []);
    } catch (error) {
      console.error('Error fetching observacoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addObservacao = async (nome: string, valor: number, prioridade: number = 1, tipo: string = 'Time Ideal') => {
    if (!profileId) return { error: new Error('Sem profileId') };
    
    try {
      const { data, error } = await supabase
        .from('eafc_observacao')
        .insert([{ profile_id: profileId, nome, valor, prioridade, comprado: false, tipo }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setObservacoes(prev => [data, ...prev]);
        fetchObservacoes(); // to reorder correctly
      }
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding observacao:', error);
      return { data: null, error };
    }
  };

  const updateObservacao = async (id: string, updates: Partial<EAFCObservacao>) => {
    try {
      const { data, error } = await supabase
        .from('eafc_observacao')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setObservacoes(prev => prev.map(obs => obs.id === id ? data : obs));
        fetchObservacoes(); // to reorder correctly
      }
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating observacao:', error);
      return { data: null, error };
    }
  };

  const deleteObservacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eafc_observacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setObservacoes(prev => prev.filter(obs => obs.id !== id));
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting observacao:', error);
      return { error };
    }
  };

  const toggleComprado = async (id: string, atual: boolean) => {
    return updateObservacao(id, { comprado: !atual });
  };

  return { 
    observacoes, 
    loading, 
    addObservacao, 
    updateObservacao, 
    deleteObservacao,
    toggleComprado,
    fetchObservacoes
  };
}
