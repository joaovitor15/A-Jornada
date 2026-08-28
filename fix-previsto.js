import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Replace the line that includes previsto in saldoAntCalcAcumulado
code = code.replace(
    /const vl = t\.status === 'previsto'.*?\n/,
    "if (t.status === 'previsto') return;\n              const vl = t.valor;\n"
);

// Also for the cards loop in saldoAntCalcAcumulado
// Wait, the cards loop is transacoesCardsRaw.forEach
code = code.replace(
    /transacoesCardsRaw\.forEach\(t => \{\n\s*if \(t\.status === 'ignorado'\) return;/g,
    "transacoesCardsRaw.forEach(t => {\n          if (t.status === 'ignorado') return;\n          // DO NOT ignore previsto for cards, because we need them for targetDespesas. But wait, if they are previsto, do they affect saldoAntCalcAcumulado?\n"
);

// Actually, inside the card loop:
code = code.replace(
    /if \(activeProfileType !== 'empresa' && \(anoVencimento < targetAnoVencimento \|\| \(anoVencimento === targetAnoVencimento && mesVencimento < targetMesVencimento\)\)\) \{\n\s*if \(t\.tipo === 'despesa'\) \{\n\s*saldoAntCalcAcumulado \-= \(vl \|\| 0\);\n\s*\} else if \(t\.tipo === 'receita'\) \{\n\s*saldoAntCalcAcumulado \+= \(vl \|\| 0\);\n\s*\}\n\s*\}/,
    `if (activeProfileType !== 'empresa' && (anoVencimento < targetAnoVencimento || (anoVencimento === targetAnoVencimento && mesVencimento < targetMesVencimento))) {
                    if (t.status !== 'previsto') {
                        if (t.tipo === 'despesa') {
                            saldoAntCalcAcumulado -= (vl || 0);
                        } else if (t.tipo === 'receita') {
                            saldoAntCalcAcumulado += (vl || 0);
                        }
                    }
                }`
);


// And what about cartoesBeneficio? I should subtract it from cartoesValor instead of adding to saldoAnterior to prevent the inflation bug!
// Oh wait! If I subtract it from cartoesValor, I fix the inflation bug AND continuity is preserved.
code = code.replace(
    `setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);\n      \n      setCartoesValor(unpaidTarget);`,
    `setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt);\n      \n      setCartoesValor(unpaidTarget - cartoesBeneficio);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
