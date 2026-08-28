import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: antData, error: e1 } = await supabase.from('transacoes').select('profile_id, valor, valor_previsto, tipo, status, descricao, data, card_id');
  console.log("Transacoes:", antData?.length, e1);
  const { data: recData, error: e2 } = await supabase.from('transacoes_recorrentes').select('*');
  console.log("Recorrentes:", recData?.length, e2);
}
run();
