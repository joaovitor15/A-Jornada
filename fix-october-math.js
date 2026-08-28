import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// I will remove the logic that calculates "totalUnpaidPast", "historicRecorrentes", and "historicProvisoes" 
// because you just asked to only rely on "saldoAntCalcAcumulado" which is purely the net cashflow.

// Replace the line that calculates setSaldoAnterior
code = code.replace(
    'setSaldoAnterior(saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidPast);',
    'setSaldoAnterior(saldoAntCalcAcumulado);'
);

// Replace the line that calculates setReceitasValor
code = code.replace(
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado - historicProvisoes - historicRecorrentes - totalUnpaidPast);',
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);'
);

// We need to also clean up the unused variables from earlier today so it compiles cleanly
code = code.replace(/let historicProvisoes = 0;/g, '');
code = code.replace(/let historicCartoes = 0;/g, '');
code = code.replace(/if \(activeProfileType !== 'empresa' && antDataAll\) \{[\s\S]*?\}\s*\}\s*\}/, '');

code = code.replace(/let historicRecorrentes = 0;/g, '');
code = code.replace(/if \(!wasRealized\) \{\s*historicRecorrentes \+= \(Number\(rec\.valor\) \|\| 0\);\s*\}/g, '');

code = code.replace(/let totalUnpaidPast = 0;/g, '');
code = code.replace(/totalUnpaidPast \+= unpaidPast;/g, '');


fs.writeFileSync('src/components/Dashboard.tsx', code);
