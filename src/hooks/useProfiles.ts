import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface SupabaseProfile {
  id: string;
  user_id: string | null;
  name: string;
  is_active: boolean;
  created_at: string;
  icone: string;
  tipo: 'pessoal' | 'empresa' | 'jogos';
  cor: string;
  enable_sistema_financeiro?: boolean;
  financeiro_show_dashboard?: boolean;
  financeiro_show_transacoes?: boolean;
  financeiro_show_transacoes_recorrentes?: boolean;
  financeiro_show_relatorios?: boolean;
  financeiro_show_categorias?: boolean;
  financeiro_show_tags?: boolean;
  financeiro_show_cartoes?: boolean;
  enable_sistema_investimentos?: boolean;
  investimentos_ativo?: boolean;
  investimentos_show_dashboard?: boolean;
  investimentos_show_ativos?: boolean;
  investimentos_show_operacoes?: boolean;
  investimentos_show_proventos?: boolean;
  game_ativo?: boolean;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca o ID do usuário logado dinamicamente
  async function getUserId() {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null; 
  }

  async function fetchProfiles() {
    setLoading(true);
    setError(null);
    try {
      const currentUserId = await getUserId();
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      // Se houver usuário, filtra. Se não, traz os sem usuário (testes)
      if (currentUserId) {
        query = query.eq('user_id', currentUserId);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetchProfiles error:", error);
        setError(error.message);
      } else {
        setProfiles(data || []);
      }
    } catch (err) {
      console.error("Supabase communication error:", err);
      setError('Falha na comunicação com o servidor');
    } finally {
      setLoading(false);
    }
  }

  async function createProfile(name: string, tipo: 'pessoal' | 'empresa' | 'jogos', cor: string, icone: string) {
    setLoading(true);
    const currentUserId = await getUserId();

    const { error } = await supabase
      .from('profiles')
      .insert([{
        user_id: currentUserId,
        name,
        tipo,
        cor,
        icone,
        is_active: profiles.length === 0
      }]);

    if (error) {
       setLoading(false);
       return { error };
    }
    
    await fetchProfiles();
    return { error: null };
  }

  async function updateProfile(id: string, name: string, tipo: 'pessoal' | 'empresa' | 'jogos', cor: string, icone: string) {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        name,
        tipo,
        cor,
        icone
      })
      .eq('id', id);

    if (error) {
      setLoading(false);
      return { error };
    }

    await fetchProfiles();
    setLoading(false);
    return { error: null };
  }

  async function updateProfileModules(id: string, modules: Partial<SupabaseProfile>) {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update(modules)
      .eq('id', id);

    if (error) {
      setLoading(false);
      return { error };
    }

    await fetchProfiles();
    setLoading(false);
    return { error: null };
  }

  async function deleteProfile(id: string) {
    setLoading(true);
    const currentUserId = await getUserId();
    
    let query = supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    // Reforça o filtro para bater com o que o fetchProfiles usa
    if (currentUserId) {
      query = query.eq('user_id', currentUserId);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query.select();

    if (!error && (!data || data.length === 0)) {
      // Se não deu erro mas deletou 0 linhas, é quase certo que é o RLS bloqueando
      setLoading(false);
      return { error: { message: 'Permissão negada (RLS). Você não é o dono deste perfil ou ele não existe.' } };
    }

    // Recarrega a lista
    await fetchProfiles();
    setLoading(false);
    return { error };
  }

  async function setProfileActive(id: string) {
    setLoading(true);
    const currentUserId = await getUserId();

    // Passo 1: desativa todos os perfis do usuário atual
    let query = supabase
      .from('profiles')
      .update({ is_active: false });
    
    if (currentUserId) {
      query = query.eq('user_id', currentUserId);
    } else {
      query = query.is('user_id', null);
    }

    const { error: erro1 } = await query;
    if (erro1) {
      setLoading(false);
      return { error: erro1 };
    }

    // Passo 2: ativa apenas o perfil selecionado
    const { error: erro2 } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', id);

    if (!erro2) {
      await fetchProfiles();
    }
    
    setLoading(false);
    return { error: erro2 };
  }

  useEffect(() => {
    fetchProfiles();
    
    // Escuta mudanças de auth para atualizar a lista de perfis
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfiles();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    profiles,
    loading,
    error,
    createProfile,
    updateProfile,
    updateProfileModules,
    deleteProfile,
    setProfileActive,
    refetch: fetchProfiles
  };
}
