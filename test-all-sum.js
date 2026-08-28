import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const { data: rec } = await supabase.from('transacoes').select('*');
console.log('Total transacoes:', rec.length);
const { data: rec2 } = await supabase.from('transacoes_recorrentes').select('*');
console.log('Total recorrentes:', rec2.length);

