import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const pId = profiles[0].id;
  
  const { data: antDataAll } = await supabase.from('transacoes').select('*').eq('profile_id', pId).neq('status', 'ignorado');
  const { data: recs } = await supabase.from('transacoes_recorrentes').select('*').eq('profile_id', pId);
  const { data: cards } = await supabase.from('cartoes').select('*').eq('profile_id', pId);
  
  console.log("Profile ID:", pId);
  
  let saldoAntCalcAcumulado = 0;
  let pastRecorrentesDebt = 0;
  const cutoffDate = `2026-10-01`;
  
  const antData = antDataAll.filter(t => t.card_id === null && (t.data || '') < cutoffDate);
  antData.forEach(t => {
      const vl = t.status === 'previsto' && t.valor_previsto !== undefined && t.valor_previsto !== null ? t.valor_previsto : t.valor;
      if (t.tipo === 'receita') saldoAntCalcAcumulado += (vl || 0);
      else if (t.tipo === 'despesa') saldoAntCalcAcumulado -= (vl || 0);
  });
  
  // also add card debts that are past?
  let unpaidPastCards = 0;
  
  // just reproduce logic
  
  console.log("Saldo Ant Calc (non-card):", saldoAntCalcAcumulado);
  console.log("Recorrentes unpaid:");
  recs.forEach(rec => {
      let effStartYear = 2026;
      let effStartMonth = 7; // Aug
      if (rec.ultima_lancada) {
         const d = new Date(rec.ultima_lancada);
         effStartYear = d.getFullYear();
         effStartMonth = d.getMonth();
      }
      for (let y = effStartYear; y <= 2026; y++) {
          const mStart = y === effStartYear ? effStartMonth : 0;
          const mEnd = y === 2026 ? 8 : 11; // 8 is Sept
          for (let m = mStart; m <= mEnd; m++) {
              const isMatched = antDataAll.find(t => t.recorrente_id === rec.id && new Date(t.data+'T12:00:00Z').getMonth() === m);
              if (!isMatched) {
                  let hv = rec.valor;
                  if (rec.tipo === 'despesa') {
                      pastRecorrentesDebt -= hv;
                      console.log(`- Recorrente ${rec.nome} in ${m+1}/${y}: -${hv}`);
                  }
              }
          }
      }
  });
  
  console.log("Past Rec Debt:", pastRecorrentesDebt);
  
  antDataAll.forEach(t => {
      if(t.card_id !== null) {
          const cardInfo = cards.find(c => c.id === t.card_id);
          const dateParts = t.data.split('-');
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10);
          const day = parseInt(dateParts[2], 10);
          let mesFechamento = month;
          let anoFechamento = year;
          if (day > cardInfo.dia_fechamento_fatura) {
              mesFechamento++;
              if(mesFechamento > 12) { mesFechamento = 1; anoFechamento++; }
          }
          let mesVencimento = mesFechamento;
          let anoVencimento = anoFechamento;
          if (cardInfo.dia_vencimento < cardInfo.dia_fechamento_fatura) {
              mesVencimento++;
              if(mesVencimento > 12) { mesVencimento = 1; anoVencimento++; }
          }
          const isPast = anoVencimento < 2026 || (anoVencimento === 2026 && mesVencimento < 10);
          if (isPast && t.tipo === 'despesa') {
              console.log(`- Card ${cardInfo.nome} in ${mesVencimento}/${anoVencimento}: -${t.valor}`);
              unpaidPastCards += t.valor;
          }
      }
  });
  console.log("Unpaid past cards:", unpaidPastCards);
  
}
run();
