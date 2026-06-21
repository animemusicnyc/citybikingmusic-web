import { useEffect } from 'preact/hooks';
import { startTiltSource, stopTiltSource, subscribeTilt } from '../lib/tilt';

// Drives the page-wide drop shadows from the shared tilt source: mouse on
// desktop, gyroscope on mobile. The shadow falls opposite the "light", which we
// treat as wherever the pointer/tilt is pointing.
export function useShadow() {
  useEffect(() => {
    const root = document.documentElement;
    const maxOffset = 7; // px the shadow can throw — kept tight so it stays attached
    // feOffset + feTurbulence nodes for the SVG (glyph-contoured) shadows.
    const svgOffsets = ['gs-w-off', 'gs-r-off']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    const svgTurb = ['gs-w-turb', 'gs-r-turb']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    startTiltSource();
    const unsubscribe = subscribeTilt((t) => {
      const ox = -t.x * maxOffset;
      const oy = -t.y * maxOffset;
      root.style.setProperty('--sx', `${ox.toFixed(1)}px`);
      root.style.setProperty('--sy', `${oy.toFixed(1)}px`);
      root.style.setProperty('--si', t.dist.toFixed(3));
      root.style.setProperty('--gx', `${t.gx.toFixed(0)}px`);
      root.style.setProperty('--gy', `${t.gy.toFixed(0)}px`);
      for (const node of svgOffsets) {
        node.setAttribute('dx', ox.toFixed(1));
        node.setAttribute('dy', oy.toFixed(1));
      }
      for (const node of svgTurb) node.setAttribute('seed', String(t.seed));
    });

    return () => {
      unsubscribe();
      stopTiltSource();
    };
  }, []);
}
