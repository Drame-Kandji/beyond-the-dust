import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import type CameraControlsImpl from 'camera-controls';
import type { Vehicle } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { useInXR } from './xr/XRScene';

/** Camera: arrival fly-in, fly-to on part selection, idle auto-rotation, limits. */
export function CameraRig({ vehicle }: { vehicle: Vehicle }) {
  const ref = useRef<CameraControlsImpl>(null);
  const camera = useAppStore((s) => s.camera);
  const teleporting = useAppStore((s) => s.teleporting);
  const lastInteraction = useRef(performance.now());
  // In an immersive session the headset drives the view: controls are disabled.
  const inXR = useInXR();
  const wasInXR = useRef(false);
  const { position: p, target: t } = vehicle.model.defaultCamera;
  const dist = Math.hypot(p[0] - t[0], p[1] - t[1], p[2] - t[2]);

  // Arrival: start far away, fly in when the teleport overlay ends.
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.setLookAt(p[0] * 5, p[1] * 3 + 4, p[2] * 5, t[0], t[1], t[2], false);
  }, [vehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const c = ref.current;
    if (!c || teleporting) return;
    c.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], !useAppStore.getState().reduceMotion);
    lastInteraction.current = performance.now();
  }, [teleporting, vehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const c = ref.current;
    if (!c || !camera) return;
    const [x, y, z] = camera.position;
    const [tx, ty, tz] = camera.target;
    c.setLookAt(x, y, z, tx, ty, tz, !useAppStore.getState().reduceMotion);
    lastInteraction.current = performance.now();
  }, [camera]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const on = () => {
      lastInteraction.current = performance.now();
    };
    c.addEventListener('controlstart', on);
    return () => c.removeEventListener('controlstart', on);
  }, []);

  // Back from VR: restore the default orbit view.
  useEffect(() => {
    const c = ref.current;
    if (inXR) wasInXR.current = true;
    else if (wasInXR.current && c) {
      wasInXR.current = false;
      c.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], false);
      lastInteraction.current = performance.now();
    }
  }, [inXR]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => {
    const c = ref.current;
    if (!c || inXR) return;
    const s = useAppStore.getState();
    const idle = performance.now() - lastInteraction.current > 5000;
    if (idle && !s.selectedPart && !s.reduceMotion && !s.teleporting && !s.touring) c.azimuthAngle += dt * 0.07;
  });

  const ground = vehicle.destination !== 'deep-space';
  return (
    <CameraControls
      ref={ref}
      makeDefault
      enabled={!inXR}
      minDistance={dist * 0.12}
      maxDistance={dist * 2.2}
      maxPolarAngle={ground ? Math.PI / 2 - 0.06 : Math.PI}
      smoothTime={0.6}
      draggingSmoothTime={0.15}
    />
  );
}
