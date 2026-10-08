import { useCallback, useEffect, useRef, useState } from 'react'
import { sfx } from '@/lib/sound'

interface Options {
  /** Number of slides in the deck. */
  count: number
  /** Ids in deck order — used to pick the right transition sound. */
  ids: string[]
  reduced: boolean
}

/**
 * Slide navigation with snapping, a scroll lock and keyboard/wheel/touch input.
 *
 * Sections taller than the viewport scroll normally; only once the visitor
 * reaches the edge does the next wheel or swipe move to the following slide.
 * That keeps long sections readable without trapping them.
 */
export function useSectionNav({ count, ids, reduced }: Options) {
  const [active, setActive] = useState(0)
  const [presenting, setPresenting] = useState(false)

  const lock = useRef(0)
  const wheelLock = useRef(0)
  const activeRef = useRef(0)
  const touch = useRef({ y: 0, x: 0, t: 0 })

  /**
   * Sections are resolved from the DOM by id rather than through refs passed
   * down into each section component: the deck is a fixed, known list, and this
   * keeps every section free of navigation plumbing.
   */
  const elements = useCallback(() => ids.map((id) => document.getElementById(id)), [ids])

  const go = useCallback(
    (index: number, opts: { force?: boolean } = {}) => {
      const i = Math.max(0, Math.min(index, count - 1))
      if (i === activeRef.current && !opts.force) return
      const el = elements()[i]
      if (!el) return

      const previous = activeRef.current
      activeRef.current = i
      setActive(i)
      lock.current = Date.now() + 600

      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      if (previous !== i) sfx.transition(ids[i] ?? '')
    },
    [count, ids, reduced, elements],
  )

  /** The slide occupying the reading position, measured from the DOM. */
  const measure = useCallback(() => {
    const mid = window.innerHeight * 0.4
    let best = 0
    let bestDistance = Infinity

    elements().forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top <= mid && r.bottom > mid) {
        best = i
        bestDistance = -1
      } else if (bestDistance !== -1) {
        const d = Math.abs(r.top - mid)
        if (d < bestDistance) {
          bestDistance = d
          best = i
        }
      }
    })
    return best
  }, [elements])

  /** True when the active slide can still scroll in `dir` before its edge. */
  const sectionCanScroll = useCallback((dir: 1 | -1) => {
    const el = elements()[activeRef.current]
    if (!el) return false
    if (el.offsetHeight <= window.innerHeight + 8) return false
    const r = el.getBoundingClientRect()
    return dir > 0 ? r.bottom > window.innerHeight + 6 : r.top < -6
  }, [elements])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          go(activeRef.current + 1)
          break
        case 'ArrowUp':
        case 'PageUp':
        case 'ArrowLeft':
          e.preventDefault()
          go(activeRef.current - 1)
          break
        case 'Home':
          e.preventDefault()
          go(0)
          break
        case 'End':
          e.preventDefault()
          go(count - 1)
          break
        default:
          break
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (Date.now() < wheelLock.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 3) return
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1
      if (sectionCanScroll(dir)) return
      e.preventDefault()
      wheelLock.current = Date.now() + 620
      go(activeRef.current + dir)
    }

    const onTouchStart = (e: TouchEvent) => {
      touch.current = { y: e.touches[0].clientY, x: e.touches[0].clientX, t: Date.now() }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const dy = touch.current.y - e.changedTouches[0].clientY
      const dx = touch.current.x - e.changedTouches[0].clientX
      if (Date.now() - touch.current.t > 700) return
      if (Math.abs(dy) < 60 || Math.abs(dy) < Math.abs(dx) * 1.4) return
      const dir: 1 | -1 = dy > 0 ? 1 : -1
      if (sectionCanScroll(dir)) return
      go(activeRef.current + dir)
    }

    const onScroll = () => {
      if (Date.now() < lock.current) return
      const i = measure()
      if (i !== activeRef.current) {
        activeRef.current = i
        setActive(i)
      }
    }

    let scrollTimer = 0
    const onScrollThrottled = () => {
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(onScroll, 90)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('scroll', onScrollThrottled, { passive: true })

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', onScrollThrottled)
      window.clearTimeout(scrollTimer)
    }
  }, [count, go, measure, sectionCanScroll])

  return { active, presenting, setPresenting, go }
}
