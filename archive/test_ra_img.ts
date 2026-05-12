import fetch from "node-fetch";

async function test() {
  const urlsToTest = [
    'https://cdn.royaleapi.com/static/img/badge/mastery/Knight/1.png',
    'https://cdn.royaleapi.com/static/img/badge/mastery/Knight-1.png',
    'https://cdn.royaleapi.com/static/img/mastery/badge/Knight/1.png',
    'https://cdn.royaleapi.com/static/img/mastery/Knight-1.png',
    'https://cdn.royaleapi.com/static/img/badges/mastery/Knight/1.png',
    'https://cdn.royaleapi.com/static/img/mastery/Knight_1.png',
    'https://cdn.royaleapi.com/static/img/mastery/Knight.png',
    'https://cdn.royaleapi.com/static/img/badges/mastery/Knight.png'
  ];
  for (let url of urlsToTest) {
    try {
        const res = await fetch(url);
        console.log(url, res.status);
    } catch(e) {}
  }
}
test();
