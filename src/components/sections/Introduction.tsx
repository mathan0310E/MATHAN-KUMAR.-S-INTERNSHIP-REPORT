import { motion } from 'framer-motion'
import { Activity, ClipboardCheck, Shield } from 'lucide-react'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { Card } from '@/components/ui/card'
import { pillars } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { useReveal } from '@/hooks/useReveal'

const ICONS = { shield: Shield, clipboard: ClipboardCheck, activity: Activity } as const

export function Introduction() {
  const reduced = useReducedMotion()
  const callout = useReveal<HTMLDivElement>(reduced)

  return (
    <section id="s1" data-label="INTRODUCTION" className="slide" aria-labelledby="s1-title">
      <div className="wrap">
        <SectionHeading
          nav="01"
          eyebrow="Project introduction"
          title="Auto Health Checker"
          subtitle="Automated website health, security & quality analysis"
          id="s1-title"
        />

        <p className="prose-lead">
          Manually reviewing a website means opening every page, watching the console, clicking
          every form and remembering what broke. It is slow, it is inconsistent, and the things
          that matter most — a missing security header, a silent API failure, a form that only
          breaks on the last step — are exactly the things a quick manual pass misses.
        </p>
        <p className="prose-lead">
          Auto Health Checker does that pass automatically, then turns the raw noise into one
          number and a short, prioritised list a person can act on.
        </p>

        <h3 className="minor-head">Three things it checks</h3>

        <motion.ul
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {pillars.map((pillar) => {
            const Icon = ICONS[pillar.icon as keyof typeof ICONS]
            return (
              <motion.li key={pillar.key} variants={riseIn}>
                <Card interactive className="flex h-full flex-col p-5">
                  <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl2 border border-brand-line bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mb-2 text-[17px] font-semibold tracking-tight text-ink">
                    {pillar.key}
                  </h4>
                  <p className="mb-4 text-sm text-ink-muted">{pillar.summary}</p>
                  <ul className="ticks mt-auto">
                    {pillar.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>

        <div
          ref={callout.ref}
          className={`mt-8 rounded-xl2 border border-white/[0.075] border-l-[3px] border-l-brand bg-gradient-to-r from-brand-soft to-transparent p-5 transition-all duration-500 ${
            callout.shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3.5'
          }`}
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-brand">WHY IT MATTERS</p>
          <p className="max-w-[78ch] text-[15px] leading-relaxed text-ink md:text-[17px]">
            A website can pass every manual check and still fail a real user. Automation finds the
            failures people stop noticing — and reports them in the order that matters.
          </p>
        </div>
      </div>
    </section>
  )
}
