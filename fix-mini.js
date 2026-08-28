import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  "import { helperCalcularPeriodo } from '../utils/faturaUtils';",
  "import { helperCalcularPeriodo, helperCalcularPeriodoParaMes } from '../utils/faturaUtils';"
);

code = code.replace(
  "export function CardFaturaMini({ activeProfileId }: { activeProfileId: string }) {",
  "export function CardFaturaMini({ activeProfileId, anoSelecionado, mesSelecionado }: { activeProfileId: string, anoSelecionado: number, mesSelecionado: number }) {"
);

code = code.replace(
  "const periodoCardAtual = helperCalcularPeriodo(card.dia_fechamento_fatura, card.dia_vencimento_fatura, 0);",
  "const periodoCardAtual = helperCalcularPeriodoParaMes(card.dia_fechamento_fatura, card.dia_vencimento_fatura, anoSelecionado, mesSelecionado);"
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
