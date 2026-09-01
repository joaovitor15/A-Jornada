import fs from 'fs';
let code = fs.readFileSync('src/components/RecorrentesPage.tsx', 'utf-8');
code = code.replace('</React.Fragment>', '</React.Fragment>)}');
fs.writeFileSync('src/components/RecorrentesPage.tsx', code);
