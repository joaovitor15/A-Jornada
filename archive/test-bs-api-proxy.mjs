import dotenv from "dotenv";
dotenv.config();
const tag = '2UJCLVCG98';
fetch('https://proxy.royaleapi.dev/brawlstars/v1/players/%23' + tag, {
  headers: {
    "Authorization": "Bearer " + process.env.CLASH_ROYALE_API_KEY,
    "Accept": "application/json"
  }
}).then(r => r.json()).then(console.log).catch(console.error);
