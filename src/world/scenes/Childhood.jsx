import { Forest, Flowers, Glow, Mist, Sparks, Bob, T } from '../parts';
import * as THREE from 'three';

const books = [
  { x: 16, y: 2.1, z: -2.4, c: '#ff6b81' },
  { x: 23, y: 2.6, z: -3.4, c: '#4fd8ff' },
  { x: 31, y: 2.0, z: -2.6, c: '#ffd28a' },
  { x: 44, y: 2.4, z: -3.2, c: '#b79cff' },
];
const glyphs = [
  { x: 17, y: 4.4, z: -4, t: '{ }' },
  { x: 19, y: 5.2, z: -5, t: '</>' },
  { x: 27, y: 4.2, z: -4.5, t: '01' },
  { x: 41, y: 5, z: -5, t: '=>' },
  { x: 47, y: 4.2, z: -4, t: '( )' },
];

function House({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 3.6, 5]} />
        <meshStandardMaterial color="#f0dfc2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[4.9, 2.8, 4]} />
        <meshStandardMaterial color="#b5533c" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[1.7, 5.6, -0.8]}>
        <boxGeometry args={[0.7, 1.6, 0.7]} />
        <meshStandardMaterial color="#8c4332" />
      </mesh>
      <mesh position={[0, 1, 2.52]}>
        <boxGeometry args={[1.1, 2, 0.1]} />
        <meshStandardMaterial color="#7a4a2e" />
      </mesh>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 2.1, 2.52]}>
          <boxGeometry args={[1.1, 1.1, 0.08]} />
          <meshBasicMaterial color="#ffd28a" toneMapped={false} />
        </mesh>
      ))}
      <Glow position={[0, 2.1, 3.2]} color="#ffb86a" size={9} opacity={0.35} />
      <pointLight position={[0, 2.2, 4]} color="#ffb86a" intensity={10} distance={10} decay={2} />
    </group>
  );
}

/** Scene 2 — a warm, dreamy childhood: meadow, a little house, a kite, books and the first glimmers of code. */
export default function Childhood() {
  return (
    <group>
      <Forest x0={4} x1={56} count={64} seed={11} kind="round" clear={5} spread={20} leaf={['#3b8a5a', '#58a867']} scale={[0.8, 1.5]} />
      <Flowers x0={4} x1={56} count={260} seed={5} />
      <Mist x={30} width={60} count={8} color="#d7a8ff" opacity={0.16} />
      <House position={[37, 0, -8]} />

      {/* fence */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[29 + i * 1.3, 0.5, -4.4]} castShadow>
          <boxGeometry args={[0.12, 1, 0.12]} />
          <meshStandardMaterial color="#e8d9bd" />
        </mesh>
      ))}
      <mesh position={[35.5, 0.75, -4.4]}>
        <boxGeometry args={[13.2, 0.1, 0.08]} />
        <meshStandardMaterial color="#e8d9bd" />
      </mesh>

      {/* a kite caught in the evening wind */}
      <Bob speed={0.7} intensity={2} rotation={0.2}>
        <group position={[22, 8.5, -9]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[1.8, 1.8]} />
            <meshStandardMaterial color="#ff5d7a" side={THREE.DoubleSide} emissive="#ff3355" emissiveIntensity={0.3} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[-0.5 - i * 0.45, -1.2 - i * 0.4, 0]} rotation={[0, 0, 0.7]}>
              <boxGeometry args={[0.3, 0.1, 0.04]} />
              <meshBasicMaterial color={i % 2 ? '#ffd28a' : '#4fd8ff'} />
            </mesh>
          ))}
        </group>
      </Bob>

      {/* floating books — curiosity */}
      {books.map((b, i) => (
        <Bob key={i} speed={1 + i * 0.2} intensity={1.2} rotation={0.6}>
          <group position={[b.x, b.y, b.z]} rotation={[0.2, i, 0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.95, 0.16, 0.7]} />
              <meshStandardMaterial color={b.c} roughness={0.5} />
            </mesh>
            <mesh position={[0.03, 0, 0]}>
              <boxGeometry args={[0.88, 0.12, 0.62]} />
              <meshStandardMaterial color="#fff6e4" />
            </mesh>
            <Glow position={[0, 0.2, 0]} color={b.c} size={2.6} opacity={0.35} />
          </group>
        </Bob>
      ))}

      {/* the first sparks of code */}
      {glyphs.map((g, i) => (
        <Bob key={i} speed={0.6 + i * 0.1} intensity={1} rotation={0}>
          <T position={[g.x, g.y, g.z]} size={0.95} color="#cdbaff" fillOpacity={0.6} outlineWidth={0.02} outlineColor="#5a3fd0">
            {g.t}
          </T>
        </Bob>
      ))}

      {/* an idea — a lightbulb */}
      <Bob speed={1.2} intensity={0.8} rotation={0}>
        <group position={[17, 3.6, -1.8]}>
          <mesh>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshBasicMaterial color="#fff2b0" toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 0.28, 10]} />
            <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} />
          </mesh>
          <Glow position={[0, 0, 0]} color="#ffe48a" size={4.5} opacity={0.8} />
        </group>
      </Bob>

      <Sparks count={150} scale={[56, 7, 16]} position={[30, 3, -3]} size={3.2} speed={0.3} color="#ffe9a8" opacity={0.9} />
    </group>
  );
}
