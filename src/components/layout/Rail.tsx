import { sections } from '@/data/content'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

/**
 * Desktop slide rail. Hidden below 1500px, where the top bar and swipe take
 * over instead.
 */
export function Rail({ active, onGo }: { active: number; onGo: (i: number) => void }) {
  return (
    <aside
      className="rail no-print fixed left-[calc((100vw-1240px)/2-196px)] top-1/2 z-40 hidden w-[180px] -translate-y-1/2 min-[1500px]:block"
      aria-label="Slide navigation"
    >
      <p className="mb-4 font-mono text-[10px] tracking-[0.18em] text-ink-dim">
        AUTO HEALTH CHECKER
      </p>

      <ol className="flex flex-col gap-0.5">
        {sections.map((section, i) => {
          const isActive = i === active
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => {
                  sfx.ui('click')
                  onGo(i)
                }}
                aria-current={isActive ? 'true' : 'false'}
                aria-label={`${section.nav === '—' ? '' : `${section.nav} `}${section.label}`}
                className={cn(
                  'grid w-full grid-cols-[24px_14px_1fr] items-center gap-3 rounded-lg px-2.5 py-[7px] text-left transition-colors',
                  isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.04]',
                )}
              >
                <span className={cn('font-mono text-[11px]', isActive ? 'text-brand' : 'text-ink-dim')}>
                  {section.nav}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-0.5 origin-left rounded-sm transition-all duration-200',
                    isActive ? 'scale-x-[2.2] bg-brand' : 'bg-white/25',
                  )}
                />
                <span className={cn('text-xs tracking-[0.02em]', isActive ? 'text-ink' : 'text-ink-dim')}>
                  {section.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="mt-6 font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-ink-dim">
        MATHAN KUMAR · CYBER WOLF INTERNSHIP
      </p>
    </aside>
  )
}

/** Progress pill shown while presentation mode is active. */
export function PresentationHud({
  active,
  onExit,
}: {
  active: number
  onExit: () => void
}) {
  const section = sections[active]
  const numbered = sections.filter((s) => s.nav !== '—').length

  return (
    <div className="no-print fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/15 bg-surface/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <span className="font-mono text-[11px] tracking-[0.14em] text-ink">{section?.label}</span>
      <span className="font-mono text-[11px] text-ink-dim">
        {section?.nav === '—' ? '—' : section?.nav} / {numbered}
      </span>
      <span className="block h-[3px] w-[140px] overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <span
          className="block h-full bg-brand transition-[width] duration-300"
          style={{ width: `${((active + 1) / sections.length) * 100}%` }}
        />
      </span>
      <button
        type="button"
        onClick={onExit}
        className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-ink-muted transition-colors hover:border-white/25 hover:text-ink"
      >
        Exit (Esc)
      </button>
    </div>
  )
}
