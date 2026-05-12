import fs from 'fs';
const path = 'src/pages/InvestimentosCofres.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/dark:bg-\[#0F172A\]\/50 dark:bg-black\/60/g, 'dark:bg-[#0F172A]');

fs.writeFileSync(path, content);
console.log('Fixed cofres backgrounds');
