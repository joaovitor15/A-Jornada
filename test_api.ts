async function test() {
  const res = await fetch('http://localhost:3000/api/clash-royale/player/VGG2LJ0JL');
  const data = await res.json();
  const cards = data.cards || [];
  const knight = cards.find((c: any) => c.name === 'Knight');
  const babyD = cards.find((c: any) => c.name === 'Baby Dragon');
  const giant = cards.find((c: any) => c.name === 'Giant');
  console.log("Knight:", knight);
  console.log("Baby Dragon:", babyD);
  console.log("Giant:", giant);
}
test();
