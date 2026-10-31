import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { internship, projects } from '../data/story';
import { store, useStore } from '../store';
import { Ph } from './Panels';

export function ProjectModal() {
  const focus = useStore((s) => s.focus);
  const closeRef = useRef();
  const idx = focus ? projects.findIndex((p) => p.id === focus.id) : -1;
  const p = idx >= 0 ? projects[idx] : null;

  useEffect(() => {
    if (!p) return undefined;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && store.set({ focus: null });
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [p]);

  if (!p) return null;
  const go = (d) => store.set({ focus: { type: 'project', id: projects[(idx + d + projects.length) % projects.length].id } });
  return (
    <aside className="modal modal--side" role="dialog" aria-label={`${p.name} project details`} style={{ '--c': p.color }}>
      <button ref={closeRef} className="modal__close" onClick={() => store.set({ focus: null })} aria-label="Close project details">
        <X size={18} />
      </button>
      <p className="kicker">Project {String(idx + 1).padStart(2, '0')} of {String(projects.length).padStart(2, '0')}</p>
      <h2>{p.name}</h2>
      <p className="meta">{p.tagline}</p>
      <p className="lead"><Ph>{p.description}</Ph></p>
      {p.image && <img className="shot" src={p.image} alt={`${p.name} screenshot`} loading="lazy" />}
      <h3>Technologies</h3>
      <p className="chips">
        {p.tech.map((t) => (
          <span key={t}><Ph>{t}</Ph></span>
        ))}
      </p>
      <div className="cta">
        {p.github && (
          <a className="btn btn--ghost" href={p.github} target="_blank" rel="noopener noreferrer">
            <Github size={16} /> GitHub
          </a>
        )}
        {p.live && (
          <a className="btn" href={p.live} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} /> Live demo
          </a>
        )}
        {!p.github && !p.live && <p className="muted">[Add github / live links in src/data/story.js]</p>}
      </div>
      <div className="modal__nav">
        <button onClick={() => go(-1)} aria-label="Previous project"><ChevronLeft size={16} /> Prev</button>
        <button onClick={() => go(1)} aria-label="Next project">Next <ChevronRight size={16} /></button>
      </div>
    </aside>
  );
}

export function DocModal() {
  const id = useStore((s) => s.doc);
  const closeRef = useRef();
  const doc = id ? internship.documents.find((d) => d.id === id) : null;
  useEffect(() => {
    if (!doc) return undefined;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && store.set({ doc: null });
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc]);
  if (!doc) return null;
  const f = doc.file;
  const isPdf = f && /\.pdf$/i.test(f);
  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && store.set({ doc: null })}>
      <div className="modal modal--doc" role="dialog" aria-modal="true" aria-label={doc.title}>
        <button ref={closeRef} className="modal__close" onClick={() => store.set({ doc: null })} aria-label="Close document">
          <X size={18} />
        </button>
        <p className="kicker">{internship.company}</p>
        <h2>{doc.title}</h2>
        {!f && (
          <p className="lead">
            <span className="ph">[Document not added yet]</span> Place the file in <code>public/docs/</code> and set <code>file: '/docs/your-file.pdf'</code> for this document in <code>src/data/story.js</code>.
          </p>
        )}
        {f && isPdf && <object className="doc-view" data={f} type="application/pdf" aria-label={doc.title}><a href={f}>Open the PDF</a></object>}
        {f && !isPdf && <img className="doc-img" src={f} alt={doc.title} />}
        {f && (
          <a className="btn btn--ghost" href={f} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} /> Open in a new tab
          </a>
        )}
      </div>
    </div>
  );
}
