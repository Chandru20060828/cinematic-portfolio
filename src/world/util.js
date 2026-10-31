export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Monotone cubic (Fritsch–Carlson) interpolation. Flat holds stay flat and nothing
 * overshoots, which is exactly what we want for a camera that walks, then rests.
 */
export function monotone(ps, ys) {
  const n = ps.length;
  const d = new Array(n - 1);
  const m = new Array(n);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (ps[i + 1] - ps[i]);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / d[i];
      const b = m[i + 1] / d[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * d[i];
        m[i + 1] = t * b * d[i];
      }
    }
  }
  let seg = 0;
  return (p) => {
    if (p <= ps[0]) return ys[0];
    if (p >= ps[n - 1]) return ys[n - 1];
    if (!(p >= ps[seg] && p < ps[seg + 1])) {
      seg = 0;
      while (seg < n - 2 && p >= ps[seg + 1]) seg++;
    }
    const h = ps[seg + 1] - ps[seg];
    const t = (p - ps[seg]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[seg] +
      (t3 - 2 * t2 + t) * h * m[seg] +
      (-2 * t3 + 3 * t2) * ys[seg + 1] +
      (t3 - t2) * h * m[seg + 1]
    );
  };
}

export const isPlaceholder = (s) => typeof s === 'string' && /^\[.*\]$/.test(s.trim());
