import fetch from "node-fetch";

async function test() {
  try {
    const cardsRes = await fetch("http://127.0.0.1:3000/api/clash-royale/cards");
    const cardsData = await cardsRes.json();
    const allCards = cardsData.items || [];
    
    console.log(allCards.filter(c => ['Cannoneer', 'Dagger Duchess', 'Tower Princess', 'Baby Goblin'].includes(c.name)).map(c => c.name));
    console.log(allCards.slice(-10).map(c => `${c.name} (${c.id})`));
  } catch(e) {
    console.error(e);
  }
}
test();
