(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const chips = (a) => `<div class="chips">${a.map((x) => `<span>${x}</span>`).join('')}</div>`;

  /* ---------- images: auto-detect /images/<id>-1.ext, -2, -3 ... ---------- */
  const DIR = D.imageDir || 'images/';
  const EXTS = D.imageExts || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif'];
  const MAXIMG = D.imageMax || 12;
  const probe = (url) => new Promise((res) => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = url; });
  const ALLEXTS = EXTS.concat(EXTS.map((e) => e.toUpperCase()));
  async function findImage(name) {
    const hits = await Promise.all(ALLEXTS.map((e) => probe(DIR + name + '.' + e)));
    const i = hits.indexOf(true);
    return i < 0 ? null : DIR + name + '.' + ALLEXTS[i];
  }
  // tolerates up to 2 missing numbers in a row (e.g. -1, -3, -4 still works)
  async function loadImages(id) {
    const out = [];
    let miss = 0;
    for (let n = 1; n <= MAXIMG && miss < 3; n++) {
      const u = await findImage(id + '-' + n);
      if (u) { out.push(u); miss = 0; } else miss++;
    }
    return out;
  }

  /* ---------- content ---------- */
  const WCOL = ['#f7c948', '#b79be0', '#f6a56b'];
  const roles = D.roles.map((r) => ({
    id: r.id, color: r.color, meta: r.dates, title: r.title, sub: r.org,
    list: r.points, listLabel: 'Achievements', chips: r.skills || [], chipsLabel: 'Skills', tags: r.tags || [], imgs: []
  }));
  const work = D.work.map((w, n) => ({
    id: w.id, kind: w.kind, color: WCOL[n % 3], meta: w.kind + ' · ' + w.tag, title: w.title,
    desc: w.desc, chips: w.stack || [], chipsLabel: 'Built with', tags: w.stack || [], imgs: []
  }));
  const SEC = {
    roles: { all: roles, shown: roles, track: $('#roles-track') },
    work: { all: work, shown: work, track: $('#work-track') }
  };

  function renderRail(sec) {
    const S = SEC[sec];
    S.track.innerHTML = S.shown.map((it, i) =>
      `<button class="card" data-i="${i}" style="--c:${it.color}"><span class="date">${it.meta}</span><h3>${it.title}</h3>` +
      (it.sub ? `<p class="org">${it.sub}</p>` : '') + (it.desc ? `<p class="d">${it.desc}</p>` : '') +
      chips(it.tags) + `<span class="more">View details →</span></button>`).join('');
  }
  renderRail('roles'); renderRail('work');

  $('#toolkit').innerHTML = D.toolkit.map((x) => `<span>${x}</span>`).join('');
  $('#cap-grid').innerHTML = D.capabilities.map((c, i) => `<div class="tile" style="--i:${i}"><b>${c.t}</b><small>${c.d}</small></div>`).join('');
  $('#edu').innerHTML = D.education.map((e, i) =>
    `<div class="edu fly" style="--i:${i + 1}"><span class="dt">${e.d}</span><h3>${e.t}</h3><div class="s">${e.s}</div><p>${e.n}</p></div>`).join('');
  $('#certs').innerHTML = D.certs.map((c) => `<li><div>${c[0]}<span>${c[1]}</span></div><b>${c[2]}</b></li>`).join('');
  $('#c-mail').href = 'mailto:' + D.email;
  $('#c-in').href = D.linkedin;
  if (D.resume) $('#c-cv').href = D.resume; else $('#c-cv').style.display = 'none';

  /* cover photos: images/profile-1.ext and images/hero-accent-1.ext */
  $$('.frame[data-img]').forEach(async (f) => {
    const u = await findImage(f.dataset.img + '-1');
    if (!u) return;
    const im = new Image(); im.alt = ''; im.src = u; f.appendChild(im);
  });

  /* ---------- floating images behind the rails ---------- */
  // [left vw, top vh, size vmin]. Ordered so any first N slots are spread out.
  const SLOTS = [[68, 9, 10], [3, 79, 11], [40, 81, 10], [91, 22, 8], [75, 80, 11], [1, 52, 8], [22, 85, 7], [46, 11, 8], [58, 87, 7], [90, 70, 9]];
  function floaters(sec) {
    const box = $(`[data-float="${sec}"]`);
    const items = SEC[sec].all.filter((x) => x.imgs.length);
    const pool = [];
    for (let j = 0; j < MAXIMG; j++) items.forEach((it) => { if (it.imgs[j]) pool.push({ u: it.imgs[j], c: it.color }); });
    pool.slice(0, SLOTS.length).forEach((p, k) => {
      const s = SLOTS[k];
      const d = document.createElement('div');
      d.className = 'fl';
      d.style.cssText = `left:${s[0]}vw;top:${s[1]}vh;--s:${s[2]}vmin;--c:${p.c};--d:${5 + (k % 4) * 1.3}s;--dl:-${k * 0.9}s`;
      d.innerHTML = '<i class="bgc"></i>';
      const im = new Image(); im.alt = '';
      im.onload = () => { d.appendChild(im); d.classList.add('on'); };
      im.src = p.u;
      box.appendChild(d);
    });
  }
  const ready = Promise.all([...roles, ...work].map(async (it) => { it.imgs = await loadImages(it.id); }));
  ready.then(() => { floaters('roles'); floaters('work'); });

  /* ---------- detail pop-up ---------- */
  const veil = $('#veil'), modal = $('#modal'), lb = $('#lb');
  const PAL = ['#5d3a99', '#f7c948', '#ee7c34', '#e5604d', '#b79be0', '#f6a56b'];
  const W_SEQ = [1, .74, .92, .68, .86, .7];
  let P = { sec: 'roles', i: 0 };
  const popOpen = () => veil.classList.contains('on');

  const textHTML = (it) =>
    `<span class="date">${it.meta}</span><h2>${it.title}</h2>` +
    (it.sub ? `<p class="org">${it.sub}</p>` : '') +
    (it.desc ? `<p class="pdesc">${it.desc}</p>` : '') +
    (it.list && it.list.length ? `<h4>${it.listLabel}</h4><ul>${it.list.map((a) => `<li>${a}</li>`).join('')}</ul>` : '') +
    (it.chips.length ? `<h4>${it.chipsLabel}</h4>${chips(it.chips)}` : '');

  function build() {
    const list = SEC[P.sec].shown, it = list[P.i], IM = it.imgs, n = IM.length;
    const nav = list.length > 1
      ? `<div class="rnav"><button id="rp" aria-label="Previous">←</button><b>${P.i + 1} / ${list.length}</b><button id="rn" aria-label="Next">→</button></div>` : '';
    const vw = innerWidth, vh = innerHeight;
    if (!n) {
      modal.style.width = Math.min(560, vw - 24) + 'px'; modal.style.height = '';
      modal.innerHTML = `<div class="text solo">${textHTML(it)}</div>${nav}<button class="x" id="close" aria-label="Close">✕</button>`;
    } else {
      const narrow = vw < 700;
      const Wmax = Math.min(980, vw - 24), Hmax = Math.min(580, vh * .9), Wc = Wmax * (narrow ? .5 : .46);
      const w = [], f = [];
      for (let i = 0; i < n; i++) { w.push(W_SEQ[i % 6]); f.push(i === 0 || i === n - 1 ? 0 : [.34, .08][(i - 1) % 2]); }
      const h = w.map((x, i) => x * Math.sqrt(1 - f[i] * f[i])), yc = [w[0]];
      let y = w[0];
      for (let i = 0; i < n - 1; i++) { y += h[i] + h[i + 1] - .34 * Math.min(h[i], h[i + 1]); yc.push(y); }
      const T = yc[n - 1] + w[n - 1];
      const M = Math.max(...w.map((x, i) => x * (1 - f[i]))), Pm = Math.max(...w.map((x, i) => x * (1 + f[i])));
      const ov = 18, s = Math.min(Hmax / (T + .1), (Wmax - Wc + ov) / (M + Pm + .1));
      const xs = Wc - ov + M * s, Wt = Wc - ov + (M + Pm + .1) * s, Ht = T * s;
      modal.style.width = Wt + 'px'; modal.style.height = Ht + 'px';
      let pics = '';
      for (let i = 0; i < n; i++) {
        const R = s * w[i], cx = xs + f[i] * R, cy = yc[i] * s, rb = R, rp = R * .97, o = .09 * R;
        pics += `<div class="pic bg" style="background:${PAL[i % 6]};left:${cx + o - rb}px;top:${cy + o - rb}px;width:${2 * rb}px;height:${2 * rb}px"></div>` +
          `<button class="pic ph" data-i="${i}" aria-label="Open image ${i + 1}" style="left:${cx - rp}px;top:${cy - rp}px;width:${2 * rp}px;height:${2 * rp}px"><img src="${IM[i]}" alt=""></button>`;
      }
      modal.innerHTML = `<div class="pbox" style="width:${Wc}px;height:${Ht}px"></div>${pics}<div class="text" style="width:${Wc}px">${textHTML(it)}</div>${nav}<button class="x" id="close" aria-label="Close">✕</button>`;
      $$('.ph', modal).forEach((b) => {
        b.onclick = () => { lb.innerHTML = `<img src="${IM[+b.dataset.i]}" alt="">`; lb.classList.add('on'); };
      });
    }
    $('#close').onclick = closePop;
    if ($('#rp')) { $('#rp').onclick = () => goPop(-1); $('#rn').onclick = () => goPop(1); }
  }
  function goPop(d) {
    const len = SEC[P.sec].shown.length;
    P.i = (P.i + d + len) % len;
    build();
    modal.animate([{ opacity: 0, transform: `translateX(${d * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function openPop(sec, i) { ready.then(() => { P = { sec, i }; build(); veil.classList.add('on'); }); }
  function closePop() { veil.classList.remove('on'); }
  veil.onclick = (e) => { if (e.target === veil) closePop(); };
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('resize', () => popOpen() && build());
  let tx0 = null;
  modal.addEventListener('touchstart', (e) => { tx0 = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    if (tx0 === null) return;
    const d = e.changedTouches[0].clientX - tx0; tx0 = null;
    if (Math.abs(d) > 60) goPop(d < 0 ? 1 : -1);
  }, { passive: true });
  let wl = 0;
  modal.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30 && Date.now() - wl > 500) { wl = Date.now(); goPop(e.deltaX > 0 ? 1 : -1); }
  }, { passive: true });

  /* ---------- filter (Projects & tools) ---------- */
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach((x) => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    SEC.work.shown = f === 'all' ? SEC.work.all : SEC.work.all.filter((x) => x.kind === f);
    renderRail('work');
    SEC.work.track.scrollLeft = 0;
    SEC.work.track.dispatchEvent(new Event('scroll'));
  });

  /* ---------- sections, nav, roaming shapes ---------- */
  const panels = $$('.panel');
  const N = panels.length;
  let cur = 0, lock = false;
  $('#tot').textContent = String(N).padStart(2, '0');

  $('#nav').innerHTML = panels.map((p, i) => `<button data-go="${i}">${p.dataset.title}</button>`).join('');
  $('#dots').innerHTML = panels.map((p, i) => `<i data-go="${i}" title="${p.dataset.title}"></i>`).join('');

  // x,y (vw/vh) + rotation for shapes a..e on each section
  const PS = [
    [[62,-8,0],[-5,70,0],[88,62,0],[48,86,20],[30,12,0]],
    [[-12,40,0],[80,-6,0],[40,88,0],[92,30,45],[6,12,0]],
    [[70,50,0],[10,78,0],[-6,-8,0],[55,8,30],[94,86,0]],
    [[20,-18,0],[88,70,0],[60,80,0],[6,50,60],[75,8,0]],
    [[75,-14,0],[-4,30,0],[30,84,0],[94,50,15],[50,6,0]],
    [[-10,60,0],[60,-4,0],[86,74,0],[25,10,70],[10,90,0]]
  ];
  const shapes = $$('.sh');
  const place = (i) => (PS[i] || PS[0]).forEach((p, k) => {
    shapes[k].style.transform = `translate(${p[0]}vw,${p[1]}vh) rotate(${p[2]}deg)`;
  });

  function go(n, force) {
    n = Math.max(0, Math.min(N - 1, n));
    if ((n === cur && !force) || lock) return;
    lock = true; setTimeout(() => (lock = false), 850);
    panels.forEach((p, i) => {
      p.classList.toggle('on', i === n);
      p.classList.toggle('before', i < n);
      p.classList.toggle('after', i > n);
    });
    cur = n;
    $$('#nav button').forEach((b, i) => b.classList.toggle('on', i === n));
    $$('#dots i').forEach((b, i) => b.classList.toggle('on', i === n));
    $('#cur').textContent = String(n + 1).padStart(2, '0');
    panels[n].scrollTop = 0;
    place(n);
    history.replaceState(null, '', '#' + panels[n].id);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go]');
    if (t) { e.preventDefault(); go(+t.dataset.go); }
  });
  $('#prev').onclick = () => go(cur - 1);
  $('#next').onclick = () => go(cur + 1);

  /* ---------- input: wheel, keys, touch ---------- */
  function inner(el, dir) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('hscroll')) {
        const max = el.scrollWidth - el.clientWidth;
        if ((dir > 0 && el.scrollLeft < max - 2) || (dir < 0 && el.scrollLeft > 2)) return { el, h: true };
      }
      if (el.classList && el.classList.contains('panel')) {
        const max = el.scrollHeight - el.clientHeight;
        if ((dir > 0 && el.scrollTop < max - 2) || (dir < 0 && el.scrollTop > 2)) return { el, h: false };
        break;
      }
      el = el.parentElement;
    }
    return null;
  }

  let acc = 0, accT;
  addEventListener('wheel', (e) => {
    if (popOpen()) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!d) return;
    const hit = inner(e.target, Math.sign(d));
    if (hit) { if (hit.h) { e.preventDefault(); hit.el.scrollLeft += d; } return; }
    e.preventDefault();
    acc += d; clearTimeout(accT); accT = setTimeout(() => (acc = 0), 160);
    if (Math.abs(acc) > 60) { go(cur + Math.sign(acc)); acc = 0; }
  }, { passive: false });

  addEventListener('keydown', (e) => {
    const k = e.key;
    if (popOpen()) {
      if (lb.classList.contains('on')) { if (k === 'Escape') lb.classList.remove('on'); return; }
      if (k === 'Escape') closePop();
      else if (k === 'ArrowRight') { e.preventDefault(); goPop(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); goPop(-1); }
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); go(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(N - 1);
  });

  let tx, ty, tt;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = e.target; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (popOpen()) return;
    const dx = tx - e.changedTouches[0].clientX, dy = ty - e.changedTouches[0].clientY;
    const horiz = Math.abs(dx) > Math.abs(dy);
    const d = horiz ? dx : dy;
    if (Math.abs(d) < 60) return;
    if (horiz && tt.closest && tt.closest('.hscroll')) return; // native sideways scroll
    if (!horiz && inner(tt, Math.sign(d))) return;
    go(cur + Math.sign(d));
  }, { passive: true });

  /* ---------- rails: arrows, drag-to-scroll, progress, card clicks ---------- */
  let moved = false;
  $$('.hscroll').forEach((r) => {
    const panel = r.closest('.panel');
    const bar = r.parentElement.querySelector('.prog span');
    const prev = $(`.arrows button[data-rail="${r.id}"][data-dir="-1"]`, panel);
    const next = $(`.arrows button[data-rail="${r.id}"][data-dir="1"]`, panel);
    const upd = () => {
      const m = r.scrollWidth - r.clientWidth;
      bar.style.width = (m > 0 ? Math.max(8, 100 * (r.scrollLeft / m)) : 100) + '%';
      if (prev) prev.disabled = r.scrollLeft < 4;
      if (next) next.disabled = r.scrollLeft > m - 4;
    };
    r.addEventListener('scroll', upd, { passive: true }); upd(); addEventListener('resize', upd);
    if (prev) prev.onclick = () => r.scrollBy({ left: -r.clientWidth * .6, behavior: 'smooth' });
    if (next) next.onclick = () => r.scrollBy({ left: r.clientWidth * .6, behavior: 'smooth' });
    let down = false, sx = 0, sl = 0;
    r.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; r.classList.add('drag'); });
    addEventListener('pointermove', (e) => { if (down) { const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; r.scrollLeft = sl - d; } });
    addEventListener('pointerup', () => { down = false; r.classList.remove('drag'); setTimeout(() => (moved = false), 0); });
    r.addEventListener('click', (e) => {
      const c = e.target.closest('.card');
      if (c && !moved) openPop(r.dataset.sec, +c.dataset.i);
    });
  });

  /* ---------- boot ---------- */
  const start = Math.max(0, panels.findIndex((p) => '#' + p.id === location.hash));
  panels.forEach((p, i) => p.classList.add(i > start ? 'after' : 'before'));
  place(start);
  requestAnimationFrame(() => requestAnimationFrame(() => { cur = -1; go(start, true); }));
})();
