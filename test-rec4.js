import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: recs } = await supabase.from('transacoes_recorrentes').select('*');
  if (recs) recs.forEach(r => console.log(r.nome, r.valor));
}
run();
