import fs from 'fs';

let path = 'src/pages/Login.tsx';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/text-\[\#374151\]/g, 'text-[#374151] dark:text-[#CBD5E1]');

    fs.writeFileSync(path, content);
    console.log('Fixed Login input labels');
}
