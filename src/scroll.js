import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { world } from './world/world';
import { reduced } from './quality';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

/** Scroll position ⇄ story progress. One ScrollTrigger drives the entire film. */
export function setupScroll() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  world.target = 0;
  world.p = 0;
  const st = ScrollTrigger.create({
    trigger: '#scroll-space',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      world.target = self.progress;
    },
    onRefresh: (self) => {
      world.target = self.progress;
    },
  });
  return () => st.kill();
}

export function jumpTo(p) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  gsap.to(window, { duration: reduced ? 0 : Math.min(3.2, 1.2 + Math.abs(p - world.target) * 4), scrollTo: { y: p * max, autoKill: true }, ease: 'power2.inOut' });
}

export { gsap };
