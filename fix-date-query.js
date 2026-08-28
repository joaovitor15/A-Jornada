import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  ".like('data', `${currentMonthPrefix}%`);",
  ".gte('data', `${currentMonthPrefix}-01`).lte('data', `${currentMonthPrefix}-${ultimoDia}`);"
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
