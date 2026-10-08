import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { challenges } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'

export function Challenges() {
  const reduced = useReducedMotion()

  return (
    <section id="s7" data-label="CHALLENGES" className="slide" aria-labelledby="s7-title">
      <div className="wrap">
        <SectionHeading
          nav="07"
          eyebrow="What was hard"
          title="Challenges → solutions"
          subtitle="Five problems, five answers"
          id="s7-title"
        />

        <motion.ol
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-3"
        >
          {challenges.map((row, i) => (
            <motion.li
              key={row.challenge}
              variants={riseIn}
              className="group grid grid-cols-1 items-center gap-3 rounded-xl2 border border-white/[0.075] bg-surface p-4 transition-colors hover:border-white/15 hover:bg-surface-2 md:grid-cols-[1fr_48px_1fr] md:gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9.5px] tracking-[0.16em] text-[#ff8f8f]">
                  CHALLENGE {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-[14.5px] leading-snug text-ink-muted">{row.challenge}</p>
              </div>

              <span
                className="grid place-items-center text-ink-dim transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand max-md:rotate-90 max-md:justify-self-start"
                aria-hidden="true"
              >
                <ArrowRight className="h-5 w-5" />
              </span>

              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9.5px] tracking-[0.16em] text-ok">SOLUTION</p>
                <p className="text-[14.5px] leading-snug text-ink">{row.solution}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
