import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';

const { data: antDataAll } = await supabase
  .from('transacoes')
  .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )`)
  .eq('profile_id', activeProfileId);

console.log(antDataAll.filter(t => t.data.startsWith('2026-08')).map(t => ({ date: t.data, desc: t.descricao, valor: t.valor, tipo: t.tipo, status: t.status, card_id: t.card_id })));

