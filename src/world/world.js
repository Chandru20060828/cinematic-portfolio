import * as THREE from 'three';

/** Shared, mutable story state. Written once per frame by the Rig, read everywhere else. */
export const world = {
  target: 0, // raw scroll progress 0..1 (from ScrollTrigger)
  p: 0, // damped progress actually shown
  x: 0,
  z: 0,
  yaw: 0,
  age: 0,
  sit: 0,
  mtn: 1,
  night: 1,
  glow: 0,
  speed: 0,
  walk: 0,
  phase: 0,
  camX: 0,
  focusAmt: 0,
  focusP0: 0,
  pal: {
    top: new THREE.Color('#050818'),
    hor: new THREE.Color('#1b2260'),
    key: new THREE.Color('#9fb4ff'),
    keyI: 1,
    hs: new THREE.Color('#6f80d8'),
    hg: new THREE.Color('#15182f'),
    hI: 0.6,
    ground: new THREE.Color('#141a3d'),
    rim: new THREE.Color('#7a5cff'),
  },
};

if (typeof window !== 'undefined' && /[?&]debug/.test(window.location.search)) window.__world = world;
