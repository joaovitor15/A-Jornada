import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const targetStr = `      const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec;`;

const setterStr = `
      setDespesasValor(currentDspsPago);
      setInvestimentosValor(currentInvesPago);
      
      setReceitasPago(currentRecsPago);
      setReceitasPrevisto(currentRecsPrev + currentRecsPrevRec);
      setDespesasPago(currentDspsPago);
      setDespesasPrevisto(currentDspsPrev + currentDspsPrevRec);
      setInvestimentosPrevisto(currentInvesPrev + currentInvesPrevRec);
      
      setEconomiaDespesas(Math.max(0, (currentDspsPrev + currentDspsPrevRec) - currentDspsPago));
`;

code = code.replace(targetStr, setterStr + targetStr);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Setters updated");
