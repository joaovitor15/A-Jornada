import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  "<CardFaturaMini activeProfileId={activeProfileId} />",
  "<CardFaturaMini activeProfileId={activeProfileId} anoSelecionado={an} mesSelecionado={ms} />"
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
