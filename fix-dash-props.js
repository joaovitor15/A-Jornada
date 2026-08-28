import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  '<CardFaturaDashboard activeProfileId={activeProfileId} setActivePage={setActivePage} />',
  '<CardFaturaDashboard activeProfileId={activeProfileId} setActivePage={setActivePage} mesSelecionado={mesSelecionado} anoSelecionado={anoSelecionado} />'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
