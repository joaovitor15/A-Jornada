import dotenv from "dotenv";
dotenv.config();
fetch('https://bsproxy.royaleapi.dev/v1/brawlers', {
  headers: {
    "Authorization": "Bearer " + process.env.BRAWL_STARS_API_KEY,
    "Accept": "application/json"
  }
}).then(r => r.json()).then(d => {
  if(d.items && d.items.length > 0) console.log(d.items[0]);
  else console.log(d);
}).catch(console.error);
