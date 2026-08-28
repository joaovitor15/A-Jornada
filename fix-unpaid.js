import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    'const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidFaturas;',
    'const finalSaldoAnterior = saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes;'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
