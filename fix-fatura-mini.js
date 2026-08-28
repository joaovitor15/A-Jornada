import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  'onTotalChange?: (total: number) => void',
  'onFaturaChange?: (atual: number, passado: number) => void'
);

code = code.replace(
  'if (onTotalChange) {',
  'if (onFaturaChange) {'
);

code = code.replace(
  'onTotalChange(0);',
  'onFaturaChange(0, 0);'
);

code = code.replace(
  'onTotalChange(Math.max(0, totalPendente));',
  'onFaturaChange(Math.max(0, valorFaturaAtualView), Math.max(0, unpaidPassado));'
);

code = code.replace(
  '[totalPendente, onTotalChange, loading, transacoesLoading]',
  '[valorFaturaAtualView, unpaidPassado, onFaturaChange, loading, transacoesLoading]'
);

code = code.replace(
  '{formatarValor(Math.max(0, totalPendente))}',
  '{formatarValor(Math.max(0, unpaidPassado + valorFaturaAtualView))}'
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
