import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Remove card logic from saldoAntCalcAcumulado
const cardLogicStart = `                if (activeProfileType !== 'empresa' && (anoVencimento < targetAnoVencimento || (anoVencimento === targetAnoVencimento && mesVencimento < targetMesVencimento))) {
                    if (t.status !== 'previsto') {
                        if (t.tipo === 'despesa') {
                            saldoAntCalcAcumulado -= (vl || 0);
                        } else if (t.tipo === 'receita') {
                            saldoAntCalcAcumulado += (vl || 0);
                        }
                    }
                }`;
if (code.includes(cardLogicStart)) {
    code = code.replace(cardLogicStart, '');
} else {
    console.log("Could not find card logic for saldoAntCalcAcumulado");
}

// 2. Add historicRecorrentes calculation
// Find where we initialize historicRecorrentes
const histRecInit = 'let historicRecorrentes = 0;';
const newHistRecInit = `let historicRecorrentes = 0;
      if (recorrentesRaw && antDataAll) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) return;
              const launchDateStr = rec.ultima_lancada || rec.created_at;
              let startYear = new Date().getFullYear();
              let startMonth = new Date().getMonth();
              if (launchDateStr) {
                  const launchDate = new Date(launchDateStr);
                  startYear = launchDate.getFullYear();
                  startMonth = launchDate.getMonth();
              }
              const targetYear = anoSelecionado;
              const targetMonth = mesSelecionado - 1;
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
                      const launched = antDataAll.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                      if (!launched) {
                          if (rec.tipo === 'despesa') historicRecorrentes += Number(rec.valor) || 0;
                          else if (rec.tipo === 'receita') historicRecorrentes -= Number(rec.valor) || 0;
                      }
                  }
              }
          });
      }`;
      
code = code.replace(histRecInit, newHistRecInit);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Done");
