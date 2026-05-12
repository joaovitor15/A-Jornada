import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionModal.tsx', 'utf-8');

// text colors
content = content.replace(/text-\[#0F172A\]/g, 'text-[#0F172A] dark:text-white');
content = content.replace(/text-\[#374151\]/g, 'text-[#374151] dark:text-[#E2E8F0]');
content = content.replace(/text-\[#64748B\]/g, 'text-[#64748B] dark:text-[#94A3B8]');

// backgrounds
content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFFFFF] dark:bg-[#1E293B]');
content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
content = content.replace(/bg-\[#F1F5F9\]/g, 'bg-[#F1F5F9] dark:bg-[#334155]');

// borders
content = content.replace(/border-\[#E2E8F0\]/g, 'border-[#E2E8F0] dark:border-[#334155]');

// hover backgrounds
content = content.replace(/hover:bg-\[#F1F5F9\]/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#475569]');
content = content.replace(/hover:bg-\[#E2E8F0\]/g, 'hover:bg-[#E2E8F0] dark:hover:bg-[#475569]');
content = content.replace(/hover:bg-\[#F8FAFC\]/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]');

// Selected states / special pills
content = content.replace(/bg-\[#EFF6FF\]/g, 'bg-[#EFF6FF] dark:bg-[#1E3A8A]');
content = content.replace(/bg-\[#DCFCE7\]/g, 'bg-[#DCFCE7] dark:bg-green-900\/30');
content = content.replace(/bg-\[#FEE2E2\]/g, 'bg-[#FEE2E2] dark:bg-red-900\/30');

// Modal backdrop
content = content.replace(/bg-\[#0F172A80\]/g, 'bg-[#0F172A80] dark:bg-[#0F172AB3]');

fs.writeFileSync('src/components/TransactionModal.tsx', content);
console.log('Done TransactionModal!');
