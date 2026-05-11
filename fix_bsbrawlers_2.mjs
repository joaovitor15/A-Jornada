import fs from 'fs';

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // Hover replacements
    content = content.replace(/hover:bg-slate-100/g, 'hover:bg-slate-100 dark:hover:bg-[#334155]');
    content = content.replace(/hover:bg-slate-200/g, 'hover:bg-slate-200 dark:hover:bg-[#475569]');
    content = content.replace(/hover:text-slate-600/g, 'hover:text-slate-600 dark:hover:text-slate-300');
    content = content.replace(/hover:text-slate-700/g, 'hover:text-slate-700 dark:hover:text-slate-200');
    
    // Existing replacements missed or need fixup
    content = content.replace(/text-slate-400(?!\s+dark:text)/g, 'text-slate-400 dark:text-slate-500');

    fs.writeFileSync(path, content);
    console.log(`Fully fixed ${path} hover states and colors`);
}

fixFile('src/pages/BSBrawlersPage.tsx');
