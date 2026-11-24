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
  const slug = (t) => 'skill-' + t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const roles = D.roles.map((r) => ({
    sec: 'roles', id: r.id, color: r.color, meta: r.dates, title: r.title, sub: r.org, short: r.short || r.org,
    list: r.points, listLabel: 'Achievements', chips: r.skills || [], chipsLabel: 'Skills', tags: r.tags || [], imgs: []
  }));
  const work = D.work.map((w, n) => ({
    sec: 'work', id: w.id, kind: w.kind, color: WCOL[n % 3], meta: w.kind + ' · ' + w.tag, title: w.title,
    desc: w.desc, chips: w.stack || [], chipsLabel: 'Built with', tags: w.stack || [], imgs: [],
    roleIds: w.roles || [], under: w.under || [], workIds: []
  }));
  const caps = D.capabilities.map((c, n) => ({
    sec: 'skills', id: slug(c.t), color: WCOL[n % 3], meta: 'Capability', title: c.t, desc: c.d, chips: [], tags: [], imgs: [],
    roleIds: c.roles || [], workIds: c.work || [], under: c.under || [], isCap: true
  }));
  const tools = D.toolkit.map((c, n) => ({
    sec: 'skills', id: slug(c.t), color: WCOL[n % 3], meta: 'Tool / skill', title: c.t, chips: [], tags: [], imgs: [],
    roleIds: c.roles || [], workIds: c.work || [], under: c.under || []
  }));
  const skills = caps.concat(tools);
  const sites = (D.websites || []).map((s, n) => ({
    sec: 'sites', id: s.id, url: s.url, protect: s.protect, title: s.title, desc: s.desc, color: WCOL[n % 3], tags: s.tags || [],
    roleIds: s.roles || [], workIds: s.work || []
  }));
  if (!sites.length) $('#websites').remove();

  const SEC = {
    roles: { all: roles, shown: roles, track: $('#roles-track') },
    work: { all: work, shown: work, track: $('#work-track') },
    skills: { all: skills, shown: skills }
  };
  const byId = (sec, id) => SEC[sec].all.find((x) => x.id === id);
  const pick = (sec, ids) => ids.map((i) => byId(sec, i)).filter(Boolean);

  // one clickable chip per linked item (websites open in a new tab, everything else opens its pop-up)
  const lc = (x) => x.protect
    ? `<a class="lnk" href="#" data-protect="${x.protect}">${x.title} ↓</a>`
    : x.url
    ? `<a class="lnk" href="${x.url}" target="_blank" rel="noopener">${x.title} ↗</a>`
    : `<button class="lnk" data-open="${x.sec}:${x.id}">${x.short || x.title}</button>`;
  const plain = (a) => a.map((p) => `<span>${p}</span>`).join('');

  // the cross-links between roles, projects/tools and skills
  function groups(it) {
    const g = [], add = (label, items, p = []) => { if (items.length || p.length) g.push({ label, items, p }); };
    if (it.sec === 'roles') {
      add('Tools & projects built here', work.filter((w) => w.roleIds.includes(it.id)));
      add('Capabilities & skills it feeds', skills.filter((x) => x.roleIds.includes(it.id)));
      add('Websites', sites.filter((x) => x.roleIds.includes(it.id)));
    } else if (it.sec === 'work') {
      add('Built under', pick('roles', it.roleIds), it.under);
      add('Capabilities & skills used', skills.filter((x) => x.workIds.includes(it.id)));
      add('Websites', sites.filter((x) => x.workIds.includes(it.id)));
    } else if (it.sec === 'skills') {
      add('Derived from roles', pick('roles', it.roleIds), it.under);
      add('Seen in projects & tools', pick('work', it.workIds));
    }
    return g;
  }

  function renderRail(sec) {
    const S = SEC[sec];
    S.track.innerHTML = S.shown.map((it, i) => {
      const via = it.sec === 'work' && (it.roleIds.length || it.under.length)
        ? `<p class="via">↳ ${pick('roles', it.roleIds).map((r) => r.short).concat(it.under).join(' · ')}</p>` : '';
      return `<button class="card" data-i="${i}" style="--c:${it.color}"><span class="date">${it.meta}</span><h3>${it.title}</h3>` +
        (it.sub ? `<p class="org">${it.sub}</p>` : '') + (it.desc ? `<p class="d">${it.desc}</p>` : '') + via +
        chips(it.tags) + `<span class="more">View details →</span></button>`;
    }).join('');
  }
  renderRail('roles'); renderRail('work');

  if (sites.length) {
    const THUMB = (u) => 'https://image.thum.io/get/width/700/crop/440/noanimate/' + u;
    $('#sites-track').innerHTML = sites.map((s) =>
      `<a class="card site" href="${s.protect ? '#' : s.url}" ${s.protect ? `data-protect="${s.protect}"` : 'target="_blank" rel="noopener"'} style="--c:${s.color}">` +
      `<div class="thumb"><span class="tl">${s.title}</span>${s.protect ? '' : `<img alt="" loading="lazy" data-id="${s.id}" src="${THUMB(s.url)}">`}</div>` +
      `<h3>${s.title}</h3>${s.desc ? `<p class="d">${s.desc}</p>` : ''}` +
      (s.roleIds.length ? `<p class="via">↳ ${pick('roles', s.roleIds).map((r) => r.short).join(' · ')}</p>` : '') +
      chips(s.tags) + `<span class="more">${s.protect ? 'Request download ↓' : 'Visit site ↗'}</span></a>`).join('');
    $$('#sites-track .card').forEach(async (card, k) => {
      const s = sites[k], im = $('.thumb img', card);
      if (im) im.onerror = () => im.remove();
      const u = await findImage('site-' + s.id.replace(/^site-/, '') + '-1');
      if (!u) return;
      if (im) im.src = u;
      else { const n = new Image(); n.alt = ''; n.src = u; $('.thumb', card).appendChild(n); }
    });
  }

  $('#toolkit').innerHTML = tools.map(lc).join('');
  $('#cap-grid').innerHTML = caps.map((c, i) =>
    `<div class="tile" data-open="skills:${c.id}" style="--i:${i}"><b>${c.title}</b><small>${c.desc}</small>` +
    ((c.roleIds.length || c.under.length) ? `<div class="chips from"><em>From</em>${pick('roles', c.roleIds).map(lc).join('')}${plain(c.under)}</div>` : '') + `</div>`).join('');
  $('#edu').innerHTML = D.education.map((e, i) =>
    `<div class="blk edu fly" style="--i:${i + 1}">${e.img ? `<div class="edu-img"><img src="images/${e.img}" alt="${e.s}" loading="lazy" onerror="this.parentNode.remove()"></div>` : ''}<span class="dt">${e.d}</span><h3>${e.t}</h3><div class="s">${e.s}</div><p>${e.n}</p></div>`).join('');
  $('#certs').innerHTML = D.certs.map((c, i) =>
    `<div class="blk cert fly" style="--i:${i + 3}"><span class="dt">${c[1]}</span><h3>${c[0]}</h3>${c[2] ? `<b>${c[2]}</b>` : ''}</div>`).join('');
  $('#c-mail').href = 'mailto:' + D.email;
  $('#c-in').href = D.linkedin;
  if (D.resume) { $('#c-cv').href = '#'; $('#c-cv').removeAttribute('target'); $('#c-cv').dataset.protect = 'resume'; } else $('#c-cv').style.display = 'none';
  if (D.hero && D.hero.now) $('#now').innerHTML = `<small>${D.hero.now[0]}</small><b>${D.hero.now[1]}</b><span>${D.hero.now[2]}</span>`;

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
  let P = { sec: 'roles', i: 0, list: roles };
  const gateOn = () => { const g = document.getElementById('gate'); return !!g && g.classList.contains('on'); };
  const popOpen = () => veil.classList.contains('on') || gateOn();

  const textHTML = (it) =>
    `<span class="date">${it.meta}</span><h2>${it.title}</h2>` +
    (it.sub ? `<p class="org">${it.sub}</p>` : '') +
    (it.desc ? `<p class="pdesc">${it.desc}</p>` : '') +
    (it.list && it.list.length ? `<h4>${it.listLabel}</h4><ul>${it.list.map((a) => `<li>${a}</li>`).join('')}</ul>` : '') +
    (it.chips.length ? `<h4>${it.chipsLabel}</h4>${chips(it.chips)}` : '') +
    groups(it).map((g) => `<h4>${g.label}</h4><div class="chips">${g.items.map(lc).join('')}${plain(g.p)}</div>`).join('');

  function build() {
    const list = P.list, it = list[P.i], IM = it.imgs, n = IM.length;
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
    const len = P.list.length;
    P.i = (P.i + d + len) % len;
    build();
    modal.animate([{ opacity: 0, transform: `translateX(${d * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function openPop(sec, i, list) { ready.then(() => { P = { sec, i, list: list || SEC[sec].shown }; build(); veil.classList.add('on'); }); }
  function openId(sec, id) {
    const L = SEC[sec].all, i = L.findIndex((x) => x.id === id);
    if (i < 0) return;
    const was = popOpen();
    openPop(sec, i, L);
    if (was) ready.then(() => modal.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }));
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (!o) return;
    e.preventDefault();
    const k = o.dataset.open, c = k.indexOf(':');
    openId(k.slice(0, c), k.slice(c + 1));
  });
  function closePop() { veil.classList.remove('on'); }
  veil.onclick = (e) => { if (e.target === veil) closePop(); };
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('resize', () => veil.classList.contains('on') && build());
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

  /* ---------- protected downloads (résumé + studio file) ----------
     Résumé: name + email -> the file downloads at once.
     Studio: name + email -> I am emailed a personal code -> I reply with it -> the visitor unlocks the file.
     Every request is also saved to my private leads file (see /api). */
  const GATE = {
    resume: { label: 'Résumé', file: 'Gopika-Gopan-Resume.pdf', instant: true, btn: 'Download résumé',
      intro: 'Tell me who you are and the résumé downloads straight away.', purposeLabel: 'Role you’re hiring for (optional)' },
    studio: { label: 'Export Connect Post Studio', file: 'Export_Connect_Post_Studio.html', instant: false, btn: 'Request access',
      intro: 'This tool is shared by request. Tell me who you are and I’ll reply with a code that unlocks the download.', purposeLabel: 'What would you like to use it for? (optional)' }
  };
  const ss = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const gateEl = document.createElement('div');
  gateEl.className = 'gate'; gateEl.id = 'gate';
  document.body.appendChild(gateEl);
  let gateId = null;
  const gid = (x) => document.getElementById(x);
  function closeGate() { gateEl.classList.remove('on'); gateId = null; }
  gateEl.addEventListener('click', (e) => { if (e.target === gateEl || e.target.closest('[data-gate-close]')) closeGate(); });

  const gStatus = (t, k) => { const s = gid('gs'); if (s) { s.textContent = t; s.dataset.k = k || ''; } };
  const saveBlob = (blob, name) => {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const fallback = () => `Something went wrong. Please email me at ${D.email} and I’ll send it over.`;

  function gateFrame(id, inner) {
    const g = GATE[id]; gateId = id;
    gateEl.innerHTML = `<div class="gbox" role="dialog" aria-modal="true" aria-labelledby="g-t">
      <button class="gx" data-gate-close aria-label="Close">✕</button>
      <span class="date">${g.instant ? 'Instant download' : 'Shared by request'}</span>
      <h2 id="g-t">${g.label}</h2>${inner}</div>`;
    gateEl.classList.add('on');
  }

  /* step 1: who are you? */
  function showRequest(id) {
    const g = GATE[id];
    gateFrame(id, `<p class="gp">${g.intro}</p>
      <form class="gform" id="gform" autocomplete="on">
        <div class="fld"><label for="gname">Your name</label><input id="gname" name="name" required maxlength="100" autocomplete="name"></div>
        <div class="fld"><label for="gmail">Your email</label><input id="gmail" name="email" type="email" required maxlength="254" autocomplete="email"></div>
        <div class="fld"><label for="gorg">Organisation (optional)</label><input id="gorg" name="org" maxlength="200" autocomplete="organization"></div>
        <div class="fld"><label for="gpur">${g.purposeLabel}</label><input id="gpur" name="purpose" maxlength="500"></div>
        <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <button class="pill solid" id="gbtn" type="submit">${g.btn}</button>
        <p class="gs" id="gs" role="status"></p>
        <p class="gnote">I only use your details to reply to you and to keep a record of who has asked.</p>
        ${g.instant ? '' : '<button type="button" class="glink" id="ghave">I already have a code</button>'}
      </form>`);
    setTimeout(() => { const i = gid('gname'); if (i) i.focus(); }, 60);
    if (!g.instant) gid('ghave').onclick = () => showCode(id, gid('gmail').value, false);
    gid('gform').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target), btn = gid('gbtn'), email = String(fd.get('email') || '').trim();
      btn.disabled = true; gStatus('Sending…');
      try {
        const r = await post('/api/request-code', { file: id, name: fd.get('name'), email, org: fd.get('org'), purpose: fd.get('purpose'), website: fd.get('website') });
        if ((r.headers.get('content-type') || '').includes('application/json')) {
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.error || fallback());
          ss.set('gate-email', email);
          if (!g.instant) { showCode(id, email, true); return; }
          gStatus('Thanks!', 'ok');
        } else {
          if (!r.ok) throw new Error(fallback());
          saveBlob(await r.blob(), g.file);
          gStatus('Thanks! Your download has started.', 'ok');
        }
      } catch (err) { gStatus(err.message || fallback(), 'err'); }
      btn.disabled = false;
    };
  }

  /* step 2 (studio only): enter the code I sent back */
  function showCode(id, email, sent) {
    const g = GATE[id];
    gateFrame(id, `<p class="gp" id="gp"></p>
      <form class="gform" id="gform">
        <div class="fld"><label for="gmail2">Your email</label><input id="gmail2" type="email" required maxlength="254" autocomplete="email"></div>
        <div class="fld"><label for="gcode">Access code</label><input id="gcode" inputmode="numeric" autocomplete="one-time-code" maxlength="12" placeholder="0000 0000" required></div>
        <button class="pill solid" id="gbtn" type="submit">Unlock download</button>
        <p class="gs" id="gs" role="status"></p>
        <p class="gnote">No code yet? Email me at <a href="mailto:${D.email}?subject=${encodeURIComponent('Access code: ' + g.label)}">${D.email}</a>.</p>
        <button type="button" class="glink" id="gback">Back to the request form</button>
      </form>`);
    gid('gp').textContent = sent
      ? 'Request sent. I’ll reply to that address with your code. You can close this window and come back with “I already have a code”.'
      : 'Enter the email you used for your request and the code I sent you.';
    gid('gmail2').value = email || ss.get('gate-email') || '';
    setTimeout(() => { const i = gid('gcode'); if (i) i.focus(); }, 60);
    gid('gback').onclick = () => showRequest(id);
    gid('gform').onsubmit = async (e) => {
      e.preventDefault();
      const btn = gid('gbtn');
      btn.disabled = true; gStatus('Checking…');
      try {
        const r = await post('/api/download', { file: id, email: gid('gmail2').value.trim(), code: gid('gcode').value.replace(/\D/g, '') });
        if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || fallback()); }
        saveBlob(await r.blob(), g.file);
        gStatus('Unlocked. Your download has started.', 'ok');
      } catch (err) { gStatus(err.message || fallback(), 'err'); }
      btn.disabled = false;
    };
  }

  document.addEventListener('click', (e) => {
    const p = e.target.closest('[data-protect]');
    if (!p || !GATE[p.dataset.protect]) return;
    e.preventDefault();
    showRequest(p.dataset.protect);
  });

  /* ---------- filter (Projects & tools) ---------- */
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach((x) => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    SEC.work.shown = f === 'all' ? SEC.work.all : SEC.work.all.filter((x) => x.kind === f);
    renderRail('work');
  });

  /* ---------- sections, nav, roaming shapes ---------- */
  const panels = $$('.panel');
  const N = panels.length;
  let cur = 0, lock = false;
  panels.forEach((p, i) => { const n = $('.no', p); if (n) n.textContent = '№ ' + String(i + 1).padStart(2, '0'); });
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

  /* ---------- guidance: "next page" button at the end of long pages + first-visit hint ---------- */
  const cue = document.createElement('button');
  cue.className = 'nextcue'; cue.type = 'button';
  document.body.appendChild(cue);
  cue.onclick = () => go(cur + 1);
  const updateCue = () => {
    const p = panels[cur];
    const long = !!p && p.scrollHeight - p.clientHeight > 4;
    const atEnd = long && p.scrollTop >= p.scrollHeight - p.clientHeight - 6;
    if (atEnd && cur < N - 1) cue.innerHTML = `<small>End of page</small>Next: ${panels[cur + 1].dataset.title} <span aria-hidden="true">→</span>`;
    cue.classList.toggle('on', atEnd && cur < N - 1);
  };
  panels.forEach((p) => p.addEventListener('scroll', updateCue, { passive: true }));
  addEventListener('resize', updateCue);
  addEventListener('load', updateCue);

  const hint = document.createElement('div');
  hint.className = 'navhint';
  const coarse = matchMedia('(pointer:coarse)').matches;
  hint.innerHTML = coarse ? 'Swipe up or tap <b>→</b> to explore' : 'Scroll, or use <b>←</b> <b>→</b> keys, to explore';
  document.body.appendChild(hint);
  let hintSeen = false, booted = false;
  try { hintSeen = localStorage.getItem('navHintSeen') === '1'; } catch (e) {}
  const hideHint = () => {
    hint.classList.remove('on');
    if (!hintSeen) { hintSeen = true; try { localStorage.setItem('navHintSeen', '1'); } catch (e) {} }
  };
  hint.onclick = hideHint;

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
    if (booted) hideHint();
    setTimeout(updateCue, 60);
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

  /* A page taller than the screen scrolls first; reaching its end never flips the page.
     A separate, fresh scroll / swipe / key press at the end is needed to move on. */
  const overflows = () => { const p = panels[cur]; return !!p && p.scrollHeight - p.clientHeight > 4; };
  let acc = 0, accT, lastWheel = 0, edgeOk = false, lastKey = 0;
  addEventListener('wheel', (e) => {
    if (popOpen()) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!d) return;
    const now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    const hit = inner(e.target, Math.sign(d));
    if (hit) { edgeOk = false; if (hit.h) { e.preventDefault(); hit.el.scrollLeft += d; } return; }
    e.preventDefault();
    if (gap > 380) edgeOk = true;            // a new gesture started while at the page edge
    if (overflows() && !edgeOk) { acc = 0; return; } // still the same gesture / inertia that reached the end
    acc += d; clearTimeout(accT); accT = setTimeout(() => (acc = 0), 160);
    if (Math.abs(acc) > 60) { go(cur + Math.sign(acc)); acc = 0; edgeOk = false; }
  }, { passive: false });

  addEventListener('keydown', (e) => {
    const k = e.key;
    if (gateOn()) { if (k === 'Escape') closeGate(); return; }
    if (popOpen()) {
      if (lb.classList.contains('on')) { if (k === 'Escape') lb.classList.remove('on'); return; }
      if (k === 'Escape') closePop();
      else if (k === 'ArrowRight') { e.preventDefault(); goPop(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); goPop(-1); }
      return;
    }
    const vert = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[k];
    if (vert && overflows()) {
      const p = panels[cur], atEnd = vert > 0 ? p.scrollTop >= p.scrollHeight - p.clientHeight - 2 : p.scrollTop <= 2;
      e.preventDefault();
      const now = performance.now();
      if (!atEnd) { p.scrollBy({ top: vert * (k === 'ArrowDown' || k === 'ArrowUp' ? 90 : p.clientHeight * .8), behavior: 'smooth' }); lastKey = now; return; }
      if (e.repeat || now - lastKey < 450) { lastKey = now; return; } // extra, separate press needed at the end
      lastKey = now; go(cur + vert); return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); go(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(N - 1);
  });

  let tx, ty, tt, tTop = 0;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = e.target; tTop = panels[cur] ? panels[cur].scrollTop : 0; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (popOpen()) return;
    const dx = tx - e.changedTouches[0].clientX, dy = ty - e.changedTouches[0].clientY;
    const horiz = Math.abs(dx) > Math.abs(dy);
    const d = horiz ? dx : dy;
    if (Math.abs(d) < 60) return;
    if (horiz && tt.closest && tt.closest('.hscroll')) return; // native sideways scroll
    if (!horiz && inner(tt, Math.sign(d))) return;
    if (!horiz && overflows() && Math.abs(panels[cur].scrollTop - tTop) > 2) return; // this swipe was scrolling the page; swipe again to move on
    go(cur + Math.sign(d));
  }, { passive: true });

  /* ---------- grids: card clicks ---------- */
  $$('.g3[data-sec]').forEach((g) => g.addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (c) openPop(g.dataset.sec, +c.dataset.i);
  }));

  /* ---------- boot ---------- */
  const start = Math.max(0, panels.findIndex((p) => '#' + p.id === location.hash));
  panels.forEach((p, i) => p.classList.add(i > start ? 'after' : 'before'));
  place(start);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    cur = -1; go(start, true); booted = true;
    if (start === 0 && !hintSeen) setTimeout(() => hint.classList.add('on'), 1200);
  }));
})();
