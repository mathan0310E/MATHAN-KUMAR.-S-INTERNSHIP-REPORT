import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { Card } from '@/components/ui/card'
import { disciplines, organization, techStack } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'

/**
 * Radial technology map: one core node with the nine disciplines around it.
 *
 * Below 768px the radial layout is replaced by a stacked grid — the labels need
 * room, and a cramped circle is worse than a list.
 */
function Ecosystem() {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Positions match the --x/--y percentages below, so lines and labels agree.
  const POSITIONS = [
    { x: 50, y: 8 },
    { x: 87, y: 24 },
    { x: 93, y: 62 },
    { x: 72, y: 92 },
    { x: 30, y: 92 },
    { x: 8, y: 62 },
    { x: 13, y: 24 },
    { x: 50, y: 22 },
    { x: 50, y: 78 },
  ]

  return (
    <div
      ref={containerRef}
      className="relative h-[clamp(320px,40vh,440px)] overflow-hidden rounded-xl2 border border-white/[0.075] bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,.05),transparent_62%)] max-md:h-auto max-md:bg-none max-md:p-5"
    >
      {size.w > 0 && (
        <svg
          className="absolute inset-0 h-full w-full max-md:hidden"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {POSITIONS.map((p, i) => (
            <motion.line
              key={i}
              x1={size.w / 2}
              y1={size.h / 2}
              x2={(p.x / 100) * size.w}
              y2={(p.y / 100) * size.h}
              stroke="rgba(255,255,255,.14)"
              strokeWidth={1}
              strokeDasharray="3 3"
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.06 }}
            />
          ))}
        </svg>
      )}

      <div className="absolute left-1/2 top-1/2 grid aspect-square w-[clamp(104px,11vw,132px)] -translate-x-1/2 -translate-y-1/2 place-items-center gap-2 rounded-full border border-brand-line bg-[radial-gradient(circle,#1a1f2a,#0b0d12_72%)] text-center shadow-[0_0_44px_-14px_rgba(255,45,45,.6)] max-md:static max-md:mx-auto max-md:mb-4 max-md:w-[104px] max-md:translate-x-0 max-md:translate-y-0">
        <img
          src={organization.logoSmall}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="h-6 w-6 rounded-full bg-black"
        />
        <strong className="block text-[9.5px] font-bold leading-tight tracking-[0.13em] text-ink">
          AUTO
          <br />
          HEALTH
          <br />
          CHECKER
        </strong>
      </div>

      <ul className="absolute inset-0 max-md:static max-md:grid max-md:grid-cols-2 max-md:gap-2">
        {disciplines.map((name, i) => (
          <li
            key={name}
            style={{ left: `${POSITIONS[i].x}%`, top: `${POSITIONS[i].y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-bg/95 px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-muted transition-colors hover:border-brand-line hover:bg-brand-soft hover:text-ink max-md:static max-md:translate-x-0 max-md:translate-y-0 max-md:whitespace-normal max-md:text-center max-md:text-[9.5px]"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Domain() {
  const reduced = useReducedMotion()

  return (
    <section id="s4" data-label="DOMAIN" className="slide" aria-labelledby="s4-title">
      <div className="wrap">
        <SectionHeading
          nav="04"
          eyebrow="Technology & domain"
          title="Where cybersecurity meets automation, QA and AI"
          subtitle="Nine disciplines, one platform"
          id="s4-title"
        />

        <Ecosystem />

        <h3 className="minor-head">Tools &amp; technologies used</h3>
        <motion.ul
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {techStack.map((group) => (
            <motion.li key={group.group} variants={riseIn}>
              <Card interactive className="h-full px-5 py-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
                  {group.group}
                </p>
                <p className="text-[13.5px] leading-relaxed text-ink-muted">
                  {group.items.join(' · ')}
                </p>
              </Card>
            </motion.li>
          ))}
        </motion.ul>

        <p className="srcnote mt-4 text-center">
          Only technologies actually used are listed. Edit{' '}
          <code>src/data/content.ts</code> if the stack changes.
        </p>
      </div>
    </section>
  )
}
