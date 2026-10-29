'use strict';

// Page shell shared by every page: head (SEO, social cards, structured
// data), header, breadcrumbs, footer and the sticky mobile call to action.

const SITE = {
  url: 'https://bar-madar.github.io',
  name: 'Tokenmeter & TokenDiet',
  author: 'Bar Madar',
  github: 'https://github.com/bar-madar',
  issues: 'https://github.com/bar-madar/bar-madar.github.io/issues',
  tokenmeterRepo: 'https://github.com/bar-madar/claude-tokenmeter',
  // Set once the Agensi listing is live; until then TokenDiet shows "coming soon".
  agensiUrl: '',
  price: 15,
  updated: '2026-10-29',
  responseTime: '2 business days',
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = p => SITE.url + p;

const BUDDY = '<svg viewBox="0 0 13 12" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><path fill="#c8724f" d="M3 0h1v1H3zM8 0h1v1H8zM4 1h1v1H4zM7 1h1v1H7zM3 2h6v1H3zM2 3h8v1H2zM1 4h2v2H1zM5 4h2v2H5zM9 4h2v2H9zM0 6h12v1H0zM0 7h1v2H0zM2 7h8v2H2zM11 7h1v2h-1zM3 9h2v2H3zM7 9h2v2H7z"/><path fill="#e0916f" d="M3 2h6v1H3z"/><path fill="#1a1a1a" d="M3 4h2v2H3zM7 4h2v2H7z"/></svg>';

const NAV = [
  { path: '/tokendiet/', label: 'TokenDiet' },
  { path: '/tokenmeter/', label: 'Tokenmeter' },
  { path: '/support/', label: 'Support' },
];

const wordmark = name => (name === 'TokenDiet'
  ? '<span class="wordmark">TOKEN<span class="diet">DIET</span></span>'
  : '<span class="wordmark">TOKEN<span class="meter">METER</span></span>');

function breadcrumbList(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

function render(page) {
  const crumbs = page.breadcrumbs ? [{ name: 'Home', path: '/' }, ...page.breadcrumbs] : null;
  const graph = [...(page.schema || [])];
  if (crumbs) graph.push(breadcrumbList(crumbs));
  const ld = graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>` : '';
  const image = abs(page.ogImage || '/images/og-home.png');
  const canonical = abs(page.path === '/404.html' ? '/' : page.path);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="author" content="${esc(SITE.author)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#faf9f7" media="(prefers-color-scheme: light)">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.ogImageAlt || page.ogTitle || page.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css">
<script src="/assets/site.js" defer></script>
${ld}
</head>
<body${page.sticky ? ' class="has-sticky"' : ''}>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="${esc(SITE.name)}, home">${BUDDY}<span>${esc(SITE.author)}</span></a>
    <nav class="site-nav" aria-label="Main">
      <ul>${NAV.map(n => `<li><a href="${n.path}"${page.path.startsWith(n.path) ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}</ul>
    </nav>
  </div>
</header>
${crumbs ? `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => (i === crumbs.length - 1
    ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
    : `<li><a href="${c.path}">${esc(c.name)}</a></li>`)).join('')}</ol></nav>` : ''}
<main id="main" tabindex="-1">
${page.body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h2>Products</h2>
        <ul>
          <li><a href="/tokendiet/">TokenDiet</a></li>
          <li><a href="/tokenmeter/">Tokenmeter</a></li>
          <li><a href="/tokendiet/thanks/">TokenDiet install guide</a></li>
        </ul>
      </div>
      <div>
        <h2>Help</h2>
        <ul>
          <li><a href="/support/">Support</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="${SITE.github}">GitHub</a></li>
        </ul>
      </div>
      <div>
        <h2>Legal</h2>
        <ul>
          <li><a href="/privacy/">Privacy policy</a></li>
          <li><a href="/terms/">Terms and refunds</a></li>
          <li><a href="/cookies/">Cookie policy</a></li>
          <li><a href="/accessibility/">Accessibility statement</a></li>
        </ul>
      </div>
    </div>
    <p>Questions? <a href="${SITE.issues}">Open a GitHub issue</a>. I reply within ${SITE.responseTime}.</p>
    <p class="fine">© 2026 ${esc(SITE.author)}, independent developer. This site uses no cookies and no tracking.
    Tokenmeter and TokenDiet are not affiliated with or endorsed by Anthropic; Claude is a trademark of Anthropic.</p>
  </div>
</footer>
${page.sticky ? `<aside class="sticky-cta" aria-label="${esc(page.sticky.label)}"><span class="label">${esc(page.sticky.label)}</span><a class="btn btn-primary" href="${page.sticky.href}">${esc(page.sticky.cta)}</a></aside>` : ''}
<p id="copy-status" class="visually-hidden" role="status" aria-live="polite"></p>
</body>
</html>
`;
}

// The call to action for TokenDiet. Once the Agensi listing is live it buys;
// until then it names the next useful step, never just a status.
//   where: 'home' (hero), 'product' (TokenDiet hero) or 'pricing' (pricing card)
function buyTokenDiet(where = 'home') {
  if (SITE.agensiUrl) return `<a class="btn btn-primary" href="${esc(SITE.agensiUrl)}">Get TokenDiet · $${SITE.price}</a>`;
  if (where === 'home') return '<a class="btn btn-primary" href="/tokendiet/">Explore TokenDiet</a>';
  if (where === 'product') return '<a class="btn btn-primary" href="#pricing">See pricing</a>';
  return '';
}

function command(text, label) {
  return `<div class="command" role="group" aria-label="${esc(label || 'Command')}"><pre><code>${esc(text)}</code></pre><button class="copy" type="button" data-copy="${esc(text)}" aria-label="Copy: ${esc(label || 'command')}" hidden>Copy</button></div>`;
}

function faq(items, id = 'faq', heading = 'Frequently asked questions') {
  return {
    html: `<section class="section faq" id="${id}" aria-labelledby="${id}-title"><div class="wrap">
      <h2 id="${id}-title">${heading}</h2>
      ${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`).join('\n')}
    </div></section>`,
    schema: {
      '@type': 'FAQPage',
      mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
    },
  };
}

const person = { '@type': 'Person', '@id': `${SITE.url}/#author`, name: SITE.author, url: SITE.github };

module.exports = { SITE, esc, abs, render, wordmark, buyTokenDiet, command, faq, person };
