import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// We need to add logic to calculate historicProvisoes and historicFaturas
// We'll inject it right after `let saldoAntCalcAcumulado = 0;`

let injection = `
      let saldoAntCalcAcumulado = 0;
      let historicProvisoes = 0;
      let historicCartoes = 0;
      
      // Calculate historic provisoes from normal transactions
      if (activeProfileType !== 'empresa' && antDataAll) {
          antDataAll.forEach(t => {
              if (t.status === 'ignorado') return;
              const dateParts = t.data.split('-');
              if (dateParts.length >= 2) {
                  const ty = parseInt(dateParts[0], 10);
                  const tm = parseInt(dateParts[1], 10);
                  if (ty < an || (ty === an && tm < ms)) {
                      if (t.card_id === null && t.status === 'previsto') {
                          const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
                          if (t.tipo === 'despesa' && tagCat !== 'investimentos') {
                              historicProvisoes += (t.valor || 0);
                          }
                      }
                  }
              }
          });
      }
`;

code = code.replace(/let saldoAntCalcAcumulado = 0;/g, injection);

fs.writeFileSync('src/components/Dashboard.tsx', code);
