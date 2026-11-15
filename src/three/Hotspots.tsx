import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Part, Vehicle } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/useT';
import { ping } from '../hooks/ambient';

function Hotspot({ part, index }: { part: Part; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const base = useRef(new THREE.Vector3(...part.anchor));
  const off = useRef(new THREE.Vector3(...part.explode));
  const selected = useAppStore((s) => s.selectedPart === part.id);
  const teleporting = useAppStore((s) => s.teleporting);
  const { l } = useT();

  useFrame((_, dt) => {
    if (!ref.current) return;
    const exploded = useAppStore.getState().exploded;
    const target = exploded ? base.current.clone().add(off.current) : base.current;
    ref.current.position.lerp(target, Math.min(1, dt * 6));
  });

  return (
    <group ref={ref} position={part.anchor}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: teleporting ? 'none' : 'auto', opacity: teleporting ? 0 : 1, transition: 'opacity .6s' }}>
        <button
          className={`hotspot ${selected ? 'is-active' : ''}`}
          aria-label={`${index + 1}. ${l(part.name)}`}
          onClick={(e) => {
            e.stopPropagation();
            ping(990);
            useAppStore.getState().set({ touring: false });
            useAppStore.getState().selectPart(part.id);
          }}
        >
          <span className="hotspot-ring" aria-hidden />
          <span className="hotspot-num">{index + 1}</span>
          <span className="hotspot-label">{l(part.name)}</span>
        </button>
      </Html>
    </group>
  );
}

export function Hotspots({ vehicle }: { vehicle: Vehicle }) {
  const show = useAppStore((s) => s.showNumbers);
  if (!show) return null;
  return (
    <>
      {vehicle.parts.map((p, i) => (
        <Hotspot key={p.id} part={p} index={i} />
      ))}
    </>
  );
}
