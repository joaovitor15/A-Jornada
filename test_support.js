async function test() {
  const r2 = await fetch('https://proxy.royaleapi.dev/v1/clans/%232G0P8Y9'); 
  const data = await r2.json();
  console.log(data);
}
test();
