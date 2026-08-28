import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Find the block where saldoAntCalcAcumulado is calculated
const startStr = `      const cutoffDate = \`\${an}-\${mesStr}-01\`;`;
const endStr = `      const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes;`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `      const cutoffDate = \`\${an}-\${mesStr}-01\`;
      const antDataAllToUse = antDataAll || [];
      
      let pastRecPago = 0;
      let pastDespPago = 0;
      let pastInvestPago = 0;
      let pastDespPrev = 0;
      
      // Calculate from all transactions before this month
      antDataAllToUse.forEach(t => {
          if (t.status === 'ignorado') return;
          if (!t.data || t.data >= cutoffDate) return;
          
          const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;
          const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
          const isFarmacia = activeProfileType === 'empresa' && (tagCat === 'farmácia popular' || tagCat === 'farmacia popular');
          if (isFarmacia) return;
          
          if (t.status === 'previsto') {
              if (t.tipo === 'despesa' && tagCat !== 'investimentos') {
                  pastDespPrev += vl;
              }
              // Note: Dashboard doesn't deduct previsao de investimento from Saldo Final, 
              // wait, let's check current month logic. Current month deducts 'despesasPrevisto' which is sumDspsPrev + sumDspsPrevRecorrente. 
              // sumDspsPrev only counts if it's NOT investimento.
          } else {
              if (t.tipo === 'receita') pastRecPago += vl;
              else if (t.tipo === 'despesa') {
                  if (tagCat === 'investimentos') pastInvestPago += vl;
                  else pastDespPago += vl;
              }
          }
      });
      
      let pastDespPrevRec = 0;
      if (recorrentesRaw) {
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
                      const dtPrefix = \`\${currY}-\${String(currM+1).padStart(2, '0')}\`;
                      const launched = antDataAllToUse.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                      if (!launched) {
                          pastDespPrevRec += Number(rec.valor) || 0;
                      }
                  }
              }
          });
      }
      
      const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec;
`;
    
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + endStr.length);
    fs.writeFileSync('src/components/Dashboard.tsx', code);
    console.log("Successfully replaced saldo anterior logic.");
} else {
    console.log("Could not find start or end index.");
}

