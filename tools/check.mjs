// Usage: node tools/check.mjs [--shots <dir>] menus/001-x.html [...]
// Verifies each menu in EN + AR at mobile + desktop: no horizontal overflow,
// correct lang/dir, working toggle, no JS errors, enough bilingual content.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const args = process.argv.slice(2);
let shots = null; const files = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--shots') shots = args[++i]; else files.push(args[i]); }
if (shots) fs.mkdirSync(shots, { recursive: true });
const views = { mobile: { width: 375, height: 812 }, desktop: { width: 1440, height: 900 } };
const browser = await chromium.launch();
let failed = 0;
for (const f of files) {
  const problems = [];
  const base = path.basename(f, '.html');
  for (const lang of ['en', 'ar']) for (const [vn, vp] of Object.entries(views)) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const tag = `${lang}/${vn}`;
    page.on('pageerror', e => problems.push(`${tag}: JS error: ${e.message}`));
    await page.goto('file://' + path.resolve(f) + '?lang=' + lang, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready.then(() => 1)).catch(() => {});
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const vis = l => [...document.querySelectorAll(`[lang="${l}"]`)].filter(e => e !== de && e.offsetParent !== null).length;
      const all = l => [...document.querySelectorAll(`[lang="${l}"]`)].filter(e => e !== de).length;
      const wide = [];
      if (de.scrollWidth > innerWidth + 1) for (const e of document.querySelectorAll('body *')) {
        const b = e.getBoundingClientRect();
        if (b.width > 0 && (b.right > innerWidth + 2 || b.left < -2) && wide.length < 4) wide.push(e.tagName.toLowerCase() + (e.className && e.className.baseVal === undefined ? '.' + String(e.className).split(' ')[0] : ''));
      }
      return { lang: de.lang, dir: de.dir, sw: de.scrollWidth, iw: innerWidth, sh: de.scrollHeight, visEn: vis('en'), visAr: vis('ar'), allEn: all('en'), allAr: all('ar'),
        toggle: !!document.getElementById('langToggle'), home: !!document.querySelector('a.home-link[href="../index.html"]'), wide,
        ff: getComputedStyle(document.body).fontFamily };
    });
    if (r.lang !== lang) problems.push(`${tag}: html lang is "${r.lang}"`);
    if (r.dir !== (lang === 'ar' ? 'rtl' : 'ltr')) problems.push(`${tag}: html dir is "${r.dir}"`);
    if (r.sw > r.iw + 1) problems.push(`${tag}: horizontal overflow ${r.sw}px > ${r.iw}px (e.g. ${r.wide.join(', ')})`);
    if (lang === 'en' && r.visAr) problems.push(`${tag}: ${r.visAr} Arabic elements visible in EN mode`);
    if (lang === 'ar' && r.visEn) problems.push(`${tag}: ${r.visEn} English elements visible in AR mode`);
    if (r.allEn < 40 || r.allAr < 40) problems.push(`${tag}: too little bilingual content (en=${r.allEn}, ar=${r.allAr} lang-tagged elements)`);
    if (Math.abs(r.allEn - r.allAr) > 3) problems.push(`${tag}: EN/AR element counts differ (${r.allEn} vs ${r.allAr}) - missing translations?`);
    if (!r.toggle) problems.push(`${tag}: #langToggle missing`);
    if (!r.home) problems.push(`${tag}: a.home-link[href="../index.html"] missing`);
    if (r.sh < vp.height) problems.push(`${tag}: page shorter than viewport?`);
    if (shots) await page.screenshot({ path: path.join(shots, `${base}.${lang}.${vn}.png`), fullPage: true });
    if (lang === 'en' && vn === 'mobile' && r.toggle) {
      await page.evaluate(() => document.getElementById('langToggle').click());
      const l2 = await page.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir);
      if (l2 !== 'ar/rtl') problems.push(`toggle click did not switch to ar/rtl (got ${l2})`);
    }
    await ctx.close();
  }
  const src = fs.readFileSync(f, 'utf8');
  if (/<img[^>]+src=["']https?:/i.test(src)) problems.push('external <img> found (only inline SVG/CSS art allowed)');
  if (!/name=["']viewport["']/.test(src)) problems.push('viewport meta missing');
  console.log((problems.length ? 'FAIL ' : 'PASS ') + f); problems.forEach(p => console.log('   - ' + p));
  if (problems.length) failed++;
}
await browser.close();
process.exit(failed ? 1 : 0);
