import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsPage.tsx', 'utf-8');

// text colors
content = content.replace(/text-\[#0F172A\]/g, 'text-[#0F172A] dark:text-white');
content = content.replace(/text-\[#64748B\]/g, 'text-[#64748B] dark:text-[#94A3B8]');
content = content.replace(/text-\[#94A3B8\]/g, 'text-[#94A3B8] dark:text-[#64748B]');
content = content.replace(/text-\[#334155\]/g, 'text-[#334155] dark:text-[#94A3B8]');
content = content.replace(/text-\[#CBD5E1\](?! dark:)/g, 'text-[#CBD5E1] dark:text-[#64748B]');

// backgrounds
content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFFFFF] dark:bg-[#1E293B]');
content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
content = content.replace(/bg-\[#F1F5F9\]/g, 'bg-[#F1F5F9] dark:bg-[#334155]');
content = content.replace(/bg-white/g, 'bg-white dark:bg-[#1E293B]');

// borders
content = content.replace(/border-\[#E2E8F0\]/g, 'border-[#E2E8F0] dark:border-[#334155]');
content = content.replace(/border-\[#F1F5F9\]/g, 'border-[#F1F5F9] dark:border-[#334155]');
content = content.replace(/border-\[#F8FAFC\]/g, 'border-[#F8FAFC] dark:border-[#0F172A]');
content = content.replace(/border-transparent/g, 'border-transparent dark:border-transparent');

// hover backgrounds
content = content.replace(/hover:bg-\[#F8FAFC\]/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#334155]');
content = content.replace(/hover:bg-\[#F1F5F9\]/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#475569]');
content = content.replace(/hover:bg-\[#E2E8F0\]/g, 'hover:bg-[#E2E8F0] dark:hover:bg-[#475569]');
content = content.replace(/hover:bg-\[#FAFAFA\]/g, 'hover:bg-[#FAFAFA] dark:hover:bg-[#0F172A]');
content = content.replace(/hover:bg-\[#EFF6FF\]/g, 'hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]');
content = content.replace(/hover:bg-\[#FEF2F2\]/g, 'hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]');

// Selected states / special pills
content = content.replace(/bg-\[#EFF6FF\]/g, 'bg-[#EFF6FF] dark:bg-[#1E3A8A]');
content = content.replace(/bg-\[#DCFCE7\]/g, 'bg-[#DCFCE7] dark:bg-green-900\/30');
content = content.replace(/bg-\[#FEE2E2\]/g, 'bg-[#FEE2E2] dark:bg-red-900\/30');
content = content.replace(/bg-\[#0F172A\](?!80)(?! \/20)/g, 'bg-[#0F172A] dark:bg-indigo-300'); // be careful with text colors!
content = content.replace(/text-\[#FFFFFF\]/g, 'text-[#FFFFFF] dark:text-[#0F172A]');

// Modal backdrop
content = content.replace(/bg-\[#0F172A80\]/g, 'bg-[#0F172A80] dark:bg-[#0F172AB3]');

fs.writeFileSync('src/components/TransactionsPage.tsx', content);
console.log('Done Transacoes!');
