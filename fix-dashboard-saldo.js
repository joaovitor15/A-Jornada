import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

if (!code.includes('const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);')) {
  code = code.replace(
    'const [cartoesDisplayTotal, setCartoesDisplayTotal] = useState(0);',
    'const [cartoesDisplayTotal, setCartoesDisplayTotal] = useState(0);\n  const [faturaCartaoPendente, setFaturaCartaoPendente] = useState(0);'
  );
}

code = code.replace(
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={an} mesSelecionado={ms} />',
  '<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={an} mesSelecionado={ms} onTotalChange={setFaturaCartaoPendente} />'
);

code = code.replace(
  'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto;',
  'const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto - faturaCartaoPendente;'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
