import fs from 'fs';
['src/pages/InvestimentosDashboard.tsx', 'src/pages/InvestimentosAtivos.tsx', 'src/pages/InvestimentosCofres.tsx'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, idx) => {
    // looking for bg-[#hex] that does NOT have a subsequent dark:bg-something on the same line
    if (line.match(/bg-\[#[A-Fa-f0-9]+\](?!.*dark:bg-.*)/)) {
      console.log(`Potential missing bg in ${file}:${idx+1} -> ${line.trim()}`);
    }
  });
});
