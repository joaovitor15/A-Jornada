require('dotenv').config();

async function test() {
  const r1 = await fetch(`https://proxy.royaleapi.dev/v1/clans/%232G0P8Y9`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const clan = await r1.json();
  const tag = clan.memberList[0].tag.replace('#', '%23');

  const r2 = await fetch(`https://proxy.royaleapi.dev/v1/players/${tag}`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const data = await r2.json();
  console.log("tag", tag);
  console.log("Keys:", Object.keys(data));
  console.log("supportCards exists?", !!data.supportCards);
  if (data.supportCards) console.log(data.supportCards.slice(0,2));
}
test();
