import { motion } from 'framer-motion'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { Card } from '@/components/ui/card'
import { skills } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'

export function Learning() {
  const reduced = useReducedMotion()

  return (
    <section id="s8" data-label="LEARNING" className="slide" aria-labelledby="s8-title">
      <div className="wrap">
        <SectionHeading
          nav="08"
          eyebrow="Skills & learning outcomes"
          title="What I learned"
          subtitle="Five areas of growth over the placement"
          id="s8-title"
        />

        <motion.ul
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {skills.map((group) => (
            <motion.li key={group.category} variants={riseIn}>
              <Card interactive className="flex h-full flex-col p-4">
                <p className="mb-3 border-b border-white/[0.075] pb-3 font-mono text-[9.5px] tracking-[0.14em] text-brand">
                  {group.category}
                </p>
                <ul className="ticks">
                  {group.items.map((item) => (
                    <li key={item} className="text-[12.5px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-8 rounded-xl2 border border-white/[0.075] border-l-[3px] border-l-brand bg-gradient-to-r from-brand-soft to-transparent p-5">
          <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-brand">
            THE HONEST SUMMARY
          </p>
          <p className="max-w-[78ch] text-[15px] leading-relaxed text-ink md:text-[17px]">
            The biggest shift was learning to trust evidence over intuition. A finding is only
            useful once you can reproduce it, explain it in plain language, and say how sure you
            are.
          </p>
        </div>
      </div>
    </section>
  )
}
