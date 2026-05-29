import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const matchUrl = env.match(/VITE_SUPABASE_URL=(.*)/);
const matchKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (matchUrl && matchKey) {
  const supabaseUrl = matchUrl[1].trim().replace(/['"]/g, '');
  const supabaseKey = matchKey[1].trim().replace(/['"]/g, '');
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function run() {
    const { data, error } = await supabase.from('transacoes_recorrentes').select('id, nome, dia_vencimento, num_parcelas, frequencia, ativa, ultima_lancada').order('data_criacao', { ascending: false }).limit(10);
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
  }
  run();
}
