import { Appear, Forest, Glow, Lamp, LightShaft, Mist, PhotoFrame, Sparks, T } from '../parts';
import { school } from '../../data/story';
import { SCHOOL_GATE_X } from '../layout';

function Gate({ x }) {
  const stone = '#d6bfa0';
  return (
    <group position={[x, 0, 0]}>
      {[-3.6, 3.6].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[0.95, 5.2, 0.95]} />
            <meshStandardMaterial color={stone} roughness={0.9} />
          </mesh>
          <mesh position={[0, 5.35, 0]} castShadow>
            <boxGeometry args={[1.25, 0.3, 1.25]} />
            <meshStandardMaterial color="#b89d7c" />
          </mesh>
          <Lamp position={[0, 5.5, 0]} h={0.2} color="#ffe2b0" />
        </group>
      ))}
      <mesh position={[0, 5.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 8.2]} />
        <meshStandardMaterial color="#b89d7c" roughness={0.9} />
      </mesh>
    </group>
  );
}

function SchoolSign({ x }) {
  // A freestanding board above the gate, facing the camera (+z)
  return (
    <group position={[x, 6.9, 0]}>
      {[-4.4, 4.4].map((px) => (
        <mesh key={px} position={[px, -0.7, 0]}>
          <boxGeometry args={[0.18, 1.1, 0.18]} />
          <meshStandardMaterial color="#b89d7c" />
        </mesh>
      ))}
      <mesh castShadow>
        <boxGeometry args={[10, 1.7, 0.2]} />
        <meshStandardMaterial color="#1b1636" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[9.7, 1.4]} />
        <meshBasicMaterial color="#2a2250" />
      </mesh>
      <T position={[0, 0.2, 0.14]} size={0.5} maxWidth={9} textAlign="center" color="#ffe2b0">
        {school.name}
      </T>
      <T position={[0, -0.38, 0.14]} size={0.24} color="#bdb0ff">
        {`${school.location}  •  ${school.years}`}
      </T>
    </group>
  );
}

function Building({ x }) {
  const windows = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 9; c++) {
      const wx = -14 + c * 3.5;
      if (Math.abs(wx) < 2.3) continue;
      windows.push([wx, 2.3 + r * 2.6]);
    }
  return (
    <group position={[x, 0, -10]}>
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[36, 7.2, 7]} />
        <meshStandardMaterial color="#d9b392" roughness={0.9} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[37.2, 0.7, 8.2]} />
        <meshStandardMaterial color="#6b4a3a" roughness={0.8} />
      </mesh>
      {windows.map(([wx, wy], i) => (
        <mesh key={i} position={[wx, wy, 3.52]}>
          <boxGeometry args={[1.6, 1.5, 0.08]} />
          <meshStandardMaterial color="#9ec8ee" emissive="#cfe6ff" emissiveIntensity={0.25} roughness={0.2} metalness={0.2} />
        </mesh>
      ))}
      {/* entrance */}
      <mesh position={[0, 2.1, 3.56]}>
        <boxGeometry args={[3.2, 4.2, 0.12]} />
        <meshStandardMaterial color="#3a2a2a" />
      </mesh>
      <mesh position={[0, 4.35, 3.56]}>
        <cylinderGeometry args={[1.6, 1.6, 0.12, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#3a2a2a" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.12, 4.2 + (2 - i) * 0.35]} receiveShadow>
          <boxGeometry args={[5, 0.24, 1]} />
          <meshStandardMaterial color="#cfc2ac" />
        </mesh>
      ))}
      {/* clock */}
      <mesh position={[0, 6.2, 3.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 24]} />
        <meshBasicMaterial color="#fff6e4" />
      </mesh>
      <mesh position={[0, 6.3, 3.68]}>
        <boxGeometry args={[0.07, 0.4, 0.02]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[0.12, 6.2, 3.68]} rotation={[0, 0, -1.2]}>
        <boxGeometry args={[0.07, 0.3, 0.02]} />
        <meshBasicMaterial color="#222" />
      </mesh>
    </group>
  );
}

/** Scene 3 — the school gate, the building, a noticeboard with the real school photograph, and certificates. */
export default function School() {
  const ach = school.achievements.slice(0, 4);
  const frames = ach.length ? ach : [{ title: '[Add an achievement or certificate]', detail: '', image: null }];
  return (
    <group>
      <Forest x0={34} x1={58} count={14} seed={21} kind="round" clear={4.6} spread={3} leaf={['#4a9a5c', '#6bb86a']} scale={[0.8, 1.2]} />
      <Forest x0={58} x1={104} count={26} seed={22} kind="round" clear={17} spread={16} leaf={['#3f8a58', '#5aa866']} scale={[0.9, 1.5]} />
      <Mist x={75} width={60} count={6} color="#fff0d8" opacity={0.12} />

      <Gate x={SCHOOL_GATE_X} />
      <SchoolSign x={SCHOOL_GATE_X} />
      <Building x={78} />

      {/* flag */}
      <group position={[62, 0, -4.5]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 6, 8]} />
          <meshStandardMaterial color="#ddd" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.75, 5.5, 0]}>
          <planeGeometry args={[1.5, 0.9]} />
          <meshStandardMaterial color="#ff8a3d" side={2} />
        </mesh>
      </group>

      {/* noticeboard with the school photograph */}
      <Appear at={70} range={20} floatY={0.03} position={[70, 3.4, -6.2]}>
        <mesh position={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[7.6, 4.8, 0.2]} />
          <meshStandardMaterial color="#6d4a32" roughness={0.9} />
        </mesh>
        <PhotoFrame src={school.photo} label="School photograph" w={6.6} h={3.7} accent="#ffd28a" caption={school.photoCaption} position={[0, 0.1, 0]} />
        {[-3.4, 3.4].map((px) => (
          <mesh key={px} position={[px, 2.1, 0.05]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ff5d5d" />
          </mesh>
        ))}
      </Appear>

      {/* certificates & awards — only the ones you provide */}
      {frames.map((a, i) => (
        <Appear key={i} at={82 + i * 5.5} range={14} position={[82 + i * 5.5, 2.7, -3.3]} rotation={[0, 0.12 * (i % 2 ? -1 : 1), 0]}>
          <PhotoFrame src={a.image} label={a.title} w={2.5} h={1.8} accent="#ffd28a" caption={a.detail ? `${a.title} — ${a.detail}` : a.title} />
        </Appear>
      ))}

      <LightShaft position={[66, 8, -2]} rotation={[0, 0, 0.45]} size={[3, 22]} opacity={0.12} />
      <LightShaft position={[88, 8, -2]} rotation={[0, 0, 0.45]} size={[2.5, 20]} opacity={0.1} />
      <Sparks count={80} scale={[60, 8, 14]} position={[72, 4, -2]} size={2.6} speed={0.2} color="#fff0c0" opacity={0.7} />
    </group>
  );
}
