import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (let p of profiles) {
      if (p.email && p.email.includes("joao")) {
        console.log("Found Joao:", p.id, p.email);
        const { data: tx } = await supabase.from('transacoes').select('*').eq('profile_id', p.id);
        const { data: crd } = await supabase.from('cartoes').select('*').eq('profile_id', p.id);
        const { data: rec } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', p.id);
        
        console.log("TX Count:", tx.length);
        tx.forEach(t => console.log(t.data, t.descricao, t.valor, t.tipo, "Card:", t.card_id !== null));
        
        console.log("Cards Count:", crd.length);
        console.log("Rec Count:", rec.length);
        rec.forEach(r => console.log(r.nome, r.valor, r.tipo, r.ultima_lancada, r.exclusoes_pontuais));
      }
  }
}
run();
