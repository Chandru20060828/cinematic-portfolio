import * as THREE from 'three';
import { monotone, smooth } from './util';
import { world } from './world';

/* ---------------------------------------------------------------------------
   Chapters — `start` is the scroll progress (0..1) where each chapter begins.
   --------------------------------------------------------------------------- */
export const CHAPTERS = [
  { id: 'beginning', label: 'The Beginning', start: 0 },
  { id: 'about', label: 'About Me', start: 0.09 },
  { id: 'school', label: 'School', start: 0.2 },
  { id: 'college', label: 'College', start: 0.31 },
  { id: 'projects', label: 'Projects', start: 0.42 },
  { id: 'internship', label: 'Internship', start: 0.58 },
  { id: 'skills', label: 'Skills', start: 0.68 },
  { id: 'transformation', label: 'The Reveal', start: 0.77 },
  { id: 'contact', label: 'Contact', start: 0.91 },
];
export const chapterRange = (i) => [CHAPTERS[i].start, CHAPTERS[i + 1] ? CHAPTERS[i + 1].start : 1];
export const chapterAt = (p) => {
  let c = 0;
  for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].start - 1e-6) c = i;
  return c;
};
export const chapterCenter = (i) => {
  const [a, b] = chapterRange(i);
  return a + (b - a) * 0.12;
};

const H = Math.PI / 2;

/*  p      x     yaw  sit mtn night fov   camera offset (from boy)   look offset */
const K = [
  [0.0, 0, 0, 0, 1, 1, 50, 0, 2.6, 13, 0, 1.5, 0],
  [0.08, 0, 0, 0, 1, 1, 44, 0.5, 1.4, 4.8, 0, 1.1, 0],
  [0.1, 0.4, 0.9, 0, 1, 1, 46, 2.4, 1.5, 5.8, 1.4, 1.2, 0],
  [0.13, 6, H, 0, 1, 0.9, 48, 1.8, 1.5, 6.8, 3.5, 1.25, 0],
  [0.165, 23, H, 0, 1, 0.6, 46, -1.5, 1.1, 5.2, 3.5, 1.5, 0],
  [0.2, 40, H, 0, 1, 0.1, 48, 2.5, 1.5, 6.5, 4, 1.3, 0],
  [0.24, 58, H, 0, 1, 0, 50, 0, 1.8, 7, 3, 2.2, -1],
  [0.27, 73.5, H, 0, 1, 0, 50, -1, 1.9, 7.8, 4, 1.9, -3],
  [0.31, 92, H, 0, 1, 0, 50, 2.5, 1.7, 7, 4, 1.6, -1],
  [0.36, 118, H, 0, 1, 0, 52, 0, 2.3, 8.5, 4, 2.2, -2.5],
  [0.42, 150, H, 0, 1, 0, 50, 2, 1.9, 7.5, 4, 1.8, -1],
  [0.46, 168, H, 0, 0, 0.9, 50, 0, 2.2, 8, 4, 2.5, -3],
  [0.52, 196, H, 0, 0, 1, 50, 1, 2.4, 8.5, 3, 2.6, -3],
  [0.575, 222, H, 0, 0, 1, 50, 3, 1.8, 7, 5, 1.6, -1],
  [0.6, 236, H, 0, 0, 1, 50, 3, 1.7, 6.5, 5, 1.7, -1],
  [0.62, 246, H, 0, 0, 1, 50, 3.2, 1.9, 5.6, 0, 1.5, -1.2],
  [0.634, 250, H, 0, 0, 1, 48, 3.8, 1.9, 5.2, 0, 1.5, -1.2],
  [0.646, 250, Math.PI, 1, 0, 1, 46, 4.2, 1.9, 4.6, 0, 1.4, -1.2],
  [0.664, 250, Math.PI, 1, 0, 1, 46, 4.2, 1.9, 4.6, 0, 1.4, -1.2],
  [0.672, 250, Math.PI, 0, 0, 1, 48, 3.5, 1.8, 5.5, 0, 1.4, -1],
  [0.682, 252, H, 0, 0, 1, 50, 2, 1.7, 6, 4, 1.6, 0],
  [0.7, 270, H, 0, 0, 1, 50, 2.5, 1.8, 7.5, 3, 1.6, 0],
  [0.74, 296, H, 0, 0, 1, 52, 3, 2.3, 10, 0.5, 1.9, 0],
  [0.77, 310, H, 0, 0.6, 1, 50, 2.5, 1.9, 8, 3, 1.6, 0],
  [0.79, 318, H, 0, 1, 0.5, 50, 3, 1.5, 7, 3, 1.4, 0],
  [0.805, 322, H, 0, 1, 0.2, 50, 3, 1.5, 7, 3, 1.4, 0],
  [0.83, 322, 0, 0, 1, 0, 48, 0, 1.6, 6.8, 0, 1.35, 0],
  [0.86, 322, 0, 0, 1, 0, 45, 0, 1.8, 5.5, 0, 1.5, 0],
  [0.885, 322, 0, 0, 1, 0, 42, 0.2, 2.0, 4.9, 0, 1.8, 0],
  [0.91, 322, 0, 0, 1, 0, 46, 0.6, 2.1, 6.4, 1.2, 2.0, 0],
  [0.96, 322, 0, 0, 1, 0, 48, 0, 2.4, 9, 3.4, 2.3, 0],
  [1.0, 322, 0, 0, 1, 0, 50, 0, 2.8, 11, 3.6, 2.6, 0],
];

const col = (i) => K.map((k) => k[i]);
const ps = col(0);
const ch = {
  x: monotone(ps, col(1)),
  yaw: monotone(ps, col(2)),
  sit: monotone(ps, col(3)),
  mtn: monotone(ps, col(4)),
  night: monotone(ps, col(5)),
  fov: monotone(ps, col(6)),
  cx: monotone(ps, col(7)),
  cy: monotone(ps, col(8)),
  cz: monotone(ps, col(9)),
  lx: monotone(ps, col(10)),
  ly: monotone(ps, col(11)),
  lz: monotone(ps, col(12)),
};

// The little boy grows up (0 = child, 1 = adult). Slow through school & college, then the big moment.
const AGE = [
  [0, 0], [0.2, 0.02], [0.31, 0.12], [0.34, 0.24], [0.42, 0.36], [0.58, 0.46],
  [0.68, 0.5], [0.77, 0.5], [0.83, 0.52], [0.88, 1], [1, 1],
];
const ageCh = monotone(AGE.map((a) => a[0]), AGE.map((a) => a[1]));

export const sample = {
  fov: 50,
  cam: new THREE.Vector3(),
  look: new THREE.Vector3(),
};

export function sampleTimeline(p) {
  world.x = ch.x(p);
  world.yaw = ch.yaw(p);
  world.sit = Math.min(1, Math.max(0, ch.sit(p)));
  world.mtn = Math.min(1, Math.max(0, ch.mtn(p)));
  world.night = Math.min(1, Math.max(0, ch.night(p)));
  world.age = Math.min(1, Math.max(0, ageCh(p)));
  world.glow = smooth(0.83, 0.865, p) * (1 - smooth(0.865, 0.915, p));
  sample.fov = ch.fov(p);
  sample.cam.set(world.x + ch.cx(p), ch.cy(p), ch.cz(p));
  sample.look.set(world.x + ch.lx(p), ch.ly(p), ch.lz(p));
}

/* ---------------------------------------------------------------------------
   Palette — sky, fog, light and ground colours through the story.
   --------------------------------------------------------------------------- */
const C = (h) => new THREE.Color(h);
const P = [
  { p: 0.0, top: '#050818', hor: '#1b2260', key: '#9fb4ff', keyI: 0.9, hs: '#6f80d8', hg: '#15182f', hI: 0.55, ground: '#141a3d', rim: '#7a5cff' },
  { p: 0.14, top: '#1c1b4d', hor: '#6a4a8a', key: '#ffc88e', keyI: 1.3, hs: '#a98cd6', hg: '#2f3a3a', hI: 0.6, ground: '#2f5b4b', rim: '#ff9ad8' },
  { p: 0.25, top: '#4d73c4', hor: '#b7cdf0', key: '#fff0d0', keyI: 2.0, hs: '#bcd5ff', hg: '#4d6a45', hI: 0.8, ground: '#527f54', rim: '#9ad0ff' },
  { p: 0.37, top: '#5f7fbe', hor: '#f1d9b0', key: '#ffd8a0', keyI: 2.2, hs: '#cfdcff', hg: '#5b5a3a', hI: 0.8, ground: '#4f7c4a', rim: '#ffcf9a' },
  { p: 0.46, top: '#05041a', hor: '#1b0f4a', key: '#8d6bff', keyI: 1.1, hs: '#5b6bff', hg: '#0a0a2a', hI: 0.5, ground: '#090a1f', rim: '#00e5ff' },
  { p: 0.63, top: '#070b18', hor: '#13203a', key: '#cfe8ff', keyI: 1.3, hs: '#7aa8ff', hg: '#10172a', hI: 0.7, ground: '#111a2c', rim: '#37d5ff' },
  { p: 0.73, top: '#04040e', hor: '#150f33', key: '#c3a8ff', keyI: 1.0, hs: '#6a5cff', hg: '#0a0a1a', hI: 0.5, ground: '#0b0c1c', rim: '#ff6ad5' },
  { p: 0.8, top: '#0d0a2a', hor: '#3a2457', key: '#ffb27a', keyI: 1.0, hs: '#8a6bd0', hg: '#2a2440', hI: 0.5, ground: '#262a45', rim: '#ffb27a' },
  { p: 0.88, top: '#4b3a85', hor: '#ffa56b', key: '#ffd08a', keyI: 2.4, hs: '#ffcba3', hg: '#4a3d55', hI: 0.75, ground: '#3a3a5c', rim: '#ffd7a0' },
  { p: 0.95, top: '#2b2a6a', hor: '#ffc58e', key: '#ffe0a8', keyI: 2.0, hs: '#ffd9b8', hg: '#44406a', hI: 0.7, ground: '#35365c', rim: '#ffe0a8' },
  { p: 1.0, top: '#14123a', hor: '#7a5a9a', key: '#ffd8a0', keyI: 1.6, hs: '#d9b8c8', hg: '#34305a', hI: 0.6, ground: '#2a2a50', rim: '#ffd8a0' },
].map((e) => ({ ...e, top: C(e.top), hor: C(e.hor), key: C(e.key), hs: C(e.hs), hg: C(e.hg), ground: C(e.ground), rim: C(e.rim) }));

export function samplePalette(p) {
  let i = 0;
  while (i < P.length - 2 && p >= P[i + 1].p) i++;
  const a = P[i];
  const b = P[i + 1];
  const t = smooth(a.p, b.p, p);
  const o = world.pal;
  o.top.copy(a.top).lerp(b.top, t);
  o.hor.copy(a.hor).lerp(b.hor, t);
  o.key.copy(a.key).lerp(b.key, t);
  o.hs.copy(a.hs).lerp(b.hs, t);
  o.hg.copy(a.hg).lerp(b.hg, t);
  o.ground.copy(a.ground).lerp(b.ground, t);
  o.rim.copy(a.rim).lerp(b.rim, t);
  o.keyI = a.keyI + (b.keyI - a.keyI) * t;
  o.hI = a.hI + (b.hI - a.hI) * t;
}
