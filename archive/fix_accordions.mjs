import fs from 'fs';

const fixCofres = () => {
    let path = 'src/pages/InvestimentosCofres.tsx';
    let content = fs.readFileSync(path, 'utf8');

    // Remove the /80 from wrapper accordions
    content = content.replace(/dark:bg-\[#1E293B\]\/80/g, 'dark:bg-[#1E293B]');

    // Fix the Accordion Content Area background
    content = content.replace(/p-6 bg-\[#F8FAFC\] dark:bg-\[#0F172A\] rounded-b-\[24px\]/g, 'p-6 bg-[#F8FAFC] dark:bg-black/20 rounded-b-[24px]');

    // Fix the text colors that were made too dark
    content = content.replace(/dark:text-\[#475569\]/g, 'dark:text-[#94A3B8]');

    // Fix border-slate-100 on the cards
    // Ensure we don't duplicate
    if(!content.includes('border-slate-100 dark:border-[#334155]')) {
        content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-[#334155]');
    }

    fs.writeFileSync(path, content);
    console.log('Fixed InvestimentosCofres');
};

const fixDash = () => {
    let path = 'src/pages/InvestimentosDashboard.tsx';
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/dark:text-\[#475569\]/g, 'dark:text-[#94A3B8]');
    fs.writeFileSync(path, content);
    console.log('Fixed InvestimentosDashboard');
};

const fixAtivos = () => {
    let path = 'src/pages/InvestimentosAtivos.tsx';
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/dark:text-\[#475569\]/g, 'dark:text-[#94A3B8]');
    fs.writeFileSync(path, content);
    console.log('Fixed InvestimentosAtivos');
};

fixCofres();
fixDash();
fixAtivos();
