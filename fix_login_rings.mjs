import fs from 'fs';

let path = 'src/pages/Login.tsx';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/focus:ring-blue-50(?![\/\w-])/g, 'focus:ring-blue-50 dark:focus:ring-blue-900/30');

    fs.writeFileSync(path, content);
    console.log('Fixed Login input rings');
}
