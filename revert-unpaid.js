import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
  'let pastDespPrev = 0;\n      let pastCartaoDesp = 0;\n      let pastCartaoRec = 0;',
  'let pastDespPrev = 0;'
);

code = code.replace(
  `const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;

          if (t.card_id !== null) {
              if (currentProfile?.financeiro_show_cartoes !== false) {
                 if (t.tipo === 'despesa') pastCartaoDesp += vl;
                 else if (t.tipo === 'receita') pastCartaoRec += vl;
              }
              return;
          }`,
  `if (t.card_id !== null) return;
          
          const vl = Number(t.status === 'previsto' ? (t.valor_previsto || t.valor) : t.valor) || 0;`
);

code = code.replace(
  'let pastCartaoUnpaid = 0;\n      if (currentProfile?.financeiro_show_cartoes !== false) {\n         pastCartaoUnpaid = Math.max(0, pastCartaoDesp - pastCartaoRec);\n      }\n      const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec - pastCartaoUnpaid;',
  'const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec;'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
