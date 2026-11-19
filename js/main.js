/* =========================================================
   THE BLUE LAB — portfolio script
   1. WORKS         → the images inside each folded edition
   2. WALKTHROUGHS  → the three website tours on the Web Desk
   3. Behaviour     → unfold / fold, counts, commission form
   ========================================================= */

/* ---------------------------------------------------------
   1. WORKS
   Add a piece: put the file in its images/ folder, then add
   one line below. `cap` and `alt` are optional — leave them
   out and a caption is made from the file name.
   A file that is missing or misspelled hides itself, so the
   page never shows a broken image.
   --------------------------------------------------------- */
const WORKS = {
  logos: [
    { src: 'images/logos/digilab-logo.svg' },
    { src: 'images/logos/logo-1.webp' },
    { src: 'images/logos/logo-3.webp' },
    { src: 'images/logos/logo-alt.svg' },
    { src: 'images/logos/logo-jpg.webp' },
    { src: 'images/logos/logo.webp' },
    { src: 'images/logos/otw-logo.webp' },
  ],
  brochures: [
    { src: 'images/brochures/brochure-1.webp' },
    { src: 'images/brochures/brochure-2.webp' },
  ],
  pubmats: [
    { src: 'images/pubmats/academic-achiever-pubmat.webp' },
    { src: 'images/pubmats/graphics-1.webp' },
    { src: 'images/pubmats/happy-teachers-day.webp' },
    { src: 'images/pubmats/ignacio.webp' },
    { src: 'images/pubmats/grocery-profile.webp' },
    { src: 'images/pubmats/messengergp.webp' },
    { src: 'images/pubmats/pubmat-1.webp' },
    { src: 'images/pubmats/pubmat-cover.webp' },
    { src: 'images/pubmats/pubmat-gazette-2.webp' },
    { src: 'images/pubmats/pubmat-gazette.webp' },
    { src: 'images/pubmats/pubmat.webp' },
    { src: 'images/pubmats/sample-2.webp' },
    { src: 'images/pubmats/special-awards.webp' },
    { src: 'images/pubmats/without-texture.webp' },
    { src: 'images/pubmats/zoom-background.webp' },
  ],
  banners: [
    { src: 'images/banners/cpe-banner-2.webp' },
    { src: 'images/banners/cpe-banner.webp' },
  ],
  merch: [
    { src: 'images/merch/lanyard-1.webp' },
    { src: 'images/merch/poloshirt-entry.webp' },
  ],
  infographics: [
    { src: 'images/infographics/infographic-1.webp' },
    { src: 'images/infographics/infographic-2.webp' },
    { src: 'images/infographics/infographic-3.webp' },
  ],
};

/* ---------------------------------------------------------
   2. WALKTHROUGHS
   For each site, fill in the name, one line, the live link,
   and ONE video source:
     video: { youtube: 'VIDEO_ID' }                   ← the part after watch?v=
     video: { mp4: 'videos/site-1.mp4', poster: 'images/web/site-1.webp' }
     video: { page: 'walkthroughs/site/index.html' }  ← an interactive walkthrough page, embedded
     video: null                                      ← shows "coming soon"
   --------------------------------------------------------- */
const WALKTHROUGHS = [
  { name: 'TindaTrack', blurb: 'A custom-built store management app for a sari-sari store: selling, stock, utang and the cash drawer.', url: '', video: { page: 'walkthroughs/tindatrack/index.html' } },
  { name: 'On The Water', blurb: 'A shared gala planner for RSVPs, route, costs, chat and photos.', url: 'https://otw.vinnn.app', video: { page: 'walkthroughs/on-the-water/index.html' } },
  { name: 'for sneakypea', blurb: 'A private web app where a couple keeps memories, plans and love notes.', url: 'https://forsneakypea.vercel.app', video: { page: 'walkthroughs/forsneakypea/index.html' } },
];

/* =========================================================
   3. Behaviour — no need to edit below this line
   ========================================================= */
const ACCENTS = ['var(--blue)', 'var(--gold)', '#7d929e'];
const TILES = ['#ffffff', 'var(--gold)', '#dbd4cc'];

// how each edition frames its pieces — `ratio` reserves the space while the image loads
const STYLE = {
  logos:        { tile: true, ratio: '1' },
  brochures:    { ratio: '4/3' },
  pubmats:      { frame: true, ratio: '1' },
  banners:      { ratio: '4/5' },
  merch:        { tile: true, ratio: '1' },
  infographics: { frame: true, ratio: '3/4' },
};

const pad = (n) => String(n).padStart(2, '0');
const nameFromFile = (src) =>
  src.split('/').pop().replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function figureFor(key, item, i) {
  const s = STYLE[key] || {};
  const label = item.cap || nameFromFile(item.src);
  const fig = document.createElement('figure');
  fig.className = 'stamp';
  fig.style.cssText = `margin:0;animation-delay:${(0.45 + i * 0.09).toFixed(2)}s`;

  // the slot keeps its shape and shows a halftone shimmer until the image arrives
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.style.aspectRatio = item.ratio || s.ratio || '1';

  const img = document.createElement('img');
  img.alt = item.alt || label;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('load', () => slot.classList.add('is-loaded'));
  const drop = () => { if (fig.isConnected) { fig.remove(); updateCount(key); } };
  img.addEventListener('error', drop);
  img.src = item.src;
  if (location.protocol.startsWith('http')) {
    fetch(item.src, { method: 'HEAD' }).then((r) => { if (!r.ok) drop(); }).catch(() => {});
  }
  const zoom = document.createElement('button');
  zoom.type = 'button';
  zoom.className = 'zoom';
  zoom.dataset.zoom = '';
  zoom.setAttribute('aria-label', `View ${label} full size`);
  zoom.appendChild(img);
  slot.appendChild(zoom);

  let holder = slot;
  if (s.tile) {
    holder = document.createElement('div');
    holder.style.cssText = `overflow:hidden;border:2.5px solid #3e251e;border-radius:14px;padding:10px;background:${TILES[i % TILES.length]}`;
    holder.appendChild(slot);
  } else if (s.frame) {
    fig.style.cssText += `;background:#fff;padding:8px;border:2.5px solid #3e251e;border-radius:12px;box-shadow:5px 5px 0 ${ACCENTS[i % ACCENTS.length]}`;
  }

  fig.append(holder);
  return fig;
}

// start downloading an edition's images the moment someone hovers or focuses its cover
function warmUp(e) {
  const flap = e.target.closest && e.target.closest('.flap');
  if (!flap || flap.dataset.warm) return;
  flap.dataset.warm = '1';
  document.querySelectorAll(`#panel-${flap.dataset.toggle} img[loading="lazy"]`).forEach((im) => { im.loading = 'eager'; });
}
document.addEventListener('pointerover', warmUp);
document.addEventListener('focusin', warmUp);

function updateCount(key) {
  const grid = document.querySelector(`[data-grid="${key}"]`);
  const n = grid ? grid.querySelectorAll('figure').length : 0;
  document.querySelectorAll(`[data-count-for="${key}"]`).forEach((el) => {
    const unit = el.dataset.unit || 'piece';
    el.textContent = `${n} ${unit}${n === 1 ? '' : 's'}`;
  });
  if (grid) {
    let note = grid.querySelector('.empty-note');
    if (n === 0 && !note) {
      note = document.createElement('p');
      note.className = 'empty-note';
      note.style.cssText = "margin:0;grid-column:1/-1;padding:28px;border:3px dashed #7d929e;border-radius:16px;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;letter-spacing:.08em";
      note.textContent = 'FRESH PIECES ARE STILL IN THE PRESS — CHECK BACK SOON';
      grid.appendChild(note);
    } else if (n > 0 && note) note.remove();
  }
  const flap = document.querySelector(`.flap[data-toggle="${key}"]`);
  if (flap) flap.setAttribute('aria-label', flap.getAttribute('aria-label').replace(/\d+ pieces?/, `${n} piece${n === 1 ? '' : 's'}`));
}

function renderWorks() {
  Object.entries(WORKS).forEach(([key, items]) => {
    const grid = document.querySelector(`[data-grid="${key}"]`);
    if (!grid) return;
    items.forEach((item, i) => grid.appendChild(figureFor(key, item, i)));
    updateCount(key);
  });
}

/* ---- unfold / fold ---- */
function setOpen(key, open) {
  const panel = document.getElementById(`panel-${key}`);
  const flap = document.querySelector(`.flap[data-toggle="${key}"]`);
  if (!panel || !flap) return;
  panel.hidden = !open;               // un-hiding replays the roller + stamp animations
  flap.classList.toggle('is-open', open);
  flap.setAttribute('aria-expanded', String(open));
  if (open) {
    const back = panel.querySelector('button[data-toggle]');
    if (back) setTimeout(() => back.focus({ preventScroll: true }), 900);
  } else {
    flap.focus({ preventScroll: true });
  }
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-toggle]');
  if (t) {
    const key = t.dataset.toggle;
    const panel = document.getElementById(`panel-${key}`);
    setOpen(key, panel ? panel.hidden : true);
    return;
  }
  const a = e.target.closest('[data-action]');
  if (!a) return;
  if (a.dataset.action === 'open-all') Object.keys(WORKS).forEach((k) => setOpen(k, true));
  if (a.dataset.action === 'close-all') Object.keys(WORKS).forEach((k) => setOpen(k, false));
  if (a.dataset.action === 'reset-coupon') showCoupon(false);
});


/* ---- full view (watermark is drawn over the image in css/style.css) ---- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
let lbList = [];
let lbIdx = 0;

function lbShow(step = 0) {
  if (!lbList.length) return;
  lbIdx = (lbIdx + step + lbList.length) % lbList.length;
  const src = lbList[lbIdx];
  lbImg.src = src.currentSrc || src.src;
  lbImg.alt = src.alt;
  lb.querySelectorAll('.lb-prev,.lb-next').forEach((b) => { b.hidden = lbList.length < 2; });
}

document.addEventListener('click', (e) => {
  const z = e.target.closest('[data-zoom]');
  if (z) {
    const grid = z.closest('[data-grid]');
    lbList = grid ? [...grid.querySelectorAll('[data-zoom] img')] : [z.querySelector('img')];
    lbIdx = Math.max(0, lbList.indexOf(z.querySelector('img')));
    lbShow();
    lb.showModal();
    return;
  }
  const b = e.target.closest('[data-lb]');
  if (b) { const a = b.dataset.lb; if (a === 'close') lb.close(); else lbShow(a === 'next' ? 1 : -1); return; }
  if (e.target === lb) lb.close();
});
lb.addEventListener('contextmenu', (e) => e.preventDefault());
lb.addEventListener('close', () => { lbImg.removeAttribute('src'); });
document.addEventListener('keydown', (e) => {
  if (!lb.open) return;
  if (e.key === 'ArrowRight') lbShow(1);
  if (e.key === 'ArrowLeft') lbShow(-1);
});

/* ---- web desk walkthroughs ---- */
function renderWalkthroughs() {
  const wrap = document.querySelector('[data-walkthroughs]');
  if (!wrap) return;
  WALKTHROUGHS.forEach((site, i) => {
    const card = document.createElement('article');
    card.style.cssText = 'background:#fff;border:3px solid #3e251e;border-radius:16px;overflow:hidden;display:flex;flex-direction:column';

    const bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:7px;padding:9px 12px;border-bottom:3px solid #3e251e;background:var(--blue)';
    bar.innerHTML = '<span style="width:12px;height:12px;border-radius:50%;border:2px solid #3e251e;background:var(--gold)"></span><span style="width:12px;height:12px;border-radius:50%;border:2px solid #3e251e;background:var(--paper)"></span><span style="width:12px;height:12px;border-radius:50%;border:2px solid #3e251e;background:#7d929e"></span>';
    const addr = document.createElement('span');
    addr.style.cssText = "margin-left:8px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:var(--paper);border-radius:999px;padding:3px 12px;font-family:'IBM Plex Mono',monospace;font-size:12px";
    addr.textContent = site.url ? site.url.replace(/^https?:\/\//, '') : `website-${pad(i + 1)}`;
    bar.appendChild(addr);

    const media = document.createElement('div');
    media.className = 'walk-media';
    media.style.cssText = 'aspect-ratio:16/9;border-bottom:3px solid #3e251e;position:relative';
    const v = site.video;
    if (v && v.page) {
      const f = document.createElement('iframe');
      f.src = v.page;
      f.title = `Walkthrough of ${site.name}`;
      f.loading = 'lazy';
      media.appendChild(f);
    } else if (v && v.youtube) {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}`;
      f.title = `Walkthrough of ${site.name}`;
      f.loading = 'lazy';
      f.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      media.appendChild(f);
    } else if (v && v.mp4) {
      const vid = document.createElement('video');
      vid.src = v.mp4;
      vid.controls = true;
      vid.preload = 'none';
      vid.playsInline = true;
      if (v.poster) vid.poster = v.poster;
      vid.setAttribute('aria-label', `Walkthrough of ${site.name}`);
      media.appendChild(vid);
    } else {
      media.style.background = 'repeating-conic-gradient(#dbd4cc 0 25%, var(--paper) 0 50%) 0 0 / 28px 28px';
      media.innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><svg aria-hidden="true" width="64" height="64" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="var(--blue)" stroke="#3e251e" stroke-width="2.5"/><path d="M20 16 L32 24 L20 32 Z" fill="var(--gold)" stroke="#3e251e" stroke-width="2.5" stroke-linejoin="round"/></svg><span style="background:var(--paper);border:2.5px solid #3e251e;border-radius:999px;padding:4px 12px;font-family:\'IBM Plex Mono\',monospace;font-size:12px;font-weight:600;letter-spacing:.1em">WALKTHROUGH COMING SOON</span></div>';
    }

    const body = document.createElement('div');
    body.style.cssText = 'padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;flex:1';
    const kicker = document.createElement('p');
    kicker.style.cssText = "margin:0;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:.14em;color:var(--blue)";
    kicker.textContent = `WEBSITE ${pad(i + 1)}`;
    const title = document.createElement('h3');
    title.style.cssText = "margin:0;font-family:'Anton',sans-serif;font-weight:400;font-size:30px;line-height:1;text-transform:uppercase";
    title.textContent = site.name;
    const blurb = document.createElement('p');
    blurb.style.cssText = 'margin:0;font-size:15.5px;line-height:1.45;flex:1';
    blurb.textContent = site.blurb;
    body.append(kicker, title, blurb);
    const BTN = 'display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:2.5px solid #3e251e;border-radius:999px;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none';
    const links = [];
    if (site.video && site.video.page) links.push(['Open full walkthrough ↗', site.video.page]);
    if (site.url && !(site.video && site.video.page === site.url)) links.push(['Visit the site ↗', site.url]);
    if (links.length) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px';
      links.forEach(([text, href]) => {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = text;
        link.style.cssText = BTN;
        row.appendChild(link);
      });
      body.appendChild(row);
    }
    card.append(bar, media, body);
    wrap.appendChild(card);
  });
}

/* ---- commission coupon (Formspree: formspree.io/f/maeoejoq) ----
   Replies go to the Formspree inbox. Every booking also gets a random
   6-character ticket code (saved in the submission as `ticket_code`)
   that earns 5% off the next commission once the booking is ₱500+. */
function showCoupon(done) {
  const form = document.getElementById('coupon-form');
  const thanks = document.getElementById('coupon-done');
  if (!form || !thanks) return;
  form.hidden = done;
  thanks.hidden = !done;
}

// no 0/O/1/I so a screenshot is never misread
function makeTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

function showTicket(code, name) {
  const dlg = document.getElementById('ticket-dialog');
  if (!dlg) return;
  document.getElementById('ticket-code').textContent = code;
  const date = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  document.getElementById('ticket-meta').textContent = `${name ? name + ' · ' : ''}${date}`;
  dlg.showModal();
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-ticket="close"]')) document.getElementById('ticket-dialog').close();
});

function wireCoupon() {
  const form = document.getElementById('coupon-form');
  if (!form) return;
  const err = document.getElementById('coupon-error');
  const btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (err) err.hidden = true;
    const code = makeTicketCode();
    document.getElementById('f-ticket').value = code;
    const name = form.elements.name.value.trim();
    if (btn) btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      showCoupon(true);
      showTicket(code, name);
    } catch {
      if (err) err.hidden = false;
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

renderWorks();
renderWalkthroughs();
wireCoupon();
