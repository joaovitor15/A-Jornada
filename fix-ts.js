import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    'const cardDebts: Record<string, { pastDespesas: number, targetDespesas: number, receitas: number, targetTotalGasto: number }> = {};',
    'const cardDebts: Record<string, { pastDespesas: number, targetDespesas: number, receitas: number, currReceitas?: number, targetTotalGasto: number }> = {};'
);

code = code.replace(
    /payment_data: calculatePaymentData\(rec, targetDay\)/g,
    'payment_data: calculatePaymentData(rec, targetDay, anoSelecionado, Number(mesStr) - 1)'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
