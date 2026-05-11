import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsPage.tsx', 'utf-8');

// remove duplicated dark bg
content = content.replace(/dark:bg-\[#334155\] transition-colors/g, 'transition-colors');
content = content.replace(/dark:hover:bg-\[#475569\] dark:bg-\[#334155\]/g, 'dark:hover:bg-[#475569]');

fs.writeFileSync('src/components/TransactionsPage.tsx', content);
console.log('Fixed overlapping dark backgrounds');
