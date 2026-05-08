require('dotenv').config();

async function test() {
  const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/cards`);
  const data = await r2.json();
  const res = {};
  data.items.forEach(c => {
    if (!res[c.rarity]) res[c.rarity] = new Set();
    res[c.rarity].add(c.maxLevel);
  });
  for (const r in res) console.log(r, [...res[r]]);
}
test();
