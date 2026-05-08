import fetch from "node-fetch";

async function test() {
  try {
    const apiKey = process.env.CLASH_ROYALE_API_KEY;
    console.log(apiKey ? "Has key" : "No key");
  } catch(e) {
    console.error(e);
  }
}
test();
