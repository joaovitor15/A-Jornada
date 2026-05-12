const test = async () => {
    const r1 = await fetch('http://127.0.0.1:3000/api/clash-royale/top-player');
    const topPlayer = await r1.json();
    // Maybe get top 3 players
    // Wait, let's just use tag of top player
    const tag = topPlayer.tag.replace('#', '');
    const r2 = await fetch(`http://127.0.0.1:3000/api/clash-royale/player/${tag}`); 
    const data = await r2.json();
    console.log(JSON.stringify(data.currentDeck, null, 2));
}
test();
