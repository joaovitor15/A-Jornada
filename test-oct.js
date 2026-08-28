import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: antData } = await supabase.from('transacoes').select('profile_id, valor, valor_previsto, tipo, status, descricao, data, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )');
  const { data: cards } = await supabase.from('cards').select('*');

  // get distinct profile IDs
  const profiles = [...new Set(antData.map(t => t.profile_id))];
  
  for (const pId of profiles) {
      let saldoAntCalcAcumulado = 0;
      
      const targetYear = 2026;
      const targetMonth = 10;
      const cutoffDate = `${targetYear}-10-01`;
      
      const profileData = antData.filter(t => t.profile_id === pId);
      
      // 1. Regular transactions before cutoff
      profileData.filter(t => t.card_id === null && t.data < cutoffDate).forEach(t => {
          if (t.status === 'ignorado') return;
          const vl = t.status === 'previsto' && t.valor_previsto !== null ? t.valor_previsto : t.valor;
          
          const tagCat = t.tags?.categories?.nome?.toLowerCase();
          const isFarmacia = false;
          
          if (tagCat === 'investimentos') {
              if (t.tipo === 'receita') saldoAntCalcAcumulado += vl;
              else saldoAntCalcAcumulado -= vl;
          } else {
              if (t.tipo === 'receita') saldoAntCalcAcumulado += vl;
              else if (t.tipo === 'despesa') saldoAntCalcAcumulado -= vl;
          }
      });
      
      let afterRegular = saldoAntCalcAcumulado;
      
      // 2. Card transactions
      profileData.filter(t => t.card_id !== null).forEach(t => {
          if (t.status === 'ignorado') return;
          const cardInfo = cards?.find(c => c.id === t.card_id && c.profile_id === pId);
          if (cardInfo) {
              const dateParts = t.data.split('-');
              const year = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10);
              const day = parseInt(dateParts[2], 10);
              
              let mesFechamento = month;
              let anoFechamento = year;
              if (t.tipo === 'despesa' && day > cardInfo.dia_fechamento_fatura) {
                  mesFechamento++;
                  if (mesFechamento > 12) { mesFechamento = 1; anoFechamento++; }
              }
              let mesVencimento = mesFechamento;
              let anoVencimento = anoFechamento;
              if (t.tipo === 'despesa' && cardInfo.dia_vencimento_fatura < cardInfo.dia_fechamento_fatura) {
                  mesVencimento++;
                  if (mesVencimento > 12) { mesVencimento = 1; anoVencimento++; }
              }
              
              const vl = t.status === 'previsto' && t.valor_previsto !== null ? t.valor_previsto : t.valor;
              
              if (anoVencimento < targetYear || (anoVencimento === targetYear && mesVencimento < targetMonth)) {
                  if (t.tipo === 'despesa') saldoAntCalcAcumulado -= vl;
                  else if (t.tipo === 'receita') saldoAntCalcAcumulado += vl;
              }
          }
      });
      
      console.log(`Profile ${pId}: Regular=${afterRegular}, Total=${saldoAntCalcAcumulado}`);
  }
}
run();
