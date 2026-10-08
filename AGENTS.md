# AGENTS.md — repository notes

Interactive internship presentation for Mathan Kumar. S (Cyber Wolf internship,
project: Auto Health Checker). Twelve full-viewport `.slide` sections driven by a
shared section-navigation hook.

## Run

```bash
npm run dev          # http://localhost:12000/
npm run build        # tsc -b && vite build
npm run preview      # serves dist/ on http://localhost:12000/
npm run check        # verify + audit + assets, needs a server running
```

## Conventions

- Path alias `@/` maps to `src/`.
- All editable content lives in `src/data/content.ts`. Sections read from it;
  they do not hard-code copy. Add new text there, not in a component.
- Do not invent facts. Internship dates, the mentor name and any statistic not
  published on cyberwolf360.in must stay as a `[PLACEHOLDER]` or be omitted.
- Tailwind only; no ad-hoc CSS files. `src/index.css` holds the `@layer` base,
  the presentation-mode rules, and the few component classes (`.slide`, `.card`).
- Colour tokens come from `tailwind.config.js`. Use `brand-solid` — not `brand` —
  as the background behind white text: white on `brand` (#ff2d2d) is 3.7:1 and
  fails WCAG AA.
- Sections are resolved from the DOM by id in `useSectionNav`, so a section must
  carry the id listed in that hook's `ids` array.

## Layout rules that are load-bearing

- Each slide is `min-h-[100svh]` with `scroll-margin-top: var(--topbar-h)`, so
  sections land just below the fixed top bar. Navigation assertions must expect
  that offset rather than a `top` of 0.
- The left rail renders only at `>= 1500px`. Below that, the keyboard and wheel
  are the supported navigation paths.
- `body.is-presenting` pins slides to exactly one viewport and hides `.topbar`,
  `.rail` and `.site-footer`. Those class names are the contract between
  `src/index.css` and the layout components.
- Recharts is imported only by `FindingsDashboard`, which `Project.tsx` lazy-loads
  behind `Suspense`. Keep it that way; it is ~400 kB and must not enter the
  initial bundle.

## Verifying

`scripts/verify.mjs`, `scripts/audit.mjs` and `scripts/assets.mjs` drive a real
browser via Playwright. Prefer extending them over writing one-off checks. They
accept `BASE_URL` to target a preview build:

```bash
BASE_URL=http://localhost:12001/ npm run check
```

`scripts/content.mjs` dumps every slide's rendered text — the quickest way to
review copy and spot a placeholder or an unverified number.

## Gotchas

- `vite.config.ts` injects the CSP meta tag at build time only. Adding it to
  `index.html` breaks the dev server, which needs an inline module preamble.
  `frame-ancestors` is deliberately excluded from the meta tag (browsers warn
  and ignore it there) and set only in `public/_headers` and `vercel.json`.
- Tailwind config changes need a dev-server restart; HMR does not pick them up.
- `vite.config.ts` sets `server.allowedHosts` / `preview.allowedHosts` to the
  `.prod-runtime.all-hands.dev` and `.all-hands.dev` suffixes. Without them Vite
  answers 403 "Blocked request. This host is not allowed" when the site is opened
  through the workspace's forwarded https URL — which is the URL you present from.
  Keep them if you want the forwarded link to work.
- Sound is synthesised per section; there are no audio files. Map files in
  `sound.perSection` in `content.ts` to override individual sections.
- The workspace terminal has been reset mid-session before; a reset kills the dev
  and preview servers *and* clears Playwright's downloaded browser cache. After a
  reset, rerun `npx playwright install chromium` before `npm run check`.
