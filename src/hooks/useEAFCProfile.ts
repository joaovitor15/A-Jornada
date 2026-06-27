import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface EAFCProfile {
  id: string;
  profile_id: string;
  fragmentos: number;
  last_daily_claim?: string | null;
  safe_spend_percentage?: number;
  warning_spend_percentage?: number;
}

export function useEAFCProfile(profileId?: string) {
  const [eafcProfile, setEafcProfile] = useState<EAFCProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      setEafcProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('eafc_club')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle();

        if (error) throw error;
        setEafcProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil EAFC:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [profileId]);

  const saveFragmentos = async (fragmentos: number, last_daily_claim?: string | null) => {
    if (!profileId) return { error: new Error('Sem profileId') };

    try {
      const updateData: any = { fragmentos };
      if (last_daily_claim !== undefined) {
        updateData.last_daily_claim = last_daily_claim;
      }

      if (eafcProfile) {
        const { data, error } = await supabase
          .from('eafc_club')
          .update(updateData)
          .eq('id', eafcProfile.id)
          .select()
          .single();

        if (error) throw error;
        if (data) setEafcProfile(data);
        return { error: null };
      } else {
        const insertData: any = { profile_id: profileId, fragmentos };
        if (last_daily_claim !== undefined) {
          insertData.last_daily_claim = last_daily_claim;
        }
        
        const { data, error } = await supabase
          .from('eafc_club')
          .insert([insertData])
          .select()
          .single();

        if (error) throw error;
        if (data) setEafcProfile(data);
        return { error: null };
      }
    } catch (error: any) {
      console.error('Erro ao salvar fragmentos:', error);
      return { error };
    }
  };

  const savePercentages = async (safe_spend: number) => {
    if (!profileId) return { error: new Error('Sem profileId') };
    
    try {
      if (eafcProfile) {
        const { data, error } = await supabase
          .from('eafc_club')
          .update({
            safe_spend_percentage: safe_spend
          })
          .eq('id', eafcProfile.id)
          .select()
          .single();

        if (error) throw error;
        if (data) setEafcProfile(data);
        return { error: null };
      } else {
        const { data, error } = await supabase
          .from('eafc_club')
          .insert([{ 
            profile_id: profileId, 
            fragmentos: 0,
            safe_spend_percentage: safe_spend
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setEafcProfile(data);
        return { error: null };
      }
    } catch (error: any) {
      console.error('Erro ao salvar porcentagens:', error);
      return { error };
    }
  };

  return { eafcProfile, loading, saveFragmentos, savePercentages };
}
