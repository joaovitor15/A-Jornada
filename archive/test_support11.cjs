require('dotenv').config();

async function test() {
  const r1 = await fetch(`https://proxy.royaleapi.dev/v1/locations/global/rankings/clans?limit=1`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const data = await r1.json();
  const tag = data.items[0].tag.replace('#', '%23');

  const r2 = await fetch(`https://proxy.royaleapi.dev/v1/clans/${tag}`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const clan = await r2.json();
  const playerTag = clan.memberList[0].tag.replace('#', '%23');
  
  const r3 = await fetch(`https://proxy.royaleapi.dev/v1/players/${playerTag}`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const player = await r3.json();
  console.log("supportCards exists?", !!player.supportCards);
  if (player.supportCards) console.log(player.supportCards);
}
test();
