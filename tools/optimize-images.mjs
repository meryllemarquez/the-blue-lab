// Shrinks every portfolio image to a fast-loading WebP.
//   npm install --no-save sharp
//   node tools/optimize-images.mjs
// For each .png / .jpg / .jpeg / .svg inside images/ (except images/about):
//   1. saves a WebP next to it (max 1400px on the long side, quality 80)
//   2. moves the original into _originals/ (same folder layout), so nothing is lost
//   3. updates the paths in js/main.js to the new .webp files
// Small true-vector SVGs (under 150 KB) are left as they are. Safe to run again.

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, 'images');
const ORIGINALS = path.join(ROOT, '_originals');
const MAIN_JS = path.join(ROOT, 'js', 'main.js');
const MAX_SIDE = 1400;
const QUALITY = 80;
const KEEP_SVG_UNDER = 150 * 1024;
const SKIP_DIRS = new Set(['about']);

const kb = (b) => (b >= 1024 * 1024 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`).padStart(9);
const toPosix = (p) => p.split(path.sep).join('/');

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === IMAGES && SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

// Canva SVGs carry their photos inside as giant base64 text. The SVG renderer refuses any
// single chunk over ~10 MB, so first shrink every embedded photo, then render the lighter SVG.
const EMBED = /data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=\s]+)/g;
const CHUNK_LIMIT = 9_000_000;

async function shrinkEmbedded(svgText) {
  const parts = [];
  let last = 0;
  let changed = false;
  for (const m of svgText.matchAll(EMBED)) {
    parts.push(svgText.slice(last, m.index));
    last = m.index + m[0].length;
    const original = m[0];
    if (original.length < 400_000) { parts.push(original); continue; }
    try {
      const buf = Buffer.from(m[2].replace(/\s+/g, ''), 'base64');
      const { hasAlpha } = await sharp(buf, { limitInputPixels: false }).metadata();
      let side = 2000;
      let uri = original;
      while (side >= 400) {
        const pipe = sharp(buf, { limitInputPixels: false }).resize({ width: side, height: side, fit: 'inside', withoutEnlargement: true });
        const out = hasAlpha ? await pipe.png({ compressionLevel: 9 }).toBuffer() : await pipe.jpeg({ quality: 86 }).toBuffer();
        uri = `data:image/${hasAlpha ? 'png' : 'jpeg'};base64,${out.toString('base64')}`;
        if (uri.length < CHUNK_LIMIT) break;
        side = Math.round(side * 0.75);
      }
      parts.push(uri);
      changed = true;
    } catch {
      parts.push(original);
    }
  }
  parts.push(svgText.slice(last));
  return changed ? parts.join('') : svgText;
}

async function loadInput(file, ext) {
  if (ext !== '.svg') return file;
  const text = await fs.readFile(file, 'utf8');
  return Buffer.from(await shrinkEmbedded(text), 'utf8');
}

const renamed = [];
let before = 0;
let after = 0;

for await (const file of walk(IMAGES)) {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) continue;
  const { size } = await fs.stat(file);
  if (ext === '.svg' && size < KEEP_SVG_UNDER) continue;

  // logo.svg and logo.jpg in the same folder would both become logo.webp, so keep them apart
  const stem = file.slice(0, -ext.length);
  const twins = (await fs.readdir(path.dirname(file))).filter((n) =>
    n !== path.basename(file) && path.basename(n, path.extname(n)) === path.basename(stem) &&
    ['.png', '.jpg', '.jpeg', '.svg'].includes(path.extname(n).toLowerCase()));
  const out = twins.length ? `${stem}-${ext.slice(1)}.webp` : `${stem}.webp`;
  try {
    await sharp(await loadInput(file, ext), { density: ext === '.svg' ? 150 : 72, limitInputPixels: false })
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(out);
  } catch (err) {
    console.warn(`  skipped ${toPosix(path.relative(ROOT, file))}: ${err.message}`);
    continue;
  }

  const outSize = (await fs.stat(out)).size;
  if (outSize >= size) { await fs.rm(out); continue; }

  const keep = path.join(ORIGINALS, path.relative(IMAGES, file));
  await fs.mkdir(path.dirname(keep), { recursive: true });
  await fs.rename(file, keep);

  before += size;
  after += outSize;
  const from = toPosix(path.relative(ROOT, file));
  const to = toPosix(path.relative(ROOT, out));
  renamed.push([from, to]);
  console.log(`${kb(size)} → ${kb(outSize)}   ${to}`);
}

if (renamed.length) {
  let js = await fs.readFile(MAIN_JS, 'utf8');
  for (const [from, to] of renamed) js = js.split(`'${from}'`).join(`'${to}'`);
  await fs.writeFile(MAIN_JS, js);

  const gi = path.join(ROOT, '.gitignore');
  const current = await fs.readFile(gi, 'utf8').catch(() => '');
  const add = ['_originals/', 'node_modules/'].filter((l) => !current.split(/\r?\n/).includes(l));
  if (add.length) await fs.writeFile(gi, current + (current && !current.endsWith('\n') ? '\n' : '') + add.join('\n') + '\n');
}

console.log(`\n${renamed.length} images converted: ${kb(before).trim()} → ${kb(after).trim()}`);
console.log('Originals are in _originals/ (ignored by git). Paths in js/main.js are updated.');
