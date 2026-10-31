import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Bob, Glow, PhotoFrame, Sparks, T } from '../parts';
import { internship } from '../../data/story';
import { DESK } from '../layout';
import { skylineTexture, toTexture } from '../textures';
import { store } from '../../store';
import { quality } from '../../quality';

const CODE = [
  "import express from 'express';",
  "import jwt from 'jsonwebtoken';",
  'const app = express();',
  'app.use(express.json());',
  '// every journey starts with a first route',
  "app.post('/api/login', async (req, res) => {",
  '  const user = await User.findOne({ email });',
  "  const token = jwt.sign({ id: user._id }, secret);",
  '  res.json({ token });',
  '});',
  "app.listen(5000, () => console.log('ready'));",
];
const TERM = ['$ git pull origin main', '$ npm install', '$ npm run dev', '> vite ready in 312 ms', '> server listening on :5000', '$ git commit -m "feat: next chapter"', '$ git push'];

function tokenColor(tok) {
  if (/^\/\//.test(tok)) return '#6b7399';
  if (/^['"]/.test(tok)) return '#8bf0b4';
  if (/^(const|let|import|from|export|default|return|await|async|function)$/.test(tok)) return '#c39bff';
  if (/^(app|res|req|jwt|console|User)$/.test(tok)) return '#7fd8ff';
  return '#e8ecff';
}

/** A screen that "types" code or terminal output on a canvas texture (≈8 fps, only while mounted). */
function CodeScreen({ lines, w = 3.2, h = 1.8, title = 'server.js', terminal = false, speed = 26, ...props }) {
  const { canvas, ctx, tex } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = Math.round(1024 * (h / w));
    const t = toTexture(c);
    return { canvas: c, ctx: c.getContext('2d'), tex: t };
  }, [w, h]);
  const last = useRef(0);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (t - last.current < 0.12) return;
    last.current = t;
    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = terminal ? '#05070f' : '#0c1020';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#161b34';
    ctx.fillRect(0, 0, W, 54);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(30 + i * 30, 27, 9, 0, 7);
      ctx.fill();
    });
    ctx.fillStyle = '#8f99c8';
    ctx.font = "500 24px 'Inter Variable', Inter, system-ui, sans-serif";
    ctx.fillText(title, 140, 35);
    const total = lines.reduce((a, l) => a + l.length + 1, 0);
    let typed = quality.reduced ? total : Math.floor((t * speed) % (total + 40));
    const lh = terminal ? 40 : 42;
    ctx.font = "500 28px ui-monospace, Menlo, Consolas, monospace";
    let y = 108;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const shown = line.slice(0, Math.max(0, Math.min(line.length, typed)));
      typed -= line.length + 1;
      if (!terminal) {
        ctx.fillStyle = '#4a5280';
        ctx.fillText(String(i + 1).padStart(2, ' '), 20, y);
      }
      let x = terminal ? 28 : 80;
      const toks = shown.split(/(\/\/.*|'[^']*'|"[^"]*"|\b\w+\b)/g).filter((s) => s !== '');
      for (const tok of toks) {
        ctx.fillStyle = terminal ? (tok.startsWith('$') ? '#8bf0b4' : '#cfe8ff') : tokenColor(tok);
        ctx.fillText(tok, x, y);
        x += ctx.measureText(tok).width;
      }
      if (typed < 0 && typed > -(line.length + 2) && Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 2, y - 24, 14, 30);
      }
      if (typed < 0) break;
      y += lh;
    }
    tex.needsUpdate = true;
  });
  return (
    <group {...props}>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.06]} />
        <meshStandardMaterial color="#10101c" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Desk({ x }) {
  return (
    <group position={[x, 0, 0]}>
      {/* desk */}
      <mesh position={[0, 0.95, -1.55]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 0.12, 2.2]} />
        <meshStandardMaterial color="#2b2540" roughness={0.5} metalness={0.3} />
      </mesh>
      {[-3.1, 3.1].map((lx) =>
        [-0.5, -2.6].map((lz) => (
          <mesh key={lx + '_' + lz} position={[lx, 0.47, lz]}>
            <boxGeometry args={[0.12, 0.94, 0.12]} />
            <meshStandardMaterial color="#14141f" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}
      {/* monitors */}
      <CodeScreen lines={CODE} w={3.2} h={1.8} title="server.js — portfolio-api" position={[0, 2.0, -2.35]} />
      <mesh position={[0, 1.3, -2.4]}>
        <boxGeometry args={[0.14, 0.7, 0.1]} />
        <meshStandardMaterial color="#14141f" metalness={0.8} />
      </mesh>
      <CodeScreen lines={TERM} w={2.1} h={1.3} title="terminal" terminal speed={18} position={[-3.1, 1.85, -2.0]} rotation={[0, 0.5, 0]} />
      <CodeScreen lines={TERM.slice().reverse()} w={2.1} h={1.3} title="terminal — git" terminal speed={14} position={[3.1, 1.85, -2.0]} rotation={[0, -0.5, 0]} />
      {/* keyboard, mouse, mug, plant, lamp */}
      <mesh position={[0, 1.04, -0.78]}>
        <boxGeometry args={[1.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a2a" />
      </mesh>
      <mesh position={[0, 1.075, -0.78]}>
        <boxGeometry args={[1.4, 0.01, 0.4]} />
        <meshBasicMaterial color="#6f5cff" toneMapped={false} />
      </mesh>
      <mesh position={[1.1, 1.04, -0.8]}>
        <boxGeometry args={[0.18, 0.05, 0.28]} />
        <meshStandardMaterial color="#1a1a2a" />
      </mesh>
      <mesh position={[-2.3, 1.14, -1.2]}>
        <cylinderGeometry args={[0.14, 0.12, 0.26, 14]} />
        <meshStandardMaterial color="#ffd28a" />
      </mesh>
      <mesh position={[2.5, 1.1, -1.6]}>
        <cylinderGeometry args={[0.2, 0.15, 0.3, 12]} />
        <meshStandardMaterial color="#e8e0f8" />
      </mesh>
      <mesh position={[2.5, 1.5, -1.6]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#3fae6a" flatShading />
      </mesh>
      {/* chair */}
      <group position={[0, 0, 0.05]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <boxGeometry args={[0.95, 0.12, 0.95]} />
          <meshStandardMaterial color="#25203a" />
        </mesh>
        <mesh position={[0, 1.0, 0.5]} castShadow>
          <boxGeometry args={[0.95, 1.2, 0.12]} />
          <meshStandardMaterial color="#25203a" />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.34, 8]} />
          <meshStandardMaterial color="#444" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 5]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function Room({ x }) {
  const sky = useMemo(() => skylineTexture(), []);
  useEffect(() => () => sky.dispose(), [sky]);
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.03, -4]} receiveShadow>
        <boxGeometry args={[52, 0.1, 24]} />
        <meshStandardMaterial color="#10182a" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, 5, -9]}>
        <boxGeometry args={[52, 10, 0.4]} />
        <meshStandardMaterial color="#0d1224" />
      </mesh>
      <mesh position={[0, 4.6, -8.75]}>
        <planeGeometry args={[40, 6.4]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {[-20, -10, 0, 10, 20].map((wx) => (
        <mesh key={wx} position={[wx, 4.6, -8.7]}>
          <boxGeometry args={[0.18, 6.6, 0.12]} />
          <meshStandardMaterial color="#05060d" metalness={0.8} />
        </mesh>
      ))}
      {[-12, 0, 12].map((lx) => (
        <group key={lx} position={[lx, 8, -3]}>
          <mesh>
            <boxGeometry args={[7, 0.1, 0.4]} />
            <meshBasicMaterial color="#e6f2ff" toneMapped={false} />
          </mesh>
          <Glow position={[0, -0.3, 0]} color="#9fd8ff" size={9} opacity={0.3} />
        </group>
      ))}
      <pointLight position={[0, 6.5, -2]} color="#9fd8ff" intensity={30} distance={22} decay={2} />
    </group>
  );
}

/** Scene 6 — a modern software workspace: animated code, terminals and the internship documents on display. */
export default function Internship() {
  const cx = DESK.x;
  const docs = internship.documents;
  const pos = [
    [cx - 6.5, 3.0, -5.2, 0.35],
    [cx, 4.7, -6.4, 0],
    [cx + 6.5, 3.0, -5.2, -0.35],
  ];
  const toks = [
    ['git commit', cx - 8.5, 5.6, -4],
    ['npm run dev', cx + 8.6, 5.2, -4],
    ['Node.js', cx - 3.8, 6.4, -6],
    ['MongoDB', cx + 3.8, 6.6, -6],
  ];
  return (
    <group>
      <Room x={cx} />
      <Desk x={cx} />
      {docs.slice(0, 3).map((d, i) => (
        <Bob key={d.id} speed={0.8} intensity={0.5} rotation={0.1}>
          <PhotoFrame
            src={d.file && /\.(png|jpe?g|webp)$/i.test(d.file) ? d.file : null}
            label={d.title}
            w={2.2}
            h={2.9}
            accent="#4fd8ff"
            caption={`${d.title} — click to open`}
            position={[pos[i][0], pos[i][1], pos[i][2]]}
            rotation={[0, pos[i][3], 0]}
            onClick={() => store.set({ doc: d.id })}
          />
        </Bob>
      ))}
      {toks.map(([t, tx, ty, tz]) => (
        <Bob key={t} speed={1} intensity={1} rotation={0}>
          <T position={[tx, ty, tz]} size={0.4} color="#7fe8ff" fillOpacity={0.65} outlineWidth={0.012} outlineColor="#06283a">
            {t}
          </T>
        </Bob>
      ))}
      <Sparks count={90} scale={[40, 8, 14]} position={[cx, 4, -3]} size={2.4} speed={0.3} color="#9fd8ff" opacity={0.6} />
    </group>
  );
}
