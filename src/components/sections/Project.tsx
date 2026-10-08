import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Accessibility,
  AlertTriangle,
  Gauge,
  LayoutDashboard,
  Route,
  Shield,
} from 'lucide-react'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { Card } from '@/components/ui/card'
import { scanModules, scanSummary } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { useCountUp } from '@/hooks/useReveal'

/**
 * The charting library is only needed for the findings dashboard, so it is
 * loaded on demand. That keeps Recharts out of the initial bundle.
 */
const FindingsDashboard = lazy(() => import('@/components/demo/FindingsDashboard'))

const MODULE_ICONS = {
  shield: Shield,
  alert: AlertTriangle,
  route: Route,
  gauge: Gauge,
  accessibility: Accessibility,
  layout: LayoutDashboard,
} as const

/** A single scan fact. Owns its observer so all six animate together. */
function ScanFact({
  label,
  value,
  warn = false,
}: {
  label: string
  value: number
  warn?: boolean
}) {
  const reduced = useReducedMotion()
  const { ref, value: shown } = useCountUp(value, reduced)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="bg-bg-2 p-4">
      <dt className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-dim">
        {label}
      </dt>
      <dd className={`text-[22px] font-bold tracking-tight tabular-nums ${warn ? 'text-warn' : 'text-ink'}`}>
        {shown}
      </dd>
    </div>
  )
}

export function Project() {
  const reduced = useReducedMotion()

  const facts = [
    { label: 'Pages scanned', value: scanSummary.pages },
    { label: 'Links checked', value: scanSummary.links },
    { label: 'API requests', value: scanSummary.apis },
    { label: 'Forms tested', value: scanSummary.forms },
    { label: 'Console errors', value: scanSummary.consoleErrors, warn: true },
    { label: 'Broken links', value: scanSummary.brokenLinks, warn: true },
  ]

  return (
    <section id="s5" data-label="PROJECT" className="slide" aria-labelledby="s5-title">
      <div className="wrap">
        <SectionHeading
          nav="05"
          eyebrow="Tasks undertaken"
          title="Project — Auto Health Checker"
          subtitle="One scan, six analysis modules"
          id="s5-title"
        />

        <div className="rounded-xl2 border border-white/[0.075] bg-gradient-to-br from-surface to-bg-2 p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-ink-dim">TARGET</p>
              <p className="mt-1.5 font-mono text-sm text-ink">https://example.com</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-[0.18em] text-ink-dim">SCAN STATUS</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-brand tabular-nums">
                {scanSummary.percent}
                <span className="font-mono text-[13px] font-normal text-ink-dim">%</span>
              </p>
            </div>
          </div>

          <div
            className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
            role="progressbar"
            aria-label="Scan progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={scanSummary.percent}
          >
            <motion.span
              className="block h-full rounded-full bg-brand"
              initial={reduced ? { width: `${scanSummary.percent}%` } : { width: 0 }}
              whileInView={{ width: `${scanSummary.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-white/[0.075] bg-white/[0.075] sm:grid-cols-3 lg:grid-cols-6">
            {facts.map((f) => (
              <ScanFact key={f.label} label={f.label} value={f.value} warn={f.warn} />
            ))}
          </dl>
        </div>

        <h3 className="minor-head">Findings dashboard</h3>
        <Suspense
          fallback={
            <div className="grid h-[320px] place-items-center rounded-xl2 border border-white/[0.075] bg-surface">
              <p className="font-mono text-[11.5px] text-ink-dim">Loading dashboard…</p>
            </div>
          }
        >
          <FindingsDashboard />
        </Suspense>

        <h3 className="minor-head">Scanning modules</h3>

        <motion.ul
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {scanModules.map((module) => {
            const Icon = MODULE_ICONS[module.icon as keyof typeof MODULE_ICONS]
            return (
              <motion.li key={module.title} variants={riseIn}>
                <Card interactive className="flex h-full flex-col px-5 pb-5 pt-4">
                  <h4 className="mb-3 flex items-center gap-2 border-b border-white/[0.075] pb-3 text-sm font-semibold tracking-wide text-ink">
                    <Icon className="h-[18px] w-[18px] text-brand" aria-hidden="true" />
                    {module.title}
                  </h4>
                  <ul className="ticks">
                    {module.points.map((p) => (
                      <li key={p} className="text-[12.5px]">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
