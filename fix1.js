import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    `setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);\n      \n      setCartoesValor(unpaidTarget);`,
    `setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt);\n      \n      setCartoesValor(unpaidTarget - cartoesBeneficio);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
