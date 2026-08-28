import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  'onFaturaChange?: (atual: number, passado: number) => void',
  'onTotalChange?: (total: number) => void'
);

code = code.replace(
  'if (onFaturaChange) {',
  'if (onTotalChange) {'
);

code = code.replace(
  'onFaturaChange(0, 0);',
  'onTotalChange(0);'
);

code = code.replace(
  'onFaturaChange(Math.max(0, valorFaturaAtualView), Math.max(0, unpaidPassado));',
  'onTotalChange(Math.max(0, valorFaturaAtualView));'
);

code = code.replace(
  '[valorFaturaAtualView, unpaidPassado, onFaturaChange, loading, transacoesLoading]',
  '[valorFaturaAtualView, onTotalChange, loading, transacoesLoading]'
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
