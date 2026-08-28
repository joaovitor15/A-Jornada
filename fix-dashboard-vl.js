import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  `if (t.card_id !== null) {
              if (currentProfile?.financeiro_show_cartoes !== false) {
                 if (t.tipo === 'despesa') pastCartaoDesp += vl;
                 else if (t.tipo === 'receita') pastCartaoRec += vl;
              }
              return;
          }
          
          const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;`,
  `const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;

          if (t.card_id !== null) {
              if (currentProfile?.financeiro_show_cartoes !== false) {
                 if (t.tipo === 'despesa') pastCartaoDesp += vl;
                 else if (t.tipo === 'receita') pastCartaoRec += vl;
              }
              return;
          }`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
