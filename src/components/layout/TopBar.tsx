import { Volume2, VolumeX, Play, MonitorPlay } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrgBadge } from './SectionHeading'
import { sections } from '@/data/content'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface Props {
  active: number
  onGo: (i: number) => void
  progress: number
  soundOn: boolean
  onToggleSound: () => void
  onDemo: () => void
  onPresent: () => void
}

const NAV_LINKS = [
  { goto: 1, label: 'Project' },
  { goto: 2, label: 'Cyber Wolf' },
  { goto: 5, label: 'Build' },
  { goto: 6, label: 'Architecture' },
  { goto: 8, label: 'Learning' },
]

export function TopBar({
  active,
  onGo,
  progress,
  soundOn,
  onToggleSound,
  onDemo,
  onPresent,
}: Props) {
  return (
    <header className="topbar no-print fixed inset-x-0 top-0 z-50 border-b border-white/[0.075] bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[var(--topbar-h)] w-full max-w-wrap items-center gap-3 px-4 sm:gap-5 sm:px-6 md:px-8">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            sfx.ui('click')
            onGo(0)
          }}
          className="flex shrink-0 items-center gap-3 rounded-lg no-underline"
          aria-label="Auto Health Checker — back to top"
        >
          <OrgBadge size={36} />
          <span className="hidden flex-col leading-tight sm:flex">
            <b className="text-[13px] font-bold tracking-[0.04em] text-ink">AUTO HEALTH CHECKER</b>
            <span className="hidden text-[11px] text-ink-dim sm:block">Cyber Wolf internship</span>
          </span>
        </a>

        <nav className="hidden flex-1 justify-center lg:flex" aria-label="Sections">
          <ul className="flex gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.goto}>
                <button
                  type="button"
                  onClick={() => {
                    sfx.ui('click')
                    onGo(link.goto)
                  }}
                  aria-current={active === link.goto ? 'true' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-[13.5px] transition-colors',
                    active === link.goto
                      ? 'bg-brand-soft text-ink'
                      : 'text-ink-muted hover:bg-white/5 hover:text-ink',
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              sfx.unlock()
              sfx.ui('click')
              onToggleSound()
            }}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
            title={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {soundOn ? (
              <Volume2 className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <VolumeX className="h-[18px] w-[18px] text-ink-dim" aria-hidden="true" />
            )}
          </Button>

          <Button variant="ghost" onClick={onDemo}>
            <Play className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">Run demo scan</span>
          </Button>

          <Button variant="primary" onClick={onPresent}>
            <MonitorPlay className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">Present</span>
          </Button>
        </div>
      </div>

      <div className="h-0.5" aria-hidden="true">
        <span
          className="block h-full bg-brand transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="sr-only" aria-live="polite">
        {sections[active]?.label} — slide {active + 1} of {sections.length}
      </span>
    </header>
  )
}
