import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (const p of profiles) {
    const { count } = await supabase.from('transacoes').select('*', { count: 'exact', head: true }).eq('profile_id', p.id);
    console.log("Profile", p.id, "has", count, "transacoes");
  }
}
run();
