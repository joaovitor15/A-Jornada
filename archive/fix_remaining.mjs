import fs from 'fs';

// Fix InvestimentosCofres.tsx
let cofres = fs.readFileSync('src/pages/InvestimentosCofres.tsx', 'utf-8');
cofres = cofres.replace(/bg-slate-50 md:bg-transparent rounded-xl p-4 md:p-0/g, 'bg-slate-50 dark:bg-slate-800/50 md:bg-transparent rounded-xl p-4 md:p-0');
cofres = cofres.replace(/bg-slate-200 hidden md:block/g, 'bg-slate-200 dark:bg-[#334155] hidden md:block');
cofres = cofres.replace(/bg-slate-200 md:hidden my-1/g, 'bg-slate-200 dark:bg-[#334155] md:hidden my-1');
cofres = cofres.replace(/hover:bg-red-50 p-1 rounded/g, 'hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded');
fs.writeFileSync('src/pages/InvestimentosCofres.tsx', cofres);
console.log('Fixed InvestimentosCofres.tsx');

// Fix InvestimentosDashboard.tsx
let dash = fs.readFileSync('src/pages/InvestimentosDashboard.tsx', 'utf-8');
dash = dash.replace(/bg-green-50 border border-green-100 text-green-700/g, 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400');
dash = dash.replace(/bg-red-50 border border-red-100 text-red-700/g, 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400');
dash = dash.replace(/statusColor = 'bg-slate-100 text-slate-500'/g, "statusColor = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'");
fs.writeFileSync('src/pages/InvestimentosDashboard.tsx', dash);
console.log('Fixed InvestimentosDashboard.tsx');

// Fix InvestimentosAtivos.tsx
let ativos = fs.readFileSync('src/pages/InvestimentosAtivos.tsx', 'utf-8');
ativos = ativos.replace(/'bg-slate-100 text-slate-500'/g, "'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'");
ativos = ativos.replace(/'bg-amber-100 text-amber-700'/g, "'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'");
ativos = ativos.replace(/bg-slate-100 text-slate-500 px-2 py-1/g, 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1');
fs.writeFileSync('src/pages/InvestimentosAtivos.tsx', ativos);
console.log('Fixed InvestimentosAtivos.tsx');

// Fix InvestimentosCofres.tsx (additional)
let cofres2 = fs.readFileSync('src/pages/InvestimentosCofres.tsx', 'utf-8');
cofres2 = cofres2.replace(/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-800/50');
cofres2 = cofres2.replace(/bg-slate-100 text-slate-600 px-2/g, 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2');
cofres2 = cofres2.replace(/hover:bg-slate-100/g, 'hover:bg-slate-100 dark:hover:bg-slate-800');
fs.writeFileSync('src/pages/InvestimentosCofres.tsx', cofres2);
console.log('Fixed additional InvestimentosCofres.tsx');
