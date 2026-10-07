/* ============================================================================
   AUTO HEALTH CHECKER — PRESENTATION ENGINE
   Navigation · scroll snapping · reveal · counters · canvas FX · demo scan
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONTENT || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DECK, SLIDES, rail, railList, readbar, hudLabel, hudCount;

  /* ══ 1. BOOT ═══════════════════════════════════════════════════════════ */

  function boot() {
    var log = $('#bootLog');
    var lines = C.boot || ['ready'];
    var i = 0;
    (function step() {
      if (i < lines.length) {
        var d = document.createElement('div');
        d.className = 'boot__line';
        d.textContent = '› ' + lines[i];
        log.appendChild(d);
        i++;
        setTimeout(step, REDUCED ? 40 : 180);
      } else {
        setTimeout(finishBoot, REDUCED ? 60 : 320);
      }
    })();
  }

  function finishBoot() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    var p = $('#preloader');
    if (p) p.classList.add('is-gone');
    setTimeout(function () { if (p) p.remove(); }, 700);
    startHero();
    revealVisible();
  }

  /* ══ 2. BACKGROUND FX ══════════════════════════════════════════════════ */

  function BackgroundFX() {
    var cv = $('#fx-bg');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var W = 0, H = 0, nodes = [], streams = [], stars = [];
    var ptr = { x: -9999, y: -9999 };

    function resize() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var density = clamp(Math.round((W * H) / 26000), 34, 96);
      nodes = [];
      for (var i = 0; i < density; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 1.5 + 0.7,
          hub: Math.random() < 0.09,
        });
      }
      streams = [];
      for (var s = 0; s < 5; s++) {
        streams.push({
          x: Math.random() * W, y: -Math.random() * H,
          len: 90 + Math.random() * 180,
          sp: 0.5 + Math.random() * 0.9,
          a: 0.05 + Math.random() * 0.07,
        });
      }
      stars = [];
      for (var k = 0; k < 70; k++) stars.push({ x: Math.random() * W, y: Math.random() * H, p: Math.random() * 6.28 });
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);

      // drifting data streams
      for (var s = 0; s < streams.length; s++) {
        var st = streams[s];
        st.y += st.sp;
        if (st.y - st.len > H) { st.y = -st.len; st.x = Math.random() * W; }
        var g = ctx.createLinearGradient(st.x, st.y - st.len, st.x, st.y);
        g.addColorStop(0, 'rgba(124,77,255,0)');
        g.addColorStop(1, 'rgba(124,77,255,' + st.a + ')');
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(st.x, st.y - st.len); ctx.lineTo(st.x, st.y); ctx.stroke();
      }

      // faint starfield
      for (var k = 0; k < stars.length; k++) {
        var sr = stars[k];
        var tw = 0.14 + 0.16 * (0.5 + 0.5 * Math.sin(t * 0.001 + sr.p));
        ctx.fillStyle = 'rgba(190,205,255,' + tw + ')';
        ctx.fillRect(sr.x, sr.y, 1.2, 1.2);
      }

      // topology: links then nodes
      var maxD = Math.min(W, H) * 0.22;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 > maxD * maxD) continue;
          var al = (1 - Math.sqrt(d2) / maxD) * 0.16;
          ctx.strokeStyle = 'rgba(139,92,246,' + al + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      for (var n = 0; n < nodes.length; n++) {
        var nd = nodes[n];
        nd.x += nd.vx; nd.y += nd.vy;
        if (nd.x < 0 || nd.x > W) nd.vx *= -1;
        if (nd.y < 0 || nd.y > H) nd.vy *= -1;

        // pointer attraction (parallax feel)
        var pdx = ptr.x - nd.x, pdy = ptr.y - nd.y;
        var pd = Math.sqrt(pdx * pdx + pdy * pdy);
        var near = pd < 190;

        if (nd.hub) {
          var pulse = 0.5 + 0.5 * Math.sin(t * 0.0022 + nd.x * 0.01);
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r + 1.4 + pulse * 1.2, 0, 6.2832);
          ctx.fillStyle = 'rgba(244,63,94,' + (0.30 + pulse * 0.35) + ')';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 9 + pulse * 7, 0, 6.2832);
          ctx.strokeStyle = 'rgba(244,63,94,' + (0.16 - pulse * 0.1) + ')';
          ctx.lineWidth = 1; ctx.stroke();
          if (near) {
            ctx.beginPath(); ctx.moveTo(nd.x, nd.y); ctx.lineTo(ptr.x, ptr.y);
            ctx.strokeStyle = 'rgba(244,63,94,0.22)'; ctx.lineWidth = 0.8; ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r + (near ? 0.9 : 0), 0, 6.2832);
          ctx.fillStyle = near ? 'rgba(167,139,250,0.85)' : 'rgba(148,163,184,0.42)';
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    var raf = null;
    resize();
    window.addEventListener('resize', debounce(resize, 220), { passive: true });
    window.addEventListener('pointermove', function (e) {
      ptr.x = e.clientX; ptr.y = e.clientY;
    }, { passive: true });

    if (REDUCED) { frame(0); cancelAnimationFrame(raf); raf = null; }
    else raf = requestAnimationFrame(frame);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else if (!REDUCED && !raf) raf = requestAnimationFrame(frame);
    });
  }

  /* ══ 3. DIGITAL GLOBE (thank-you section) ══════════════════════════════ */

  function Globe() {
    var cv = $('#globe');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var W, H, cx, cy, R;
    var pts = [], arcs = [], raf = null, active = false;

    function sphere(n) {
      var out = [], ga = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < n; i++) {
        var y = 1 - (i / (n - 1)) * 2;
        var r = Math.sqrt(Math.max(0, 1 - y * y));
        var th = ga * i;
        out.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r });
      }
      return out;
    }

    function resize() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.34;
    }

    function project(p, rot, tilt) {
      var cr = Math.cos(rot), sr = Math.sin(rot);
      var x = p.x * cr - p.z * sr;
      var z = p.x * sr + p.z * cr;
      var ct = Math.cos(tilt), stt = Math.sin(tilt);
      var y = p.y * ct - z * stt;
      z = p.y * stt + z * ct;
      var s = 1.9 / (1.9 + z);
      return { x: cx + x * R * s, y: cy + y * R * s, z: z, s: s };
    }

    function build() {
      pts = sphere(430);
      arcs = [];
      for (var i = 0; i < 9; i++) {
        var a = pts[Math.floor(Math.random() * pts.length)];
        var b = pts[Math.floor(Math.random() * pts.length)];
        if (a === b) continue;
        arcs.push({ a: a, b: b, t: Math.random(), sp: 0.0035 + Math.random() * 0.005 });
      }
    }

    var rot = 0, tilt = 0.32;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      rot += 0.0016;

      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832);
      ctx.strokeStyle = 'rgba(124,77,255,0.20)'; ctx.lineWidth = 1; ctx.stroke();

      var proj = pts.map(function (p) { return project(p, rot, tilt); });

      for (var i = 0; i < proj.length; i++) {
        var q = proj[i];
        if (q.z < -0.15) continue;
        var al = clamp(0.10 + (q.z + 1) * 0.20, 0.05, 0.5);
        ctx.beginPath(); ctx.arc(q.x, q.y, q.s * 1.05, 0, 6.2832);
        ctx.fillStyle = 'rgba(167,139,250,' + al + ')'; ctx.fill();
      }

      for (var k = 0; k < arcs.length; k++) {
        var ar = arcs[k];
        ar.t += ar.sp;
        if (ar.t > 1) { ar.t = 0; ar.a = pts[Math.floor(Math.random() * pts.length)]; }
        var A = project(ar.a, rot, tilt), B = project(ar.b, rot, tilt);
        if (A.z < -0.1 || B.z < -0.1) continue;
        var hx = lerp(A.x, B.x, ar.t), hy = lerp(A.y, B.y, ar.t);
        var cxp = lerp(A.x, B.x, 0.5), cyp = lerp(A.y, B.y, 0.5) - Math.abs(B.x - A.x) * 0.14;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(cxp, cyp, B.x, B.y);
        ctx.strokeStyle = 'rgba(139,92,246,0.20)'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy, 1.7, 0, 6.2832);
        ctx.fillStyle = 'rgba(244,63,94,0.9)'; ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize(); build();
    window.addEventListener('resize', debounce(function () { resize(); build(); }, 220), { passive: true });

    // Only animate while the thank-you section is on screen.
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        active = e.isIntersecting;
        if (active && !raf && !REDUCED) raf = requestAnimationFrame(frame);
        if (!active && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 });
    io.observe(cv);
    if (REDUCED) { frame(); if (raf) { cancelAnimationFrame(raf); raf = null; } }
  }

  /* ══ 4. RAIL / NAVIGATION ══════════════════════════════════════════════ */

  function buildRail() {
    railList.innerHTML = '';
    SLIDES.forEach(function (sec, i) {
      var num = sec.getAttribute('data-nav') || String(i).padStart(2, '0');
      var label = sec.getAttribute('data-label') || '';
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__item';
      b.setAttribute('data-goto', String(i));
      b.setAttribute('aria-label', 'Go to ' + label);
      b.innerHTML = '<span class="rail__num">' + num + '</span><span class="rail__dot" aria-hidden="true"></span><span class="rail__name">' + label + '</span>';
      li.appendChild(b);
      railList.appendChild(li);
    });
  }

  function currentIndex() {
    var mid = window.innerHeight * 0.42, best = 0, bestD = Infinity;
    for (var i = 0; i < SLIDES.length; i++) {
      var r = SLIDES[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) return i;
      var d = Math.abs(r.top - mid);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  var navLock = 0;
  function go(i, opts) {
    opts = opts || {};
    i = clamp(i, 0, SLIDES.length - 1);
    if (i === active && !opts.force) return;
    var sec = SLIDES[i];
    var prev = active;
    active = i;
    navLock = Date.now() + 620;

    sec.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    updateNav(i);

    if (prev !== i) {
      if (window.Sfx) Sfx.transition(sec.id, i);
      document.body.classList.add('is-transitioning');
      setTimeout(function () { document.body.classList.remove('is-transitioning'); }, 520);
    }
  }

  var active = 0;

  function updateNav(i) {
    var sec = SLIDES[i];
    var label = (sec.getAttribute('data-label') || '').toUpperCase();
    var num = sec.getAttribute('data-nav');
    var human = num && num !== '—' ? num : '—';
    hudLabel.textContent = label;
    hudCount.textContent = human + ' / 10';
    var phL = $('#phLabel'), phC = $('#phCount'), phB = $('#phBar');
    if (phL) phL.textContent = label;
    if (phC) phC.textContent = human + ' / 10';
    if (phB) phB.style.width = ((i + 1) / SLIDES.length * 100) + '%';

    $$('.rail__item').forEach(function (b, k) {
      var on = k === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });

    var pct = (i + 1) / SLIDES.length * 100;
    readbar.style.width = pct + '%';

    // fire reveal + counters for the section we just landed on
    revealIn(sec);
    countIn(sec);
    if (sec.id === 'hero') startHero();
    if (sec.id === 's6') animateArch();
  }

  function initNav() {
    // click delegation
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-goto]');
      if (!t) return;
      e.preventDefault();
      if (window.Sfx) Sfx.unlock();
      go(parseInt(t.getAttribute('data-goto'), 10));
      if (window.Sfx) Sfx.ui('click');
    });

    // keyboard
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (!$('#scanModal').hidden && e.key !== 'Escape') return;

      switch (e.key) {
        case 'ArrowDown': case 'PageDown': case 'ArrowRight': case ' ':
          e.preventDefault(); go(active + 1); break;
        case 'ArrowUp': case 'PageUp': case 'ArrowLeft':
          e.preventDefault(); go(active - 1); break;
        case 'Home': e.preventDefault(); go(0); break;
        case 'End': e.preventDefault(); go(SLIDES.length - 1); break;
        case 'Escape': if (presenting) exitPresent(); break;
        case 'p': case 'P': togglePresent(); break;
      }
    });

    // wheel — section by section, but let tall sections scroll naturally
    var wheelLock = 0;
    window.addEventListener('wheel', function (e) {
      if (Date.now() < wheelLock) { e.preventDefault(); return; }
      var sec = SLIDES[active];
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      var taller = sec.offsetHeight > window.innerHeight + 8;
      var dir = e.deltaY > 0 ? 1 : -1;
      if (Math.abs(e.deltaY) < 3) return;

      if (taller) {
        var atBottom = r.bottom <= window.innerHeight + 6;
        var atTop = r.top >= -6;
        if (dir > 0 && !atBottom) return;      // let it scroll inside
        if (dir < 0 && !atTop) return;
      }
      e.preventDefault();
      wheelLock = Date.now() + 640;
      go(active + dir);
    }, { passive: false });

    // touch swipe
    var ty = 0, tx = 0, tt = 0;
    window.addEventListener('touchstart', function (e) {
      ty = e.touches[0].clientY; tx = e.touches[0].clientX; tt = Date.now();
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
      var dy = e.changedTouches[0].clientY - ty;
      var dx = e.changedTouches[0].clientX - tx;
      if (Date.now() - tt > 800) return;
      if (Math.abs(dy) < 58 || Math.abs(dy) < Math.abs(dx)) return;
      var sec = SLIDES[active];
      var taller = sec && sec.offsetHeight > window.innerHeight + 8;
      if (taller) {
        var r = sec.getBoundingClientRect();
        if (dy < 0 && r.bottom > window.innerHeight + 6) return;
        if (dy > 0 && r.top < -6) return;
      }
      go(active + (dy < 0 ? 1 : -1));
    }, { passive: true });

    // scroll spy (covers native scrolling / scrollbar drag / anchors)
    var spyLock = 0;
    window.addEventListener('scroll', function () {
      readbarThrottle();
      if (Date.now() < navLock) return;
      var i = currentIndex();
      if (i !== active) { active = i; updateNav(i); }
    }, { passive: true });
  }

  var rbTicking = false;
  function readbarThrottle() {
    if (rbTicking) return;
    rbTicking = true;
    requestAnimationFrame(function () {
      rbTicking = false;
      var doc = document.documentElement;
      var pct = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
      if (!presenting) readbar.style.width = clamp(pct * 100, 0, 100) + '%';
    });
  }

  /* ══ 5. REVEAL + COUNTERS ══════════════════════════════════════════════ */

  var revIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revIO.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  function initReveal() {
    $$('.reveal, .card, .fcard, .constel__c, .duel__row, .stat').forEach(function (el, i) {
      el.classList.add('reveal');
      if (!el.style.getPropertyValue('--d')) {
        el.style.setProperty('--d', (i % 7) * 55 + 'ms');
      }
      revIO.observe(el);
    });
  }

  function revealIn(sec) {
    $$('.reveal', sec).forEach(function (el) { el.classList.add('is-in'); });
  }

  function revealVisible() {
    SLIDES.slice(0, 2).forEach(revealIn);
  }

  var counted = new WeakSet();
  function countIn(sec) {
    $$('[data-count]', sec).forEach(function (el) {
      if (counted.has(el)) return;
      counted.add(el);
      runCount(el);
    });
  }

  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (REDUCED) { el.textContent = fmt(target) + suffix; return; }
    var dur = 1100, t0 = null;
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target) + suffix;
    }
    requestAnimationFrame(tick);
  }
  function fmt(n) {
    n = Math.round(n);
    return n >= 1000 ? n.toLocaleString('en-US') : String(n);
  }

  function initCounters() {
    // Safety net: on a direct page load (or with reduced motion) the observer may
    // already have fired, so make sure any counter inside the first two slides and
    // anything already on screen shows its final value.
    setTimeout(function () {
      SLIDES.slice(0, 2).forEach(countIn);
      $$('#stats, #scanPanel').forEach(function (s) {
        if (s.getBoundingClientRect().top < window.innerHeight) countIn(s);
      });
    }, REDUCED ? 60 : 900);

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countIn(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    $$('#stats, #scanPanel, .slide').forEach(function (s) { io.observe(s); });
  }

  /* ══ 6. HERO DASHBOARD ════════════════════════════════════════════════ */

  var heroPlayed = false;
  function startHero() {
    var P = C.project || {};
    var target = P.healthScore || 87;

    // sub-scores
    var metrics = $$('#heroMetrics li');
    var subs = P.subscores || [];
    metrics.forEach(function (li, i) {
      var v = subs[i] ? subs[i].value : 0;
      var bar = $('b', li);
      setTimeout(function () {
        bar.style.width = v + '%';
        li.classList.add('is-in');
      }, REDUCED ? 0 : 260 + i * 110);
    });

    // severity
    $$('#heroSev li').forEach(function (li, i) {
      setTimeout(function () { li.classList.add('is-in'); }, REDUCED ? 0 : 420 + i * 90);
    });

    // score ring + number
    var ring = $('.score__val', $('#heroDash'));
    var num = $('#heroScore');
    var grade = $('#heroGrade');
    var CIRC = 2 * Math.PI * 52;
    if (ring) {
      ring.style.strokeDasharray = CIRC;
      ring.style.strokeDashoffset = CIRC;
    }
    var t0 = null, dur = REDUCED ? 1 : 1500;
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var v = target * e;
      if (num) num.textContent = Math.round(v);
      if (ring) ring.style.strokeDashoffset = CIRC * (1 - v / 100);
      if (p < 1) requestAnimationFrame(tick);
      else {
        if (num) num.textContent = target;
        if (grade) { grade.textContent = target >= 90 ? 'EXCELLENT' : target >= 80 ? 'GOOD' : target >= 60 ? 'FAIR' : 'AT RISK'; grade.classList.add('is-in'); }
      }
    }
    if (!heroPlayed || !REDUCED) requestAnimationFrame(tick);
    heroPlayed = true;

    var done = $('#dashDone');
    if (done) setTimeout(function () { done.classList.add('is-in'); }, REDUCED ? 0 : 1750);
  }

  /* ══ 7. ARCHITECTURE ══════════════════════════════════════════════════ */

  function initArch() {
    var panel = $('#archPanel');
    if (!panel) return;
    var A = C.arch || {};
    var flow = $('#archFlow');

    function show(key) {
      var d = A[key];
      if (!d) return;
      $('#archTitle').textContent = d.title;
      $('#archPurpose').textContent = d.purpose;
      $('#archInput').textContent = d.input;
      $('#archOutput').textContent = d.output;
      $('#archTech').textContent = d.tech;
      panel.classList.add('is-in');
      $$('.node', flow).forEach(function (n) {
        n.classList.toggle('is-sel', n.getAttribute('data-arch') === key);
      });
    }

    flow.addEventListener('mouseover', function (e) {
      var n = e.target.closest('.node'); if (n) show(n.getAttribute('data-arch'));
    });
    flow.addEventListener('focusin', function (e) {
      var n = e.target.closest('.node'); if (n) show(n.getAttribute('data-arch'));
    });
    flow.addEventListener('click', function (e) {
      var n = e.target.closest('.node');
      if (n) { show(n.getAttribute('data-arch')); if (window.Sfx) Sfx.ui('click'); }
    });
  }

  var archDone = false;
  function animateArch() {
    var flow = $('#archFlow');
    if (!flow || archDone) return;
    archDone = true;
    $$('.node, .arch__link, .arch__split i, .arch__merge i', flow).forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-in'); }, REDUCED ? 0 : i * 40);
    });
  }

  function initArchReveal() {
    var flow = $('#archFlow');
    if (!flow) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animateArch(); io.unobserve(flow); } });
    }, { threshold: 0.12 });
    io.observe(flow);
  }

  /* ══ 8. ECO SYSTEM + CONSTELLATION LINES ══════════════════════════════ */

  function initEco() {
    var eco = $('#eco');
    if (!eco) return;
    var svg = $('.eco__lines', eco);
    var nodes = $$('.eco__nodes li', eco);
    var NS = 'http://www.w3.org/2000/svg';
    nodes.forEach(function (li) {
      var deg = parseFloat((li.style.getPropertyValue('--a') || '0').replace('deg', ''));
      var rad = (deg - 90) * Math.PI / 180;
      var x = 50 + Math.cos(rad) * 38, y = 50 + Math.sin(rad) * 38;
      li.style.setProperty('--x', x + '%');
      li.style.setProperty('--y', y + '%');
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', 50); line.setAttribute('y1', 50);
      line.setAttribute('x2', x); line.setAttribute('y2', y);
      line.setAttribute('class', 'eco__line');
      line.style.setProperty('--d', (nodes.indexOf(li) * 90) + 'ms');
      svg.appendChild(line);
    });
    var hint = $('#mapHint');
    var ecoHint = document.createElement('p');
    ecoHint.className = 'map__hint';
    ecoHint.textContent = 'Hover or focus a node for detail.';
    eco.appendChild(ecoHint);
    eco.addEventListener('mouseover', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      ecoHint.textContent = li.getAttribute('data-info') || '';
    });
    eco.addEventListener('focusin', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      ecoHint.textContent = li.getAttribute('data-info') || '';
    });
    eco.addEventListener('mouseleave', function () {
      ecoHint.textContent = 'Hover or focus a node for detail.';
    });
  }

  function initMap() {
    var map = $('.map');
    if (!map) return;
    var hint = $('#mapHint');
    map.addEventListener('mouseover', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      hint.textContent = li.getAttribute('data-info') || '';
      hint.classList.add('is-on');
    });
    map.addEventListener('focusin', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      hint.textContent = li.getAttribute('data-info') || '';
      hint.classList.add('is-on');
    });
    map.addEventListener('mouseleave', function () {
      hint.textContent = 'Hover or focus a node for detail.';
      hint.classList.remove('is-on');
    });
  }

  function initConstel() {
    var box = $('#constel');
    if (!box) return;
    var svg = $('.constel__web', box);
    var NS = 'http://www.w3.org/2000/svg';

    function draw() {
      var w = box.clientWidth, h = box.clientHeight;
      if (w < 10 || h < 10) return;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      var br = box.getBoundingClientRect();
      var core = $('.constel__c--core', box);
      if (!core) return;
      var cr = core.getBoundingClientRect();
      var cx = cr.left - br.left + cr.width / 2;
      var cy = cr.top - br.top + cr.height / 2;

      $$('.constel__c', box).forEach(function (c) {
        if (c === core) return;
        var r = c.getBoundingClientRect();
        // connect from the nearest edge of the cluster card to the core
        var tx = r.left - br.left + r.width / 2;
        var ty = r.top - br.top + r.height / 2;
        var ang = Math.atan2(ty - cy, tx - cx);
        var sx = cx + Math.cos(ang) * (cr.width / 2 + 4);
        var sy = cy + Math.sin(ang) * (cr.height / 2 + 4);
        var ex = tx - Math.cos(ang) * (r.width / 2 + 6);
        var ey = ty - Math.sin(ang) * (r.height / 2 + 6);
        var l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', sx.toFixed(1)); l.setAttribute('y1', sy.toFixed(1));
        l.setAttribute('x2', ex.toFixed(1)); l.setAttribute('y2', ey.toFixed(1));
        l.setAttribute('class', 'constel__link');
        svg.appendChild(l);
      });
    }

    draw();
    window.addEventListener('resize', debounce(draw, 220), { passive: true });
    // the grid reflows after fonts load, so redraw once settled
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(draw, 120); });
  }

  /* ══ 9. SCAN PANEL + DEMO SCAN ════════════════════════════════════════ */

  function initScanPanel() {
    var panel = $('#scanPanel');
    if (!panel) return;
    var S = (C.project && C.project.scan) || {};
    var pct = S.percent || 87;
    var bar = $('#scanBar'), pctEl = $('#scanPct');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(panel);
        setTimeout(function () { bar.style.width = pct + '%'; }, 180);
        var t0 = null, dur = REDUCED ? 1 : 1300;
        (function tick(t) {
          if (t0 === null) t0 = t;
          var p = clamp((t - t0) / dur, 0, 1);
          pctEl.textContent = Math.round(pct * (1 - Math.pow(1 - p, 3))) + '%';
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: 0.25 });
    io.observe(panel);
  }

  var scanTimers = [];
  function openScan() {
    var m = $('#scanModal');
    m.hidden = false;
    document.body.classList.add('is-locked');
    if (window.Sfx) { Sfx.unlock(); Sfx.ui('click'); }
    runDemo();
    setTimeout(function () { $('#btnRerunScan').focus(); }, 60);
  }

  function closeScan() {
    $('#scanModal').hidden = true;
    document.body.classList.remove('is-locked');
    clearTimers();
  }

  function clearTimers() {
    scanTimers.forEach(clearTimeout);
    scanTimers = [];
  }

  function runDemo() {
    clearTimers();
    var out = $('#termOut');
    while (out.firstChild) out.removeChild(out.firstChild);
    var result = $('#scanResult');
    result.classList.remove('is-in');
    var scoreEl = $('#modalScore'), ring = $('#modalRing');
    var CIRC = 2 * Math.PI * 52;
    if (ring) { ring.style.strokeDasharray = CIRC; ring.style.strokeDashoffset = CIRC; }
    if (scoreEl) scoreEl.textContent = '0';

    var lines = (C.demoScan || []).slice();
    var stages = C.demoStages || [];
    var queue = [];

    // interleave the stage lines into the terminal output
    var out2 = [];
    for (var i = 0; i < lines.length; i++) out2.push(lines[i]);
    var insertAt = 1;
    stages.forEach(function (s) { out2.splice(insertAt++, 0, '  … ' + s); });

    var delay = 0;
    out2.forEach(function (line) {
      delay += REDUCED ? 12 : (line === '' ? 90 : 190 + Math.random() * 150);
      scanTimers.push(setTimeout(function () {
        var d = document.createElement('span');
        d.className = 'tline';
        if (/^\[\u2713\]/.test(line)) d.classList.add('ok');
        else if (/^\[!\]/.test(line)) d.classList.add('warn');
        else if (/^\[AI\]/.test(line)) d.classList.add('ai');
        else if (/^\$/.test(line)) d.classList.add('cmd');
        else if (/Health Score/.test(line)) d.classList.add('final');
        d.textContent = line || '\u00a0';
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
        if (window.Sfx && line && !/^  …/.test(line)) Sfx.ui('type');
      }, delay));
    });

    scanTimers.push(setTimeout(function () {
      result.classList.add('is-in');
      // on short screens the result sits below the terminal — bring it into view
      var rb = result.getBoundingClientRect();
      if (rb.top < 0 || rb.bottom > window.innerHeight) {
        result.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
      }
      var target = (C.project && C.project.healthScore) || 87;
      var t0 = null, dur = REDUCED ? 1 : 1200;
      (function tick(t) {
        if (t0 === null) t0 = t;
        var p = clamp((t - t0) / dur, 0, 1);
        var v = target * (1 - Math.pow(1 - p, 3));
        scoreEl.textContent = Math.round(v);
        ring.style.strokeDashoffset = CIRC * (1 - v / 100);
        if (p < 1) requestAnimationFrame(tick);
        else { scoreEl.textContent = target; ring.style.strokeDashoffset = CIRC * (1 - target / 100); }
      })(performance.now());
      if (window.Sfx) Sfx.complete();
    }, delay + 420));
  }

  function initScanModal() {
    $('#btnDemo').addEventListener('click', openScan);
    $('#btnRerunScan').addEventListener('click', runDemo);
    $$('#scanModal [data-close]').forEach(function (el) {
      el.addEventListener('click', closeScan);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#scanModal').hidden) closeScan();
    });
  }

  /* ══ 10. PRESENTATION MODE ════════════════════════════════════════════ */

  var presenting = false;
  function enterPresent() {
    presenting = true;
    document.body.classList.add('is-presenting');
    $('#presentHud').hidden = false;
    var el = document.documentElement;
    var rq = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (rq) { try { rq.call(el); } catch (e) {} }
    setTimeout(function () { go(active, { force: true }); }, 120);
    if (window.Sfx) Sfx.ui('click');
  }

  function exitPresent() {
    presenting = false;
    document.body.classList.remove('is-presenting');
    $('#presentHud').hidden = true;
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
    if (window.Sfx) Sfx.ui('click');
  }

  function togglePresent() { presenting ? exitPresent() : enterPresent(); }

  function initPresent() {
    $('#btnPresent').addEventListener('click', enterPresent);
    $('#btnExitPresent').addEventListener('click', exitPresent);
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && presenting) {
        presenting = false;
        document.body.classList.remove('is-presenting');
        $('#presentHud').hidden = true;
      }
    });
  }

  /* ══ 11. MICRO-INTERACTIONS ═══════════════════════════════════════════ */

  function initCursorGlow() {
    var g = $('#cursor-glow');
    if (!g || REDUCED) return;
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; g.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', function () { g.classList.remove('is-on'); });
    (function loop() {
      x = lerp(x, tx, 0.12); y = lerp(y, ty, 0.12);
      g.style.transform = 'translate3d(' + (x - 260) + 'px,' + (y - 260) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  function initMagnet() {
    if (REDUCED) return;
    $$('.magnet').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.setProperty('--mgx', (dx * 7).toFixed(2) + 'px');
        el.style.setProperty('--mgy', (dy * 6).toFixed(2) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--mgx');
        el.style.removeProperty('--mgy');
      });
    });
  }

  function initTilt() {
    if (REDUCED) return;
    $$('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.setProperty('--rx', (dx * 4.5).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (-dy * 4.5).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      });
    });
  }

  function initHoverSfx() {
    if (!C.sound || !C.sound.ui || C.sound.ui.hover === false) return;
    var last = 0;
    document.addEventListener('pointerover', function (e) {
      if (!e.target.closest('button, a, .rail__item, .node, .eco__nodes li, .map__nodes li, .fcard')) return;
      var now = performance.now();
      if (now - last < 90) return;
      last = now;
      if (window.Sfx) Sfx.ui('hover');
    }, { passive: true });
  }

  function initSoundToggle() {
    var b = $('#btnSound');
    function sync() {
      var on = window.Sfx ? Sfx.enabled : false;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-off', !on);
      b.title = on ? 'Interface sound: on' : 'Interface sound: off';
    }
    b.addEventListener('click', function () {
      if (window.Sfx) { Sfx.unlock(); Sfx.toggle(); }
      sync();
    });
    sync();
  }

  function unlockAudioOnFirstGesture() {
    var once = function () {
      if (window.Sfx) Sfx.unlock();
      window.removeEventListener('pointerdown', once);
      window.removeEventListener('keydown', once);
    };
    window.addEventListener('pointerdown', once);
    window.addEventListener('keydown', once);
  }

  /* ══ 12. CERTIFICATE LAZY LOAD ═══════════════════════════════════════ */

  function initCert() {
    var img = $('#certImg');
    if (!img) return;
    var src = img.getAttribute('data-src');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(img);
        var pre = new Image();
        pre.onload = function () { img.src = src; img.classList.add('is-loaded'); };
        pre.src = src;
      });
    }, { rootMargin: '400px' });
    io.observe(img);
  }

  /* ══ 13. DOWNLOAD (self-contained export) ═══════════════════════════ */

  function initDownload() {
    var btns = [$('#btnDownload'), $('#btnDownload2')].filter(Boolean);
    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.Sfx) Sfx.ui('click');
        exportStandalone().catch(function () { toast('Export failed — use your browser\u2019s Save Page As instead.'); });
      });
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.text(); });
  }
  function fetchDataURI(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.blob(); })
      .then(function (blob) {
        return new Promise(function (res, rej) {
          var fr = new FileReader();
          fr.onload = function () { res(fr.result); };
          fr.onerror = rej;
          fr.readAsDataURL(blob);
        });
      });
  }

  // Replacement must be a function: the asset data-URIs and the inlined sources
  // contain `$$` / `$'` sequences that String.replace would otherwise expand.
  function sub(html, needle, value) {
    return html.split(needle).join(value);
  }

  function exportStandalone() {
    toast('Packaging presentation…');
    var assets = [
      'assets/brand/cw-emblem-light.png',
      'assets/brand/cw-logo-light.png',
      'assets/brand/certificate-blur.jpg',
      'assets/brand/certificate.jpg',
      'assets/brand/favicon.png',
    ];
    return Promise.all([
      fetchText('index.html'), fetchText('styles.css'), fetchText('content.js'),
      fetchText('audio.js'), fetchText('app.js'),
      Promise.all(assets.map(function (a) { return fetchDataURI(a); })),
    ]).then(function (res) {
      var html = res[0], css = res[1], content = res[2], audio = res[3], app = res[4], data = res[5];
      assets.forEach(function (a, i) { html = sub(html, a, data[i]); });

      html = sub(html, '<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>');
      html = sub(html, '<script src="content.js"><\/script>', '<script>\n' + content + '\n<\/script>');
      html = sub(html, '<script src="audio.js"><\/script>', '<script>\n' + audio + '\n<\/script>');
      html = sub(html, '<script src="app.js"><\/script>', '<script>\n' + app + '\n<\/script>');

      // drop the font/icon network hints so the file opens cleanly offline
      html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
      html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>\n?/g, '');
      html = html.replace(/<link rel="icon"[^>]*>\n?/g, '');

      var blob = new Blob([html], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Auto-Health-Checker-Presentation.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast('Saved: Auto-Health-Checker-Presentation.html');
    });
  }

  var toastT = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }

  /* ══ 14. MISC ════════════════════════════════════════════════════════ */

  function debounce(fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  }

  function initPlaceholders() {
    // keep placeholder text in sync with content.js
    $$('[data-ph]').forEach(function (el) {
      var k = el.getAttribute('data-ph');
      var v = (C.internship && C.internship[k.toLowerCase().replace('internship_', '')]) ||
              (C.internship && C.internship[k]);
      if (v) el.textContent = v;
    });
  }

  /* ══ INIT ════════════════════════════════════════════════════════════ */

  function init() {
    DECK = $('#deck');
    SLIDES = $$('.slide');
    rail = $('#rail'); railList = $('#railList');
    readbar = $('#readbar'); hudLabel = $('#hudLabel'); hudCount = $('#hudCount');

    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    window.addEventListener('resize', debounce(function () {
      document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }, 200), { passive: true });

    buildRail();
    initReveal();
    initCounters();
    initNav();
    initArch();
    initArchReveal();
    initEco();
    initMap();
    initConstel();
    initScanPanel();
    initScanModal();
    initPresent();
    initCert();
    initDownload();
    initPlaceholders();
    initCursorGlow();
    initMagnet();
    initTilt();
    initSoundToggle();
    unlockAudioOnFirstGesture();
    if (window.Sfx && C.sound && C.sound.ui && C.sound.ui.hover) initHoverSfx();

    BackgroundFX();
    Globe();

    active = 0;
    updateNav(0);
    boot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
