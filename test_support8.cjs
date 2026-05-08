require('dotenv').config();

async function test() {
  const r1 = await fetch('https://proxy.royaleapi.dev/v1/locations/global/rankings/players?limit=1', {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const ranking = await r1.json();
  console.log(ranking);
}
test();
