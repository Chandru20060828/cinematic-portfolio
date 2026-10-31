import { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from './world';
import { clamp, mulberry32 } from './util';
import { sample, sampleTimeline, samplePalette } from './timeline';
import { projectFocus } from './layout';
import { groundTexture, pathTexture } from './textures';
import { projects } from '../data/story';
import { store, useStore } from '../store';
import { quality } from '../quality';
import Boy from './Boy';

const Beginning = lazy(() => import('./scenes/Beginning'));
const Childhood = lazy(() => import('./scenes/Childhood'));
const School = lazy(() => import('./scenes/School'));
const College = lazy(() => import('./scenes/College'));
const Projects = lazy(() => import('./scenes/Projects'));
const Internship = lazy(() => import('./scenes/Internship'));
const Skills = lazy(() => import('./scenes/Skills'));
const Sunrise = lazy(() => import('./scenes/Sunrise'));

const SCENES = {
  beginning: Beginning,
  childhood: Childhood,
  school: School,
  college: College,
  projects: Projects,
  internship: Internship,
  skills: Skills,
  sunrise: Sunrise,
};
// chapter index -> scene that must be alive while that chapter is on screen
const CHAPTER_SCENE = ['beginning', 'childhood', 'school', 'college', 'projects', 'internship', 'skills', 'sunrise', 'sunrise'];

/* -------------------------------------------------------------------------- */
/*  Rig: damped scroll → timeline → camera, lights, fog                       */
/* -------------------------------------------------------------------------- */
function Rig() {
  const { camera, scene } = useThree();
  const key = useRef();
  const rim = useRef();
  const hemi = useRef();
  const focusCam = useMemo(() => new THREE.Vector3(), []);
  const focusLook = useMemo(() => new THREE.Vector3(), []);
  const cam = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lastFocus = useRef(null);

  useEffect(() => {
    scene.fog = new THREE.Fog('#0b1030', 22, 170);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const k = quality.reduced ? 1 : 1 - Math.exp(-dt * 6.5);
    world.p += (world.target - world.p) * k;
    if (Math.abs(world.target - world.p) < 1e-5) world.p = world.target;

    const prevX = world.x;
    sampleTimeline(world.p);
    samplePalette(world.p);

    const vx = dt > 0 ? (world.x - prevX) / dt : 0;
    world.speed += (vx - world.speed) * (1 - Math.exp(-dt * 10));
    world.walk += (clamp(Math.abs(world.speed) / 1.1) - world.walk) * (1 - Math.exp(-dt * 8));
    world.phase += clamp(world.speed, -5, 5) * dt * 3.4;

    // --- project focus ---
    const focus = store.get().focus;
    const fid = focus ? focus.id : null;
    if (fid !== lastFocus.current) {
      lastFocus.current = fid;
      if (fid) {
        world.focusP0 = world.target;
        const idx = Math.max(0, projects.findIndex((p) => p.id === fid));
        const pose = projectFocus(idx);
        focusCam.set(...pose.cam);
        focusLook.set(...pose.look);
      }
    }
    if (fid && Math.abs(world.target - world.focusP0) > 0.012) store.set({ focus: null });
    world.focusAmt += ((fid ? 1 : 0) - world.focusAmt) * (1 - Math.exp(-dt * 3.2));
    if (world.focusAmt < 0.0005) world.focusAmt = 0;

    cam.copy(sample.cam);
    look.copy(sample.look);
    if (world.focusAmt > 0) {
      const e = world.focusAmt * world.focusAmt * (3 - 2 * world.focusAmt);
      cam.lerp(focusCam, e);
      look.lerp(focusLook, e);
    }
    const free = 1 - world.focusAmt;
    if (!quality.reduced) {
      cam.x += (state.pointer.x * 0.4 + Math.sin(state.clock.elapsedTime * 0.35) * 0.08) * free;
      cam.y += (state.pointer.y * 0.18 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04) * free;
    }
    const aspect = state.size.width / state.size.height;
    if (aspect < 0.95) look.y -= (0.95 - aspect) * 1.5;
    camera.position.copy(cam);
    camera.lookAt(look);
    const fov = Math.min(78, sample.fov * (1 + Math.max(0, 1 - aspect) * 0.8));
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    world.camX = camera.position.x;

    // --- light & fog ---
    const pal = world.pal;
    scene.fog?.color.copy(pal.hor);
    if (hemi.current) {
      hemi.current.color.copy(pal.hs);
      hemi.current.groundColor.copy(pal.hg);
      hemi.current.intensity = pal.hI * 1.5;
    }
    const kl = key.current;
    if (kl) {
      kl.color.copy(pal.key);
      kl.intensity = pal.keyI * 1.5;
      kl.position.set(world.x + 7, 14, 9);
      kl.target.position.set(world.x, 0, 0);
      kl.target.updateMatrixWorld();
    }
    if (rim.current) {
      rim.current.color.copy(pal.rim);
      rim.current.intensity = 1.4;
      rim.current.position.set(world.x - 5, 6, -9);
      rim.current.target.position.set(world.x, 1, 0);
      rim.current.target.updateMatrixWorld();
    }
  }, -2);

  const s = quality.shadowMap;
  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={key}
        castShadow
        shadow-mapSize={[s, s]}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
      />
      <directionalLight ref={rim} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sky, stars, mountains, ground                                             */
/* -------------------------------------------------------------------------- */
function Sky() {
  const mesh = useRef();
  const mat = useRef();
  useFrame(({ camera }) => {
    mesh.current.position.copy(camera.position);
    mat.current.uniforms.uTop.value.copy(world.pal.top);
    mat.current.uniforms.uHor.value.copy(world.pal.hor);
  });
  return (
    <mesh ref={mesh} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[450, 32, 16]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{ uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() } }}
        vertexShader={`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 uTop; uniform vec3 uHor; varying vec3 vP;
          void main(){ float h = pow(clamp(vP.y * 1.7, 0.0, 1.0), 0.72); vec3 c = mix(uHor, uTop, h);
          gl_FragColor = vec4(c, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          }`}
      />
    </mesh>
  );
}

function StarField() {
  const ref = useRef();
  const mat = useRef();
  const positions = useMemo(() => {
    const n = quality.mobile ? 900 : 1900;
    const r = mulberry32(5);
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2;
      const y = 0.04 + r() * 0.96;
      const rad = Math.sqrt(1 - y * y);
      a[i * 3] = Math.cos(th) * rad * 380;
      a[i * 3 + 1] = y * 380;
      a[i * 3 + 2] = Math.sin(th) * rad * 380;
    }
    return a;
  }, []);
  useFrame(({ camera }) => {
    ref.current.position.copy(camera.position);
    const o = world.night;
    ref.current.visible = o > 0.02;
    mat.current.opacity = o * 0.95;
  });
  return (
    <points ref={ref} frustumCulled={false} renderOrder={-90}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={mat} color="#ffffff" size={1.7} sizeAttenuation={false} transparent depthWrite={false} fog={false} />
    </points>
  );
}

const LAYERS = [
  { z: -70, f: 0.86, n: 15, h: [14, 30], w: [10, 20], mix: 0.8, dark: 0.7, seed: 1 },
  { z: -105, f: 0.93, n: 13, h: [24, 46], w: [16, 30], mix: 0.55, dark: 0.85, seed: 2 },
  { z: -140, f: 0.97, n: 11, h: [34, 64], w: [22, 40], mix: 0.3, dark: 1, seed: 3 },
];

function Backdrop() {
  const groups = useRef([]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const mats = useMemo(() => LAYERS.map(() => new THREE.MeshBasicMaterial()), []);
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const data = useMemo(
    () =>
      LAYERS.map((L) => {
        const r = mulberry32(L.seed * 17);
        return Array.from({ length: L.n }, (_, i) => ({
          x: -170 + (i / L.n) * 340 + r() * 14,
          h: L.h[0] + r() * (L.h[1] - L.h[0]),
          w: L.w[0] + r() * (L.w[1] - L.w[0]),
        }));
      }),
    []
  );
  useFrame(() => {
    const pal = world.pal;
    LAYERS.forEach((L, i) => {
      const g = groups.current[i];
      g.position.x = world.camX * L.f;
      g.visible = world.mtn > 0.01;
      g.scale.y = Math.max(0.001, world.mtn);
      mats[i].color.copy(tmp.copy(pal.hor).lerp(pal.top, L.mix).multiplyScalar(L.dark));
    });
  });
  return (
    <>
      {LAYERS.map((L, i) => (
        <group key={i} ref={(el) => (groups.current[i] = el)} position={[0, 0, L.z]}>
          {data[i].map((m, j) => (
            <mesh key={j} material={mats[i]} position={[m.x, m.h / 2 - 0.5, 0]} scale={[m.w, m.h, m.w * 0.7]}>
              <coneGeometry args={[1, 1, 5]} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

const WHITE = new THREE.Color(1, 1, 1);

function Ground() {
  const g = useRef();
  const p = useRef();
  const gm = useRef();
  const pm = useRef();
  const gt = useMemo(() => groundTexture(5, 60, 100), []);
  const pt = useMemo(() => pathTexture(65), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  useEffect(
    () => () => {
      gt.dispose();
      pt.dispose();
    },
    [gt, pt]
  );
  useFrame(() => {
    g.current.position.x = world.x;
    p.current.position.x = world.x;
    gt.offset.x = world.x / 5;
    pt.offset.x = world.x / 4;
    gm.current.color.copy(world.pal.ground);
    pm.current.color.copy(tmp.copy(world.pal.ground).lerp(WHITE, 0.2));
  });
  return (
    <>
      <mesh ref={g} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -170]} receiveShadow>
        <planeGeometry args={[300, 500]} />
        <meshStandardMaterial ref={gm} map={gt} roughness={1} />
      </mesh>
      <mesh ref={p} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[260, 3.4]} />
        <meshStandardMaterial ref={pm} map={pt} roughness={1} transparent opacity={0.9} />
      </mesh>
    </>
  );
}

/* -------------------------------------------------------------------------- */

export default function Experience() {
  const chapter = useStore((s) => s.chapter);
  const mounted = useMemo(() => {
    const set = new Set();
    for (let d = -1; d <= 1; d++) {
      const i = Math.min(CHAPTER_SCENE.length - 1, Math.max(0, chapter + d));
      set.add(CHAPTER_SCENE[i]);
    }
    return [...set];
  }, [chapter]);

  return (
    <>
      <Rig />
      <Sky />
      <StarField />
      <Backdrop />
      <Ground />
      <Boy />
      {mounted.map((name) => {
        const Scene = SCENES[name];
        return (
          <Suspense key={name} fallback={null}>
            <Scene />
          </Suspense>
        );
      })}
    </>
  );
}
