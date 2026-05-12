import https from 'https';

const urls = [
  'https://a-jornada.onrender.com/icon-192.png',
  'https://a-jornada.onrender.com/icon-512.png',
  'https://a-jornada.onrender.com/screenshot-desktop.png',
  'https://a-jornada.onrender.com/screenshot-mobile.png',
];

urls.forEach(urlStr => {
  https.get(urlStr, (res) => {
    console.log(`${urlStr} => ${res.statusCode} Content-Type: ${res.headers['content-type']} Content-Length: ${res.headers['content-length']}`);
  });
});
