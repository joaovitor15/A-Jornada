import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: tx } = await supabase.from('transacoes').select('*');
  if (tx) {
      console.log("Found TX length:", tx.length);
      tx.slice(0, 10).forEach(t => console.log(`${t.profile_id} | ${t.data} | ${t.descricao} | ${t.valor}`));
  }
}
run();
