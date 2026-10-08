// Petit serveur local pour vérifier le dossier out/ tel que GitHub Pages le servira
// (dossiers avec index.html, redirection vers la barre oblique finale, page 404).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const racine = path.join(process.cwd(), 'out');
const port = Number(process.env.PORT) || 4323;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

http
  .createServer((req, res) => {
    const chemin = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    let fichier = path.join(racine, chemin);
    if (!fichier.startsWith(racine)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(fichier) && fs.statSync(fichier).isDirectory()) {
      if (!chemin.endsWith('/')) {
        res.writeHead(301, { Location: `${chemin}/` });
        return res.end();
      }
      fichier = path.join(fichier, 'index.html');
    }
    if (!fs.existsSync(fichier)) {
      fichier = path.join(racine, '404.html');
      res.statusCode = 404;
    }
    res.setHeader('Content-Type', types[path.extname(fichier)] ?? 'application/octet-stream');
    fs.createReadStream(fichier).pipe(res);
  })
  .listen(port, () => console.log(`Aperçu : http://localhost:${port}/`));
