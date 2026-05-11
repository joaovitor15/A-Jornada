const Jimp = require('jimp');

async function testJimp() {
  const images = ['public/icon-192.png', 'public/icon-512.png', 'public/screenshot-desktop.png', 'public/screenshot-mobile.png'];
  for (const img of images) {
    try {
      const j = await Jimp.read(img);
      console.log(`Success: ${img} (${j.bitmap.width}x${j.bitmap.height})`);
    } catch(err) {
      console.error(`Failed ${img}:`, err.message);
    }
  }
}
testJimp();
