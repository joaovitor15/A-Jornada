import fetch from "node-fetch";

async function test() {
  try {
    const tpRes = await fetch("http://127.0.0.1:3000/api/clash-royale/top-player");
    if (tpRes.ok) {
      const tpData = await tpRes.json();
      const cleanTag = tpData.tag?.replace(/^#/, "");
      console.log("Top player tag:", cleanTag);
      const tpProfileRes = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${cleanTag}`);
      if (tpProfileRes.ok) {
        const tpProfile = await tpProfileRes.json();
        const masteryBadges = tpProfile.badges?.filter((b: any) => b.name.startsWith("Mastery")) || [];
        console.log("Top player masteries:", masteryBadges.length);
      }
    }
  } catch(e) {
    console.error(e);
  }
}
test();
