import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jczncmoklxyevcghnylk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '...'; // I will grep it

async function main() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('transacoes')
    .select(`
      id,
      tipo,
      tags ( categories!tags_category_id_fkey ( nome ) )
    `)
    .limit(1);

  console.log(JSON.stringify(data, null, 2));
}

main();
