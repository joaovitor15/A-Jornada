const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch('http://127.0.0.1:3000/api/clash-royale/cards')
  .then(r=>r.json())
  .then(d => {
    const list = d.items || [];
    console.log(list.map(c => c.name).join(', '));
  });
