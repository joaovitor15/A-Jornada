import dotenv from "dotenv";
dotenv.config();
const tag = '2UJCLVCG98';
fetch('https://api.brawlstars.com/v1/players/%23' + tag, {
  headers: {
    "Authorization": "Bearer " + process.env.BRAWL_STARS_API_KEY,
    "Accept": "application/json"
  }
}).then(r => r.json()).then(console.log).catch(console.error);
