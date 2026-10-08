import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useMedia'

/**
 * Circular health score, drawn as a plain SVG ring.
 *
 * Deliberately not a charting-library component: a single gauge is a few lines
 * of SVG, and pulling in a full chart engine for it would add hundreds of
 * kilobytes to the initial load. The ring animates via stroke-dashoffset, which
 * the compositor handles cheaply.
 */
export function HealthRing({
  value,
  size = 132,
  label = 'WEBSITE HEALTH',
  delay = 260,
}: {
  value: number
  size?: number
  label?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setShown(value)
      return
    }
    let raf = 0
    let t0: number | null = null
    const duration = 1600

    const start = window.setTimeout(() => {
      const step = (ts: number) => {
        if (t0 === null) t0 = ts
        const p = Math.min((ts - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setShown(Math.round(value * eased))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)

    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [value, delay, reduced])

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - shown / 100)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.07)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#ff2d2d"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
        <span className="text-[38px] font-bold leading-none tracking-tight text-ink tabular-nums">
          {shown}
        </span>
        <span className="font-mono text-[10px] text-ink-dim">/ 100</span>
      </div>

      <p className="absolute inset-x-0 -bottom-6 text-center font-mono text-[9.5px] tracking-[0.16em] text-ink-dim">
        {label}
      </p>
    </div>
  )
}
