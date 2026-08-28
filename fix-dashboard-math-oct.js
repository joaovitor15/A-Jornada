import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Fix historicProvisoes to use valor_previsto if status is previsto
code = code.replace(
    /historicProvisoes \+= \(Number\(t\.valor\) \|\| 0\);/g,
    'const amt = (t.status === "previsto" && t.valor_previsto !== undefined && t.valor_previsto !== null) ? t.valor_previsto : t.valor;\n                              historicProvisoes += (Number(amt) || 0);'
);

// 2. Restore totalUnpaidFaturas to finalSaldoAnterior
code = code.replace(
    'const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes;',
    'const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidFaturas;'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
