import * as THREE from 'three';

// Small deterministic value noise (no dependency).
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  const u = smooth(xf);
  const v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, oct = 4) {
  let s = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i++) {
    s += amp * noise(x * f, y * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return s;
}

export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface Crater {
  x: number;
  z: number;
  r: number;
}

export interface TerrainSpec {
  amp: number; // rolling height amplitude
  scale: number;
  craters: Crater[];
  flatRadius: number; // keep the vehicle area flat
}

export function heightAt(x: number, z: number, s: TerrainSpec) {
  let h = (fbm(x * s.scale, z * s.scale) - 0.5) * s.amp * 2;
  h += (fbm(x * 0.9, z * 0.9, 2) - 0.5) * 0.08;
  for (const c of s.craters) {
    const d = Math.hypot(x - c.x, z - c.z) / c.r;
    if (d < 1) h -= (1 - d * d) * c.r * 0.18;
    else if (d < 1.4) h += Math.sin(((d - 1) / 0.4) * Math.PI) * c.r * 0.05;
  }
  const r = Math.hypot(x, z);
  const k = THREE.MathUtils.smoothstep(r, s.flatRadius, s.flatRadius * 2.2);
  return h * k;
}

export function buildTerrain(size: number, seg: number, s: TerrainSpec, colorA: THREE.Color, colorB: THREE.Color, tracks?: (x: number, z: number) => number) {
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = heightAt(x, z, s);
    const tr = tracks ? tracks(x, z) : 0;
    y -= tr * 0.015;
    pos.setY(i, y);
    const n = fbm(x * 0.35 + 10, z * 0.35 - 4, 3);
    c.copy(colorA).lerp(colorB, n);
    if (tr) c.multiplyScalar(1 - tr * 0.25);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Two parallel wheel tracks curving away behind the vehicle. Returns 0..1 strength. */
export function trackFn(gauge: number, width: number) {
  return (x: number, z: number) => {
    if (x > 0.5) return 0;
    const curve = Math.sin(x * 0.12) * 3;
    const dz = z - curve;
    const a = Math.abs(Math.abs(dz) - gauge);
    if (a > width) return 0;
    return (1 - a / width) * THREE.MathUtils.clamp(1 + x / 60, 0, 1);
  };
}
