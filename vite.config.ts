import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * Content-Security-Policy for the production build.
 *
 * Injected here rather than written into index.html because the dev server adds
 * its own inline module preamble, which a strict policy would block. The same
 * policy is also served as a real HTTP header by `public/_headers` and
 * `vercel.json`.
 *
 * `style-src` allows 'unsafe-inline' because framer-motion and Recharts write
 * dynamic values into style attributes. With `default-src 'none'` and no remote
 * img/font/connect origin, a CSS `url()` cannot reach anywhere.
 *
 * `frame-ancestors` is deliberately absent: browsers ignore it in a <meta> tag,
 * so it is only set as a real HTTP header by `public/_headers` and
 * `vercel.json`. Keeping it here would warn on every page load.
 */
const CSP = [
  "default-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
].join('; ')

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta name="referrer"',
        `<meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta name="referrer"`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), cspPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Both servers are reachable through the workspace's forwarded https URL, so
  // the public hostname has to be allowed explicitly. Vite treats a leading dot
  // as a suffix match, which covers every generated runtime host without
  // pinning one.
  server: {
    host: true,
    port: 12000,
    strictPort: true,
    allowedHosts: ['.prod-runtime.all-hands.dev', '.all-hands.dev', 'localhost'],
  },
  preview: {
    host: true,
    port: 12000,
    strictPort: true,
    allowedHosts: ['.prod-runtime.all-hands.dev', '.all-hands.dev', 'localhost'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    // Recharts is loaded on demand by the findings dashboard, so it is left
    // to Rollup to split automatically rather than pinned into a manual chunk.
    chunkSizeWarningLimit: 700,
  },
})
