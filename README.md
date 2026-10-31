# Every Developer Has a Beginning — Cinematic 3D Story Portfolio

A scroll-driven, story-first 3D portfolio. A small boy walks through one continuous world —
**Beginning → About → School → College → Projects → Internship → Skills → Reveal → Contact** — and grows into
the developer behind the site. Scrolling *is* the film: the camera, the character's walk cycle, aging, lighting,
sky colour and narration are all driven by scroll progress.

**Stack:** React + Vite · Three.js · React Three Fiber · Drei · GSAP ScrollTrigger · Lucide React · plain CSS.
No paid APIs, plugins or services. Fonts are self-hosted (works offline).

---

## 1. Install & run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```
Requires Node.js 18+.

## 2. Put in your own content  (everything lives in ONE file)

Open **`src/data/story.js`**:

| Section | What to edit |
|---|---|
| `profile` | name, intro, about paragraphs |
| `school` | name, years, photo, memories, achievements |
| `college` | years, event/hackathon photos, highlights |
| `projects` | name, description, technologies, screenshot, GitHub / live links (add more any time) |
| `internship` | dates, responsibilities, tasks, certificate / experience letter / recommendation files |
| `skillGroups` | skills per category |
| `contact` | email, GitHub, LinkedIn, portfolio |
| `narration` | subtitle + voice script for every scene |

* Anything in **[square brackets]** is a **placeholder** and is shown with a dashed gold underline.
* `null` photos show a clearly-labelled placeholder *inside the 3D world*.
* Nothing is invented: awards, certificates, dates and links stay empty until you fill them in.
* Images go in `public/images/`, documents in `public/docs/` (`.pdf`, `.jpg`, `.png`, `.webp`).
  Reference them as `/images/school.jpg`, `/docs/certificate.pdf`.
* Pre-filled from what you told me: Chandru G, B.Tech IT, Kumaraguru College of Technology (Coimbatore), the four
  projects, ElevanceSkills full-stack internship, the skill list. The Memoria Blooms / Januzz tech lists and the
  "Task 1 — Q&A Community Platform" internship entry came from your earlier project notes — **please verify them**.

## 3. How the story is built

```
src/
  data/story.js          ← all your content
  world/timeline.js      ← chapters, camera keyframes, boy position/yaw/age, colour palette (the "director's script")
  world/Experience.jsx   ← damped scroll → camera, lights, fog; sky, stars, mountains, ground; mounts scenes lazily
  world/Boy.jsx          ← articulated character: walk cycle, sitting/typing, waving, child → adult growth
  world/scenes/*.jsx     ← one environment per chapter (only the current ± 1 are mounted)
  ui/                    ← loader, HUD, story panels, modals, accessible text version
  scroll.js              ← one GSAP ScrollTrigger drives everything
```

* **Changing pacing:** edit `CHAPTERS[].start` and the keyframe table `K` in `timeline.js`
  (`[progress, worldX, yaw, sit, mountains, night, fov, camOffset(x,y,z), lookOffset(x,y,z)]`).
  Total scroll length is `1300vh` desktop / `1500vh` mobile (`App.jsx`).
* **More projects:** add objects to `projects[]`. They line up every 14 units from x=168; if you add many,
  lengthen the Projects chapter in `timeline.js`.
* **Photos in 3D:** school photo hangs on the noticeboard, achievements become floating frames, college photos float
  along the campus path, internship documents float around the desk (click to open).

## 4. Narration & subtitles

Subtitles are always on (toggle with the CC button). **Voice narration is optional and off by default** — it uses the
browser's free Speech Synthesis, never autoplays, and offers mute / pause / replay. The site is fully understandable
without audio. Change `speechLang` voices in `src/narration.js` (`en-IN` by default).

## 5. Accessibility & performance

* Semantic HTML, keyboard-reachable controls, visible focus rings, `aria-live` subtitles, skip link.
* **"Text version"** button (and automatic fallback when WebGL is unavailable or the 3D scene errors) shows the whole
  story as plain accessible HTML.
* `prefers-reduced-motion`: no camera sway/parallax, no floating particles, instant (un-damped) scroll response,
  no typewriter or letterbox animation.
* Scenes mount only near the current chapter; instanced meshes for trees/flowers/towers; adaptive DPR
  (drops automatically on slow GPUs); smaller shadow maps, fewer particles and trees on mobile.
* Textures/geometries/materials are disposed on unmount; GSAP tickers and listeners are cleaned up.

## 6. Swapping in your own character (GLB / Blender)

The hero is a hand-built, original, **procedural articulated rig** (no external assets, no licence issues). It is real
skeletal-style animation (hips → knees, shoulders → elbows, head, face) with growth, but it is stylised/low-poly.
If you want a Blender-modelled character instead:

1. Model/rig a boy in Blender (or use a CC0 model from Quaternius, Mixamo-rigged characters, or Poly Pizza).
   Keep animation clips named `Idle`, `Walk`, `Sit`, `Wave`; export **glTF Binary (.glb)** with Draco compression.
2. Optimise: `npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`.
3. Put it at `public/models/character.glb`; load with `useGLTF` + `useAnimations` from Drei in a copy of `Boy.jsx`.
4. Drive it from the same state: `world.x`, `world.yaw`, `world.walk` (0–1, cross-fade Idle↔Walk), `world.sit`,
   `world.age` (scale 0.62→1 and swap material colours; or blend two meshes / morph targets for the transformation).
   `world.glow` is the 0–1 growth flash.

## 7. Free deployment

**Vercel:** push to GitHub → vercel.com → *Add New Project* → import → framework *Vite* (auto) → Deploy.
**Netlify:** build command `npm run build`, publish directory `dist`.
**GitHub Pages:** set `base: '/<repo-name>/'` in `vite.config.js`, build, and publish `dist/` (e.g. `gh-pages` branch).
Because paths like `/images/…` are root-relative, prefer Vercel/Netlify (or adjust paths if using a sub-path).

## 8. Known limits / still needs you

* Real photographs (school, college, events), project screenshots and internship documents — placeholders until supplied.
* Internship dates/responsibilities, school/college years, real contact links — placeholders until supplied.
* The character is procedural, not a Blender-authored model (see §6).
* No post-processing (bloom/DoF) to keep the stack small and mobile-friendly; glow is faked with additive sprites.
* Tested via headless Chromium with software WebGL (no errors, scenes render). Please do a real-device pass on your phone.
* Fonts: Inter (SIL OFL) and Fraunces (SIL OFL) via Fontsource; `public/fonts/Inter-SemiBold.woff` is used for 3D text.
