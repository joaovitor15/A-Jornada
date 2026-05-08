const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://html.duckduckgo.com/html/?q=site:docs.royaleapi.com+allowed+ip+address+proxy');
  const texts = await page.evaluate(() => Array.from(document.querySelectorAll('.result__snippet')).map(e => e.innerText));
  console.log("TEST 1", texts);

  await page.goto('https://html.duckduckgo.com/html/?q=royaleapi+proxy+developer.clashroyale.com+IP+address');
  const texts2 = await page.evaluate(() => Array.from(document.querySelectorAll('.result__snippet')).map(e => e.innerText));
  console.log("TEST 2", texts2);
  
  await browser.close();
})();
