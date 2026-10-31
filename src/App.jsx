import { useEffect } from 'react';
import Stage from './Stage';
import Loader from './ui/Loader';
import Panels from './ui/Panels';
import TextVersion from './ui/TextVersion';
import { Header, ChapterNav, ProgressBar, Subtitles, Cinema } from './ui/Hud';
import { ProjectModal, DocModal } from './ui/Modals';
import { setupScroll, gsap } from './scroll';
import { world } from './world/world';
import { CHAPTERS, chapterAt, chapterRange } from './world/timeline';
import { narration } from './data/story';
import { speech } from './narration';
import { store, useStore } from './store';
import { hasWebGL, mobile } from './quality';

function useStoryClock() {
  useEffect(() => {
    const cleanup = setupScroll();
    const tick = () => {
      const p = world.p;
      const c = chapterAt(p);
      const [a, b] = chapterRange(c);
      const f = (p - a) / (b - a);
      const cues = narration[CHAPTERS[c].id] || [];
      let ci = 0;
      cues.forEach((q, i) => {
        if (f >= q.at) ci = i;
      });
      const s = store.get();
      if (s.chapter !== c || s.cue !== ci) store.set({ chapter: c, cue: ci });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      cleanup();
    };
  }, []);
}

function useNarration() {
  const chapter = useStore((s) => s.chapter);
  const cue = useStore((s) => s.cue);
  const voice = useStore((s) => s.voice);
  const paused = useStore((s) => s.voicePaused);
  const replay = useStore((s) => s.replay);
  useEffect(() => {
    if (!voice) {
      speech.cancel();
      return;
    }
    const text = narration[CHAPTERS[chapter].id]?.[cue]?.text;
    const adult = chapter >= 7 && cue >= 1;
    speech.speak(text, { pitch: adult ? 0.95 : 1.2, rate: 0.95 });
  }, [chapter, cue, voice, replay]);
  useEffect(() => {
    if (!voice) return;
    paused ? speech.pause() : speech.resume();
  }, [paused, voice]);
  useEffect(() => () => speech.cancel(), []);
}

function Cinematic() {
  const focus = useStore((s) => s.focus);
  useStoryClock();
  useNarration();
  useEffect(() => {
    document.body.classList.toggle('is-focus', !!focus);
  }, [focus]);
  return (
    <>
      <a className="skip" href="#text-version" onClick={(e) => (e.preventDefault(), store.set({ textMode: true }))}>
        Skip to the accessible text version
      </a>
      <Stage />
      <Cinema />
      <Panels />
      <Header />
      <ChapterNav />
      <ProgressBar />
      <Subtitles />
      <ProjectModal />
      <DocModal />
      <Loader />
      <div id="scroll-space" style={{ height: `${mobile ? 1500 : 1300}vh` }} aria-hidden="true" />
    </>
  );
}

export default function App() {
  const textMode = useStore((s) => s.textMode);
  const webgl = hasWebGL();
  useEffect(() => {
    if (!webgl) store.set({ textMode: true });
  }, [webgl]);
  useEffect(() => {
    document.body.classList.toggle('is-text', textMode || !webgl);
    if (textMode) {
      window.scrollTo(0, 0);
      speech.cancel();
    }
  }, [textMode, webgl]);
  if (textMode || !webgl) return <TextVersion />;
  return <Cinematic />;
}
