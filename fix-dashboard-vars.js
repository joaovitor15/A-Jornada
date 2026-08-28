import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const targetStr = `      const finalSaldoAnterior = pastRecPago - pastDespPago - pastInvestPago - pastDespPrev - pastDespPrevRec;`;

const missingVars = `
      const { data: recorrentesRaw, error: recError } = await supabase
        .from('transacoes_recorrentes')
        .select('*, categories (id, nome, cor), tags (id, nome)')
        .eq('profile_id', activeProfileId)
        .eq('ativa', true);

      let unpaidTarget = 0;
      let cartoesBeneficio = 0;
      let faturaTotalGasto = 0;
      
      const combinedPending: any[] = [];
      const lancamentosRapidos: any[] = [];
      
      const currentMonthPrefix = \`\${an}-\${mesStr}\`;
      
      const dspsArr = antDataAllToUse.filter(t => t.tipo === 'despesa' && t.card_id === null && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      const recsArr = antDataAllToUse.filter(t => t.tipo === 'receita' && t.card_id === null && t.data && t.data.startsWith(currentMonthPrefix) && t.status !== 'ignorado');
      const invesArr = dspsArr.filter(t => (t.tags as any)?.categories?.nome?.toLowerCase() === 'investimentos');
      
      let sumRecsPago = 0;
      recsArr.forEach(t => {
          if (t.status !== 'previsto') {
              const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
              const isFarmacia = activeProfileType === 'empresa' && (tagCat === 'farmácia popular' || tagCat === 'farmacia popular');
              if (!isFarmacia) sumRecsPago += Number(t.valor) || 0;
          }
      });
      
      if (recorrentesRaw) {
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
              }
          });
      }
      
`;

code = code.replace(targetStr, missingVars + targetStr);
fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Fixed missing vars.");
