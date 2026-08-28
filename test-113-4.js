import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: tx } = await supabase.from('transacoes').select('*');
  const { data: rec } = await supabase.from('transacoes_recorrentes').select('*');
  
  if (tx) {
    tx.forEach(t => {
      console.log(`TX: ${t.profile_id} | ${t.data} | ${t.descricao} | ${t.valor} | ${t.tipo} | Card: ${t.card_id} | Status: ${t.status}`);
    });
  }
  
  if (rec) {
    rec.forEach(r => {
      console.log(`REC: ${r.profile_id} | ${r.nome} | ${r.valor} | ${r.tipo} | Start: ${r.data_inicio}`);
    });
  }
}
run();
