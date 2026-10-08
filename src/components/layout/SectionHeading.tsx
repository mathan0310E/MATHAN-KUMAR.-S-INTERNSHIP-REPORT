/* eslint-disable react-refresh/only-export-components --
   The section heading and the motion variants its callers use are one concept;
   splitting them would only fragment the API. */
import { motion } from 'framer-motion'
import { organization } from '@/data/content'
import { cn } from '@/lib/utils'

/**
 * Section heading. The number column is the alignment anchor that keeps every
 * slide's title, eyebrow and body copy on the same left edge.
 */
export function SectionHeading({
  nav,
  eyebrow,
  title,
  subtitle,
  center = false,
  id,
}: {
  nav: string
  eyebrow: string
  title: string
  subtitle?: string
  center?: boolean
  id?: string
}) {
  return (
    <header
      className={cn(
        'mb-8 md:mb-12',
        center ? 'text-center' : 'grid grid-cols-1 gap-2 md:grid-cols-[56px_1fr] md:gap-6',
      )}
    >
      {!center && (
        <p className="pt-1.5 font-mono text-[13px] tracking-[0.06em] text-brand" aria-hidden="true">
          {nav}
        </p>
      )}
      <div className={cn(center && 'mx-auto max-w-3xl')}>
        <p
          className={cn(
            'mb-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim',
            center && 'justify-center',
          )}
        >
          {!center && <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />}
          {eyebrow}
        </p>
        <h2 id={id} className="text-section font-bold text-ink text-balance">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-[64ch] text-[15px] text-ink-muted md:text-base">{subtitle}</p>}
      </div>
    </header>
  )
}

/** The Cyber Wolf badge, sized consistently wherever the logo appears. */
export function OrgBadge({
  size = 36,
  className,
  src = organization.logoSmall,
}: {
  size?: number
  className?: string
  src?: string
}) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-black', className)}
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" />
    </span>
  )
}

/** Shared entrance for section blocks that should arrive in sequence. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const riseIn = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const } },
}

export { motion }
