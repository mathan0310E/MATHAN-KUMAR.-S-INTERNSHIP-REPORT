import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSectionNav } from '@/hooks/useSectionNav'
import { useReducedMotion } from '@/hooks/useMedia'
import { useAudioUnlock } from '@/hooks/useAudioUnlock'
import { TopBar } from '@/components/layout/TopBar'
import { Rail, PresentationHud } from '@/components/layout/Rail'
import { ScanDialog } from '@/components/demo/ScanDialog'
import { Hero } from '@/components/sections/Hero'
import { Introduction } from '@/components/sections/Introduction'
import { Organization } from '@/components/sections/Organization'
import { Objectives } from '@/components/sections/Objectives'
import { Domain } from '@/components/sections/Domain'
import { Project } from '@/components/sections/Project'
import { Architecture } from '@/components/sections/Architecture'
import { Challenges } from '@/components/sections/Challenges'
import { Learning } from '@/components/sections/Learning'
import { Future } from '@/components/sections/Future'
import { Certificate } from '@/components/sections/Certificate'
import { ThankYou } from '@/components/sections/ThankYou'
import { sections } from '@/data/content'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

export default function App() {
  const reduced = useReducedMotion()
  const ids = useMemo(() => sections.map((s) => s.id), [])
  const { active, presenting, setPresenting, go } = useSectionNav({
    count: sections.length,
    ids,
    reduced,
  })

  const [soundOn, setSoundOn] = useState(sfx.isEnabled)
  const [scanOpen, setScanOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  useAudioUnlock()

  /* Reading progress bar. */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Presentation mode: fullscreen plus a progress HUD. */
  const enterPresent = useCallback(() => {
    setPresenting(true)
    sfx.ui('click')
    const el = document.documentElement
    if (el.requestFullscreen) void el.requestFullscreen().catch(() => undefined)
  }, [setPresenting])

  const exitPresent = useCallback(() => {
    setPresenting(false)
    if (document.fullscreenElement && document.exitFullscreen) {
      void document.exitFullscreen().catch(() => undefined)
    }
  }, [setPresenting])

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setPresenting(false)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [setPresenting])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.tagName.toLowerCase() === 'input') return

      if (e.key === 'Escape' && presenting) exitPresent()
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        if (presenting) exitPresent()
        else enterPresent()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, enterPresent, exitPresent])

  /* Body state drives the presentation-mode CSS. */
  useEffect(() => {
    document.body.classList.toggle('is-presenting', presenting)
    return () => document.body.classList.remove('is-presenting')
  }, [presenting])

  /* Playful: type "wolf" anywhere for a paw-print trail. */
  useEffect(() => {
    if (reduced) return
    let typed = ''
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-6)
      if (!typed.includes('wolf')) return
      typed = ''
      setToast('Woof. Welcome to the pack.')
      window.setTimeout(() => setToast(null), 2400)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reduced])

  const onDownload = useCallback(() => {
    sfx.ui('click')
    window.print()
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Decorative background: grid plus a soft brand wash. */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_40%,#000_30%,transparent_100%)]" />
        <div className="absolute inset-0 [background:radial-gradient(700px_420px_at_78%_12%,rgba(255,45,45,.055),transparent_70%),radial-gradient(600px_500px_at_12%_78%,rgba(96,165,250,.035),transparent_70%)]" />
      </div>

      <TopBar
        active={active}
        onGo={go}
        progress={progress}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(sfx.toggle())}
        onDemo={() => {
          sfx.ui('click')
          setScanOpen(true)
        }}
        onPresent={enterPresent}
      />

      <Rail active={active} onGo={go} />

      <main id="main" className="relative z-10">
        <Hero onGo={go} onDownload={onDownload} />
        <Introduction />
        <Organization />
        <Objectives />
        <Domain />
        <Project />
        <Architecture />
        <Challenges />
        <Learning />
        <Future />
        <Certificate />
        <ThankYou onGo={go} />
      </main>

      <footer className="site-footer no-print relative z-10 border-t border-white/[0.075]">
        <div className="wrap flex flex-wrap justify-between gap-4 py-5">
          <p className="text-xs text-ink-dim">Auto Health Checker · Internship presentation</p>
          <p className="text-xs text-ink-dim">Mathan Kumar. S · Cyber Wolf internship</p>
        </div>
      </footer>

      {presenting && <PresentationHud active={active} onExit={exitPresent} />}

      <ScanDialog open={scanOpen} onOpenChange={setScanOpen} />

      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-white/15 bg-surface-2 px-4 py-2.5 text-[13.5px] text-ink shadow-lg transition-all duration-300',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-3.5 opacity-0',
        )}
      >
        {toast}
      </div>
    </>
  )
}
