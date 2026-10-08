/**
 * Layout and accessibility audit.
 *
 * Catches the defects that are easy to miss by eye on a dark theme:
 * clipped text, elements overlapping each other, text sitting on top of other
 * text, contrast that fails WCAG AA, and tap targets that are too small.
 *
 * Run against the dev server:  node scripts/audit.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:12000/'
const browser = await chromium.launch({ args: ['--no-sandbox'] })

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const AUDIT = () => {
  const problems = {
    clipped: [],
    overlapping: [],
    lowContrast: [],
    smallTargets: [],
  }

  const srgb = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const luminance = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
  const parse = (str) => {
    const m = str.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const parts = m[1].split(',').map((n) => parseFloat(n))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 }
  }
  /** Walk up the tree for the first opaque background. */
  const effectiveBg = (el) => {
    let node = el
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor)
      if (c && c.a > 0.85) return c
      node = node.parentElement
    }
    const body = parse(getComputedStyle(document.body).backgroundColor)
    return body ?? { r: 11, g: 13, b: 18, a: 1 }
  }

  const isVisible = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return false
    if (parseFloat(s.opacity) < 0.05) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  // ── Clipped text ─────────────────────────────────────────────────────────
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,span,dt,dd,strong,b,code')) {
    if (!isVisible(el)) continue
    if (el.classList.contains('sr-only')) continue
    // Only leaf-ish text nodes, so a container's scrollWidth is not misread.
    if (el.children.length > 0 && el.textContent.trim() === '') continue
    const s = getComputedStyle(el)
    // An intentional ellipsis (text-overflow: ellipsis) is not a clipping bug.
    if (s.textOverflow === 'ellipsis') continue
    const overflowsX = el.scrollWidth > el.clientWidth + 2
    const clips = s.overflow === 'hidden' || s.overflowX === 'hidden'
    const noWrap = s.whiteSpace === 'nowrap'
    if (overflowsX && (clips || noWrap) && el.clientWidth > 0) {
      problems.clipped.push({
        tag: el.tagName.toLowerCase(),
        text: el.textContent.trim().slice(0, 40),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
      })
    }
  }

  // ── Overlapping elements ─────────────────────────────────────────────────
  // Compare text blocks against each other; a deliberate overlap would show up
  // as text sitting on unrelated text.
  const textBlocks = [...document.querySelectorAll('h1,h2,h3,h4,p,li,button,dt,dd')].filter(
    (el) => isVisible(el) && el.textContent.trim().length > 2 && el.children.length === 0,
  )
  for (let i = 0; i < textBlocks.length; i += 1) {
    const a = textBlocks[i].getBoundingClientRect()
    for (let j = i + 1; j < textBlocks.length; j += 1) {
      const b = textBlocks[j].getBoundingClientRect()
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (overlapX > 8 && overlapY > 8) {
        // Containment (a parent list item wrapping its own text) is not a clash.
        const contains =
          (a.left <= b.left && a.right >= b.right && a.top <= b.top && a.bottom >= b.bottom) ||
          (b.left <= a.left && b.right >= a.right && b.top <= a.top && b.bottom >= a.bottom)
        if (contains) continue
        problems.overlapping.push({
          a: textBlocks[i].textContent.trim().slice(0, 28),
          b: textBlocks[j].textContent.trim().slice(0, 28),
          overlapX: Math.round(overlapX),
          overlapY: Math.round(overlapY),
        })
      }
    }
  }

  // ── Contrast (WCAG AA: 4.5:1 body, 3:1 large text) ───────────────────────
  for (const el of document.querySelectorAll('p,li,dd,dt,h1,h2,h3,h4,span,button,a,strong,b')) {
    if (!isVisible(el)) continue
    if (el.children.length > 0) continue
    const text = el.textContent.trim()
    if (!text) continue
    const s = getComputedStyle(el)
    const fg = parse(s.color)
    if (!fg || fg.a < 0.6) continue
    const bg = effectiveBg(el)
    const l1 = luminance(fg.r, fg.g, fg.b)
    const l2 = luminance(bg.r, bg.g, bg.b)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const size = parseFloat(s.fontSize)
    const weight = parseInt(s.fontWeight, 10) || 400
    const isLarge = size >= 24 || (size >= 18.66 && weight >= 700)
    const needed = isLarge ? 3 : 4.5
    if (ratio < needed) {
      problems.lowContrast.push({
        text: text.slice(0, 34),
        ratio: Math.round(ratio * 100) / 100,
        needed,
        color: s.color,
        size: Math.round(size),
      })
    }
  }

  // ── Tap targets on touch widths ──────────────────────────────────────────
  for (const el of document.querySelectorAll('button,a[href]')) {
    if (!isVisible(el)) continue
    if (el.classList.contains('sr-only')) continue
    // WCAG 2.5.8 exempts targets inside a sentence; flag standalone controls only.
    const inlineInText =
      el.tagName === 'A' && el.parentElement?.textContent.trim().length > el.textContent.trim().length + 12
    if (inlineInText) continue
    const r = el.getBoundingClientRect()
    if (r.height < 24 || r.width < 24) {
      problems.smallTargets.push({
        text: (el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 30),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  }

  return problems
}

const VIEWPORTS = [
  { name: 'projector 1920x1080', width: 1920, height: 1080 },
  { name: 'phone 390x844', width: 390, height: 844 },
]

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })

  // Reveal-animated blocks start at opacity 0; settle the whole deck first so
  // the audit sees final layout, not mid-animation frames.
  await page.evaluate(async () => {
    const ids = [
      'hero',
      's1',
      's2',
      's3',
      's4',
      's5',
      's6',
      's7',
      's8',
      's9',
      's10',
      'thanks',
    ]
    for (const id of ids) {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
      await new Promise((r) => setTimeout(r, 320))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 500))
  })
  await page.waitForTimeout(1200)

  const problems = await page.evaluate(AUDIT)

  record(
    `[${vp.name}] no clipped text`,
    problems.clipped.length === 0,
    problems.clipped
      .slice(0, 3)
      .map((c) => `${c.tag}"${c.text}" ${c.scrollW}>${c.clientW}`)
      .join(' | '),
  )
  record(
    `[${vp.name}] no overlapping text`,
    problems.overlapping.length === 0,
    problems.overlapping
      .slice(0, 3)
      .map((o) => `"${o.a}" ∩ "${o.b}" (${o.overlapX}x${o.overlapY})`)
      .join(' | '),
  )
  record(
    `[${vp.name}] text meets WCAG AA contrast`,
    problems.lowContrast.length === 0,
    problems.lowContrast
      .slice(0, 4)
      .map((c) => `"${c.text}" ${c.ratio}:1 needs ${c.needed}`)
      .join(' | '),
  )
  record(
    `[${vp.name}] tap targets >= 24px`,
    problems.smallTargets.length === 0,
    problems.smallTargets
      .slice(0, 4)
      .map((t) => `"${t.text}" ${t.w}x${t.h}`)
      .join(' | '),
  )

  await context.close()
}

await browser.close()

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} audit checks passed`)
if (failed.length) {
  console.log('\nIssues:')
  failed.forEach((f) => console.log(`  • ${f.name} — ${f.detail}`))
  process.exit(1)
}
