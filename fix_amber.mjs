import fs from 'fs';
const path = 'src/pages/InvestimentosCofres.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-\[#FEF3C7\]/g, 'bg-[#FEF3C7] dark:bg-[#F59E0B]/20');
content = content.replace(/text-\[#F59E0B\]/g, 'text-[#F59E0B] dark:text-[#FBBF24]');

fs.writeFileSync(path, content);
console.log('Fixed amber tags');
