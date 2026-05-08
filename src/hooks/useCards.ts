import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Card {
  id: string;
  profile_id: string;
  nome: string;
  bandeira: string;
  limite: number;
  dia_vencimento_fatura: number;
  dia_fechamento_fatura: number;
  cor: string;
  icone: string;
  tipo: 'credito' | 'debito' | 'pre_pago';
  created_at: string;
}

export function useCards(profileId?: string | null) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!profileId) {
      setCards([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('cards')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setCards(data as Card[] || []);
    } catch (err: any) {
      console.error("Falha ao buscar cartões:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const manageCardCategoryOnAdd = async () => {
    if (!profileId) return;

    let { data: cat } = await supabase
        .from('categories')
        .select('id, archived')
        .eq('profile_id', profileId)
        .ilike('nome', 'Cartão de Crédito')
        .limit(1)
        .single();
    
    let categoryId = cat?.id;

    if (!categoryId) {
        const { data: newCat, error: catError } = await supabase
            .from('categories')
            .insert({ profile_id: profileId, nome: 'Cartão de Crédito', tipo: 'despesa', cor: '#EF4444', icone: 'CreditCard' })
            .select()
            .single();
        categoryId = newCat?.id;

        if (categoryId) {
            await supabase.from('tags').insert([
                { profile_id: profileId, category_id: categoryId, categoria_id: categoryId, nome: 'Antecipação' },
                { profile_id: profileId, category_id: categoryId, categoria_id: categoryId, nome: 'Pagamento Fatura' }
            ]);
        }
    } else {
        if (cat.archived) {
             await supabase.from('categories').update({ archived: false }).eq('id', categoryId);
             await supabase.from('tags').update({ archived: false }).or(`category_id.eq.${categoryId},categoria_id.eq.${categoryId}`);
        }
    }
  };

  const manageCardCategoryOnDelete = async () => {
    if (!profileId) return;

    const { data: remainingCards } = await supabase
       .from('cards')
       .select('id')
       .eq('profile_id', profileId);

    if (!remainingCards || remainingCards.length === 0) {
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('profile_id', profileId)
            .ilike('nome', 'Cartão de Crédito')
            .limit(1)
            .single();
            
        if (cat) {
             await supabase.from('categories').update({ archived: true }).eq('id', cat.id);
             await supabase.from('tags').update({ archived: true }).or(`category_id.eq.${cat.id},categoria_id.eq.${cat.id}`);
        }
    }
  };

  const addCard = async (card: Omit<Card, 'id' | 'created_at' | 'profile_id'>) => {
    if (!profileId) return { error: { message: 'Perfil não selecionado' } };
    setLoading(true);
    const { error: err } = await supabase.from('cards').insert([{ ...card, profile_id: profileId }]);
    if (err) {
      setLoading(false);
      return { error: err };
    }
    
    if (card.tipo === 'credito') {
      await manageCardCategoryOnAdd();
    }
    
    await fetchCards();
    return { error: null };
  };

  const updateCard = async (id: string, card: Partial<Omit<Card, 'id' | 'created_at' | 'profile_id'>>) => {
    setLoading(true);
    const { error: err } = await supabase.from('cards').update(card).eq('id', id);
    if (err) {
      setLoading(false);
      return { error: err };
    }
    await fetchCards();
    return { error: null };
  };

  const deleteCard = async (id: string) => {
    setLoading(true);
    const { error: err } = await supabase.from('cards').delete().eq('id', id);
    if (err) {
      setLoading(false);
      return { error: err };
    }
    await manageCardCategoryOnDelete();
    await fetchCards();
    return { error: null };
  };

  return {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    refresh: fetchCards
  };
}
