require('dotenv').config();

async function test() {
  const r2 = await fetch(`https://proxy.royaleapi.dev/v1/players/%23RUV9URPJR`, {
    headers: { Authorization: "Bearer " + process.env.CLASH_ROYALE_API_KEY }
  });
  const data = await r2.json();
  console.log("supportCards:", data.supportCards);
}
test();
