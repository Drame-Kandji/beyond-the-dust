/**
 * Procedural Apollo 11 Lunar Module "Eagle" descent stage (approximate proportions, 1 unit = 1 m).
 * +x = front (ladder leg), +y = up, ground at y = 0. Octagon 4.2 m across flats, 1.7 m thick,
 * bottom 1.5 m above the ground, footpads 9.4 m apart. EASEP and LRRR are placed closer than in reality.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { Part, XrayOnly } from '../parts';
import { M } from './materials';
import { Tube, getSolarTexture } from './helpers';
import type { Vec3 } from '../../data/types';

const BODY_Y = 2.35; // centre of the octagonal prism (1.5 → 3.2 m)
const OCT_R = 2.1 / Math.cos(Math.PI / 8); // circumradius for 4.2 m across flats
const LEG_ANGLES = [0, Math.PI / 2, Math.PI, -Math.PI / 2]; // +x (ladder), -z, -x, +z
const DIAG = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

// Primary strut, in leg-local coordinates (leg points along +x).
const S_TOP: [number, number] = [2.05, 2.95];
const S_BOT: [number, number] = [4.62, 0.2];
const strutAt = (t: number): [number, number] => [S_TOP[0] + (S_BOT[0] - S_TOP[0]) * t, S_TOP[1] + (S_BOT[1] - S_TOP[1]) * t];
const S_LEN = Math.hypot(S_BOT[0] - S_TOP[0], S_BOT[1] - S_TOP[1]);
const S_N: [number, number] = [(S_TOP[1] - S_BOT[1]) / S_LEN, (S_BOT[0] - S_TOP[0]) / S_LEN]; // outward-up normal
const S_TILT = Math.atan2(S_BOT[0] - S_TOP[0], S_TOP[1] - S_BOT[1]); // rotation.z aligning local +y with the strut

const EASEP_POS: Vec3 = [-2.6, 0, -4.9];
const LRRR_POS: Vec3 = [-2.0, 0, -3.4];

let lrrrTex: THREE.CanvasTexture | null = null;
/** 10 × 10 grid of corner-cube prisms (procedural, no asset). */
function getLrrrTexture() {
  if (lrrrTex) return lrrrTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#9aa0a8';
  g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 10; y++)
    for (let x = 0; x < 10; x++) {
      g.beginPath();
      g.arc(8 + x * 12.4, 8 + y * 12.4, 5, 0, Math.PI * 2);
      g.fillStyle = (x + y) % 3 ? '#1c2533' : '#2c3a52';
      g.fill();
    }
  lrrrTex = new THREE.CanvasTexture(c);
  lrrrTex.colorSpace = THREE.SRGBColorSpace;
  return lrrrTex;
}

function Octagon({ r, h, y, material }: { r: number; h: number; y: number; material: THREE.Material }) {
  return (
    <mesh position={[0, y, 0]} rotation={[0, Math.PI / 8, 0]} material={material}>
      <cylinderGeometry args={[r, r, h, 8]} />
    </mesh>
  );
}

function Footprints() {
  const prints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(5.2, 0, 0.7), new THREE.Vector3(4.6, 0, -2.2), new THREE.Vector3(1.8, 0, -4.4), new THREE.Vector3(-1.4, 0, -4.6)]);
    return Array.from({ length: 22 }, (_, i) => {
      const u = i / 21;
      const p = curve.getPointAt(u);
      const tan = curve.getTangentAt(u);
      const side = i % 2 ? 0.1 : -0.1;
      return { pos: [p.x - tan.z * side, 0.012, p.z + tan.x * side] as Vec3, rot: Math.atan2(tan.x, tan.z) };
    });
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6c6e72', roughness: 1 }), []);
  return (
    <group>
      {prints.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={[0, f.rot, 0]} material={mat} receiveShadow>
          <boxGeometry args={[0.13, 0.01, 0.3]} />
        </mesh>
      ))}
    </group>
  );
}

export function Apollo11LMModel() {
  const solarMat = useMemo(() => new THREE.MeshStandardMaterial({ map: getSolarTexture(), metalness: 0.5, roughness: 0.3 }), []);
  const lrrrMat = useMemo(() => new THREE.MeshStandardMaterial({ map: getLrrrTexture(), metalness: 0.6, roughness: 0.25 }), []);
  const rungs = useMemo(() => Array.from({ length: 9 }, (_, i) => 0.06 + i * 0.092), []);
  const [pqx, pqy] = strutAt(0.45);

  return (
    <group>
      <Part id="descent-stage-body">
        {/* gold-foil octagonal prism */}
        <Octagon r={OCT_R} h={1.7} y={BODY_Y} material={M.goldFoil} />
        <Octagon r={OCT_R + 0.02} h={0.06} y={1.53} material={M.black} />
        <Octagon r={OCT_R + 0.02} h={0.05} y={3.17} material={M.black} />
        {/* bottom heat shield */}
        <Octagon r={OCT_R - 0.05} h={0.04} y={1.49} material={M.darkMetal} />
        {/* black and silver thermal panels on three of the diagonal bays */}
        {DIAG.slice(1).map((a, i) => (
          <group key={a} rotation={[0, a, 0]}>
            <mesh position={[2.115, BODY_Y, 0]} material={i === 1 ? M.aluminium : M.black}>
              <boxGeometry args={[0.03, 1.25, 1.3]} />
            </mesh>
            <mesh position={[2.13, BODY_Y + 0.45, 0]} material={M.gold}>
              <boxGeometry args={[0.02, 0.1, 1.1]} />
            </mesh>
          </group>
        ))}
        {/* crinkled foil strips on the leg faces */}
        {LEG_ANGLES.map((a) => (
          <group key={a} rotation={[0, a, 0]}>
            {[-0.55, 0.55].map((z) => (
              <mesh key={z} position={[2.11, BODY_Y - 0.1, z]} rotation={[0.08 * z, 0, 0]} material={M.gold}>
                <boxGeometry args={[0.02, 1.2, 0.42]} />
              </mesh>
            ))}
          </group>
        ))}
      </Part>

      <Part id="propellant-tanks">
        {/* visible fill / vent caps on the top deck */}
        {LEG_ANGLES.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 1.65, 3.27, -Math.sin(a) * 1.65]} material={M.aluminium}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
          </mesh>
        ))}
        <XrayOnly>
          {DIAG.map((a) => (
            <mesh key={a} position={[Math.cos(a) * 1.2, BODY_Y, -Math.sin(a) * 1.2]} scale={[1, 1.25, 1]} material={M.internal}>
              <sphereGeometry args={[0.6, 20, 14]} />
            </mesh>
          ))}
          {DIAG.map((a) => (
            <Tube key={a} from={[Math.cos(a) * 0.8, 1.75, -Math.sin(a) * 0.8]} to={[0, 1.6, 0]} r={0.03} material={M.internal} />
          ))}
        </XrayOnly>
      </Part>

      <Part id="descent-engine">
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.4, 0.76, 0.95, 28, 1, true]} />
          <meshStandardMaterial color="#4b505a" metalness={0.8} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.darkMetal}>
          <torusGeometry args={[0.76, 0.025, 8, 32]} />
        </mesh>
        <mesh position={[0, 1.42, 0]} material={M.black}>
          <cylinderGeometry args={[0.36, 0.36, 0.06, 20]} />
        </mesh>
      </Part>

      <Part id="landing-legs">
        {LEG_ANGLES.map((a) => {
          const mid = strutAt(0.55);
          return (
            <group key={a} rotation={[0, a, 0]}>
              {/* primary strut (gold-wrapped) */}
              <Tube from={[S_TOP[0], S_TOP[1], 0]} to={[S_BOT[0], S_BOT[1], 0]} r={0.075} material={M.goldFoil} />
              {/* secondary struts and downlock */}
              <Tube from={[2.02, 1.58, 0.95]} to={[mid[0], mid[1], 0]} r={0.035} material={M.aluminium} />
              <Tube from={[2.02, 1.58, -0.95]} to={[mid[0], mid[1], 0]} r={0.035} material={M.aluminium} />
              <Tube from={[2.05, 1.6, 0]} to={[mid[0], mid[1], 0]} r={0.03} material={M.darkMetal} />
              {/* footpad */}
              <mesh position={[4.7, 0.07, 0]} material={M.aluminium}>
                <cylinderGeometry args={[0.47, 0.4, 0.12, 22]} />
              </mesh>
              <mesh position={[4.7, 0.14, 0]} material={M.darkMetal}>
                <sphereGeometry args={[0.1, 12, 8]} />
              </mesh>
            </group>
          );
        })}
      </Part>

      <Part id="contact-probes">
        {LEG_ANGLES.slice(1).map((a) => (
          <group key={a} rotation={[0, a, 0]}>
            {/* bent after touchdown */}
            <Tube from={[4.7, 0.04, 0]} to={[5.3, 0.04, 0.22]} r={0.014} material={M.titanium} />
            <Tube from={[5.3, 0.04, 0.22]} to={[5.75, 0.42, 0.36]} r={0.014} material={M.titanium} />
            <mesh position={[5.75, 0.42, 0.36]} material={M.darkMetal}>
              <sphereGeometry args={[0.03, 8, 6]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="ladder-porch">
        {/* porch on the front of the top deck */}
        <mesh position={[2.42, 3.17, 0]} material={M.aluminium}>
          <boxGeometry args={[0.66, 0.04, 0.82]} />
        </mesh>
        {[0.4, -0.4].map((z) => (
          <group key={z}>
            <Tube from={[2.15, 3.17, z]} to={[2.2, 3.8, z]} r={0.018} material={M.aluminium} />
            <Tube from={[2.2, 3.8, z]} to={[2.72, 3.45, z]} r={0.018} material={M.aluminium} />
            <Tube from={[2.72, 3.45, z]} to={[2.74, 3.17, z]} r={0.018} material={M.aluminium} />
          </group>
        ))}
        {/* ladder rails parallel to the front strut */}
        {[0.24, -0.24].map((z) => {
          const a = strutAt(0);
          const b = strutAt(0.8);
          return (
            <Tube
              key={z}
              from={[a[0] + S_N[0] * 0.13, a[1] + S_N[1] * 0.13, z]}
              to={[b[0] + S_N[0] * 0.13, b[1] + S_N[1] * 0.13, z]}
              r={0.02}
              material={M.aluminium}
            />
          );
        })}
        {rungs.map((t) => {
          const p = strutAt(t);
          return <Tube key={t} from={[p[0] + S_N[0] * 0.13, p[1] + S_N[1] * 0.13, 0.24]} to={[p[0] + S_N[0] * 0.13, p[1] + S_N[1] * 0.13, -0.24]} r={0.016} material={M.aluminium} />;
        })}
      </Part>

      <Part id="plaque">
        <group position={[pqx + S_N[0] * 0.08, pqy + S_N[1] * 0.08, 0]} rotation={[0, 0, S_TILT]}>
          <mesh material={M.aluminium}>
            <boxGeometry args={[0.012, 0.2, 0.24]} />
          </mesh>
          <mesh position={[-0.004, 0, 0]} material={M.black}>
            <boxGeometry args={[0.012, 0.22, 0.26]} />
          </mesh>
          {/* the two hemispheres, in relief */}
          {[-0.05, 0.05].map((z) => (
            <mesh key={z} position={[0.008, 0.04, z]} rotation={[0, 0, Math.PI / 2]} material={M.titanium}>
              <cylinderGeometry args={[0.035, 0.035, 0.004, 16]} />
            </mesh>
          ))}
        </group>
      </Part>

      <Part id="equipment-bay">
        <group rotation={[0, DIAG[0], 0]}>
          {/* MESA frame in the bay */}
          <mesh position={[2.12, 2.55, 0]} material={M.aluminium}>
            <boxGeometry args={[0.06, 0.85, 1.15]} />
          </mesh>
          {/* lowered tray, hinged at the bottom */}
          <group position={[2.16, 1.75, 0]} rotation={[0, 0, -0.55]}>
            <mesh position={[0.42, 0, 0]} material={M.aluminium}>
              <boxGeometry args={[0.84, 0.035, 1.0]} />
            </mesh>
            {[-0.3, 0.05, 0.32].map((z, i) => (
              <mesh key={z} position={[0.3 + i * 0.14, 0.1, z]} material={i === 1 ? M.white : M.offWhite}>
                <boxGeometry args={[0.26, 0.16, 0.22]} />
              </mesh>
            ))}
            {/* TV camera */}
            <group position={[0.75, 0.1, 0.1]}>
              <mesh material={M.black}>
                <boxGeometry args={[0.18, 0.12, 0.14]} />
              </mesh>
              <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.lens}>
                <cylinderGeometry args={[0.035, 0.04, 0.06, 14]} />
              </mesh>
            </group>
          </group>
          <Tube from={[2.14, 2.95, 0.5]} to={[2.85, 1.42, 0.5]} r={0.008} material={M.darkMetal} />
          <Tube from={[2.14, 2.95, -0.5]} to={[2.85, 1.42, -0.5]} r={0.008} material={M.darkMetal} />
        </group>
      </Part>

      <Part id="ascent-stage-launchpad">
        <Octagon r={OCT_R - 0.08} h={0.05} y={3.22} material={M.darkMetal} />
        {/* engine-scorched centre where the ascent engine fired */}
        <mesh position={[0, 3.255, 0]} material={M.black}>
          <cylinderGeometry args={[1.0, 1.0, 0.015, 28]} />
        </mesh>
        {/* four interstage fittings that held the ascent stage */}
        {DIAG.map((a) => (
          <group key={a} position={[Math.cos(a) * 1.4, 3.3, -Math.sin(a) * 1.4]} rotation={[0, a, 0]}>
            <mesh material={M.aluminium}>
              <boxGeometry args={[0.2, 0.12, 0.16]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={M.darkMetal}>
              <cylinderGeometry args={[0.035, 0.035, 0.06, 8]} />
            </mesh>
          </group>
        ))}
      </Part>

      <Part id="easep-seismometer">
        <group position={EASEP_POS} rotation={[0, 0.25, 0]}>
          {/* thermal shroud skirt on the ground */}
          <mesh position={[0, 0.01, 0]} material={M.goldFoil}>
            <cylinderGeometry args={[0.55, 0.6, 0.02, 20]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} material={M.aluminium}>
            <boxGeometry args={[0.45, 0.42, 0.4]} />
          </mesh>
          <mesh position={[0, 0.5, 0]} material={M.goldFoil}>
            <cylinderGeometry args={[0.16, 0.2, 0.12, 16]} />
          </mesh>
          {/* two solar panels, tilted toward the Sun */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.62, 0.42, 0]} rotation={[0, 0, s * 0.35]}>
              <mesh material={solarMat}>
                <boxGeometry args={[0.8, 0.025, 0.55]} />
              </mesh>
              <mesh position={[0, -0.016, 0]} material={M.solarFrame}>
                <boxGeometry args={[0.82, 0.01, 0.57]} />
              </mesh>
              <Tube from={[-s * 0.1, -0.02, 0]} to={[-s * 0.1, -0.4, 0]} r={0.015} material={M.darkMetal} />
            </group>
          ))}
          {/* antenna */}
          <Tube from={[0.12, 0.46, -0.12]} to={[0.12, 1.0, -0.12]} r={0.01} material={M.darkMetal} />
        </group>
      </Part>

      <Part id="laser-retroreflector">
        <group position={LRRR_POS} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 0.06, 0]} material={M.aluminium}>
            <boxGeometry args={[0.55, 0.1, 0.45]} />
          </mesh>
          {/* array tilted toward Earth */}
          <group position={[0, 0.32, 0]} rotation={[-0.75, 0, 0]}>
            <mesh material={lrrrMat}>
              <boxGeometry args={[0.46, 0.04, 0.46]} />
            </mesh>
            <mesh position={[0, -0.03, 0]} material={M.aluminium}>
              <boxGeometry args={[0.5, 0.02, 0.5]} />
            </mesh>
          </group>
          <Tube from={[-0.18, 0.1, -0.05]} to={[-0.18, 0.4, 0.1]} r={0.014} material={M.darkMetal} />
          <Tube from={[0.18, 0.1, -0.05]} to={[0.18, 0.4, 0.1]} r={0.014} material={M.darkMetal} />
        </group>
      </Part>

      <Footprints />
    </group>
  );
}
