import fs from 'fs';
let code = fs.readFileSync('src/components/RecorrentesPage.tsx', 'utf-8');

// Update type
code = code.replace(
  "useState<'despesa' | 'receita' | 'investimento'>('despesa')",
  "useState<'despesa' | 'receita' | 'investimento' | 'salario'>('despesa')"
);

// Update filter logic
const oldFilter = `  // Filter dynamic list based on state
  let listagemFiltrada = targetProvisoesToComputeStats.filter(p => {
    const isInvestimento = p.categories?.nome?.toLowerCase() === 'investimentos';
    
    if (filtroNatureza === 'investimento') {
      if (!isInvestimento) return false;
    } else {
      if (isInvestimento) return false;
      if (p.tipo !== filtroNatureza) return false;
    }`;

const newFilter = `  // Filter dynamic list based on state
  let listagemFiltrada = targetProvisoesToComputeStats.filter(p => {
    const isInvestimento = p.categories?.nome?.toLowerCase() === 'investimentos';
    const nomeLower = (p.nome || '').toLowerCase();
    const catLower = (p.categories?.nome || '').toLowerCase();
    const isSalario = p.tipo === 'receita' && (nomeLower.includes('salário') || nomeLower.includes('salario') || catLower === 'salário' || catLower === 'salario');
    
    if (filtroNatureza === 'investimento') {
      if (!isInvestimento) return false;
    } else if (filtroNatureza === 'salario') {
      if (!isSalario) return false;
    } else if (filtroNatureza === 'receita') {
      if (isInvestimento || isSalario) return false;
      if (p.tipo !== 'receita') return false;
    } else if (filtroNatureza === 'despesa') {
      if (isInvestimento) return false;
      if (p.tipo !== 'despesa') return false;
    }`;

code = code.replace(oldFilter, newFilter);

// Add tab button
const oldTabs = `        <button
          onClick={() => setFiltroNatureza('receita')}
          className={\`flex-1 lg:flex-none min-w-[120px] lg:w-40 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap \${
              filtroNatureza === 'receita'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }\`}
        >
          Receitas
        </button>`;

const newTabs = `        <button
          onClick={() => setFiltroNatureza('receita')}
          className={\`flex-1 lg:flex-none min-w-[120px] lg:w-40 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap \${
              filtroNatureza === 'receita'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }\`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFiltroNatureza('salario')}
          className={\`flex-1 lg:flex-none min-w-[120px] lg:w-40 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap \${
              filtroNatureza === 'salario'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }\`}
        >
          Salário
        </button>`;

code = code.replace(oldTabs, newTabs);

fs.writeFileSync('src/components/RecorrentesPage.tsx', code);
