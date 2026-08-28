import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';
  const { data: t } = await supabase.from('transacoes').select('*').eq('profile_id', activeProfileId);
  console.log("Past txs:");
  t.filter(x => x.data && (x.data.startsWith('2026-08') || x.data.startsWith('2026-09') || x.data.startsWith('2026-10'))).forEach(x => {
    console.log(x.data, x.descricao, x.valor, x.valor_previsto, x.tipo, x.status, x.card_id, x.tags?.categories?.nome);
  });
}
run();
