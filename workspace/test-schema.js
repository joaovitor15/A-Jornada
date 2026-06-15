import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xolzzdswbpxaivchddhm.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data } = await supabase.from('transacoes_recorrentes').select('*').limit(1);
  if (data && data.length > 0) console.log(Object.keys(data[0]));
}
run();
