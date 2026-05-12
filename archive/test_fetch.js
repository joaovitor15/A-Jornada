const fs = require('fs');

async function test() {
  const result = await fetch('http://localhost:3000/api/clash-royale/cards'); // Note: not sure if the dev server runs an Express app or just proxy. I'll mock one.
  const data = await result.json();
  console.log(JSON.stringify(data.items[0], null, 2));
}
test();
