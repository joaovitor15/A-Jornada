const tag = '2UJCLVCG98';
fetch('https://api.brawlapi.com/v1/players/%23' + tag).then(r => r.json()).then(console.log).catch(console.error);
