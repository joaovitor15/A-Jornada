import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  const sql = `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS eafc_fragmentos integer DEFAULT 0;`;
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  console.log('Result:', data);
  console.log('Error:', error);
}

run();
