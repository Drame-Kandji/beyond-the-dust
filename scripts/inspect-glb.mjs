#!/usr/bin/env node
/**
 * Lists the node names of a .glb file and shows which Beyond the Dust part each one maps to.
 * Usage: npm run inspect-glb -- public/models/opportunity.glb [lrv|opportunity|pioneer10]
 * No dependencies: reads the glTF JSON chunk directly.
 */
import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [file, vehicleArg] = process.argv.slice(2);
if (!file) {
  console.error('Usage: npm run inspect-glb -- <file.glb> [lrv|opportunity|pioneer10]');
  process.exit(1);
}
const vehicle = vehicleArg || basename(file).replace(/\.glb$/i, '');
const buf = readFileSync(file);
if (buf.toString('utf8', 0, 4) !== 'glTF') {
  console.error('Not a binary glTF (.glb) file.');
  process.exit(1);
}
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
const sizeMb = (buf.length / 1024 / 1024).toFixed(2);

// Read part ids + meshNames from the TypeScript data file (simple regex, no TS compiler needed).
const here = dirname(fileURLToPath(import.meta.url));
let parts = [];
try {
  const src = readFileSync(join(here, '..', 'src', 'data', 'vehicles', `${vehicle}.ts`), 'utf8');
  const re = /id: '([a-z0-9-]+)',\s*icon: '[^']*',\s*name: t\('([^']*)'[\s\S]*?meshNames: \[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(src))) parts.push({ id: m[1], name: m[2], patterns: [...m[3].matchAll(/'([^']+)'/g)].map((x) => x[1]) });
} catch {
  console.warn(`(no data file for "${vehicle}", showing node names only)`);
}
const match = (name) => {
  const n = name.toLowerCase();
  return parts.find((p) => n === p.id || p.patterns.some((pat) => new RegExp(pat, 'i').test(n)))?.id;
};

console.log(`\n${file}: ${sizeMb} MB ${Number(sizeMb) > 5 ? '⚠️  larger than 5 MB, compress it (gltf-transform optimize --compress draco)' : '✓'}`);
console.log(`Draco: ${(gltf.extensionsUsed || []).includes('KHR_draco_mesh_compression') ? 'yes' : 'no'}\n`);
const nodes = gltf.nodes || [];
const found = new Set();
const walk = (i, depth, inherited) => {
  const n = nodes[i];
  const name = n.name || `(node ${i})`;
  const own = match(name);
  const id = own || inherited;
  if (own) found.add(own);
  console.log(`${'  '.repeat(depth)}${name}${own ? `  →  part "${own}"` : inherited ? '  (inherits)' : ''}`);
  (n.children || []).forEach((c) => walk(c, depth + 1, id));
};
const roots = gltf.scenes?.[gltf.scene || 0]?.nodes || nodes.map((_, i) => i);
roots.forEach((r) => walk(r, 0, undefined));
if (parts.length) {
  const missing = parts.filter((p) => !found.has(p.id));
  console.log(`\nMapped parts: ${found.size}/${parts.length}`);
  if (missing.length) {
    console.log('Missing parts: rename an object so its name contains one of:');
    missing.forEach((p) => console.log(`  • ${p.id} (${p.name}): ${p.patterns.join(', ')}`));
    console.log('Missing parts still work: the app keeps the hotspot and the explanation.');
  }
}
