'use strict';

// Renders the site's images into src/images with headless Edge or Chrome:
// social cards (1200x630), terminal screenshots of TokenDiet's demo output,
// the Tokenmeter dashboard screenshot and the Apple touch icon.
//
//   node tools/render.cjs
//
// Expects the TokenDiet and Tokenmeter repositories next to this one
// (override with TOKENDIET_DIR and TOKENMETER_DIR), and a browser at the
// usual install path (override with BROWSER).

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'images');
const TOKENDIET = process.env.TOKENDIET_DIR || path.join(ROOT, '..', 'tokendiet');
const TOKENMETER = process.env.TOKENMETER_DIR || path.join(ROOT, '..', 'claude-tokenmeter');
const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'site-render-'));

const BROWSER = process.env.BROWSER || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find(p => fs.existsSync(p));

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const BUDDY = fs.readFileSync(path.join(ROOT, 'src', 'assets', 'favicon.svg'), 'utf8');

const BASE_CSS = `
*{box-sizing:border-box;margin:0}
html,body{width:WIDTHpx;height:HEIGHTpx;overflow:hidden}
body{background:#121212;color:#ececec;font-family:"Cascadia Mono","Cascadia Code",Consolas,monospace}
.wm{font-weight:700;letter-spacing:.06em}.meter{color:#f2843e}.diet{color:#4cc38a}
`;

function page(width, height, css, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS.replace('WIDTH', width).replace('HEIGHT', height)}${css}</style></head><body>${body}</body></html>`;
}

// ---------- social cards ----------

const CARD_CSS = `
body{padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;
  background:radial-gradient(800px 500px at 0% 0%,rgba(242,132,62,.16),transparent 60%),radial-gradient(700px 500px at 100% 100%,rgba(76,195,138,.12),transparent 60%),#121212}
.top{font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:#a0a0a0}
h1{font-size:84px;line-height:1.02;margin:22px 0 26px}
p{font-family:system-ui,"Segoe UI",sans-serif;font-size:34px;line-height:1.3;color:#d0d0d0;max-width:960px}
.foot{display:flex;align-items:center;gap:18px;font-size:26px;color:#a0a0a0}
.foot svg{width:52px;height:48px}
`;

const cards = {
  'og-home.png': `<div><div class="top">For Claude Code and other coding agents</div>
    <h1><span class="wm">TOKEN<span class="meter">METER</span></span> + <span class="wm">TOKEN<span class="diet">DIET</span></span></h1>
    <p>Spend fewer tokens. Lose nothing.</p></div>
    <div class="foot">${BUDDY}<span>bar-madar.github.io</span></div>`,
  'og-tokendiet.png': `<div><div class="top">Agent Skill · $15 one-time</div>
    <h1><span class="wm">TOKEN<span class="diet">DIET</span></span></h1>
    <p>Cut the tokens your coding agent spends on every request, without losing quality.</p></div>
    <div class="foot">${BUDDY}<span>bar-madar.github.io/tokendiet</span></div>`,
  'og-tokenmeter.png': `<div><div class="top">Claude Code plugin · free and open source</div>
    <h1><span class="wm">TOKEN<span class="meter">METER</span></span></h1>
    <p>See where your Claude Code tokens go: a live pane in every session and a local dashboard.</p></div>
    <div class="foot">${BUDDY}<span>bar-madar.github.io/tokenmeter</span></div>`,
};

// ---------- terminal screenshots ----------

const TERM_CSS = `
body{padding:0;background:#161616}
.win{height:100%;overflow:hidden;background:#161616;display:flex;flex-direction:column}
.bar{display:flex;gap:8px;align-items:center;padding:12px 16px;background:#1f1f1f;border-bottom:1px solid #2c2c2c}
.bar i{width:12px;height:12px;border-radius:50%;background:#3a3a3a;display:inline-block}
.bar i:nth-child(1){background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}
.bar span{margin-left:12px;color:#8a8a8a;font-size:14px}
pre{flex:1;margin:0;padding:20px 24px;font:15px/1.5 "Cascadia Mono",Consolas,monospace;color:#d8d8d8;white-space:pre-wrap;overflow:hidden;
  -webkit-mask-image:linear-gradient(#000 88%,transparent)}
.h{color:#ececec;font-weight:700}.g{color:#4cc38a}.o{color:#f2843e}.m{color:#8f8f8f}
`;

function colorize(text) {
  return esc(text).split('\n').map(line => {
    if (/^(TokenDiet audit|This session|Your instructions|Files|Findings|MCP servers|Tips|This project|All projects)/.test(line)) return `<span class="h">${line}</span>`;
    return line
      .replace(/(-&gt; ~[\d,]+ after safe fixes \(-\d+%\))/g, '<span class="g">$1</span>')
      .replace(/(saves ~[\d,]+\/request)/g, '<span class="g">$1</span>')
      .replace(/( · [a-z-]+)$/, '<span class="m">$1</span>')
      .replace(/^(\s+Fix: .*|\s{10}\S.*)$/, '<span class="m">$1</span>')
      .replace(/^(\s{4}\S.*?\s)(model switch .*|idle \d+ min.*)$/, '$1<span class="o">$2</span>');
  }).join('\n');
}

function terminal(title, text) {
  return `<div class="win"><div class="bar"><i></i><i></i><i></i><span>${esc(title)}</span></div><pre>${colorize(text)}</pre></div>`;
}

function demoOutput() {
  const scripts = path.join(TOKENDIET, 'skill', 'scripts');
  const { makeDemo } = require(path.join(scripts, 'demo.cjs'));
  const audit = require(path.join(scripts, 'audit.cjs'));
  const usage = require(path.join(scripts, 'usage.cjs'));
  const base = path.join(WORK, 'demo');
  const { project, home } = makeDemo(base);
  // Show a neutral path instead of this machine's temp folder.
  const tidy = s => s.split(project).join('~/code/acme-web');
  return {
    audit: tidy(audit.printReport(audit.audit(project, home))),
    usage: tidy(usage.printReport(usage.usage(project, { home }))).replace(/\n\nPlan limits:[\s\S]*$/, ''),
  };
}

// ---------- browser ----------

function shoot(html, file, width, height) {
  const src = path.join(WORK, `${path.basename(file, '.png')}.html`);
  fs.writeFileSync(src, html);
  if (fs.existsSync(file)) fs.rmSync(file);
  // A profile of its own, so a browser you already have open can't swallow the job.
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', `--user-data-dir=${path.join(WORK, 'profile')}`,
    `--window-size=${width},${height}`, '--virtual-time-budget=2000', `--screenshot=${file}`, `file:///${src.split(path.sep).join('/')}`];
  return new Promise((resolve, reject) => {
    spawn(BROWSER, args, { stdio: 'ignore' }).on('error', reject);
    // The browser can return before the file is written; wait for it to settle.
    const started = Date.now();
    let last = -1;
    const timer = setInterval(() => {
      const size = fs.existsSync(file) ? fs.statSync(file).size : -1;
      if (size > 0 && size === last) {
        clearInterval(timer);
        resolve(file);
      } else if (Date.now() - started > 30000) {
        clearInterval(timer);
        reject(new Error(`timed out rendering ${path.basename(file)}`));
      }
      last = size;
    }, 400);
  });
}

async function main() {
  if (!BROWSER) throw new Error('No Edge or Chrome found; set BROWSER to its path.');
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [];
  for (const [name, body] of Object.entries(cards)) jobs.push([page(1200, 630, CARD_CSS, body), name, 1200, 630]);
  const demo = demoOutput();
  jobs.push([page(1200, 760, TERM_CSS, terminal('Put this project on a token diet', demo.audit)), 'tokendiet-audit.png', 1200, 760]);
  jobs.push([page(1200, 520, TERM_CSS, terminal('Where are my tokens going?', demo.usage)), 'tokendiet-usage.png', 1200, 520]);
  jobs.push([page(180, 180, 'body{display:grid;place-items:center;background:#121212}svg{width:132px;height:122px}', BUDDY), 'apple-touch-icon.png', 180, 180]);

  for (const [html, name, w, h] of jobs) {
    await shoot(html, path.join(OUT, name), w, h);
    console.log(`  ${name} (${w}x${h})`);
  }
  const dashboard = path.join(TOKENMETER, 'docs', 'images', 'dashboard.png');
  fs.copyFileSync(dashboard, path.join(OUT, 'tokenmeter-dashboard.png'));
  console.log('  tokenmeter-dashboard.png (copied from Tokenmeter)');
  fs.rmSync(WORK, { recursive: true, force: true });
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
