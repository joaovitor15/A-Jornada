import fs from 'fs';

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // Fix cards and blocks
    content = content.replace(/bg-white(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-white dark:bg-[#1E293B]');
    content = content.replace(/bg-slate-50(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-slate-50 dark:bg-[#0F172A]/50');
    content = content.replace(/bg-slate-100(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-slate-100 dark:bg-[#334155]');

    // Fix text colors
    content = content.replace(/text-\[#0F172A\](?!\s+dark:text)/g, 'text-[#0F172A] dark:text-white');
    content = content.replace(/text-slate-800(?!\s+dark:text)/g, 'text-slate-800 dark:text-slate-200');
    content = content.replace(/text-\[#64748B\](?!\s+dark:text)/g, 'text-[#64748B] dark:text-[#94A3B8]');
    content = content.replace(/text-slate-600(?!\s+dark:text)/g, 'text-slate-600 dark:text-slate-400');
    content = content.replace(/text-slate-700(?!\s+dark:text)/g, 'text-slate-700 dark:text-slate-300');
    
    // Fix borders
    content = content.replace(/border-slate-100(?!\s+dark:border)/g, 'border-slate-100 dark:border-[#334155]');
    content = content.replace(/border-slate-200(?!\s+dark:border)/g, 'border-slate-200 dark:border-[#334155]');

    fs.writeFileSync(path, content);
    console.log(`Fully fixed ${path}`);
}

fixFile('src/pages/CRCardsPage.tsx');
fixFile('src/pages/CRBadgesPage.tsx');
fixFile('src/pages/BSBrawlersPage.tsx');
