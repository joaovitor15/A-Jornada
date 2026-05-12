import fetch from "node-fetch";

async function test() {
  try {
    const cardsRes = await fetch("http://127.0.0.1:3000/api/clash-royale/cards");
    const cardsData = await cardsRes.json();
    const allCards = cardsData.items || [];
    console.log(allCards.map((c: any) => `${c.name}: maxLvl ${c.maxLevel}`).slice(100).join('\n'));
  } catch(e) {
    console.error(e);
  }
}
test();
