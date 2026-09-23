// Parity verification: baseline (_backup/index.html) vs Vite production build.
// Compares console errors, rendered content, interactions, and pixel screenshots.
// Timing-fair: baseline & dev pages are measured at the same elapsed offset, and
// the collection autoplay is frozen to slide 0 before pixel capture.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PREVIEW_PORT = 4173;
const BASELINE_PORT = 4174;
const OUT = new URL('../_compare/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const children = [];
const killAll = () => { for (const c of children) { try { c.kill('SIGTERM'); } catch {} } };
process.on('exit', killAll);
process.on('SIGINT', () => { killAll(); process.exit(130); });

function serve(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: 'ignore', ...opts });
  children.push(child);
  return child;
}

async function waitFor(url, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Server not reachable: ${url}`);
}

function diffImages(aPath, bPath) {
  const a = PNG.sync.read(readFileSync(aPath));
  const b = PNG.sync.read(readFileSync(bPath));
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const crop = png => {
    if (png.width === w && png.height === h) return png;
    const out = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) png.data.copy(out.data, y * w * 4, y * png.width * 4, y * png.width * 4 + w * 4);
    return out;
  };
  const a2 = crop(a);
  const b2 = crop(b);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(a2.data, b2.data, diff.data, w, h, { threshold: 0.1 });
  writeFileSync(path.join(OUT, `${path.basename(aPath, '.png')}__DIFF.png`), PNG.sync.write(diff));
  return { ratio: n / (w * h), pixels: n, dims: `${a.width}x${a.height} vs ${b.width}x${b.height}` };
}

const snapContent = () => {
  // Deterministic: freeze the collection slider to slide 0 so timing of autoplay
  // does not affect the comparison.
  const card = document.getElementById('collectionCard');
  window.setCollectionSlide(0);
  return new Promise(resolve => {
    setTimeout(() => {
      const g = id => document.getElementById(id);
      resolve({
        heroTitle: g('heroTitle').innerHTML,
        heroTagline: g('heroTagline').innerHTML,
        collectionSlider: g('collectionSlider').innerHTML,
        trustTitle: g('trustTitle').outerHTML,
        trustDots: g('trustDots').innerHTML,
        programsList: g('programsList').innerHTML,
        facilitiesTitle: g('facilitiesTitle').innerHTML,
        facilitiesBody: g('facilitiesBody').innerHTML,
        facilitiesCards: g('facilitiesCards').innerHTML,
        statsGrid: g('statsGrid').innerHTML,
        testimonialsGrid: g('testimonialsGrid').innerHTML,
        footerCtaTitle: g('footerCtaTitle').textContent,
        modalTitle: g('modalTitle').innerHTML,
        hasLoader: !!g('loader'),
        collectionBrand: card.querySelector('.collection-card-brand').textContent,
        collectionImg: card.querySelector('.collection-card-img').getAttribute('src'),
        trustCoachName: document.querySelector('.trust-coach-name').textContent,
        trustCoachRole: document.querySelector('.trust-coach-role').textContent
      });
    }, 450);
  });
};

const interactions = {
  async modalOpen(p) { await p.evaluate(() => window.openModal()); await sleep(750); },
  async modalClose(p) { await p.evaluate(() => window.closeModal()); await sleep(750); },
  async menuOpen(p) { await p.evaluate(() => window.openMenu()); await sleep(750); },
  async menuClose(p) { await p.evaluate(() => window.closeMenu()); await sleep(750); }
};

async function measureInteractions(page) {
  const out = {};
  await interactions.modalOpen(page);
  out.modalOpen = await page.evaluate(() => ({
    backdropPointerEvents: document.getElementById('modalBackdrop').style.pointerEvents,
    backdropOpacity: document.getElementById('modalBackdrop').style.opacity,
    panelOpacity: document.getElementById('modalPanel').style.opacity
  }));
  await page.evaluate(() => {
    document.getElementById('name').value = 'Alex Rivera';
    document.getElementById('contactForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await sleep(1000);
  out.formSuccess = await page.evaluate(() => ({
    display: document.getElementById('modalSuccess').style.display,
    text: document.getElementById('successText').textContent
  }));
  await interactions.modalClose(page);
  out.modalClosed = await page.evaluate(() => document.getElementById('modalBackdrop').style.pointerEvents);

  await interactions.menuOpen(page);
  out.menuOpen = await page.evaluate(() => ({ backdropPointerEvents: document.getElementById('menuBackdrop').style.pointerEvents }));
  await interactions.menuClose(page);
  out.menuClosed = await page.evaluate(() => document.getElementById('menuBackdrop').style.pointerEvents);

  out.trustBefore = await page.evaluate(() => document.getElementById('trustTitle').innerText);
  await page.evaluate(() => window.nextTrustSlide());
  await sleep(750);
  out.trustAfter = await page.evaluate(() => document.getElementById('trustTitle').innerText);
  out.trustActiveDot = await page.evaluate(() =>
    [...document.querySelectorAll('#trustDots .carousel-dot')].findIndex(d => d.classList.contains('active')));
  await page.evaluate(() => window.setTrustSlide(0));

  await page.evaluate(() => window.setCollectionSlide(2));
  await sleep(450);
  out.collectionTitle = await page.evaluate(() => document.querySelector('.collection-card-title').textContent);
  out.collectionActiveDot = await page.evaluate(() =>
    [...document.querySelectorAll('#collectionDots .carousel-dot')].findIndex(d => d.classList.contains('active')));
  await page.evaluate(() => window.setCollectionSlide(0));
  return out;
}

async function gotoControlled(browser, url, errors, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on('pageerror', err => errors.push(`PAGEERROR: ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await sleep(3200);
  return page;
}

// Confirms a 3800ms collection autoplay interval is created on load (normal motion).
async function probeAutoplay(browser, url, errorList) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on('pageerror', e => errorList.push(`PAGEERROR: ${e.message}`));
  await page.evaluateOnNewDocument(() => {
    window.__intervals = [];
    const si = window.setInterval;
    window.setInterval = (fn, delay, ...rest) => {
      const id = si(fn, delay, ...rest);
      window.__intervals.push({ delay, src: String(fn).slice(0, 40) });
      return id;
    };
  });
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await sleep(3200);
  const intervals = await page.evaluate(() => window.__intervals);
  await page.close();
  return intervals;
}

// Freeze collection slider to slide 0, re-freezing if a live autoplay tick lands.
async function freezeSlide(page) {
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.setCollectionSlide(0));
    await sleep(400);
    const ok = await page.evaluate(() => {
      const dots = [...document.querySelectorAll('#collectionDots .carousel-dot')];
      const active = dots.findIndex(d => d.classList.contains('active'));
      return active === 0 && document.querySelector('.collection-card-brand').textContent === 'Baseline Pro';
    });
    if (ok) return;
  }
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
  });
  await sleep(1500);
}

async function run() {
  serve('python3', ['-m', 'http.server', String(BASELINE_PORT), '--directory', '.']);
  serve('npm', ['run', 'preview', '--', '--port', String(PREVIEW_PORT), '--strictPort']);
  await waitFor(`http://localhost:${BASELINE_PORT}/_backup/index.html`);
  await waitFor(`http://localhost:${PREVIEW_PORT}/`);

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const errors = { baseline: [], dev: [] };
  const report = {};
  const baseUrl = `http://localhost:${BASELINE_PORT}/_backup/index.html`;
  const devUrl = `http://localhost:${PREVIEW_PORT}/`;
  // Autoplay parity probe (normal motion, both sides)
  report.autoplay = {
    baseline: await probeAutoplay(browser, baseUrl, errors.baseline),
    dev: await probeAutoplay(browser, devUrl, errors.dev)
  };
  report.autoplayEqual = JSON.stringify(report.autoplay.baseline) === JSON.stringify(report.autoplay.dev);

  // Content parity (desktop, same elapsed offset; reduced-motion so autoplay is
  // disabled identically and cannot race the capture)
  const pages = {
    baseline: { desktop: await gotoControlled(browser, baseUrl, errors.baseline, true), mobile: null },
    dev: { desktop: await gotoControlled(browser, devUrl, errors.dev, true), mobile: null }
  };

  // Content parity (desktop, same elapsed offset, slider frozen)
  report.content = {
    baseline: await Promise.race([pages.baseline.desktop.evaluate(snapContent)]),
    dev: await Promise.race([pages.dev.desktop.evaluate(snapContent)])
  };
  report.contentEqual = JSON.stringify(report.content.baseline) === JSON.stringify(report.content.dev);

  // Mobile content parity
  pages.baseline.mobile = await browser.newPage();
  pages.dev.mobile = await browser.newPage();
  for (const [side, u] of [['baseline', baseUrl], ['dev', devUrl]]) {
    const m = pages[side].mobile;
    await m.setViewport({ width: 375, height: 812 });
    m.on('pageerror', e => errors[side].push(`PAGEERROR: ${e.message}`));
    m.on('console', msg => { if (msg.type() === 'error') errors[side].push(msg.text()); });
    await m.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await m.goto(u, { waitUntil: 'load', timeout: 30000 });
    await sleep(3200);
  }
  report.contentMobile = { baseline: await pages.baseline.mobile.evaluate(snapContent) };
  await pages.baseline.mobile.close();
  report.contentMobile.dev = await pages.dev.mobile.evaluate(snapContent);
  report.contentMobileEqual = JSON.stringify(report.contentMobile.baseline) === JSON.stringify(report.contentMobile.dev);
  await pages.dev.mobile.close();

  // Interactions (desktop) — measured under prefers-reduced-motion so the live
  // collection autoplay interval is disabled identically on both sides and cannot
  // race the test inputs.
  report.interactions = {};
  for (const [side, u] of [['baseline', baseUrl], ['dev', devUrl]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    page.on('pageerror', e => errors[side].push(`PAGEERROR: ${e.message}`));
    page.on('console', msg => { if (msg.type() === 'error') errors[side].push(msg.text()); });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(u, { waitUntil: 'load', timeout: 30000 });
    await sleep(3200);
    report.interactions[side] = await measureInteractions(page);
    await page.close();
  }
  report.interactionsEqual = JSON.stringify(report.interactions.baseline) === JSON.stringify(report.interactions.dev);

  // Pixel parity — fresh pages per side so both are captured at the same
  // post-load offset, with autoplay frozen to slide 0 before capture.
  for (const [side, u] of [['baseline', baseUrl], ['dev', devUrl]]) {
    for (const vp of ['desktop', 'mobile']) {
      const size = vp === 'desktop' ? [1440, 900] : [375, 812];
      const page = await browser.newPage();
      await page.setViewport({ width: size[0], height: size[1] });
      page.on('pageerror', e => errors[side].push(`PAGEERROR: ${e.message}`));
      page.on('console', msg => { if (msg.type() === 'error') errors[side].push(msg.text()); });
      await page.goto(u, { waitUntil: 'load', timeout: 30000 });
      await sleep(3200);
      await scrollThrough(page);
      await freezeSlide(page);
      const data = await page.screenshot({ fullPage: true });
      writeFileSync(path.join(OUT, `${side}-${vp}-full.png`), data);
      await page.close();
    }
  }

  report.pixelDiffs = {};
  for (const vp of ['desktop', 'mobile']) {
    report.pixelDiffs[vp] = diffImages(
      path.join(OUT, `baseline-${vp}-full.png`),
      path.join(OUT, `dev-${vp}-full.png`)
    );
  }
  report.consoleErrors = errors;

  await browser.close();
  killAll();
  writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  const passes =
    report.contentEqual && report.contentMobileEqual &&
    report.interactionsEqual &&
    errors.baseline.length === 0 && errors.dev.length === 0 &&
    report.pixelDiffs.desktop.ratio < 0.05 &&
    report.pixelDiffs.mobile.ratio < 0.05;
  console.log(`\nRESULT: ${passes ? 'PASS' : 'CHECK NEEDED'} (see _compare/)`);
  process.exit(passes ? 0 : 1);
}

run().catch(err => { console.error(err); killAll(); process.exit(1); });