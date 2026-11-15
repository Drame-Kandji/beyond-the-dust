/** Procedural 360° environments: Moon (Hadley-Apennine), Mars (Meridiani) and Deep Space. */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { buildTerrain, heightAt, rng, trackFn, type TerrainSpec } from './terrain';
import { useAppStore } from '../../store/useAppStore';
import type { Vehicle } from '../../data/types';

type EnvOpts = NonNullable<Vehicle['model']['env']>;

function Rocks({ spec, count, color, minR, maxR, seed, scale = 1 }: { spec: TerrainSpec; count: number; color: string; minR: number; maxR: number; seed: number; scale?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = rng(seed);
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const d = minR + Math.pow(r(), 0.7) * (maxR - minR);
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      const s = (0.04 + Math.pow(r(), 3) * 0.5) * scale;
      o.position.set(x, heightAt(x, z, spec) + s * 0.25, z);
      o.rotation.set(r() * 3, r() * 3, r() * 3);
      o.scale.set(s * (0.7 + r() * 0.6), s * (0.5 + r() * 0.4), s * (0.7 + r() * 0.6));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [spec, count, minR, maxR, seed, scale]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </instancedMesh>
  );
}

function Mountains({ color, count, minD, maxD, h, seed }: { color: string; count: number; minD: number; maxD: number; h: [number, number]; seed: number }) {
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => {
      const a = r() * Math.PI * 2;
      const d = minD + r() * (maxD - minD);
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, h: h[0] + r() * (h[1] - h[0]), w: 18 + r() * 30, rot: r() * 3 };
    });
  }, [count, minD, maxD, h, seed]);
  return (
    <group>
      {items.map((m, i) => (
        <mesh key={i} position={[m.x, m.h / 2 - 1.5, m.z]} rotation={[0, m.rot, 0]} scale={[m.w, m.h, m.w * 0.8]}>
          <coneGeometry args={[1, 1, 7, 1]} />
          <meshStandardMaterial color={color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------- MOON --------------------------------- */
export function MoonEnv({ env = {} }: { env?: EnvOpts }) {
  const clear = env.clearRadius ?? 3.2;
  const spec = useMemo<TerrainSpec>(
    () => ({ amp: 0.35, scale: 0.06, flatRadius: clear, craters: [{ x: -9, z: 6, r: 3.5 }, { x: 7, z: -11, r: 5 }, { x: 14, z: 9, r: 2.2 }, { x: -18, z: -14, r: 7 }, { x: 4, z: 18, r: 3 }] }),
    [clear],
  );
  const tracks = env.tracks ?? true;
  const geo = useMemo(() => buildTerrain(220, 180, spec, new THREE.Color('#8d8f94'), new THREE.Color('#b9bbbf'), tracks ? trackFn(0.9, 0.16) : undefined), [spec, tracks]);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.background = new THREE.Color('#000000');
    scene.fog = null;
  }, [scene]);
  return (
    <group>
      <directionalLight position={[-14, 6, 10]} intensity={3.2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      <ambientLight intensity={0.12} />
      <hemisphereLight args={['#9fb4ff', '#3a3a3a', 0.15]} />
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <Rocks spec={spec} count={Math.round(420 * (env.rockiness ?? 1))} color="#9a9ca1" minR={Math.max(2.5, clear * 0.85)} maxR={60} seed={7} />
      <Mountains color="#6d6f74" count={22} minD={90} maxD={140} h={[10, 34]} seed={3} />
      <Stars radius={300} depth={60} count={1500} factor={3} saturation={0} fade speed={0} />
      {/* Earth, lit from the same side as the Sun */}
      <group position={[80, 110, -160]}>
        <mesh>
          <sphereGeometry args={[7, 48, 48]} />
          <meshStandardMaterial color="#3d7fd6" emissive="#0b2350" emissiveIntensity={0.4} roughness={0.7} />
        </mesh>
        <mesh scale={1.12}>
          <sphereGeometry args={[7, 32, 32]} />
          <meshBasicMaterial color="#7fb6ff" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>
      </group>
      {/* Distant lunar module descent stage silhouette */}
      <group position={[-28, 0, -20]} rotation={[0, 0.6, 0]} visible={env.landerSilhouette ?? true}>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[3, 1.5, 3]} />
          <meshStandardMaterial color="#c9973a" metalness={0.9} roughness={0.4} />
        </mesh>
        {[
          [1.9, 1.9],
          [-1.9, 1.9],
          [1.9, -1.9],
          [-1.9, -1.9],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x * 0.8, 0.8, z * 0.8]} rotation={[z > 0 ? 0.5 : -0.5, 0, x > 0 ? -0.5 : 0.5]}>
            <cylinderGeometry args={[0.07, 0.07, 2.2, 6]} />
            <meshStandardMaterial color="#aaa" metalness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------------------------- MARS --------------------------------- */
const skyVert = /* glsl */ `
varying vec3 vDir;
void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const skyFrag = /* glsl */ `
uniform vec3 top; uniform vec3 horizon; uniform vec3 sunDir; uniform float storm;
varying vec3 vDir;
void main(){
  float h = clamp(vDir.y, 0.0, 1.0);
  vec3 col = mix(horizon, top, pow(h, 0.6));
  float sun = pow(max(dot(normalize(vDir), normalize(sunDir)), 0.0), 220.0);
  float halo = pow(max(dot(normalize(vDir), normalize(sunDir)), 0.0), 8.0);
  col += vec3(0.85,0.9,1.0) * sun * (1.0 - storm) * 1.4 + vec3(0.6,0.55,0.5) * halo * 0.25 * (1.0 - storm);
  col = mix(col, vec3(0.16,0.08,0.05), storm * 0.82);
  gl_FragColor = vec4(col, 1.0);
}`;

function DustParticles({ count, area, color, stormRef }: { count: number; area: number; color: string; stormRef?: React.RefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const r = rng(11);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (r() - 0.5) * area;
      p[i * 3 + 1] = r() * 5;
      p[i * 3 + 2] = (r() - 0.5) * area;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, [count, area]);
  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const s = stormRef?.current ?? 0;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const speed = 0.25 + s * 3;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += dt * speed;
      arr[i * 3 + 1] += Math.sin(i + arr[i * 3] * 0.3) * dt * 0.05;
      if (arr[i * 3] > area / 2) arr[i * 3] = -area / 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    const m = pts.material as THREE.PointsMaterial;
    m.opacity = 0.35 + s * 0.55;
    m.size = 0.03 + s * 0.05;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={0.03} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export function MarsEnv({ env = {} }: { env?: EnvOpts }) {
  const clear = env.clearRadius ?? 2.4;
  const spec = useMemo<TerrainSpec>(
    () => ({ amp: 0.55, scale: 0.045, flatRadius: clear, craters: [{ x: -12, z: -7, r: 4 }, { x: 10, z: 12, r: 6 }, { x: 22, z: -18, r: 9 }] }),
    [clear],
  );
  const tracks = env.tracks ?? true;
  const geo = useMemo(() => buildTerrain(220, 180, spec, new THREE.Color('#9c4a22'), new THREE.Color('#c97a45'), tracks ? trackFn(0.6, 0.09) : undefined), [spec, tracks]);
  const scene = useThree((s) => s.scene);
  const sky = useRef<THREE.ShaderMaterial>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.HemisphereLight>(null);
  const storm = useRef(0);
  const uniforms = useMemo(
    () => ({
      top: { value: new THREE.Color('#c9a27a') },
      horizon: { value: new THREE.Color('#e8c39a') },
      sunDir: { value: new THREE.Vector3(0.6, 0.45, 0.5) },
      storm: { value: 0 },
    }),
    [],
  );
  useEffect(() => {
    scene.background = new THREE.Color('#d9b48c');
    scene.fog = new THREE.FogExp2('#d6ad84', 0.012);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  useFrame((_, dt) => {
    const target = useAppStore.getState().storm ? 1 : 0;
    storm.current = THREE.MathUtils.lerp(storm.current, target, Math.min(1, dt * (target ? 0.35 : 1.2)));
    const s = storm.current;
    uniforms.storm.value = s;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = 0.012 + s * 0.11;
      scene.fog.color.set('#d6ad84').lerp(new THREE.Color('#3a1d10'), s);
    }
    if (sun.current) sun.current.intensity = 2.6 * (1 - s * 0.9);
    if (amb.current) amb.current.intensity = 0.55 * (1 - s * 0.6);
  });
  return (
    <group>
      <mesh scale={400}>
        <sphereGeometry args={[1, 32, 16]} />
        <shaderMaterial ref={sky} vertexShader={skyVert} fragmentShader={skyFrag} uniforms={uniforms} side={THREE.BackSide} depthWrite={false} fog={false} />
      </mesh>
      <directionalLight ref={sun} position={[12, 9, 10]} intensity={2.6} color="#fff1dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      <hemisphereLight ref={amb} args={['#f1cfa6', '#6b2f14', 0.55]} />
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.95} />
      </mesh>
      <Rocks spec={spec} count={Math.round(520 * (env.rockiness ?? 1))} color="#7d3b1c" minR={Math.max(1.8, clear * 0.8)} maxR={55} seed={21} scale={env.rockiness && env.rockiness > 1.5 ? 1.6 : 1} />
      {/* hematite "blueberries" (Meridiani Planum only) */}
      {(env.blueberries ?? false) && <Rocks spec={spec} count={900} color="#3e3a44" minR={1.4} maxR={6} seed={5} scale={0.07} />}
      <Mountains color="#a4552b" count={18} minD={70} maxD={130} h={[6, 18]} seed={9} />
      <DustParticles count={1400} area={24} color="#e9c49a" stormRef={storm} />
    </group>
  );
}

/* ------------------------------- DEEP SPACE ------------------------------ */
const milkyFrag = /* glsl */ `
varying vec3 vDir;
float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
float n(vec3 p){ vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
void main(){
  vec3 d = normalize(vDir);
  vec3 axis = normalize(vec3(0.3, 1.0, 0.25));
  float band = exp(-pow(dot(d, axis) * 3.2, 2.0));
  float cloud = n(d * 6.0) * 0.6 + n(d * 14.0) * 0.4;
  vec3 col = vec3(0.32,0.36,0.62) * band * cloud * 0.55 + vec3(0.9,0.75,0.6) * band * pow(cloud, 3.0) * 0.18;
  gl_FragColor = vec4(col, 1.0);
}`;

export function DeepSpaceEnv(_props: { env?: EnvOpts }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.background = new THREE.Color('#020309');
    scene.fog = null;
  }, [scene]);
  return (
    <group>
      <mesh scale={450}>
        <sphereGeometry args={[1, 48, 24]} />
        <shaderMaterial vertexShader={skyVert} fragmentShader={milkyFrag} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <Stars radius={200} depth={120} count={7000} factor={4} saturation={0.15} fade speed={0.3} />
      {/* The Sun: a tiny bright point, very far away */}
      <group position={[-160, 30, 120]}>
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#fff6e0" />
        </mesh>
        <mesh>
          <sphereGeometry args={[3.5, 16, 16]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      </group>
      <directionalLight position={[-16, 3, 12]} intensity={2.2} color="#fff4e0" />
      <directionalLight position={[10, -4, -8]} intensity={0.35} color="#5b7bff" />
      <ambientLight intensity={0.1} />
    </group>
  );
}
