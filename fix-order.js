import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(
    'const projectedTimeId = targetYear * 12 + monthIdx;\n              \n              // Sum past recorrentes',
    'const projectedTimeId = targetYear * 12 + monthIdx;\n              const creationTimeId = effStartYear * 12 + effStartMonth;\n              \n              // Sum past recorrentes'
);

code = code.replace(
    /const creationTimeId = effStartYear \* 12 \+ effStartMonth;\s*if \(projectedTimeId < creationTimeId\) \{/,
    'if (projectedTimeId < creationTimeId) {'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
