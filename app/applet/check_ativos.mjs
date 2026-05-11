import fs from 'fs';
['src/pages/InvestimentosAtivos.tsx', 'src/pages/InvestimentosCofres.tsx', 'src/components/Dashboard.tsx'].forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/bg-white(?!\s*dark:)/g);
    console.log(`${file} bg-white matches: ${matches ? matches.length : 0}`);
    
    const hexBg = content.match(/bg-\[#[A-Fa-f0-9]+\](?!\s*dark:)/g);
    console.log(`${file} hex bg matches: ${hexBg ? hexBg.length : 0}`);
})
