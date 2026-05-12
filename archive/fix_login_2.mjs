import fs from 'fs';

let path = 'src/pages/Login.tsx';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/dark:hover:text-white dark:text-white/g, 'dark:hover:text-white');

    fs.writeFileSync(path, content);
}
