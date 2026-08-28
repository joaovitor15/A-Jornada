import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const an = 2026;
  const ms = 10;
  
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';

  const { data: antDataAllRaw } = await supabase
        .from('transacoes')
        .select(`*`)
        .eq('profile_id', activeProfileId);
  
  const antDataAll = antDataAllRaw || [];
  
  let despesasPrevisto = 0;
  let cartoesValor = 0;
  
  // just calculate the current month values
  const mesStr = ms.toString().padStart(2, '0');
  
  let dspsArr = [];
  antDataAll.forEach(t => {
      if (t.data && t.data.startsWith(`2026-10`)) dspsArr.push(t);
  });
  
  dspsArr.forEach(t => {
      if (t.status === 'previsto' && t.tipo === 'despesa' && t.card_id === null) {
          despesasPrevisto += (Number(t.valor_previsto || t.valor) || 0);
      }
  });
  
  console.log("despesasPrevisto in Oct:", despesasPrevisto);
}
run();
