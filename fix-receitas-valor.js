import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    /setSaldoAnterior\(saldoAntCalcAcumulado \+ pastRecorrentesDebt\);/g,
    'setSaldoAnterior(saldoAntCalcAcumulado);'
);

code = code.replace(
    /setReceitasValor\(sumRecsPago \+ saldoAntCalcAcumulado \+ pastRecorrentesDebt\);/g,
    'setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);'
);

code = code.replace(
    /let pastRecorrentesDebt = 0;[\s\S]*?pastRecorrentesDebt \+= \(\(Number\(r\.valor\) \|\| 0\) \* missingMonths\);[\s\S]*?\}\s*\}/,
    ''
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
