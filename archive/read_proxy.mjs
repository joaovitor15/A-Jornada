import https from 'https';

https.get('https://proxy.royaleapi.dev/', res => {
  res.on('data', d => process.stdout.write(d));
});
