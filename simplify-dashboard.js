import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Simplify saldoTotal calculation
code = code.replace(
    'const saldoTotal = saldoAnterior + receitasValor - despesasValor - investimentosValor - despesasPrevisto - cartoesValor;',
    'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto;'
);

// 2. Remove CARD 4 — CARTÃO
const card4Start = code.indexOf('{/* CARD 4 — CARTÃO */}');
if (card4Start !== -1) {
    const card5Start = code.indexOf('{/* CARD 5 — DESPESAS */}');
    if (card5Start !== -1) {
        // Find the condition `if (activeProfileType === 'empresa')` or something, let's just remove the block
        code = code.substring(0, card4Start) + code.substring(card5Start);
    }
}

// 3. Remove "Ant: ..."
code = code.replace(
    '<span className="text-[10px] text-slate-400 font-medium">Ant: {formatarValor(saldoAnterior)}</span>',
    ''
);
code = code.replace(
    '<div className="flex flex-col items-end">\n              <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">\n                Saldo Final\n              </span>\n              \n            </div>',
    '<span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">\n              Saldo Final\n            </span>'
);


fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log('Simplification done');
