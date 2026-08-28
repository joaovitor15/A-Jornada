import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';
  
  const { data: allTxs } = await supabase.from('transacoes').select('*, tags(*)').eq('profile_id', activeProfileId).is('card_id', null);
  const { data: allRecs } = await supabase.from('transacoes_recorrentes').select('*, categories (nome)').eq('profile_id', activeProfileId).eq('ativa', true);
  
  let runningSaldo = 0;
  
  for (let m = 1; m < 10; m++) {
      let recs = 0, dsps = 0, provs = 0;
      
      allTxs.forEach(t => {
          if (t.status === 'ignorado') return;
          if (t.data && t.data.startsWith(`2026-0${m}`)) {
              if (t.status === 'previsto') provs += (t.valor_previsto || t.valor || 0);
              else {
                  if (t.tipo === 'receita') recs += t.valor;
                  else if (t.tipo === 'despesa') dsps += t.valor;
              }
          }
      });
      
      allRecs.forEach(rec => {
         // simple recurring logic
         if (rec.frequencia === 'mensal' || (rec.frequencia === 'anual' && rec.mes_vencimento === m)) {
             // check if not launched
             const launched = allTxs.find(t => t.recorrente_id === rec.id && t.data.startsWith(`2026-0${m}`));
             if (!launched) {
                 if (rec.tipo === 'despesa') provs += rec.valor;
                 else recs += rec.valor;
             }
         }
      });
      
      const saldoFinal = runningSaldo + recs - dsps - provs;
      console.log(`Month ${m}: Ant: ${runningSaldo}, Recs: ${recs}, Dsps: ${dsps}, Provs: ${provs}, Final: ${saldoFinal}`);
      runningSaldo = saldoFinal;
  }
}
run();
