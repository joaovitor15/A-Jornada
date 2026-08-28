import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';
  const { data: t } = await supabase.from('transacoes').select('*, tags(*)').eq('profile_id', activeProfileId);
  console.log("All txs:");
  t.forEach(x => {
    console.log(x.data, x.descricao, x.valor, x.tipo, x.status, x.card_id);
  });
}
run();
