/**
 * Asset and font check.
 *
 * Confirms the things that silently degrade a dark, typography-led deck: the
 * brand font actually loading, the Cyber Wolf logo and certificate decoding,
 * and no image falling back to a broken placeholder.
 *
 * Run against the dev server or a preview build:  node scripts/assets.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:12000/'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })

const failedRequests = []
page.on('requestfailed', (r) => failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`))
page.on('response', (r) => {
  if (r.status() >= 400) failedRequests.push(`${r.url()} — HTTP ${r.status()}`)
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

// Scroll the entire deck so every lazy-loaded image is actually fetched.
await page.evaluate(async () => {
  const ids = ['hero','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','thanks']
  for (const id of ids) {
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
    await new Promise((r) => setTimeout(r, 260))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(1800)

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

// Brand font
const fonts = await page.evaluate(async () => {
  await document.fonts.ready
  return {
    grotesk: document.fonts.check('700 48px "Host Grotesk"'),
    bodyFamily: getComputedStyle(document.body).fontFamily,
    loaded: [...document.fonts].map((f) => `${f.family} ${f.weight}`),
  }
})
record('Host Grotesk font loads', fonts.grotesk, fonts.loaded.join(', '))
record('body uses Host Grotesk', /Host Grotesk/.test(fonts.bodyFamily), fonts.bodyFamily)

// Images
const images = await page.evaluate(() =>
  [...document.querySelectorAll('img')].map((img) => ({
    src: img.getAttribute('src'),
    complete: img.complete,
    natural: img.naturalWidth,
    alt: img.getAttribute('alt') ?? '',
  })),
)
const broken = images.filter((i) => !i.complete || i.natural === 0)
record('all images decode', broken.length === 0, broken.map((b) => b.src).join(', '))

const logo = images.find((i) => /cyberwolf/.test(i.src ?? ''))
record('Cyber Wolf logo present and decoded', Boolean(logo && logo.natural > 0), logo?.src ?? 'not found')

// Certificate sits on a late slide; scroll there so the lazy image is fetched.
await page.evaluate(() => document.getElementById('s10')?.scrollIntoView())
await page.waitForTimeout(2200)
const cert = await page.evaluate(() => {
  const img = document.querySelector('img[alt*="certificate" i], img[src*="certificate.jpg"]')
  if (!img) return null
  return { src: img.getAttribute('src'), natural: img.naturalWidth, complete: img.complete }
})
record(
  'certificate image decodes',
  Boolean(cert && cert.natural > 0 && cert.complete),
  cert ? `${cert.src} ${cert.natural}px` : 'not found',
)

// The certificate is meaningful content and needs a description. Logos that sit
// beside visible "Cyber Wolf" text are decorative and correctly carry alt="".
const certAlt = await page.evaluate(() => {
  const img = document.querySelector('img[src*="certificate.jpg"]')
  return img?.getAttribute('alt') ?? ''
})
record('certificate has descriptive alt text', certAlt.length > 20, certAlt.slice(0, 70))

const logosWithAlt = images.filter((i) => /cyberwolf/.test(i.src ?? '') && i.alt.length > 0)
record(
  'standalone logo carries an accessible name',
  logosWithAlt.length > 0,
  logosWithAlt.map((l) => l.alt).join(', ') || 'all logos decorative',
)

record('no failed network requests', failedRequests.length === 0, failedRequests.slice(0, 3).join(' | '))

await browser.close()

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} asset checks passed`)
if (failed.length) process.exit(1)
