import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: transacoes } = await supabase.from('transacoes').select(`*`);
  console.log("Transacoes total:", transacoes?.length);
  transacoes.forEach(t => {
      console.log(t.data, t.descricao, t.valor, t.tipo, t.status, t.card_id ? "Has Card" : "No Card");
  });
  
  const { data: prov } = await supabase.from('transacoes_recorrentes').select('*');
  console.log("\nProvisoes:", prov?.length);
  prov.forEach(p => console.log(p.nome, p.valor));
}
run();
