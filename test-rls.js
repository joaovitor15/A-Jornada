import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const pId = profiles.find(p => p.email && p.email.includes("joao"))?.id;
  const { data: antData, error } = await supabase.from('transacoes').select('tipo, valor, descricao, data, card_id').eq('profile_id', pId).order('data', { ascending: true });
  console.log("Total transacoes Joao:", antData?.length);
  if (error) console.log("Error:", error);
}
run();
