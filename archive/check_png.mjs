import fs from 'fs';

const files = ['public/icon-192.png', 'public/icon-512.png', 'public/screenshot-desktop.png', 'public/screenshot-mobile.png'];

files.forEach(f => {
  try {
    const buffer = fs.readFileSync(f);
    const hex = buffer.subarray(0, 8).toString('hex');
    console.log(`${f}: ${hex} (size: ${buffer.length})`);
  } catch(e) {
    console.log(`Error reading ${f}: ${e.message}`);
  }
});

