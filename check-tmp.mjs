import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const p = await ctx.newPage();
await p.goto('https://stardust-restyle--opsinventor-eds--treeves.aem.page/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const data = await p.evaluate(() => {
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { x: r.x, y: r.y, w: r.width, h: r.height, cw: cs.width, cmw: cs.maxWidth, padding: cs.padding };
  };
  return {
    innerWidth: innerWidth,
    matchDesktopMq: matchMedia('(width >= 900px)').matches,
    matchWideMq: matchMedia('(width >= 1440px)').matches,
    containerVar: getComputedStyle(document.documentElement).getPropertyValue('--grid-container-width'),
    contentVar: getComputedStyle(document.documentElement).getPropertyValue('--grid-content-width'),
    header: get('header'),
    headerContent: get('header .header-content'),
    brand: get('header .brand-section'),
    nav: get('header .main-nav-section'),
    actions: get('header .actions-section'),
    cta: (() => { const el = document.querySelector('header .actions-section a.btn-accent'); if(!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, w: r.width, text: el.textContent.trim() }; })()
  };
});
await p.screenshot({ path: '/tmp/branch-1920.png', clip: { x: 0, y: 0, width: 1920, height: 140 } });
console.log(JSON.stringify(data, null, 2));
await browser.close();
