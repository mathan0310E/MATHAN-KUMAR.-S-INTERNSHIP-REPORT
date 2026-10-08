import { motion } from 'framer-motion'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { objectives } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'

export function Objectives() {
  const reduced = useReducedMotion()

  return (
    <section id="s3" data-label="OBJECTIVES" className="slide" aria-labelledby="s3-title">
      <div className="wrap">
        <SectionHeading
          nav="03"
          eyebrow="What I set out to do"
          title="Internship objectives"
          subtitle="Seven goals agreed at the start of the placement"
          id="s3-title"
        />

        <motion.ol
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-px overflow-hidden rounded-xl2 border border-white/[0.075] bg-white/[0.075]"
        >
          {objectives.map((objective, i) => (
            <motion.li
              key={objective.title}
              variants={riseIn}
              className="grid grid-cols-[44px_1fr] items-baseline gap-4 bg-bg-2 px-4 py-4 transition-colors hover:bg-surface md:grid-cols-[64px_1fr] md:px-5"
            >
              <span className="font-mono text-xs tracking-[0.06em] text-brand">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="mb-0.5 text-[15.5px] font-semibold tracking-tight text-ink">
                  {objective.title}
                </h3>
                <p className="text-[13.5px] text-ink-dim">{objective.detail}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
