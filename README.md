# Auto Health Checker — Internship Presentation

An interactive, cinematic internship presentation for **Mathan Kumar. S**
(Cyber Wolf internship, project: *Auto Health Checker*).

The deck is twelve full-viewport sections that behave like slides: a hero, ten
numbered sections covering the organisation, the project, the architecture and
the outcomes, then a certificate and a closing slide. It is built to be driven
from a projector, a laptop, a tablet or a phone.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:12000/
```

Build and serve the production bundle:

```bash
npm run build
npm run preview      # http://localhost:12000/
```

The production build injects a strict Content-Security-Policy meta tag, and
`public/_headers` / `vercel.json` serve the same policy (plus `frame-ancestors`,
which browsers ignore in a meta tag) as real HTTP headers.

---

## Presenting

| Action | Control |
|---|---|
| Next / previous slide | `↓` `↑`, `Page Down` / `Page Up`, mouse wheel, touch swipe |
| Jump to a slide | Click any entry in the left rail |
| First / last slide | `Home` / `End` |
| Presentation mode | The **Present** button, or `p` |
| Leave presentation mode | `Esc` |
| Mute the transition tones | The sound button in the top bar |

Presentation mode hides the top bar and the rail, pins each slide to exactly one
viewport, and keeps the keyboard controls. Motion is reduced automatically when
the operating system asks for it.

---

## Editing the content

Everything the deck displays lives in `src/data/content.ts` — student details,
the project copy, objectives, architecture nodes, challenges, skills, the demo
scan transcript and the sound configuration. Editing that one file is enough to
update the presentation; no component changes are needed.

### Placeholders

Five values are intentionally left as placeholders because they were not
supplied. They render as visibly marked chips rather than invented text:

`[INTERNSHIP ROLE]`, `[INTERNSHIP DURATION]`, `[INTERNSHIP START DATE]`,
`[INTERNSHIP END DATE]`, `[MENTOR NAME]`

Replace them in `src/data/content.ts` when you have the details.

### Company figures

`orgStats` holds only the three headline numbers Cyber Wolf publishes on
cyberwolf360.in — 12,400+ vulnerabilities found, 180+ enterprises secured and
99.99% SOC uptime. No other statistic is shown, because an unsourced figure on a
company slide is worse than no figure at all.

---

## Sound effects

The deck ships with a synthesised transition tone for every section, so it has
working sound without a single audio file. To use your own sounds, drop files
into `public/assets/sfx/` and map them in the `sound.perSection` block of
`src/data/content.ts`:

```ts
perSection: {
  s5: { mode: 'file', src: 'assets/sfx/transition-project.mp3' },
},
```

Unmapped sections keep their generated tone, so you can swap them in one at a
time. Browsers block audio until the visitor interacts, so the audio context
unlocks on the first click, key press or touch.

---

## Verifying changes

Three browser-driven harnesses check the deck against a running server. They
need Playwright's Chromium once: `npx playwright install chromium`.

```bash
npm run dev            # in one terminal
npm run check          # in another
```

| Command | What it checks |
|---|---|
| `npm run verify` | Structure, navigation, presentation mode, the demo scan, the charts, reduced motion, console cleanliness, and horizontal overflow at four viewport sizes |
| `npm run audit` | Clipped text, overlapping text, WCAG AA contrast, and tap-target sizes |
| `npm run assets` | The brand font loading, the logo and certificate decoding, alt text, and failed requests |
| `npm run content` | Prints the rendered text of every slide, for reading the deck end to end |

Point any of them at a different build with `BASE_URL`:

```bash
BASE_URL=http://localhost:12001/ npm run check
```

---

## Project layout

```
src/
  data/content.ts        All editable text, numbers and configuration
  lib/                   Class-name helper, number formatting, sound engine
  hooks/                 Media queries, reveal-on-scroll, count-up, section
                         navigation, audio unlock, card tilt
  components/ui/         Button, Card, micro-label primitives
  components/layout/     Top bar, left rail, section headings
  components/demo/       Health ring, scan terminal, demo scan dialog,
                         findings dashboard (Recharts, lazy-loaded)
  components/sections/   The twelve slides
scripts/                 Browser-driven verification harnesses
public/
  assets/brand/          Cyber Wolf logo, certificate, favicons
  assets/fonts/          Self-hosted Host Grotesk
  assets/sfx/            Drop-in point for transition sounds
```

## Stack

Vite, React, TypeScript, Tailwind CSS, Framer Motion for transitions, and
Recharts for the findings dashboard (loaded on demand, so it stays out of the
initial bundle). Fonts are self-hosted, so the deck renders identically with no
network access.
