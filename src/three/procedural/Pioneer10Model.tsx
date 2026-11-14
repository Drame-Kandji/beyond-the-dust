/** Procedural Pioneer 10 (approximate proportions, 1 unit = 1 m). Dish opens toward +z. */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Part, XrayOnly } from '../parts';
import { M } from './materials';
import { Tube } from './helpers';
import type { Vec3 } from '../../data/types';

const R = 1.37; // dish radius (2.74 m diameter)
const DEPTH = 0.46;
const F = (R * R) / (4 * DEPTH); // focal length
const dishZ = (r: number) => (r * r) / (4 * F);

const polar = (deg: number, r: number, z = -0.2): Vec3 => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r, z];

function Dish() {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const r = (i / 24) * R;
      pts.push(new THREE.Vector2(r, dishZ(r)));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const ribs = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#efece4" metalness={0.15} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {ribs.map((a) => (
        <Tube key={a} from={[Math.cos(a) * 0.25, dishZ(0.25) - 0.01, Math.sin(a) * 0.25]} to={[Math.cos(a) * R, dishZ(R) - 0.01, Math.sin(a) * R]} r={0.008} material={M.aluminium} />
      ))}
    </group>
  );
}

function RTGBoom({ deg }: { deg: number }) {
  const fins = [0, 60, 120, 180, 240, 300];
  return (
    <group>
      <Tube from={polar(deg, 0.42)} to={polar(deg, 3.0)} r={0.025} material={M.aluminium} />
      <Tube from={polar(deg + 6, 0.42)} to={polar(deg, 1.8)} r={0.012} material={M.aluminium} />
      {[2.05, 2.75].map((r) => {
        const p = polar(deg, r);
        return (
          <group key={r} position={p} rotation={[0, 0, ((deg - 90) * Math.PI) / 180]}>
            <mesh material={M.rtg}>
              <cylinderGeometry args={[0.1, 0.1, 0.55, 16]} />
            </mesh>
            {fins.map((f) => (
              <mesh key={f} rotation={[0, (f * Math.PI) / 180, 0]} position={[0, 0, 0]} material={M.rtgFins}>
                <boxGeometry args={[0.36, 0.5, 0.012]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export function Pioneer10Model() {
  return (
    <group>
      <Part id="high-gain-antenna">
        <Dish />
        {/* feed tripod */}
        {[90, 210, 330].map((d) => {
          const a = (d * Math.PI) / 180;
          return <Tube key={d} from={[Math.cos(a) * 0.9, Math.sin(a) * 0.9, dishZ(0.9)]} to={[0, 0, F - 0.05]} r={0.012} material={M.aluminium} />;
        })}
        <mesh position={[0, 0, F]} rotation={[Math.PI / 2, 0, 0]} material={M.offWhite}>
          <cylinderGeometry args={[0.08, 0.12, 0.18, 16]} />
        </mesh>
      </Part>

      <Part id="main-body">
        <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]} material={M.goldFoil}>
          <cylinderGeometry args={[0.42, 0.42, 0.36, 6]} />
        </mesh>
        <mesh position={[0, 0, -0.41]} rotation={[Math.PI / 2, 0, 0]} material={M.black}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 6]} />
        </mesh>
        <XrayOnly>
          <mesh position={[0.08, 0.05, -0.22]} material={M.internal}>
            <boxGeometry args={[0.32, 0.18, 0.2]} />
          </mesh>
          <mesh position={[-0.14, -0.12, -0.22]} material={M.internal}>
            <boxGeometry args={[0.16, 0.14, 0.18]} />
          </mesh>
        </XrayOnly>
      </Part>

      <Part id="rtg">
        <RTGBoom deg={210} />
        <RTGBoom deg={330} />
      </Part>

      <Part id="magnetometer-boom">
        <Tube from={polar(90, 0.42)} to={polar(90, 6.6)} r={0.012} material={M.aluminium} />
        <mesh position={polar(90, 6.6)} material={M.white}>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 14]} />
        </mesh>
      </Part>

      <Part id="imaging-photopolarimeter">
        <mesh position={[0.5, -0.15, -0.32]} material={M.white}>
          <boxGeometry args={[0.16, 0.14, 0.18]} />
        </mesh>
        <mesh position={[0.59, -0.15, -0.32]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        </mesh>
      </Part>

      <Part id="particle-detectors">
        <mesh position={[-0.5, -0.22, -0.32]} material={M.darkMetal}>
          <boxGeometry args={[0.16, 0.12, 0.16]} />
        </mesh>
        <mesh position={[-0.42, 0.28, -0.32]} rotation={[0, 0, 0.6]} material={M.white}>
          <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
        </mesh>
        <mesh position={[-0.6, -0.22, -0.32]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 12]} />
        </mesh>
      </Part>

      <Part id="meteoroid-detectors">
        {[20, 65, 110, 155, 200, 245, 290, 335].map((d) => {
          const a = (d * Math.PI) / 180;
          const r = 0.95;
          return (
            <mesh key={d} position={[Math.cos(a) * r, Math.sin(a) * r, dishZ(r) - 0.06]} rotation={[0, 0, a]} material={M.aluminium}>
              <boxGeometry args={[0.3, 0.16, 0.01]} />
            </mesh>
          );
        })}
      </Part>

      <Part id="plaque">
        <Tube from={[0.3, 0.3, -0.05]} to={[0.42, 0.62, -0.05]} r={0.01} material={M.aluminium} />
        <mesh position={[0.45, 0.55, -0.12]} rotation={[0, 0.6, 0.3]} material={M.gold}>
          <boxGeometry args={[0.15, 0.23, 0.006]} />
        </mesh>
      </Part>

      <Part id="thrusters">
        {[160, 340].map((d) => {
          const a = (d * Math.PI) / 180;
          return (
            <group key={d} position={[Math.cos(a) * (R - 0.05), Math.sin(a) * (R - 0.05), dishZ(R) - 0.04]}>
              {[-0.06, 0.06].map((o) => (
                <mesh key={o} position={[0, o, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
                  <cylinderGeometry args={[0.02, 0.035, 0.08, 10]} />
                </mesh>
              ))}
            </group>
          );
        })}
      </Part>
    </group>
  );
}
