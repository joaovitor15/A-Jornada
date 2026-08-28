import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const pId = 'c8736b83-eab8-4ffe-998d-5d8bb80e9cea';
  
  const { data: tx } = await supabase.from('transacoes').select('*').eq('profile_id', pId);
  const { data: rec } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', pId);
  
  console.log("Transactions matching 113.90:");
  if (tx) tx.filter(t => Math.abs(Number(t.valor)) === 113.90 || Math.abs(Number(t.valor_previsto)) === 113.90).forEach(t => console.log(t));
  
  console.log("Recurrent matching 113.90:");
  if (rec) rec.filter(r => Math.abs(Number(r.valor)) === 113.90).forEach(r => console.log(r));
  
  console.log("\nAll TX:");
  if (tx) tx.forEach(t => console.log(`${t.data} | ${t.descricao} | ${t.valor} | ${t.tipo} | Card: ${t.card_id} | Status: ${t.status}`));
  
  console.log("\nAll Rec:");
  if (rec) rec.forEach(r => console.log(`${r.nome} | ${r.valor} | ${r.tipo} | Start: ${r.data_inicio}`));
}
run();
