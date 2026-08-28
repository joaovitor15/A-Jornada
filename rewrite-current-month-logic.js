import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// The place where I have:
const marker = `      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {`;
              
const index = code.indexOf(marker);
if (index !== -1) {
    const endMarker = `      const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec;`;
    const endIndex = code.indexOf(endMarker);
    
    const newLogic = `
      let currentRecsPago = 0;
      let currentRecsPrev = 0;
      let currentDspsPago = 0;
      let currentDspsPrev = 0;
      let currentInvesPago = 0;
      let currentInvesPrev = 0;

      recsArr.forEach(t => {
          if (t.status === 'previsto') currentRecsPrev += (t.valor_previsto || t.valor || 0);
          else currentRecsPago += (t.valor || 0);
      });

      dspsArr.forEach(t => {
          const isInvest = (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos';
          if (isInvest) {
              if (t.status === 'previsto') currentInvesPrev += (t.valor_previsto || t.valor || 0);
              else currentInvesPago += (t.valor || 0);
          } else {
              if (t.status === 'previsto') currentDspsPrev += (t.valor_previsto || t.valor || 0);
              else currentDspsPago += (t.valor || 0);
          }
      });
      
      let currentDspsPrevRec = 0;
      let currentRecsPrevRec = 0;
      let currentInvesPrevRec = 0;
      
      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {
                  lancamentosRapidos.push({
                      id: \`rec-\${rec.id}\`,
                      recorrente_id: rec.id,
                      descricao: rec.nome,
                      valor: Number(rec.valor) || 0,
                      tags: rec.tags,
                      categories: rec.categories,
                      isRecurrent: true,
                      tipo: rec.tipo,
                      recurrentSource: rec
                  });
                  return;
              }
              
              const recCat = rec.categories?.nome?.toLowerCase();
              const isInvest = recCat === 'investimentos';
              
              const launchDateStr = rec.ultima_lancada || rec.created_at;
              let startYear = new Date().getFullYear();
              let startMonth = new Date().getMonth();
              if (launchDateStr) {
                  const launchDate = new Date(launchDateStr);
                  startYear = launchDate.getFullYear();
                  startMonth = launchDate.getMonth();
              }
              
              const targetYear = an;
              const targetMonth = ms - 1;
              const monthDiff = (targetYear - startYear) * 12 + (targetMonth - startMonth);
              
              let shouldRender = true;
              if (rec.num_parcelas && rec.num_parcelas > 1) {
                  if (monthDiff < 0 || monthDiff >= rec.num_parcelas) shouldRender = false;
              }
              if (rec.frequencia === 'anual') {
                  const tMonth = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
                  if (targetMonth !== tMonth) shouldRender = false;
              }
              
              if (shouldRender) {
                  const dtPrefix = \`\${targetYear}-\${String(targetMonth+1).padStart(2, '0')}\`;
                  const launched = antDataAllToUse.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                  if (!launched) {
                      if (rec.tipo === 'receita') currentRecsPrevRec += Number(rec.valor) || 0;
                      else if (rec.tipo === 'despesa') {
                          if (isInvest) currentInvesPrevRec += Number(rec.valor) || 0;
                          else currentDspsPrevRec += Number(rec.valor) || 0;
                      }
                      
                      const tDay = rec.dia_vencimento || 1;
                      combinedPending.push({
                          id: \`rec-\${rec.id}\`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: dtPrefix + '-' + String(tDay).padStart(2, '0'),
                          tipo: rec.tipo,
                          status: 'previsto',
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                      });
                  }
              }
          });
      }
      
`;
    
    code = code.substring(0, index) + newLogic + code.substring(endIndex);
    fs.writeFileSync('src/components/Dashboard.tsx', code);
    console.log("Rewritten current month logic");
} else {
    console.log("Could not find marker");
}
