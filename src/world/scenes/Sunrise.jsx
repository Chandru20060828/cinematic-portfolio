import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Bob, Flowers, Forest, Glow, Mist, Sparks } from '../parts';
import { world } from '../world';
import { lerp, mulberry32, smooth } from '../util';
import { SUNRISE_X } from '../layout';
import { windowsTexture } from '../textures';
import { quality } from '../../quality';

function Skyline({ x }) {
  const ref = useRef();
  const mat = useRef();
  const n = Math.max(20, Math.round(120 * quality.density));
  const tex = useMemo(() => windowsTexture(9), []);
  useEffect(() => () => tex.dispose(), [tex]);
  useLayoutEffect(() => {
    const r = mulberry32(31);
    const d = new THREE.Object3D();
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const w = 3 + r() * 6;
      const h = 8 + r() * 36;
      d.position.set(x - 70 + r() * 140, h / 2, -52 - r() * 36);
      d.scale.set(w, h, w);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
      c.setHSL(0.72 + r() * 0.08, 0.35, 0.1 + r() * 0.05);
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [n, x]);
  useFrame(() => {
    mat.current.emissiveIntensity = lerp(1.0, 0.12, smooth(0.82, 0.93, world.p));
  });
  return (
    <instancedMesh ref={ref} args={[null, null, n]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={mat} emissive="#ffffff" emissiveMap={tex} roughness={0.6} metalness={0.3} />
    </instancedMesh>
  );
}

function Sun({ x }) {
  const g = useRef();
  const rays = useRef([]);
  useFrame(({ clock }) => {
    const rise = smooth(0.8, 0.94, world.p);
    g.current.position.set(x + 10, lerp(-12, 15, rise), -100);
    g.current.visible = rise > 0.001;
    if (!quality.reduced) rays.current.forEach((r, i) => r && (r.rotation.z = (i - 3) * 0.28 + Math.sin(clock.elapsedTime * 0.2 + i) * 0.03));
  });
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 256;
    const g2 = c.getContext('2d');
    const gr = g2.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, 'rgba(255,225,170,.85)');
    gr.addColorStop(1, 'rgba(255,225,170,0)');
    g2.fillStyle = gr;
    g2.fillRect(0, 0, 32, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[9, 32, 32]} />
        <meshBasicMaterial color="#ffd49a" fog={false} toneMapped={false} />
      </mesh>
      <Glow position={[0, 0, 0]} color="#ffb070" size={90} opacity={0.65} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <group key={i} ref={(el) => (rays.current[i] = el)}>
          <mesh position={[0, 38, 0]}>
            <planeGeometry args={[4 + (i % 3) * 2, 76]} />
            <meshBasicMaterial map={tex} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Scenes 8 & 9 — the calm sunrise city for the transformation, the contact area and the closing fade. */
export default function Sunrise() {
  const x = SUNRISE_X;
  const lan = useMemo(() => {
    const r = mulberry32(13);
    return Array.from({ length: 10 }, () => ({ x: x - 9 + r() * 18, y: 1 + r() * 7, z: -2 - r() * 9 }));
  }, [x]);
  return (
    <group>
      <Forest x0={x - 70} x1={x + 70} count={36} seed={41} kind="pine" clear={7} spread={18} leaf={['#2a3f5f', '#3a5577']} scale={[0.9, 1.6]} />
      <Flowers x0={x - 30} x1={x + 30} count={120} seed={8} colors={['#ffd28a', '#ffffff', '#ffb0c8']} />
      <Mist x={x} width={90} count={8} color="#ffc9a0" opacity={0.2} />
      <Skyline x={x} />
      <Sun x={x} />

      {/* a stone pad he stands on */}
      <mesh position={[x, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#3d3a5e" roughness={0.8} />
      </mesh>
      <mesh position={[x, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.4, 48]} />
        <meshBasicMaterial color="#ffd28a" toneMapped={false} />
      </mesh>

      {lan.map((l, i) => (
        <Bob key={i} speed={0.6 + i * 0.05} intensity={2} rotation={0}>
          <group position={[l.x, l.y, l.z]}>
            <mesh>
              <sphereGeometry args={[0.16, 10, 10]} />
              <meshBasicMaterial color="#ffd28a" toneMapped={false} />
            </mesh>
            <Glow position={[0, 0, 0]} color="#ffb070" size={2} opacity={0.7} />
          </group>
        </Bob>
      ))}
      <Sparks count={140} scale={[30, 12, 16]} position={[x, 5, -2]} size={3.4} speed={0.45} color="#ffe2b0" opacity={0.9} />
    </group>
  );
}
