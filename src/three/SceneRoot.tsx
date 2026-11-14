import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import type { Vehicle } from '../data/types';
import { VehicleModel } from './VehicleModel';
import { CameraRig } from './CameraRig';
import { DeepSpaceEnv, MarsEnv, MoonEnv } from './environments/Environments';
import { useAppStore } from '../store/useAppStore';
import { XRScene, NotInSession } from './xr/XRScene';

const ENV = { moon: MoonEnv, mars: MarsEnv, 'deep-space': DeepSpaceEnv };

export default function SceneRoot({ vehicle, onReady }: { vehicle: Vehicle; onReady?: () => void }) {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const [dpr, setDpr] = useState(mobile ? 1.25 : Math.min(window.devicePixelRatio, 2));
  const Env = ENV[vehicle.destination];
  const { position } = vehicle.model.defaultCamera;
  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
      camera={{ position, fov: mobile ? 55 : 45, near: 0.05, far: 2000 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      onPointerMissed={() => {
        if (useAppStore.getState().selectedPart) useAppStore.getState().selectPart(null);
      }}
      aria-label={`3D view of ${vehicle.name.en}`}
    >
      <XRScene vehicle={vehicle}>
        {/* DPR can't change while an XR device is presenting */}
        <NotInSession>
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
            onIncline={() => setDpr((d) => Math.min(mobile ? 1.5 : 2, d + 0.25))}
          />
          <AdaptiveDpr pixelated={false} />
        </NotInSession>
        <Suspense fallback={null}>
          <Env />
          <VehicleModel vehicle={vehicle} />
        </Suspense>
        <CameraRig vehicle={vehicle} />
      </XRScene>
    </Canvas>
  );
}
