import type { ReactNode } from 'react';
import { XR, XROrigin, useXR } from '@react-three/xr';
import type { Vehicle } from '../../data/types';
import { xrStore } from './xrStore';

/** True while an immersive XR session is running. */
export function useInXR() {
  return useXR((s) => s.session != null);
}

/** Renders children only outside an XR session (e.g. DPR tuning, orbit controls). */
export function NotInSession({ children }: { children: ReactNode }) {
  return useInXR() ? null : <>{children}</>;
}

/**
 * Where the viewer's feet go in VR. Ground vehicles: standing on the ground
 * (local-floor gives natural ~1.6 m eye height) a few metres in front of the
 * machine, along the default camera bearing. Deep space: floating with eyes
 * level with the spacecraft.
 */
function VehicleOrigin({ vehicle }: { vehicle: Vehicle }) {
  const { position: p, target: t } = vehicle.model.defaultCamera;
  const dx = p[0] - t[0];
  const dz = p[2] - t[2];
  const horiz = Math.hypot(dx, dz) || 1;
  const deep = vehicle.destination === 'deep-space';
  const d = Math.max(2.5, horiz * (deep ? 0.6 : 0.7));
  const x = t[0] + (dx / horiz) * d;
  const z = t[2] + (dz / horiz) * d;
  const y = deep ? t[1] - 1.6 : 0;
  // XR origin looks down -Z; rotate it to face the vehicle.
  return <XROrigin position={[x, y, z]} rotation={[0, Math.atan2(dx, dz), 0]} />;
}

/** XR provider wrapping the whole (shared) scene. */
export function XRScene({ vehicle, children }: { vehicle: Vehicle; children: ReactNode }) {
  return (
    <XR store={xrStore}>
      <VehicleOrigin vehicle={vehicle} />
      {children}
    </XR>
  );
}
