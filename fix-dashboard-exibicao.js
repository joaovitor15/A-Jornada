import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Add state variables
code = code.replace(
  "const [despesasPrevisto, setDespesasPrevisto] = useState(0);",
  "const [despesasPrevisto, setDespesasPrevisto] = useState(0);\n  const [despesasValorExibicao, setDespesasValorExibicao] = useState(0);\n  const [despesasPrevistoExibicao, setDespesasPrevistoExibicao] = useState(0);"
);

// 2. Add calculation for dspsArrFull
const dspsArrFullStr = `
      let currentRecsPago = 0;
      let currentRecsPrev = 0;
      let currentDspsPago = 0;
      let currentDspsPrev = 0;
      let currentInvesPago = 0;
      let currentInvesPrev = 0;
      
      const dspsArrFull = antDataAllToUse.filter(t => t.tipo === 'despesa' && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      let currentDspsPagoExibicao = 0;
      let currentDspsPrevExibicao = 0;
      dspsArrFull.forEach(t => {
          const isInvest = (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos';
          if (!isInvest) {
              if (t.status === 'previsto') currentDspsPrevExibicao += (t.valor_previsto || t.valor || 0);
              else currentDspsPagoExibicao += (t.valor || 0);
          }
      });
`;
code = code.replace(
  /let currentRecsPago = 0;[\s\S]*?let currentInvesPrev = 0;/,
  dspsArrFullStr
);

// 3. Add currentDspsPrevRecExibicao
code = code.replace(
  "let currentDspsPrevRec = 0;",
  "let currentDspsPrevRec = 0;\n      let currentDspsPrevRecExibicao = 0;"
);

// 4. Update the logic to increment Exibicao
// We need to find the recurring logic where it checks if (rec.card_id !== null) return;
// Wait, for exhibition, we need to process all recurring items! But we skip them early if card_id !== null.
// Let's modify the loop entirely.
