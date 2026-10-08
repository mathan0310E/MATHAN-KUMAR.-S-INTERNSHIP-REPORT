import { useCallback, useEffect, useRef, useState } from 'react'
import { terminalScript } from '@/data/content'
import { sfx } from '@/lib/sound'
import { useReducedMotion } from '@/hooks/useMedia'

const LINE_CLASS: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  ai: 'text-info',
  cmd: 'text-ink',
}

/**
 * Terminal that types out the scan transcript line by line.
 *
 * With reduced motion the whole transcript appears at once. `onDone` fires once
 * the final line lands, which the modal uses to reveal the score.
 */
export function Terminal({
  onDone,
  runId = 0,
  minHeight = 300,
}: {
  onDone?: () => void
  /** Change this to replay the animation. */
  runId?: number
  minHeight?: number
}) {
  const reduced = useReducedMotion()
  const [rendered, setRendered] = useState<string[]>([])
  const [partial, setPartial] = useState('')
  const timers = useRef<number[]>([])
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => {
    clear()
    setRendered([])
    setPartial('')

    const all = [terminalScript.command, ...terminalScript.steps.map((s) => s.text)]

    if (reduced) {
      setRendered(all)
      doneRef.current?.()
      return
    }

    let elapsed = 0
    const push = (fn: () => void, delay: number) => {
      elapsed += delay
      timers.current.push(window.setTimeout(fn, elapsed))
    }

    // Type the command first, then each result line.
    push(() => {
      const cmd = terminalScript.command
      let i = 0
      const tick = () => {
        i += 1
        setPartial(cmd.slice(0, i))
        if (i < cmd.length) {
          timers.current.push(window.setTimeout(tick, 9))
        } else {
          setPartial('')
          setRendered((prev) => [...prev, cmd])
        }
      }
      tick()
    }, 120)

    terminalScript.steps.forEach((step, index) => {
      push(() => {
        setRendered((prev) => [...prev, step.text])
        sfx.scan(index, terminalScript.steps.length)
      }, 260)
    })

    push(() => {
      sfx.complete()
      doneRef.current?.()
    }, 700)

    return clear
  }, [runId, reduced, clear])

  const showCursor = !reduced && rendered.length < terminalScript.steps.length + 1

  return (
    <div
      className="overflow-hidden rounded-xl2 border border-white/15 bg-[#080a0e]"
      role="log"
      aria-label="Simulated scan output"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.075] bg-white/[0.02] px-4 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-white/25" />
          <i className="h-2 w-2 rounded-full bg-white/25" />
          <i className="h-2 w-2 rounded-full bg-white/25" />
        </span>
        <span className="font-mono text-[11px] text-ink-dim">health-check — demo</span>
      </div>

      <pre
        className="m-0 whitespace-pre-wrap break-words px-4 py-4 font-mono text-[12.5px] leading-[1.85] text-ink-muted"
        style={{ minHeight }}
      >
        {rendered.map((line, i) => {
          const step = terminalScript.steps[i - 1]
          const cls = i === 0 ? LINE_CLASS.cmd : step ? LINE_CLASS[step.kind] : ''
          return (
            <div key={`${runId}-${i}`} className={cls}>
              {line}
            </div>
          )
        })}
        {partial && <div className={LINE_CLASS.cmd}>{partial}</div>}
        {showCursor && (
          <span className="inline-block h-[13px] w-[7px] translate-y-[-2px] animate-blink bg-brand" />
        )}
      </pre>
    </div>
  )
}
