#!/usr/bin/env node
/**
 * Exports the procedural 3D models as glTF files for the "See it in your room" AR viewer.
 *
 *   npm run ar-models                 # all machines
 *   npm run ar-models -- curiosity lrv
 *
 * How: starts a Vite dev server (same config as the app), opens scripts/ar-export/entry.tsx in
 * headless Chrome/Chromium (WebGL via SwiftShader), which mounts every procedural model and sends
 * a binary glTF back. Each file is then optimised with glTF-Transform (dedup, flatten, join, weld,
 * prune) and written to public/models/ar/<id>.glb — 1 unit = 1 m, +y up, sitting on y = 0.
 *
 * The AR viewer uses public/models/<id>.glb (team model) first when it exists, else this file.
 * Browser: set CHROME_PATH if Chrome/Chromium is not found automatically.
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { Logger, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, flatten, join as joinMeshes, prune, weld } from '@gltf-transform/functions';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, 'public/models/ar');
const ALL = ['apollo11lm', 'lrv', 'sojourner', 'opportunity', 'curiosity', 'pioneer10']; // perseverance: AR uses its real models/perseverance.glb
const ids = process.argv.slice(2).filter((a) => ALL.includes(a));
const wanted = ids.length ? ids : ALL;

function findChrome() {
  const c = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return c.find((p) => existsSync(p));
}

const readBody = (req) =>
  new Promise((ok, ko) => {
    const chunks = [];
    req.on('data', (d) => chunks.push(d));
    req.on('end', () => ok(Buffer.concat(chunks)));
    req.on('error', ko);
  });

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
async function optimise(buf) {
  const doc = await io.readBinary(new Uint8Array(buf));
  doc.setLogger(new Logger(Logger.Verbosity.WARN));
  doc.getRoot().getAsset().generator = 'Beyond the Dust · export-ar-models';
  await doc.transform(dedup(), flatten(), joinMeshes(), weld(), dedup(), prune());
  return io.writeBinary(doc);
}

const chrome = findChrome();
if (!chrome) {
  console.error('Chrome/Chromium not found. Set CHROME_PATH=/path/to/chrome and retry.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

let finish;
const finished = new Promise((r) => (finish = r));
const errors = [];
const pending = [];

const server = await createServer({
  root: ROOT,
  configFile: join(ROOT, 'vite.config.ts'),
  logLevel: 'warn',
  server: { port: 0, strictPort: false, hmr: false, open: false },
  plugins: [
    {
      name: 'ar-export',
      configureServer(s) {
        s.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url, 'http://x');
          if (!url.pathname.startsWith('/__ar-export')) return next();
          const action = url.pathname.split('/')[2] || '';
          if (req.method === 'GET' && action === '') {
            const html = await s.transformIndexHtml(
              req.url,
              '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="/scripts/ar-export/entry.tsx"></script></body></html>',
            );
            res.setHeader('Content-Type', 'text/html');
            return res.end(html);
          }
          const body = await readBody(req);
          const id = url.searchParams.get('id');
          if (action === 'save') {
            pending.push(
              optimise(body)
                .then((glb) => {
                  writeFileSync(join(OUT, `${id}.glb`), glb);
                  console.log(`  ${id.padEnd(12)} ${(glb.byteLength / 1024).toFixed(0).padStart(5)} kB   (raw ${(body.length / 1024).toFixed(0)} kB, size ${url.searchParams.get('size')} m)`);
                })
                .catch((e) => errors.push(`${id}: ${e.stack || e}`)),
            );
          } else if (action === 'error') {
            errors.push(`${id}: ${body.toString()}`);
          } else if (action === 'done') {
            finish();
          }
          res.end('ok');
        });
      },
    },
  ],
});
await server.listen();
const port = server.httpServer.address().port;
const pageUrl = `http://localhost:${port}/__ar-export/?ids=${wanted.join(',')}`;
console.log(`Exporting ${wanted.join(', ')} → public/models/ar/`);

const profile = mkdtempSync(join(tmpdir(), 'btd-ar-'));
const browser = spawn(
  chrome,
  ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-first-run', '--no-default-browser-check', '--disable-extensions', `--user-data-dir=${profile}`, pageUrl],
  { stdio: 'ignore' },
);
const timeout = setTimeout(() => {
  errors.push('Timed out after 180 s');
  finish();
}, 180_000);

await finished;
clearTimeout(timeout);
await Promise.all(pending);
browser.kill();
await server.close();
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* ignore */
}
if (errors.length) {
  console.error('\nErrors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('Done.');
process.exit(0);
