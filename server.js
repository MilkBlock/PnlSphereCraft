import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const host = '0.0.0.0';
const port = Number(process.env.PORT || 3001);

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
};

if (!fs.existsSync(distDir)) {
    console.error('Missing dist/ directory.');
    process.exit(1);
}

const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            filePath = path.join(distDir, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(port, host, () => {
    console.log(`Serving ${distDir} at http://${host}:${port}`);
});
