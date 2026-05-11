import fs from 'fs';

let path = 'src/pages/Categories.tsx';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace(/hover:bg-gray-100 dark:bg-gray-800/g, 'hover:bg-gray-100 dark:hover:bg-gray-800');

fs.writeFileSync(path, content);
console.log('Fixed hover:bg');
