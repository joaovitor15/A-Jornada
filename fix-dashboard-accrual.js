import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Add totalUnpaidPast to the cards loop
code = code.replace(
    'let unpaidTarget = 0;\n      let cartoesBeneficio = 0;',
    'let unpaidTarget = 0;\n      let cartoesBeneficio = 0;\n      let totalUnpaidPast = 0;'
);

code = code.replace(
    'const unpaidPast = Math.max(0, debt.pastDespesas - creditos);',
    'const unpaidPast = Math.max(0, debt.pastDespesas - creditos);\n            totalUnpaidPast += unpaidPast;'
);

// 2. Add historicRecorrentes to the recorrentes loop
code = code.replace(
    'let sumDspsPrevRecorrente = 0;',
    'let sumDspsPrevRecorrente = 0;\n      let historicRecorrentes = 0;'
);

code = code.replace(
    /const projectedTimeId = targetYear \* 12 \+ monthIdx;/g,
    `const projectedTimeId = targetYear * 12 + monthIdx;
              
              // Sum past recorrentes
              if (shouldRender) {
                  const targetAbsolute = an * 12 + ms - 1; // 0-indexed month
                  for (let timeId = creationTimeId; timeId < targetAbsolute; timeId++) {
                      // Only if it's a despesa and not investimento
                      const recCat = rec.categories?.nome?.toLowerCase() || '';
                      if (rec.tipo === 'despesa' && recCat !== 'investimentos') {
                          // Check if it was realized
                          const pastY = Math.floor(timeId / 12);
                          const pastM = timeId % 12;
                          const wasRealized = (antDataAll || []).some(t => {
                              if (t.recorrente_id !== rec.id || t.status === 'previsto') return false;
                              const dp = t.data.split('-');
                              if (dp.length < 2) return false;
                              return parseInt(dp[0],10) === pastY && parseInt(dp[1],10) === (pastM + 1);
                          });
                          if (!wasRealized) {
                              historicRecorrentes += (Number(rec.valor) || 0);
                          }
                      }
                  }
              }
`
);

// 3. Update the final setSaldoAnterior and setReceitasValor
code = code.replace(
    'setSaldoAnterior(saldoAntCalcAcumulado);',
    'setSaldoAnterior(saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidPast);'
);

code = code.replace(
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);',
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidPast);'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
