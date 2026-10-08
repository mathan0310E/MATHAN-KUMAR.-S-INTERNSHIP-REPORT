import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { Card, FactList, FactRow, MicroLabel } from '@/components/ui/card'
import { capabilities, internship, orgStats, organization } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { useCountUp } from '@/hooks/useReveal'
import { useTilt, tiltStyle } from '@/hooks/useTilt'
import { cn, formatNumber } from '@/lib/utils'

/** One animated figure. Each owns its own observer so they fire together. */
function Stat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number
  suffix: string
  label: string
  decimals?: number
}) {
  const reduced = useReducedMotion()
  const { ref, value: shown } = useCountUp(value, reduced, 1500, decimals)

  return (
    <li ref={ref as React.RefObject<HTMLLIElement>} className="card p-4">
      <b className="block text-2xl font-bold leading-none tracking-tight text-ink tabular-nums md:text-[34px]">
        {formatNumber(shown, decimals)}
        {suffix}
      </b>
      <span className="mt-1 block text-[12.5px] text-ink-dim">{label}</span>
    </li>
  )
}

export function Organization() {
  const reduced = useReducedMotion()
  const tilt = useTilt()
  const [hovered, setHovered] = useState<number | null>(null)

  const active = hovered === null ? null : capabilities[hovered]

  return (
    <section id="s2" data-label="ORGANIZATION" className="slide" aria-labelledby="s2-title">
      <div className="wrap">
        <SectionHeading
          nav="02"
          eyebrow="About the organization"
          title="About Cyber Wolf"
          subtitle="Cybersecurity · Security testing · Training · SaaS & product development"
          id="s2-title"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <Card
            ref={tilt.ref}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            style={tilt.enabled ? tiltStyle : undefined}
            className="bg-gradient-to-br from-surface to-bg-2 p-5 transition-transform duration-300"
          >
            <div className="mb-4 flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-black">
                <img
                  src={organization.logo}
                  alt="Cyber Wolf logo"
                  width={192}
                  height={192}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <h3 className="text-[22px] font-bold tracking-tight text-ink">
                  {organization.name}
                </h3>
                <a
                  href={organization.site}
                  target="_blank"
                  rel="noopener noreferrer nofollow external"
                  className="mt-0.5 inline-flex items-center gap-1 rounded py-1 font-mono text-[11px] text-ink-dim hover:text-brand"
                >
                  cyberwolf360.in
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <p className="mb-4 text-sm text-ink-muted">{organization.summary}</p>

            <FactList className="mb-4">
              <FactRow label="Founded by">{organization.foundedBy}</FactRow>
              <FactRow label="Focus">VAPT · Compliance · SOC</FactRow>
              <FactRow label="Also runs">Cybersecurity training</FactRow>
            </FactList>

            <p className="srcnote">
              Company details from{' '}
              <a
                href={organization.site}
                target="_blank"
                rel="noopener noreferrer nofollow external"
              >
                cyberwolf360.in
              </a>
            </p>
          </Card>

          <div className="grid gap-5">
            <ul className="grid grid-cols-2 gap-3">
              {orgStats.map((s) => (
                <Stat
                  key={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  decimals={'decimals' in s ? s.decimals : 0}
                />
              ))}
            </ul>
            <p className="srcnote">
              Figures published by Cyber Wolf on{' '}
              <a
                href={organization.site}
                target="_blank"
                rel="noopener noreferrer nofollow external"
              >
                cyberwolf360.in
              </a>
              .
            </p>

            <Card className="p-5">
              <MicroLabel className="mb-4">Capability map</MicroLabel>
              <p className="mb-4 inline-block rounded-full border border-brand-line bg-brand-soft px-3.5 py-1.5 font-mono text-[11px] tracking-[0.16em] text-brand">
                CYBER WOLF
              </p>
              <ul className="grid grid-cols-3 gap-2">
                {capabilities.map((cap, i) => (
                  <li key={cap.name}>
                    <button
                      type="button"
                      onPointerEnter={() => setHovered(i)}
                      onFocus={() => setHovered(i)}
                      onPointerLeave={() => setHovered(null)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        'w-full rounded-xl2 border px-2.5 py-2 text-center font-mono text-[11px] tracking-[0.08em] transition-colors',
                        hovered === i
                          ? 'border-brand-line bg-brand-soft text-ink'
                          : 'border-white/[0.075] bg-bg-2 text-ink-muted hover:border-brand-line hover:bg-brand-soft hover:text-ink',
                      )}
                    >
                      {cap.name}
                    </button>
                  </li>
                ))}
              </ul>
              <p
                className={cn(
                  'mt-4 min-h-[2.6em] border-t border-white/[0.075] pt-3 text-[12.5px]',
                  active ? 'text-ink' : 'text-ink-dim',
                )}
                role="status"
              >
                {active ? active.detail : 'Select a capability to read what it covers.'}
              </p>
            </Card>

            <motion.div
              variants={stagger}
              initial={reduced ? 'show' : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={riseIn}>
                <Card className="p-5">
                  <MicroLabel className="mb-3 !text-brand">Internship experience</MicroLabel>
                  <p className="mb-4 text-sm text-ink-muted">
                    A practical cybersecurity learning placement: supervised security work, weekly
                    mentor reviews, and an independent project delivered end to end.
                  </p>
                  <ul className="ticks ticks-2 grid-cols-1 sm:grid-cols-2">
                    <li>Supervised engagements</li>
                    <li>Weekly mentor syncs</li>
                    <li>Portfolio-ready deliverables</li>
                    <li>Completion certificate</li>
                  </ul>
                  <FactList className="mt-4">
                    <FactRow label="Programme">{internship.programme}</FactRow>
                    <FactRow label="Role">
                      <span className="ph">{internship.role}</span>
                    </FactRow>
                    <FactRow label="Duration">
                      <span className="ph">{internship.duration}</span>
                    </FactRow>
                    <FactRow label="Start date">
                      <span className="ph">{internship.startDate}</span>
                    </FactRow>
                    <FactRow label="End date">
                      <span className="ph">{internship.endDate}</span>
                    </FactRow>
                    <FactRow label="Mentor">
                      <span className="ph">{internship.mentor}</span>
                    </FactRow>
                  </FactList>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
