const fetchPlayer = async () => {
   const res = await fetch('https://api.brawlapi.com/v1/player/2UJCLVCG98');
   const text = await res.text();
   console.log("brawlapi.com:", text.substring(0, 100));
}
fetchPlayer();
