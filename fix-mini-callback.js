import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

code = code.replace(
  "export function CardFaturaMini({ activeProfileId, anoSelecionado, mesSelecionado }: { activeProfileId: string, anoSelecionado: number, mesSelecionado: number }) {",
  "export function CardFaturaMini({ activeProfileId, anoSelecionado, mesSelecionado, onTotalChange }: { activeProfileId: string, anoSelecionado: number, mesSelecionado: number, onTotalChange?: (total: number) => void }) {"
);

const targetEffect = `  const totalPendente = unpaidPassado + valorFaturaAtualView;`;
const replacementEffect = `  const totalPendente = unpaidPassado + valorFaturaAtualView;

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(Math.max(0, totalPendente));
    }
  }, [totalPendente, onTotalChange]);`;

if (!code.includes('if (onTotalChange) {')) {
  code = code.replace(targetEffect, replacementEffect);
}

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
