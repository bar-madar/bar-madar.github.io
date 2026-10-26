'use strict';

// Builds the site into docs/ (served by GitHub Pages) and checks it. The
// build fails on any problem a visitor or a search engine would notice.
//
//   node src/build.cjs

const fs = require('fs');
const path = require('path');
const { SITE, render } = require('./layout.cjs');
const pages = require('./pages.cjs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');
const SRC = __dirname;

const problems = [];
const warn = [];
const fail = msg => problems.push(msg);

function outFile(p) {
  return p.endsWith('.html') ? path.join(OUT, p) : path.join(OUT, p, 'index.html');
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// ---------- build ----------

fs.rmSync(OUT, { recursive: true, force: true });
const html = new Map();
for (const page of pages) {
  const doc = render(page);
  html.set(page.path, doc);
  write(outFile(page.path), doc);
}

for (const f of ['site.css', 'site.js']) write(path.join(OUT, 'assets', f), fs.readFileSync(path.join(SRC, 'assets', f)));
fs.copyFileSync(path.join(SRC, 'assets', 'favicon.svg'), path.join(OUT, 'favicon.svg'));
const images = path.join(SRC, 'images');
for (const f of fs.existsSync(images) ? fs.readdirSync(images) : []) {
  const target = f === 'apple-touch-icon.png' ? path.join(OUT, f) : path.join(OUT, 'images', f);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(images, f), target);
}

const listed = pages.filter(p => !p.noindex);
write(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${listed.map(p => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${SITE.updated}</lastmod></url>`).join('\n')}
</urlset>
`);
write(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
write(path.join(OUT, '.nojekyll'), '');

// ---------- checks ----------

const titles = new Map();
const descriptions = new Map();
const external = new Set();

for (const page of pages) {
  const doc = html.get(page.path);
  const where = page.path;

  const title = page.title;
  if (titles.has(title)) fail(`${where}: title duplicates ${titles.get(title)}`);
  titles.set(title, where);
  if (title.length > 70) warn.push(`${where}: title is ${title.length} characters; search results may cut it`);

  const d = page.description;
  if (descriptions.has(d)) fail(`${where}: description duplicates ${descriptions.get(d)}`);
  descriptions.set(d, where);
  if (d.length < 50 || d.length > 170) fail(`${where}: description is ${d.length} characters (50-170)`);

  const h1s = doc.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${where}: ${h1s.length} <h1> elements`);

  for (const m of doc.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt="[^"]+"/.test(tag)) fail(`${where}: image without alt text: ${tag.slice(0, 80)}`);
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) fail(`${where}: image without width/height: ${tag.slice(0, 80)}`);
    const src = /\bsrc="([^"]+)"/.exec(tag)[1];
    if (src.startsWith('/') && !fs.existsSync(path.join(OUT, src))) fail(`${where}: missing image ${src}`);
  }

  // Nothing may load from another site: no third-party scripts, styles, fonts or images.
  for (const m of doc.matchAll(/<(script|link|img|iframe|source)\b[^>]*\b(src|href)="(https?:)?\/\/[^"]+"/g)) {
    if (/rel="canonical"/.test(m[0])) continue;
    fail(`${where}: loads a third-party resource: ${m[0].slice(0, 100)}`);
  }

  for (const m of doc.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
    const local = m[1].replace(SITE.url, '');
    if (!fs.existsSync(path.join(OUT, local))) fail(`${where}: social image missing: ${local}`);
  }

  for (const m of doc.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (err) {
      fail(`${where}: structured data is not valid JSON (${err.message})`);
    }
  }

  for (const m of doc.matchAll(/\bhref="([^"]+)"/g)) {
    const href = m[1];
    if (/^https?:/.test(href)) {
      external.add(href);
      continue;
    }
    if (/^(mailto:|tel:)/.test(href)) continue;
    const [p, frag] = href.split('#');
    const targetPath = p === '' ? where : p;
    const target = targetPath.endsWith('.html') || targetPath.endsWith('.svg') || targetPath.endsWith('.png') || targetPath.endsWith('.css') || targetPath.endsWith('.xml')
      ? path.join(OUT, targetPath)
      : path.join(OUT, targetPath, 'index.html');
    if (!fs.existsSync(target)) {
      fail(`${where}: broken link ${href}`);
      continue;
    }
    if (frag && target.endsWith('.html')) {
      const targetDoc = fs.readFileSync(target, 'utf8');
      if (!new RegExp(`\\bid="${frag}"`).test(targetDoc)) fail(`${where}: link ${href} points to a missing anchor`);
    }
  }
}

for (const w of warn) console.log(`warning: ${w}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`Built ${pages.length} pages into docs/ (${listed.length} in the sitemap).`);
console.log(`External links to review: ${external.size}`);
for (const e of [...external].sort()) console.log(`  ${e}`);
