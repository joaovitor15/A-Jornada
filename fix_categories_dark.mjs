import fs from 'fs';

let path = 'src/pages/Categories.tsx';
let content = fs.readFileSync(path, 'utf-8');

// Backgrounds
content = content.replace(/bg-white(?!\s*dark:)/g, 'bg-white dark:bg-[#1E293B]');
content = content.replace(/bg-\[#F8FAFC\](?!\s*dark:)/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
content = content.replace(/bg-\[#F1F5F9\](?!\s*dark:)/g, 'bg-[#F1F5F9] dark:bg-[#334155]');
content = content.replace(/bg-\[#E2E8F0\](?!\s*dark:)/g, 'bg-[#E2E8F0] dark:bg-[#475569]');
content = content.replace(/bg-gray-100(?!\s*dark:)/g, 'bg-gray-100 dark:bg-gray-800');
content = content.replace(/bg-\[#FEF2F2\](?!\s*dark:)/g, 'bg-[#FEF2F2] dark:bg-red-900/20');
content = content.replace(/bg-\[#DCFCE7\](?!\s*dark:)/g, 'bg-[#DCFCE7] dark:bg-green-900/20');
content = content.replace(/bg-\[#FEE2E2\](?!\s*dark:)/g, 'bg-[#FEE2E2] dark:bg-red-900/20');
content = content.replace(/bg-\[#FFFBEB\](?!\s*dark:)/g, 'bg-[#FFFBEB] dark:bg-yellow-900/20');
content = content.replace(/bg-\[#F0FDF4\](?!\s*dark:)/g, 'bg-[#F0FDF4] dark:bg-green-900/20');

// Texts
content = content.replace(/text-\[#0F172A\](?!\s*dark:)/g, 'text-[#0F172A] dark:text-white');
content = content.replace(/text-\[#374151\](?!\s*dark:)/g, 'text-[#374151] dark:text-[#E2E8F0]');
content = content.replace(/text-\[#475569\](?!\s*dark:)/g, 'text-[#475569] dark:text-[#CBD5E1]');
content = content.replace(/text-\[#6B7280\](?!\s*dark:)/g, 'text-[#6B7280] dark:text-[#94A3B8]');
content = content.replace(/text-\[#64748B\](?!\s*dark:)/g, 'text-[#64748B] dark:text-[#94A3B8]');
content = content.replace(/text-\[#94A3B8\](?!\s*dark:)/g, 'text-[#94A3B8] dark:text-[#475569]');
content = content.replace(/text-\[#CBD5E1\](?!\s*dark:)/g, 'text-[#CBD5E1] dark:text-[#475569]');

content = content.replace(/text-\[#16A34A\](?!\s*dark:)/g, 'text-[#16A34A] dark:text-green-400');
content = content.replace(/text-\[#86EFAC\](?!\s*dark:)/g, 'text-[#86EFAC] dark:text-green-500');
content = content.replace(/text-\[#15803D\](?!\s*dark:)/g, 'text-[#15803D] dark:text-green-300');
content = content.replace(/text-\[#166534\](?!\s*dark:)/g, 'text-[#166534] dark:text-green-400');

content = content.replace(/text-\[#EF4444\](?!\s*dark:)/g, 'text-[#EF4444] dark:text-red-400');
content = content.replace(/text-\[#FCA5A5\](?!\s*dark:)/g, 'text-[#FCA5A5] dark:text-red-500');

content = content.replace(/text-\[#F59E0B\](?!\s*dark:)/g, 'text-[#F59E0B] dark:text-amber-400');
content = content.replace(/text-\[#B45309\](?!\s*dark:)/g, 'text-[#B45309] dark:text-amber-500');
content = content.replace(/text-\[#92400E\](?!\s*dark:)/g, 'text-[#92400E] dark:text-amber-300');

// Borders
content = content.replace(/border-\[#F1F5F9\](?!\s*dark:)/g, 'border-[#F1F5F9] dark:border-[#334155]');
content = content.replace(/border-\[#F8FAFC\](?!\s*dark:)/g, 'border-[#F8FAFC] dark:border-[#0F172A]');
content = content.replace(/border-\[#E2E8F0\](?!\s*dark:)/g, 'border-[#E2E8F0] dark:border-[#334155]');
content = content.replace(/border-\[#CBD5E1\](?!\s*dark:)/g, 'border-[#CBD5E1] dark:border-[#475569]');

content = content.replace(/border-\[#DCFCE7\](?!\s*dark:)/g, 'border-[#DCFCE7] dark:border-green-900/40');
content = content.replace(/border-\[#FEE2E2\](?!\s*dark:)/g, 'border-[#FEE2E2] dark:border-red-900/40');
content = content.replace(/border-\[#16A34A\](?!\s*dark:)/g, 'border-[#16A34A] dark:border-green-500/50');
content = content.replace(/border-\[#F59E0B\](?!\s*dark:)/g, 'border-[#F59E0B] dark:border-amber-500/50');

// Hovers
content = content.replace(/hover:bg-\[#F8FAFC\](?!\s*dark:)/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]');
content = content.replace(/hover:bg-\[#F1F5F9\](?!\s*dark:)/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#334155]');
content = content.replace(/hover:bg-\[#E2E8F0\](?!\s*dark:)/g, 'hover:bg-[#E2E8F0] dark:hover:bg-[#475569]');
content = content.replace(/hover:text-\[#374151\](?!\s*dark:)/g, 'hover:text-[#374151] dark:hover:text-white');
content = content.replace(/hover:text-\[#EF4444\](?!\s*dark:)/g, 'hover:text-[#EF4444] dark:hover:text-red-400');
content = content.replace(/hover:bg-\[#FEF2F2\](?!\s*dark:)/g, 'hover:bg-[#FEF2F2] dark:hover:bg-red-900/20');
content = content.replace(/hover:text-\[#16A34A\](?!\s*dark:)/g, 'hover:text-[#16A34A] dark:hover:text-green-400');
content = content.replace(/hover:bg-\[#DCFCE7\](?!\s*dark:)/g, 'hover:bg-[#DCFCE7] dark:hover:bg-green-900/20');
content = content.replace(/hover:text-\[#6B7280\](?!\s*dark:)/g, 'hover:text-[#6B7280] dark:hover:text-[#CBD5E1]');

// Special cases
content = content.replace(/fixed inset-0 z-\[([0-9]+)\] flex items-center justify-center p-4(?!\s*bg-)/g, 'fixed inset-0 z-[$1] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm');
content = content.replace(/fixed inset-0 z-\[([0-9]+)\]/g, 'fixed inset-0 z-[$1]');

fs.writeFileSync(path, content);
console.log(`Done Categories!`);
