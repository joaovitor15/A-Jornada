import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

if (!code.includes('import { CardFaturaMini }')) {
  code = code.replace(
    "import { CardFaturaDashboard } from './CardFaturaDashboard';",
    "import { CardFaturaDashboard } from './CardFaturaDashboard';\nimport { CardFaturaMini } from './CardFaturaMini';"
  );
}

const targetHtml = `        {/* CARD 5 — DESPESAS */}`;
const repHtml = `        {currentProfile?.financeiro_show_cartoes !== false && (
          <CardFaturaMini activeProfileId={activeProfileId} />
        )}

        {/* CARD 5 — DESPESAS */}`;

if (!code.includes('<CardFaturaMini')) {
  code = code.replace(targetHtml, repHtml);
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
