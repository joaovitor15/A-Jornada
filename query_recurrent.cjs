const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('transacoes_recorrentes').select('*').order('data_criacao', { ascending: false }).limit(20);
  if (error) console.error(error);
  else console.log(JSON.stringify(data.map(d => ({nome: d.nome, dia: d.dia_vencimento, freq: d.frequencia, rapido: d.lancamento_rapido, ultima: d.ultima_lancada})), null, 2));
}
run();
