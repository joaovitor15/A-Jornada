import fs from 'fs';
const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
const lines = code.split('\n');
lines.forEach((l, i) => {
    if (l.includes('sumDspsPrevRecorrente')) console.log(i + 1, l);
});
