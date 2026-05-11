import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsPage.tsx', 'utf-8');

content = content.replace(/dark:bg-indigo-300/g, '');
content = content.replace(/dark:text-\[#64748B\] dark:text-\[#64748B\]/g, 'dark:text-[#64748B]');
content = content.replace(/text-\[#64748B\] dark:text-\[#94A3B8\] dark:text-\[#64748B\]/g, 'text-[#64748B] dark:text-[#94A3B8]');

fs.writeFileSync('src/components/TransactionsPage.tsx', content);
console.log('Fixed indigo-300');
