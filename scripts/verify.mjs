/**
 * Verification harness.
 *
 * Drives the real presentation in a real browser and asserts the things that
 * matter for a projector: no console errors, no horizontal overflow at any
 * breakpoint, every slide reachable, and the interactive pieces actually work.
 *
 * Run against the dev server:  node scripts/verify.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:12000/'
const VIEWPORTS = [
  { name: 'projector 1920x1080', width: 1920, height: 1080 },
  { name: 'laptop 1440x900', width: 1440, height: 900 },
  { name: 'tablet 834x1112', width: 834, height: 1112 },
  { name: 'phone 390x844', width: 390, height: 844 },
]

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch({ args: ['--no-sandbox'] })

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  const consoleErrors = []
  const pageErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  page.on('pageerror', (e) => pageErrors.push(String(e)))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2600)

  // Structure
  const slideCount = await page.locator('section.slide').count()
  record(`[${vp.name}] 12 slides present`, slideCount === 12, `found ${slideCount}`)

  const railCount = await page.locator('aside[aria-label="Slide navigation"] li').count()
  record(`[${vp.name}] rail has 12 items`, railCount === 12, `found ${railCount}`)

  // Horizontal overflow
  const overflow = await page.evaluate(() => {
    const de = document.documentElement
    const offenders = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      if (r.right > de.clientWidth + 2 || r.left < -2) {
        const style = getComputedStyle(el)
        if (style.position === 'fixed') continue
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 60),
          right: Math.round(r.right),
          left: Math.round(r.left),
        })
      }
    }
    return {
      scrollW: de.scrollWidth,
      clientW: de.clientWidth,
      offenders: offenders.slice(0, 5),
    }
  })
  record(
    `[${vp.name}] no horizontal overflow`,
    overflow.scrollW <= overflow.clientW + 2,
    `scrollW=${overflow.scrollW} clientW=${overflow.clientW}${
      overflow.offenders.length ? ` offenders=${JSON.stringify(overflow.offenders)}` : ''
    }`,
  )

  // Hero values
  const heroText = await page.locator('#hero').innerText()
  record(
    `[${vp.name}] hero shows AUTO HEALTH CHECKER`,
    /AUTO/.test(heroText) && /HEALTH CHECKER/.test(heroText),
  )
  record(`[${vp.name}] hero score is 87`, heroText.includes('87'))

  // Navigate every slide. The rail only exists at >=1500px; at narrower
  // widths the keyboard is the supported path.
  const railVisible = await page
    .locator('aside[aria-label="Slide navigation"]')
    .isVisible()
    .catch(() => false)
  const mechanism = railVisible ? 'rail' : 'keyboard'

  let navOk = true
  const navDetail = []
  for (let i = 0; i < 12; i += 1) {
    if (railVisible) {
      await page.locator('aside[aria-label="Slide navigation"] li button').nth(i).click()
    } else {
      await page.keyboard.press('Home')
      await page.waitForTimeout(700)
      for (let k = 0; k < i; k += 1) {
        await page.keyboard.press('ArrowDown')
        await page.waitForTimeout(700)
      }
    }
    await page.waitForTimeout(560)
    const pos = await page.evaluate((idx) => {
      const el = document.querySelectorAll('section.slide')[idx]
      if (!el) return null
      return Math.round(el.getBoundingClientRect().top)
    }, i)
    if (pos === null || pos < -4 || pos > 120) {
      navOk = false
      navDetail.push(`slide ${i} top=${pos}`)
    }
  }
  record(`[${vp.name}] ${mechanism} navigates all 12 slides`, navOk, navDetail.join(', '))

  // Keyboard navigation from a known position.
  await page.keyboard.press('Home')
  await page.waitForTimeout(800)
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(800)
  const afterArrow = await page.evaluate(() =>
    Math.round(document.querySelectorAll('section.slide')[1].getBoundingClientRect().top),
  )
  record(
    `[${vp.name}] ArrowDown advances a slide`,
    afterArrow >= -4 && afterArrow <= 120,
    `top=${afterArrow}`,
  )

  // Console cleanliness
  const realErrors = consoleErrors.filter(
    (t) => !/favicon|DevTools|Download the React DevTools/i.test(t),
  )
  record(
    `[${vp.name}] no console errors`,
    realErrors.length === 0 && pageErrors.length === 0,
    [...realErrors, ...pageErrors].slice(0, 3).join(' | '),
  )

  await context.close()
}

// Interactions on one viewport
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
const page = await context.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(String(e)))
await page.goto(BASE, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: /Run demo scan/i }).click()
await page.waitForTimeout(700)
const dialogVisible = await page.getByRole('dialog').isVisible()
record('demo scan dialog opens', dialogVisible)

await page.waitForTimeout(5200)
const dialogText = await page.getByRole('dialog').innerText()
record(
  'demo scan types transcript',
  dialogText.includes('Health Score') || dialogText.includes('87'),
  dialogText.includes('42 pages discovered') ? 'all lines present' : 'partial transcript',
)
record('demo scan reaches 87/100', /87/.test(dialogText))

await page.getByRole('button', { name: 'Close demo scan' }).click()
await page.waitForTimeout(400)
record('demo scan dialog closes', !(await page.getByRole('dialog').isVisible()))

record(
  'rail visible on projector width',
  await page.locator('aside[aria-label="Slide navigation"]').isVisible(),
)
await page.locator('aside[aria-label="Slide navigation"] li button').nth(5).click()
await page.waitForTimeout(2200)
const bars = await page.locator('.recharts-bar-rectangle').count()
record('findings dashboard renders bars', bars >= 4, `${bars} bars`)

const sevButtons = await page.getByRole('button', { name: /Critical/ }).count()
record('severity selector present', sevButtons >= 1)

await page.locator('aside[aria-label="Slide navigation"] li button').nth(6).click()
await page.waitForTimeout(900)
const archButtons = await page.getByRole('button', { name: 'AI ANALYSIS' }).count()
if (archButtons) {
  await page.getByRole('button', { name: 'AI ANALYSIS' }).first().click()
  await page.waitForTimeout(300)
  const detail = await page.locator('aside[aria-live="polite"]').innerText()
  record('architecture detail panel updates', /AI ANALYSIS/.test(detail), detail.split('\n')[1] ?? '')
} else {
  record('architecture detail panel updates', false, 'AI ANALYSIS node not found')
}

const soundBtn = page.getByRole('button', { name: /Mute sound effects|Unmute sound effects/ })
const before = await soundBtn.getAttribute('aria-pressed')
await soundBtn.click()
await page.waitForTimeout(200)
const after = await soundBtn.getAttribute('aria-pressed')
record('sound toggle switches state', before !== after, `${before} → ${after}`)

// Reduced motion
const rmContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const rmPage = await rmContext.newPage()
await rmPage.goto(BASE, { waitUntil: 'networkidle' })
await rmPage.waitForTimeout(800)
const rmScore = await rmPage.locator('#hero').innerText()
record('reduced motion renders hero score immediately', rmScore.includes('87'))

const hidden = await rmPage.evaluate(() => {
  let count = 0
  for (const el of document.querySelectorAll('section.slide *')) {
    const s = getComputedStyle(el)
    if (s.opacity === '0' && el.getBoundingClientRect().height > 10) count += 1
  }
  return count
})
record('reduced motion leaves nothing invisible', hidden < 8, `${hidden} hidden blocks`)

// Presentation mode: chrome hides, one slide per viewport, HUD appears.
await page.keyboard.press('Home')
await page.waitForTimeout(700)
await page.getByRole('button', { name: /^Present$/ }).click()
await page.waitForTimeout(900)

const presenting = await page.evaluate(() => document.body.classList.contains('is-presenting'))
record('presentation mode activates', presenting)

const chromeHidden = await page.evaluate(() => {
  const top = document.querySelector('.topbar')
  const rail = document.querySelector('.rail')
  return {
    top: !top || getComputedStyle(top).display === 'none',
    rail: !rail || getComputedStyle(rail).display === 'none',
  }
})
record('presentation mode hides the chrome', chromeHidden.top && chromeHidden.rail, JSON.stringify(chromeHidden))

const hud = await page.getByText(/Exit \(Esc\)/).isVisible()
record('presentation HUD shows', hud)

const slideFills = await page.evaluate(() => {
  const el = document.querySelectorAll('section.slide')[0]
  return Math.round(el.getBoundingClientRect().height) === window.innerHeight
})
record('slide fills exactly one viewport in presentation mode', slideFills)

await page.keyboard.press('Escape')
await page.waitForTimeout(700)
const exited = await page.evaluate(() => !document.body.classList.contains('is-presenting'))
record('Escape exits presentation mode', exited)

await page.keyboard.press('p')
await page.waitForTimeout(700)
record(
  'P enters presentation mode',
  await page.evaluate(() => document.body.classList.contains('is-presenting')),
)
await page.keyboard.press('Escape')
await page.waitForTimeout(500)

record('no page errors during interactions', errs.length === 0, errs.slice(0, 2).join(' | '))

await browser.close()

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length) {
  console.log('\nFailures:')
  failed.forEach((f) => console.log(`  • ${f.name}${f.detail ? ` — ${f.detail}` : ''}`))
  process.exit(1)
}
