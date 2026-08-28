import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const activeProfileId = profiles.find(p => p.email && p.email.includes("joao"))?.id;

  const { data: antDataAllRaw } = await supabase
        .from('transacoes')
        .select(`*`)
        .eq('profile_id', activeProfileId);
  const antDataAll = antDataAllRaw || [];
        
  console.log("All transactions in September:");
  antDataAll.forEach(t => {
      if (t.data && t.data.startsWith('2026-09')) {
          console.log(t.descricao, t.valor, t.tipo, t.status, "Card:", t.card_id);
      }
  });
}
run();
