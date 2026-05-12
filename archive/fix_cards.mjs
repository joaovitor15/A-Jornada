import fs from 'fs';

let content = fs.readFileSync('src/components/CardFaturaDashboard.tsx', 'utf-8');

// text colors
content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-slate-800(?! dark:)/g, 'text-slate-800 dark:text-slate-100');
content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/text-slate-400/g, 'text-slate-400 dark:text-slate-500');

// backgrounds
content = content.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-[#1E293B]');
content = content.replace(/bg-slate-50(?! dark:)/g, 'bg-slate-50 dark:bg-slate-800/50');
content = content.replace(/bg-slate-100(?! dark:)/g, 'bg-slate-100 dark:bg-slate-800');
content = content.replace(/bg-slate-200(?! dark:)/g, 'bg-slate-200 dark:bg-slate-700');
content = content.replace(/bg-black\/40/g, 'bg-black/40 dark:bg-[#0F172AB3]');
content = content.replace(/bg-black\/60/g, 'bg-black/60 dark:bg-[#0F172AB3]');

// borders
content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-slate-700/50');
content = content.replace(/border-slate-200(?! dark:)/g, 'border-slate-200 dark:border-slate-700');
content = content.replace(/border-slate-300(?! dark:)/g, 'border-slate-300 dark:border-slate-600');

fs.writeFileSync('src/components/CardFaturaDashboard.tsx', content);
console.log('Fixed CardFaturaDashboard');
