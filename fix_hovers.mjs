import fs from 'fs';
['src/pages/InvestimentosDashboard.tsx', 'src/pages/InvestimentosAtivos.tsx', 'src/pages/InvestimentosCofres.tsx', 'src/components/Dashboard.tsx'].forEach(path => {
    let content = fs.readFileSync(path, 'utf-8');
    content = content.replace(/hover:bg-\[#F1F5F9\] dark:bg-\[#334155\]/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#334155]');
    content = content.replace(/hover:bg-\[#F8FAFC\] dark:bg-\[#0F172A\]/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]');
    fs.writeFileSync(path, content);
});
