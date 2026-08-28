import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: antDataAllRaw } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, profile_id`);
  console.log("Transacoes totais no BD:", antDataAllRaw?.length);
}
run();
