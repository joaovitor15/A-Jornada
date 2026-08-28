import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: recData } = await supabase.from('transacoes_recorrentes').select('id, card_id').limit(1);
  console.log("Recorrentes card_id:", recData);
}
run();
