import { ArrowLeft } from 'lucide-react';
import { contact, college, internship, profile, projects, school, skillGroups } from '../data/story';
import { store } from '../store';
import { hasWebGL } from '../quality';
import { Ph } from './Panels';

/** Plain, semantic version of the whole story — for screen readers, no‑WebGL devices, and quick skimming. */
export default function TextVersion() {
  const canGo = hasWebGL();
  return (
    <main className="text-version" id="top">
      {canGo && (
        <button className="btn btn--ghost" onClick={() => store.set({ textMode: false })}>
          <ArrowLeft size={16} /> Back to the cinematic story
        </button>
      )}
      <h1>{profile.name}</h1>
      <p className="lead">{profile.role} · {profile.degree}</p>
      <p>{profile.intro}</p>
      {profile.aboutParagraphs.map((t, i) => <p key={i}>{t}</p>)}

      <h2>School</h2>
      <p><Ph>{school.name}</Ph>, <Ph>{school.location}</Ph> · <Ph>{school.years}</Ph></p>
      <ul>{school.memories.map((m, i) => <li key={i}><Ph>{m}</Ph></li>)}</ul>
      {school.achievements.length > 0 && <ul>{school.achievements.map((a, i) => <li key={i}>{a.title}{a.detail ? ` — ${a.detail}` : ''}</li>)}</ul>}

      <h2>College</h2>
      <p>{college.name}, {college.location} · {college.course} · <Ph>{college.years}</Ph></p>
      <p>{college.summary}</p>
      <ul>{college.highlights.map((m, i) => <li key={i}><Ph>{m}</Ph></li>)}</ul>

      <h2>Projects</h2>
      {projects.map((p) => (
        <article key={p.id}>
          <h3>{p.name} <small>— {p.tagline}</small></h3>
          <p><Ph>{p.description}</Ph></p>
          <p>Technologies: {p.tech.map((t, i) => <span key={t}>{i ? ', ' : ''}<Ph>{t}</Ph></span>)}</p>
          <p>
            {p.github && <a href={p.github}>GitHub</a>}{p.github && p.live ? ' · ' : ''}{p.live && <a href={p.live}>Live demo</a>}
          </p>
        </article>
      ))}

      <h2>Internship</h2>
      <p>{internship.role} at {internship.company} · <Ph>{internship.dates}</Ph></p>
      <ul>{internship.responsibilities.map((m, i) => <li key={i}><Ph>{m}</Ph></li>)}</ul>
      <ul>{internship.completedTasks.map((t, i) => <li key={i}><b>{t.title}</b> — {t.detail}</li>)}</ul>
      <ul>{internship.documents.map((d) => <li key={d.id}>{d.file ? <a href={d.file}>{d.title}</a> : <span>{d.title} <Ph>[not added yet]</Ph></span>}</li>)}</ul>

      <h2>Skills</h2>
      {skillGroups.map((g) => <p key={g.id}><b>{g.label}:</b> {g.items.join(', ')}</p>)}

      <h2>Contact</h2>
      <p>{contact.note}</p>
      <ul>{contact.links.map((l) => <li key={l.id}><a href={l.href}>{l.label}</a>: {l.value}</li>)}</ul>
    </main>
  );
}
