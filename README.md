# Auto Health Checker — Internship Presentation

An interactive, cinematic 10-section internship presentation for **Mathan Kumar. S**
(Cyber Wolf internship, project: *Auto Health Checker*).

It is a static site — no build step, no dependencies, no framework. Open `index.html`
and it runs.

---

## Run it

Any static server works. From this folder:

```bash
python3 -m http.server 12000
```

Then open <http://localhost:12000/>.

Opening `index.html` directly from the filesystem also works, except the
**DOWNLOAD** button (browsers block `fetch()` on `file://`). Use the server if you
want to produce the offline copy.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Structure: hero, sections 01–10, thank-you, modals |
| `styles.css` | The whole design system (tokens, layout, animation, responsive, a11y) |
| `content.js` | **Everything editable** — student, internship, project, company, tech stack, sounds |
| `audio.js` | Sound engine (synthesised transitions + support for your own audio files) |
| `app.js` | Navigation, scroll snapping, reveals, counters, canvas FX, demo scan, export |
| `assets/brand/` | Cyber Wolf logo variants, certificate image, favicon |

---

## Fill in the placeholders

Four details were never supplied, so they render as visible amber placeholders.
Open **`content.js`** and replace the bracketed values under `internship`:

```js
internship: {
  role:      '[INTERNSHIP ROLE]',
  duration:  '[INTERNSHIP DURATION]',
  mentor:    '[MENTOR NAME]',
  startDate: '[INTERNSHIP START DATE]',
  endDate:   '[INTERNSHIP END DATE]',
  ...
}
```

They appear in **Section 02 → INTERNSHIP EXPERIENCE**. The same values feed the
`[BRACKETS]` styling automatically, so nothing else needs touching.

### Already verified — leave as is unless reissued

These come from the issued certificate and the official Cyber Wolf website:

| Field | Value | Source |
|---|---|---|
| Student | Mathan Kumar. S | certificate + brief |
| Register No | 2194945281505 | certificate |
| Internship title | Ethical Hacking (Offline) | certificate |
| Period | 01/09/2026 – 01/10/2026 | certificate |
| Certificate No | CW20267990067144 | certificate |
| Signatory | Tamilselvan S, Founder & CEO | certificate |
| Company figures | 12,400+ / 180+ / 120+ / 24×7 | cyberwolf360.in |

Nothing outside those sources is claimed anywhere in the deck.

---

## Presenting

| Action | Keys |
|---|---|
| Next / previous section | `↓` `↑` `PageDown` `PageUp` `←` `→` `Space` |
| First / last section | `Home` `End` |
| Toggle presentation mode | `P` |
| Exit presentation mode | `Esc` |
| Run demo scan | the **RUN DEMO SCAN** button |

Mouse wheel and touch swipe also move between sections. On sections taller than
the screen, normal scrolling happens first and the snap takes over at the edge.

**PRESENTATION MODE** hides the site chrome, goes full screen, and keeps one
section per viewport with a progress bar.

**DOWNLOAD** writes a single self-contained `Auto-Health-Checker-Presentation.html`
(~2.4 MB) with the CSS, JS, logo and certificate inlined. That file opens offline
with no server and no asset folder — good for handing to an examiner.

---

## Sound

Section transitions have sound **already working out of the box** — the
transitions are synthesised in the browser with the Web Audio API, so no audio
files are needed. Each section gets its own tone, dropping in pitch as the deck
progresses.

Sound never starts before a user interaction (browser autoplay rules). The
speaker button in the top bar toggles it, and the choice is remembered.

### Use your own transition sounds

Drop files into `assets/sfx/` and map them in `content.js`:

```js
sound: {
  enabled: true,
  volume: 0.5,
  transitionMode: 'synth',      // fallback for unmapped sections
  perSection: {
    s10: { mode: 'file', src: 'assets/sfx/transition-certificate.mp3' },
    hero: { mode: 'file', src: 'assets/sfx/transition-hero.mp3' },
  },
  ui: { click: true, hover: false, complete: true },
}
```

Any section without a `perSection` entry keeps using the generated sound, so you
can swap sounds in one at a time. See `assets/sfx/README.md` for conventions.

Other knobs: `volume` (0–1), `ui.hover` (subtle hover blips, off by default
because it can get noisy), `ui.complete` (the flourish when a demo scan finishes).

---

## Editing content

`content.js` holds the text and numbers. A few useful entries:

- `project.subscores` — the five dashboard bars and their values
- `project.severity` — the CRITICAL/HIGH/MEDIUM/LOW counts
- `project.scan.counters` — the scan-panel numbers
- `project.healthScore` — drives the hero ring, the demo scan and the modal
- `TECH_STACK` — the technology cards in Section 04
- `arch` — the purpose / input / output / technology text for all 16 architecture nodes
- `company.capabilities` — the capability map nodes and their hover text
- `demoScan` / `demoStages` — the terminal output and the stage lines
- `boot` — the preloader lines

The demo scan is a **visual demonstration only**. It reads text from `content.js`
and animates it. It never contacts, scans or attacks any website.

---

## Deploying

The whole thing is static. Upload the folder to any host — GitHub Pages, Netlify,
Vercel, Cloudflare Pages, or a college web directory. Keep the folder structure so
`assets/brand/` stays alongside `index.html`.

---

## Accessibility & performance notes

- Full keyboard navigation with visible focus rings on every control
- Semantic landmarks, labelled sections, alt text on every image
- `prefers-reduced-motion` is respected: animations stop, content renders
  immediately, counters show final values
- Canvas animation pauses when the tab is hidden or the section is off screen
- The certificate image is lazy-loaded and blur-up (a 651-byte placeholder first)
- No third-party JavaScript; the only external request is Google Fonts, and the
  downloaded offline copy drops even that
