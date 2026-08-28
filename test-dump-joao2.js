import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const { data: profs } = await supabase.from('profiles').select('*');
console.log(profs.map(p => ({ id: p.id, name: p.name })));

