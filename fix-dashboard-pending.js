import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const targetStr = `                      const tDay = rec.dia_vencimento || 1;
                      if (rec.card_id === null) {
                        combinedPending.push({
                          id: \`rec-\${rec.id}\`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: dtPrefix + '-' + String(tDay).padStart(2, '0'),
                          tipo: rec.tipo,
                          status: 'previsto',
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                        });
                      }`;

const replacementStr = `                      const tDay = rec.dia_vencimento || 1;
                      combinedPending.push({
                          id: \`rec-\${rec.id}\`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: dtPrefix + '-' + String(tDay).padStart(2, '0'),
                          tipo: rec.tipo,
                          status: 'previsto',
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                      });`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
