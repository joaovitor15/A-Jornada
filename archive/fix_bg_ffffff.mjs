import fs from 'fs';

let path = 'src/pages/Categories.tsx';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFFFFF] dark:bg-[#1E293B]');

fs.writeFileSync(path, content);
console.log('Fixed bg-[#FFFFFF]');
