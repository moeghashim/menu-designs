// Packs the static site into a single Pages advanced-mode worker bundle (assets as data modules).
import fs from 'node:fs'; import path from 'node:path';
const [root, tw, out] = process.argv.slice(2);
const files = [];
files.push(['index.html', Buffer.from(fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/(thumbs\/[^"]+)\.jpg"/g, '$1.webp"'))]);
for (const f of fs.readdirSync(path.join(root, 'menus')).sort()) files.push(['menus/' + f, fs.readFileSync(path.join(root, 'menus', f))]);
for (const f of fs.readdirSync(tw).sort()) files.push(['thumbs/' + f, fs.readFileSync(path.join(tw, f))]);
let js = '';
files.forEach(([p], i) => { js += `import a${i} from "./a/${i}.bin";\n`; });
js += 'const A = new Map([' + files.map(([p], i) => `[${JSON.stringify('/' + p)}, a${i}]`).join(',') + ']);\n';
js += `const T = { html: 'text/html; charset=utf-8', webp: 'image/webp', jpg: 'image/jpeg' };
export default { async fetch(req) {
  const u = new URL(req.url); let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  let b = A.get(p); if (!b && A.has(p + '.html')) { p += '.html'; b = A.get(p); }
  if (!b) return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain' } });
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const ext = p.slice(p.lastIndexOf('.') + 1);
  return new Response(req.method === 'HEAD' ? null : b, { headers: { 'content-type': T[ext] || 'application/octet-stream', 'cache-control': ext === 'html' ? 'public, max-age=300' : 'public, max-age=86400', 'x-content-type-options': 'nosniff' } });
} };\n`;
const inner = new FormData();
inner.set('metadata', JSON.stringify({ main_module: 'worker.js', compatibility_date: '2025-09-01' }));
inner.set('worker.js', new File([js], 'worker.js', { type: 'application/javascript+module' }));
files.forEach(([p, buf], i) => inner.set(`a/${i}.bin`, new File([buf], `a/${i}.bin`, { type: 'application/octet-stream' })));
const innerBlob = await new Response(inner).blob();
const outer = new FormData();
outer.set('manifest', '{}'); outer.set('branch', 'main');
outer.set('_worker.bundle', innerBlob, '_worker.bundle');
const r = new Response(outer);
fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
fs.writeFileSync(out + '.ct', r.headers.get('content-type'));
console.log(files.length, 'files', (fs.statSync(out).size / 1e6).toFixed(2) + ' MB');
