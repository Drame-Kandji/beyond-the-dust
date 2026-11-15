/**
 * 3D version of the hub map: a small, stylised Solar System (not to scale) you can turn.
 * Click / tap the Moon, Mars or the end of Pioneer 10's path to choose a destination.
 * Loaded lazily; the flat SVG map (SolarMap) is the fallback.
 */
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { DestinationId } from '../../data/types';
import { DESTINATIONS } from '../../data';
import { useT } from '../../i18n/useT';
import { useAppStore } from '../../store/useAppStore';

const R_EARTH = 3.2;
const R_MARS = 5.0;
const R_BELT = 6.6;
const R_JUPITER = 8.6;
const AMBER = '#ffb547';

/* ------------------------------------------------------------ procedural textures */
function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement('canvas');
  c.width = size * 2;
  c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const rand = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function blobs(g: CanvasRenderingContext2D, s: number, n: number, colors: string[], rmin: number, rmax: number, seed: number) {
  const r = rand(seed);
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[Math.floor(r() * colors.length)];
    g.globalAlpha = 0.55 + r() * 0.45;
    const x = r() * s * 2, y = s * 0.12 + r() * s * 0.76, rad = rmin + r() * (rmax - rmin);
    g.beginPath();
    g.ellipse(x, y, rad * (1 + r()), rad, r() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
}

function useTextures() {
  return useMemo(() => {
    const earth = canvasTex(256, (g, s) => {
      const grd = g.createLinearGradient(0, 0, 0, s);
      grd.addColorStop(0, '#2a6fd1');
      grd.addColorStop(0.5, '#1c4fa8');
      grd.addColorStop(1, '#2a6fd1');
      g.fillStyle = grd;
      g.fillRect(0, 0, s * 2, s);
      blobs(g, s, 26, ['#3f8f4a', '#5d9b45', '#a08a52'], 10, 34, 7);
      blobs(g, s, 40, ['#ffffff'], 4, 14, 11);
      g.fillStyle = '#f2f6ff';
      g.fillRect(0, 0, s * 2, s * 0.07);
      g.fillRect(0, s * 0.93, s * 2, s * 0.07);
    });
    const mars = canvasTex(256, (g, s) => {
      g.fillStyle = '#c1562b';
      g.fillRect(0, 0, s * 2, s);
      blobs(g, s, 40, ['#8f3517', '#d9774a', '#a8441e', '#6e2a12'], 8, 30, 3);
      g.fillStyle = '#f5e9e0';
      g.fillRect(0, 0, s * 2, s * 0.06);
    });
    const moon = canvasTex(128, (g, s) => {
      g.fillStyle = '#c9ccd3';
      g.fillRect(0, 0, s * 2, s);
      blobs(g, s, 30, ['#9da1aa', '#b4b8c0', '#e1e3e8'], 3, 10, 5);
    });
    const jupiter = canvasTex(128, (g, s) => {
      const cols = ['#d9b38c', '#b88a62', '#efd6b5', '#a8724a', '#e8c9a2'];
      for (let y = 0; y < s; y += 6) {
        g.fillStyle = cols[(y / 6) % cols.length];
        g.fillRect(0, y, s * 2, 6);
      }
      g.fillStyle = '#b5532e';
      g.beginPath();
      g.ellipse(s * 1.2, s * 0.62, 14, 7, 0, 0, Math.PI * 2);
      g.fill();
    });
    const glow = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d')!;
      const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(255,240,200,1)');
      grd.addColorStop(0.18, 'rgba(255,200,110,0.85)');
      grd.addColorStop(0.45, 'rgba(255,140,40,0.28)');
      grd.addColorStop(1, 'rgba(255,120,20,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    return { earth, mars, moon, jupiter, glow };
  }, []);
}

/* ------------------------------------------------------------ pieces */
function Orbit({ r, dashed = false, opacity = 0.16 }: { r: number; dashed?: boolean; opacity?: number }) {
  const pts = useMemo(() => Array.from({ length: 161 }, (_, i) => new THREE.Vector3(Math.cos((i / 160) * Math.PI * 2) * r, 0, Math.sin((i / 160) * Math.PI * 2) * r)), [r]);
  return <Line points={pts} color="#ffffff" transparent opacity={opacity} lineWidth={1} dashed={dashed} dashSize={0.25} gapSize={0.35} />;
}

function Belt() {
  const geo = useMemo(() => {
    const r = rand(42);
    const n = 1400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const rad = R_BELT - 0.45 + r() * 0.9;
      pos.set([Math.cos(a) * rad, (r() - 0.5) * 0.25, Math.sin(a) * rad], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => ref.current && (ref.current.rotation.y += dt * 0.01));
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#d9c2a3" size={0.05} sizeAttenuation transparent opacity={0.65} depthWrite={false} />
    </points>
  );
}

/** Pulsing amber ring shown around the selected destination. */
function SelectRing({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    const k = 1 + 0.12 * Math.sin(clock.elapsedTime * 3);
    ref.current.scale.setScalar(k);
    ref.current.quaternion.copy(camera.quaternion);
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[radius * 1.55, radius * 1.75, 64]} />
      <meshBasicMaterial color={AMBER} transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Label({ children, active, onClick, sub, offset = [0, 0, 0] }: { children: ReactNode; active?: boolean; onClick?: () => void; sub?: string; offset?: [number, number, number] }) {
  return (
    <Html position={offset} center zIndexRange={[10, 0]} style={{ pointerEvents: onClick ? 'auto' : 'none' }}>
      {onClick ? (
        <button className={`map3d-label ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={onClick}>
          <span>{children}</span>
          {sub && <small>{sub}</small>}
        </button>
      ) : (
        <span className="map3d-sub">{children}</span>
      )}
    </Html>
  );
}

/* ------------------------------------------------------------ scene */
function System({ selected, onSelect, focus }: { selected: DestinationId; onSelect: (d: DestinationId) => void; focus: React.MutableRefObject<THREE.Vector3> }) {
  const { l, t } = useT();
  const tex = useTextures();
  const reduce = useAppStore((s) => s.reduceMotion);
  const name = (id: DestinationId) => l(DESTINATIONS.find((d) => d.id === id)!.name);
  const earthPivot = useRef<THREE.Group>(null);
  const marsPivot = useRef<THREE.Group>(null);
  const jupPivot = useRef<THREE.Group>(null);
  const moonPivot = useRef<THREE.Group>(null);
  const earth = useRef<THREE.Mesh>(null);
  const mars = useRef<THREE.Mesh>(null);
  const probe = useRef<THREE.Group>(null);
  const moonObj = useRef<THREE.Group>(null);
  const marsObj = useRef<THREE.Group>(null);
  const deepObj = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<DestinationId | null>(null);

  // Pioneer 10's path: from Earth's orbit, past Jupiter, out of the Solar System.
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(R_EARTH * 0.85, 0, -R_EARTH * 0.55),
        new THREE.Vector3(5.2, 0.3, -4.2),
        new THREE.Vector3(7.6, 0.9, -6.4),
        new THREE.Vector3(9.4, 1.6, -7.4),
        new THREE.Vector3(11.0, 2.4, -8.0),
      ]),
    [],
  );
  const pathPts = useMemo(() => curve.getPoints(120), [curve]);
  const end = pathPts[pathPts.length - 1];
  const endDir = useMemo(() => curve.getTangentAt(1).normalize(), [curve]);

  useFrame(({ clock }, dt) => {
    const sp = reduce ? 0 : 1;
    if (earthPivot.current) earthPivot.current.rotation.y += dt * 0.05 * sp;
    if (marsPivot.current) marsPivot.current.rotation.y += dt * 0.028 * sp;
    if (jupPivot.current) jupPivot.current.rotation.y += dt * 0.01 * sp;
    if (moonPivot.current) moonPivot.current.rotation.y += dt * 0.5 * sp;
    if (earth.current) earth.current.rotation.y += dt * 0.6 * sp;
    if (mars.current) mars.current.rotation.y += dt * 0.5 * sp;
    if (probe.current) {
      const u = reduce ? 0.85 : (clock.elapsedTime * 0.06) % 1;
      probe.current.position.copy(curve.getPointAt(u));
    }
    // Where the camera should look (followed smoothly by the controls).
    const obj = selected === 'moon' ? moonObj.current : selected === 'mars' ? marsObj.current : deepObj.current;
    if (obj) obj.getWorldPosition(focus.current);
  });

  const hoverProps = (id: DestinationId) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), setHover(id), (document.body.style.cursor = 'pointer')),
    onPointerOut: () => (setHover(null), (document.body.style.cursor = '')),
    onClick: (e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), onSelect(id)),
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 0]} intensity={2.6} decay={0} color="#fff1d6" />
      <Stars radius={70} depth={40} count={2500} factor={3} saturation={0} fade speed={reduce ? 0 : 0.4} />

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.72, 48, 32]} />
        <meshBasicMaterial color="#ffe6b0" toneMapped={false} />
      </mesh>
      <sprite scale={[4.6, 4.6, 1]}>
        <spriteMaterial map={tex.glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial map={tex.glow} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <Label offset={[0, -1.35, 0]}>{t('sun')}</Label>

      {/* Orbits & belt */}
      <Orbit r={R_EARTH} opacity={0.22} />
      <Orbit r={R_MARS} opacity={0.22} />
      <Orbit r={R_JUPITER} dashed opacity={0.14} />
      <Orbit r={11.5} dashed opacity={0.08} />
      <Belt />

      {/* Earth + Moon */}
      <group ref={earthPivot} rotation={[0, 2.4, 0]}>
        <group position={[R_EARTH, 0, 0]}>
          <mesh ref={earth} {...hoverProps('moon')}>
            <sphereGeometry args={[0.36, 48, 32]} />
            <meshStandardMaterial map={tex.earth} roughness={0.75} metalness={0} />
          </mesh>
          <mesh scale={1.08}>
            <sphereGeometry args={[0.36, 32, 24]} />
            <meshBasicMaterial color="#6fb7ff" transparent opacity={0.12} side={THREE.BackSide} />
          </mesh>
          <Label offset={[0, -0.75, 0]}>{t('earth')}</Label>
          <Orbit r={0.85} opacity={0.18} />
          <group ref={moonPivot}>
            <group ref={moonObj} position={[0.85, 0, 0]}>
              <mesh scale={hover === 'moon' ? 1.25 : 1} {...hoverProps('moon')}>
                <sphereGeometry args={[0.13, 32, 24]} />
                <meshStandardMaterial map={tex.moon} roughness={0.9} />
              </mesh>
              {selected === 'moon' && <SelectRing radius={0.16} />}
              <Label active={selected === 'moon'} onClick={() => onSelect('moon')} offset={[0, 0.55, 0]}>
                {name('moon')}
              </Label>
            </group>
          </group>
        </group>
      </group>

      {/* Mars */}
      <group ref={marsPivot} rotation={[0, 0.3, 0]}>
        <group ref={marsObj} position={[R_MARS, 0, 0]}>
          <mesh ref={mars} scale={hover === 'mars' ? 1.15 : 1} {...hoverProps('mars')}>
            <sphereGeometry args={[0.28, 48, 32]} />
            <meshStandardMaterial map={tex.mars} roughness={0.9} />
          </mesh>
          {selected === 'mars' && <SelectRing radius={0.3} />}
          <Label active={selected === 'mars'} onClick={() => onSelect('mars')} offset={[0, 0.85, 0]}>
            {name('mars')}
          </Label>
        </group>
      </group>

      {/* Jupiter (scenery) */}
      <group ref={jupPivot} rotation={[0, -1.1, 0]}>
        <mesh position={[R_JUPITER, 0, 0]}>
          <sphereGeometry args={[0.62, 48, 32]} />
          <meshStandardMaterial map={tex.jupiter} roughness={0.85} />
        </mesh>
      </group>

      {/* Pioneer 10 path + probe + deep-space destination */}
      <Line points={pathPts} color="#7fe7f2" lineWidth={2} dashed dashSize={0.3} gapSize={0.22} transparent opacity={0.8} />
      <group ref={probe}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#d9fbff" />
        </mesh>
        <pointLight color="#7fe7f2" intensity={0.6} distance={2} decay={0} />
      </group>
      <group ref={deepObj} position={end}>
        <mesh quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), endDir)} {...hoverProps('deep-space')}>
          <coneGeometry args={[0.22, 0.55, 20]} />
          <meshBasicMaterial color={hover === 'deep-space' || selected === 'deep-space' ? '#bff6fb' : '#7fe7f2'} />
        </mesh>
        <mesh {...hoverProps('deep-space')}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {selected === 'deep-space' && <SelectRing radius={0.35} />}
        <Label active={selected === 'deep-space'} onClick={() => onSelect('deep-space')} offset={[0, 0.95, 0]} sub="Pioneer 10 → Aldebaran">
          {name('deep-space')}
        </Label>
      </group>
    </>
  );
}

function Rig({ focus }: { focus: React.MutableRefObject<THREE.Vector3> }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const reduce = useAppStore((s) => s.reduceMotion);
  const target = useRef(new THREE.Vector3(2, 0, -1));
  useFrame((_, dt) => {
    if (!controls.current) return;
    // Look between the Sun and the chosen destination so both stay in view.
    const want = focus.current.clone().multiplyScalar(0.55);
    target.current.lerp(want, Math.min(1, dt * 1.5));
    controls.current.target.copy(target.current);
    controls.current.update();
  });
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={7}
      maxDistance={30}
      minPolarAngle={0.25}
      maxPolarAngle={1.45}
      autoRotate={!reduce}
      autoRotateSpeed={0.25}
      rotateSpeed={0.6}
    />
  );
}

export default function SolarMap3D({ selected, onSelect }: { selected: DestinationId; onSelect: (d: DestinationId) => void }) {
  const { t } = useT();
  const focus = useRef(new THREE.Vector3(5, 0, -3));
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
  return (
    <div className="relative h-full w-full" role="group" aria-label={t('mapLabel')}>
      <Canvas
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: mobile ? [3, 16, 22] : [1, 9.5, 16], fov: mobile ? 55 : 42, near: 0.1, far: 300 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <System selected={selected} onSelect={onSelect} focus={focus} />
        <Rig focus={focus} />
      </Canvas>
      <p className="mono pointer-events-none absolute bottom-9 left-4 text-xs text-ink-300 lg:bottom-3">
        {t('notToScale')}
        <span className="hidden sm:inline"> · {t('mapHint')}</span>
      </p>
    </div>
  );
}
