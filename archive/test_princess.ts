import fetch from "node-fetch";

async function test() {
  try {
    const tpRes = await fetch("http://127.0.0.1:3000/api/clash-royale/top-player");
    const tpData = await tpRes.json();
    const cleanTag = tpData.tag?.replace(/^#/, "");
    const tpProfileRes = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${cleanTag}`);
    const tpProfile = await tpProfileRes.json();
    const b = tpProfile.badges.filter((x: any) => x.name.includes('MasteryPrincess') || x.name === 'MasteryGoblinCurse');
    console.log(JSON.stringify(b, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
