import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Category {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  cor: string;
  icone: string;
  archived?: boolean;
  archived_at?: string | null;
  profile_id: string;
  created_at: string;
  ordem?: number | null;
}

export interface Tag {
  id: string;
  nome: string;
  category_id: string;
  archived?: boolean;
  profile_id: string;
  created_at: string;
}

export function useCategories(profileId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    buscarCategorias();
    buscarTags();
  }, [profileId]);

  async function buscarCategorias() {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });
      
    if (error) console.error("Erro ao buscar categorias:", error);
    setCategories(data || []);
    setLoading(false);
  }

  async function buscarTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });
      
    if (error) console.error("Erro ao buscar tags:", error);
    setTags(data || []);
  }

  async function criarCategoria(dados: Partial<Category>) {
    console.log("Criando categoria...", dados, profileId);
    const { error } = await supabase
      .from('categories')
      .insert([{ ...dados, profile_id: profileId }]);
      
    if (error) {
       console.error("Erro completo ao criar categoria:", JSON.stringify(error, null, 2));
       alert("Erro ao criar categoria: " + error.message + " | Detalhes: " + (error.details || ""));
    } else {
       await buscarCategorias();
    }
    return { error };
  }

  async function editarCategoria(id: string, dados: Partial<Category>) {
    const { error } = await supabase
      .from('categories')
      .update(dados)
      .eq('id', id);
      
    if (error) {
       console.error("Erro completo ao editar categoria:", JSON.stringify(error, null, 2));
       alert("Erro ao editar categoria: " + error.message);
    } else {
       await buscarCategorias();
    }
    return { error };
  }

  async function excluirCategoria(id: string, force: boolean = false) {
    // 1. Verificar se existe alguma tag vinculada à categoria que tenha transações
    const categoryTags = tags.filter(t => t.category_id === id);
    const tagIds = categoryTags.map(t => t.id);

    let temTransacoes = false;
    if (tagIds.length > 0) {
      const { count, error: countError } = await supabase
        .from('transacoes')
        .select('id', { count: 'exact', head: true })
        .in('tag_id', tagIds);
      
      if (!countError && count && count > 0) {
        temTransacoes = true;
      }
    }

    // 2. SE TEM TRANSAÇÕES: Arquivar
    if (temTransacoes) {
      const { error: archiveError } = await supabase
        .from('categories')
        .update({ 
          archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('id', id);

      if (!archiveError) {
        // Arquivar tags vinculadas também
        await supabase
          .from('tags')
          .update({ archived: true })
          .or(`category_id.eq.${id},categoria_id.eq.${id}`);
          
        await buscarCategorias();
        await buscarTags();
        return { error: null, archived: true };
      }
      return { error: archiveError, archived: false };
    }

    // 3. SE NÃO TEM TRANSAÇÕES: Abrir confirmação ou Excluir
    if (!force) {
      return { 
        error: null, 
        requireConfirm: true, 
        message: `Esta categoria não possui transações vinculadas.\n\nDeseja excluí-la permanentemente?`
      };
    }

    // Exclui tags primeiro (mesmo sem transações, se existirem tags vazias)
    if (tagIds.length > 0) {
      await supabase
        .from('tags')
        .delete()
        .or(`category_id.eq.${id},categoria_id.eq.${id}`);
    }

    // Exclui a categoria
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
       console.error("Erro ao excluir categoria:", error);
       alert("Erro ao excluir categoria: " + error.message);
    } else {
       await buscarCategorias();
       await buscarTags();
    }
    return { error, requireConfirm: false, deleted: true };
  }

  async function criarTag(dados: Partial<Tag>) {
    const payload: any = { 
      ...dados, 
      profile_id: profileId 
    };

    // Suporte a ambas as colunas para evitar erros de restrição NOT NULL
    if (dados.category_id) {
      payload.categoria_id = dados.category_id;
    }

    const { error } = await supabase
      .from('tags')
      .insert([payload]);
      
    if (error) {
       console.error("Erro ao criar tag:", error);
       alert("Erro ao criar tag: " + error.message);
    } else {
       await buscarTags();
    }
    return { error };
  }

  async function excluirTag(id: string, force: boolean = false) {
    // 1. Verificar se a tag tem transações
    const { count, error: countError } = await supabase
      .from('transacoes')
      .select('id', { count: 'exact', head: true })
      .eq('tag_id', id);

    if (!countError && count && count > 0) {
      // 2. SE TEM TRANSAÇÕES: Arquivar
      const { error: archiveError } = await supabase
        .from('tags')
        .update({ archived: true })
        .eq('id', id);

      if (!archiveError) {
        await buscarTags();
        return { error: null, archived: true };
      }
      return { error: archiveError, archived: false };
    }

    // 3. SE NÃO TEM TRANSAÇÕES: Abrir confirmação ou Excluir
    if (!force) {
      return { 
        error: null, 
        requireConfirm: true, 
        message: 'Esta tag não possui transações vinculadas.\n\nDeseja excluí-la permanentemente?'
      };
    }

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
      
    if (error) {
       console.error("Erro ao excluir tag:", error);
       alert("Erro ao excluir tag: " + error.message);
    } else {
       await buscarTags();
    }
    return { error, requireConfirm: false, deleted: true };
  }
  
  async function archiveTag(id: string) {
    const { error } = await supabase
      .from('tags')
      .update({ archived: true })
      .eq('id', id);
    if (!error) await buscarTags();
    return { error };
  }

  async function archiveCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .update({ 
        archived: true,
        archived_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Erro ao arquivar categoria:", error);
      return { error };
    }

    await supabase
      .from('tags')
      .update({ archived: true })
      .or(`category_id.eq.${id},categoria_id.eq.${id}`);

    await buscarCategorias();
    await buscarTags();
    return { error: null };
  }

  async function unarchiveCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .update({ 
        archived: false,
        archived_at: null
      })
      .eq('id', id);

    if (error) {
      console.error("Erro ao desarquivar categoria:", error);
      return { error };
    }

    await supabase
      .from('tags')
      .update({ archived: false })
      .or(`category_id.eq.${id},categoria_id.eq.${id}`);

    await buscarCategorias();
    await buscarTags();
    return { error: null };
  }

  return {
    categories,
    setCategories,
    tags,
    loading,
    criarCategoria,
    editarCategoria,
    excluirCategoria,
    criarTag,
    excluirTag,
    archiveCategory,
    unarchiveCategory,
    refresh: () => { buscarCategorias(); buscarTags(); }
  };
}
