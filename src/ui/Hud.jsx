import { useEffect, useRef } from 'react';
import { Captions, FileText, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { CHAPTERS, chapterCenter } from '../world/timeline';
import { narration, profile } from '../data/story';
import { store, useStore } from '../store';
import { jumpTo, gsap } from '../scroll';
import { world } from '../world/world';
import { smooth } from '../world/util';
import { speech } from '../narration';
import { reduced } from '../quality';

export function Header() {
  const voice = useStore((s) => s.voice);
  const paused = useStore((s) => s.voicePaused);
  const subs = useStore((s) => s.subtitles);
  return (
    <header className="hud-top">
      <a className="brand" href="#top" onClick={(e) => (e.preventDefault(), jumpTo(0))} aria-label="Back to the beginning">
        <span className="brand__dot" />
        {profile.name}
      </a>
      <div className="controls" role="toolbar" aria-label="Narration and accessibility">
        {speech.supported && (
          <>
            <button className="icon-btn" aria-pressed={voice} onClick={() => store.set({ voice: !voice, voicePaused: false })} title={voice ? 'Mute voice narration' : 'Turn on voice narration'} aria-label={voice ? 'Mute voice narration' : 'Turn on voice narration'}>
              {voice ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {voice && (
              <>
                <button className="icon-btn" onClick={() => store.set({ voicePaused: !paused })} title={paused ? 'Resume narration' : 'Pause narration'} aria-label={paused ? 'Resume narration' : 'Pause narration'}>
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                </button>
                <button className="icon-btn" onClick={() => store.set({ replay: store.get().replay + 1, voicePaused: false })} title="Replay this line" aria-label="Replay this line">
                  <RotateCcw size={18} />
                </button>
              </>
            )}
          </>
        )}
        <button className="icon-btn" aria-pressed={subs} onClick={() => store.set({ subtitles: !subs })} title="Toggle subtitles" aria-label="Toggle subtitles">
          <Captions size={18} />
        </button>
        <button className="icon-btn icon-btn--text" onClick={() => store.set({ textMode: true })} title="Read the accessible text version">
          <FileText size={18} />
          <span>Text version</span>
        </button>
      </div>
    </header>
  );
}

export function ChapterNav() {
  const chapter = useStore((s) => s.chapter);
  return (
    <nav className="chapters" aria-label="Story chapters">
      {CHAPTERS.map((c, i) => (
        <button key={c.id} className={i === chapter ? 'is-active' : ''} aria-current={i === chapter ? 'step' : undefined} onClick={() => jumpTo(chapterCenter(i))} aria-label={`Go to chapter ${i + 1}: ${c.label}`}>
          <span className="chapters__label">{c.label}</span>
          <span className="chapters__dot" />
        </button>
      ))}
    </nav>
  );
}

export function ProgressBar() {
  const ref = useRef();
  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.style.transform = `scaleX(${world.p.toFixed(4)})`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div className="progress" aria-hidden="true">
      <span ref={ref} />
    </div>
  );
}

export function Subtitles() {
  const chapter = useStore((s) => s.chapter);
  const cue = useStore((s) => s.cue);
  const on = useStore((s) => s.subtitles);
  const text = narration[CHAPTERS[chapter].id]?.[cue]?.text ?? '';
  if (!on || !text) return null;
  const words = text.split(' ');
  return (
    <div className="subtitles" role="status" aria-live="polite" key={`${chapter}-${cue}`}>
      <p>
        {words.map((w, i) => (
          <span key={i} style={{ animationDelay: reduced ? '0ms' : `${i * 55}ms` }}>
            {w}{' '}
          </span>
        ))}
      </p>
    </div>
  );
}

/** Cinematic extras: letterbox bars during the reveal, vignette, grain and the closing fade. */
export function Cinema() {
  const top = useRef();
  const bot = useRef();
  const fade = useRef();
  useEffect(() => {
    const tick = () => {
      const p = world.p;
      const bar = reduced ? 0 : smooth(0.8, 0.84, p) * (1 - smooth(0.905, 0.925, p)) * 7;
      if (top.current) top.current.style.height = bar.toFixed(2) + 'vh';
      if (bot.current) bot.current.style.height = bar.toFixed(2) + 'vh';
      if (fade.current) fade.current.style.opacity = (smooth(0.972, 1, p) * 0.62).toFixed(3);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="bar bar--top" ref={top} aria-hidden="true" />
      <div className="bar bar--bot" ref={bot} aria-hidden="true" />
      <div className="outro" ref={fade} aria-hidden="true" />
    </>
  );
}
