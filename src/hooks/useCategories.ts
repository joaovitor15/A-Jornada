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
    let { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });
      
    if (error) console.error("Erro ao buscar categorias:", error);
    
    if (data && profileId) {
      const ajustesReceita = data.filter(c => c.nome.toLowerCase() === 'ajuste de saldo' && c.tipo === 'receita');
      const ajustesDespesa = data.filter(c => c.nome.toLowerCase() === 'ajuste de saldo' && c.tipo === 'despesa');
      
      let needRefresh = false;

      // Limpar duplicatas de receita
      if (ajustesReceita.length > 1) {
        const toDelete = ajustesReceita.slice(1).map(c => c.id);
        await supabase.from('tags').delete().in('category_id', toDelete);
        await supabase.from('tags').delete().in('categoria_id', toDelete);
        await supabase.from('categories').delete().in('id', toDelete);
        needRefresh = true;
      }
      
      // Limpar duplicatas de despesa
      if (ajustesDespesa.length > 1) {
        const toDelete = ajustesDespesa.slice(1).map(c => c.id);
        await supabase.from('tags').delete().in('category_id', toDelete);
        await supabase.from('tags').delete().in('categoria_id', toDelete);
        await supabase.from('categories').delete().in('id', toDelete);
        needRefresh = true;
      }

      const ajusteReceita = ajustesReceita[0];
      const ajusteDespesa = ajustesDespesa[0];
      
      if (!ajusteReceita) {
        await supabase.from('categories').insert({ profile_id: profileId, nome: 'Ajuste de Saldo', tipo: 'receita', cor: '#10B981', icone: 'Settings' });
        needRefresh = true;
      } else if (ajusteReceita.icone !== 'Settings') {
        await supabase.from('categories').update({ icone: 'Settings' }).eq('id', ajusteReceita.id);
        needRefresh = true;
      }

      if (!ajusteDespesa) {
        await supabase.from('categories').insert({ profile_id: profileId, nome: 'Ajuste de Saldo', tipo: 'despesa', cor: '#EF4444', icone: 'Settings' });
        needRefresh = true;
      } else if (ajusteDespesa.icone !== 'Settings') {
        await supabase.from('categories').update({ icone: 'Settings' }).eq('id', ajusteDespesa.id);
        needRefresh = true;
      }
      
      if (needRefresh) {
        const { data: newData } = await supabase
          .from('categories')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: true });
        data = newData;
      }
    }

    setCategories(data || []);
    setLoading(false);
  }

  async function buscarTags() {
    let { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });
      
    if (error) console.error("Erro ao buscar tags:", error);

    // Garantir que as tags de Ajuste de Saldo existam
    if (data && profileId) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id, tipo, nome')
        .eq('profile_id', profileId)
        .ilike('nome', 'Ajuste de Saldo');

      if (catData && catData.length > 0) {
        let needRefresh = false;
        for (const cat of catData) {
          const expectedTagName = cat.tipo === 'receita' ? 'Ajuste Receita +' : 'Ajuste Despesa -';
          const catTags = data.filter(t => t.category_id === cat.id);
          
          if (catTags.length === 0) {
            await supabase.from('tags').insert({
              profile_id: profileId,
              category_id: cat.id,
              categoria_id: cat.id,
              nome: expectedTagName
            });
            needRefresh = true;
          } else {
            let keepId = catTags[0].id;
            const existingExpected = catTags.find(t => t.nome === expectedTagName);
            if (existingExpected) {
              keepId = existingExpected.id;
            } else {
              await supabase.from('tags').update({ nome: expectedTagName }).eq('id', keepId);
              needRefresh = true;
            }
            
            const toDelete = catTags.filter(t => t.id !== keepId).map(t => t.id);
            if (toDelete.length > 0) {
              await supabase.from('tags').delete().in('id', toDelete);
              needRefresh = true;
            }
          }
        }

        if (needRefresh) {
          const { data: newData } = await supabase
            .from('tags')
            .select('*')
            .eq('profile_id', profileId)
            .order('created_at', { ascending: true });
          data = newData;
        }
      }
    }

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
