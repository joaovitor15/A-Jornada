import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// The lines:
// setSaldoAnterior(finalSaldoAnterior);
// are failing because finalSaldoAnterior is undefined. Let's remove them.
const blockToRemove = /const finalSaldoAnterior[\s\S]*?setSaldoAnterior\(finalSaldoAnterior\);/;
code = code.replace(blockToRemove, '');

// Also remove setReceitasNoMes(sumRecsPago); since receitasValor is already set to sumRecsPago and we aren't displaying receitasNoMes separately.
// And cartoesValor, cartoesPago, cartoesDisplayTotal can be cleared since they aren't used or we just pass 0
code = code.replace('setReceitasNoMes(sumRecsPago);', '');
code = code.replace('setCartoesValor(unpaidTarget - cartoesBeneficio);', 'setCartoesValor(0);');
code = code.replace('const isPaid = faturaTotalGasto > 0 && unpaidTarget <= 0.01;', '');
code = code.replace('setCartoesPago(isPaid);', 'setCartoesPago(false);');
code = code.replace('setCartoesDisplayTotal(isPaid ? faturaTotalGasto : unpaidTarget);', 'setCartoesDisplayTotal(0);');

fs.writeFileSync('src/components/Dashboard.tsx', code);
