import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const pId = 'c8736b83-eab8-4ffe-998d-5d8bb80e9cea'; // From previous log
  
  const { data: tx, error: e1 } = await supabase.from('transacoes').select('*').eq('profile_id', pId);
  const { data: rec, error: e2 } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', pId);
  const { data: cards } = await supabase.from('cartoes').select('*').eq('profile_id', pId);
  
  console.log("Error tx:", e1);
  console.log("Error rec:", e2);
  
  console.log("All TX for Joao:");
  if (tx) tx.forEach(t => console.log(`${t.data} | ${t.descricao} | ${t.valor} | ${t.tipo} | Card: ${t.card_id} | Status: ${t.status}`));
  
  console.log("\nAll Rec for Joao:");
  if (rec) rec.forEach(r => console.log(`${r.nome} | ${r.valor} | ${r.tipo} | Ultima: ${r.ultima_lancada}`));
  
  console.log("\nAll Cards:");
  if (cards) cards.forEach(c => console.log(`${c.id} | ${c.nome} | Fechamento: ${c.dia_fechamento_fatura} | Vencimento: ${c.dia_vencimento_fatura}`));
}
run();
