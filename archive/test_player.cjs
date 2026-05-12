const test = async () => {
  try {
    const r1 = await fetch('http://127.0.0.1:3000/api/clash-royale/top-player');
    const topPlayer = await r1.json();
    const tag = topPlayer.tag.replace('#', '');
    const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
    const data = await r2.json();
    console.log("Top player badges:");
    const badges = data.badges.filter(b => b.name.startsWith('Mastery')).slice(0, 5);
    console.log(JSON.stringify(badges, null, 2));
  } catch (e) {
    console.log(e);
  }
}
test();
