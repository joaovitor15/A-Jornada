import fs from 'fs';

let path = 'src/pages/Cards.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf-8');

  content = content.replace(/text-black/g, 'text-black dark:text-white');

  fs.writeFileSync(path, content);
  console.log(`Done text-black!`);
}
