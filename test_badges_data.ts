import fetch from "node-fetch";

async function test() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/RoyaleAPI/cr-api-data/master/json/badges.json");
    if(res.ok) {
       const data = await res.json();
       console.log(Object.keys(data).slice(0, 10));
       // check mastery badges
       const masteries = Object.keys(data).filter(k => k.startsWith('Mastery'));
       if (masteries.length > 0) {
           console.log("Found masteries:", masteries.length);
           console.log(masteries.slice(0, 5));
           console.log(data[masteries[0]]);
       }
    } else {
       console.log("Fail", res.status);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
