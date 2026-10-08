import * as React from 'react'
import { cn } from '@/lib/utils'

/** A thin bordered surface. `interactive` adds the shared hover treatment. */
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl2 border border-white/[0.075] bg-surface',
      interactive && 'transition-colors duration-200 hover:border-white/15 hover:bg-surface-2',
      className,
    )}
    {...props}
  />
))
Card.displayName = 'Card'

/** Monospace key/value row used inside cards and detail panels. */
export function FactRow({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-[88px_1fr] gap-3 bg-bg-2 px-4 py-2.5 text-[13px]', className)}>
      <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim">
        {label}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  )
}

/** A bordered stack of FactRows that reads as one unit. */
export function FactList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid gap-px overflow-hidden rounded-xl2 border border-white/[0.075] bg-white/[0.075]',
        className,
      )}
    >
      {children}
    </dl>
  )
}

/** Small monospace label above a heading or value. */
export function MicroLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn('font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim', className)}>
      {children}
    </p>
  )
}
