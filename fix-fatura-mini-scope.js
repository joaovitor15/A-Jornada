import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  'let totalPendente = 0;',
  'let totalPendente = 0;\n  let valorFaturaAtualView = 0;\n  let unpaidPassado = 0;'
);

code = code.replace(
  'const unpaidPassado = Math.max(0, despesasPassado - creditosRestantes);',
  'unpaidPassado = Math.max(0, despesasPassado - creditosRestantes);'
);

code = code.replace(
  'const valorFaturaAtualView = excedenteCredito > 0 ? -excedenteCredito : unpaidAberto;',
  'valorFaturaAtualView = excedenteCredito > 0 ? -excedenteCredito : unpaidAberto;'
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
