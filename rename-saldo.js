import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  '>\n              Saldo Final\n            </span>',
  '>\n              Saldo do Mês\n            </span>'
);

code = code.replace(
  '— Saldo Final</span>',
  '— Saldo do Mês</span>'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
