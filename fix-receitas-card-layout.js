import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    '<div className="flex flex-col items-end">\n              <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">\n                Receitas\n              </span>\n              <span className="text-[10px] text-slate-400 font-medium">Ant: {formatarValor(saldoAnterior)}</span>\n            </div>',
    '<span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">\n              Receitas\n            </span>'
);

code = code.replace(
    '<span className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Mês: {formatarValor(receitasNoMes)}</span>',
    '<span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium flex items-center gap-[4px]"><span className="w-1 h-1 rounded-full bg-[#16A34A]"></span> Mês: {formatarValor(receitasNoMes)} <span className="ml-1 w-1 h-1 rounded-full bg-slate-400"></span> Ant: {formatarValor(saldoAnterior)}</span>'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
