import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const { data, error } = await supabase.from('transacoes').select('recorrente_id').limit(1);
  console.log('Query executed. If we wanted constraint names we cant using anon key without RPC.');
}
run();
