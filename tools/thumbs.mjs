// Renders gallery thumbnails (EN + AR) for every menu: node tools/thumbs.mjs [menus/x.html ...]
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const files = process.argv.length > 2 ? process.argv.slice(2) : fs.readdirSync('menus').filter(f => f.endsWith('.html')).map(f => 'menus/' + f);
fs.mkdirSync('thumbs', { recursive: true });
const browser = await chromium.launch();
const N = 4; let i = 0;
await Promise.all(Array.from({ length: N }, async () => {
  while (i < files.length) {
    const f = files[i++]; const base = path.basename(f, '.html');
    for (const lang of ['en', 'ar']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.5, reducedMotion: 'no-preference' });
      const page = await ctx.newPage();
      await page.goto('file://' + path.resolve(f) + '?lang=' + lang, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready.then(() => 1)).catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `thumbs/${base}.${lang}.jpg`, type: 'jpeg', quality: 72 });
      await ctx.close();
    }
  }
}));
await browser.close();
console.log('thumbs:', files.length);
