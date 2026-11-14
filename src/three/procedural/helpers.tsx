import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from '../../data/types';

/** A cylinder spanning two points. */
export function Tube({ from, to, r = 0.02, material, segments = 10 }: { from: Vec3; to: Vec3; r?: number; material: THREE.Material; segments?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: a.add(b).multiplyScalar(0.5), quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} material={material}>
      <cylinderGeometry args={[r, r, len, segments]} />
    </mesh>
  );
}

let solarTex: THREE.CanvasTexture | null = null;
/** Procedural solar-cell texture (no asset). */
export function getSolarTexture() {
  if (solarTex) return solarTex;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#14214d';
  g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      const shade = 30 + ((x * 7 + y * 13) % 9) * 3;
      g.fillStyle = `rgb(${shade - 8},${shade + 4},${shade + 60})`;
      g.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
    }
  g.strokeStyle = 'rgba(180,190,220,0.35)';
  g.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    g.beginPath();
    g.moveTo(i * 32, 0);
    g.lineTo(i * 32, 256);
    g.moveTo(0, i * 32);
    g.lineTo(256, i * 32);
    g.stroke();
  }
  solarTex = new THREE.CanvasTexture(c);
  solarTex.wrapS = solarTex.wrapT = THREE.RepeatWrapping;
  solarTex.colorSpace = THREE.SRGBColorSpace;
  return solarTex;
}
