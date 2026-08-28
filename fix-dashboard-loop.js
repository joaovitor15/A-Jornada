import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const oldLoopStart = `      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {
                  lancamentosRapidos.push({
                      id: \`rec-\${rec.id}\`,
                      recorrente_id: rec.id,
                      descricao: rec.nome,
                      valor: Number(rec.valor) || 0,
                      tags: rec.tags,
                      categories: rec.categories,
                      isRecurrent: true,
                      tipo: rec.tipo,
                      recurrentSource: rec
                  });
                  return;
              }
              
              if (rec.card_id !== null) return;
              
              const recCat = rec.categories?.nome?.toLowerCase();
              const isInvest = recCat === 'investimentos';`;

const newLoopStart = `      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {
                  lancamentosRapidos.push({
                      id: \`rec-\${rec.id}\`,
                      recorrente_id: rec.id,
                      descricao: rec.nome,
                      valor: Number(rec.valor) || 0,
                      tags: rec.tags,
                      categories: rec.categories,
                      isRecurrent: true,
                      tipo: rec.tipo,
                      recurrentSource: rec
                  });
                  return;
              }
              
              const recCat = rec.categories?.nome?.toLowerCase();
              const isInvest = recCat === 'investimentos';
`;

code = code.replace(oldLoopStart, newLoopStart);

const oldInnerLoop = `              if (shouldRender) {
                  const dtPrefix = \`\${targetYear}-\${String(targetMonth+1).padStart(2, '0')}\`;
                  const launched = antDataAllToUse.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                  if (!launched) {
                      if (rec.tipo === 'receita') currentRecsPrevRec += Number(rec.valor) || 0;
                      else if (rec.tipo === 'despesa') {
                          if (isInvest) currentInvesPrevRec += Number(rec.valor) || 0;
                          else currentDspsPrevRec += Number(rec.valor) || 0;
                      }
                      
                      const tDay = rec.dia_vencimento || 1;
                      combinedPending.push({`;

const newInnerLoop = `              if (shouldRender) {
                  const dtPrefix = \`\${targetYear}-\${String(targetMonth+1).padStart(2, '0')}\`;
                  const launched = antDataAllToUse.find(t => t.recorrente_id === rec.id && t.data && t.data.startsWith(dtPrefix));
                  if (!launched) {
                      // For EXIBICAO (Includes cards)
                      if (rec.tipo === 'despesa' && !isInvest) {
                          currentDspsPrevRecExibicao += Number(rec.valor) || 0;
                      }
                      
                      // For Saldo Final (Excludes cards)
                      if (rec.card_id === null) {
                          if (rec.tipo === 'receita') currentRecsPrevRec += Number(rec.valor) || 0;
                          else if (rec.tipo === 'despesa') {
                              if (isInvest) currentInvesPrevRec += Number(rec.valor) || 0;
                              else currentDspsPrevRec += Number(rec.valor) || 0;
                          }
                      }
                      
                      const tDay = rec.dia_vencimento || 1;
                      if (rec.card_id === null) {
                        combinedPending.push({`;

code = code.replace(oldInnerLoop, newInnerLoop);

const oldSetters = `      setReceitasPago(currentRecsPago);
      setReceitasPrevisto(currentRecsPrev + currentRecsPrevRec);
      setDespesasPago(currentDspsPago);
      setDespesasPrevisto(currentDspsPrev + currentDspsPrevRec);
      setInvestimentosPrevisto(currentInvesPrev + currentInvesPrevRec);`;

const newSetters = `      setReceitasPago(currentRecsPago);
      setReceitasPrevisto(currentRecsPrev + currentRecsPrevRec);
      setDespesasPago(currentDspsPago);
      setDespesasPrevisto(currentDspsPrev + currentDspsPrevRec);
      
      setDespesasValorExibicao(currentDspsPagoExibicao);
      setDespesasPrevistoExibicao(currentDspsPrevExibicao + currentDspsPrevRecExibicao);
      
      setInvestimentosPrevisto(currentInvesPrev + currentInvesPrevRec);`;

code = code.replace(oldSetters, newSetters);

fs.writeFileSync('src/components/Dashboard.tsx', code);
