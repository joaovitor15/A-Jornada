async function test() {
  const r1 = await fetch('http://127.0.0.1:3000/api/clash-royale/top-player');
  const topPlayer = await r1.json();
  const tag = topPlayer.tag.replace('#', '');
  const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
  const data = await r2.json();
  console.log("Keys:", Object.keys(data));
  console.log("supportCards:", data.supportCards);
}
test();
