const fs = require('fs');
const env = fs.readFileSync('.env.example', 'utf8');
const key = env.split('="')[1].split('"')[0];

async function test() {
  const r1 = await fetch('https://proxy.royaleapi.dev/v1/locations/global/rankings/players?limit=1', {
    headers: { Authorization: "Bearer " + key }
  });
  const ranking = await r1.json();
  console.log(ranking);
}
test();
