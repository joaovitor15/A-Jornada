import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: transacoes } = await supabase.from('transacoes').select(`*`);
        
  const target = 127.71;
  
  transacoes.forEach(t => {
      if (Math.abs(t.valor - target) < 0.01 || Math.abs(t.valor_previsto - target) < 0.01) {
          console.log("Found transaction:", t);
      }
  });
  
  console.log("Checking for anything that adds up to 127.71 or any unpaid stuff in Sept");
  transacoes.forEach(t => {
      if (t.data && t.data.startsWith('2026-09')) {
          console.log(t.descricao, t.valor, t.tipo, t.status, t.card_id ? "Has Card" : "No Card");
      }
  });
}
run();
