// Single source of "where attention is" for the whole page. On pointer-fine
// devices (desktop) it tracks the mouse; on touch-first devices it tracks the
// gyroscope. Both the drop-shadow effect and the 3D city camera subscribe here
// so they move together from one signal — and the iOS permission gesture only
// has to be handled once.

export interface Tilt {
  // Normalized attention vector, -1..1. Right / down are positive.
  // Pointer: offset from screen center. Gyro: device tilt (gamma / beta).
  x: number;
  y: number;
  // Grain-scroll position in px for the shadow noise texture.
  gx: number;
  gy: number;
  // 0..1 distance from rest, used to scale shadow intensity.
  dist: number;
  // Cycles 1..90 to re-seed SVG turbulence so the grain refreshes while moving.
  seed: number;
  source: 'pointer' | 'gyro' | 'none';
}

const tilt: Tilt = { x: 0, y: 0, gx: 0, gy: 0, dist: 0, seed: 1, source: 'none' };

const subscribers = new Set<(t: Tilt) => void>();
let refCount = 0;
let cleanup: (() => void) | null = null;
let frame = 0;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// SVG filters and CSS vars re-render on every change, so batch all subscriber
// notifications to one per animation frame.
const notify = () => {
  frame = 0;
  for (const fn of subscribers) fn(tilt);
};
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(notify);
};

function startPointer(): () => void {
  const onMove = (e: PointerEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    tilt.x = clamp(dx, -1, 1);
    tilt.y = clamp(dy, -1, 1);
    tilt.dist = Math.min(1, Math.hypot(dx, dy));
    tilt.gx = e.clientX * 0.7;
    tilt.gy = e.clientY * 0.7;
    tilt.seed = (tilt.seed % 90) + 1;
    tilt.source = 'pointer';
    schedule();
  };
  const onLeave = () => {
    tilt.x = 0;
    tilt.y = 0;
    tilt.dist = 0;
    tilt.source = 'pointer';
    schedule();
  };
  window.addEventListener('pointermove', onMove);
  document.body.addEventListener('pointerleave', onLeave);
  return () => {
    window.removeEventListener('pointermove', onMove);
    document.body.removeEventListener('pointerleave', onLeave);
  };
}

function startGyro(): () => void {
  if (typeof window.DeviceOrientationEvent !== 'function') return () => {};
  let listening = false;
  // The desktop mouse rests at screen center -> (0, 0). A phone has no such
  // natural zero: held to read, beta (front/back) sits at ~45-80deg, which would
  // pin tilt.y to +1 forever. So capture the first reading as the rest pose and
  // measure every tilt as a delta from it, the way the mouse measures offset
  // from center. RANGE degrees from rest maps to the full -1..1.
  const RANGE = 25;
  let restGamma: number | null = null;
  let restBeta: number | null = null;
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    if (restGamma == null) {
      restGamma = e.gamma;
      restBeta = e.beta;
    }
    // gamma: left/right tilt, beta: front/back tilt. Delta from the rest pose,
    // clamped to a comfortable range so small tilts already move the scene.
    const dg = clamp(e.gamma - restGamma, -RANGE, RANGE) / RANGE;
    const db = clamp(e.beta - (restBeta as number), -RANGE, RANGE) / RANGE;
    tilt.x = dg;
    tilt.y = db;
    tilt.dist = Math.min(1, Math.hypot(dg, db));
    tilt.gx = dg * RANGE;
    tilt.gy = db * RANGE;
    tilt.seed = (tilt.seed % 90) + 1;
    tilt.source = 'gyro';
    schedule();
  };
  const listen = () => {
    if (listening) return;
    listening = true;
    window.addEventListener('deviceorientation', onOrient);
  };
  // iOS 13+ requires requestPermission() from inside a user gesture. Wait for
  // the first tap; Android fires without permission so we also listen eagerly.
  const onGesture = async () => {
    const doe = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<PermissionState>;
    };
    if (typeof doe.requestPermission === 'function') {
      try {
        if ((await doe.requestPermission()) === 'denied') return;
      } catch {
        // Already granted or not required — fall through and listen.
      }
    }
    listen();
  };
  listen();
  window.addEventListener('click', onGesture, { once: true });
  window.addEventListener('touchstart', onGesture, { once: true });
  return () => {
    window.removeEventListener('deviceorientation', onOrient);
    window.removeEventListener('click', onGesture);
    window.removeEventListener('touchstart', onGesture);
  };
}

// Reference-counted so multiple consumers (shadow hook + city scene) share one
// set of listeners and the source tears down only when the last one unmounts.
export function startTiltSource(): void {
  refCount += 1;
  if (cleanup) return;
  cleanup = window.matchMedia('(pointer: fine)').matches ? startPointer() : startGyro();
}

export function stopTiltSource(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0 || !cleanup) return;
  cleanup();
  cleanup = null;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

export function subscribeTilt(fn: (t: Tilt) => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function getTilt(): Tilt {
  return tilt;
}
