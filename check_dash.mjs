import fs from 'fs';
['src/pages/InvestimentosDashboard.tsx'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, idx) => {
    if (line.includes('text-[#') && !line.includes('dark:text-') && !line.includes('dark:hover:text') && !line.includes('.replace') && !line.match(/text-\[#[0-9A-Fa-f]+\]\s+dark:text-\[#[0-9A-Fa-f]+\]/)) {
      console.log(`Potential missing in ${file}:${idx+1} -> ${line.trim()}`);
    }
  });
});
