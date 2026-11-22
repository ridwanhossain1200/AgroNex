import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function serverlessApiPlugin(): Plugin {
  return {
    name: 'serverless-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/chat')) {
          return next();
        }

        const resHelper = res as any;
        if (!resHelper.status) {
          resHelper.status = function(code: number) {
            resHelper.statusCode = code;
            return resHelper;
          };
        }
        if (!resHelper.json) {
          resHelper.json = function(data: any) {
            resHelper.setHeader('Content-Type', 'application/json');
            resHelper.end(JSON.stringify(data));
            return resHelper;
          };
        }

        try {
          const chatModule = await import('./api/chat.ts');
          const handler = chatModule.default;

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                (req as any).body = body ? JSON.parse(body) : {};
              } catch {
                (req as any).body = {};
              }
              await handler(req as any, resHelper);
            });
          } else {
            await handler(req as any, resHelper);
          }
        } catch (err: any) {
          console.error('[AgroNex Dev Server] API Error:', err);
          resHelper.status(500).json({ success: false, error: err.message });
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serverlessApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
