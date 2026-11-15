/**
 * Procedural Curiosity rover (approximate proportions, 1 unit = 1 m, +x = front, +y = up, +z = rover's right).
 * Real size: ~3 m long, ~2.7 m wide, ~2.2 m tall to the top of the mast (arm not included).
 * Part ids match src/data/vehicles/curiosity.ts.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Part, XrayOnly } from '../parts';
import { M } from './materials';
import { Tube } from './helpers';
import type { Vec3 } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';

const R = 0.25; // wheel radius (≈ 50 cm diameter)
const W = 0.4; // wheel width
const WX = [1.1, 0.25, -0.95]; // front, middle, rear axles
const WZ = 1.05; // wheel centre, lateral
const LZ = 0.8; // suspension legs, lateral
const MAST: Vec3 = [0.82, 0, 0.45];

const led = new THREE.MeshStandardMaterial({ color: '#fff6d8', emissive: '#fff1c0', emissiveIntensity: 1.2, roughness: 0.3 });

function Wheel({ position, damaged = false }: { position: Vec3; damaged?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && useAppStore.getState().spin) ref.current.rotation.y -= dt * 7;
  });
  const grousers = useMemo(() => Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2), []);
  const spokes = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), []);
  const out = Math.sign(position[2]);
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={ref}>
        <mesh material={M.aluminium}>
          <cylinderGeometry args={[R, R, W, 32, 1, true]} />
        </mesh>
        <mesh position={[0, -out * (W / 2 - 0.01), 0]} material={M.darkMetal}>
          <cylinderGeometry args={[R - 0.01, R - 0.01, 0.01, 24]} />
        </mesh>
        {grousers.map((a, i) => (
          <group key={a} position={[Math.cos(a) * (R + 0.006), 0, Math.sin(a) * (R + 0.006)]} rotation={[0, -a, 0]}>
            {/* zig-zag tread: two slanted halves */}
            <mesh position={[0, W / 4, 0]} rotation={[i % 2 ? 0.12 : -0.12, 0, 0]} material={M.darkMetal}>
              <boxGeometry args={[0.012, W / 2, 0.014]} />
            </mesh>
            <mesh position={[0, -W / 4, 0]} rotation={[i % 2 ? -0.12 : 0.12, 0, 0]} material={M.darkMetal}>
              <boxGeometry args={[0.012, W / 2, 0.014]} />
            </mesh>
          </group>
        ))}
        {damaged &&
          [0.4, 1.3, 2.1].map((a, i) => (
            <mesh key={a} position={[Math.cos(a) * (R + 0.002), (i - 1) * 0.09, Math.sin(a) * (R + 0.002)]} rotation={[0, -a, 0]} material={M.black}>
              <boxGeometry args={[0.004, 0.05, 0.04]} />
            </mesh>
          ))}
        {/* curved spokes and hub on the outer face */}
        <mesh position={[0, out * 0.16, 0]} material={M.titanium}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
        </mesh>
        {spokes.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.14, out * 0.13, Math.sin(a) * 0.14]} rotation={[0, -a + 0.35, 0]} material={M.titanium}>
            <boxGeometry args={[0.17, 0.012, 0.02]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Rover body (not a clickable part): fades by itself in X-ray so SAM and CheMin show through. */
function Chassis() {
  const mats = useMemo(() => [M.offWhite.clone(), M.goldFoil.clone(), M.darkMetal.clone()], []);
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const { xray, selectedPart } = useAppStore.getState();
    const target = xray ? 0.18 : selectedPart ? 0.55 : 1;
    const k = Math.min(1, dt * 6);
    for (const m of mats) {
      const tr = target < 0.999 || m.opacity < 0.995;
      if (m.transparent !== tr) {
        m.transparent = tr;
        m.needsUpdate = true;
      }
      m.opacity = THREE.MathUtils.lerp(m.opacity, target, k);
      m.depthWrite = m.opacity > 0.9;
    }
  });
  useEffect(() => {
    group.current?.traverse((o) => {
      o.castShadow = true;
      o.receiveShadow = true;
    });
  }, []);
  const [body, foil, dark] = mats;
  return (
    <group ref={group}>
      <mesh position={[0.05, 0.85, 0]} material={body}>
        <boxGeometry args={[1.9, 0.55, 1.4]} />
      </mesh>
      {/* top deck */}
      <mesh position={[0.05, 1.135, 0]} material={body}>
        <boxGeometry args={[1.96, 0.02, 1.46]} />
      </mesh>
      <mesh position={[0.05, 0.57, 0]} material={foil}>
        <boxGeometry args={[1.86, 0.02, 1.36]} />
      </mesh>
      {/* front and rear Hazcam pairs */}
      {[1.0, -0.9].map((x) => (
        <group key={x} position={[x + Math.sign(x) * 0.02, 0.68, 0]}>
          <mesh material={dark}>
            <boxGeometry args={[0.04, 0.06, 0.62]} />
          </mesh>
          {[-0.27, -0.17, 0.17, 0.27].map((z) => (
            <mesh key={z} position={[Math.sign(x) * 0.025, 0, z]} rotation={[0, 0, Math.sign(x) * (Math.PI / 2 + 0.4)]} material={M.lens}>
              <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* differential bar across the deck */}
      <Tube from={[0.05, 1.18, -0.78]} to={[0.05, 1.18, 0.78]} r={0.025} material={dark} />
    </group>
  );
}

export function CuriosityModel() {
  return (
    <group>
      <Chassis />

      <Part id="six-wheels">
        {WX.flatMap((x) => [1, -1].map((s) => <Wheel key={`${x}${s}`} position={[x, R, s * WZ]} damaged={x === WX[0] && s === -1} />))}
        {/* rocker-bogie: rocker to the rear wheel, bogie carrying front + middle wheels */}
        {[1, -1].map((s) => (
          <group key={s}>
            <mesh position={[0.05, 0.8, s * LZ]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
            </mesh>
            <Tube from={[0.05, 0.8, s * LZ]} to={[-0.95, 0.5, s * LZ]} r={0.035} material={M.titanium} />
            <Tube from={[0.05, 0.8, s * LZ]} to={[0.68, 0.62, s * LZ]} r={0.035} material={M.titanium} />
            <mesh position={[0.68, 0.62, s * LZ]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
              <cylinderGeometry args={[0.05, 0.05, 0.09, 14]} />
            </mesh>
            <Tube from={[0.68, 0.62, s * LZ]} to={[1.1, 0.5, s * LZ]} r={0.03} material={M.titanium} />
            <Tube from={[0.68, 0.62, s * LZ]} to={[0.25, 0.5, s * LZ]} r={0.03} material={M.titanium} />
            {WX.map((x) => (
              <group key={x}>
                <Tube from={[x, 0.52, s * LZ]} to={[x, R, s * LZ]} r={0.03} material={M.darkMetal} />
                <mesh position={[x, R, s * (LZ + 0.04)]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
                  <cylinderGeometry args={[0.05, 0.05, 0.1, 14]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </Part>

      <Part id="mmrtg">
        {[0.18, -0.18].map((z) => (
          <Tube key={z} from={[-0.9, 0.95, z]} to={[-1.12, 1.0, z * 0.6]} r={0.02} material={M.darkMetal} />
        ))}
        <group position={[-1.18, 1.02, 0]} rotation={[0, 0, 0.95]}>
          <mesh material={M.rtg}>
            <cylinderGeometry args={[0.19, 0.19, 0.66, 24]} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2).map((a) => (
            <mesh key={a} position={[Math.cos(a) * 0.26, 0, Math.sin(a) * 0.26]} rotation={[0, -a, 0]} material={M.rtgFins}>
              <boxGeometry args={[0.15, 0.6, 0.012]} />
            </mesh>
          ))}
          {[0.34, -0.34].map((y) => (
            <mesh key={y} position={[0, y, 0]} material={M.darkMetal}>
              <cylinderGeometry args={[0.14, 0.14, 0.03, 20]} />
            </mesh>
          ))}
        </group>
      </Part>

      <Part id="mastcam">
        <Tube from={[MAST[0], 1.14, MAST[2]]} to={[MAST[0], 1.9, MAST[2]]} r={0.05} material={M.white} />
        <mesh position={[MAST[0], 1.88, MAST[2]]} material={M.darkMetal}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        </mesh>
        <mesh position={[0.86, 2.0, MAST[2]]} material={M.white}>
          <boxGeometry args={[0.24, 0.18, 0.46]} />
        </mesh>
        {/* two Mastcams (wide + telephoto), ~24.5 cm apart */}
        {[-0.12, 0.12].map((z, i) => (
          <mesh key={z} position={[1.0, 1.97, MAST[2] + z]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
            <cylinderGeometry args={[i ? 0.03 : 0.022, i ? 0.03 : 0.022, 0.05, 16]} />
          </mesh>
        ))}
        {/* Navcam pairs on the sides of the head */}
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[0.99, 2.04, MAST[2] + z]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
            <cylinderGeometry args={[0.014, 0.014, 0.03, 12]} />
          </mesh>
        ))}
      </Part>

      <Part id="chemcam">
        <mesh position={[0.86, 2.14, MAST[2]]} material={M.offWhite}>
          <boxGeometry args={[0.28, 0.1, 0.2]} />
        </mesh>
        <mesh position={[1.01, 2.14, MAST[2]]} rotation={[0, 0, Math.PI / 2]} material={M.darkMetal}>
          <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
        </mesh>
        <mesh position={[1.03, 2.14, MAST[2]]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.052, 0.052, 0.012, 24]} />
        </mesh>
      </Part>

      <Part id="rems-weather">
        <Tube from={[MAST[0], 1.62, MAST[2]]} to={[MAST[0] + 0.05, 1.62, MAST[2] + 0.28]} r={0.012} material={M.darkMetal} />
        <Tube from={[MAST[0], 1.6, MAST[2]]} to={[MAST[0] - 0.24, 1.6, MAST[2] - 0.12]} r={0.012} material={M.darkMetal} />
        <mesh position={[MAST[0] + 0.05, 1.62, MAST[2] + 0.3]} material={M.white}>
          <boxGeometry args={[0.06, 0.04, 0.06]} />
        </mesh>
        <mesh position={[MAST[0] - 0.26, 1.6, MAST[2] - 0.13]} material={M.white}>
          <boxGeometry args={[0.06, 0.04, 0.06]} />
        </mesh>
      </Part>

      <Part id="robotic-arm">
        <mesh position={[1.02, 0.95, -0.35]} material={M.darkMetal}>
          <boxGeometry args={[0.12, 0.14, 0.14]} />
        </mesh>
        <Tube from={[1.02, 0.95, -0.35]} to={[1.5, 1.2, -0.2]} r={0.045} material={M.white} />
        <mesh position={[1.5, 1.2, -0.2]} material={M.darkMetal}>
          <sphereGeometry args={[0.06, 14, 14]} />
        </mesh>
        <Tube from={[1.5, 1.2, -0.2]} to={[1.76, 0.78, 0.0]} r={0.04} material={M.white} />
        <mesh position={[1.76, 0.75, 0.01]} material={M.darkMetal}>
          <sphereGeometry args={[0.05, 14, 14]} />
        </mesh>
        <mesh position={[1.78, 0.62, 0.02]} material={M.offWhite}>
          <boxGeometry args={[0.18, 0.14, 0.18]} />
        </mesh>
        {/* APXS sensor head */}
        <mesh position={[1.7, 0.48, 0.17]} material={M.goldFoil}>
          <cylinderGeometry args={[0.032, 0.032, 0.12, 14]} />
        </mesh>
        {/* dust brush */}
        <mesh position={[1.9, 0.52, -0.06]} material={M.black}>
          <cylinderGeometry args={[0.02, 0.02, 0.07, 10]} />
        </mesh>
      </Part>

      <Part id="drill">
        <mesh position={[1.8, 0.45, -0.1]} material={M.white}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        </mesh>
        <mesh position={[1.8, 0.31, -0.1]} material={M.aluminium}>
          <cylinderGeometry args={[0.013, 0.008, 0.1, 10]} />
        </mesh>
        {[1, -1].map((d) => (
          <Tube key={d} from={[1.8 + d * 0.05, 0.42, -0.1]} to={[1.8 + d * 0.07, 0.3, -0.1]} r={0.008} material={M.darkMetal} />
        ))}
      </Part>

      <Part id="mahli">
        <mesh position={[1.93, 0.62, 0.13]} material={M.darkMetal}>
          <boxGeometry args={[0.1, 0.08, 0.08]} />
        </mesh>
        <mesh position={[1.99, 0.62, 0.13]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.022, 0.022, 0.02, 14]} />
        </mesh>
        {[-0.028, 0.028].map((z) => (
          <mesh key={z} position={[1.985, 0.655, 0.13 + z]} material={led}>
            <sphereGeometry args={[0.007, 8, 8]} />
          </mesh>
        ))}
      </Part>

      <Part id="sam">
        {/* inlet covers on the deck */}
        {[0.04, 0.18].map((x) => (
          <mesh key={x} position={[x, 1.155, 0.32]} material={M.aluminium}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
          </mesh>
        ))}
        <XrayOnly>
          <mesh position={[0.05, 0.85, 0.32]} material={M.internal}>
            <boxGeometry args={[0.6, 0.4, 0.42]} />
          </mesh>
          <mesh position={[0.15, 0.85, 0.32]} rotation={[Math.PI / 2, 0, 0]} material={M.internal}>
            <cylinderGeometry args={[0.15, 0.15, 0.44, 20]} />
          </mesh>
        </XrayOnly>
      </Part>

      <Part id="chemin">
        <mesh position={[-0.32, 1.155, -0.32]} material={M.aluminium}>
          <boxGeometry args={[0.09, 0.02, 0.09]} />
        </mesh>
        <XrayOnly>
          <mesh position={[-0.32, 0.85, -0.32]} material={M.internal}>
            <boxGeometry args={[0.4, 0.36, 0.36]} />
          </mesh>
        </XrayOnly>
      </Part>

      <Part id="rad">
        <mesh position={[0.38, 1.2, -0.28]} material={M.offWhite}>
          <boxGeometry args={[0.18, 0.11, 0.14]} />
        </mesh>
        <mesh position={[0.38, 1.27, -0.28]} material={M.goldFoil}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        </mesh>
      </Part>

      <Part id="antennas">
        {/* high-gain antenna: flat hexagon on a gimbal */}
        <Tube from={[-0.55, 1.14, -0.5]} to={[-0.55, 1.34, -0.5]} r={0.03} material={M.darkMetal} />
        <mesh position={[-0.55, 1.35, -0.5]} material={M.darkMetal}>
          <sphereGeometry args={[0.045, 12, 12]} />
        </mesh>
        <mesh position={[-0.55, 1.42, -0.5]} rotation={[0.55, 0, 0.45]} material={M.offWhite}>
          <cylinderGeometry args={[0.18, 0.18, 0.035, 6]} />
        </mesh>
        {/* UHF antenna */}
        <mesh position={[-0.75, 1.22, 0.4]} material={M.white}>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 16]} />
        </mesh>
        <mesh position={[-0.75, 1.31, 0.4]} material={M.darkMetal}>
          <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
        </mesh>
      </Part>
    </group>
  );
}
