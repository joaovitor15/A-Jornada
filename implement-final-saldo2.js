import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// The error was because I used `$&` but my regex matched `}\n      }\n      }`, which meant I placed the code OUTSIDE a necessary block, or broke a function block.
// Instead of regex, let's insert after: `// setSaldoAnterior será chamado no final, após contabilizar faturas`

code = code.replace(
    '// setSaldoAnterior será chamado no final, após contabilizar faturas',
    `// setSaldoAnterior será chamado no final, após contabilizar faturas
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
                          const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
                          if (t.tipo === 'despesa' && tagCat !== 'investimentos') {
                              historicProvisoes += (Number(t.valor) || 0);
                          }
                      }
                  }
              }
          });
      }`
);


code = code.replace(
    'let sumDspsPrevRecorrente = 0;',
    'let historicRecorrentes = 0;\n      let sumDspsPrevRecorrente = 0;'
);

code = code.replace(
    'const creationTimeId = effStartYear * 12 + effStartMonth;\n              if (projectedTimeId < creationTimeId) {',
    `const creationTimeId = effStartYear * 12 + effStartMonth;
              
              if (projectedTimeId >= creationTimeId) {
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
              if (projectedTimeId < creationTimeId) {`
);

code = code.replace(
    'let unpaidTarget = 0;\n      let cartoesBeneficio = 0;',
    'let unpaidTarget = 0;\n      let cartoesBeneficio = 0;\n      let totalUnpaidFaturas = 0;'
);

code = code.replace(
    'const unpaidPast = Math.max(0, debt.pastDespesas - creditos);',
    'const unpaidPast = Math.max(0, debt.pastDespesas - creditos);\n      totalUnpaidFaturas += unpaidPast;'
);


code = code.replace(
    'setSaldoAnterior(saldoAntCalcAcumulado);',
    'const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidFaturas;\n      setSaldoAnterior(finalSaldoAnterior);'
);

code = code.replace(
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);',
    'setReceitasValor(sumRecsPago + finalSaldoAnterior);'
);


fs.writeFileSync('src/components/Dashboard.tsx', code);
