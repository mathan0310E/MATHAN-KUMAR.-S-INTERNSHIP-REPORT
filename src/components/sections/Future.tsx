import { motion } from 'framer-motion'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { plannedFeatures, roadmap } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { cn } from '@/lib/utils'

export function Future() {
  const reduced = useReducedMotion()

  return (
    <section id="s9" data-label="FUTURE" className="slide" aria-labelledby="s9-title">
      <div className="wrap">
        <SectionHeading
          nav="09"
          eyebrow="Conclusion & future enhancements"
          title="From website scanner to intelligent security platform"
          subtitle="Where the project goes next"
          id="s9-title"
        />

        <motion.ol
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {roadmap.map((step) => {
            const isVision = step.stage === 'VISION'
            return (
              <motion.li
                key={step.stage}
                variants={riseIn}
                className={cn(
                  'rounded-xl2 border p-4 transition-colors',
                  isVision
                    ? 'border-brand-line bg-gradient-to-br from-brand-soft to-transparent'
                    : 'border-white/[0.075] bg-surface hover:border-white/15',
                )}
              >
                <span
                  className={cn(
                    'mb-2 block font-mono text-[9.5px] tracking-[0.16em]',
                    isVision ? 'text-brand' : 'text-ink-dim',
                  )}
                >
                  {step.stage}
                </span>
                <p className="text-sm leading-snug text-ink">{step.text}</p>
              </motion.li>
            )
          })}
        </motion.ol>

        <h3 className="minor-head">Planned features</h3>
        <motion.ul
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {plannedFeatures.map((feature) => (
            <motion.li
              key={feature}
              variants={riseIn}
              className="rounded-full border border-white/[0.075] bg-surface px-3.5 py-1.5 text-[12.5px] text-ink-muted transition-colors hover:border-brand-line hover:text-ink"
            >
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
