import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { store, useStore } from '../store';

export default function Loader() {
  const { progress, active } = useProgress();
  const canvasReady = useStore((s) => s.canvasReady);
  const loaded = useStore((s) => s.loaded);
  const [fake, setFake] = useState(0);
  const [gone, setGone] = useState(false);
  const t0 = useRef(performance.now());

  useEffect(() => {
    if (loaded) return undefined;
    let raf;
    const tick = () => {
      const t = (performance.now() - t0.current) / 1000;
      setFake(Math.min(0.92, 1 - Math.exp(-t * 1.3)));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  useEffect(() => {
    if (!loaded && canvasReady && !active && performance.now() - t0.current > 1800) store.set({ loaded: true });
  }, [canvasReady, active, fake, loaded]);

  useEffect(() => {
    if (!loaded) return undefined;
    const id = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(id);
  }, [loaded]);

  if (gone) return null;
  const pct = loaded ? 100 : Math.round(Math.max(fake * 100, progress));
  return (
    <div className={`loader ${loaded ? 'loader--out' : ''}`} role="status" aria-live="polite">
      <div className="loader__inner">
        <p className="loader__kicker">A story in scroll</p>
        <h1 className="loader__title">Every Developer Has a Beginning</h1>
        <div className="loader__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="loader__pct">Loading the world… {pct}%</p>
      </div>
    </div>
  );
}
