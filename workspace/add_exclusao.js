import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `ALTER TABLE public.transacoes_recorrentes ADD COLUMN IF NOT EXISTS exclusoes_pontuais TEXT[] DEFAULT '{}'::TEXT[];`;
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
     console.error('RPC failed, trying raw query via pg? No, supabase client cannot run raw DDL if not setup. I will fetch all and update them in react.');
  }
}
run();
