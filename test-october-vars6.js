import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const an = 2026;
  const ms = 10; // Outubro
  
  const { data: profiles } = await supabase.from('profiles').select('*');
  const activeProfileId = profiles.find(p => p.email && p.email.includes("joao"))?.id;

  const { data: antDataAllRaw } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories ( nome, cor ) )`)
        .eq('profile_id', activeProfileId);
  
  const antDataAll = antDataAllRaw || [];
        
  const { data: userCardsRaw } = await supabase.from('cartoes').select('*').eq('profile_id', activeProfileId);
  const userCards = userCardsRaw || [];
  
  const mesStr = ms.toString().padStart(2, '0');
  const cutoffDate = `${an}-${mesStr}-01`;
  const antData = antDataAll?.filter(t => t.card_id === null && (t.data || '') < cutoffDate) || [];
  
  let saldoAntCalcAcumulado = 0;
  
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
  
  let unpaidTarget = 0;
  let faturaTotalGasto = 0;
  let cartoesBeneficio = 0;
  const transacoesCardsRaw = antDataAll.filter(t => t.card_id !== null);
  const cardDebts = {};
  userCards.forEach(c => {
      cardDebts[c.id] = { pastDespesas: 0, targetDespesas: 0, receitas: 0, currReceitas: 0, targetTotalGasto: 0 };
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
              if (anoVencimento === an && mesVencimento === ms) {
                  debtObj.currReceitas += (vl || 0);
              }
          } else {
              if (anoVencimento < an || (anoVencimento === an && mesVencimento < ms)) {
                  debtObj.pastDespesas += (vl || 0);
              }
              if (anoVencimento === an && mesVencimento === ms) {
                  debtObj.targetDespesas += (vl || 0);
                  if (t.status !== 'previsto') debtObj.targetTotalGasto += (vl || 0);
              }
          }
      }
  });
  
  let totalUnpaidPast = 0;
  Object.values(cardDebts).forEach(debt => {
      let creditos = debt.receitas;
      const unpaidPast = Math.max(0, debt.pastDespesas - creditos);
      totalUnpaidPast += unpaidPast;
      creditos = Math.max(0, creditos - debt.pastDespesas);
      
      const unpaidCurr = Math.max(0, debt.targetDespesas - creditos);
      unpaidTarget += unpaidCurr;
      faturaTotalGasto += debt.targetTotalGasto;
      const currPayments = debt.currReceitas || 0;
      const extraBenefit = unpaidCurr + currPayments - debt.targetDespesas;
      cartoesBeneficio += extraBenefit;
  });
  
  console.log("saldoAntCalcAcumulado:", saldoAntCalcAcumulado);
  console.log("unpaidTarget (Fatura do Mes):", unpaidTarget);
  console.log("totalUnpaidPast (Fatura Atrasada):", totalUnpaidPast);
  console.log("cartoesBeneficio:", cartoesBeneficio);
}
run();
