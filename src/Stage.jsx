import { Component, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import Experience from './world/Experience';
import { quality } from './quality';
import { store } from './store';

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error('3D scene failed — falling back to the text version.', err);
    store.set({ textMode: true });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Stage() {
  const [dpr, setDpr] = useState(quality.dpr[1]);
  return (
    <div className="stage" aria-hidden="true">
      <Boundary>
        <Canvas
          shadows
          dpr={dpr}
          camera={{ fov: 50, near: 0.1, far: 600, position: [0, 2.6, 13] }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ touchAction: 'pan-y' }}
          onCreated={() => store.set({ canvasReady: true })}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(quality.dpr[1])} />
          <Experience />
        </Canvas>
      </Boundary>
    </div>
  );
}
