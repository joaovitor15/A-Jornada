import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const activeProfileId = '5a81eab7-717e-40cd-85b8-53e778918ddf';
const ms = 9;
const an = 2026;
const mesStr = ms.toString().padStart(2, '0');
const cutoffDate = `${an}-${mesStr}-01`;

const { data: antDataAll } = await supabase
  .from('transacoes')
  .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )`)
  .eq('profile_id', activeProfileId);

let pastRecPago = 0;
let pastDespPago = 0;
let pastInvestPago = 0;
let pastDespPrev = 0;
let despesasCartao = 0;

antDataAll.forEach(t => {
    if (t.status === 'ignorado') return;
    if (!t.data || t.data >= cutoffDate) return;
    
    if (t.card_id) despesasCartao += t.valor;

    const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;
    const tagCat = (t.tags)?.categories?.nome?.toLowerCase();
    
    if (t.status === 'previsto') {
        if (t.tipo === 'despesa' && tagCat !== 'investimentos') {
            pastDespPrev += vl;
        }
    } else {
        if (t.tipo === 'receita') pastRecPago += vl;
        else if (t.tipo === 'despesa') {
            if (tagCat === 'investimentos') pastInvestPago += vl;
            else pastDespPago += vl;
        }
    }
});

console.log({ pastRecPago, pastDespPago, pastInvestPago, pastDespPrev, despesasCartao });

