import { sound as soundConfig } from '@/data/content'

/**
 * Transition sound effects.
 *
 * Every section gets its own synthesised tone, so the deck has working sound
 * with no audio files at all. If `content.ts` maps a section to a file in
 * `public/assets/sfx/`, that file is used instead; anything unmapped keeps the
 * tone.
 *
 * Browsers block audio until the user interacts, so the AudioContext starts
 * suspended and is unlocked on the first click, key press or touch.
 */

type SectionVoice = {
  /** Base frequency in Hz. */
  f: number
  /** Frequency the tone sweeps to. */
  to: number
  /** Duration in seconds. */
  d: number
  type: OscillatorType
  gain: number
}

/** Lower and longer reads as "arrival"; higher and shorter reads as "advance". */
const VOICES: Record<string, SectionVoice> = {
  hero: { f: 174.6, to: 261.6, d: 0.85, type: 'sine', gain: 1.0 },
  s1: { f: 233.1, to: 311.1, d: 0.5, type: 'triangle', gain: 0.8 },
  s2: { f: 196.0, to: 246.9, d: 0.55, type: 'triangle', gain: 0.8 },
  s3: { f: 220.0, to: 277.2, d: 0.45, type: 'triangle', gain: 0.8 },
  s4: { f: 246.9, to: 311.1, d: 0.45, type: 'triangle', gain: 0.8 },
  s5: { f: 261.6, to: 329.6, d: 0.45, type: 'triangle', gain: 0.8 },
  s6: { f: 293.7, to: 370.0, d: 0.5, type: 'sine', gain: 0.85 },
  s7: { f: 277.2, to: 349.2, d: 0.45, type: 'triangle', gain: 0.8 },
  s8: { f: 311.1, to: 392.0, d: 0.45, type: 'triangle', gain: 0.8 },
  s9: { f: 349.2, to: 440.0, d: 0.6, type: 'sine', gain: 0.9 },
  s10: { f: 392.0, to: 523.3, d: 1.1, type: 'sine', gain: 1.1 },
  thanks: { f: 440.0, to: 587.3, d: 1.3, type: 'sine', gain: 1.0 },
}

const FALLBACK: SectionVoice = { f: 240, to: 300, d: 0.45, type: 'triangle', gain: 0.8 }
const STORAGE_KEY = 'ahc.sound'

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private buffers = new Map<string, AudioBuffer>()
  private enabled: boolean

  constructor() {
    this.enabled = soundConfig.enabledByDefault
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'off') this.enabled = false
      if (stored === 'on') this.enabled = true
    } catch {
      /* storage blocked — keep the default */
    }
  }

  get isEnabled() {
    return this.enabled
  }

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = soundConfig.volume
    this.master.connect(this.ctx.destination)
    return this.ctx
  }

  /** Resume the context. Must be called from a user gesture. */
  unlock() {
    const ctx = this.ensure()
    if (ctx && ctx.state === 'suspended') void ctx.resume()
  }

  setEnabled(on: boolean) {
    this.enabled = on
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
    } catch {
      /* storage blocked — the session still honours the choice */
    }
    return this.enabled
  }

  toggle() {
    return this.setEnabled(!this.enabled)
  }

  private ready(): AudioContext | null {
    if (!this.enabled) return null
    const ctx = this.ensure()
    return ctx && ctx.state === 'running' ? ctx : null
  }

  /** Two short oscillators: a swept body plus a soft high sparkle. */
  private tone(v: SectionVoice) {
    const ctx = this.ready()
    if (!ctx || !this.master) return
    const now = ctx.currentTime

    const body = ctx.createOscillator()
    const bodyGain = ctx.createGain()
    body.type = v.type
    body.frequency.setValueAtTime(v.f, now)
    body.frequency.exponentialRampToValueAtTime(v.to, now + v.d)
    bodyGain.gain.setValueAtTime(0, now)
    bodyGain.gain.linearRampToValueAtTime(0.5 * v.gain, now + 0.012)
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + v.d)
    body.connect(bodyGain).connect(this.master)
    body.start(now)
    body.stop(now + v.d + 0.03)

    const spark = ctx.createOscillator()
    const sparkGain = ctx.createGain()
    spark.type = 'sine'
    spark.frequency.setValueAtTime(v.f * 2, now + 0.02)
    sparkGain.gain.setValueAtTime(0, now)
    sparkGain.gain.linearRampToValueAtTime(0.14 * v.gain, now + 0.03)
    sparkGain.gain.exponentialRampToValueAtTime(0.0006, now + v.d * 0.7)
    spark.connect(sparkGain).connect(this.master)
    spark.start(now + 0.02)
    spark.stop(now + v.d)
  }

  private playBuffer(buffer: AudioBuffer) {
    const ctx = this.ready()
    if (!ctx || !this.master) return
    const src = ctx.createBufferSource()
    const gain = ctx.createGain()
    src.buffer = buffer
    gain.gain.value = 1
    src.connect(gain).connect(this.master)
    src.start()
  }

  /** Lazily fetch a file override. Failure is non-fatal: the tone stays. */
  private loadFile(id: string, src: string) {
    const ctx = this.ensure()
    if (!ctx) return
    fetch(src, { cache: 'force-cache' })
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => this.buffers.set(id, decoded))
      .catch(() => {
        /* keep the synthesised tone */
      })
  }

  /** Section transition. */
  transition(id: string) {
    const override = soundConfig.perSection[id]
    if (override?.mode === 'none') return

    if (override?.mode === 'file' && override.src) {
      const cached = this.buffers.get(id)
      if (cached) {
        this.playBuffer(cached)
        return
      }
      this.loadFile(id, override.src) // fall through to the tone this time
    }

    this.tone(VOICES[id] ?? FALLBACK)
  }

  /** Short interface sounds. */
  ui(kind: 'click' | 'hover') {
    if (kind === 'click' && !soundConfig.ui.click) return
    if (kind === 'hover' && !soundConfig.ui.hover) return
    const ctx = this.ready()
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (kind === 'hover') {
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.06)
      osc.connect(gain).connect(this.master)
      osc.start(now)
      osc.stop(now + 0.08)
    } else {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.1)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.22, now + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.12)
      osc.connect(gain).connect(this.master)
      osc.start(now)
      osc.stop(now + 0.14)
    }
  }

  /** Rising blip used once per demo-scan line. */
  scan(step: number, total: number) {
    const ctx = this.ready()
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300 + (step / Math.max(1, total)) * 320, now)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.1, now + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.14)
    osc.connect(gain).connect(this.master)
    osc.start(now)
    osc.stop(now + 0.16)
  }

  /** Warm two-note resolve for the final scan result. */
  complete() {
    const ctx = this.ready()
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    for (const [i, freq] of [523.3, 659.3].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = now + i * 0.14
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.5)
      osc.connect(gain).connect(this.master)
      osc.start(t)
      osc.stop(t + 0.55)
    }
  }
}

export const sfx = new SoundEngine()
