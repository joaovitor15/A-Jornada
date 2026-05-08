async function test() {
  const r2 = await fetch('http://127.0.0.1:3000/api/clash-royale/player/VLCQLP'); 
  const data = await r2.json();
  console.log(data.supportCards);
}
test();
