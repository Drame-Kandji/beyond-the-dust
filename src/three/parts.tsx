/**
 * Part effects engine shared by procedural models and team .glb models.
 * Every part registers one or more Object3D. A single frame loop then applies:
 * explode offset, highlight (selected / hovered), focus dimming and X-ray.
 */
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Part as PartData, Vec3 } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { ping } from '../hooks/ambient';

interface Entry {
  partId: string;
  object: THREE.Object3D;
  base: THREE.Vector3;
  explode: THREE.Vector3;
  mats: { m: THREE.MeshStandardMaterial; emissive: THREE.Color; emissiveIntensity: number; opacity: number; transparent: boolean }[];
  xrayOnly: THREE.Object3D[];
}

export type Registry = {
  register: (partId: string, obj: THREE.Object3D) => () => void;
  hovered: { current: string | null };
};

const Ctx = createContext<Registry | null>(null);
const AMBER = new THREE.Color('#ffb547');
const CYAN = new THREE.Color('#7fe7f2');

export function usePartRegistry(parts: PartData[]) {
  const entries = useRef(new Map<THREE.Object3D, Entry>());
  const hovered = useRef<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(parts.map((p) => [p.id, p])), [parts]);

  const registry: Registry = useMemo(
    () => ({
      hovered,
      register: (partId, object) => {
        const p = byId[partId];
        const mats: Entry['mats'] = [];
        const xrayOnly: THREE.Object3D[] = [];
        object.userData.partId = partId;
        const visit = (o: THREE.Object3D) => {
          // Skip sub-trees already registered as another part (nested parts in .glb files).
          if (o !== object && o.userData.partId && o.userData.partId !== partId) return;
          o.children.forEach(visit);
          if (o.userData.xrayOnly) xrayOnly.push(o);
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const cloned = list.map((mm) => {
            const c = (mm as THREE.Material).clone() as THREE.MeshStandardMaterial;
            if (!('emissive' in c)) return c;
            mats.push({ m: c, emissive: c.emissive.clone(), emissiveIntensity: c.emissiveIntensity ?? 1, opacity: c.opacity, transparent: c.transparent });
            return c;
          });
          mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
        };
        visit(object);
        const e: Entry = {
          partId,
          object,
          base: object.position.clone(),
          explode: new THREE.Vector3(...((p?.explode ?? [0, 0, 0]) as Vec3)),
          mats,
          xrayOnly,
        };
        entries.current.set(object, e);
        return () => {
          entries.current.delete(object);
        };
      },
    }),
    [byId],
  );

  useFrame((state, dt) => {
    const { selectedPart, exploded, xray } = useAppStore.getState();
    const k = Math.min(1, dt * 6);
    const pulse = 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 4);
    entries.current.forEach((e) => {
      // Explode
      const target = exploded ? e.base.clone().add(e.explode) : e.base;
      e.object.position.lerp(target, k);
      const isSel = selectedPart === e.partId;
      const isHover = hovered.current === e.partId;
      const dim = !!selectedPart && !isSel;
      e.xrayOnly.forEach((o) => (o.visible = xray));
      for (const s of e.mats) {
        if (s.m.userData.xrayOnly) continue;
        // Emissive highlight
        if (isSel) {
          s.m.emissive.lerp(AMBER, k);
          s.m.emissiveIntensity = THREE.MathUtils.lerp(s.m.emissiveIntensity, 0.35 + 0.5 * pulse, k);
        } else if (isHover) {
          s.m.emissive.lerp(AMBER, k);
          s.m.emissiveIntensity = THREE.MathUtils.lerp(s.m.emissiveIntensity, 0.25, k);
        } else if (xray) {
          s.m.emissive.lerp(CYAN, k);
          s.m.emissiveIntensity = THREE.MathUtils.lerp(s.m.emissiveIntensity, 0.18, k);
        } else {
          s.m.emissive.lerp(s.emissive, k);
          s.m.emissiveIntensity = THREE.MathUtils.lerp(s.m.emissiveIntensity, s.emissiveIntensity, k);
        }
        // Opacity: X-ray and focus dimming
        const targetOpacity = xray && !isSel ? 0.22 : dim ? 0.45 : s.opacity;
        const needTransparent = targetOpacity < 0.999 || s.transparent;
        if (s.m.transparent !== needTransparent) {
          s.m.transparent = needTransparent;
          s.m.needsUpdate = true;
        }
        s.m.opacity = THREE.MathUtils.lerp(s.m.opacity, targetOpacity, k);
        s.m.depthWrite = s.m.opacity > 0.9;
      }
    });
  });

  return registry;
}

export function PartRegistryProvider({ registry, children }: { registry: Registry; children: ReactNode }) {
  return <Ctx.Provider value={registry}>{children}</Ctx.Provider>;
}

/** Find the part id of the clicked object by walking up the scene graph. */
export function partIdFromEvent(e: ThreeEvent<PointerEvent | MouseEvent>): string | null {
  let o: THREE.Object3D | null = e.object;
  while (o) {
    if (o.userData.partId) return o.userData.partId as string;
    o = o.parent;
  }
  return null;
}

export function usePointerHandlers(registry: Registry) {
  return useMemo(
    () => ({
      onClick: (e: ThreeEvent<MouseEvent>) => {
        const id = partIdFromEvent(e);
        if (!id) return;
        e.stopPropagation();
        // Ignore clicks that were actually drags
        let moved = 0;
        try {
          moved = e.delta; // not available on some XR pointer events
        } catch {
          moved = 0;
        }
        if (moved > 6) return;
        ping(990);
        useAppStore.getState().set({ touring: false });
        useAppStore.getState().selectPart(id);
      },
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        const id = partIdFromEvent(e);
        if (!id) return;
        e.stopPropagation();
        registry.hovered.current = id;
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        registry.hovered.current = null;
        document.body.style.cursor = '';
      },
    }),
    [registry],
  );
}

/** Wrap procedural geometry belonging to one part. */
export function Part({ id, children, position, rotation }: { id: string; children: ReactNode; position?: Vec3; rotation?: Vec3 }) {
  const reg = useContext(Ctx);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!reg || !ref.current) return;
    return reg.register(id, ref.current);
  }, [reg, id]);
  return (
    <group ref={ref} name={id} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

/** Internal component, only visible in X-ray mode. */
export function XrayOnly({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.userData.xrayOnly = true;
    ref.current.visible = false;
    ref.current.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.userData.xrayOnly = true;
    });
  }, []);
  return <group ref={ref}>{children}</group>;
}
