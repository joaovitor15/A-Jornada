import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export interface EAFCAthlete {
  id: string;
  profile_id: string;
  ger: number;
  quantity: number;
  created_at?: string;
}

export function useEAFCAthletes(profileId?: string) {
  const [athletes, setAthletes] = useState<EAFCAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!profileId) {
      setAthletes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('eafc_athletes')
        .select('*')
        .eq('profile_id', profileId)
        .order('ger', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAthletes(data || []);
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

  const addAthlete = async (athlete: Omit<EAFCAthlete, 'id' | 'profile_id' | 'created_at'>) => {
    if (!profileId) return { error: new Error('Sem profileId') };

    try {
      const { data: existings } = await supabase
        .from('eafc_athletes')
        .select('*')
        .eq('profile_id', profileId)
        .eq('ger', athlete.ger);

      const existing = existings?.find(a => a.ger === athlete.ger);

      if (existing) {
        // Just update quantity
        const { data, error } = await supabase
          .from('eafc_athletes')
          .update({ quantity: existing.quantity + athlete.quantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        setAthletes(prev => prev.map(a => a.id === existing.id ? data : a));
        return { data, error: null };
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('eafc_athletes')
          .insert([{ ...athlete, profile_id: profileId }])
          .select()
          .single();

        if (error) throw error;
        setAthletes(prev => [data, ...prev].sort((a, b) => b.ger - a.ger));
        return { data, error: null };
      }
    } catch (err: any) {
      console.error('Error adding athlete:', err);
      return { error: err };
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const athlete = athletes.find(a => a.id === id);
    if (!athlete) return { error: new Error('Atleta não encontrado') };

    const newQuantity = athlete.quantity + delta;
    
    try {
      if (newQuantity <= 0) {
        // Delete if quantity reaches 0
        const { error } = await supabase
          .from('eafc_athletes')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setAthletes(prev => prev.filter(a => a.id !== id));
        return { error: null };
      } else {
        // Update
        const { data, error } = await supabase
          .from('eafc_athletes')
          .update({ quantity: newQuantity })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        setAthletes(prev => prev.map(a => a.id === id ? data : a));
        return { error: null };
      }
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      return { error: err };
    }
  };

  const removeAthlete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eafc_athletes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setAthletes(prev => prev.filter(a => a.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error removing athlete:', err);
      return { error: err };
    }
  };

  return {
    athletes,
    loading,
    error,
    addAthlete,
    updateQuantity,
    removeAthlete,
    refreshData: fetchData
  };
}

