import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const targetStr = `const tDay = rec.dia_vencimento || 1;
                      if (rec.card_id === null) {
                        combinedPending.push({`;
const repStr = `const tDay = rec.dia_vencimento || 1;
                      if (true) {
                        combinedPending.push({`;

code = code.replace(targetStr, repStr);
fs.writeFileSync('src/components/Dashboard.tsx', code);
