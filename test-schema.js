import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xolzzdswbpxaivchddhm.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data } = await supabase.from('transacoes_recorrentes').select('id, profile_id').limit(1);
  if (data && data.length > 0) {
     const profile_id = data[0].profile_id;
     const { data: res, error } = await supabase.from('transacoes_recorrentes').insert({
       profile_id, nome: 'Teste Negativo', valor: -10.50, tipo: 'despesa', frequencia: 'mensal', ativa: false
     }).select('*');
     console.log('Insert:', error ? error.message : 'Success ' + res[0].valor);
     if (!error) {
       await supabase.from('transacoes_recorrentes').delete().eq('id', res[0].id);
     }
  }
}
run();
