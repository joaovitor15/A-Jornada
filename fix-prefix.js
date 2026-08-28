import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  'const mesStr = ms.toString().padStart(2, \'0\');\n      const ultimoDia = new Date(an, ms, 0).getDate();',
  'const mesStr = ms.toString().padStart(2, \'0\');\n      const ultimoDia = new Date(an, ms, 0).getDate();\n      const currentMonthPrefix = `${an}-${mesStr}`;'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
