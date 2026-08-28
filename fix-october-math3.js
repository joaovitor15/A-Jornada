import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// I need to find out why October gets -1145,43 when it should be just -304,02 + anything paid in October.
// In the current backup, we have:
// setSaldoAnterior(saldoAntCalcAcumulado);
// setReceitasValor(sumRecsPago);
// Let's change it back to the state right before my previous massive edit that added historicProvisoes

code = code.replace(
    'setSaldoAnterior(0);',
    'setSaldoAnterior(saldoAntCalcAcumulado);'
);

code = code.replace(
    'setReceitasValor(sumRecsPago);',
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);'
);

code = code.replace(
    'setCartoesValor(0); // Cartoes will be simplified later',
    'setCartoesValor(unpaidTarget);'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
