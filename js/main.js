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
    { src: 'images/pubmats/marquez.webp' },
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
    { src: 'images/merch/logo-alt.svg' },
    { src: 'images/merch/marquez-poloshirt-entry.webp' },
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
     video: null                                      ← shows "coming soon"
   --------------------------------------------------------- */
const WALKTHROUGHS = [
  { name: '[SITE 01 NAME]', blurb: '[One line about what this site does]', url: '', video: null },
  { name: '[SITE 02 NAME]', blurb: '[One line about what this site does]', url: '', video: null },
  { name: '[SITE 03 NAME]', blurb: '[One line about what this site does]', url: '', video: null },
];

/* =========================================================
   3. Behaviour — no need to edit below this line
   ========================================================= */
const ACCENTS = ['var(--blue)', 'var(--gold)', '#7d929e'];
const TILES = ['#ffffff', 'var(--gold)', '#dbd4cc'];
const TILT = ['-1.5deg', '1.2deg', '-.8deg', '1.6deg', '1deg', '-1.6deg', '1.3deg', '-1deg'];

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
  fig.style.cssText = `margin:0;animation-delay:${(0.45 + i * 0.09).toFixed(2)}s;--r:${TILT[i % TILT.length]}`;

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
  slot.appendChild(img);

  let holder = slot;
  if (s.tile) {
    holder = document.createElement('div');
    holder.style.cssText = `overflow:hidden;border:2.5px solid #3e251e;border-radius:14px;padding:10px;background:${TILES[i % TILES.length]}`;
    holder.appendChild(slot);
  } else if (s.frame) {
    fig.style.cssText += `;background:#fff;padding:8px;border:2.5px solid #3e251e;border-radius:12px;box-shadow:5px 5px 0 ${ACCENTS[i % ACCENTS.length]}`;
  }

  const cap = document.createElement('figcaption');
  cap.style.cssText = "margin-top:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase";
  cap.textContent = `[${pad(i + 1)}] ${label}`;

  fig.append(holder, cap);
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
    if (v && v.youtube) {
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
    if (site.url) {
      const link = document.createElement('a');
      link.href = site.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Visit the site ↗';
      link.style.cssText = 'align-self:flex-start;margin-top:8px;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:2.5px solid #3e251e;border-radius:999px;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none';
      body.appendChild(link);
    }
    card.append(bar, media, body);
    wrap.appendChild(card);
  });
}

/* ---- commission coupon (Formspree) ----
   1. Make a free form at formspree.io
   2. Replace YOUR_FORM_ID in index.html (the <form action="…">) with your form's ID.
   Until then the button shows the "Received!" stamp without sending anything. */
function showCoupon(done) {
  const form = document.getElementById('coupon-form');
  const thanks = document.getElementById('coupon-done');
  if (!form || !thanks) return;
  form.hidden = done;
  thanks.hidden = !done;
}

function wireCoupon() {
  const form = document.getElementById('coupon-form');
  if (!form) return;
  const err = document.getElementById('coupon-error');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (err) err.hidden = true;
    if (form.action.includes('YOUR_FORM_ID')) { showCoupon(true); return; }
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      showCoupon(true);
    } catch {
      if (err) err.hidden = false;
    }
  });
}

renderWorks();
renderWalkthroughs();
wireCoupon();
