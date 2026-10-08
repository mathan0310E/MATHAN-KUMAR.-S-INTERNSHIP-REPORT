import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Tracks the visitor's reduced-motion preference, live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

const FINE = '(hover: hover) and (pointer: fine)'

/** True on devices with a real pointer, where hover and tilt make sense. */
export function useFinePointer() {
  const [fine, setFine] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(FINE).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(FINE)
    const onChange = () => setFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return fine
}
