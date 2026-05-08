import https from 'https';

const apiKey = process.env.CLASH_ROYALE_API_KEY;

const options = {
  hostname: 'proxy.royaleapi.dev',
  port: 443,
  path: '/v1/cards',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.end();
