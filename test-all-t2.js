import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const { data: rec } = await supabase
  .from('transacoes')
  .select(`*`);
console.log(rec.filter(r => r.valor === 4.12 || r.valor_previsto === 4.12));
