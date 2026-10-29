'use strict';

// Every page of the site. Copy rules: only facts we can back up, demo numbers
// labelled as demo, no reviews or testimonials until real ones exist.

const { SITE, esc, abs, wordmark, buyTokenDiet, command, faq, person } = require('./layout.cjs');

const DEMO = { claudeBefore: 2865, claudeAfter: 409, cursorBefore: 631, cursorAfter: 233, findings: 8 };
const n = x => x.toLocaleString('en-US');
const AGENTS_LIST = 'Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, Windsurf and Cline';

const img = (src, alt, w, h, eager = false) =>
  `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;

// The home page's signature: a token meter before and after a diet, with the
// demo project's numbers. The bars are decoration; the text carries the data.
const meterCard = () => `
  <figure class="meter-card" aria-labelledby="meter-title">
    <p class="meter-title" id="meter-title">Instructions per request</p>
    <div class="meter-row">
      <p class="meter-label"><span>Before TokenDiet</span><strong>${n(DEMO.claudeBefore)} tokens</strong></p>
      <div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:100%"></div></div>
    </div>
    <div class="meter-row">
      <p class="meter-label"><span>After TokenDiet</span><strong class="green">${n(DEMO.claudeAfter)} tokens</strong></p>
      <div class="meter-track" aria-hidden="true"><div class="meter-fill after" style="width:${Math.round((DEMO.claudeAfter / DEMO.claudeBefore) * 100)}%"></div></div>
    </div>
    <figcaption class="meter-note">Claude Code on the demo project that ships with TokenDiet. Nothing the agent needs was removed.</figcaption>
  </figure>`;

const tokendietApp = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE.url}/tokendiet/#app`,
  name: 'TokenDiet',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description: 'An agent skill that measures what coding agents load into every request and trims it without losing information.',
  url: abs('/tokendiet/'),
  image: abs('/images/og-tokendiet.png'),
  softwareVersion: '1.0.0',
  author: { '@id': `${SITE.url}/#author` },
  offers: {
    '@type': 'Offer',
    price: String(SITE.price),
    priceCurrency: 'USD',
    availability: SITE.agensiUrl ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    url: SITE.agensiUrl || abs('/tokendiet/#pricing'),
  },
};

const tokenmeterApp = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE.url}/tokenmeter/#app`,
  name: 'Tokenmeter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description: 'A free Claude Code plugin and local dashboard that show token usage, plan limits and context fill from your own logs.',
  url: abs('/tokenmeter/'),
  image: abs('/images/og-tokenmeter.png'),
  softwareVersion: '0.2.0',
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
  author: { '@id': `${SITE.url}/#author` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ---------------------------------------------------------------- home

const homeFaq = faq([
  ['Do I need both tools?', 'No. Each works on its own. Tokenmeter shows where your tokens go; TokenDiet reduces what your instructions add to every request. Used together, Tokenmeter also shows each TokenDiet audit and suggests one when a session gets heavy.'],
  ['Is Tokenmeter really free?', `Yes. Tokenmeter is open source under the MIT license, with the code on <a href="${SITE.tokenmeterRepo}">GitHub</a>. TokenDiet is a separate, paid skill.`],
  ['Which agents do they support?', `Tokenmeter works with Claude Code. TokenDiet's audit covers ${AGENTS_LIST}, and runs in any agent that supports Agent Skills (SKILL.md). Its session usage check needs Claude Code.`],
  ['Does anything leave my computer?', 'No. Both tools run locally, read files on your machine, and send nothing anywhere. This website doesn\'t use cookies or tracking either.'],
  ['What does "lossless" mean here?', 'TokenDiet only removes repetition and noise, or moves instructions so they load when they are needed instead of on every request. It never lowers your model, effort or thinking, and asks before every change.'],
]);

const home = {
  path: '/',
  title: 'Tokenmeter & TokenDiet: spend fewer tokens, lose nothing',
  ogTitle: 'Spend fewer tokens. Lose nothing.',
  description: 'Tokenmeter shows where your Claude Code tokens go. TokenDiet cuts what your instructions add to every request, for every coding agent, without losing quality.',
  ogImage: '/images/og-home.png',
  ogImageAlt: 'Tokenmeter and TokenDiet: spend fewer tokens, lose nothing',
  schema: [
    { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: abs('/'), name: SITE.name, inLanguage: 'en', publisher: { '@id': `${SITE.url}/#author` } },
    person,
    homeFaq.schema,
  ],
  body: `
<section class="hero" aria-labelledby="home-title"><div class="wrap hero-grid">
  <div>
    <p class="eyebrow">For Claude Code and other coding agents</p>
    <h1 id="home-title">Spend fewer tokens.<br>Lose nothing.</h1>
    <p class="lead">Two tools that work together. <strong>Tokenmeter</strong> shows where your Claude Code tokens go, live. <strong>TokenDiet</strong> cuts what your instructions add to every request, without making your agent any less capable.</p>
    <div class="cta-row">
      ${buyTokenDiet('home')}
      <a class="btn btn-secondary" href="/tokenmeter/#install">Install Tokenmeter, free</a>
    </div>
    <p class="cta-note">Both run on your computer. Nothing is sent anywhere.</p>
  </div>
  ${meterCard()}
</div></section>

<section class="section" aria-labelledby="products-title"><div class="wrap">
  <h2 id="products-title">Two tools, one goal</h2>
  <div class="grid">
    <article class="card product-card accent-orange">
      ${wordmark('Tokenmeter')}
      <p class="price">Free · open source (MIT) · Claude Code plugin</p>
      <ul class="checklist">
        <li>Live pane in every session: tokens, context fill, plan limits</li>
        <li>Local dashboard with 90 days of history</li>
        <li>Counts each response once, unlike tools that sum every log line</li>
      </ul>
      <a class="more arrow-link" href="/tokenmeter/">Explore Tokenmeter</a>
    </article>
    <article class="card product-card accent-green">
      ${wordmark('TokenDiet')}
      <p class="price">$${SITE.price} one-time · Agent Skill</p>
      <ul class="checklist">
        <li>Measures what 7 coding agents load into every request</li>
        <li>Finds repeated, stale and misplaced instructions</li>
        <li>Applies lossless fixes, with your approval and a backup</li>
      </ul>
      <a class="more arrow-link" href="/tokendiet/">Explore TokenDiet</a>
    </article>
  </div>
</div></section>

<section class="section" aria-labelledby="together-title"><div class="wrap">
  <h2 id="together-title">How they work together</h2>
  <p class="lead">Every request your agent sends carries the whole conversation and your instruction files. Tokenmeter makes that visible; TokenDiet makes it lighter.</p>
  <ol class="steps">
    <li><h3>See it</h3><p>Tokenmeter shows each session's tokens and context fill, and suggests a diet when the context passes half the window or the prompt cache keeps missing.</p></li>
    <li><h3>Trim it</h3><p>TokenDiet measures your CLAUDE.md, AGENTS.md and rules files, proposes lossless fixes, and applies the ones you approve.</p></li>
    <li><h3>Track it</h3><p>Each audit shows up in Tokenmeter's dashboard as that project's instruction weight, before and after.</p></li>
  </ol>
  <figure class="figure">
    ${img('/images/tokendiet-audit.png', 'TokenDiet audit report in a terminal: Claude Code loads about 2,865 tokens of instructions per request in the demo project, about 409 after safe fixes, followed by findings such as a release process section and a 32-line code sample in CLAUDE.md', 1200, 760)}
    <figcaption>A TokenDiet audit of the demo project included with the skill.</figcaption>
  </figure>
</div></section>

<section class="section" aria-labelledby="demo-title"><div class="wrap">
  <h2 id="demo-title">On the demo project</h2>
  <div class="stat-row">
    <div class="stat"><span class="num">${n(DEMO.claudeBefore)} → <span class="green">${n(DEMO.claudeAfter)}</span></span><span class="what">tokens of instructions Claude Code loads per request</span></div>
    <div class="stat"><span class="num">${n(DEMO.cursorBefore)} → <span class="green">${n(DEMO.cursorAfter)}</span></span><span class="what">tokens of rules Cursor loads per request</span></div>
    <div class="stat"><span class="num">${DEMO.findings}</span><span class="what">findings, each explained with its fix</span></div>
  </div>
  <p class="muted">Measured on the demo project that ships with TokenDiet. Your results depend on your setup. Counts are estimates within about ±20%.</p>
</div></section>

<section class="section" aria-labelledby="private-title"><div class="wrap">
  <h2 id="private-title">Private by design</h2>
  <div class="grid">
    <div class="card"><h3>Runs locally</h3><p>Both tools read files on your computer and send nothing anywhere. No account, no API key.</p></div>
    <div class="card"><h3>You stay in control</h3><p>TokenDiet asks before every change and backs up every file it edits. One command undoes it.</p></div>
    <div class="card"><h3>No tracking here either</h3><p>This website sets no cookies and loads nothing from other sites. See the <a href="/privacy/">privacy policy</a>.</p></div>
  </div>
</div></section>

${homeFaq.html}`,
};

// ---------------------------------------------------------------- TokenDiet

const dietFaq = faq([
  ['Will it make my agent worse?', 'It is built not to. TokenDiet only removes repetition and noise, or moves instructions so they load when needed. Anything that could affect quality, such as a smaller model or lower effort, is explained and left to you.'],
  ['Can I undo changes?', 'Yes. TokenDiet backs up every file before editing it, into a .tokendiet/backup folder in your project, and one command restores them.'],
  ['Does it send my code anywhere?', 'No. It runs on your computer with Node.js and reads only your instruction files and Claude Code\'s local logs.'],
  ['How accurate are the numbers?', 'Token counts are estimates within about ±20%, because exact counts depend on each model\'s tokenizer. They are reliable for finding what is heavy and comparing before and after.'],
  ['Does it work without Claude Code?', `Yes. The audit covers ${AGENTS_LIST}. The session usage check needs Claude Code, because other agents don't keep comparable local logs.`],
], 'tokendiet-faq');

const FINDINGS = [
  ['Repeated rules', 'The same instructions in CLAUDE.md, AGENTS.md and rules files, or twice in one file.'],
  ['Workflow sections', 'Release, review or migration steps that load on every request but matter only sometimes. TokenDiet moves them into on-demand skills or scoped rules.'],
  ['History', 'Change logs and past decisions that rarely help with today\'s work.'],
  ['Code samples', 'Long examples inside instruction files, replaced with a pointer to a real file.'],
  ['Long files', 'Files past 200 lines, the length Anthropic recommends staying under for CLAUDE.md.'],
  ['Always-on rules', 'Cursor rules set to always apply but written for specific files.'],
  ['Broken links', 'Pointers to files that no longer exist, which send your agent looking for nothing.'],
  ['Unused MCP servers', 'Servers Claude Code hasn\'t called in 30 days, so you can switch them off.'],
];

const AGENT_FILES = [
  ['Claude Code', '<code>CLAUDE.md</code> (project, parent folders, user), imports, <code>.claude/rules</code>, skill descriptions, MCP servers'],
  ['Codex', '<code>AGENTS.md</code>, <code>~/.codex/AGENTS.md</code>'],
  ['Cursor', '<code>.cursor/rules</code> (always, described and scoped rules), <code>.cursorrules</code>, <code>AGENTS.md</code>, MCP servers'],
  ['GitHub Copilot', '<code>.github/copilot-instructions.md</code>, <code>.github/instructions</code>, <code>AGENTS.md</code>'],
  ['Gemini CLI', '<code>GEMINI.md</code> (project and user)'],
  ['Windsurf', '<code>.windsurf/rules</code>, <code>.windsurfrules</code>'],
  ['Cline', '<code>.clinerules</code> (file or folder)'],
];

const tokendiet = {
  path: '/tokendiet/',
  title: 'TokenDiet: cut the tokens your coding agent spends on every request',
  ogTitle: 'TokenDiet: fewer tokens per request, nothing lost',
  description: `An agent skill that measures what Claude Code, Cursor, Copilot and other coding agents load into every request, and trims it without losing quality.`,
  ogImage: '/images/og-tokendiet.png',
  ogImageAlt: 'TokenDiet: fewer tokens per request, nothing lost',
  ogType: 'product',
  breadcrumbs: [{ name: 'TokenDiet', path: '/tokendiet/' }],
  schema: [tokendietApp, person, dietFaq.schema],
  sticky: { label: `TokenDiet · $${SITE.price}`, cta: SITE.agensiUrl ? 'Get TokenDiet' : 'See pricing', href: SITE.agensiUrl || '/tokendiet/#pricing' },
  body: `
<section class="hero" aria-labelledby="diet-title"><div class="wrap">
  <p class="eyebrow">Agent Skill · $${SITE.price} one-time</p>
  <h1 id="diet-title"><span aria-hidden="true">${wordmark('TokenDiet')}</span><span class="visually-hidden">TokenDiet</span></h1>
  <p class="lead">Cut the tokens your coding agent spends on every request, without losing quality. TokenDiet measures your instruction files, finds what can go, and trims it with your approval.</p>
  <div class="cta-row">
    ${buyTokenDiet('product')}
    <a class="btn btn-secondary" href="#findings">See what it finds</a>
  </div>
  <p class="cta-note">Works with ${AGENTS_LIST}.</p>
  <figure class="figure">
    ${img('/images/tokendiet-audit.png', 'TokenDiet audit report: Claude Code loads about 2,865 tokens of instructions per request in the demo project, about 409 after safe fixes, with findings listed by how much each saves', 1200, 760, true)}
    <figcaption>The audit on the demo project included with TokenDiet.</figcaption>
  </figure>
</div></section>

<section class="section" aria-labelledby="why-title"><div class="wrap">
  <h2 id="why-title">Why your requests are heavier than they need to be</h2>
  <p class="lead">Every request carries your CLAUDE.md, AGENTS.md, rules files and skill descriptions. Over time they fill up with repeated rules, release checklists, code samples and old history, and you pay for all of it on every turn, in tokens and in usage limits.</p>
</div></section>

<section class="section" aria-labelledby="lossless-title"><div class="wrap">
  <h2 id="lossless-title">Lossless by design</h2>
  <div class="grid">
    <div class="card">
      <h3>What TokenDiet does</h3>
      <ul class="checklist">
        <li>Removes repetition and noise</li>
        <li>Moves instructions so they load only when needed</li>
        <li>Asks before every change</li>
        <li>Backs up every file it edits</li>
        <li>Measures again so you see the result</li>
      </ul>
    </div>
    <div class="card">
      <h3>What it never does on its own</h3>
      <ul class="checklist cross">
        <li>Lower your model, effort or thinking</li>
        <li>Make replies terser</li>
        <li>Delete rules your agent still needs</li>
        <li>Disable your MCP servers or tools</li>
      </ul>
      <p class="muted">When one of these would save tokens, TokenDiet explains the trade-off and leaves the choice to you.</p>
    </div>
  </div>
</div></section>

<section class="section" id="findings" aria-labelledby="findings-title"><div class="wrap">
  <h2 id="findings-title">What it finds</h2>
  <div class="grid grid-4">
    ${FINDINGS.map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('\n    ')}
  </div>
</div></section>

<section class="section" aria-labelledby="agents-title"><div class="wrap">
  <h2 id="agents-title">Every agent in one audit</h2>
  <p class="lead">One report shows what each agent in your project loads per request, so rules shared between agents are counted once and kept in sync.</p>
  <div class="table-wrap">
    <table>
      <caption>Files TokenDiet measures for each agent</caption>
      <thead><tr><th scope="col">Agent</th><th scope="col">What it reads</th></tr></thead>
      <tbody>${AGENT_FILES.map(([a, f]) => `<tr><th scope="row">${a}</th><td>${f}</td></tr>`).join('')}</tbody>
    </table>
  </div>
</div></section>

<section class="section" aria-labelledby="usage-title"><div class="wrap">
  <h2 id="usage-title">See what each Claude Code session costs</h2>
  <p class="lead">The usage check shows this session's tokens, how full the context is, and every time the prompt cache had to be rebuilt, with the likely cause: a model switch, a break longer than the cache lifetime, or a context change. Each rebuild re-sends your whole context at full price.</p>
  <figure class="figure">
    ${img('/images/tokendiet-usage.png', 'TokenDiet usage check: a demo session of 227,515 tokens over 5 responses, 38% cache hit, and two cache rebuilds, one from a model switch and one after a 144-minute break, with tips to avoid them', 1200, 520)}
    <figcaption>The usage check on a demo session.</figcaption>
  </figure>
</div></section>

<section class="section" aria-labelledby="how-title"><div class="wrap">
  <h2 id="how-title">How it works</h2>
  <ol class="steps">
    <li><h3>Ask</h3><p>"Put this project on a token diet." Your agent runs the audit and shows the top findings with what each saves.</p></li>
    <li><h3>Approve</h3><p>Pick the fixes you want. TokenDiet backs up each file, then applies the change exactly as its playbook describes.</p></li>
    <li><h3>Compare</h3><p>It measures again and shows before and after for each agent. If you use Tokenmeter, the result appears in its dashboard.</p></li>
  </ol>
</div></section>

<section class="section" aria-labelledby="results-title"><div class="wrap">
  <h2 id="results-title">On the demo project</h2>
  <div class="stat-row">
    <div class="stat"><span class="num">${n(DEMO.claudeBefore)} → <span class="green">${n(DEMO.claudeAfter)}</span></span><span class="what">tokens per request, Claude Code</span></div>
    <div class="stat"><span class="num">${n(DEMO.cursorBefore)} → <span class="green">${n(DEMO.cursorAfter)}</span></span><span class="what">tokens per request, Cursor</span></div>
    <div class="stat"><span class="num">${DEMO.findings}</span><span class="what">findings with fixes</span></div>
  </div>
  <p class="muted">The demo project ships with TokenDiet so you can try it safely. Your results depend on your setup; counts are estimates within about ±20%.</p>
</div></section>

<section class="section" id="pricing" aria-labelledby="pricing-title"><div class="wrap">
  <h2 id="pricing-title">Pricing</h2>
  <div class="grid top">
    <div class="card accent-green">
      <h3>TokenDiet</h3>
      <p class="price-block"><span class="amount">$${SITE.price}</span><span class="terms">one-time payment, no subscription</span></p>
      ${SITE.agensiUrl ? '' : '<p class="availability">Launching soon on Agensi</p>'}
      <ul class="checklist">
        <li>The skill, scripts and playbook</li>
        <li>A demo project to try it safely first</li>
        <li>Updates included: new versions reach you through Agensi</li>
        <li>Use for yourself, or for your whole team or company</li>
        <li>30-day money-back guarantee</li>
        <li>Support through GitHub, with replies within ${SITE.responseTime}</li>
      </ul>
      ${SITE.agensiUrl ? `<div class="cta-row">${buyTokenDiet('pricing')}</div>` : ''}
      <p class="cta-note">${SITE.agensiUrl ? 'Sold by Agensi, which handles payment and refunds.' : 'Sold through Agensi, which handles payment and refunds. A buy button appears here when the listing is live.'} See the <a href="/terms/">terms and refunds</a>.</p>
    </div>
    <div class="card">
      <h3>Requirements</h3>
      <ul class="checklist">
        <li>An agent that supports Agent Skills (SKILL.md)</li>
        <li>Node.js 18 or newer</li>
        <li>Claude Code, for the session usage check</li>
      </ul>
      <h3>After you buy</h3>
      <p>Follow the <a href="/tokendiet/thanks/">install guide</a>. It takes about a minute.</p>
    </div>
  </div>
</div></section>

${dietFaq.html}`,
};

// ---------------------------------------------------------------- TokenDiet: thanks / install guide

const thanks = {
  path: '/tokendiet/thanks/',
  title: 'Thanks for getting TokenDiet: install guide',
  description: 'How to install TokenDiet in Claude Code and other agents, check that it works, and run your first token diet.',
  ogImage: '/images/og-tokendiet.png',
  breadcrumbs: [{ name: 'TokenDiet', path: '/tokendiet/' }, { name: 'Install guide', path: '/tokendiet/thanks/' }],
  noindex: true,
  body: `
<section class="hero" aria-labelledby="thanks-title"><div class="wrap">
  <h1 id="thanks-title">Thanks for getting TokenDiet</h1>
  <p class="lead">Here's how to install it and run your first diet. It takes about a minute.</p>
</div></section>

<section class="section" aria-labelledby="install-title"><div class="wrap">
  <h2 id="install-title">1. Install it</h2>
  <h3>Claude Code</h3>
  <p>Unzip the download into your skills folder (if your download has a different file name, use that). On macOS or Linux:</p>
  ${command('mkdir -p ~/.claude/skills && unzip tokendiet-1.0.0.zip -d ~/.claude/skills/tokendiet', 'macOS or Linux install command')}
  <p>On Windows, in PowerShell:</p>
  ${command('Expand-Archive tokendiet-1.0.0.zip -DestinationPath "$HOME\\.claude\\skills\\tokendiet"', 'Windows PowerShell install command')}
  <p>To install it for one project only, unzip into that project's <code>.claude/skills/tokendiet</code> folder instead.</p>
  <h3>Other agents</h3>
  <p>TokenDiet is a standard Agent Skill with <code>SKILL.md</code> at the root of the zip. Use Agensi's install instructions for your agent, or place the folder wherever your agent loads skills from.</p>
</div></section>

<section class="section" aria-labelledby="check-title"><div class="wrap">
  <h2 id="check-title">2. Check Node.js</h2>
  <p>TokenDiet's scripts need Node.js 18 or newer. Check with:</p>
  ${command('node --version', 'Check the Node.js version')}
  <p>If it's missing or older, install it from <a href="https://nodejs.org/">nodejs.org</a>.</p>
</div></section>

<section class="section" aria-labelledby="run-title"><div class="wrap">
  <h2 id="run-title">3. Run your first diet</h2>
  <p>Start a new session in your project and ask:</p>
  <ul class="checklist">
    <li>"Put this project on a token diet"</li>
    <li>"Where are my tokens going?" (usage check, Claude Code)</li>
  </ul>
  <p>Want to try it on a sample first? Ask your agent to "run the TokenDiet demo". In Claude Code you can also type <code>/tokendiet</code>. Your agent shows the findings and asks before changing anything. Backups go to <code>.tokendiet/backup</code> in your project.</p>
  <div class="notice"><p>Changes to always-loaded files apply from the next session. In Claude Code, that's after <code>/clear</code>, <code>/compact</code> or a restart.</p></div>
</div></section>

<section class="section" aria-labelledby="help-title"><div class="wrap">
  <h2 id="help-title">Need help?</h2>
  <p><a href="${SITE.issues}">Open a GitHub issue</a> and I'll reply within ${SITE.responseTime}. Want to see your usage live after every message? Install the free <a href="/tokenmeter/">Tokenmeter</a> plugin; it also shows your TokenDiet results.</p>
</div></section>`,
};

// ---------------------------------------------------------------- Tokenmeter

const meterFaq = faq([
  ['Is it really free?', `Yes. Tokenmeter is open source under the MIT license. The code is on <a href="${SITE.tokenmeterRepo}">GitHub</a>.`],
  ['Why do its numbers differ from other tools?', 'Claude Code writes each response to its log once per content block, and every copy repeats the same usage. Tokenmeter counts each response once. Tools that add up every line report roughly three times as many tokens.'],
  ['Does it work in the Claude desktop app?', 'Yes, in the Code tab, as well as in the terminal and VS Code. Conversations in the Chat tab aren\'t logged on your computer, so they aren\'t counted.'],
  ['Why don\'t I see plan-limit bars?', 'They appear when you sign in to Claude Code with a Claude subscription, after the first reply in a session. With an API key you still get every token count and the context window.'],
  ['What does it need?', 'Claude Code with plugin support, and Node.js 20 or newer for the dashboard and log reading.'],
], 'tokenmeter-faq');

const tokenmeter = {
  path: '/tokenmeter/',
  title: 'Tokenmeter: free token usage pane and dashboard for Claude Code',
  ogTitle: 'Tokenmeter: see where your Claude Code tokens go',
  description: 'A free, open-source Claude Code plugin: live tokens, context fill and plan limits in every session, plus a local dashboard with 90 days of history.',
  ogImage: '/images/og-tokenmeter.png',
  ogImageAlt: 'Tokenmeter: see where your Claude Code tokens go',
  ogType: 'product',
  breadcrumbs: [{ name: 'Tokenmeter', path: '/tokenmeter/' }],
  schema: [tokenmeterApp, person, meterFaq.schema],
  sticky: { label: 'Tokenmeter · free', cta: 'Install', href: '/tokenmeter/#install' },
  body: `
<section class="hero" aria-labelledby="meter-title"><div class="wrap">
  <p class="eyebrow">Claude Code plugin · free and open source</p>
  <h1 id="meter-title"><span aria-hidden="true">${wordmark('Tokenmeter')}</span><span class="visually-hidden">Tokenmeter</span></h1>
  <p class="lead">See where your Claude Code tokens go: a live pane in every session, and a local dashboard with the full history.</p>
  <div class="cta-row">
    <a class="btn btn-primary" href="#install">Install Tokenmeter</a>
    <a class="btn btn-secondary" href="${SITE.tokenmeterRepo}">View on GitHub</a>
  </div>
  <p class="cta-note">MIT license · no account · nothing leaves your computer</p>
  <figure class="figure">
    ${img('/images/tokenmeter-dashboard.png', 'Tokenmeter dashboard with demo data: last session, 14.35 million tokens today, a 30-day projection, 95.2% cache hit rate, plan limits at 37.5% (5-hour) and 18% (weekly), and a usage summary', 1280, 900, true)}
    <figcaption>The dashboard, shown with built-in demo data.</figcaption>
  </figure>
</div></section>

<section class="section" aria-labelledby="meter-features"><div class="wrap">
  <h2 id="meter-features">What you get</h2>
  <div class="grid">
    <div class="card accent-orange">
      <h3>Tokens pane, in every session</h3>
      <ul class="checklist">
        <li>This session's tokens, cache use and tool calls</li>
        <li>How full the context window is</li>
        <li>Your 5-hour and weekly plan limits, with reset times</li>
        <li>Today, the last 7 days and all-time totals</li>
        <li>Your project's TokenDiet result, when you have one</li>
      </ul>
    </div>
    <div class="card">
      <h3>Dashboard, on your computer</h3>
      <ul class="checklist">
        <li>14-day chart of input, output and cache tokens</li>
        <li>90-day heatmap and peak hours</li>
        <li>Projects, sessions, models and tools</li>
        <li>Instruction weight per project, from TokenDiet</li>
        <li>An idle pixel companion</li>
      </ul>
    </div>
  </div>
</div></section>

<section class="section" id="install" aria-labelledby="install-meter"><div class="wrap">
  <h2 id="install-meter">Install</h2>
  <h3>The pane</h3>
  <p>From a terminal:</p>
  ${command('claude plugin install tokenmeter --marketplace bar-madar/claude-tokenmeter', 'Install command for a terminal')}
  <p>Or at the prompt of a Claude Code session:</p>
  ${command('/plugin install tokenmeter --marketplace bar-madar/claude-tokenmeter', 'Install command for a Claude Code session')}
  <p>In the Claude desktop app: click <strong>+</strong> next to the prompt box, choose <strong>Plugins</strong>, then <strong>Add marketplace</strong> with <code>bar-madar/claude-tokenmeter</code>, and <strong>Add plugin</strong>. Start a new session and the pane opens; type <code>/tokens</code> to bring it back.</p>
  <h3>The dashboard</h3>
  ${command('git clone https://github.com/bar-madar/claude-tokenmeter && cd claude-tokenmeter && npm start', 'Commands to run the dashboard')}
  <p>It opens <code>http://localhost:4545</code>. There's nothing to <code>npm install</code>. Try <code>npm run demo</code> to see it with made-up data.</p>
</div></section>

<section class="section" aria-labelledby="meter-diet"><div class="wrap">
  <h2 id="meter-diet">Works with TokenDiet</h2>
  <p class="lead">When a session's context passes half the window, or its prompt cache keeps missing, the pane suggests a diet. After a <a href="/tokendiet/">TokenDiet</a> audit, the pane and dashboard show your project's instruction weight, before and after. Tokenmeter stays free and works fully on its own.</p>
</div></section>

<section class="section" aria-labelledby="meter-private"><div class="wrap">
  <h2 id="meter-private">Private and accurate</h2>
  <div class="grid">
    <div class="card"><h3>Stays on your computer</h3><p>Reads the logs Claude Code already keeps locally, listens on 127.0.0.1 only, and sends nothing anywhere. No analytics, no telemetry, no update checks.</p></div>
    <div class="card"><h3>Counts each response once</h3><p>Claude Code logs a response once per content block. Tokenmeter counts it once, so its totals match what was actually used.</p></div>
    <div class="card"><h3>Open source</h3><p>MIT license, no dependencies, tests on Windows, macOS and Linux. <a href="${SITE.tokenmeterRepo}">Read the code</a>.</p></div>
  </div>
</div></section>

${meterFaq.html}`,
};

// ---------------------------------------------------------------- support

const support = {
  path: '/support/',
  title: 'Support for Tokenmeter and TokenDiet',
  description: `Get help with Tokenmeter or TokenDiet: open a GitHub issue and get a reply within ${SITE.responseTime}. What to include, and quick answers.`,
  breadcrumbs: [{ name: 'Support', path: '/support/' }],
  body: `
<section class="hero" aria-labelledby="support-title"><div class="wrap">
  <h1 id="support-title">Support</h1>
  <p class="lead">Questions, bugs and ideas go through GitHub issues. I reply within ${SITE.responseTime}.</p>
  <div class="cta-row">
    <a class="btn btn-primary" href="${SITE.tokenmeterRepo}/issues/new">Report a Tokenmeter issue</a>
    <a class="btn btn-secondary" href="${SITE.issues}/new">Report a TokenDiet or website issue</a>
  </div>
  <p class="cta-note">GitHub issues are public. Don't include private code, keys or personal details.</p>
</div></section>

<section class="section" aria-labelledby="include-title"><div class="wrap">
  <h2 id="include-title">What to include</h2>
  <ul class="checklist">
    <li>Which tool, and what you expected to happen</li>
    <li>Your operating system, <code>claude --version</code> and <code>node --version</code></li>
    <li>Any error text, with private details removed</li>
  </ul>
</div></section>

<section class="section" aria-labelledby="quick-title"><div class="wrap">
  <h2 id="quick-title">Quick answers</h2>
  <div class="grid">
    <div class="card"><h3>Tokenmeter</h3><p>Installing, plan limits and why the numbers differ from other tools: see the <a href="/tokenmeter/#tokenmeter-faq">Tokenmeter FAQ</a> and the <a href="${SITE.tokenmeterRepo}#troubleshooting">troubleshooting guide</a>.</p></div>
    <div class="card"><h3>TokenDiet</h3><p>Installing and your first diet: see the <a href="/tokendiet/thanks/">install guide</a> and the <a href="/tokendiet/#tokendiet-faq">TokenDiet FAQ</a>. Refunds are handled by Agensi; see the <a href="/terms/">terms</a>.</p></div>
  </div>
</div></section>`,
};

// ---------------------------------------------------------------- legal

const legal = (path, title, description, heading, body) => ({
  path, title, description, breadcrumbs: [{ name: heading, path }],
  body: `<div class="wrap"><article class="prose" aria-labelledby="legal-title"><h1 id="legal-title">${heading}</h1><p class="updated">Last updated: <time datetime="${SITE.updated}">October 29, 2026</time></p>${body}</article></div>`,
});

const privacy = legal('/privacy/', 'Privacy policy · Tokenmeter & TokenDiet',
  'How this website, Tokenmeter and TokenDiet handle data: no cookies, no tracking, no data collection. Both tools run locally and send nothing anywhere.',
  'Privacy policy', `
<p>This policy covers this website (bar-madar.github.io), the Tokenmeter plugin and dashboard, and the TokenDiet skill. They are made by ${SITE.author}, an independent developer, who is responsible for them. The short version: none of them collect personal data.</p>

<h2>This website</h2>
<ul>
  <li>It uses no cookies, local storage, analytics, advertising or tracking of any kind.</li>
  <li>It has no forms and asks you for no information.</li>
  <li>It loads no fonts, scripts or images from other sites.</li>
  <li>It is hosted on GitHub Pages. Like any web host, GitHub may process technical data such as your IP address to deliver and protect the site. See the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub privacy statement</a>.</li>
</ul>

<h2>Tokenmeter and TokenDiet</h2>
<ul>
  <li>Both run entirely on your computer. They read files there (Claude Code's session logs, and your agent instruction files for TokenDiet) and send nothing anywhere.</li>
  <li>Tokenmeter writes one file, <code>tokenmeter-live.json</code>, in your Claude config folder. TokenDiet writes backups inside your project and a short audit summary (numbers and finding titles, no file contents) in <code>~/.claude/tokendiet/</code>. These files stay on your computer.</li>
  <li>Neither tool contains analytics, telemetry or update checks.</li>
</ul>

<h2>Buying TokenDiet</h2>
<p>TokenDiet is sold through Agensi, which acts as the seller and processes payment through Stripe. Your purchase data is handled under <a href="https://agensi.io/terms">Agensi's terms</a> and privacy policy. If Agensi shares order details with me to resolve a support request, I use them only for that purpose.</p>

<h2>Support requests</h2>
<p>Support runs through GitHub issues, which are public and governed by GitHub's terms and privacy statement. Please don't post personal details there. If a request needs private information, say so in the issue and I'll suggest a private channel.</p>

<h2>Your rights</h2>
<p>Under Israel's Protection of Privacy Law and other laws that may apply to you, such as the GDPR, you can ask what personal data is held about you and have it corrected or deleted. Since neither the site nor the tools collect personal data, there is normally nothing to provide. For any privacy question, <a href="${SITE.issues}">open an issue</a>.</p>

<h2>Changes</h2>
<p>If this policy changes, the new version will be posted here with a new date.</p>`);

const terms = legal('/terms/', 'Terms of use and refunds · Tokenmeter & TokenDiet',
  'Terms for this website, the free Tokenmeter plugin and the paid TokenDiet skill: licenses, purchases and refunds through Agensi, warranty and governing law.',
  'Terms of use and refunds', `
<p>These terms cover this website, Tokenmeter and TokenDiet, made by ${SITE.author}. By using them you agree to these terms.</p>

<h2>The website</h2>
<p>The site and its content are provided for information. You may link to it and share it. Its text, screenshots and graphics are © ${SITE.author} unless stated otherwise; all screenshots show the products themselves with demo data.</p>

<h2>Tokenmeter</h2>
<p>Tokenmeter is free, open-source software under the <a href="${SITE.tokenmeterRepo}/blob/main/LICENSE">MIT license</a>, which governs its use.</p>

<h2>TokenDiet license</h2>
<p>Buying TokenDiet gives you a perpetual, non-exclusive license to install, use and modify it, either for yourself or, if you bought it for a company or organization, for that organization's own employees and contractors. You may not resell, share publicly or redistribute it, or a modified version of it. The full license is included as <code>LICENSE.txt</code> in the download.</p>

<h2>Purchases and refunds</h2>
<ul>
  <li>TokenDiet is sold through Agensi, which acts as the seller (merchant of record), processes payment and delivers the download. Its <a href="https://agensi.io/terms">terms</a> apply to your purchase.</li>
  <li>Every purchase comes with a 30-day money-back guarantee. To ask for a refund, use Agensi's refund process within 30 days of buying. If you run into a problem with the product itself, you're also welcome to <a href="${SITE.issues}">open an issue</a>; most problems can be fixed quickly.</li>
  <li>Updates are delivered through Agensi: when a new version is released, it replaces the download on your purchase at no extra cost.</li>
  <li>Nothing in these terms limits rights you have under consumer protection law, including Israel's Consumer Protection Law where it applies.</li>
</ul>

<h2>No warranty</h2>
<p>Both tools are provided "as is". Token counts are estimates. TokenDiet asks before changing files and backs them up first, but you are responsible for reviewing changes and for your data.</p>

<h2>Limitation of liability</h2>
<p>To the extent the law allows, ${SITE.author} is not liable for indirect, incidental or consequential damages arising from use of the site or the tools, and total liability for TokenDiet is limited to the amount you paid for it.</p>

<h2>Trademarks</h2>
<p>Claude is a trademark of Anthropic. Tokenmeter and TokenDiet are independent and not affiliated with or endorsed by Anthropic, Agensi, Cursor, GitHub or any other company named on this site.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of the State of Israel, and the competent courts in Israel have jurisdiction, unless the consumer law of your country gives you the right to bring a claim where you live.</p>

<h2>Contact and changes</h2>
<p>Questions: <a href="${SITE.issues}">open a GitHub issue</a>. If these terms change, the new version will be posted here with a new date.</p>`);

const cookies = legal('/cookies/', 'Cookie policy · Tokenmeter & TokenDiet',
  'This website uses no cookies, local storage or tracking technologies, so there is no cookie banner and nothing to consent to.',
  'Cookie policy', `
<p>This website does not use cookies, local storage, session storage, tracking pixels, fingerprinting or any similar technology. That is why there is no cookie banner: there is nothing to consent to.</p>
<p>Your browser may keep its own cache of the pages and images to load them faster. That is a normal browser feature, and you control it in your browser's settings.</p>
<p>Links to other sites, such as GitHub and Agensi, take you to sites with their own cookie policies.</p>
<p>The Tokenmeter dashboard runs on your own computer and doesn't use cookies either.</p>`);

const accessibility = legal('/accessibility/', 'Accessibility statement · Tokenmeter & TokenDiet',
  'How this website is built to be accessible: WCAG 2.1 AA, covering Israeli Standard 5568, what was done, known limitations and how to report a problem.',
  'Accessibility statement', `
<p>I want this website to be usable by everyone, including people who use screen readers, keyboard navigation, magnification or other assistive technology.</p>

<h2>Standard</h2>
<p>The site is built to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. This covers the requirements of Israeli Standard 5568, which is based on WCAG 2.0 level AA, under the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013.</p>

<h2>What was done</h2>
<ul>
  <li>Semantic structure: one main heading per page, landmarks, labelled navigation and breadcrumbs.</li>
  <li>Full keyboard use, a "skip to content" link, and a clearly visible focus outline.</li>
  <li>Text and controls meet WCAG AA contrast in both the dark and light themes, which follow your system setting.</li>
  <li>Every image has a text alternative that describes what it shows.</li>
  <li>Text resizes up to 200% without loss of content, and layouts adapt to small screens.</li>
  <li>No content flashes or moves on its own, and the site honours the "reduce motion" setting.</li>
  <li>Questions and answers use native disclosure elements that work with screen readers.</li>
  <li>Pages were checked with the automated axe accessibility tester and by keyboard.</li>
</ul>

<h2>Known limitations</h2>
<ul>
  <li>The product screenshots are images of software. Each has a text description, and the same information appears in the page text.</li>
  <li>Links to GitHub and Agensi lead to sites with their own accessibility.</li>
</ul>

<h2>Report a problem</h2>
<p>If something on the site is hard to use, please <a href="${SITE.issues}">open a GitHub issue</a> describing the page and the problem. Accessibility issues are handled first, with a reply within ${SITE.responseTime}. Contact: ${SITE.author}.</p>`);

// ---------------------------------------------------------------- 404

const notFound = {
  path: '/404.html',
  title: 'Page not found · Tokenmeter & TokenDiet',
  description: 'This page does not exist. Find Tokenmeter, TokenDiet, the install guide and support from here.',
  noindex: true,
  body: `
<section class="hero" aria-labelledby="nf-title"><div class="wrap">
  <p class="eyebrow">404</p>
  <h1 id="nf-title">This page went on a diet</h1>
  <p class="lead">It doesn't exist anymore, or never did. Here's where you can go instead:</p>
  <ul class="link-list">
    <li><a class="arrow-link" href="/">Home</a></li>
    <li><a class="arrow-link" href="/tokendiet/">TokenDiet</a> <span class="muted">· the skill that trims your instructions</span></li>
    <li><a class="arrow-link" href="/tokenmeter/">Tokenmeter</a> <span class="muted">· the free usage pane and dashboard</span></li>
    <li><a class="arrow-link" href="/tokendiet/thanks/">TokenDiet install guide</a></li>
    <li><a class="arrow-link" href="/support/">Support</a></li>
  </ul>
</div></section>`,
};

module.exports = [home, tokendiet, thanks, tokenmeter, support, privacy, terms, cookies, accessibility, notFound];
