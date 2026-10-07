# AGENTS.md — repository notes

Static, dependency-free presentation site for Mathan Kumar. S (Cyber Wolf
internship, project: Auto Health Checker). No build step, no framework, no
package manager.

## Run

```bash
python3 -m http.server 12000     # then open http://localhost:12000/
```

The `DOWNLOAD` button needs a server (it `fetch()`es local files); everything
else works from `file://`.

## File map

- `index.html` — structure, 12 `.slide` sections (hero, s1–s10, thanks)
- `styles.css` — entire design system; ends with numbered section comments
- `content.js` — all editable text, numbers and config (the `C` object)
- `audio.js` — `window.Sfx`: synthesised transitions + optional file overrides
- `app.js` — nav, scroll snap, reveals, counters, canvas FX, demo scan, export
- `assets/brand/` — only the files the site loads
- `brand-source/` — downloaded originals, not loaded

## Conventions

- Vanilla ES5-flavoured JS in IIFEs; no modules, so the file works when inlined.
- **Never write a literal `</script>` inside `app.js`.** The export inlines
  `app.js` into a `<script>` block, so a literal close tag truncates it and the
  standalone file dies with "Invalid or unexpected token". Always escape it as
  `'<\/script>'`. The export needles in `exportStandalone()` depend on this.
- Use `sub(html, needle, value)` (split/join) for substitution, never
  `String.replace` — `$&`, `$$` and `$'` in the payload corrupt the output.
- Animation uses the CSS `transform` / `translate` / `scale` properties. Magnet
  and tilt set `--mgx` `--mgy` `--rx` `--ry` custom properties and the CSS
  composes them; never set `el.style.transform` directly or hover lifts break.
- `.reveal` animates the `translate` property (not `transform`) so it composes
  with cards that carry their own transform.
- Font sizes: keep body text ≥ 9px. This is a projector deck.

## Verified facts — do not change without a new source

From the issued certificate: name, register no 2194945281505, internship title
"Ethical Hacking (Offline)", 01/09/2026–01/10/2026, cert no CW20267990067144,
signatory Tamilselvan S. From cyberwolf360.in: 12,400+ / 180+ / 120+ / 24×7.

Never invent dates, mentor names, statistics or achievements.

## Placeholders

`[INTERNSHIP ROLE]`, `[INTERNSHIP DURATION]`, `[MENTOR NAME]`,
`[INTERNSHIP START DATE]`, `[INTERNSHIP END DATE]` live in `content.js` under
`internship` and render with amber bracket styling. Do not fabricate values.

## Checks worth running after edits

1. No literal `</script>` in `app.js` (grep it).
2. CSS brace count balanced.
3. `document.documentElement.scrollWidth === clientWidth` at 390px and 1600px.
4. Zero console/page errors; the exported file renders standalone with 12
   slides, score 87 and a non-zero logo width.
5. Reduced motion: stats reach final values, arch nodes get `is-in`.

Playwright is the tool used for all of the above.
