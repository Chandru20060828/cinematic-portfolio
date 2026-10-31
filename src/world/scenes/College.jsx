import { Appear, Forest, Glow, Lamp, LightShaft, Mist, PhotoFrame, Sparks, T } from '../parts';
import { college } from '../../data/story';
import { COLLEGE_GATE_X } from '../layout';

function Gate({ x }) {
  return (
    <group position={[x, 0, 0]}>
      {[-4.2, 4.2].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[1.1, 6, 1.1]} />
            <meshStandardMaterial color="#cfc6b6" roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.15, 0]}>
            <boxGeometry args={[1.5, 0.3, 1.5]} />
            <meshStandardMaterial color="#a8987c" />
          </mesh>
          <Lamp position={[0, 6.3, 0]} h={0.1} color="#ffe2b0" />
        </group>
      ))}
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.9, 9.6]} />
        <meshStandardMaterial color="#a8987c" />
      </mesh>
      <group position={[0, 8.1, 0]}>
        {[-5, 5].map((pz) => (
          <mesh key={pz} position={[0, -0.9, pz * 0.9]}>
            <boxGeometry args={[0.18, 1.2, 0.18]} />
            <meshStandardMaterial color="#a8987c" />
          </mesh>
        ))}
        <mesh castShadow>
          <boxGeometry args={[12.4, 2, 0.22]} />
          <meshStandardMaterial color="#14283f" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[12.1, 1.75]} />
          <meshBasicMaterial color="#1c3a5e" />
        </mesh>
        <T position={[0, 0.34, 0.16]} size={0.58} maxWidth={11.4} textAlign="center" color="#ffe9c0">
          {college.name.toUpperCase()}
        </T>
        <T position={[0, -0.5, 0.16]} size={0.3} color="#9fd0ff">
          {`${college.location}  •  ${college.course}`}
        </T>
      </group>
    </group>
  );
}

function Campus({ x }) {
  const cols = Array.from({ length: 8 }, (_, i) => -8.4 + i * 2.4);
  const glass = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) glass.push([-6 + c * 2.4, 2.2 + r * 2.6]);
  return (
    <group position={[x, 0, -14]}>
      {/* central block */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 10, 8]} />
        <meshStandardMaterial color="#e6dccb" roughness={0.9} />
      </mesh>
      {glass.map(([gx, gy], i) => (
        <mesh key={i} position={[gx + 3.0, gy + 0.5, 4.06]}>
          <boxGeometry args={[1.6, 1.9, 0.08]} />
          <meshStandardMaterial color="#79a8dc" emissive="#a6d0ff" emissiveIntensity={0.3} roughness={0.15} metalness={0.4} />
        </mesh>
      ))}
      {/* portico + columns */}
      <mesh position={[0, 7.4, 5.4]} castShadow>
        <boxGeometry args={[21, 0.7, 3.6]} />
        <meshStandardMaterial color="#d6c9b4" />
      </mesh>
      <mesh position={[0, 8.6, 5.4]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 3.4, 3]} />
        <meshStandardMaterial color="#d6c9b4" />
      </mesh>
      {cols.map((cx) => (
        <mesh key={cx} position={[cx + 1.2, 3.6, 6.8]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 7.2, 12]} />
          <meshStandardMaterial color="#f1e8d8" roughness={0.8} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.15 + i * 0.15, 8.6 + (3 - i) * 0.5]} receiveShadow>
          <boxGeometry args={[18, 0.3, 1.2]} />
          <meshStandardMaterial color="#cfc3ad" />
        </mesh>
      ))}
      {/* clock tower & dome */}
      <mesh position={[0, 12.5, -1]} castShadow>
        <cylinderGeometry args={[2.3, 2.6, 5, 16]} />
        <meshStandardMaterial color="#e6dccb" />
      </mesh>
      <mesh position={[0, 15.2, -1]} castShadow>
        <sphereGeometry args={[2.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d9a441" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 12.8, 1.62]}>
        <circleGeometry args={[1.0, 24]} />
        <meshBasicMaterial color="#fff6e4" />
      </mesh>
      {/* side wings */}
      {[-17, 17].map((wx) => (
        <mesh key={wx} position={[wx, 3.5, 1]} castShadow receiveShadow>
          <boxGeometry args={[12, 7, 6]} />
          <meshStandardMaterial color="#dfd2bc" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Bench({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.6]} />
        <meshStandardMaterial color="#6d4a32" />
      </mesh>
      <mesh position={[0, 0.9, -0.28]}>
        <boxGeometry args={[1.8, 0.5, 0.08]} />
        <meshStandardMaterial color="#6d4a32" />
      </mesh>
      {[-0.8, 0.8].map((lx) => (
        <mesh key={lx} position={[lx, 0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#2c2c3c" />
        </mesh>
      ))}
    </group>
  );
}

/** Scene 4 — the campus of Kumaraguru College of Technology: gate, main building, lawns, golden light and event photographs. */
export default function College() {
  return (
    <group>
      <Forest x0={94} x1={160} count={22} seed={31} kind="round" clear={4.8} spread={2.4} leaf={['#3c8a4c', '#5aa85a']} scale={[1, 1.6]} />
      <Forest x0={94} x1={170} count={30} seed={32} kind="round" clear={21} spread={14} leaf={['#2f7a48', '#4b9a58']} scale={[1.2, 1.9]} />
      <Mist x={128} width={70} count={6} color="#ffe8c0" opacity={0.12} />

      <Gate x={COLLEGE_GATE_X} />
      <Campus x={130} />

      {[112, 126, 142].map((bx, i) => (
        <Bench key={bx} position={[bx, 0, -2.6 - (i % 2) * 0.6]} />
      ))}
      {[110, 118, 126, 134, 142, 150].map((lx) => (
        <Lamp key={lx} position={[lx, 0, 3]} h={3.4} />
      ))}

      {college.photos.map((ph, i) => (
        <Appear key={i} at={116 + i * 14} range={15} position={[116 + i * 14, 2.8, -4.2]} rotation={[0, 0.14 * (i - 1), 0]}>
          <PhotoFrame src={ph.src} label={ph.label} w={3.6} h={2.4} accent="#ffd28a" caption={ph.label} />
        </Appear>
      ))}

      {/* afternoon sun & shafts */}
      <mesh position={[170, 26, -120]}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color="#fff2c4" fog={false} toneMapped={false} />
      </mesh>
      <Glow position={[170, 26, -120]} color="#ffd28a" size={80} opacity={0.5} />
      <LightShaft position={[116, 8, -3]} rotation={[0, 0, 0.5]} size={[3.5, 24]} opacity={0.14} />
      <LightShaft position={[132, 8, -3]} rotation={[0, 0, 0.5]} size={[2.6, 22]} opacity={0.12} />
      <LightShaft position={[146, 8, -3]} rotation={[0, 0, 0.5]} size={[3, 24]} opacity={0.12} />
      <Sparks count={90} scale={[64, 8, 14]} position={[128, 4, -2]} size={2.6} speed={0.2} color="#fff0c0" opacity={0.7} />
    </group>
  );
}
