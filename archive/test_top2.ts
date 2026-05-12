import fetch from "node-fetch";

async function test() {
  try {
    const tpRes = await fetch("http://127.0.0.1:3000/api/clash-royale/top-player");
    console.log(tpRes.status);
    console.log(await tpRes.text());
  } catch(e) {
    console.error(e);
  }
}
test();
