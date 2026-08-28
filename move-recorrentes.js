import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const queryStr = `
      const { data: recorrentesRaw, error: recError } = await supabase
        .from('transacoes_recorrentes')
        .select('*, categories (id, nome, cor), tags (id, nome)')
        .eq('profile_id', activeProfileId)
        .eq('ativa', true);
`;

code = code.replace(queryStr, '');

const targetStr = `      const antDataAllToUse = antDataAll || [];`;
code = code.replace(targetStr, targetStr + queryStr);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Moved query");
