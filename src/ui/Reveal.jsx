import { useEffect, useRef } from 'react';
import { gsap } from '../scroll';
import { world } from '../world/world';
import { smooth } from '../world/util';
import { reduced } from '../quality';

/** Fades/slides its children in and out as a function of story progress (no React re-renders). */
export function Reveal({ from, to, fade = 0.012, y = 22, as: Tag = 'div', children, ...rest }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const tick = () => {
      const p = world.p;
      const a = smooth(from, from + fade, p) * (1 - smooth(to - fade, to, p));
      el.style.opacity = a.toFixed(3);
      el.style.visibility = a < 0.01 ? 'hidden' : 'visible';
      el.style.transform = reduced ? 'none' : `translate3d(0,${((1 - a) * y).toFixed(1)}px,0)`;
    };
    gsap.ticker.add(tick);
    tick();
    return () => gsap.ticker.remove(tick);
  }, [from, to, fade, y]);
  return (
    <Tag ref={ref} style={{ opacity: 0, visibility: 'hidden' }} {...rest}>
      {children}
    </Tag>
  );
}
