import fs from 'fs';
const files = ['src/pages/InvestimentosCofres.tsx', 'src/pages/InvestimentosDashboard.tsx', 'src/pages/InvestimentosAtivos.tsx'];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, idx) => {
    if ((line.includes('bg-slate-') || line.includes('bg-gray-') || line.includes('bg-white')) && !line.includes('dark:bg-')) {
        // Ignore lines that already have dark mode or are comments
        if (!line.includes('//') && !line.includes('/*')) {
            console.log(`${file}:${idx+1} -> ${line.trim()}`);
        }
    }
  });
});
