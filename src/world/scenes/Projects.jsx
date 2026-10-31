import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Appear, Glow, Sparks, T } from '../parts';
import { projects } from '../../data/story';
import { PROJECT_DX, PROJECT_X0, projectPos } from '../layout';
import { gridTexture, makeProjectCanvas, windowsTexture } from '../textures';
import { mulberry32, damp } from '../util';
import { store } from '../../store';
import { quality } from '../../quality';

/* ---------- digital city ---------- */
function Skyline() {
  const ref = useRef();
  const n = Math.max(20, Math.round(110 * quality.density));
  const tex = useMemo(() => windowsTexture(3), []);
  useEffect(() => () => tex.dispose(), [tex]);
  useLayoutEffect(() => {
    const r = mulberry32(77);
    const d = new THREE.Object3D();
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const z = -(18 + r() * 52);
      const w = 2 + r() * 5;
      const h = 6 + r() * 26 + (-z - 18) * 0.35;
      d.position.set(146 + r() * 112, h / 2, z);
      d.scale.set(w, h, w);
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
      c.setHSL(0.66 + r() * 0.12, 0.5, 0.08 + r() * 0.06);
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [n]);
  return (
    <instancedMesh ref={ref} args={[null, null, n]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1.15} roughness={0.5} metalness={0.4} />
    </instancedMesh>
  );
}

function NeonBeams() {
  const items = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 14 }, (_, i) => ({
      x: 152 + i * 7.5 + r() * 3,
      z: -14 - r() * 18,
      c: ['#4fd8ff', '#b79cff', '#ff6ad5'][i % 3],
      h: 30 + r() * 30,
    }));
  }, []);
  return (
    <group>
      {items.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, b.h, 6]} />
            <meshBasicMaterial color={b.c} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <Glow position={[0, 1, 0]} color={b.c} size={5} opacity={0.5} />
        </group>
      ))}
    </group>
  );
}

function CyberFloor() {
  const tex = useMemo(() => {
    const t = gridTexture();
    t.repeat.set(86 / 3, 60 / 3);
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[192, 0.022, -12]}>
      <planeGeometry args={[86, 60]} />
      <meshBasicMaterial map={tex} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Portal({ x }) {
  const a = useRef();
  const b = useRef();
  useFrame((_, dt) => {
    if (quality.reduced) return;
    a.current.rotation.z += dt * 0.5;
    b.current.rotation.z -= dt * 0.8;
  });
  return (
    <group position={[x, 3.6, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh ref={a}>
        <torusGeometry args={[3.6, 0.14, 16, 64]} />
        <meshBasicMaterial color="#4fd8ff" toneMapped={false} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[3.1, 0.05, 8, 6]} />
        <meshBasicMaterial color="#ff6ad5" toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[3.5, 48]} />
        <meshBasicMaterial color="#6f5cff" transparent opacity={0.13} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <Glow position={[0, 0, 0]} color="#7a6cff" size={14} opacity={0.35} />
    </group>
  );
}

/* ---------- holographic project display ---------- */
function useProjectTexture(project) {
  const data = useMemo(() => makeProjectCanvas(project, null), [project]);
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(data.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [data]);
  useEffect(() => {
    if (!project.image) return undefined;
    const img = new Image();
    img.onload = () => {
      data.redraw(img);
      tex.needsUpdate = true;
    };
    img.src = project.image;
    return () => {
      img.onload = null;
    };
  }, [project.image, data, tex]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

const MINI = [
  [0, 0, 0.5, 0.9], [0.55, 0.2, 0.3, 0.5], [-0.5, 0.25, 0.32, 0.7], [0.2, -0.5, 0.4, 0.4], [-0.3, -0.45, 0.28, 1.1], [0.6, -0.4, 0.26, 0.3],
];

function Holo({ project, index }) {
  const pos = projectPos(index);
  const tex = useProjectTexture(project);
  const [hover, setHover] = useState(false);
  const inner = useRef();
  const mini = useRef();
  const scan = useRef();
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.8, 2.4)), []);
  const boxEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  useEffect(
    () => () => {
      edges.dispose();
      boxEdges.dispose();
    },
    [edges, boxEdges]
  );
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover]);
  useFrame(({ clock }, dt) => {
    const s = damp(inner.current.scale.x, hover ? 1.07 : 1, 8, Math.min(dt, 0.05));
    inner.current.scale.setScalar(s);
    if (!quality.reduced) {
      mini.current.rotation.y += dt * 0.6;
      scan.current.position.y = ((clock.elapsedTime * 0.45 + index * 0.3) % 1) * 2.4 - 1.2;
    }
  });
  const col = project.color || '#8b6cff';
  return (
    <Appear at={pos[0]} range={26} floatY={0.05} position={pos}>
      <group
        ref={inner}
        onClick={(e) => (e.stopPropagation(), store.set({ focus: { type: 'project', id: project.id } }))}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={() => setHover(false)}
      >
        {/* pedestal */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.25, 0.32, 32]} />
          <meshStandardMaterial color="#0d1030" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.08, 48]} />
          <meshBasicMaterial color={col} toneMapped={false} />
        </mesh>
        {/* miniature digital environment */}
        <group ref={mini} position={[0, 0.4, 0]}>
          {MINI.map(([mx, mz, w, h], i) => (
            <group key={i} position={[mx, h / 2, mz]} scale={[w, h, w]}>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#0b1030" emissive={col} emissiveIntensity={0.28} transparent opacity={0.6} />
              </mesh>
              <lineSegments geometry={boxEdges}>
                <lineBasicMaterial color={col} toneMapped={false} />
              </lineSegments>
            </group>
          ))}
        </group>
        {/* light beam */}
        <mesh position={[0, 1.7, 0]}>
          <cylinderGeometry args={[0.9, 0.45, 2.4, 24, 1, true]} />
          <meshBasicMaterial color={col} transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {/* floating screen */}
        <group position={[0, 3.6, 0]} rotation={[0, index % 2 ? 0.12 : -0.12, 0]}>
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[4.3, 2.9]} />
            <meshBasicMaterial color={col} transparent opacity={hover ? 0.42 : 0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <planeGeometry args={[3.8, 2.4]} />
            <meshBasicMaterial map={tex} transparent opacity={0.96} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={col} toneMapped={false} />
          </lineSegments>
          <mesh ref={scan} position={[0, 0, 0.02]}>
            <planeGeometry args={[3.8, 0.07]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <T position={[-1.55, 1.52, 0.02]} size={0.26} color={col} outlineWidth={0.01} outlineColor="#000">
            {String(index + 1).padStart(2, '0')}
          </T>
          <T position={[0, -1.62, 0.02]} size={0.17} color="#c9d3ff" fillOpacity={hover ? 1 : 0.7}>
            click to explore
          </T>
        </group>
      </group>
    </Appear>
  );
}

/** Scene 5 — a digital city of glowing code; every project is a holographic display with a miniature world on its pedestal. */
export default function Projects() {
  const teaserX = PROJECT_X0 + projects.length * PROJECT_DX;
  return (
    <group>
      <CyberFloor />
      <Skyline />
      <NeonBeams />
      <Portal x={154} />
      {projects.map((p, i) => (
        <Holo key={p.id} project={p} index={i} />
      ))}
      <Appear at={teaserX} range={24} position={[teaserX, 0, -3.6]}>
        <T position={[0, 3.2, 0]} size={0.36} color="#8f9bd8" fillOpacity={0.7}>
          More worlds coming soon…
        </T>
      </Appear>
      <Sparks count={180} scale={[96, 26, 36]} position={[196, 12, -14]} size={3.4} speed={0.5} color="#7fe8ff" opacity={0.85} />
    </group>
  );
}
