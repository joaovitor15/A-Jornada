import dotenv from "dotenv";
dotenv.config();
const tag = '2UJCLVCG98';
fetch('https://bsproxy.royaleapi.dev/v1/players/%23' + tag, {
  headers: {
    "Authorization": "Bearer " + process.env.BRAWL_STARS_API_KEY,
    "Accept": "application/json"
  }
}).then(r => r.json()).then(d => console.log(d.brawlers[0])).catch(console.error);
