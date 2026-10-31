const nav = typeof navigator !== 'undefined' ? navigator : { userAgent: '' };
const win = typeof window !== 'undefined' ? window : null;

const coarse = !!win && win.matchMedia && win.matchMedia('(pointer: coarse)').matches;
export const mobile = /Android|iPhone|iPad|iPod/i.test(nav.userAgent) || (coarse && (win?.innerWidth ?? 1200) < 900);
export const reduced = !!win && win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const quality = {
  mobile,
  reduced,
  dpr: mobile ? [1, 1.5] : [1, 1.75],
  shadowMap: mobile ? 1024 : 2048,
  density: mobile ? 0.55 : 1, // trees, flowers, towers…
  sparkles: reduced ? 0 : mobile ? 0.5 : 1,
};

export function hasWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
