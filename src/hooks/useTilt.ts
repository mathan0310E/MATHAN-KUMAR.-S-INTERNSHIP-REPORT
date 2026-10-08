import { useCallback, useRef } from 'react'
import { useFinePointer, useReducedMotion } from './useMedia'

/**
 * Card tilt that follows the pointer.
 *
 * The rotation is written to CSS custom properties rather than a transform, so
 * any existing transform (hover lift, entrance animation) still composes.
 * Disabled on touch devices and under reduced motion.
 */
export function useTilt(max = 6) {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement | null>(null)
  const frame = useRef(0)

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el || reduced || !fine) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`)
        frame.current = 0
      })
    },
    [fine, max, reduced],
  )

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return { ref, onPointerMove, onPointerLeave, enabled: fine && !reduced }
}

/** The composed tilt transform, kept here so every tilted surface matches. */
export const tiltStyle = {
  transform: 'perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
} as const
