const tag = '2UJCLVCG98';
fetch('https://api.brawlapi.com/v1/players/%23' + tag).then(r => r.text()).then(t => console.log(t.substring(0, 100))).catch(console.error);
