async function run() {
  const r1 = await fetch("http://127.0.0.1:3000/api/clash-royale/proxy/locations/global/pathoflegend/players");
  const data = await r1.json();
  const tags = data.items.slice(0, 5).map(i => i.tag.replace("#", ""));
  for (const tag of tags) {
     const p = await (await fetch("http://127.0.0.1:3000/api/clash-royale/player/" + tag)).json();
     console.log("Player:", p.name, "King Level:", p.expLevel);
     p.currentDeck.forEach((c, idx) => {
        if (c.iconUrls?.evolutionMedium) {
           console.log(" Evo Card:", c.name, "at index", idx);
        }
     });
  }
}
run();
