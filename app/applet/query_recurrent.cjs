const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');
let url, key;
lines.forEach(l => {
  if (l.startsWith('VITE_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('VITE_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('transacoes_recorrentes').select('id, nome, frequencia, tipo, ativa, lancamento_rapido, ultima_lancada');
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}
check();
