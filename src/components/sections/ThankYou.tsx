import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrgBadge, riseIn, stagger } from '@/components/layout/SectionHeading'
import { student } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'

export function ThankYou({ onGo }: { onGo: (i: number) => void }) {
  const reduced = useReducedMotion()

  return (
    <section
      id="thanks"
      data-label="THANK YOU"
      className="slide overflow-hidden text-center"
      aria-labelledby="thanks-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(560px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.075] opacity-50 animate-spin-slow [background:radial-gradient(circle_at_50%_50%,rgba(255,45,45,.08),transparent_60%),repeating-radial-gradient(circle_at_50%_50%,transparent_0_28px,rgba(255,255,255,.045)_28px_29px)]"
        aria-hidden="true"
      />

      <div className="wrap relative flex flex-col items-center">
        <motion.h2
          variants={riseIn}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true }}
          id="thanks-title"
          className="text-[clamp(3.25rem,11vw,9.25rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink"
        >
          THANK YOU
        </motion.h2>

        <motion.p
          variants={riseIn}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true }}
          className="mt-3 text-[15px] text-ink-muted md:text-[19px]"
        >
          Questions &amp; discussion
        </motion.p>

        <motion.div
          variants={stagger}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8"
        >
          <motion.div
            variants={riseIn}
            className="flex flex-col items-center gap-4 rounded-xl2 border border-white/[0.075] bg-surface/70 p-5 text-center backdrop-blur-sm sm:flex-row sm:text-left"
          >
            <OrgBadge size={56} />
            <div>
              <p className="text-lg font-semibold tracking-tight text-ink">{student.name}</p>
              <p className="mt-0.5 text-[13.5px] text-ink-muted">B.Tech AI &amp; Data Science</p>
              <p className="mt-0.5 text-[13.5px] text-ink-muted">{student.college}</p>
              <p className="mt-0.5 text-[13.5px] text-brand">Cyber Wolf Internship</p>
            </div>
          </motion.div>
        </motion.div>

        <Button variant="quiet" size="lg" className="mt-6" onClick={() => onGo(0)}>
          <ArrowUp className="h-[18px] w-[18px]" aria-hidden="true" />
          Back to the top
        </Button>
      </div>
    </section>
  )
}
