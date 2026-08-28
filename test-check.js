import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
console.log(code.match(/setReceitasValor\([^)]+\)/g));
