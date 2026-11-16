// Generates walkthrough.html from template.html. Reads (never writes) the app's source:
// fonts from node_modules/@fontsource, icons from glyphs.jsx, brand mark and tokens from src.
// Run: node walkthrough/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fe = path.resolve(here, '../fsp_frontend');
const read = (p) => fs.readFileSync(p, 'utf8').split('\r\n').join('\n');
const b64 = (p) => fs.readFileSync(p).toString('base64');

// ---- fonts (the app's own, embedded so the page makes no external requests) ----
const font = (pkg, file, family, weight) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;` +
  `src:url(data:font/woff2;base64,${b64(`${fe}/node_modules/@fontsource/${pkg}/files/${file}`)}) format('woff2')}`;
const fonts = [
  font('shantell-sans', 'shantell-sans-latin-700-normal.woff2', 'Shantell Sans', 700),
  font('shantell-sans', 'shantell-sans-latin-800-normal.woff2', 'Shantell Sans', 800),
  font('nunito', 'nunito-latin-400-normal.woff2', 'Nunito', 400),
  font('nunito', 'nunito-latin-700-normal.woff2', 'Nunito', 700),
  font('nunito', 'nunito-latin-800-normal.woff2', 'Nunito', 800),
  font('caveat', 'caveat-latin-700-normal.woff2', 'Caveat', 700),
].join('\n');

// ---- icons: copy the glyph markup from the app's icon kit ----
const src = read(`${fe}/src/components/Icon/glyphs.jsx`);
const WANT = ['house','camera','motmot','envelope','heart','wheel','sparkle','star','rose','sunflower','daisy','tulip',
  'dog','cookie','churro','pizza','burger','ramen','lasagna','sushi','milkTea','bowl','bed','pin','her','him','mountain',
  'museum','plane','sun','moon','leaf','fern','eucalyptus','babysbreath','lily','matcha','fries','coffee','cake'];
const glyphs = {};
const re = /^  (\w+): \(\n    <>\n([\s\S]*?)\n    <\/>\n  \),/gm;
let m;
while ((m = re.exec(src))) {
  if (!WANT.includes(m[1])) continue;
  let body = m[2].replace(/strokeWidth/g, 'stroke-width').replace(/strokeLinecap/g, 'stroke-linecap')
    .replace(/strokeLinejoin/g, 'stroke-linejoin').replace(/strokeDasharray/g, 'stroke-dasharray')
    .replace(/fillRule/g, 'fill-rule').replace(/clipRule/g, 'clip-rule');
  // expand `{[deg,...].map((deg) => (<path key d transform={`rotate(${deg} x y)`} .../>))}` petals
  body = body.replace(/\{\[([\d, ]+)\]\.map\(\(deg\) => \(\s*<path key=\{deg\} ([^>]*?)transform=\{`rotate\(\$\{deg\} ([\d. ]+)\)`\}([^>]*?)\/>\s*\)\)\}/g,
    (_, degs, a, c, b2) => degs.split(',').map((d) => `<path ${a}transform="rotate(${d.trim()} ${c})"${b2}/>`).join('\n'));
  if (/[{}]/.test(body)) throw new Error('JSX expression in glyph ' + m[1]);
  glyphs[m[1]] = body.split('\n').map((s) => s.trim()).join('');
}
const missing = WANT.filter((n) => !glyphs[n]);
if (missing.length) throw new Error('missing glyphs: ' + missing.join(', '));

// ---- tokens: copied from design-tokens.css ----
const css = read(`${fe}/src/styles/design-tokens.css`);
const block = (start) => {
  const i = css.indexOf(start);
  const open = css.indexOf('{', i);
  const close = css.indexOf('\n}', open);
  return css.slice(open + 1, close);
};
const lightRaw = block(':root,\n[data-theme="light"]');
const darkRaw = block(':root[data-theme="dark"]');
const stripLegacy = (s) => s.split('/*\n    Legacy aliases')[0];
const LIGHT = stripLegacy(lightRaw);
const DARK = darkRaw;

const logo = read(`${fe}/src/assets/brand/logo-mark.svg`).replace(/<title>.*?<\/title>/, '').trim();

let html = read(path.join(here, 'template.html'));
html = html
  .replace('/*@@FONTS@@*/', fonts)
  .replaceAll('/*@@LIGHT@@*/', LIGHT)
  .replaceAll('/*@@DARK@@*/', DARK)
  .replace('@@GLYPHS@@', JSON.stringify(glyphs))
  .replace('@@LOGO@@', JSON.stringify(logo));
fs.writeFileSync(path.join(here, 'walkthrough.html'), html);
console.log('walkthrough.html', (html.length / 1024).toFixed(0) + ' KB');
