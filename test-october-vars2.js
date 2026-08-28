import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const activeProfileId = profiles.find(p => p.email && p.email.includes("joao"))?.id;
  console.log("activeProfileId:", activeProfileId);
  const { data: antDataAll } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories ( nome, cor ) )`)
        .eq('profile_id', activeProfileId);
  console.log("antDataAll count:", antDataAll?.length);
}
run();
