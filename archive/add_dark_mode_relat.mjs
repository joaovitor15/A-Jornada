import fs from 'fs';

let path = `src/components/RelatoriosPage.tsx`;
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf-8');

  // text colors
  content = content.replace(/text-\[#0F172A\](?!.*dark:text-white)/g, 'text-[#0F172A] dark:text-white');
  content = content.replace(/text-\[#374151\](?!.*dark:text-)/g, 'text-[#374151] dark:text-[#E2E8F0]');
  content = content.replace(/text-\[#64748B\](?!.*dark:text-)/g, 'text-[#64748B] dark:text-[#94A3B8]');

  // backgrounds
  content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFFFFF] dark:bg-[#1E293B]');
  content = content.replace(/bg-white/g, 'bg-white dark:bg-[#1E293B]');
  content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
  content = content.replace(/bg-\[#F1F5F9\]/g, 'bg-[#F1F5F9] dark:bg-[#334155]');

  // borders
  content = content.replace(/border-\[#E2E8F0\]/g, 'border-[#E2E8F0] dark:border-[#334155]');
  content = content.replace(/border-\[#F1F5F9\]/g, 'border-[#F1F5F9] dark:border-[#334155]');
  content = content.replace(/border-\[#F8FAFC\]/g, 'border-[#F8FAFC] dark:border-[#0F172A]');

  fs.writeFileSync(path, content);
  console.log(`Done RelatoriosPage!`);
}
