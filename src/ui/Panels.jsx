import { ArrowDown, ExternalLink, FileText, Github, Linkedin, Mail, MousePointerClick, RotateCcw, Globe } from 'lucide-react';
import { Reveal } from './Reveal';
import { CHAPTERS, chapterCenter, chapterRange } from '../world/timeline';
import { contact, college, internship, profile, projects, school, skillGroups } from '../data/story';
import { isPlaceholder } from '../world/util';
import { store } from '../store';
import { jumpTo } from '../scroll';

export const Ph = ({ children }) =>
  isPlaceholder(children) ? (
    <span className="ph" title="Placeholder — replace it in src/data/story.js">
      {children}
    </span>
  ) : (
    <>{children}</>
  );

function Panel({ ch, side = 'right', title, children, className = '' }) {
  const [a, b] = chapterRange(ch);
  return (
    <Reveal as="section" from={a + 0.012} to={b + 0.004} className={`panel panel--${side} ${className}`} aria-label={title}>
      <p className="kicker">
        Chapter {String(ch + 1).padStart(2, '0')} · {CHAPTERS[ch].label}
      </p>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

const List = ({ items }) => (
  <ul className="list">
    {items.map((m, i) => (
      <li key={i}>
        <Ph>{m}</Ph>
      </li>
    ))}
  </ul>
);

export default function Panels() {
  const [aA, bA] = chapterRange(1);
  const [aP, bP] = chapterRange(4);
  const [aI, bI] = chapterRange(5);
  return (
    <div className="panels">
      {/* 1 — The beginning */}
      <Reveal className="hero" from={-1} to={0.085} fade={0.02} y={0}>
        <p className="kicker">An interactive story by {profile.name}</p>
        <h1>{profile.headline}</h1>
      </Reveal>
      <Reveal className="hint" from={-1} to={0.06} fade={0.02} y={0}>
        <span>Scroll to begin the story</span>
        <ArrowDown size={20} className="bounce" />
      </Reveal>

      {/* 2 — About */}
      <Panel ch={1} title="A curious mind">
        {profile.aboutParagraphs.map((t, i) => (
          <Reveal key={i} as="p" from={aA + 0.012 + i * 0.028} to={bA + 0.004} y={14} className="lead">
            {t}
          </Reveal>
        ))}
        <Reveal className="chips" from={aA + 0.1} to={bA + 0.004} y={10}>
          <span>{profile.degree}</span>
          <span>{profile.role}</span>
        </Reveal>
      </Panel>

      {/* 3 — School */}
      <Panel ch={2} title="School days">
        <p className="meta">
          <Ph>{school.name}</Ph> · <Ph>{school.location}</Ph> · <Ph>{school.years}</Ph>
        </p>
        <h3>Memories & activities</h3>
        <List items={school.memories} />
        <h3>Achievements</h3>
        {school.achievements.length ? (
          <ul className="list">
            {school.achievements.map((a, i) => (
              <li key={i}>
                {a.title}
                {a.detail ? ` — ${a.detail}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <List items={['[Add your real achievements and certificates in src/data/story.js]']} />
        )}
      </Panel>

      {/* 4 — College */}
      <Panel ch={3} title={college.name}>
        <p className="meta">
          {college.location} · {college.course} · <Ph>{college.years}</Ph>
        </p>
        <p className="lead">{college.summary}</p>
        <h3>Events, hackathons & coursework</h3>
        <List items={college.highlights} />
      </Panel>

      {/* 5 — Projects */}
      <Panel ch={4} side="left" title="Things I've built" className="panel--compact">
        <p className="lead">
          <MousePointerClick size={16} className="inline-icon" /> Click a hologram in the world — or choose one:
        </p>
        <div className="project-list">
          {projects.map((p, i) => (
            <button key={p.id} onClick={() => store.set({ focus: { type: 'project', id: p.id } })} style={{ '--c': p.color }}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>
                {p.name}
                <small>{p.tagline}</small>
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {/* 6 — Internship */}
      <Panel ch={5} side="left" title={internship.role} className="panel--compact">
        <p className="meta">
          {internship.company} · <Ph>{internship.dates}</Ph>
        </p>
        <h3>Responsibilities</h3>
        <List items={internship.responsibilities} />
        <h3>Completed tasks</h3>
        <ul className="list">
          {internship.completedTasks.map((t, i) => (
            <li key={i}>
              <b>{t.title}</b> — {t.detail}
            </li>
          ))}
        </ul>
        <div className="doc-buttons">
          {internship.documents.map((d) => (
            <button key={d.id} onClick={() => store.set({ doc: d.id })}>
              <FileText size={15} /> {d.title}
            </button>
          ))}
        </div>
      </Panel>

      {/* 7 — Skills */}
      <Panel ch={6} title="The toolbelt">
        <div className="skill-groups">
          {skillGroups.map((g) => (
            <div key={g.id} style={{ '--c': g.color }}>
              <h3>{g.label}</h3>
              <p>
                {g.items.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* 8 — The reveal */}
      <Reveal className="reveal-line" from={0.846} to={0.917} fade={0.014} y={0}>
        <p>
          <Reveal as="span" from={0.846} to={9} fade={0.014} y={0}>That little boy…</Reveal>{' '}
          <Reveal as="strong" from={0.868} to={9} fade={0.016} y={0}>is me.</Reveal>
        </p>
      </Reveal>
      <Reveal className="reveal-name" from={0.886} to={0.928} fade={0.014} y={10}>
        <p>
          I’m <strong>{profile.name}</strong> — and this is only the beginning of my story.
        </p>
      </Reveal>

      {/* 9 — Contact */}
      <Reveal as="section" aria-label="Contact" className="panel panel--right panel--wide contact" from={0.93} to={1.2} fade={0.014}>
        <p className="kicker">Chapter 09 · Contact &amp; Future</p>
        <h2>{profile.name}</h2>
        <p className="lead">{profile.intro}</p>
        <ul className="links">
          {contact.links.map((l) => {
            const Icon = { email: Mail, github: Github, linkedin: Linkedin, portfolio: Globe }[l.id] || ExternalLink;
            return (
              <li key={l.id}>
                <a href={l.href} target={l.id === 'email' ? undefined : '_blank'} rel="noopener noreferrer" className={l.placeholder ? 'is-ph' : ''} title={l.placeholder ? 'Placeholder — replace it in src/data/story.js' : undefined}>
                  <Icon size={16} /> <span>{l.label}</span>
                  <small>{l.value}</small>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="final">{contact.note}</p>
        <div className="cta">
          <button className="btn btn--ghost" onClick={() => jumpTo(chapterCenter(4))}>
            Explore my projects
          </button>
          <a className="btn" href={contact.links[0].href}>
            <Mail size={16} /> Contact me
          </a>
        </div>
      </Reveal>
      <Reveal className="replay" from={0.982} to={2} fade={0.01} y={0}>
        <button className="btn btn--ghost" onClick={() => jumpTo(0)}>
          <RotateCcw size={16} /> Back to the beginning
        </button>
      </Reveal>
    </div>
  );
}
