/**
 * Browser side of `npm run ar-models` (see scripts/export-ar-models.mjs).
 * Mounts each procedural model in a hidden R3F canvas (no animation frames), strips X-ray-only
 * internals, puts it on the ground (bounding box bottom at y = 0, centred in x/z) and sends a
 * binary glTF back to the dev server, which optimises and saves it in public/models/ar/<id>.glb.
 */
import { useEffect, useRef, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { LRVModel } from '../../src/three/procedural/LRVModel';
import { OpportunityModel } from '../../src/three/procedural/OpportunityModel';
import { Pioneer10Model } from '../../src/three/procedural/Pioneer10Model';
import { Apollo11LMModel } from '../../src/three/procedural/Apollo11LMModel';
import { SojournerModel } from '../../src/three/procedural/SojournerModel';
import { CuriosityModel } from '../../src/three/procedural/CuriosityModel';

const MODELS: Record<string, ComponentType> = {
  apollo11lm: Apollo11LMModel,
  lrv: LRVModel,
  sojourner: SojournerModel,
  opportunity: OpportunityModel,
  curiosity: CuriosityModel,
  pioneer10: Pioneer10Model,
};

const wanted = (new URLSearchParams(location.search).get('ids') || Object.keys(MODELS).join(',')).split(',').filter((id) => id in MODELS);

const post = (path: string, body: BodyInit) => fetch(`/__ar-export/${path}`, { method: 'POST', body });

function isXrayOnly(o: THREE.Object3D) {
  if (o.userData.xrayOnly) return true;
  const m = (o as THREE.Mesh).material;
  const list = Array.isArray(m) ? m : m ? [m] : [];
  return list.length > 0 && list.every((mm) => (mm as THREE.Material).userData?.xrayOnly);
}

async function exportModel(id: string, group: THREE.Group) {
  const root = group.clone(true);
  const drop: THREE.Object3D[] = [];
  root.traverse((o) => {
    if (o !== root && (isXrayOnly(o) || !o.visible)) drop.push(o);
  });
  drop.forEach((o) => o.removeFromParent());
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const c = box.getCenter(new THREE.Vector3());
  root.position.set(-c.x, -box.min.y, -c.z);
  const out = new THREE.Group();
  out.name = id;
  out.add(root);
  const size = box.getSize(new THREE.Vector3());
  const glb = (await new GLTFExporter().parseAsync(out, { binary: true, onlyVisible: true, maxTextureSize: 1024 })) as ArrayBuffer;
  await post(`save?id=${id}&size=${[size.x, size.y, size.z].map((v) => v.toFixed(2)).join('x')}`, glb);
}

function Capture({ id, Model, onDone }: { id: string; Model: ComponentType; onDone: () => void }) {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    // Child effects (XrayOnly flags, Part registration) have run; leave a short margin.
    const t = window.setTimeout(() => {
      exportModel(id, ref.current!)
        .catch((err) => post(`error?id=${id}`, String(err?.stack || err)))
        .finally(onDone);
    }, 400);
    return () => window.clearTimeout(t);
  }, [id, onDone]);
  return (
    <group ref={ref}>
      <Model />
    </group>
  );
}

const host = document.getElementById('root')!;
const root = createRoot(host);
let i = 0;
function next() {
  const id = wanted[i++];
  if (!id) {
    root.unmount();
    void post('done', String(wanted.length));
    return;
  }
  root.render(
    <Canvas key={id} frameloop="never" style={{ width: 256, height: 256 }}>
      <Capture id={id} Model={MODELS[id]} onDone={next} />
    </Canvas>,
  );
}
window.addEventListener('error', (e) => void post('error?id=page', String(e.error?.stack || e.message)));
next();
