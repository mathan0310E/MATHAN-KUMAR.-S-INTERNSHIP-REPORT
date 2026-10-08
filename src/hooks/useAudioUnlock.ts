import { useEffect } from 'react'
import { sfx } from '@/lib/sound'

/**
 * Unlocks the AudioContext on the first real user gesture.
 *
 * Browsers refuse to start audio until the visitor interacts, so the context
 * is created suspended and resumed here. Registered once for the whole app.
 */
export function useAudioUnlock() {
  useEffect(() => {
    const unlock = () => sfx.unlock()
    const opts = { once: true, passive: true } as const
    window.addEventListener('pointerdown', unlock, opts)
    window.addEventListener('keydown', unlock, opts)
    window.addEventListener('touchstart', unlock, opts)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])
}
