import { useEffect, useRef, useState } from 'react'

/**
 * Adds `is-in` once the element scrolls into view, then stops observing.
 * With reduced motion the element is marked immediately so nothing is ever
 * stuck invisible.
 */
export function useReveal<T extends HTMLElement>(reduced = false) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return { ref, shown }
}

/**
 * Counts from 0 to `target` when the element enters view, once.
 * Returns the element ref, the current value and a formatted string.
 */
export function useCountUp(target: number, reduced = false, duration = 1500, decimals = 0) {
  const ref = useRef<HTMLElement | null>(null)
  const [value, setValue] = useState(reduced ? target : 0)
  const started = useRef(false)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    const el = ref.current
    if (!el) return

    const run = () => {
      if (started.current) return
      started.current = true
      let raf = 0
      let t0: number | null = null

      const step = (ts: number) => {
        if (t0 === null) t0 = ts
        const p = Math.min((ts - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        // Round to the target's own precision, so 99.99 does not collapse to 100.
        const factor = 10 ** decimals
        setValue(Math.round(target * eased * factor) / factor)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      return () => cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            io.disconnect()
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, reduced, duration, decimals])

  return { ref, value }
}
