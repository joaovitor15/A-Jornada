import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: antData } = await supabase.from('transacoes').select('tipo, valor, descricao, data, card_id').gte('data', '2026-09-01').lte('data', '2026-09-30');
  console.log("Transacoes Setembro:");
  console.table(antData);
}
run();
