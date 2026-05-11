import fs from 'fs';

let path = 'src/pages/Cards.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf-8');

  // text colors
  content = content.replace(/text-\[#0F172A\](?!.*dark:text-white)/g, 'text-[#0F172A] dark:text-white');
  content = content.replace(/text-\[#374151\](?!.*dark:text-)/g, 'text-[#374151] dark:text-[#E2E8F0]');
  content = content.replace(/text-\[#64748B\](?!.*dark:text-)/g, 'text-[#64748B] dark:text-[#94A3B8]');

  // backgrounds
  content = content.replace(/bg-white(?!.*dark:bg-)/g, 'bg-white dark:bg-[#1E293B]');
  content = content.replace(/bg-\[#F8FAFC\](?!.*dark:bg-)/g, 'bg-[#F8FAFC] dark:bg-[#0F172A]');
  content = content.replace(/bg-\[#F1F5F9\](?!.*dark:bg-)/g, 'bg-[#F1F5F9] dark:bg-[#334155]');

  // borders
  content = content.replace(/border-\[#E2E8F0\](?!.*dark:border-)/g, 'border-[#E2E8F0] dark:border-[#334155]');
  content = content.replace(/border-\[#F1F5F9\](?!.*dark:border-)/g, 'border-[#F1F5F9] dark:border-[#334155]');
  content = content.replace(/border-\[#CBD5E1\](?!.*dark:border-)/g, 'border-[#CBD5E1] dark:border-[#475569]');

  // hover backgrounds
  content = content.replace(/hover:bg-\[#F1F5F9\](?!.*dark:hover:bg-)/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#475569]');
  content = content.replace(/hover:bg-\[#E2E8F0\](?!.*dark:hover:bg-)/g, 'hover:bg-[#E2E8F0] dark:hover:bg-[#475569]');
  content = content.replace(/hover:bg-\[#F8FAFC\](?!.*dark:hover:bg-)/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]');

  fs.writeFileSync(path, content);
  console.log(`Done CardsPage!`);
}
