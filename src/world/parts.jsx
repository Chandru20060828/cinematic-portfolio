import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { world } from './world';
import { smooth, mulberry32 } from './util';
import { placeholderTexture, softTexture, shaftTexture } from './textures';
import { quality } from '../quality';

export const FONT = '/fonts/Inter-SemiBold.woff';

/** Text that always uses the locally hosted font (works offline). */
export function T({ children, size = 0.4, color = '#ffffff', ...rest }) {
  return (
    <Text font={FONT} fontSize={size} color={color} anchorX="center" anchorY="middle" {...rest}>
      {children}
    </Text>
  );
}

/** Loads a photo; falls back to a labelled placeholder (also if the file is missing). */
export function usePhoto(src, label, aspect) {
  const placeholder = useMemo(() => placeholderTexture(label, aspect), [label, aspect]);
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!src) return undefined;
    let alive = true;
    let loaded = null;
    new THREE.TextureLoader().load(
      src,
      (t) => {
        if (!alive) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        const ia = t.image.width / t.image.height;
        if (ia > aspect) {
          t.repeat.x = aspect / ia;
          t.offset.x = (1 - t.repeat.x) / 2;
        } else {
          t.repeat.y = ia / aspect;
          t.offset.y = (1 - t.repeat.y) / 2;
        }
        loaded = t;
        setTex(t);
      },
      undefined,
      () => {}
    );
    return () => {
      alive = false;
      loaded?.dispose();
      setTex(null);
    };
  }, [src, aspect]);
  useEffect(() => () => placeholder.dispose(), [placeholder]);
  return tex || placeholder;
}

export function PhotoFrame({ src, label, w = 3, h = 2, accent = '#b79cff', caption, onClick, children, ...props }) {
  const tex = usePhoto(src, label, w / h);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!onClick) return undefined;
    document.body.style.cursor = hover ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover, onClick]);
  return (
    <group
      {...props}
      onClick={onClick ? (e) => (e.stopPropagation(), onClick(e)) : undefined}
      onPointerOver={onClick ? (e) => (e.stopPropagation(), setHover(true)) : undefined}
      onPointerOut={onClick ? () => setHover(false) : undefined}
    >
      <mesh position={[0, 0, -0.04]} castShadow>
        <boxGeometry args={[w + 0.3, h + 0.3, 0.08]} />
        <meshStandardMaterial color="#17122b" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, -0.07]}>
        <planeGeometry args={[w + 0.45, h + 0.45]} />
        <meshBasicMaterial color={accent} transparent opacity={hover ? 0.55 : 0.28} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {caption && (
        <T size={0.2} position={[0, -h / 2 - 0.42, 0.02]} maxWidth={w + 0.6} textAlign="center" outlineWidth={0.012} outlineColor="#000">
          {caption}
        </T>
      )}
      {children}
    </group>
  );
}

/** Scales its children in as the boy approaches `at` (world x) — photographs "develop" into view. */
export function Appear({ at, range = 14, floatY = 0.08, children, ...props }) {
  const g = useRef();
  const base = useRef(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    if (base.current === null) base.current = g.current.position.y;
    const d = Math.abs(world.x - at);
    const s = smooth(range, range * 0.45, d);
    g.current.visible = s > 0.01;
    g.current.scale.setScalar(Math.max(0.0001, s));
    if (!quality.reduced) g.current.position.y = base.current + Math.sin(clock.elapsedTime * 0.9 + at) * floatY;
  });
  return (
    <group ref={g} {...props}>
      {children}
    </group>
  );
}

/** Instanced forest (trunks + two foliage kinds) that leaves the central path clear. */
export function Forest({ x0, x1, count = 60, seed = 1, spread = 22, clear = 4.2, kind = 'pine', scale = [0.8, 1.5], leaf = ['#2f6b4b', '#3f8a5b'] }) {
  const trunk = useRef();
  const top = useRef();
  const n = Math.max(4, Math.round(count * quality.density));
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: n }, () => {
      const z = -(clear + r() * spread);
      return { x: x0 + r() * (x1 - x0), z, s: scale[0] + r() * (scale[1] - scale[0]), c: r() };
    });
  }, [n, x0, x1, seed, spread, clear, scale]);
  useLayoutEffect(() => {
    const d = new THREE.Object3D();
    const c1 = new THREE.Color(leaf[0]);
    const c2 = new THREE.Color(leaf[1]);
    const c = new THREE.Color();
    items.forEach((it, i) => {
      d.position.set(it.x, 0.9 * it.s, it.z);
      d.scale.set(it.s, it.s, it.s);
      d.rotation.set(0, it.c * 6, 0);
      d.updateMatrix();
      trunk.current.setMatrixAt(i, d.matrix);
      const h = kind === 'pine' ? 3.2 : 2.6;
      d.position.set(it.x, h * it.s + 0.4, it.z);
      d.updateMatrix();
      top.current.setMatrixAt(i, d.matrix);
      c.copy(c1).lerp(c2, it.c);
      top.current.setColorAt(i, c);
    });
    trunk.current.instanceMatrix.needsUpdate = true;
    top.current.instanceMatrix.needsUpdate = true;
    if (top.current.instanceColor) top.current.instanceColor.needsUpdate = true;
  }, [items, kind, leaf]);
  return (
    <group>
      <instancedMesh ref={trunk} args={[null, null, n]} frustumCulled={false} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 1.8, 6]} />
        <meshStandardMaterial color="#4a3426" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={top} args={[null, null, n]} frustumCulled={false} castShadow>
        {kind === 'pine' ? <coneGeometry args={[1.5, 4.2, 7]} /> : <icosahedronGeometry args={[1.7, 1]} />}
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  );
}

export function Flowers({ x0, x1, count = 200, seed = 4, colors = ['#ff8ab8', '#ffd28a', '#ffffff', '#b79cff'] }) {
  const ref = useRef();
  const n = Math.max(10, Math.round(count * quality.density));
  useLayoutEffect(() => {
    const r = mulberry32(seed);
    const d = new THREE.Object3D();
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const side = r() > 0.5 ? 1 : -1;
      d.position.set(x0 + r() * (x1 - x0), 0.12, side * (2.2 + r() * 9));
      d.scale.setScalar(0.6 + r() * 0.8);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
      c.set(colors[Math.floor(r() * colors.length)]);
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [n, x0, x1, seed, colors]);
  return (
    <instancedMesh ref={ref} args={[null, null, n]} frustumCulled={false}>
      <icosahedronGeometry args={[0.13, 0]} />
      <meshStandardMaterial roughness={0.6} emissiveIntensity={0.2} />
    </instancedMesh>
  );
}

/** Soft drifting mist sprites near the ground. */
export function Mist({ x, width = 60, count = 10, color = '#8fa0ff', opacity = 0.18, seed = 2, y = 1.2 }) {
  const tex = useMemo(() => softTexture(), []);
  const refs = useRef([]);
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({ x: (r() - 0.5) * width, z: -4 - r() * 26, s: 14 + r() * 16, ph: r() * 6 }));
  }, [count, width, seed]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame(({ clock }) => {
    if (quality.reduced) return;
    refs.current.forEach((s, i) => {
      if (s) s.position.x = x + items[i].x + Math.sin(clock.elapsedTime * 0.05 + items[i].ph) * 4;
    });
  });
  return (
    <group>
      {items.map((it, i) => (
        <sprite key={i} ref={(el) => (refs.current[i] = el)} position={[x + it.x, y, it.z]} scale={[it.s, it.s * 0.35, 1]}>
          <spriteMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

/** Additive "volumetric‑looking" light shaft. */
export function LightShaft({ position, rotation = [0, 0, 0.5], size = [3.5, 24], color = '#ffe2b0', opacity = 0.16 }) {
  const tex = useMemo(() => shaftTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Glow({ position, color = '#ffd28a', size = 3, opacity = 0.7 }) {
  const tex = useMemo(() => softTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
    </sprite>
  );
}

export function Lamp({ position, color = '#ffd8a0', h = 3.2 }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.07, 0.1, h, 8]} />
        <meshStandardMaterial color="#26243a" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, h + 0.15, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Glow position={[0, h + 0.15, 0]} color={color} size={2.4} opacity={0.55} />
    </group>
  );
}

/** Floating particles (respects reduced‑motion + mobile budget). */
export function Sparks({ count = 60, ...props }) {
  const n = Math.round(count * quality.sparkles);
  if (!n) return null;
  return <Sparkles count={n} {...props} />;
}

/** Gentle bobbing (frozen when the visitor prefers reduced motion). */
export function Bob({ children, speed = 1, intensity = 1, rotation = 0.4, ...props }) {
  return (
    <Float speed={quality.reduced ? 0 : speed} floatIntensity={quality.reduced ? 0 : intensity} rotationIntensity={quality.reduced ? 0 : rotation} {...props}>
      {children}
    </Float>
  );
}
