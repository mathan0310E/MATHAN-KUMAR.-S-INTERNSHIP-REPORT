import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Lock, Network, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrgBadge, riseIn, stagger } from '@/components/layout/SectionHeading'
import { HealthRing } from '@/components/demo/HealthRing'
import { demoScan, organization, project, student } from '@/data/content'
import { useTilt, tiltStyle } from '@/hooks/useTilt'
import { useReducedMotion } from '@/hooks/useMedia'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

const POKE_QUIPS = [
  'Ouch. That is the score, not a button.',
  'Still 87. Poking it again will not help.',
  'You found the interactive part. Well done.',
  'This is a demo dashboard. It has no feelings.',
  'Okay, now you are just enjoying this.',
]

const METRIC_ROWS = [
  { key: 'security', label: 'Security' },
  { key: 'performance', label: 'Performance' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'ux', label: 'UX' },
] as const

const SEVERITY = [
  { key: 'critical', label: 'Critical', className: 'text-critical' },
  { key: 'high', label: 'High', className: 'text-high' },
  { key: 'medium', label: 'Medium', className: 'text-warn' },
  { key: 'low', label: 'Low', className: 'text-info' },
] as const

export function Hero({
  onGo,
  onDownload,
}: {
  onGo: (i: number) => void
  onDownload: () => void
}) {
  const reduced = useReducedMotion()
  const tilt = useTilt()
  const [pokes, setPokes] = useState(0)
  const [hint, setHint] = useState('Hover the dashboard — it reacts.')

  const onPoke = () => {
    const next = pokes + 1
    setPokes(next)
    setHint(POKE_QUIPS[Math.min(next - 1, POKE_QUIPS.length - 1)])
    sfx.ui('hover')
    window.setTimeout(() => {
      setHint('Hover the dashboard — it reacts.')
      setPokes(0)
    }, 2600)
  }

  return (
    <section
      id="hero"
      data-label="OVERVIEW"
      className="slide pt-[calc(var(--topbar-h)+2rem)]"
      aria-labelledby="hero-title"
    >
      <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p
            variants={riseIn}
            className="mb-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            Internship project · Cybersecurity · AI &amp; Automation
          </motion.p>

          <motion.h1
            variants={riseIn}
            id="hero-title"
            className="text-display font-bold"
          >
            <span className="block text-ink">AUTO</span>
            <span className="block text-brand-ink [text-shadow:0_0_60px_rgba(255,0,7,.28)]">
              HEALTH CHECKER
            </span>
          </motion.h1>

          <motion.p variants={riseIn} className="mt-4 text-lg font-medium tracking-tight text-ink md:text-xl">
            {project.tagline}
          </motion.p>

          <motion.p variants={riseIn} className="mt-4 max-w-[56ch] text-[15px] text-ink-muted">
            An intelligent platform that automatically scans websites to identify vulnerabilities,
            bugs, broken flows, performance issues, accessibility problems and reliability risks.
          </motion.p>

          <motion.dl
            variants={riseIn}
            className="mt-6 grid gap-px overflow-hidden rounded-xl2 border border-white/[0.075] bg-white/[0.075]"
          >
            {[
              ['Student', student.name],
              ['Degree', student.degree],
              ['College', `${student.college} · ${student.university}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-0.5 bg-bg-2 px-4 py-2.5 sm:grid-cols-[104px_1fr] sm:gap-4"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
                  {label}
                </dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-0.5 bg-bg-2 px-4 py-2.5 sm:grid-cols-[104px_1fr] sm:gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
                Internship
              </dt>
              <dd className="flex items-center gap-2 text-sm text-ink">
                <OrgBadge size={20} src={organization.logoMark} />
                {organization.name}
              </dd>
            </div>
          </motion.dl>

          <motion.div variants={riseIn} className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={() => onGo(1)}>
              Explore project
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onGo(6)}>
              <Network className="h-[18px] w-[18px]" aria-hidden="true" />
              View architecture
            </Button>
            <Button variant="quiet" size="lg" onClick={onDownload}>
              <Download className="h-[18px] w-[18px]" aria-hidden="true" />
              Download presentation
            </Button>
          </motion.div>

          <motion.p variants={riseIn} className="mt-4 text-[12.5px] text-ink-dim">
            Press <kbd>P</kbd> for presentation mode · <kbd>↑</kbd> <kbd>↓</kbd> to move between
            slides
          </motion.p>
        </motion.div>

        <div className="lg:order-none order-first">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div
              ref={tilt.ref}
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
              style={tilt.enabled ? tiltStyle : undefined}
              className="overflow-hidden rounded-xl3 border border-white/15 bg-gradient-to-br from-surface to-bg-2 shadow-2xl transition-transform duration-300"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.075] bg-white/[0.02] px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <i className="h-2 w-2 rounded-full bg-white/25" />
                  <i className="h-2 w-2 rounded-full bg-white/25" />
                  <i className="h-2 w-2 rounded-full bg-white/25" />
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-black/35 px-2.5 py-1 font-mono text-[11.5px] text-ink-muted">
                  <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {demoScan.url}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-ok">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  SCAN COMPLETE
                </span>
              </div>

              <div className="grid items-center gap-6 p-5 sm:grid-cols-[auto_1fr]">
                <HealthRing value={demoScan.score} />
                <ul className="grid min-w-0 gap-2.5">
                  {METRIC_ROWS.map((row, i) => {
                    const pct = demoScan.metrics[row.key]
                    return (
                      <li
                        key={row.key}
                        className="grid grid-cols-[84px_1fr_30px] items-center gap-3"
                      >
                        <span className="text-[12.5px] text-ink-muted">{row.label}</span>
                        <span className="h-[5px] overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.i
                            className="block h-full rounded-full bg-brand"
                            initial={reduced ? { width: `${pct}%` } : { width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.4, delay: 0.4 + i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                          />
                        </span>
                        <span className="text-right font-mono text-xs text-ink tabular-nums">
                          {pct}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <ul className="grid grid-cols-4 border-t border-white/[0.075] bg-black/20">
                {SEVERITY.map((s) => (
                  <li
                    key={s.key}
                    className="flex flex-col gap-0.5 border-r border-white/[0.075] px-4 py-3 last:border-r-0"
                  >
                    <b className={cn('font-mono text-base font-semibold', s.className)}>
                      {String(demoScan.severity[s.key]).padStart(2, '0')}
                    </b>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-dim">
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onPoke}
              className="mt-2 w-full rounded-lg py-2 text-center font-mono text-[10.5px] tracking-[0.1em] text-ink-dim transition-colors hover:text-ink-muted"
            >
              {hint}
            </button>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onGo(1)}
        className="mx-auto mt-6 flex items-center gap-3 rounded-lg px-4 py-2.5 font-mono text-[10.5px] tracking-[0.18em] text-ink-dim transition-colors hover:text-ink"
        aria-label="Scroll to explore the project"
      >
        SCROLL TO EXPLORE
        <ArrowRight className="h-[18px] w-[18px] rotate-90 animate-nudge" aria-hidden="true" />
      </button>
    </section>
  )
}
