async function test() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/clash-royale/cards');
    const data = await res.json();
    console.log(JSON.stringify(data.items[0], null, 2));
    // Let's find one with both heroMedium and evolutionMedium
    const both = data.items.find(c => c.iconUrls && c.iconUrls.heroMedium && c.iconUrls.evolutionMedium);
    console.log("Card with both:", JSON.stringify(both, null, 2));
  } catch (e) {
    console.log(e);
  }
}
test();
