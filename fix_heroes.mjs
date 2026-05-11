import fs from 'fs';

function fixFile(path, isBrawlStars) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    if (isBrawlStars) {
        // Brawl stars card gradient
        content = content.replace(/bg-gradient-to-b from-\[#F59E0B\] to-\[#D97706\]/g, 'bg-gradient-to-b from-[#F59E0B] to-[#D97706] dark:from-slate-800 dark:to-slate-900');
        // border
        content = content.replace(/border-\[#B45309\]/g, 'border-[#B45309] dark:border-slate-700');
    } else {
        // Clash royale blue card
        content = content.replace(/bg-gradient-to-b from-\[#2563EB\] to-\[#1D4ED8\]/g, 'bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] dark:from-slate-800 dark:to-slate-900');
        content = content.replace(/border-\[#1E3A8A\]/g, 'border-[#1E3A8A] dark:border-slate-700');

        // Welcome screen logo container border
        content = content.replace(/bg-gradient-to-b from-\[#3B82F6\] to-\[#1D4ED8\]/g, 'bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] dark:from-slate-700 dark:to-slate-800');
        content = content.replace(/border-white(?!\s+dark:border)/g, 'border-white dark:border-slate-600');
    }

    fs.writeFileSync(path, content);
    console.log(`Fixed gradient dark mode for ${path}`);
}

fixFile('src/pages/CRProfilePage.tsx', false);
fixFile('src/pages/BSProfilePage.tsx', true);
