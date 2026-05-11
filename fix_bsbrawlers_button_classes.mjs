import fs from 'fs';

let path = 'src/pages/BSBrawlersPage.tsx';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-\[#334155\] dark:bg-\[#334155\]/g, 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]');
    
    // Also clean up tooltip trigger class
    content = content.replace(/text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-\[#475569\] dark:bg-\[#475569\]/g, 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#475569]');

    fs.writeFileSync(path, content);
    console.log('Fixed BSBrawlersPage button classes');
}
