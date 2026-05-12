import fs from 'fs';

let path = 'src/pages/Login.tsx';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/bg-\[\#F0F7FF\]/g, 'bg-[#F0F7FF] dark:bg-[#0F172A]');
    // let's leave bg-[#2563EB] mostly as is but fix shadow
    content = content.replace(/shadow-blue-200/g, 'shadow-blue-200 dark:shadow-blue-900/30');
    content = content.replace(/bg-\[\#F1F5F9\]/g, 'bg-[#F1F5F9] dark:bg-[#0F172A]');
    content = content.replace(/bg-\[\#FEF2F2\]/g, 'bg-[#FEF2F2] dark:bg-rose-950/40');
    content = content.replace(/border-\[\#FECACA\]/g, 'border-[#FECACA] dark:border-rose-900/50');
    content = content.replace(/text-\[\#B91C1C\]/g, 'text-[#B91C1C] dark:text-rose-400');
    content = content.replace(/shadow-blue-100/g, 'shadow-blue-100 dark:shadow-blue-900/20');

    // Make text visible inside inputs in dark mode
    content = content.replace(/className="w-full bg-white dark:bg-\[\#1E293B\] border border-\[\#E2E8F0\] dark:border-\[\#334155\] rounded-lg/g, 'className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-200 rounded-lg');

    fs.writeFileSync(path, content);
    console.log('Fixed Login colors');
}
