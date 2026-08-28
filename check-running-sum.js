import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';
  const { data: t } = await supabase.from('transacoes').select('*, tags(*)').eq('profile_id', activeProfileId).is('card_id', null);
  
  let saldo = 0;
  t.filter(x => x.data < '2026-09-01' && x.status !== 'ignorado').forEach(x => {
    const isInvest = x.tags?.categories?.nome?.toLowerCase() === 'investimentos';
    if (x.tipo === 'receita') saldo += x.valor;
    else if (x.tipo === 'despesa') {
        const vl = x.status === 'previsto' ? (x.valor_previsto || x.valor) : x.valor;
        saldo -= vl;
    }
  });
  console.log("Saldo Anterior for Sept:", saldo);
  
  let saldoOct = 0;
  t.filter(x => x.data < '2026-10-01' && x.status !== 'ignorado').forEach(x => {
    const isInvest = x.tags?.categories?.nome?.toLowerCase() === 'investimentos';
    if (x.tipo === 'receita') saldoOct += x.valor;
    else if (x.tipo === 'despesa') {
        const vl = x.status === 'previsto' ? (x.valor_previsto || x.valor) : x.valor;
        saldoOct -= vl;
    }
  });
  console.log("Saldo Anterior for Oct:", saldoOct);
}
run();
