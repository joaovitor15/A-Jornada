import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';
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
let pastDespesasCartao = 0;

antDataAll.forEach(t => {
    if (t.status === 'ignorado') return;
    if (!t.data || t.data >= cutoffDate) return;
    
    if (t.card_id) {
       pastDespesasCartao += (Number(t.valor) || 0);
    }

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

console.log({ pastRecPago, pastDespPago, pastInvestPago, pastDespPrev, pastDespesasCartao });

const { data: recorrentesRaw } = await supabase
  .from('transacoes_recorrentes')
  .select('*, categories (id, nome, cor), tags (id, nome)')
  .eq('profile_id', activeProfileId)
  .eq('ativa', true);

let pastDespPrevRec = 0;
recorrentesRaw.forEach(rec => {
  if (rec.lancamento_rapido) return;
  if (rec.tipo !== 'despesa') return; // Only despesas deduct from Saldo Final
  
  const recCat = rec.categories?.nome?.toLowerCase();
  if (recCat === 'investimentos') return;
  
  const launchDateStr = rec.ultima_lancada || rec.created_at;
  if (!launchDateStr) return;
  
  const launchDate = new Date(launchDateStr);
  const startYear = launchDate.getFullYear();
  const startMonth = launchDate.getMonth();
  
  const targetYear = an;
  const targetMonth = ms - 1;
  const totalMonths = (targetYear - startYear) * 12 + (targetMonth - startMonth);
  
  for (let i = 0; i < totalMonths; i++) {
      const currM = (startMonth + i) % 12;
      const currY = startYear + Math.floor((startMonth + i) / 12);
      
      let shouldRender = true;
      if (rec.num_parcelas && rec.num_parcelas > 1) {
          if (i >= rec.num_parcelas) shouldRender = false;
      }
      if (rec.frequencia === 'anual') {
          const tMonth = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
          if (currM !== tMonth) shouldRender = false;
      }
      
      if (shouldRender) {
          const dtPrefix = `${currY}-${String(currM+1).padStart(2, '0')}`;
          const launched = antDataAll.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
          if (!launched) {
              pastDespPrevRec += Number(rec.valor) || 0;
          }
      }
  }
});
console.log({ pastDespPrevRec });

