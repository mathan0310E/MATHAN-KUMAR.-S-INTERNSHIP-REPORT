/* ============================================================================
   SOUND ENGINE
   ----------------------------------------------------------------------------
   Two ways to play a section transition:
     · synth  — generated in the browser with the Web Audio API. No files.
                Default, so the presentation has sound out of the box.
     · file   — plays an audio file you supply (mp3 / wav / ogg).

   To swap in your own transition sounds later, edit CONTENT.sound in content.js:

     sound: {
       transitionMode: 'synth',
       perSection: {
         s10: { mode: 'file', src: 'assets/sfx/transition-certificate.mp3' },
       },
     }

   Sound never starts before a user gesture (browser autoplay policy), and the
   on/off choice is remembered in localStorage.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = (window.CONTENT && window.CONTENT.sound) || {};
  var KEY = 'ahc:sound';

  var enabled = cfg.enabled !== false;
  try { if (localStorage.getItem(KEY) === 'off') enabled = false; } catch (e) {}

  var volume = typeof cfg.volume === 'number' ? cfg.volume : 0.5;
  var ctx = null, master = null, noiseBuf = null;
  var fileCache = Object.create(null);
  var lastPlay = 0;

  /* ── graph ───────────────────────────────────────────────────────────── */

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 14;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;
    master.connect(comp);
    comp.connect(ctx.destination);
    noiseBuf = buildNoise();
    rampMaster();
    return ctx;
  }

  function rampMaster() {
    if (!ctx || !master) return;
    var target = enabled ? volume * 0.55 : 0;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(target, ctx.currentTime, 0.05);
  }

  function buildNoise() {
    var len = Math.floor(ctx.sampleRate * 1.5);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  /* ── primitives ──────────────────────────────────────────────────────── */

  function tone(o) {
    if (!ctx) return;
    var t0 = ctx.currentTime + (o.delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(o.glide, 20), t0 + o.dur);
    if (o.detune) osc.detune.value = o.detune;
    var peak = o.gain == null ? 0.2 : o.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.05);
  }

  function whoosh(o) {
    if (!ctx) return;
    var t0 = ctx.currentTime + (o.delay || 0);
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = o.q == null ? 1.1 : o.q;
    bp.frequency.setValueAtTime(o.from, t0);
    bp.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    var g = ctx.createGain();
    var peak = o.gain == null ? 0.16 : o.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + o.dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0);
    src.stop(t0 + o.dur + 0.05);
  }

  /* ── file playback ───────────────────────────────────────────────────── */

  function playFile(src) {
    var el = fileCache[src];
    if (!el) {
      el = new Audio(src);
      el.preload = 'auto';
      el.volume = Math.min(1, volume);
      fileCache[src] = el;
    }
    try {
      el.currentTime = 0;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /* ── public API ──────────────────────────────────────────────────────── */

  var Sfx = {

    /** Call from the first user gesture to unlock audio. */
    unlock: function () {
      var c = ensure();
      if (c && c.state === 'suspended') c.resume();
    },

    get enabled() { return enabled; },

    setEnabled: function (on) {
      enabled = !!on;
      try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) {}
      if (enabled) { ensure(); }
      rampMaster();
      if (enabled) Sfx.ui('click');
    },

    toggle: function () { Sfx.setEnabled(!enabled); return enabled; },

    setVolume: function (v) { volume = Math.max(0, Math.min(1, v)); rampMaster(); },

    /** Section transition. `key` is the section id, `index` orders the pitch. */
    transition: function (key, index) {
      if (!enabled) return;
      var now = performance.now();
      if (now - lastPlay < 140) return;      // guard against scroll spam
      lastPlay = now;

      var per = (cfg.perSection || {})[key];
      var spec = per || null;
      var mode = (spec && spec.mode) || cfg.transitionMode || 'synth';

      if (mode === 'file' && spec && spec.src) { playFile(spec.src); return; }

      var c = ensure();
      if (!c) return;
      if (c.state === 'suspended') c.resume();

      // Deeper, darker as the deck progresses; a small rising step each slide.
      var step = Math.max(0, index || 0);
      var base = 104 * Math.pow(2, -step / 24);
      var lift = 300 + step * 14;

      whoosh({ from: 420, to: 2600, dur: 0.46, gain: 0.115, q: 1.05 });
      tone({ freq: base, type: 'sine', dur: 0.62, gain: 0.17, attack: 0.012, glide: base * 0.62 });
      tone({ freq: base * 1.5, type: 'triangle', dur: 0.4, gain: 0.055, attack: 0.02, delay: 0.03, detune: 6 });
      tone({ freq: lift, type: 'sine', dur: 0.22, gain: 0.035, attack: 0.006, delay: 0.06 });
    },

    /** Completion flourish — used when a demo scan finishes. */
    complete: function () {
      if (!enabled || !cfg.ui || cfg.ui.complete === false) return;
      var c = ensure();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      var notes = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < notes.length; i++) {
        tone({ freq: notes[i], type: 'triangle', dur: 0.55, gain: 0.11, attack: 0.006, delay: i * 0.075 });
      }
      whoosh({ from: 1800, to: 6000, dur: 0.5, gain: 0.05, delay: 0.16 });
    },

    /** Small UI sounds: 'click' | 'hover' | 'type' | 'tick'. */
    ui: function (kind) {
      if (!enabled) return;
      if (cfg.ui && cfg.ui[kind] === false) return;
      var c = ensure();
      if (!c) return;
      if (c.state === 'suspended') c.resume();

      if (kind === 'hover') {
        tone({ freq: 2100, type: 'sine', dur: 0.05, gain: 0.018 });
      } else if (kind === 'type') {
        tone({ freq: 1250 + Math.random() * 420, type: 'square', dur: 0.014, gain: 0.012 });
      } else if (kind === 'tick') {
        tone({ freq: 900, type: 'sine', dur: 0.03, gain: 0.02 });
      } else {
        tone({ freq: 1180, type: 'sine', dur: 0.05, gain: 0.045 });
        tone({ freq: 1760, type: 'sine', dur: 0.035, gain: 0.022, delay: 0.015 });
      }
    },
  };

  window.Sfx = Sfx;
})();
