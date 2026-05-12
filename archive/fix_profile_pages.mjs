import fs from 'fs';

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Fix cards and blocks that don't have dark mode
    let lines = content.split('\n');
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Ensure "ESTATÍSTICAS ROYALE" blocks and others get dark mode background
        // Match bg-white without dark:bg for cards typically.
        // Wait, just match bg-white and add dark:bg-slate-800 if not present
        if (line.includes('bg-white') && !line.includes('dark:bg-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/bg-white/g, 'bg-white dark:bg-[#1E293B]');
            changed = true;
        }

        // Fix background of container
        if (line.includes('bg-slate-50') && !line.includes('dark:bg-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/50');
            changed = true;
        }
        
        // Text colors slate-600, slate-700, slate-800 that need dark equivalents
        if (line.includes('text-[#0F172A]') && !line.includes('dark:text-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/text-\[#0F172A\]/g, 'text-[#0F172A] dark:text-white');
            changed = true;
        }
        
        // specifically text-slate-800
        if (line.includes('text-slate-800') && !line.includes('dark:text-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-200');
            changed = true;
        }
        
        if (line.includes('text-[#64748B]') && !line.includes('dark:text-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/text-\[#64748B\]/g, 'text-[#64748B] dark:text-[#94A3B8]');
            changed = true;
        }
        
        // fix border-slate-100 without dark mode
        if (line.includes('border-slate-100') && !line.includes('dark:border-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/border-slate-100/g, 'border-slate-100 dark:border-[#334155]');
            changed = true;
        }
        
        if (line.includes('border-slate-200') && !line.includes('dark:border-') && !line.includes('//') && !line.includes('/*')) {
            lines[i] = line.replace(/border-slate-200/g, 'border-slate-200 dark:border-[#334155]');
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(path, lines.join('\n'));
        console.log(`Fixed ${path}`);
    }
}

fixFile('src/pages/CRProfilePage.tsx');
fixFile('src/pages/BSProfilePage.tsx');
