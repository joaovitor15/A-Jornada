import fs from 'fs';
const path = 'src/pages/InvestimentosCofres.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-[#334155]');

fs.writeFileSync(path, content);
console.log('Fixed border-slate-100');
