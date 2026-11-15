#!/usr/bin/env node
/**
 * Converts SolidWorks STL exports (one .stl per part) into one compressed web model.
 *
 *   npm run model -- <id> <folder-with-stl-files> [--scale 0.001] [--zup] [--rotate 90]
 *
 *   <id>      apollo11lm | sojourner | curiosity | lrv | opportunity | pioneer10
 *   folder    e.g. models-src/curiosity   (file names become part names: wheel_left.stl → "wheel_left")
 *   --scale   force a unit factor (default: auto: millimetres are detected and converted to metres)
 *   --zup     the model was drawn with Z up (rotate so that Y is up)
 *   --rotate  turn the model around the vertical axis (degrees) so its front faces +X
 *
 * Output: public/models/<id>.glb (centred, sitting on the ground, Draco-compressed), then a part-mapping report.
 */
import { readFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression, ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, dedup, prune, draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const [id, src] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--zup'));
if (!id || !src) {
  console.error('Usage: npm run model -- <id> <folder-with-stl-files> [--scale 0.001] [--zup] [--rotate 90]');
  process.exit(1);
}
const files = statSync(src).isDirectory()
  ? readdirSync(src).filter((f) => extname(f).toLowerCase() === '.stl').map((f) => join(src, f))
  : [src];
if (!files.length) {
  console.error(`No .stl file found in ${src}`);
  process.exit(1);
}

// 1. Load every STL as a geometry named after its file.
const loader = new STLLoader();
const parts = files.map((f) => {
  const buf = readFileSync(f);
  const geo = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const name = basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return { name, geo };
});

// 2. Orientation, units, centring.
const box = new THREE.Box3();
const m = new THREE.Matrix4();
if (args.includes('--zup')) m.premultiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
if (opt('--rotate')) m.premultiply(new THREE.Matrix4().makeRotationY((Number(opt('--rotate')) * Math.PI) / 180));
parts.forEach((p) => {
  p.geo.applyMatrix4(m);
  p.geo.computeBoundingBox();
  box.union(p.geo.boundingBox);
});
const size = box.getSize(new THREE.Vector3());
const biggest = Math.max(size.x, size.y, size.z);
const scale = opt('--scale') ? Number(opt('--scale')) : biggest > 30 ? 0.001 : 1; // > 30 units → millimetres
const centre = box.getCenter(new THREE.Vector3());
const fix = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(new THREE.Matrix4().makeTranslation(-centre.x, -box.min.y, -centre.z));
parts.forEach((p) => {
  p.geo.applyMatrix4(fix);
  p.geo.computeVertexNormals();
});

// 3. Materials guessed from names (can be tuned later in Blender if wanted).
const look = (n) =>
  /solar|panel|cell|petal/.test(n) ? [0.1, 0.16, 0.37, 0.6, 0.3]
  : /gold|foil|mli|blanket/.test(n) ? [0.8, 0.6, 0.23, 1, 0.35]
  : /wheel|tire|tyre|roue/.test(n) ? [0.55, 0.57, 0.6, 0.85, 0.45]
  : /lens|camera|cam/.test(n) ? [0.08, 0.1, 0.14, 0.3, 0.1]
  : /rtg|mmrtg|engine|nozzle|motor/.test(n) ? [0.33, 0.35, 0.39, 0.8, 0.45]
  : [0.82, 0.82, 0.8, 0.35, 0.55];

// 4. Build the glTF document: one node per part.
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene(id);
const root = doc.createNode(id);
scene.addChild(root);
for (const p of parts) {
  const pos = p.geo.getAttribute('position');
  const nor = p.geo.getAttribute('normal');
  const [r, g, b, metal, rough] = look(p.name);
  const mat = doc.createMaterial(p.name).setBaseColorFactor([r, g, b, 1]).setMetallicFactor(metal).setRoughnessFactor(rough);
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos.array)).setBuffer(buffer))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(nor.array)).setBuffer(buffer))
    .setMaterial(mat);
  root.addChild(doc.createNode(p.name).setMesh(doc.createMesh(p.name).addPrimitive(prim)));
}

// 5. Optimise and compress.
await doc.transform(weld(), dedup(), prune(), draco({ method: 'edgebreaker' }));
const io = new NodeIO()
  .registerExtensions([...ALL_EXTENSIONS, KHRDracoMeshCompression])
  .registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule() });
mkdirSync('public/models', { recursive: true });
const out = `public/models/${id}.glb`;
await io.write(out, doc);
const mb = statSync(out).size / 1024 / 1024;
console.log(`\n✓ ${out}: ${parts.length} parts, ${(size.x * scale).toFixed(2)} × ${(size.y * scale).toFixed(2)} × ${(size.z * scale).toFixed(2)} m, ${mb.toFixed(2)} MB${mb > 5 ? '  ⚠️ over 5 MB: export the STL with a coarser resolution' : ''}`);
if (scale !== 1) console.log(`  (units converted ×${scale})`);
execFileSync('node', ['scripts/inspect-glb.mjs', out, id], { stdio: 'inherit' });
