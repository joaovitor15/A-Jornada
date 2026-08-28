import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. setReceitasValor to only be sumRecsPago
code = code.replace(
    'setReceitasValor(sumRecsPago + finalSaldoAnterior);',
    'setReceitasValor(sumRecsPago);'
);

// 2. update saldoTotal to include saldoAnterior
code = code.replace(
    'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - cartoesValor;',
    'const saldoTotal = saldoAnterior + receitasValor - despesasValor - investimentosValor - despesasPrevisto - cartoesValor;'
);

// 3. Add a small text in the Receitas card to show Saldo Anterior? Or in the Saldo Final card?
// Let's add it to Saldo Final card!
code = code.replace(
    '{/* CARD 6 — SALDO TOTAL */}',
    `{/* CARD 6 — SALDO TOTAL */}
        <div className="text-[12px] font-semibold text-slate-500 mb-[-12px] ml-2">Saldo Mês Anterior: {formatarValor(saldoAnterior)}</div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
