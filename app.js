(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Google Drive image frames ---------- */
  const driveId = (u) => { const m = String(u || '').match(/\/d\/([\w-]+)|[?&]id=([\w-]+)/); return m ? (m[1] || m[2]) : null; };
  const frame = (key, cls = '') =>
    `<figure class="frame ${cls}" data-img="${key}"><span class="ph"><i>Image frame</i><b>${key}</b></span></figure>`;

  /* ---------- render content ---------- */
  const chips = (a) => `<div class="chips">${a.map((x) => `<span>${x}</span>`).join('')}</div>`;
  $('#roles-track').innerHTML = D.roles.map((r, n) =>
    `<article class="card c${n % 4}">${frame(r.img)}<div class="body"><span class="date">${r.dates}</span><h3>${r.title}</h3><p class="org">${r.org}</p><ul>${r.points.map((p) => `<li>${p}</li>`).join('')}</ul></div></article>`).join('');
  const rich = (list, label, n0) => list.map((t, n) =>
    `<article class="card wide c${(n + n0) % 4}">${frame(t.img)}<div class="body"><span class="tag">${t[label]}</span><h3>${t.title}</h3><p class="d">${t.desc}</p>${chips(t.stack)}</div></article>`).join('');
  $('#tools-track').innerHTML = rich(D.tools, 'tag', 0);
  $('#projects-track').innerHTML = rich(D.projects.map((p) => ({ ...p, tag: p.year })), 'tag', 1);
  $('#toolkit').innerHTML = D.toolkit.map((x) => `<span>${x}</span>`).join('');
  $('#cap-grid').innerHTML = D.capabilities.map((c, i) => `<div class="tile" style="--i:${i}"><b>${c.t}</b><small>${c.d}</small></div>`).join('');
  $('#edu').innerHTML = D.education.map((e, i) =>
    `<div class="edu fly" style="--i:${i + 1}"><span class="dt">${e.d}</span><h3>${e.t}</h3><div class="s">${e.s}</div><p>${e.n}</p></div>`).join('');
  $('#certs').innerHTML = D.certs.map((c) => `<li><div>${c[0]}<span>${c[1]}</span></div><b>${c[2]}</b></li>`).join('');
  $('#c-mail').href = 'mailto:' + D.email;
  $('#c-in').href = D.linkedin;
  if (D.resume) $('#c-cv').href = D.resume; else $('#c-cv').style.display = 'none';

  /* hydrate image frames */
  $$('.frame').forEach((f) => {
    const u = (D.images || {})[f.dataset.img];
    if (!u) return;
    const id = driveId(u);
    const im = new Image();
    im.alt = f.dataset.img.replace(/-/g, ' ');
    im.referrerPolicy = 'no-referrer';
    im.onload = () => f.classList.add('has');
    im.onerror = () => {
      if (id && !im.dataset.fb) { im.dataset.fb = 1; im.src = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`; }
      else im.remove();
    };
    im.src = id ? `https://lh3.googleusercontent.com/d/${id}=w1600` : u;
    f.appendChild(im);
  });

  /* ---------- sections, nav, roaming shapes ---------- */
  const panels = $$('.panel');
  const N = panels.length;
  let cur = 0, lock = false;
  $('#tot').textContent = String(N).padStart(2, '0');

  $('#nav').innerHTML = panels.map((p, i) => `<button data-go="${i}">${p.dataset.title}</button>`).join('');
  $('#dots').innerHTML = panels.map((p, i) => `<i data-go="${i}" title="${p.dataset.title}"></i>`).join('');

  // x,y (vw/vh) + rotation for shapes a..e on each section
  const P = [
    [[62,-8,0],[-5,70,0],[88,62,0],[48,86,20],[30,12,0]],
    [[-12,40,0],[80,-6,0],[40,88,0],[92,30,45],[6,12,0]],
    [[70,50,0],[10,78,0],[-6,-8,0],[55,8,30],[94,86,0]],
    [[20,-18,0],[88,70,0],[60,80,0],[6,50,60],[75,8,0]],
    [[75,-14,0],[-4,30,0],[30,84,0],[94,50,15],[50,6,0]],
    [[-10,60,0],[60,-4,0],[86,74,0],[25,10,70],[10,90,0]],
    [[30,30,0],[80,10,0],[-6,70,0],[70,88,45],[92,40,0]]
  ];
  const shapes = $$('.sh');
  const place = (i) => (P[i] || P[0]).forEach((p, k) => {
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
  // Is there an inner scroller that should consume this gesture first?
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
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); go(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(N - 1);
  });

  let tx, ty, tt;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = e.target; }, { passive: true });
  addEventListener('touchend', (e) => {
    const dx = tx - e.changedTouches[0].clientX, dy = ty - e.changedTouches[0].clientY;
    const horiz = Math.abs(dx) > Math.abs(dy);
    const d = horiz ? dx : dy;
    if (Math.abs(d) < 60) return;
    if (horiz && tt.closest && tt.closest('.hscroll')) return; // native sideways scroll
    if (!horiz && inner(tt, Math.sign(d))) return;
    go(cur + Math.sign(d));
  }, { passive: true });

  /* ---------- rails: drag-to-scroll + progress ---------- */
  $$('.hscroll').forEach((r) => {
    const bar = r.parentElement.querySelector('.prog span');
    const upd = () => { const m = r.scrollWidth - r.clientWidth; bar.style.width = (m > 0 ? Math.max(8, 100 * (r.scrollLeft / m)) : 100) + '%'; };
    r.addEventListener('scroll', upd, { passive: true }); upd(); addEventListener('resize', upd);
    let down = false, sx = 0, sl = 0;
    r.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = r.scrollLeft; r.classList.add('drag'); });
    addEventListener('pointermove', (e) => { if (down) r.scrollLeft = sl - (e.clientX - sx); });
    addEventListener('pointerup', () => { down = false; r.classList.remove('drag'); });
  });

  /* ---------- boot ---------- */
  const start = Math.max(0, panels.findIndex((p) => '#' + p.id === location.hash));
  panels.forEach((p, i) => p.classList.add(i > start ? 'after' : 'before'));
  place(start);
  requestAnimationFrame(() => requestAnimationFrame(() => { cur = -1; go(start, true); }));
})();
