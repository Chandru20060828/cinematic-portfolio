import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Forest, Glow, Lamp, Mist, Sparks, Bob } from '../parts';
import { mulberry32 } from '../util';
import { quality } from '../../quality';

const orbs = (() => {
  const r = mulberry32(9);
  return Array.from({ length: 8 }, () => ({ x: -9 + r() * 20, y: 1.6 + r() * 4.5, z: -2 - r() * 7, s: 0.12 + r() * 0.12 }));
})();

const rocks = [[-5, -3.2, 0.9], [5.5, -4, 1.2], [9, -2.6, 0.6], [-9, -5, 1.4]];

/** Scene 1 — a quiet, magical night at the very beginning. */
export default function Beginning() {
  const r1 = useRef();
  const r2 = useRef();
  useFrame((_, dt) => {
    if (quality.reduced) return;
    r1.current.rotation.z += dt * 0.15;
    r2.current.rotation.z -= dt * 0.1;
  });
  return (
    <group>
      {/* the moon */}
      <mesh position={[-26, 32, -100]}>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial color="#f4f1ff" fog={false} toneMapped={false} />
      </mesh>
      <Glow position={[-26, 32, -100]} color="#9fb4ff" size={70} opacity={0.5} />

      <Forest x0={-34} x1={34} count={34} seed={3} kind="pine" clear={6} spread={26} leaf={['#1d4a52', '#265a63']} scale={[0.9, 1.7]} />
      <Mist x={0} width={70} count={9} color="#7f8cff" opacity={0.2} />

      {/* a magic circle he is standing in */}
      <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={r1}>
          <ringGeometry args={[2.1, 2.17, 6]} />
          <meshBasicMaterial color="#9d86ff" transparent opacity={0.9} toneMapped={false} />
        </mesh>
        <mesh ref={r2}>
          <ringGeometry args={[3.1, 3.14, 48]} />
          <meshBasicMaterial color="#4fd8ff" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[2.1, 48]} />
          <meshBasicMaterial color="#7a5cff" transparent opacity={0.14} depthWrite={false} />
        </mesh>
      </group>

      {rocks.map(([x, z, s], i) => (
        <mesh key={i} position={[x, s * 0.4, z]} scale={s} castShadow>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#2a2f55" roughness={1} flatShading />
        </mesh>
      ))}

      {orbs.map((o, i) => (
        <Bob key={i} speed={0.8 + i * 0.1} intensity={1.4} rotation={0}>
          <group position={[o.x, o.y, o.z]}>
            <mesh>
              <sphereGeometry args={[o.s, 12, 12]} />
              <meshBasicMaterial color="#ffd28a" toneMapped={false} />
            </mesh>
            <Glow position={[0, 0, 0]} color="#ffb86a" size={1.8} opacity={0.7} />
          </group>
        </Bob>
      ))}

      <Lamp position={[3.6, 0, -2.4]} color="#ffc27a" h={2.6} />
      <pointLight position={[-1.5, 2.4, 3]} color="#ffb77a" intensity={14} distance={10} decay={2} />
      <Sparks count={130} scale={[34, 9, 20]} position={[0, 4, -4]} size={3} speed={0.25} color="#ffd9a0" opacity={0.9} />
    </group>
  );
}
