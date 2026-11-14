/** Procedural Lunar Roving Vehicle (approximate proportions, 1 unit = 1 m, +x = front). */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Part } from '../parts';
import { M } from './materials';
import { Tube } from './helpers';
import type { Vec3 } from '../../data/types';

const WHEELS: Vec3[] = [
  [1.15, 0.41, 0.9],
  [1.15, 0.41, -0.9],
  [-1.15, 0.41, 0.9],
  [-1.15, 0.41, -0.9],
];

function MeshWheel({ position }: { position: Vec3 }) {
  const chevrons = useMemo(() => Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2), []);
  const side = position[2] > 0 ? 1 : -1;
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* woven wire tyre */}
      <mesh material={M.steelMesh}>
        <cylinderGeometry args={[0.41, 0.41, 0.23, 28, 1, true]} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.405, 0.405, 0.225, 28, 4, true]} />
        <meshStandardMaterial color="#6f757e" wireframe metalness={0.9} roughness={0.4} />
      </mesh>
      {/* titanium chevrons */}
      {chevrons.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.415, 0, Math.sin(a) * 0.415]} rotation={[0, -a, 0]} material={M.titanium}>
          <boxGeometry args={[0.012, 0.2, 0.05]} />
        </mesh>
      ))}
      {/* rim disc */}
      <mesh position={[0, side * 0.1, 0]} material={M.aluminium}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
      </mesh>
    </group>
  );
}

export function LRVModel() {
  return (
    <group>
      <Part id="wheels">
        {WHEELS.map((p) => (
          <MeshWheel key={p.join()} position={p} />
        ))}
      </Part>

      <Part id="motors">
        {WHEELS.map((p) => (
          <mesh key={p.join()} position={[p[0], p[1], p[2] - Math.sign(p[2]) * 0.17]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
            <cylinderGeometry args={[0.1, 0.1, 0.16, 16]} />
          </mesh>
        ))}
      </Part>

      <Part id="frame">
        {/* main chassis platform in three hinged sections */}
        {[-0.95, 0, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.62, 0]} material={M.aluminium}>
            <boxGeometry args={[0.9, 0.05, 1.08]} />
          </mesh>
        ))}
        {[0.56, -0.56].map((z) => (
          <Tube key={z} from={[-1.55, 0.62, z]} to={[1.55, 0.62, z]} r={0.03} material={M.aluminium} />
        ))}
        {/* suspension arms to the wheels */}
        {WHEELS.map((p) => (
          <group key={p.join()}>
            <Tube from={[p[0] - Math.sign(p[0]) * 0.35, 0.6, Math.sign(p[2]) * 0.5]} to={[p[0], p[1], p[2] - Math.sign(p[2]) * 0.24]} r={0.025} material={M.darkMetal} />
            <Tube from={[p[0] + Math.sign(p[0]) * 0.15, 0.6, Math.sign(p[2]) * 0.5]} to={[p[0], p[1], p[2] - Math.sign(p[2]) * 0.24]} r={0.02} material={M.darkMetal} />
            {/* fender */}
            <mesh position={[p[0], p[1], p[2]]} rotation={[Math.PI / 2, 0, 0]} material={M.offWhite}>
              <cylinderGeometry args={[0.47, 0.47, 0.28, 20, 1, true, Math.PI * 0.62, Math.PI * 0.76]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="seats">
        {[0.36, -0.36].map((z) => (
          <group key={z} position={[-0.15, 0, z]}>
            <mesh position={[0, 0.78, 0]} material={M.seat}>
              <boxGeometry args={[0.46, 0.04, 0.44]} />
            </mesh>
            <mesh position={[-0.25, 1.05, 0]} rotation={[0, 0, -0.18]} material={M.seat}>
              <boxGeometry args={[0.04, 0.52, 0.44]} />
            </mesh>
            <Tube from={[0.22, 0.78, 0.22]} to={[-0.3, 1.3, 0.22]} r={0.012} material={M.aluminium} />
            <Tube from={[0.22, 0.78, -0.22]} to={[-0.3, 1.3, -0.22]} r={0.012} material={M.aluminium} />
            {/* footrest */}
            <mesh position={[0.48, 0.68, 0]} rotation={[0, 0, 0.35]} material={M.aluminium}>
              <boxGeometry args={[0.22, 0.02, 0.36]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="controller">
        <mesh position={[0.25, 0.82, 0]} material={M.darkMetal}>
          <boxGeometry args={[0.14, 0.32, 0.14]} />
        </mesh>
        <Tube from={[0.25, 0.98, 0]} to={[0.27, 1.13, 0]} r={0.015} material={M.black} />
        <Tube from={[0.27, 1.13, -0.07]} to={[0.27, 1.13, 0.07]} r={0.018} material={M.black} />
      </Part>

      <Part id="navigation">
        <mesh position={[0.62, 1.08, 0]} rotation={[0, 0, 0.5]} material={M.black}>
          <boxGeometry args={[0.08, 0.3, 0.5]} />
        </mesh>
        {[-0.14, 0, 0.14].map((z) => (
          <mesh key={z} position={[0.575, 1.11, z]} rotation={[0, 0, Math.PI / 2 + 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
            <meshStandardMaterial color="#1b1f26" emissive="#ffb547" emissiveIntensity={0.35} />
          </mesh>
        ))}
        <Tube from={[0.62, 0.64, 0]} to={[0.62, 0.95, 0]} r={0.02} material={M.aluminium} />
      </Part>

      <Part id="batteries">
        {[0.18, -0.18].map((z) => (
          <mesh key={z} position={[1.25, 0.8, z]} material={M.offWhite}>
            <boxGeometry args={[0.3, 0.22, 0.26]} />
          </mesh>
        ))}
        <mesh position={[1.25, 0.93, 0]} material={M.goldFoil}>
          <boxGeometry args={[0.32, 0.03, 0.62]} />
        </mesh>
      </Part>

      <Part id="tv-camera">
        <Tube from={[1.5, 0.66, 0.25]} to={[1.5, 1.18, 0.25]} r={0.02} material={M.aluminium} />
        <mesh position={[1.54, 1.25, 0.25]} material={M.white}>
          <boxGeometry args={[0.2, 0.14, 0.13]} />
        </mesh>
        <mesh position={[1.67, 1.25, 0.25]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.045, 0.05, 0.08, 18]} />
        </mesh>
      </Part>

      <Part id="antenna">
        {/* relay unit + mast */}
        <mesh position={[1.35, 0.98, -0.3]} material={M.white}>
          <boxGeometry args={[0.22, 0.3, 0.2]} />
        </mesh>
        <Tube from={[1.35, 1.1, -0.3]} to={[1.35, 1.72, -0.3]} r={0.018} material={M.aluminium} />
        {/* umbrella dish tilted toward Earth */}
        <group position={[1.35, 1.82, -0.3]} rotation={[0.35, 0, -0.35]}>
          <mesh material={M.steelMesh}>
            <coneGeometry args={[0.46, 0.17, 24, 1, true]} />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.455, 0.165, 24, 1, true]} />
            <meshStandardMaterial color="#e6e2d8" metalness={0.2} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <Tube from={[0, -0.08, 0]} to={[0, 0.25, 0]} r={0.01} material={M.darkMetal} />
        </group>
        {/* low-gain helix antenna */}
        <Tube from={[1.45, 1.1, -0.05]} to={[1.45, 1.55, -0.05]} r={0.012} material={M.darkMetal} />
      </Part>

      <Part id="cargo">
        <mesh position={[-1.38, 0.82, 0]} material={M.aluminium}>
          <boxGeometry args={[0.42, 0.34, 0.9]} />
        </mesh>
        {[-0.3, -0.05, 0.22].map((z, i) => (
          <Tube key={z} from={[-1.42, 0.98, z]} to={[-1.5, 1.55 - i * 0.08, z + 0.04]} r={0.012} material={M.titanium} />
        ))}
        <mesh position={[-1.5, 1.6, -0.26]} material={M.titanium}>
          <boxGeometry args={[0.04, 0.06, 0.14]} />
        </mesh>
        {[0.32, 0.18].map((z) => (
          <mesh key={z} position={[-1.28, 1.05, z]} material={M.white}>
            <boxGeometry args={[0.14, 0.12, 0.1]} />
          </mesh>
        ))}
      </Part>
    </group>
  );
}
