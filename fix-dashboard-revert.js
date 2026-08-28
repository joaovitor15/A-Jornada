import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  'const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);\n  const [faturaCartaoPassado, setFaturaCartaoPassado] = useState(0);',
  'const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);'
);

code = code.replace(
  'const displaySaldoAnterior = saldoAnterior - faturaCartaoPassado;\n  const displayReceitasValor = displaySaldoAnterior + receitasNoMes;\n  const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - faturaCartaoPendente;',
  'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - faturaCartaoPendente;'
);

code = code.replace(
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onFaturaChange={(atual, passado) => { setFaturaCartaoPendente(atual); setFaturaCartaoPassado(passado); }} />',
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onTotalChange={setFaturaCartaoPendente} />'
);

code = code.replace(
  /{formatarValor\(displayReceitasValor\)}/g,
  '{formatarValor(receitasValor)}'
);

code = code.replace(
  'Ant: {formatarValor(displaySaldoAnterior)}',
  'Ant: {formatarValor(saldoAnterior)}'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
