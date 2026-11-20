import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware() {
  const setupMiddleware = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      if (!parsedUrl.pathname.startsWith('/api/')) {
        return next();
      }

      const routeName = parsedUrl.pathname.replace(/^\/api\/?/, '').split('?')[0];
      let handlerFile = null;
      if (routeName === 'admin') handlerFile = './api/admin.js';
      else if (routeName === 'content') handlerFile = './api/content.js';
      else if (routeName === 'enquiry') handlerFile = './api/enquiry.js';

      if (!handlerFile) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'API route not found' }));
      }

      try {
        // Parse query params into req.query
        req.query = Object.fromEntries(parsedUrl.searchParams.entries());

        // Read body if method has payload
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const rawBody = Buffer.concat(chunks).toString('utf-8');
          try {
            req.body = JSON.parse(rawBody);
          } catch {
            req.body = rawBody;
          }
        } else {
          req.body = {};
        }

        // Polyfill status & json helpers matching Vercel serverless interface
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify(data));
          return res;
        };

        const mod = await import(/* @vite-ignore */ `${handlerFile}?t=${Date.now()}`);
        await mod.default(req, res);
      } catch (err) {
        console.error('[API Dev Middleware Error]:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message || 'Internal Server Error' }));
        }
      }
    });
  };

  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      setupMiddleware(server);
    },
    configurePreviewServer(server) {
      setupMiddleware(server);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), apiDevMiddleware()],
    server: {
      port: 3000,
      open: false,
    },
  };
});
