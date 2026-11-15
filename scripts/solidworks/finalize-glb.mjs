/**
 * Optimise a raw .glb written by build_models.py: weld, simplify (tiny error), dedup, Draco.
 *   node scripts/solidworks/finalize-glb.mjs in.raw.glb public/models/out.glb [error=0.0006]
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, dedup, prune, draco, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

const [input, output, err = '0.0006'] = process.argv.slice(2);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read(input);
await MeshoptSimplifier.ready;
const count = () => doc.getRoot().listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((k, p) => k + (p.getIndices()?.getCount() ?? 0) / 3, 0), 0);
const before = count();
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0, error: Number(err), lockBorder: false }), dedup(), prune());
const after = count();
await doc.transform(draco({ method: 'edgebreaker' }));
await io.write(output, doc);
console.log(`${output}: ${Math.round(before)} -> ${Math.round(after)} triangles`);
