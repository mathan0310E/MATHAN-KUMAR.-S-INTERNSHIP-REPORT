import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Terminal } from './Terminal'
import { demoScan } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { sfx } from '@/lib/sound'

/**
 * Scripted demo scan.
 *
 * Purely a visual demonstration: nothing is scanned and no external site is
 * contacted. Radix handles focus trapping, Escape and scroll locking.
 */
export function ScanDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const reduced = useReducedMotion()
  const [runId, setRunId] = useState(0)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)

  const startRun = () => {
    setDone(false)
    setScore(0)
    setRunId((n) => n + 1)
  }

  const finish = () => {
    setDone(true)
    if (reduced) {
      setScore(demoScan.score)
      return
    }
    let t0: number | null = null
    const step = (ts: number) => {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / 900, 1)
      setScore(Math.round(demoScan.score * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) startRun()
        else sfx.ui('click')
        onOpenChange(next)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#06080c]/82 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[92svh] w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl3 border border-white/15 bg-bg-2 p-5 shadow-2xl focus:outline-none">
          <div className="mb-2 flex items-center justify-between gap-4">
            <Dialog.Title className="text-[19px] font-semibold tracking-tight text-ink">
              Demo scan
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close demo scan">
                <X className="h-[18px] w-[18px]" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mb-4 text-[12.5px] text-ink-dim">
            A scripted visual demonstration. Nothing is scanned, and no external site is
            contacted.
          </Dialog.Description>

          <Terminal runId={runId} onDone={finish} />

          <div
            className="mt-4 rounded-xl2 border border-white/[0.075] bg-surface p-4 text-center"
            aria-hidden={!done}
          >
            {done ? (
              <>
                <p className="font-mono text-[9.5px] tracking-[0.18em] text-ink-dim">
                  HEALTH SCORE
                </p>
                <p className="text-[38px] font-bold tracking-tight text-brand tabular-nums">
                  {score}
                  <span className="font-mono text-sm font-normal text-ink-dim"> / 100</span>
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-dim">
                  Demo result — a scripted example, not a live scan.
                </p>
              </>
            ) : (
              <p className="py-8 font-mono text-[11.5px] text-ink-dim">Scanning…</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={startRun} disabled={!done}>
              Run again
            </Button>
            <Dialog.Close asChild>
              <Button variant="primary">Done</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
