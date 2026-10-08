/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Surfaces: deep neutral with a cool cast, never pure black. */
        bg: {
          DEFAULT: '#0b0d12',
          2: '#0e1117',
        },
        surface: {
          DEFAULT: '#141821',
          2: '#1a1f2a',
          3: '#212734',
        },
        /* Text: three levels only. */
        ink: {
          DEFAULT: '#eef1f6',
          muted: '#a3abba',
          dim: '#8d96a6',
        },
        /* Brand accent: Cyber Wolf red, softened for dark-surface legibility. */
        brand: {
          /* Bright red for accents, borders and glow — decorative, no text. */
          DEFAULT: '#ff2d2d',
          /* Deeper red for filled surfaces that carry white text. White on
             #ff2d2d only reaches 3.7:1, which fails WCAG AA for body text. */
          solid: '#d61c1c',
          ink: '#ff0007',
          soft: 'rgba(255,45,45,.10)',
          line: 'rgba(255,45,45,.32)',
        },
        ok: '#34d399',
        warn: '#fbbf24',
        info: '#60a5fa',
        critical: '#ff4d4f',
        high: '#ff8a3d',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,.075)',
        strong: 'rgba(255,255,255,.14)',
        louder: 'rgba(255,255,255,.22)',
      },
      fontFamily: {
        sans: ['"Host Grotesk"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      fontSize: {
        /* Display sizes for projector legibility. */
        display: ['clamp(2.5rem,6.4vw,5.25rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
        section: ['clamp(1.75rem,3.4vw,2.875rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      maxWidth: { wrap: '1240px' },
      borderRadius: { xl2: '12px', xl3: '16px' },
      spacing: {
        /* 8px rhythm on top of Tailwind's 4px base. */
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        flow: { to: { transform: 'translateY(100%)' } },
        nudge: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(4px)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        blink: { '50%': { opacity: '0' } },
        'paw-up': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(.6) rotate(-12deg)' },
          '18%': { opacity: '1', transform: 'translateY(0) scale(1) rotate(0)' },
          '100%': { opacity: '0', transform: 'translateY(-70px) scale(.9) rotate(10deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.22,.61,.36,1) both',
        nudge: 'nudge 2.2s cubic-bezier(.22,.61,.36,1) infinite',
        'spin-slow': 'spin 80s linear infinite',
        blink: 'blink 1s steps(2) infinite',
        'paw-up': 'paw-up 2.6s cubic-bezier(.22,.61,.36,1) forwards',
      },
    },
  },
  plugins: [],
}
