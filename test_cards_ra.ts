import fetch from "node-fetch";

async function test() {
  const apiKey = process.env.CLASH_ROYALE_API_KEY;
  const res = await fetch('https://proxy.royaleapi.dev/v1/cards', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const data = await res.json();
  console.log(data.items[0]);
}
test();
