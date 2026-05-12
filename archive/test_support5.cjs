const fs = require('fs');
const env = fs.readFileSync('.env.example', 'utf8');
const key = env.split('="')[1].split('"')[0];

async function test() {
  const r1 = await fetch('https://proxy.royaleapi.dev/v1/clans/%232G0P8Y9', {
    headers: { Authorization: "Bearer " + key }
  });
  const clan = await r1.json();
  const tag = clan.memberList[0].tag.replace('#', '');
  
  const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
  const data = await r2.json();
  console.log("supportCards:", data.supportCards);
}
test();
