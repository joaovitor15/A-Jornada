import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Add state variables (check if they exist first to avoid duplicates)
if (!code.includes('despesasValorExibicao')) {
  code = code.replace(
    "const [despesasPrevisto, setDespesasPrevisto] = useState(0);",
    "const [despesasPrevisto, setDespesasPrevisto] = useState(0);\n  const [despesasValorExibicao, setDespesasValorExibicao] = useState(0);\n  const [despesasPrevistoExibicao, setDespesasPrevistoExibicao] = useState(0);"
  );
}

// 2. Add calculation for dspsArrFull
const targetToReplace = `      recsArr.forEach(t => {
          if (t.status === 'previsto') currentRecsPrev += (t.valor_previsto || t.valor || 0);
          else currentRecsPago += (t.valor || 0);
      });

      dspsArr.forEach(t => {`;

const newCode = `      recsArr.forEach(t => {
          if (t.status === 'previsto') currentRecsPrev += (t.valor_previsto || t.valor || 0);
          else currentRecsPago += (t.valor || 0);
      });

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

      dspsArr.forEach(t => {`;

if (!code.includes('dspsArrFull')) {
  code = code.replace(targetToReplace, newCode);
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
