import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from './world';
import { lerp, smooth } from './util';
import { quality } from '../quality';

/**
 * The hero: an original, hand‑built, articulated character (hips → knees → ankles,
 * shoulders → elbows, head, face). Proportions, clothes and accessories are driven by
 * `world.age`, so the same rig grows from a small boy into a young developer.
 *
 * Want a Blender / GLB character instead? See README → "Swapping in your own character".
 */
export default function Boy() {
  const R = useRef({});
  const reg = (k) => (el) => {
    R.current[k] = el;
  };

  const M = useMemo(() => {
    const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
    return {
      skin: std('#e6ab84', { roughness: 0.6 }),
      hair: std('#17121f', { roughness: 0.55 }),
      tee: std('#ffb84d'),
      pants: std('#3d5aa8'),
      shoe: std('#ffffff', { roughness: 0.5 }),
      sole: std('#2a2a3a'),
      white: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      dark: new THREE.MeshBasicMaterial({ color: '#1a1020' }),
      cheek: new THREE.MeshBasicMaterial({ color: '#ff8aa0', transparent: true, opacity: 0.45, depthWrite: false }),
      mouth: new THREE.MeshBasicMaterial({ color: '#7a2a3a' }),
      bag: std('#e0556b'),
      frame: std('#14141f', { metalness: 0.7, roughness: 0.3 }),
      hood: std('#4a46b8'),
      aura: new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      ring: new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    };
  }, []);
  useEffect(() => () => Object.values(M).forEach((m) => m.dispose()), [M]);

  const col = useMemo(
    () => ({
      teeA: new THREE.Color('#ffb84d'),
      teeB: new THREE.Color('#3a3a8c'),
      pantsA: new THREE.Color('#3d5aa8'),
      pantsB: new THREE.Color('#1d2438'),
      shoeA: new THREE.Color('#ffffff'),
      shoeB: new THREE.Color('#d9d9ee'),
    }),
    []
  );

  useFrame((state, delta) => {
    const r = R.current;
    if (!r.root || !r.upper) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const a = world.age;
    const sit = world.sit;
    const walk = world.walk;
    const ph = world.phase;

    // ---- proportions (child → adult) ----
    const leg = lerp(0.5, 0.92, a);
    const thigh = leg * 0.5;
    const shin = leg * 0.5;
    const torsoH = lerp(0.46, 0.74, a);
    const headR = lerp(0.37, 0.27, a);
    const arm = lerp(0.42, 0.68, a);
    const up = arm * 0.5;
    const tw = lerp(0.52, 0.64, a);
    const sw = tw * 0.5 + 0.06;
    const limb = lerp(0.08, 0.09, a);
    const hw = tw * 0.26;

    // ---- root + body ----
    r.root.position.set(world.x, 0, world.z);
    r.root.rotation.y = world.yaw;
    const stand = leg + 0.1;
    const seated = leg * 0.5 + 0.17;
    const bob = Math.abs(Math.sin(ph)) * 0.05 * walk * (1 - sit);
    r.body.position.y = lerp(stand, seated, sit) + bob;
    r.upper.rotation.x = 0.22 * sit + 0.05 * walk;
    r.upper.rotation.z = Math.sin(ph) * 0.04 * walk;
    r.upper.scale.y = 1 + Math.sin(t * 1.8) * 0.012;

    // ---- torso & clothes ----
    r.torso.position.y = torsoH / 2;
    r.torso.scale.set(tw, torsoH / 2, tw * 0.78);
    r.neck.position.y = torsoH;
    r.neck.scale.set(0.07, 0.12, 0.07);
    const growUp = smooth(0.5, 0.95, a);
    M.tee.color.copy(col.teeA).lerp(col.teeB, growUp);
    M.pants.color.copy(col.pantsA).lerp(col.pantsB, growUp);
    M.shoe.color.copy(col.shoeA).lerp(col.shoeB, growUp);
    const hood = smooth(0.55, 0.95, a);
    r.hood.visible = hood > 0.02;
    r.hood.position.y = torsoH * 0.98;
    r.hood.scale.setScalar(Math.max(0.001, hood) * tw * 1.05);
    const bag = 1 - smooth(0.3, 0.46, a);
    r.bag.visible = bag > 0.02;
    r.bag.position.set(0, torsoH * 0.52, -(tw * 0.39 + 0.1));
    r.bag.scale.set(tw * 0.78 * bag, torsoH * 0.62 * bag, 0.22 * bag);

    // ---- head & face ----
    r.head.position.y = torsoH + headR * 0.78;
    r.head.scale.setScalar(headR);
    const lookCam = 1 - smooth(0.25, 1.3, Math.abs(world.yaw));
    r.head.rotation.y = state.pointer.x * 0.35 * lookCam + Math.sin(t * 0.5) * 0.06 * (1 - walk);
    r.head.rotation.x = -state.pointer.y * 0.18 * lookCam + Math.sin(t * 0.7) * 0.02 + 0.04 * walk;
    const blink = t % 3.7 < 0.12 ? 0.12 : 1;
    r.eyes.scale.set(lerp(1.2, 0.95, a), blink * lerp(1.2, 0.95, a), 1);
    r.cheeks.scale.setScalar(1 - smooth(0.2, 0.9, a) * 0.8);
    r.glasses.scale.setScalar(Math.max(0.001, smooth(0.88, 1, a)));
    r.glasses.visible = a > 0.88;
    r.ahoge.scale.setScalar(Math.max(0.001, 1 - smooth(0.3, 0.8, a)));
    r.hair.scale.setScalar(lerp(1.05, 1.1, a));

    // ---- arms ----
    const wave = smooth(0.915, 0.93, world.p) * (1 - smooth(0.95, 0.972, world.p));
    const swing = Math.sin(ph) * 0.75 * walk;
    const type = Math.sin(t * 16) * 0.035 + Math.sin(t * 9.3) * 0.02;
    for (const s of ['L', 'R']) {
      const dir = s === 'L' ? 1 : -1;
      const sh = r['sh' + s];
      sh.position.set(dir * sw, torsoH * 0.9, 0);
      let rx = lerp(dir * swing, -1.05 + type * dir, sit);
      let rz = dir * 0.07;
      let ex = lerp(-0.12 - 0.25 * walk, -0.8 + type, sit);
      if (s === 'R' && wave > 0.001) {
        rx = lerp(rx, 0, wave);
        rz = lerp(rz, -2.55 + Math.sin(t * 7) * 0.12, wave);
        ex = lerp(ex, 0, wave);
      }
      sh.rotation.set(rx, 0, rz);
      r['el' + s].position.y = -up;
      r['el' + s].rotation.set(ex, 0, s === 'R' ? Math.sin(t * 7) * 0.5 * wave : 0);
      r['up' + s].position.y = -up / 2;
      r['up' + s].scale.set(limb, up, limb);
      r['fo' + s].position.y = -up / 2;
      r['fo' + s].scale.set(limb * 0.9, up, limb * 0.9);
      r['ha' + s].position.y = -up;
      r['ha' + s].scale.setScalar(limb * 1.25);
      r['sj' + s].scale.setScalar(limb * 1.3);
      r['ej' + s].scale.setScalar(limb * 1.05);
    }

    // ---- legs ----
    for (const s of ['L', 'R']) {
      const dir = s === 'L' ? 1 : -1;
      const phase = s === 'L' ? ph : ph + Math.PI;
      const hip = r['hip' + s];
      hip.position.set(dir * hw, 0, 0);
      const fwd = Math.sin(phase) * 0.7 * walk;
      const knee = Math.max(0, Math.cos(phase)) * 0.95 * walk;
      hip.rotation.set(lerp(-fwd, -Math.PI / 2 + 0.03, sit), 0, dir * 0.02);
      r['kn' + s].position.y = -thigh;
      r['kn' + s].rotation.x = lerp(knee, Math.PI / 2 - 0.03, sit);
      r['th' + s].position.y = -thigh / 2;
      r['th' + s].scale.set(limb * 1.35, thigh, limb * 1.35);
      r['sh2' + s].position.y = -shin / 2;
      r['sh2' + s].scale.set(limb * 1.15, shin, limb * 1.15);
      r['kj' + s].scale.setScalar(limb * 1.4);
      r['sho' + s].position.set(0, -shin - 0.02, 0.06);
      r['sho' + s].scale.set(limb * 1.6, limb * 1.0, limb * 2.5);
    }

    // ---- growth flash ----
    const g = world.glow;
    M.aura.opacity = g * 0.2;
    r.aura.position.y = torsoH * 0.5 + 0.3;
    r.aura.scale.setScalar(1.5 + g * 0.9 + a * 0.5);
    const rt = smooth(0.83, 0.915, world.p);
    for (let i = 0; i < 2; i++) {
      const tt = Math.min(1, Math.max(0, rt * 1.25 - i * 0.18));
      r['ring' + i].scale.setScalar(0.6 + tt * 5.2);
      r['ring' + i].material.opacity = tt > 0 && tt < 1 ? (1 - tt) * 0.8 : 0;
    }
  });

  const arm = (s) => (
    <group key={s} ref={reg('sh' + s)}>
      <mesh ref={reg('sj' + s)} material={M.tee}>
        <sphereGeometry args={[1, 12, 10]} />
      </mesh>
      <mesh ref={reg('up' + s)} material={M.tee} castShadow>
        <cylinderGeometry args={[1, 1, 1, 10]} />
      </mesh>
      <group ref={reg('el' + s)}>
        <mesh ref={reg('ej' + s)} material={M.tee}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
        <mesh ref={reg('fo' + s)} material={M.skin} castShadow>
          <cylinderGeometry args={[1, 1, 1, 10]} />
        </mesh>
        <mesh ref={reg('ha' + s)} material={M.skin}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      </group>
    </group>
  );

  const leg = (s) => (
    <group key={s} ref={reg('hip' + s)}>
      <mesh ref={reg('th' + s)} material={M.pants} castShadow>
        <cylinderGeometry args={[1, 0.9, 1, 10]} />
      </mesh>
      <group ref={reg('kn' + s)}>
        <mesh ref={reg('kj' + s)} material={M.pants}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
        <mesh ref={reg('sh2' + s)} material={M.pants} castShadow>
          <cylinderGeometry args={[0.9, 0.8, 1, 10]} />
        </mesh>
        <mesh ref={reg('sho' + s)} material={M.shoe} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={reg('root')}>
      <group ref={reg('body')}>
        <group ref={reg('upper')}>
          <mesh ref={reg('torso')} material={M.tee} castShadow>
            <capsuleGeometry args={[0.5, 1, 6, 16]} />
          </mesh>
          <mesh ref={reg('neck')} material={M.skin}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
          </mesh>
          <mesh ref={reg('hood')} material={M.hood} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.12, 8, 18]} />
          </mesh>
          <mesh ref={reg('bag')} material={M.bag} castShadow>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <group ref={reg('head')}>
            <mesh material={M.skin} castShadow scale={[1, 1.05, 1]}>
              <sphereGeometry args={[1, 32, 24]} />
            </mesh>
            <group ref={reg('hair')}>
              <mesh material={M.hair} position={[0, 0.03, -0.04]} rotation={[-0.38, 0, 0]}>
                <sphereGeometry args={[1.045, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              <group ref={reg('ahoge')} position={[0.05, 1.02, 0.2]} rotation={[0.5, 0, -0.35]}>
                <mesh material={M.hair} position={[0, 0.2, 0]}>
                  <coneGeometry args={[0.1, 0.5, 8]} />
                </mesh>
              </group>
            </group>
            {[1, -1].map((s) => (
              <mesh key={s} material={M.skin} position={[s * 0.97, -0.02, 0]} scale={[0.14, 0.22, 0.16]}>
                <sphereGeometry args={[1, 10, 8]} />
              </mesh>
            ))}
            <group ref={reg('eyes')} position={[0, 0.08, 0]}>
              {[1, -1].map((s) => (
                <group key={s} position={[s * 0.37, 0, 0.87]}>
                  <mesh material={M.white} scale={[1, 1.15, 0.6]}>
                    <sphereGeometry args={[0.17, 14, 12]} />
                  </mesh>
                  <mesh material={M.dark} position={[0, -0.01, 0.08]} scale={[1, 1.1, 0.5]}>
                    <sphereGeometry args={[0.1, 12, 10]} />
                  </mesh>
                  <mesh material={M.white} position={[-0.035, 0.04, 0.115]}>
                    <sphereGeometry args={[0.028, 8, 6]} />
                  </mesh>
                </group>
              ))}
            </group>
            {[1, -1].map((s) => (
              <mesh key={s} material={M.hair} position={[s * 0.37, 0.4, 0.9]} rotation={[0.2, 0, -s * 0.1]} scale={[0.2, 0.035, 0.05]}>
                <sphereGeometry args={[1, 8, 6]} />
              </mesh>
            ))}
            <mesh material={M.skin} position={[0, -0.06, 0.99]} scale={[0.8, 0.9, 0.8]}>
              <sphereGeometry args={[0.07, 8, 6]} />
            </mesh>
            <mesh material={M.mouth} position={[0, -0.33, 0.93]} rotation={[0.28, 0, Math.PI]}>
              <torusGeometry args={[0.2, 0.03, 8, 20, Math.PI]} />
            </mesh>
            <group ref={reg('cheeks')}>
              {[1, -1].map((s) => (
                <mesh key={s} material={M.cheek} position={[s * 0.56, -0.18, 0.78]} scale={[1, 0.7, 0.35]}>
                  <sphereGeometry args={[0.13, 10, 8]} />
                </mesh>
              ))}
            </group>
            <group ref={reg('glasses')} position={[0, 0.08, 0.93]}>
              {[1, -1].map((s) => (
                <mesh key={s} material={M.frame} position={[s * 0.37, 0, 0]}>
                  <torusGeometry args={[0.24, 0.032, 8, 24]} />
                </mesh>
              ))}
              <mesh material={M.frame} scale={[0.13, 0.03, 0.03]}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
            </group>
          </group>

          {arm('L')}
          {arm('R')}
        </group>
        {leg('L')}
        {leg('R')}
        <mesh ref={reg('aura')} material={M.aura}>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      </group>
      {[0, 1].map((i) => (
        <mesh key={i} ref={reg('ring' + i)} material={M.ring.clone()} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[0.92, 1, 64]} />
        </mesh>
      ))}
    </group>
  );
}
