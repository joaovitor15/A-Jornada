import fs from 'fs';

['src/pages/InvestimentosAtivos.tsx', 'src/pages/InvestimentosCofres.tsx', 'src/components/Dashboard.tsx'].forEach(path => {
    let content = fs.readFileSync(path, 'utf-8');

    // Backgrounds
    content = content.replace(/bg-white(?!\s*dark:)/g, 'bg-white dark:bg-[#1E293B]');
    content = content.replace(/bg-\[#F8FAFC\](?!\s*dark:)/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
    content = content.replace(/bg-\[#F1F5F9\](?!\s*dark:)/g, 'bg-[#F1F5F9] dark:bg-[#334155]');
    content = content.replace(/bg-\[#E2E8F0\](?!\s*dark:)/g, 'bg-[#E2E8F0] dark:bg-[#475569]');

    content = content.replace(/bg-\[#DCFCE7\](?!\s*dark:)/g, 'bg-[#DCFCE7] dark:bg-green-900/20');
    content = content.replace(/bg-\[#FEE2E2\](?!\s*dark:)/g, 'bg-[#FEE2E2] dark:bg-red-900/20');

    // Texts
    content = content.replace(/text-\[#0F172A\](?!\s*dark:)/g, 'text-[#0F172A] dark:text-white');
    content = content.replace(/text-\[#475569\](?!\s*dark:)/g, 'text-[#475569] dark:text-[#CBD5E1]');
    content = content.replace(/text-\[#64748B\](?!\s*dark:)/g, 'text-[#64748B] dark:text-[#94A3B8]');
    content = content.replace(/text-\[#94A3B8\](?!\s*dark:)/g, 'text-[#94A3B8] dark:text-[#475569]');
    content = content.replace(/text-\[#CBD5E1\](?!\s*dark:)/g, 'text-[#CBD5E1] dark:text-[#475569]');

    content = content.replace(/text-\[#16A34A\](?!\s*dark:)/g, 'text-[#16A34A] dark:text-green-400');
    content = content.replace(/text-\[#EF4444\](?!\s*dark:)/g, 'text-[#EF4444] dark:text-red-400');
    content = content.replace(/text-\[#2563EB\](?!\s*dark:)/g, 'text-[#2563EB] dark:text-blue-400');

    // Borders
    content = content.replace(/border-\[#E2E8F0\](?!\s*dark:)/g, 'border-[#E2E8F0] dark:border-[#334155]');
    content = content.replace(/border-\[#CBD5E1\](?!\s*dark:)/g, 'border-[#CBD5E1] dark:border-[#475569]');
    content = content.replace(/border-\[#16A34A\](?!\s*dark:)/g, 'border-[#16A34A] dark:border-green-500/50');
    content = content.replace(/border-\[#EF4444\](?!\s*dark:)/g, 'border-[#EF4444] dark:border-red-500/50');

    // Hovers
    content = content.replace(/hover:bg-\[#F8FAFC\](?!\s*dark:)/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]');
    content = content.replace(/hover:bg-\[#F1F5F9\](?!\s*dark:)/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#334155]');
    content = content.replace(/hover:border-\[#CBD5E1\](?!\s*dark:)/g, 'hover:border-[#CBD5E1] dark:hover:border-[#64748B]');
    content = content.replace(/focus:border-\[#2563EB\](?!\s*dark:)/g, 'focus:border-[#2563EB] dark:focus:border-blue-500');
    
    // Fix modal overlay
    content = content.replace(/bg-black\/40(?! dark:)/g, 'bg-black/40 dark:bg-black/60');
    content = content.replace(/bg-\[#0F172A\]\/50(?! dark:)/g, 'bg-[#0F172A]/50 dark:bg-black/60');
    content = content.replace(/bg-\[#0F172A80\]/g, 'bg-[#0F172A80] dark:bg-black/60');

    fs.writeFileSync(path, content);
    console.log(`Done ${path}!`);
});
