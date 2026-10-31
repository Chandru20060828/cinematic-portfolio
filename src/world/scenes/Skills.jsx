import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Glow, Sparks, T } from '../parts';
import { skillGroups } from '../../data/story';
import { world } from '../world';
import { smooth } from '../util';
import { quality } from '../../quality';

const TILT = [[0.3, 0], [-0.35, 0.3], [0.55, -0.25], [-0.5, -0.4], [0.2, 0.5]];
const SPEED = [0.35, -0.28, 0.22, -0.4, 0.3];

function Item({ label, color, angle, radius }) {
  const [hover, setHover] = useState(false);
  const g = useRef();
  useFrame((_, dt) => {
    const s = hover ? 1.35 : 1;
    g.current.scale.x += (s - g.current.scale.x) * Math.min(1, dt * 10);
    g.current.scale.setScalar(g.current.scale.x);
  });
  return (
    <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
      <group ref={g} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={() => setHover(false)}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} roughness={0.3} flatShading />
        </mesh>
        <Glow position={[0, 0, 0]} color={color} size={2.2} opacity={0.6} />
        <Billboard position={[0, -0.62, 0]}>
          <T size={0.3} color="#ffffff" outlineWidth={0.03} outlineColor="#0a0820">
            {label}
          </T>
        </Billboard>
      </group>
    </group>
  );
}

/** Scene 7 — skills as glowing objects orbiting the character, one ring per category. */
export default function Skills() {
  const root = useRef();
  const rings = useRef([]);
  const pad = useRef();
  useFrame((_, dt) => {
    const k = smooth(0.68, 0.71, world.p) * (1 - smooth(0.765, 0.79, world.p));
    root.current.visible = k > 0.01;
    root.current.position.set(world.x, 1.25, 0);
    root.current.scale.setScalar(Math.max(0.0001, k));
    if (!quality.reduced)
      rings.current.forEach((r, i) => {
        if (r) r.rotation.y += dt * SPEED[i % 5];
      });
    pad.current.rotation.z += quality.reduced ? 0 : dt * 0.3;
  });
  return (
    <group ref={root}>
      <mesh ref={pad} position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.5, 6]} />
        <meshBasicMaterial color="#8b6cff" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {skillGroups.map((grp, gi) => {
        const R = 2.5 + gi * 0.95;
        const [tx, tz] = TILT[gi % 5];
        return (
          <group key={grp.id} rotation={[tx, 0, tz]}>
            <group ref={(el) => (rings.current[gi] = el)}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[R, 0.012, 6, 96]} />
                <meshBasicMaterial color={grp.color} transparent opacity={0.45} toneMapped={false} />
              </mesh>
              {grp.items.map((label, i) => (
                <Item key={label} label={label} color={grp.color} radius={R} angle={(i / grp.items.length) * Math.PI * 2 + gi} />
              ))}
            </group>
          </group>
        );
      })}
      <Sparks count={120} scale={[14, 8, 14]} size={3} speed={0.4} color="#c9b8ff" opacity={0.8} />
    </group>
  );
}
