import fs from 'fs';

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/bg-white(?!\s+dark:bg(?:-\[#[a-fA-F0-9]+\]|-slate-[0-9]+|\w+\/[0-9]+)?)/g, 'bg-white dark:bg-[#1E293B]');
    
    // Text
    content = content.replace(/text-\[#0F172A\](?!\s+dark:text)/g, 'text-[#0F172A] dark:text-white');
    content = content.replace(/text-\[#64748B\](?!\s+dark:text)/g, 'text-[#64748B] dark:text-[#94A3B8]');
    content = content.replace(/hover:text-\[#0F172A\](?!\s+dark:hover:text)/g, 'hover:text-[#0F172A] dark:hover:text-white');

    // Border
    content = content.replace(/border-\[#E2E8F0\](?!\s+dark:border)/g, 'border-[#E2E8F0] dark:border-[#334155]');

    fs.writeFileSync(path, content);
    console.log(`Fully fixed ${path}`);
}

fixFile('src/pages/Login.tsx');
