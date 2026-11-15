/**
 * Procedural Sojourner rover + Mars Pathfinder lander (approximate proportions,
 * 1 unit = 1 m, +x = rover front, +y = up, ground y = 0).
 * Rover at the origin (≈ 0.63 × 0.48 × 0.28 m). The lander sits behind it with
 * its three solar petals opened flat and the rear ramp pointing toward the rover.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Part, XrayOnly } from '../parts';
import { M } from './materials';
import { Tube, getSolarTexture } from './helpers';
import type { Vec3 } from '../../data/types';

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
const LOCAL = {
  airbag: std({ color: '#d9cfbd', metalness: 0.05, roughness: 0.9, flatShading: true }),
  laser: std({ color: '#5a1010', metalness: 0.2, roughness: 0.3, emissive: '#ff2a1a', emissiveIntensity: 0.9 }),
  mesh: std({ color: '#8f949c', metalness: 0.8, roughness: 0.5, side: THREE.DoubleSide }),
  tyre: std({ color: '#a7abb2', metalness: 0.9, roughness: 0.35 }),
};

/* ------------------------------- ROVER ---------------------------------- */
const WHEEL_R = 0.065;
const WHEEL_X = [0.25, 0, -0.25];
const WHEEL_Z = 0.205;
const ARM_Z = 0.16;

function Wheel({ position }: { position: Vec3 }) {
  const cleats = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={LOCAL.tyre}>
        <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.07, 22]} />
      </mesh>
      {cleats.map((a) => (
        <mesh key={a} position={[Math.cos(a) * (WHEEL_R + 0.002), 0, Math.sin(a) * (WHEEL_R + 0.002)]} rotation={[0, -a, 0]} material={M.darkMetal}>
          <boxGeometry args={[0.005, 0.07, 0.008]} />
        </mesh>
      ))}
      <mesh position={[0, Math.sign(position[2]) * 0.036, 0]} material={M.darkMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.006, 6]} />
      </mesh>
    </group>
  );
}

function SolarPanel({ position, size }: { position: Vec3; size: [number, number] }) {
  const mat = useMemo(() => {
    const tex = getSolarTexture().clone();
    tex.repeat.set(size[0] * 6, size[1] * 6);
    tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.3, emissive: '#0a1640', emissiveIntensity: 0.2 });
  }, [size]);
  return (
    <group position={position}>
      <mesh material={mat}>
        <boxGeometry args={[size[0], 0.01, size[1]]} />
      </mesh>
      <mesh position={[0, -0.009, 0]} material={M.solarFrame}>
        <boxGeometry args={[size[0] + 0.012, 0.008, size[1] + 0.012]} />
      </mesh>
    </group>
  );
}

function Rover() {
  return (
    <group>
      <Part id="six-wheels">
        {WHEEL_X.flatMap((x) => [1, -1].map((s) => <Wheel key={`${x}${s}`} position={[x, WHEEL_R, s * WHEEL_Z]} />))}
      </Part>

      <Part id="rocker-bogie">
        {[1, -1].map((s) => (
          <group key={s}>
            {/* rocker: front wheel strut → pivot on the body → bogie pivot */}
            <Tube from={[0.25, WHEEL_R, s * ARM_Z]} to={[0.25, 0.17, s * ARM_Z]} r={0.008} material={M.aluminium} />
            <Tube from={[0.25, 0.17, s * ARM_Z]} to={[0.02, 0.2, s * ARM_Z]} r={0.008} material={M.aluminium} />
            <Tube from={[0.02, 0.2, s * ARM_Z]} to={[-0.125, 0.14, s * ARM_Z]} r={0.008} material={M.aluminium} />
            {/* bogie: middle and rear wheels */}
            <Tube from={[-0.125, 0.14, s * ARM_Z]} to={[0, WHEEL_R, s * ARM_Z]} r={0.007} material={M.aluminium} />
            <Tube from={[-0.125, 0.14, s * ARM_Z]} to={[-0.25, WHEEL_R, s * ARM_Z]} r={0.007} material={M.aluminium} />
            {WHEEL_X.map((x) => (
              <Tube key={x} from={[x, WHEEL_R, s * ARM_Z]} to={[x, WHEEL_R, s * (WHEEL_Z - 0.03)]} r={0.006} material={M.darkMetal} />
            ))}
            {[[0.02, 0.2], [-0.125, 0.14]].map(([x, y]) => (
              <mesh key={x} position={[x, y, s * ARM_Z]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
                <cylinderGeometry args={[0.014, 0.014, 0.02, 10]} />
              </mesh>
            ))}
          </group>
        ))}
        {/* differential bar across the body */}
        <Tube from={[0.02, 0.2, -ARM_Z]} to={[0.02, 0.2, ARM_Z]} r={0.005} material={M.darkMetal} />
      </Part>

      <Part id="warm-electronics-box">
        <mesh position={[0, 0.185, 0]} material={M.goldFoil}>
          <boxGeometry args={[0.42, 0.11, 0.28]} />
        </mesh>
        <mesh position={[0, 0.132, 0]} material={M.darkMetal}>
          <boxGeometry args={[0.44, 0.008, 0.3]} />
        </mesh>
        <XrayOnly>
          <mesh position={[-0.05, 0.185, 0.03]} material={M.internal}>
            <boxGeometry args={[0.18, 0.07, 0.14]} />
          </mesh>
          <mesh position={[0.1, 0.185, -0.06]} material={M.internal}>
            <boxGeometry args={[0.1, 0.05, 0.08]} />
          </mesh>
        </XrayOnly>
      </Part>

      <Part id="solar-panel">
        {[[0.16, 0.1], [0.16, -0.1], [-0.16, 0.1], [-0.16, -0.1]].map(([x, z]) => (
          <Tube key={`${x}${z}`} from={[x, 0.24, z]} to={[x, 0.255, z]} r={0.006} material={M.darkMetal} />
        ))}
        <SolarPanel position={[0.0, 0.262, 0]} size={[0.56, 0.37]} />
      </Part>

      <Part id="cameras">
        {/* front stereo pair (black-and-white) */}
        <mesh position={[0.213, 0.205, 0]} material={M.black}>
          <boxGeometry args={[0.012, 0.03, 0.11]} />
        </mesh>
        {[-0.035, 0.035].map((z) => (
          <mesh key={z} position={[0.222, 0.205, z]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
            <cylinderGeometry args={[0.009, 0.009, 0.012, 12]} />
          </mesh>
        ))}
        {/* rear colour camera */}
        <mesh position={[-0.213, 0.2, 0.05]} material={M.black}>
          <boxGeometry args={[0.012, 0.03, 0.035]} />
        </mesh>
        <mesh position={[-0.222, 0.2, 0.05]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.009, 0.009, 0.012, 12]} />
        </mesh>
      </Part>

      <Part id="hazard-lasers">
        <mesh position={[0.214, 0.162, 0]} material={M.darkMetal}>
          <boxGeometry args={[0.012, 0.016, 0.22]} />
        </mesh>
        {[-0.09, -0.045, 0, 0.045, 0.09].map((z) => (
          <mesh key={z} position={[0.222, 0.162, z]} rotation={[0, 0, Math.PI / 2]} material={LOCAL.laser}>
            <cylinderGeometry args={[0.005, 0.005, 0.008, 8]} />
          </mesh>
        ))}
      </Part>

      <Part id="apxs">
        {/* deployment mechanism at the back of the rover */}
        <mesh position={[-0.215, 0.165, -0.04]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
          <cylinderGeometry args={[0.012, 0.012, 0.03, 10]} />
        </mesh>
        <Tube from={[-0.215, 0.165, -0.04]} to={[-0.3, 0.13, -0.04]} r={0.006} material={M.aluminium} />
        <Tube from={[-0.3, 0.13, -0.04]} to={[-0.33, 0.1, -0.04]} r={0.006} material={M.aluminium} />
        <mesh position={[-0.335, 0.075, -0.04]} material={M.white}>
          <cylinderGeometry args={[0.024, 0.024, 0.045, 16]} />
        </mesh>
        <mesh position={[-0.335, 0.05, -0.04]} material={M.goldFoil}>
          <cylinderGeometry args={[0.02, 0.022, 0.008, 16]} />
        </mesh>
      </Part>

      <Part id="uhf-antenna">
        <mesh position={[-0.14, 0.275, 0.12]} material={M.darkMetal}>
          <cylinderGeometry args={[0.01, 0.012, 0.025, 10]} />
        </mesh>
        <Tube from={[-0.14, 0.285, 0.12]} to={[-0.14, 0.58, 0.12]} r={0.003} material={M.darkMetal} segments={6} />
        <mesh position={[-0.14, 0.585, 0.12]} material={M.white}>
          <sphereGeometry args={[0.007, 8, 8]} />
        </mesh>
      </Part>
    </group>
  );
}

/* ------------------------------- LANDER --------------------------------- */
/** Lander centre in world space (behind and to the side of the rover). */
const L: Vec3 = [-1.6, 0, -0.55];
const PETAL_Y = 0.18;
const polar = (r: number, deg: number): [number, number] => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];
/** Centre-triangle corners (where petals hinge) and petal tips, in lander-local x/z. */
const V = [60, 180, 300].map((a) => polar(0.55, a));
const A = [0, 120, 240].map((a) => polar(1.1, a));
/** Petal i: tip A[i] between hinge corners V[i-1] and V[i]. */
const PETALS: [number, number][][] = [
  [V[2], V[0], A[0]],
  [V[0], V[1], A[1]],
  [V[1], V[2], A[2]],
];

function triGeometry(pts: [number, number][], y: number, shrink = 1) {
  const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
  const cz = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
  const p = pts.map(([x, z]) => [cx + (x - cx) * shrink, cz + (z - cz) * shrink]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p.flatMap(([x, z]) => [x, y, z]), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(p.flatMap(([x, z]) => [x * 5, z * 5]), 2));
  g.setIndex([0, 2, 1]);
  g.computeVertexNormals();
  return g;
}

function Petals() {
  const { cells, frames, base, cellMat } = useMemo(() => {
    const tex = getSolarTexture().clone();
    tex.needsUpdate = true;
    return {
      cells: PETALS.map((p) => triGeometry(p, PETAL_Y + 0.004, 0.86)),
      frames: PETALS.map((p) => triGeometry(p, PETAL_Y)),
      base: triGeometry(V as [number, number][], PETAL_Y),
      cellMat: new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.3, emissive: '#0a1640', emissiveIntensity: 0.2, side: THREE.DoubleSide }),
    };
  }, []);
  const frameMat = useMemo(() => {
    const m = M.solarFrame.clone();
    m.side = THREE.DoubleSide;
    return m;
  }, []);
  return (
    <group>
      {frames.map((g, i) => (
        <mesh key={`f${i}`} geometry={g} material={frameMat} />
      ))}
      {cells.map((g, i) => (
        <mesh key={`c${i}`} geometry={g} material={cellMat} />
      ))}
      <mesh geometry={base} material={frameMat} />
      {/* petal thickness (edge rails) */}
      {PETALS.map((p, i) =>
        [0, 1, 2].map((k) => {
          const a = p[k];
          const b = p[(k + 1) % 3];
          return <Tube key={`${i}${k}`} from={[a[0], PETAL_Y - 0.01, a[1]]} to={[b[0], PETAL_Y - 0.01, b[1]]} r={0.014} material={M.aluminium} segments={6} />;
        }),
      )}
      {/* central electronics core (triangular) */}
      <mesh position={[0, 0.28, 0]} rotation={[0, Math.PI / 6, 0]} material={M.goldFoil}>
        <cylinderGeometry args={[0.3, 0.36, 0.2, 3]} />
      </mesh>
      <mesh position={[0, 0.385, 0]} rotation={[0, Math.PI / 6, 0]} material={M.offWhite}>
        <cylinderGeometry args={[0.29, 0.3, 0.012, 3]} />
      </mesh>
      {[[0.05, -0.12], [-0.1, 0.1]].map(([x, z]) => (
        <mesh key={x} position={[x, 0.42, z]} material={M.white}>
          <boxGeometry args={[0.12, 0.06, 0.1]} />
        </mesh>
      ))}
      {/* small high-gain dish and low-gain antenna */}
      <Tube from={[-0.12, 0.39, -0.12]} to={[-0.12, 0.58, -0.12]} r={0.015} material={M.darkMetal} />
      <mesh position={[-0.12, 0.62, -0.12]} rotation={[0.5, 0, 0.6]} material={M.white}>
        <cylinderGeometry args={[0.13, 0.06, 0.03, 24]} />
      </mesh>
      <Tube from={[0.15, 0.39, 0.02]} to={[0.15, 0.7, 0.02]} r={0.008} material={M.darkMetal} />
      {/* weather mast (ASI/MET) on a petal, with three small wind socks */}
      <Tube from={[-0.45, PETAL_Y, 0.65]} to={[-0.45, PETAL_Y + 1.0, 0.65]} r={0.008} material={M.aluminium} />
      {[0.35, 0.65, 0.95].map((h) => (
        <mesh key={h} position={[-0.45, PETAL_Y + h, 0.68]} rotation={[Math.PI / 2, 0, 0]} material={M.orange}>
          <coneGeometry args={[0.012, 0.05, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/** Crumpled, retracted airbag lumps tucked around the petal hinges. */
const AIRBAG_LUMPS = [60, 180, 300].flatMap((deg, i) =>
  [
    [0.62, -12, 0.2, 0.09, 0.16],
    [0.7, 6, 0.18, 0.08, 0.2],
    [0.58, 18, 0.15, 0.1, 0.13],
  ].map(([r, d, sx, sy, sz], k) => {
    const [x, z] = polar(r, deg + d);
    return { key: `${i}${k}`, pos: [x, 0.07, z] as Vec3, scale: [sx, sy, sz] as Vec3, rot: ((deg + d) * Math.PI) / 180 + k };
  }),
);

function Lander() {
  return (
    <group position={L}>
      <Part id="airbags">
        {AIRBAG_LUMPS.map((l) => (
          <mesh key={l.key} position={l.pos} scale={l.scale} rotation={[0.2, l.rot, 0.1]} material={LOCAL.airbag}>
            <icosahedronGeometry args={[1, 1]} />
          </mesh>
        ))}
      </Part>

      <Part id="lander-petals">
        <Petals />
      </Part>

      <Part id="imp-camera">
        <Tube from={[0.05, 0.39, 0.08]} to={[0.05, 1.3, 0.08]} r={0.018} material={M.aluminium} />
        <mesh position={[0.05, 1.3, 0.08]} material={M.darkMetal}>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
        </mesh>
        <mesh position={[0.07, 1.38, 0.08]} material={M.white}>
          <boxGeometry args={[0.11, 0.12, 0.2]} />
        </mesh>
        {[-0.06, 0.06].map((z) => (
          <mesh key={z} position={[0.13, 1.38, 0.08 + z]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
            <cylinderGeometry args={[0.02, 0.02, 0.025, 14]} />
          </mesh>
        ))}
        <mesh position={[0.07, 1.445, 0.08]} material={M.goldFoil}>
          <boxGeometry args={[0.1, 0.01, 0.18]} />
        </mesh>
      </Part>

      <Part id="ramps">
        {/* rear ramp, deployed down to the ground toward the rover (≈ 20°) */}
        {[-0.11, 0.11].map((z) => (
          <Tube key={z} from={[0.62, PETAL_Y + 0.02, z]} to={[1.2, 0.01, z]} r={0.01} material={M.aluminium} segments={6} />
        ))}
        <mesh position={[0.91, PETAL_Y / 2 + 0.015, 0]} rotation={[0, 0, -Math.atan2(PETAL_Y + 0.01, 0.58)]} material={LOCAL.mesh}>
          <boxGeometry args={[0.62, 0.004, 0.22]} />
        </mesh>
        {/* front ramp, still rolled up on its petal */}
        <mesh position={[-0.2, PETAL_Y + 0.03, -0.78]} rotation={[0, Math.PI / 6, Math.PI / 2]} material={LOCAL.mesh}>
          <cylinderGeometry args={[0.03, 0.03, 0.26, 12]} />
        </mesh>
      </Part>
    </group>
  );
}

export function SojournerModel() {
  return (
    <group>
      <Rover />
      <Lander />
    </group>
  );
}
