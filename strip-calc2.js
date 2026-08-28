import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    'setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt);',
    'setSaldoAnterior(0);'
);

code = code.replace(
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt);',
    'setReceitasValor(sumRecsPago);'
);

code = code.replace(
    'setCartoesValor(unpaidTarget - cartoesBeneficio);',
    'setCartoesValor(0); // Cartoes will be simplified later'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
