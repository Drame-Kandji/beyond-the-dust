/** Procedural Opportunity rover (approximate proportions, 1 unit = 1 m, +x = front). */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Part, XrayOnly } from '../parts';
import { M } from './materials';
import { Tube, getSolarTexture } from './helpers';
import type { Vec3 } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';

const WHEELS: Vec3[] = [0.5, 0, -0.5].flatMap((x) => [
  [x, 0.125, 0.6] as Vec3,
  [x, 0.125, -0.6] as Vec3,
]);

function Wheel({ position }: { position: Vec3 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && useAppStore.getState().spin) ref.current.rotation.y -= dt * 9;
  });
  const cleats = useMemo(() => Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2), []);
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={ref}>
        <mesh material={M.aluminium}>
          <cylinderGeometry args={[0.125, 0.125, 0.16, 24]} />
        </mesh>
        {cleats.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.126, 0, Math.sin(a) * 0.126]} rotation={[0, -a, 0]} material={M.darkMetal}>
            <boxGeometry args={[0.008, 0.16, 0.012]} />
          </mesh>
        ))}
        <mesh position={[0, Math.sign(position[2]) * 0.082, 0]} material={M.darkMetal}>
          <cylinderGeometry args={[0.07, 0.07, 0.01, 6]} />
        </mesh>
      </group>
    </group>
  );
}

function SolarPanel({ position, size }: { position: Vec3; size: [number, number] }) {
  const mat = useMemo(() => {
    const tex = getSolarTexture().clone();
    tex.repeat.set(size[0] * 3, size[1] * 3);
    tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.3, emissive: '#0a1640', emissiveIntensity: 0.2 });
  }, [size]);
  return (
    <group position={position}>
      <mesh material={mat}>
        <boxGeometry args={[size[0], 0.022, size[1]]} />
      </mesh>
      <mesh position={[0, -0.016, 0]} material={M.solarFrame}>
        <boxGeometry args={[size[0] + 0.02, 0.01, size[1] + 0.02]} />
      </mesh>
    </group>
  );
}

export function OpportunityModel() {
  return (
    <group>
      <Part id="wheels">
        {WHEELS.map((p) => (
          <Wheel key={p.join()} position={p} />
        ))}
      </Part>

      <Part id="suspension">
        {[1, -1].map((s) => (
          <group key={s}>
            <Tube from={[0.05, 0.44, s * 0.52]} to={[0.5, 0.25, s * 0.6]} r={0.018} material={M.aluminium} />
            <Tube from={[0.05, 0.44, s * 0.52]} to={[-0.25, 0.32, s * 0.6]} r={0.018} material={M.aluminium} />
            <Tube from={[-0.25, 0.32, s * 0.6]} to={[0, 0.24, s * 0.6]} r={0.016} material={M.aluminium} />
            <Tube from={[-0.25, 0.32, s * 0.6]} to={[-0.5, 0.24, s * 0.6]} r={0.016} material={M.aluminium} />
            {[0.5, 0, -0.5].map((x) => (
              <Tube key={x} from={[x, 0.26, s * 0.6]} to={[x, 0.15, s * 0.6]} r={0.014} material={M.darkMetal} />
            ))}
            <mesh position={[0.05, 0.44, s * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
              <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="body">
        <mesh position={[0, 0.55, 0]} material={M.offWhite}>
          <boxGeometry args={[1.05, 0.3, 0.72]} />
        </mesh>
        <mesh position={[0, 0.405, 0]} material={M.goldFoil}>
          <boxGeometry args={[1.0, 0.02, 0.66]} />
        </mesh>
        <XrayOnly>
          <mesh position={[-0.2, 0.55, 0.12]} material={M.internal}>
            <boxGeometry args={[0.35, 0.16, 0.22]} />
          </mesh>
          <mesh position={[0.2, 0.55, -0.12]} material={M.internal}>
            <boxGeometry args={[0.3, 0.14, 0.26]} />
          </mesh>
        </XrayOnly>
      </Part>

      <Part id="solar-panels">
        <SolarPanel position={[0, 0.72, 0]} size={[1.12, 0.74]} />
        <SolarPanel position={[-0.1, 0.735, 0.76]} size={[0.92, 0.76]} />
        <SolarPanel position={[-0.1, 0.735, -0.76]} size={[0.92, 0.76]} />
        <SolarPanel position={[-0.86, 0.73, 0]} size={[0.6, 1.0]} />
      </Part>

      <Part id="pancam-mast">
        <Tube from={[0.42, 0.74, 0.28]} to={[0.42, 1.38, 0.28]} r={0.03} material={M.white} />
        <mesh position={[0.44, 1.45, 0.28]} material={M.white}>
          <boxGeometry args={[0.12, 0.11, 0.32]} />
        </mesh>
        {[-0.13, -0.05, 0.05, 0.13].map((z, i) => (
          <mesh key={z} position={[0.51, 1.45, 0.28 + z]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
            <cylinderGeometry args={[i === 0 || i === 3 ? 0.022 : 0.016, i === 0 || i === 3 ? 0.022 : 0.016, 0.03, 14]} />
          </mesh>
        ))}
      </Part>

      <Part id="hazcams">
        {[0.58, -0.58].map((x) => (
          <group key={x} position={[x, 0.5, 0]}>
            {[-0.12, 0.12].map((z) => (
              <mesh key={z} position={[0, 0, z]} rotation={[0, 0, (x > 0 ? 1 : -1) * (Math.PI / 2 + 0.35)]} material={M.lens}>
                <cylinderGeometry args={[0.018, 0.018, 0.04, 12]} />
              </mesh>
            ))}
            <mesh material={M.black}>
              <boxGeometry args={[0.03, 0.05, 0.34]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="high-gain-antenna">
        <Tube from={[-0.15, 0.74, -0.28]} to={[-0.15, 0.92, -0.28]} r={0.025} material={M.darkMetal} />
        <mesh position={[-0.15, 0.97, -0.28]} rotation={[0.6, 0, 0.5]} material={M.white}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 28]} />
        </mesh>
      </Part>

      <Part id="uhf-antenna">
        <Tube from={[-0.42, 0.74, 0.3]} to={[-0.42, 1.1, 0.3]} r={0.008} material={M.darkMetal} />
        <mesh position={[-0.42, 1.11, 0.3]} material={M.white}>
          <sphereGeometry args={[0.016, 10, 10]} />
        </mesh>
      </Part>

      <Part id="robotic-arm">
        <mesh position={[0.56, 0.5, 0.05]} material={M.darkMetal}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
        <Tube from={[0.56, 0.5, 0.05]} to={[0.86, 0.6, 0.05]} r={0.022} material={M.white} />
        <mesh position={[0.86, 0.6, 0.05]} material={M.darkMetal}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
        <Tube from={[0.86, 0.6, 0.05]} to={[1.12, 0.42, 0]} r={0.02} material={M.white} />
        <mesh position={[1.14, 0.36, 0]} material={M.darkMetal}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
        </mesh>
      </Part>

      <Part id="rat">
        <mesh position={[1.2, 0.28, 0.1]} material={M.orange}>
          <cylinderGeometry args={[0.035, 0.035, 0.09, 16]} />
        </mesh>
        <mesh position={[1.2, 0.225, 0.1]} material={M.darkMetal}>
          <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
        </mesh>
      </Part>

      <Part id="spectrometers">
        <mesh position={[1.12, 0.42, -0.12]} rotation={[0.6, 0, 0]} material={M.goldFoil}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 14]} />
        </mesh>
        <mesh position={[1.05, 0.3, -0.09]} material={M.white}>
          <cylinderGeometry args={[0.028, 0.028, 0.07, 14]} />
        </mesh>
      </Part>

      <Part id="microscopic-imager">
        <mesh position={[1.25, 0.4, 0.02]} rotation={[0, 0, Math.PI / 2]} material={M.darkMetal}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 14]} />
        </mesh>
        <mesh position={[1.295, 0.4, 0.02]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 14]} />
        </mesh>
      </Part>
    </group>
  );
}
