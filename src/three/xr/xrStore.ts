import { createXRStore } from '@react-three/xr';
import { PointerEvent as XRPointerEvent } from '@pmndrs/pointer-events';

/**
 * Module-level WebXR store. Imported statically only by SceneRoot (lazy 3D chunk)
 * and dynamically by VRButton, so three / @react-three/xr never land in the main chunk.
 */
export const xrStore = createXRStore({
  // Keep the normal web version untouched: no device emulator on localhost.
  emulate: false,
  // Selection uses the controller ray / hand pointer; no teleport/grab needed.
  controller: { teleportPointer: false },
  hand: { teleportPointer: false },
});

// R3F handlers in parts.tsx read `e.delta` to ignore drags. XR pointer events
// (@pmndrs/pointer-events) throw "not supported" on that getter, which would
// break part selection in VR. A ray "click" is a press + release, so report 0.
Object.defineProperty(XRPointerEvent.prototype, 'delta', { configurable: true, get: () => 0 });
