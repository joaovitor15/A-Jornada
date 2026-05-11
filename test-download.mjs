import https from 'https';

https.get('https://a-jornada.onrender.com/icon-192.png', (res) => {
  console.log('Status Code:', res.statusCode);
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Size:', buffer.length);
    if (buffer.length >= 8) {
        console.log('Hex:', buffer.subarray(0, 8).toString('hex'));
    }
  });
}).on('error', (e) => {
  console.error('Error:', e);
});
