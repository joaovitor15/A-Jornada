import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  "const globalCreditos = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita').reduce((acc, t) => acc + Number(t.valor), 0);",
  "const fimDoMesSelecionado = new Date(anoSelecionado, mesSelecionado, 0).toISOString().split('T')[0];\n  const globalCreditos = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita' && t.data <= fimDoMesSelecionado).reduce((acc, t) => acc + Number(t.valor), 0);"
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
