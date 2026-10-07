# Transition sounds

Drop your own section-transition audio in this folder, then point `content.js`
at it. Nothing here is required — the presentation already plays synthesised
transitions with no files.

## Adding a sound

1. Put the file in this folder, e.g. `transition-certificate.mp3`.
2. Add a `perSection` entry in `content.js`:

```js
sound: {
  perSection: {
    s10: { mode: 'file', src: 'assets/sfx/transition-certificate.mp3' },
  },
}
```

3. Reload. Only that section changes; the rest keep the generated sound.

## Section ids

Use these keys in `perSection`:

| id | Section |
|---|---|
| `hero` | Hero / overview |
| `s1` | 01 Introduction |
| `s2` | 02 Organization |
| `s3` | 03 Objectives |
| `s4` | 04 Technology |
| `s5` | 05 Project |
| `s6` | 06 Architecture |
| `s7` | 07 Challenges |
| `s8` | 08 Skills |
| `s9` | 09 Future |
| `s10` | 10 Certificate |
| `thanks` | Thank you |

## Recommendations

- **Format:** `.mp3` for the widest support; `.ogg` also works. Avoid `.wav` —
  the file gets inlined into the offline export, so keep each sound small.
- **Length:** 0.4–1.2 s. Longer sounds overlap the next transition.
- **Level:** normalise to roughly −14 LUFS. Interface sound sits low in the mix
  by design; a loud file will feel jarring.
- **Fade:** end with a short fade-out. Hard cut-offs click.
- **Naming:** `transition-<section-id>.mp3` keeps it obvious.

## Other sound hooks

`audio.js` also plays `Sfx.ui('click')`, `Sfx.ui('type')` (terminal typing) and
`Sfx.complete()` (demo-scan finish). These are generated only; there is no file
mapping for them, which keeps the export small.
