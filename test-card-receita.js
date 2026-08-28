import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: antData } = await supabase.from('transacoes').select('tipo, valor, descricao, data, card_id').not('card_id', 'is', null).eq('tipo', 'receita');
  console.log("Receitas no cartão:", antData);
}
run();
