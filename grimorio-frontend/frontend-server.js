const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 5500;

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const arquivo = path.resolve(root, url === '/' ? 'index.html' : `.${url}`);

    if (arquivo !== root && !arquivo.startsWith(`${root}${path.sep}`)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(arquivo, (erro, conteudo) => {
      if (erro) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream' });
      res.end(conteudo);
    });
  })
  .listen(port, () => {
    console.log(`Grimorio frontend rodando em http://localhost:${port}`);
  });
