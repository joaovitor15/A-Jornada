import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  /{formatarValor\(receitasValor\)}/g,
  '{formatarValor(displayReceitasValor)}'
);

code = code.replace(
  'Ant: {formatarValor(saldoAnterior)}',
  'Ant: {formatarValor(displaySaldoAnterior)}'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
