import fs from 'fs';
let code = fs.readFileSync('src/components/RecorrentesPage.tsx', 'utf-8');
code = "import { CalculadoraSalario } from './CalculadoraSalario';\n" + code;
fs.writeFileSync('src/components/RecorrentesPage.tsx', code);
