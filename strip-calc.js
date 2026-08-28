import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// We want to remove pastRecorrentesDebt
code = code.replace(/let pastRecorrentesDebt = 0;\n/g, '');
code = code.replace(/if \(rec\.tipo === 'despesa'\) pastRecorrentesDebt \-= historicValue;\n/g, '');

// We want to remove saldoAntCalcAcumulado
// This block:
// const cutoffDate = `${an}-${mesStr}-01`;
// ...
// }
code = code.replace(/const cutoffDate = `\$\{an\}-\$\{mesStr\}-01`;[\s\S]*?if \(!isFarmacia\) \{\s+if \(t\.status !== 'previsto'\) \{\s+if \(t\.tipo === 'despesa'\) \{\s+saldoAntCalcAcumulado \-= \(vl \|\| 0\);\s+\} else if \(t\.tipo === 'receita'\) \{\s+saldoAntCalcAcumulado \+= \(vl \|\| 0\);\s+\}\s+\}\s+\}\s+\}\s+\}\s+\}\s+\}\s+\}\s+\}\s+\}\s+/, '');
// Wait, the regex might fail because it's too complex.

fs.writeFileSync('src/components/Dashboard.tsx.bak', code);
