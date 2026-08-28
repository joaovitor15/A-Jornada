import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    '<div className="text-[12px] font-semibold text-slate-500 mb-[-12px] ml-2">Saldo Mês Anterior: {formatarValor(saldoAnterior)}</div>\n        <div className="bg-gradient-to-br from-[#F8FAFC]',
    '<div className="bg-gradient-to-br from-[#F8FAFC]'
);

// add the text inside the card, just below "Saldo Final"
code = code.replace(
    '<span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">\n              Saldo Final\n            </span>',
    `<div className="flex flex-col items-end">
              <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                Saldo Final
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Ant: {formatarValor(saldoAnterior)}</span>
            </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
