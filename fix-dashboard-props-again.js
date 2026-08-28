import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  "<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={an} mesSelecionado={ms} onTotalChange={setFaturaCartaoPendente} />",
  "<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={anoSelecionado} mesSelecionado={mesSelecionado} onTotalChange={setFaturaCartaoPendente} />"
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
