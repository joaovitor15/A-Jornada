import fetch from "node-fetch";

async function test() {
  try {
    const cardsRes = await fetch("http://127.0.0.1:3000/api/clash-royale/cards");
    const cardsData = await cardsRes.json();
    const allCards = cardsData.items || [];
    
    const tpRes = await fetch("http://127.0.0.1:3000/api/clash-royale/top-player");
    const tpData = await tpRes.json();
    const tag = tpData.tag?.replace(/^#/, "");
    const tpProfileRes = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`);
    const tpProfile = await tpProfileRes.json();
    
    const masterySet = new Set(tpProfile.badges?.filter((b: any) => b.name.startsWith("Mastery")).map((b: any)=> b.name.replace('Mastery', '')));
    
    // see which cards from allCards don't have a very close match in masteries!
    console.log(allCards.map(c => c.name).join(', '));
  } catch(e) {
    console.error(e);
  }
}
test();
