import fs from 'fs';
let cofres = fs.readFileSync('src/pages/InvestimentosCofres.tsx', 'utf-8');

// Change accordion content backgrounds to something standard
cofres = cofres.replace(/dark:bg-black\/20/g, 'dark:bg-[#020817]/40');

fs.writeFileSync('src/pages/InvestimentosCofres.tsx', cofres);
console.log('Fixed Cofres');
