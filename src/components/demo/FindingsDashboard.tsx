import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { MicroLabel } from '@/components/ui/card'
import { demoScan } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { cn } from '@/lib/utils'

/**
 * Interactive findings dashboard.
 *
 * This is where a charting library earns its place: a severity distribution
 * bar chart with a shared tooltip and a responsive container. The single health
 * gauge next to it is plain SVG — a chart engine for one ring would be waste.
 *
 * Charts sit behind a dynamic import (see Project.tsx) so the library never
 * lands in the initial bundle.
 */

type Severity = 'critical' | 'high' | 'medium' | 'low'

const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; note: string }
> = {
  critical: {
    label: 'Critical',
    color: '#ff4d4f',
    note: 'Exploitable now, or a complete failure of a core journey.',
  },
  high: {
    label: 'High',
    color: '#ff8a3d',
    note: 'Serious weakness or a broken flow on an important page.',
  },
  medium: {
    label: 'Medium',
    color: '#fbbf24',
    note: 'Real defect with limited impact, or a hardening gap.',
  },
  low: {
    label: 'Low',
    color: '#60a5fa',
    note: 'Hygiene: minor inconsistency, wording or polish.',
  },
}

const CATEGORIES = [
  { name: 'Security', value: demoScan.metrics.security },
  { name: 'Performance', value: demoScan.metrics.performance },
  { name: 'Reliability', value: demoScan.metrics.reliability },
  { name: 'Accessibility', value: demoScan.metrics.accessibility },
  { name: 'UX', value: demoScan.metrics.ux },
]

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/15 bg-bg-2 px-3 py-2 text-xs shadow-lg">
      <p className="font-mono text-[10px] tracking-[0.1em] text-ink-dim">{label}</p>
      <p className="font-mono text-sm text-ink tabular-nums">{payload[0].value}</p>
    </div>
  )
}

export default function FindingsDashboard() {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<Severity>('critical')

  const severityData = useMemo(
    () =>
      (Object.keys(SEVERITY_META) as Severity[]).map((key) => ({
        key,
        name: SEVERITY_META[key].label,
        value: demoScan.severity[key],
        fill: SEVERITY_META[key].color,
      })),
    [],
  )

  const meta = SEVERITY_META[selected]
  const total = severityData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl2 border border-white/[0.075] bg-surface p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <MicroLabel>Findings dashboard</MicroLabel>
          <p className="mt-1 text-[13px] text-ink-muted">
            {total} findings across four severities — select one to read what it means.
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.14em] text-ink-dim">DEMO DATA</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,.04)' }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  onClick={(entry: { key?: Severity }) => entry.key && setSelected(entry.key)}
                  isAnimationActive={!reduced}
                >
                  {severityData.map((d) => (
                    <Cell
                      key={d.key}
                      fill={d.fill}
                      opacity={selected === d.key ? 1 : 0.42}
                      className="cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 flex flex-wrap gap-2">
            {severityData.map((d) => (
              <li key={d.key}>
                <button
                  type="button"
                  onClick={() => setSelected(d.key)}
                  aria-pressed={selected === d.key}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    selected === d.key
                      ? 'border-white/25 bg-white/[0.06] text-ink'
                      : 'border-white/[0.075] text-ink-muted hover:border-white/20 hover:text-ink',
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ background: d.fill }}
                    aria-hidden="true"
                  />
                  {d.name}
                  <b className="font-mono font-semibold tabular-nums">{d.value}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4">
          <motion.div
            key={selected}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl2 border border-white/[0.075] bg-bg-2 p-4"
            aria-live="polite"
          >
            <p className="font-mono text-[10px] tracking-[0.14em]" style={{ color: meta.color }}>
              {meta.label.toUpperCase()} · {demoScan.severity[selected]} FOUND
            </p>
            <p className="mt-2 text-[13.5px] text-ink-muted">{meta.note}</p>
          </motion.div>

          <div>
            <MicroLabel className="mb-2">Score by category</MicroLabel>
            <div className="h-[168px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={CATEGORIES.map((c) => ({ ...c, fill: '#ff2d2d' }))}
                  innerRadius="30%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  barSize={7}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    background={{ fill: 'rgba(255,255,255,.06)' }}
                    isAnimationActive={!reduced}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 grid gap-1">
              {CATEGORIES.map((c) => (
                <li key={c.name} className="flex justify-between text-[12px]">
                  <span className="text-ink-muted">{c.name}</span>
                  <span className="font-mono text-ink tabular-nums">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
