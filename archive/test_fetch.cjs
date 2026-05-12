const test = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/clash-royale/cards');
    const data = await res.json();
    console.log("FIRST:", JSON.stringify(data.items.slice(0,1), null, 2));
    
    const hasHero = data.items.filter(c => c.iconUrls && c.iconUrls.heroMedium);
    console.log("HERO CARDS:", hasHero.map(c => ({ name: c.name, evolutionLevel: c.evolutionLevel, el: c.evolutionLevel, keys: Object.keys(c) })));
  } catch (e) {
    console.log(e);
  }
}
test();
