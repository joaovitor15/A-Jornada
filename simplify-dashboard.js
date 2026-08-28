import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Replace the main query to only fetch current month's data
const queryOld = `const { data: antDataAll } = await supabase
        .from('transacoes')
        .select(\`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )\`)
        .eq('profile_id', activeProfileId);

      const cutoffDate = \`\${an}-\${mesStr}-01\`;
      const antDataAllToUse = antDataAll || [];`;

const queryNew = `const currentMonthPrefix = \`\${an}-\${mesStr}\`;
      const { data: antDataAll } = await supabase
        .from('transacoes')
        .select(\`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, num_parcelas, card_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )\`)
        .eq('profile_id', activeProfileId)
        .like('data', \`\${currentMonthPrefix}%\`);

      const antDataAllToUse = antDataAll || [];`;

code = code.replace(queryOld, queryNew);

// Remove the `let pastRecPago = 0; ... ` down to `let faturaTotalGasto = 0;` (inclusive)
// We'll use a regex replacement
const blockToRemove = /let pastRecPago = 0;[\s\S]*?let faturaTotalGasto = 0;/;
code = code.replace(blockToRemove, '');

// Also remove `const currentMonthPrefix = \`\${an}-\${mesStr}\`;` from later in the file since we declared it early
code = code.replace(/const currentMonthPrefix = `\$\{an\}-\$\{mesStr\}`;/g, '');

fs.writeFileSync('src/components/Dashboard.tsx', code);
