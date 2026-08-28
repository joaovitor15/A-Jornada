import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';

const { data: antDataAll } = await supabase
  .from('transacoes')
  .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id`)
  .eq('profile_id', activeProfileId);
console.log(antDataAll);
