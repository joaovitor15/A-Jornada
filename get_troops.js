const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch('http://127.0.0.1:3000/api/clash-royale/cards')
  .then(r=>r.json())
  .then(d => {
    const list = d.items || [];
    console.log(list.filter(c => c.name.includes("Tower") || c.name.includes("Dagger") || c.name.includes("Cannoneer") || c.name.includes("Baby Goblin")).map(c => c.name));
  });
