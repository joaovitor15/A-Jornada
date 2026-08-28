import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Update setReceitasValor so it doesn't include saldoAnterior
code = code.replace(
  'setReceitasValor(sumRecsPago + finalSaldoAnterior);',
  'setReceitasValor(sumRecsPago);'
);

// Remove the Mês and Ant labels from the Receitas card
code = code.replace(
  '<span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium flex items-center gap-[4px]"><span className="w-1 h-1 rounded-full bg-[#16A34A]"></span> Mês: {formatarValor(receitasNoMes)} <span className="ml-1 w-1 h-1 rounded-full bg-slate-400"></span> Ant: {formatarValor(saldoAnterior)}</span>',
  ''
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
