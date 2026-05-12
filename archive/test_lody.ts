import fetch from "node-fetch";

async function test() {
  try {
    const apiKey = process.env.CLASH_ROYALE_API_KEY;
    const cleanTag = "PVRJJG0V";
    const r = await fetch(`https://proxy.royaleapi.dev/v1/players/%23${cleanTag}`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const d = await r.json();
    const badges = d.badges?.filter((b: any) => b.name.startsWith("Mastery")) || [];
    console.log("Badges:", badges.length);
  } catch(e) {
    console.error(e);
  }
}
test();
