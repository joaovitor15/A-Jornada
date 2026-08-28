import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    'setReceitasValor(sumRecsPago);',
    'setReceitasValor(sumRecsPago + finalSaldoAnterior);\n      setReceitasNoMes(sumRecsPago);'
);

// We need a state for receitasNoMes
code = code.replace(
    'const [receitasValor, setReceitasValor] = useState(0);',
    'const [receitasValor, setReceitasValor] = useState(0);\n  const [receitasNoMes, setReceitasNoMes] = useState(0);'
);

// Now update CARD 1
code = code.replace(
    '<span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">\n              Receitas\n            </span>\n          </div>\n          <div className="flex flex-col relative z-10">\n            {isCardsLoading ? (\n               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>\n            ) : (\n              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#16A34A] dark:text-green-500 leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>\n            )}\n          </div>',
    `<div className="flex flex-col items-end">
              <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
                Receitas
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Ant: {formatarValor(saldoAnterior)}</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <>
                <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#16A34A] dark:text-green-500 leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>
                <span className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Mês: {formatarValor(receitasNoMes)}</span>
              </>
            )}
          </div>`
);


fs.writeFileSync('src/components/Dashboard.tsx', code);
