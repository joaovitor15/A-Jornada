import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (let p of profiles) {
        console.log("Profile ID:", p.id);
        const { data: tx } = await supabase.from('transacoes').select('*').eq('profile_id', p.id);
        const { data: rec } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', p.id);
        if (tx.length > 0 || rec.length > 0) {
            console.log("TX Count:", tx.length);
            console.log("Rec Count:", rec.length);
            rec.forEach(r => console.log("REC:", r.nome, r.valor, r.tipo, r.ultima_lancada));
            tx.forEach(t => console.log("TX:", t.data, t.descricao, t.valor, t.tipo, "Card:", t.card_id !== null));
        }
  }
}
run();
