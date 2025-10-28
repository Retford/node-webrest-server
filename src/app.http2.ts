import fs from 'fs';
import http2 from 'http2';

const server = http2.createSecureServer(
  {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
  },
  (req, res) => {
    console.log(req.url);

    if (req.url === '/') {
      const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(htmlFile);
      return;
    }

    if (req.url === '/css/style.css') {
      const css = fs.readFileSync('./public/css/style.css', 'utf-8');
      res.writeHead(200, { 'content-type': 'text/css' });
      res.end(css);
      return;
    }

    if (req.url === '/js/app.js') {
      const js = fs.readFileSync('./public/js/app.js', 'utf-8');
      res.writeHead(200, { 'content-type': 'application/javascript' });
      res.end(js);
      return;
    }

    res.writeHead(404, { 'content-type': 'text/html' });
    res.end();
  }
);

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
