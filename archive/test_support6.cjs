const fs = require('fs');
const env = fs.readFileSync('.env.example', 'utf8');
const key = env.split('="')[1].split('"')[0];

async function test() {
  const r1 = await fetch('https://proxy.royaleapi.dev/v1/locations/global/rankings/players?limit=1', {
    headers: { Authorization: "Bearer " + key }
  });
  const ranking = await r1.json();
  const tag = ranking.items[0].tag.replace('#', '');
  
  const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
  const data = await r2.json();
  console.log("supportCards:", data.supportCards);
}
test();
