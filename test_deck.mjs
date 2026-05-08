import fetch from 'node-fetch';

async function run() {
  const r = await fetch('http://localhost:3000/api/clash-royale/player/PVRJJG0V');
  if (!r.ok) {
     console.log(r.status);
     console.log(await r.text());
     return;
  }
  const data = await r.json();
  console.log(JSON.stringify(data.currentDeck, null, 2));
}
run();
