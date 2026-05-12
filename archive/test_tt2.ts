import fetch from "node-fetch";

async function test() {
  try {
    const cardsRes = await fetch("http://127.0.0.1:3000/api/clash-royale/cards");
    const cardsData = await cardsRes.json();
    const allCards = cardsData.items || [];
    
    console.log(allCards.filter(c => ['Rune Giant', 'Berserker', 'Boss Bandit', 'Spirit Empress', 'Vines', 'Goblinstein', 'Suspicious Bush', 'Goblin Machine', 'Goblin Demolisher'].includes(c.name)).map(c => `${c.name} (${c.id})`));
  } catch(e) {
    console.error(e);
  }
}
test();
