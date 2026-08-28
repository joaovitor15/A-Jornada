import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  'const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);',
  'const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);\n  const [faturaCartaoPassado, setFaturaCartaoPassado] = useState(0);'
);

code = code.replace(
  'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - faturaCartaoPendente;',
  'const displaySaldoAnterior = saldoAnterior - faturaCartaoPassado;\n  const displayReceitasValor = displaySaldoAnterior + receitasNoMes;\n  const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - faturaCartaoPendente;'
);

code = code.replace(
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onTotalChange={setFaturaCartaoPendente} />',
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onFaturaChange={(atual, passado) => { setFaturaCartaoPendente(atual); setFaturaCartaoPassado(passado); }} />'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
