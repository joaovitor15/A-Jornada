const test = async () => {
  const r1 = await fetch('http://127.0.0.1:3000/api/clash-royale/top-player');
  const topPlayer = await r1.json();
  const tag = topPlayer.tag.replace('#', '');
  const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
  const data = await r2.json();
  const cards = data.cards.filter(c => c.name === "Knight" || c.name === "Musketeer");
  console.log(JSON.stringify(cards, null, 2));
}
test();
