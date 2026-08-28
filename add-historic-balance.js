import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

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
