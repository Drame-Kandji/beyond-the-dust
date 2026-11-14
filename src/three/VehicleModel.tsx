/**
 * Shows the team .glb model when it exists, otherwise the procedural fallback.
 * Part mapping for .glb files is done by node name (see Part.meshNames in the data).
 */
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Part, Vehicle } from '../data/types';
import { PartRegistryProvider, usePartRegistry, usePointerHandlers, type Registry } from './parts';
import { LRVModel } from './procedural/LRVModel';
import { OpportunityModel } from './procedural/OpportunityModel';
import { Pioneer10Model } from './procedural/Pioneer10Model';
import { Apollo11LMModel } from './procedural/Apollo11LMModel';
import { SojournerModel } from './procedural/SojournerModel';
import { CuriosityModel } from './procedural/CuriosityModel';
import { Hotspots } from './Hotspots';
import { useAppStore } from '../store/useAppStore';

const PROCEDURAL = { lrv: LRVModel, opportunity: OpportunityModel, pioneer10: Pioneer10Model, apollo11lm: Apollo11LMModel, sojourner: SojournerModel, curiosity: CuriosityModel };
const DRACO = `${import.meta.env.BASE_URL}draco/`;

/** Checks that a real glTF binary exists (dev servers may answer index.html for missing files). */
async function glbExists(url: string) {
  try {
    const r = await fetch(url, { headers: { Range: 'bytes=0-3' } });
    if (!r.ok) return false;
    const buf = new Uint8Array(await r.arrayBuffer()).slice(0, 4);
    return String.fromCharCode(...buf) === 'glTF';
  } catch {
    return false;
  }
}

class GlbBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[Beyond the Dust] .glb failed to load, using procedural model.', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function matchPart(name: string, parts: Part[]): string | null {
  const n = name.toLowerCase();
  for (const p of parts) {
    if (n === p.id || p.meshNames.some((m) => new RegExp(m, 'i').test(n))) return p.id;
  }
  return null;
}

function GlbModel({ url, vehicle, registry }: { url: string; vehicle: Vehicle; registry: Registry }) {
  const { scene } = useGLTF(url, DRACO);
  const root = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const claim = (o: THREE.Object3D) => {
      const id = matchPart(o.name, vehicle.parts);
      if (id) {
        cleanups.push(registry.register(id, o));
        return; // children belong to the same part
      }
      o.children.forEach(claim);
    };
    root.children.forEach(claim);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return () => cleanups.forEach((c) => c());
  }, [root, vehicle, registry]);
  return <primitive object={root} scale={vehicle.model.scale} />;
}

export function VehicleModel({ vehicle }: { vehicle: Vehicle }) {
  const registry = usePartRegistry(vehicle.parts);
  const handlers = usePointerHandlers(registry);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const Procedural = PROCEDURAL[vehicle.id];
  const spinRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let alive = true;
    const url = `${import.meta.env.BASE_URL}${vehicle.model.glb}`;
    glbExists(url).then((ok) => alive && ok && setGlbUrl(url));
    return () => {
      alive = false;
    };
  }, [vehicle]);

  // Pioneer 10 was spin-stabilised: rotate slowly, settle when a part is selected.
  useFrame((_, dt) => {
    if (!spinRef.current || vehicle.id !== 'pioneer10') return;
    const { selectedPart, exploded, reduceMotion } = useAppStore.getState();
    const g = spinRef.current;
    if (selectedPart || exploded || reduceMotion) g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, Math.round(g.rotation.z / (Math.PI * 2)) * Math.PI * 2, Math.min(1, dt * 3));
    else g.rotation.z += dt * 0.12;
  });

  const fallback = <Procedural />;
  return (
    <PartRegistryProvider registry={registry}>
      <group ref={spinRef} {...handlers}>
        {glbUrl ? (
          <GlbBoundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <GlbModel url={glbUrl} vehicle={vehicle} registry={registry} />
            </Suspense>
          </GlbBoundary>
        ) : (
          fallback
        )}
        <Hotspots vehicle={vehicle} />
      </group>
    </PartRegistryProvider>
  );
}
