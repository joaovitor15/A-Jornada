import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Wait a bit to see if error boundary renders
  await page.waitForTimeout(2000);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('PAGE TEXT:', text);
  
  await browser.close();
})();
