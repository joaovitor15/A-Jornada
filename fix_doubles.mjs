import fs from 'fs';

['src/pages/InvestimentosDashboard.tsx', 'src/pages/InvestimentosAtivos.tsx', 'src/pages/InvestimentosCofres.tsx', 'src/components/Dashboard.tsx'].forEach(path => {
    let content = fs.readFileSync(path, 'utf-8');

    content = content.replace(/dark:text-\[#94A3B8\] dark:text-\[#475569\]/g, 'dark:text-[#94A3B8]');
    content = content.replace(/dark:text-\[#CBD5E1\] dark:text-\[#475569\]/g, 'dark:text-[#CBD5E1]');
    content = content.replace(/hover:bg-\[#F8FAFC\] dark:bg-\[#0F172A\]/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]');
    content = content.replace(/group-hover:border-\[#CBD5E1\] dark:border-\[#475569\]/g, 'group-hover:border-[#CBD5E1] dark:group-hover:border-[#64748B]');

    fs.writeFileSync(path, content);
    console.log(`Format double classes in ${path}`);
});
