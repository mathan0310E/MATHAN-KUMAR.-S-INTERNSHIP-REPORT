import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { SectionHeading, riseIn, stagger } from '@/components/layout/SectionHeading'
import { FactList, FactRow } from '@/components/ui/card'
import { internship, organization, student } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { useReveal } from '@/hooks/useReveal'
import { useTilt, tiltStyle } from '@/hooks/useTilt'

const CHECKS = ['Project completed', 'Internship completed', 'Presentation ready']

export function Certificate() {
  const reduced = useReducedMotion()
  const tilt = useTilt(4)
  const frame = useReveal<HTMLElement>(reduced)
  const [loaded, setLoaded] = useState(false)

  return (
    <section
      id="s10"
      data-label="COMPLETION"
      className="slide bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent"
      aria-labelledby="s10-title"
    >
      <div className="wrap">
        <SectionHeading
          nav="10"
          eyebrow="Section 10"
          title="Internship completed"
          subtitle={`${organization.name} · College Internship Program`}
          center
          id="s10-title"
        />

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1fr)] lg:gap-14">
          <figure
            ref={frame.ref}
            className={`relative rounded-xl2 border border-white/15 bg-surface p-3 shadow-2xl transition-all duration-500 ${
              frame.shown ? 'translate-y-0 opacity-100' : 'translate-y-3.5 opacity-0'
            }`}
          >
            <div
              ref={tilt.ref}
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
              style={tilt.enabled ? tiltStyle : undefined}
              className="relative transition-transform duration-300"
            >
              <img
                src="assets/brand/certificate-blur.jpg"
                alt=""
                aria-hidden="true"
                width={40}
                height={56}
                className="absolute inset-0 h-full w-full rounded-xl2 object-cover opacity-50 blur-lg"
              />
              <img
                src="assets/brand/certificate.jpg"
                alt={`Cyber Wolf internship completion certificate issued to ${student.name}, register number ${student.registerNo}`}
                width={1100}
                height={1554}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`relative w-full rounded-xl2 transition-opacity duration-500 ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <figcaption className="mt-3 text-center font-mono text-[10px] tracking-[0.1em] text-ink-dim">
              Issued by {organization.name} · Certificate No. {internship.certificateNo}
            </figcaption>
          </figure>

          <div>
            <p className="text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold tracking-tight text-ink">
              {student.name}
            </p>
            <p className="mt-1 text-[14.5px] text-ink-muted">{student.degree}</p>
            <p className="mt-1 text-[14.5px] text-ink-muted">
              {student.college} · {student.university}
            </p>

            <FactList className="my-6">
              <FactRow label="Project">Auto Health Checker</FactRow>
              <FactRow label="Programme">{internship.programme}</FactRow>
              <FactRow label="Period">01/09/2026 – 01/10/2026</FactRow>
              <FactRow label="Register no.">{student.registerNo}</FactRow>
              <FactRow label="Signed by">{internship.signatory}</FactRow>
            </FactList>

            <motion.ul
              variants={stagger}
              initial={reduced ? 'show' : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {CHECKS.map((check) => (
                <motion.li
                  key={check}
                  variants={riseIn}
                  className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/[0.08] px-4 py-2.5 text-[13.5px] font-medium text-ink"
                >
                  <Check className="h-[18px] w-[18px] text-ok" aria-hidden="true" />
                  {check}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
