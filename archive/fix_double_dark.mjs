import fs from 'fs';

let path = 'src/pages/Categories.tsx';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace(/dark:text-\[#94A3B8\] dark:text-\[#475569\]/g, 'dark:text-[#94A3B8]');
content = content.replace(/dark:text-\[#CBD5E1\] dark:text-\[#475569\]/g, 'dark:text-[#CBD5E1]');
content = content.replace(/dark:text-\[#94A3B8\] dark:text-\[#64748B\]/g, 'dark:text-[#94A3B8]');
content = content.replace(/dark:text-red-400 p-\[2px\] transition-colors rounded-full hover:bg-white dark:bg-\[#1E293B\]\/50/g, 'dark:hover:text-red-400 p-[2px] transition-colors rounded-full hover:bg-white/50 dark:hover:bg-[#1E293B]/50');

fs.writeFileSync(path, content);
console.log('Fixed double classes');
