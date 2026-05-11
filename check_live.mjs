import https from 'https';

https.get('https://a-jornada.onrender.com/manifest.webmanifest', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
