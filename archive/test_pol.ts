import fetch from "node-fetch";

async function test() {
  try {
    const apiKey = process.env.CLASH_ROYALE_API_KEY;
    const r = await fetch(`https://proxy.royaleapi.dev/v1/locations/global/pathoflegend/players?limit=1`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const d = await r.json();
    console.log(JSON.stringify(d, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
