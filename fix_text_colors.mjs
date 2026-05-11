import fs from 'fs';

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Fix remaining text colors properly using global regex replaces on full content
    content = content.replace(/text-\[#0F172A\](?!\s+dark:text)/g, 'text-[#0F172A] dark:text-white');
    content = content.replace(/text-slate-800(?!\s+dark:text)/g, 'text-slate-800 dark:text-slate-200');
    content = content.replace(/text-\[#64748B\](?!\s+dark:text)/g, 'text-[#64748B] dark:text-[#94A3B8]');
    content = content.replace(/text-slate-600(?!\s+dark:text)/g, 'text-slate-600 dark:text-slate-400');
    content = content.replace(/text-slate-700(?!\s+dark:text)/g, 'text-slate-700 dark:text-slate-300');
    
    // Also fix borders that might be missing
    content = content.replace(/border-slate-100(?!\s+dark:border)/g, 'border-slate-100 dark:border-[#334155]');
    content = content.replace(/border-slate-200(?!\s+dark:border)/g, 'border-slate-200 dark:border-[#334155]');

    fs.writeFileSync(path, content);
    console.log(`Fully fixed ${path}`);
}

fixFile('src/pages/CRProfilePage.tsx');
fixFile('src/pages/BSProfilePage.tsx');
