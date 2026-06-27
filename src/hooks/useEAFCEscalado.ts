import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export interface EAFCEscalado {
  id: string;
  profile_id: string;
  ger: number;
  quantity: number;
  created_at?: string;
}

export function useEAFCEscalado(profileId?: string) {
  const [escalados, setEscalados] = useState<EAFCEscalado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!profileId) {
      setEscalados([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('eafc_escalado')
        .select('*')
        .eq('profile_id', profileId)
        .order('ger', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEscalados(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEscalado = async (athlete: Omit<EAFCEscalado, 'id' | 'profile_id' | 'created_at'>) => {
    if (!profileId) return { error: new Error('Sem profileId') };

    try {
      const { data: existings } = await supabase
        .from('eafc_escalado')
        .select('*')
        .eq('profile_id', profileId)
        .eq('ger', athlete.ger);

      const existing = existings?.find(a => a.ger === athlete.ger);

      if (existing) {
        // Just update quantity
        const { data, error } = await supabase
          .from('eafc_escalado')
          .update({ quantity: existing.quantity + athlete.quantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        setEscalados(prev => prev.map(a => a.id === existing.id ? data : a));
        return { data, error: null };
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('eafc_escalado')
          .insert([{ ...athlete, profile_id: profileId }])
          .select()
          .single();

        if (error) throw error;
        setEscalados(prev => [data, ...prev].sort((a, b) => b.ger - a.ger));
        return { data, error: null };
      }
    } catch (err: any) {
      console.error('Error adding escalado:', err);
      return { error: err };
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const athlete = escalados.find(a => a.id === id);
    if (!athlete) return { error: new Error('Atleta não encontrado') };

    const newQuantity = athlete.quantity + delta;
    
    try {
      if (newQuantity <= 0) {
        // Delete if quantity reaches 0
        const { error } = await supabase
          .from('eafc_escalado')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setEscalados(prev => prev.filter(a => a.id !== id));
        return { error: null };
      } else {
        // Update
        const { data, error } = await supabase
          .from('eafc_escalado')
          .update({ quantity: newQuantity })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        setEscalados(prev => prev.map(a => a.id === id ? data : a));
        return { error: null };
      }
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      return { error: err };
    }
  };

  const removeEscalado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eafc_escalado')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setEscalados(prev => prev.filter(a => a.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error removing escalado:', err);
      return { error: err };
    }
  };

  return {
    escalados,
    loading,
    error,
    addEscalado,
    updateQuantity,
    removeEscalado,
    refreshData: fetchData
  };
}
