import fs from 'fs';

const files = [
  'public/icon-192.png',
  'public/icon-512.png',
  'public/screenshot-desktop.png',
  'public/screenshot-mobile.png'
];

files.forEach(f => {
  try {
    const stats = fs.statSync(f);
    console.log(`${f}: ${stats.size} bytes`);
  } catch(e) {
    console.log(`${f}: not found or error ${e.message}`);
  }
});
