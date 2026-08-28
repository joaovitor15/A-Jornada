import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const an = 2026;
  const ms = 10;
  
  const activeProfileId = '458c74e0-4b9f-43ce-873d-11be1bdac92e';

  const { data: antDataAllRaw } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories ( nome, cor ) )`)
        .eq('profile_id', activeProfileId);
  
  const antDataAll = antDataAllRaw || [];
        
  const { data: userCardsRaw } = await supabase.from('cartoes').select('*').eq('profile_id', activeProfileId);
  const userCards = userCardsRaw || [];
  const { data: recorrentesRaw } = await supabase.from('transacoes_recorrentes').select('*, categories(nome)').eq('profile_id', activeProfileId).eq('ativa', true);
  
  const mesStr = ms.toString().padStart(2, '0');
  const cutoffDate = `${an}-${mesStr}-01`;
  const antData = antDataAll?.filter(t => t.card_id === null && (t.data || '') < cutoffDate) || [];
  
  let saldoAntCalcAcumulado = 0;
  let historicProvisoes = 0;
  
  if (antDataAll) {
      antDataAll.forEach(t => {
          if (t.status === 'ignorado') return;
          const dateParts = (t.data || '').split('-');
          if (dateParts.length >= 2) {
              const ty = parseInt(dateParts[0], 10);
              const tm = parseInt(dateParts[1], 10);
              if (ty < an || (ty === an && tm < ms)) {
                  if (t.card_id === null && t.status === 'previsto') {
                      const tagCat = t.tags?.categories?.nome?.toLowerCase();
                      if (t.tipo === 'despesa' && tagCat !== 'investimentos') {
                          historicProvisoes += (Number(t.valor) || 0);
                      }
                  }
              }
          }
      });
  }

  if (antData) {
      antData.forEach(t => {
          if (t.status === 'ignorado') return;
          if (t.status === 'previsto') return;
          const vl = t.valor;
          const tagCat = t.tags?.categories?.nome?.toLowerCase();
                        
          if (tagCat !== 'farmácia popular') {
            if (tagCat === 'investimentos') {
                if (t.tipo === 'receita') saldoAntCalcAcumulado += (vl || 0);
                else saldoAntCalcAcumulado -= (vl || 0);
            } else {
                if (t.tipo === 'receita') saldoAntCalcAcumulado += (vl || 0);
                else if (t.tipo === 'despesa') saldoAntCalcAcumulado -= (vl || 0);
            }
          }
      });
  }
  
  let historicRecorrentes = 0;
  if (recorrentesRaw) {
      recorrentesRaw.forEach(rec => {
          const launchDateStr = rec.ultima_lancada;
          let effStartYear = new Date().getFullYear();
          let effStartMonth = new Date().getMonth();
          if (launchDateStr) {
              const lDp = launchDateStr.split('-');
              effStartYear = parseInt(lDp[0], 10);
              effStartMonth = parseInt(lDp[1], 10) - 1;
          }
          const creationTimeId = effStartYear * 12 + effStartMonth;
          
          let targetYear = an;
          let monthIdx = ms - 1;
          const projectedTimeId = targetYear * 12 + monthIdx;
          
          let shouldRender = projectedTimeId >= creationTimeId;
          
          if (shouldRender) {
              const targetAbsolute = an * 12 + ms - 1;
              for (let timeId = creationTimeId; timeId < targetAbsolute; timeId++) {
                  const recCat = rec.categories?.nome?.toLowerCase() || '';
                  if (rec.tipo === 'despesa' && recCat !== 'investimentos') {
                      const pastY = Math.floor(timeId / 12);
                      const pastM = timeId % 12;
                      const wasRealized = (antDataAll || []).some(t => {
                          if (t.recorrente_id !== rec.id || t.status === 'previsto') return false;
                          const dp = (t.data||'').split('-');
                          if (dp.length < 2) return false;
                          return parseInt(dp[0],10) === pastY && parseInt(dp[1],10) === (pastM + 1);
                      });
                      if (!wasRealized) {
                          historicRecorrentes += (Number(rec.valor) || 0);
                      }
                  }
              }
          }
      });
  }
  
  let totalUnpaidFaturas = 0;
  const transacoesCardsRaw = antDataAll.filter(t => t.card_id !== null);
  const cardDebts = {};
  userCards.forEach(c => {
      cardDebts[c.id] = { pastDespesas: 0, targetDespesas: 0, receitas: 0, targetTotalGasto: 0 };
  });
  
  transacoesCardsRaw.forEach(t => {
      if (t.status === 'ignorado') return;
      const cardInfo = userCards.find(c => c.id === t.card_id);
      if (cardInfo) {
          const debtObj = cardDebts[cardInfo.id];
          const dateParts = t.data.split('-');
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10);
          const day = parseInt(dateParts[2], 10);
          
          let mesFechamento = month;
          let anoFechamento = year;
          if (t.tipo === 'despesa' && day > cardInfo.dia_fechamento_fatura) {
              mesFechamento++;
              if (mesFechamento > 12) {
                  mesFechamento = 1;
                  anoFechamento++;
              }
          }
          let mesVencimento = mesFechamento;
          let anoVencimento = anoFechamento;
          if (t.tipo === 'despesa' && cardInfo.dia_vencimento_fatura < cardInfo.dia_fechamento_fatura) {
              mesVencimento++;
              if (mesVencimento > 12) {
                  mesVencimento = 1;
                  anoVencimento++;
              }
          }
          
          const vl = t.status === 'previsto' ? t.valor_previsto : t.valor;
          if (t.tipo === 'receita') {
              if (anoVencimento < an || (anoVencimento === an && mesVencimento <= ms)) {
                  debtObj.receitas += (vl || 0);
              }
          } else if (anoVencimento < an || (anoVencimento === an && mesVencimento < ms)) {
              if (t.tipo === 'despesa') {
                  debtObj.pastDespesas += (vl || 0);
              }
          }
          
          if (t.status !== 'previsto') {
              if (anoVencimento < an || (anoVencimento === an && mesVencimento < ms)) {
                  if (t.tipo === 'despesa') saldoAntCalcAcumulado -= (vl || 0);
                  else if (t.tipo === 'receita') saldoAntCalcAcumulado += (vl || 0);
              }
          }
      }
  });
  
  Object.values(cardDebts).forEach(debt => {
      let creditos = debt.receitas;
      const unpaidPast = Math.max(0, debt.pastDespesas - creditos);
      totalUnpaidFaturas += unpaidPast;
  });
  
  console.log("saldoAntCalcAcumulado:", saldoAntCalcAcumulado);
  console.log("historicProvisoes:", historicProvisoes);
  console.log("historicRecorrentes:", historicRecorrentes);
  console.log("totalUnpaidFaturas:", totalUnpaidFaturas);
  const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidFaturas;
  console.log("Final October Receitas:", finalSaldoAnterior);
}
run();
