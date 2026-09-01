import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

// Import API handlers
import leadsHandler from './api/leads.js';
import adminLoginHandler from './api/admin-login.js';
import updateLeadHandler from './api/update-lead.js';
import statsHandler from './api/stats.js';
import chatHandler from './api/chat.js';

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Augment res with JSON helper
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  // Helper to parse JSON body for API routes
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;

      try {
        if (pathname === '/api/leads') {
          return await leadsHandler(req, res);
        } else if (pathname === '/api/admin-login') {
          return await adminLoginHandler(req, res);
        } else if (pathname === '/api/update-lead') {
          return await updateLeadHandler(req, res);
        } else if (pathname === '/api/stats') {
          return await statsHandler(req, res);
        } else if (pathname === '/api/chat') {
          return await chatHandler(req, res);
        } else {
          return res.status(404).json({ success: false, error: 'API route not found' });
        }
      } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(process.cwd(), pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(process.cwd(), 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`DASTAVEZ MITRA local dev server running on http://localhost:${PORT}`);
});
