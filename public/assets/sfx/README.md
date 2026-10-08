# Transition sounds

Drop your own audio files here, then map them in `sound.perSection` in
`src/data/content.ts`:

```ts
perSection: {
  s5: { mode: 'file', src: 'assets/sfx/transition-project.mp3' },
},
```

Keys are the slide ids: `hero`, `s1` … `s10`, `thanks`. Any slide you do not map
keeps its synthesised tone, so you can replace them one at a time.

Keep files short (under about a second) and small — they load on demand the first
time their slide is shown. `.mp3` and `.ogg` both work.
