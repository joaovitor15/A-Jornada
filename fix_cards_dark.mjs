import fs from 'fs';

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Make sure bg-white correctly gets dark mode, same for slate-50 and bg-slate-100
    // Be careful not to replace already replaced ones: bg-white dark:bg-[#1E293B]
    content = content.replace(/bg-white(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-white dark:bg-[#1E293B]');
    content = content.replace(/bg-slate-50(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-slate-50 dark:bg-[#0F172A]/50');
    content = content.replace(/bg-slate-100(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-slate-100 dark:bg-[#334155]');

    fs.writeFileSync(path, content);
    console.log(`Fixed ${path}`);
}

fixFile('src/pages/CRProfilePage.tsx');
fixFile('src/pages/BSProfilePage.tsx');
