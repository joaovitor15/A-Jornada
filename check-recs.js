import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const activeProfileId = profiles.find(p => p.email && p.email.includes("joao"))?.id;

  const { data: recorrentesRaw } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', activeProfileId).eq('ativa', true);
  const recorrentes = recorrentesRaw || [];
        
  console.log("All recorrentes:");
  recorrentes.forEach(t => {
      console.log(t.nome, t.valor, t.tipo, "Card:", t.card_id, "Ultima:", t.ultima_lancada);
  });
}
run();
