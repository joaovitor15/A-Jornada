import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_AQUI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('cofres').select('*');
  console.log("Data:", data, "Error:", error);
}
test();
