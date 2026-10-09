import { supabase } from '../supabaseClient';

export interface SalarioTagInfo {
  categoryId: string;
  categoryName: string;
  tagId: string;
  tagName: string;
}

export async function getOrCreateSalarioTag(profileId: string): Promise<SalarioTagInfo | null> {
  if (!profileId) return null;

  try {
    // 1. Encontrar ou criar categoria Salário para este perfil (tipo receita)
    let { data: catSalario } = await supabase
      .from('categories')
      .select('id, nome, cor, icone')
      .eq('profile_id', profileId)
      .eq('tipo', 'receita')
      .ilike('nome', 'salário')
      .limit(1)
      .maybeSingle();

    if (!catSalario) {
      const { data: catSemAcento } = await supabase
        .from('categories')
        .select('id, nome, cor, icone')
        .eq('profile_id', profileId)
        .eq('tipo', 'receita')
        .ilike('nome', 'salario')
        .limit(1)
        .maybeSingle();
      catSalario = catSemAcento;
    }

    if (!catSalario) {
      const { data: catComposta } = await supabase
        .from('categories')
        .select('id, nome, cor, icone')
        .eq('profile_id', profileId)
        .eq('tipo', 'receita')
        .ilike('nome', '%salár%')
        .not('nome', 'ilike', '%mari%')
        .limit(1)
        .maybeSingle();
      catSalario = catComposta;
    }

    if (!catSalario) {
      const { data: novaCat, error: errCat } = await supabase
        .from('categories')
        .insert({
          profile_id: profileId,
          nome: 'Salário',
          tipo: 'receita',
          cor: '#10B981',
          icone: 'DollarSign'
        })
        .select('id, nome, cor, icone')
        .single();

      if (!errCat && novaCat) {
        catSalario = novaCat;
      }
    }

    if (!catSalario) return null;

    // 2. Encontrar ou criar a tag "Pagamento" pertencente à categoria "Salário"
    // Buscar todas as tags deste perfil
    const { data: allTags } = await supabase
      .from('tags')
      .select('id, nome, category_id, categoria_id')
      .eq('profile_id', profileId);

    let tagPagamento: any = null;

    if (allTags && allTags.length > 0) {
      // Filtrar tags vinculadas à categoria Salário
      const tagsDaCatSalario = allTags.filter(
        t => t.category_id === catSalario.id || (t as any).categoria_id === catSalario.id
      );

      // Prioridade 1: tag com nome exato "Pagamento" dentro da categoria Salário
      tagPagamento = tagsDaCatSalario.find(
        t => t.nome && t.nome.trim().toLowerCase() === 'pagamento'
      );

      // Prioridade 2: tag que contenha "pagamento" dentro da categoria Salário (e não seja fatura)
      if (!tagPagamento) {
        tagPagamento = tagsDaCatSalario.find(
          t => t.nome && t.nome.toLowerCase().includes('pagamento') && !t.nome.toLowerCase().includes('fatura')
        );
      }

      // Prioridade 3: tag com nome "Pagamento" em allTags do perfil (mesmo que sem category_id correto)
      if (!tagPagamento) {
        const tagPagamentoAvulsa = allTags.find(
          t => t.nome && t.nome.trim().toLowerCase() === 'pagamento' && !t.nome.toLowerCase().includes('fatura')
        );
        if (tagPagamentoAvulsa) {
          tagPagamento = tagPagamentoAvulsa;
          // Atualiza para vincular à categoria Salário
          await supabase
            .from('tags')
            .update({ category_id: catSalario.id, categoria_id: catSalario.id })
            .eq('id', tagPagamento.id);
        }
      }

      // Prioridade 4: Se não encontrou nenhuma tag chamada "Pagamento", verificar se há alguma tag na categoria Salário
      // MAS JAMAIS pegar tags contendo "mari"!
      if (!tagPagamento) {
        tagPagamento = tagsDaCatSalario.find(
          t => t.nome && !t.nome.toLowerCase().includes('mari')
        );
      }
    }

    // Se ainda não existir a tag "Pagamento" na categoria Salário, cria ela!
    if (!tagPagamento) {
      const { data: novaTag, error: errTag } = await supabase
        .from('tags')
        .insert({
          profile_id: profileId,
          category_id: catSalario.id,
          categoria_id: catSalario.id,
          nome: 'Pagamento'
        })
        .select('id, nome')
        .single();

      if (!errTag && novaTag) {
        tagPagamento = novaTag;
      }
    }

    if (!tagPagamento) return null;

    return {
      categoryId: catSalario.id,
      categoryName: catSalario.nome,
      tagId: tagPagamento.id,
      tagName: tagPagamento.nome
    };
  } catch (err) {
    console.error('Erro em getOrCreateSalarioTag:', err);
    return null;
  }
}

export async function repararTransacoesSalarioErradas(profileId: string): Promise<{ success: boolean; updatedCount: number }> {
  if (!profileId) return { success: false, updatedCount: 0 };

  try {
    const salarioInfo = await getOrCreateSalarioTag(profileId);
    if (!salarioInfo) return { success: false, updatedCount: 0 };

    // Buscar transações de receita deste perfil
    const { data: txs, error } = await supabase
      .from('transacoes')
      .select('id, descricao, tag_id, tipo, card_id')
      .eq('profile_id', profileId)
      .eq('tipo', 'receita')
      .is('card_id', null);

    if (error || !txs) return { success: false, updatedCount: 0 };

    // Buscar tags do perfil para identificar explicitamente tags erradas (ex: 'salario Mari', 'Pagamento Fatura')
    const { data: allTags } = await supabase
      .from('tags')
      .select('id, nome')
      .eq('profile_id', profileId);

    const wrongTagIds = (allTags || [])
      .filter(t => t.id !== salarioInfo.tagId && (
        t.nome.toLowerCase().includes('mari') || 
        t.nome.toLowerCase() === 'pagamento fatura'
      ))
      .map(t => t.id);

    let updatedCount = 0;

    for (const t of txs) {
      const desc = (t.descricao || '').toLowerCase();
      const isSalarioDesc = 
        desc.startsWith('pix:') || 
        desc.includes('salário') || 
        desc.includes('salario') || 
        desc.includes('piso farmacêutico') || 
        desc.includes('pro labore') || 
        desc.includes('pró labore') || 
        desc.includes('pro-labore') || 
        desc.includes('pró-labore') || 
        desc.includes('prolabore') || 
        desc.includes('prólabore') || 
        desc.includes('restante');
      
      const hasWrongTag = wrongTagIds.includes(t.tag_id) || !t.tag_id || (isSalarioDesc && t.tag_id !== salarioInfo.tagId);

      if (isSalarioDesc && hasWrongTag) {
        await supabase
          .from('transacoes')
          .update({ tag_id: salarioInfo.tagId })
          .eq('id', t.id);
        updatedCount++;
      }
    }

    return { success: true, updatedCount };
  } catch (err) {
    console.error('Erro ao reparar transações de salário:', err);
    return { success: false, updatedCount: 0 };
  }
}

