/**
 * Content review.
 *
 * Dumps the rendered text of every slide so the deck can be read end to end
 * without a browser. Useful for checking that placeholders are still placeholders
 * and that nothing unverifiable has crept in.
 *
 * Run:  node scripts/content.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:12000/'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

const slides = await page.evaluate(() =>
  [...document.querySelectorAll('section.slide')].map((s, i) => ({
    index: i,
    id: s.id,
    label: s.getAttribute('aria-label') ?? '',
    text: s.innerText.replace(/\n{3,}/g, '\n\n').trim(),
  })),
)

for (const s of slides) {
  console.log(`\n${'='.repeat(72)}\nSLIDE ${String(s.index).padStart(2, '0')}  #${s.id}  ${s.label}\n${'='.repeat(72)}`)
  console.log(s.text)
}

const all = slides.map((s) => s.text).join('\n')
console.log(`\n${'='.repeat(72)}\nCHECKS\n${'='.repeat(72)}`)

const placeholders = [
  '[INTERNSHIP DURATION]',
  '[INTERNSHIP ROLE]',
  '[MENTOR NAME]',
  '[INTERNSHIP START DATE]',
  '[INTERNSHIP END DATE]',
]
const remaining = placeholders.filter((p) => all.includes(p))
console.log(`placeholders present in source : ${placeholders.length - remaining.length}/${placeholders.length}`)
console.log(`placeholders still unresolved  : ${remaining.length}`)
console.log(`slides rendered                : ${slides.length}`)
console.log(`total characters               : ${all.length}`)

// A scan of every number that appears, so anything unverifiable is easy to spot.
const numbers = [...all.matchAll(/\b\d[\d,.]*\s*(?:\+|×7|×24)?\b/g)].map((m) => m[0])
console.log(`numeric values on screen       : ${[...new Set(numbers)].join(', ')}`)

await browser.close()
