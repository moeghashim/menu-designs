// Builds index.html (the gallery) from tools/manifest.txt: node tools/build-gallery.mjs
import fs from 'node:fs';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const items = fs.readFileSync('tools/manifest.txt', 'utf8').trim().split('\n').map(l => {
  const [id, slug, en, arName, cen, car] = l.split('|'); return { id, slug, en, arName, cen, car };
});
const cards = items.map((m, i) => `<a class="card" href="menus/${m.id}-${m.slug}.html" data-q="${esc((m.id + ' ' + m.en + ' ' + m.cen + ' ' + m.arName + ' ' + m.car).toLowerCase())}">
<span class="shot"><img lang="en" src="thumbs/${m.id}-${m.slug}.en.jpg" alt="${esc(m.en)} menu preview" width="640" height="400" loading="${i < 8 ? 'eager' : 'lazy'}" decoding="async"><img lang="ar" src="thumbs/${m.id}-${m.slug}.ar.jpg" alt="معاينة قائمة ${esc(m.arName)}" width="640" height="400" loading="lazy" decoding="async"></span>
<span class="meta"><span class="no"><span lang="en">${m.id}</span><span lang="ar">${ar(m.id)}</span></span><span class="txt"><strong><span lang="en">${esc(m.en)}</span><span lang="ar">${esc(m.arName)}</span></strong><em><span lang="en">${esc(m.cen)}</span><span lang="ar">${esc(m.car)}</span></em></span><span class="go" aria-hidden="true">↗</span></span></a>`).join('\n');
const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>100 Menus · ١٠٠ قائمة طعام</title>
<meta name="description" content="A gallery of 100 one-of-a-kind bilingual (English + Arabic) restaurant menu designs.">
<meta name="theme-color" content="#0e0d0b">
<script>(function(){var l='en';try{var p=new URLSearchParams(location.search).get('lang');l=(p==='ar'||p==='en')?p:(localStorage.getItem('menu-lang')||'en')}catch(e){}var d=document.documentElement;d.lang=l;d.dir=l==='ar'?'rtl':'ltr'})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Instrument+Sans:wght@400;500;600&family=Rakkas&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
html[lang="en"] [lang="ar"], html[lang="ar"] [lang="en"] { display: none !important; }
*,*::before,*::after{box-sizing:border-box}
:root{--bg:#0e0d0b;--ink:#f3ede0;--mute:#9a9283;--line:#2b2924;--hot:#ff5a36;--card:#17150f}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.5 "Instrument Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:clip}
html[lang="ar"] body{font-family:"IBM Plex Sans Arabic",system-ui,sans-serif;line-height:1.7}
a{color:inherit;text-decoration:none}
.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1.1rem clamp(1rem,4vw,3.5rem);border-bottom:1px solid var(--line);font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
html[lang="ar"] .top{letter-spacing:0;font-size:.9rem}
#langToggle{font:inherit;letter-spacing:0;text-transform:none;color:var(--ink);background:none;border:1px solid var(--ink);border-radius:99px;padding:.5rem 1.1rem;cursor:pointer;font-size:.95rem;transition:background .2s,color .2s}
#langToggle:hover{background:var(--ink);color:var(--bg)}
.hero{position:relative;padding:clamp(2.5rem,7vw,6rem) clamp(1rem,4vw,3.5rem) clamp(2rem,4vw,3.5rem);display:grid;grid-template-columns:minmax(0,1fr);gap:2rem}
.hero h1{margin:0;font:300 clamp(4.2rem,17vw,15rem)/.82 "Fraunces",serif;letter-spacing:-.045em;font-variation-settings:"opsz" 144}
.hero h1 i{font-style:italic;font-weight:400;color:var(--hot)}
html[lang="ar"] .hero h1{font:400 clamp(4rem,16vw,14rem)/1.05 "Rakkas",serif;letter-spacing:0}
.hero h1 .n{display:inline-block;background:linear-gradient(100deg,#ffd166,#ff5a36 35%,#e0218a 60%,#5b6cff 85%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-inline-end:.06em}
.lede{display:grid;gap:1.5rem;align-items:end}
.lede p{margin:0;max-width:46ch;font-size:clamp(1.05rem,1.6vw,1.3rem);color:#cfc7b6}
.stats{display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0;list-style:none}
.stats li{border:1px solid var(--line);border-radius:99px;padding:.4rem .95rem;font-size:.85rem;color:var(--mute)}
.stats b{color:var(--ink);font-weight:600}
@media(min-width:900px){.lede{grid-template-columns:1fr auto}}
.bar{position:sticky;top:0;z-index:5;display:flex;gap:1rem;align-items:center;padding:.8rem clamp(1rem,4vw,3.5rem);background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-block:1px solid var(--line)}
.bar input{flex:1;min-width:0;font:inherit;font-size:1rem;color:var(--ink);background:none;border:0;outline:0;padding:.55rem 0}
.bar input::placeholder{color:var(--mute)}
.bar svg{flex:none;color:var(--mute)}
.count{font-size:.85rem;color:var(--mute);white-space:nowrap;font-variant-numeric:tabular-nums}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:clamp(1rem,2vw,1.75rem);padding:clamp(1.25rem,3vw,2.5rem) clamp(1rem,4vw,3.5rem) 4rem}
.card{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .35s cubic-bezier(.2,.7,.2,1),border-color .25s,box-shadow .35s}
.card[hidden]{display:none}
.shot{display:block;aspect-ratio:16/10;overflow:hidden;background:#221f18}
.shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.meta{display:grid;grid-template-columns:auto 1fr auto;gap:.9rem;align-items:center;padding:.85rem 1rem 1rem}
.no{font:300 1.7rem/1 "Fraunces",serif;color:var(--mute);font-variant-numeric:tabular-nums;min-width:2.6ch}
html[lang="ar"] .no{font:300 1.6rem/1 "IBM Plex Sans Arabic",sans-serif}
html[lang="ar"] .hero h1 .n{font-family:"IBM Plex Sans Arabic",sans-serif;font-weight:300;font-size:1.15em;line-height:1}
.txt{display:grid;min-width:0}
.txt strong{font-weight:600;font-size:1.02rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.txt em{font-style:normal;font-size:.86rem;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.go{font-size:1.1rem;color:var(--mute);transition:transform .3s,color .3s}
html[dir="rtl"] .go{transform:scaleX(-1)}
@media(hover:hover){.card:hover{transform:translateY(-6px);border-color:#6b6455;box-shadow:0 24px 50px -24px #000}.card:hover .shot img{transform:scale(1.05)}.card:hover .go{color:var(--hot);transform:translate(3px,-3px)}html[dir="rtl"] .card:hover .go{transform:scaleX(-1) translate(3px,-3px)}.card:hover .no{color:var(--ink)}}
.card:focus-visible,#langToggle:focus-visible{outline:2px solid var(--hot);outline-offset:3px}
.empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--mute);font-size:1.1rem}
footer{padding:2rem clamp(1rem,4vw,3.5rem) 3rem;border-top:1px solid var(--line);color:var(--mute);font-size:.88rem;display:flex;flex-wrap:wrap;gap:.5rem 2rem;justify-content:space-between}
@media(max-width:560px){.grid{grid-template-columns:1fr}.top span.where{display:none}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<div class="top"><span><span lang="en">Menu Designs — Vol. 1</span><span lang="ar">تصاميم القوائم — المجلّد الأول</span></span><span class="where"><span lang="en">English + Arabic</span><span lang="ar">بالعربية والإنجليزية</span></span><button id="langToggle" type="button"><span lang="en">العربية</span><span lang="ar">English</span></button></div>
<header class="hero">
<h1><span lang="en"><span class="n">100</span> <i>menus,</i><br>no two alike.</span><span lang="ar"><span class="n">١٠٠</span> قائمة،<br>لا تشبه إحداها الأخرى.</span></h1>
<div class="lede">
<p><span lang="en">One hundred restaurant menus, each built around its own idea — a split-flap departures board, an illuminated manuscript, a vending machine, a chat thread. Every one reads in English and Arabic, on a phone or a wide screen.</span><span lang="ar">مئة قائمة طعام، لكلٍّ منها فكرتها الخاصة: لوحة مغادرة في مطار، مخطوطة مذهّبة، آلة بيع، محادثة على الهاتف. كل قائمة متاحة بالعربية والإنجليزية، ومهيّأة للهاتف والشاشة العريضة.</span></p>
<ul class="stats"><li><b><span lang="en">100</span><span lang="ar">١٠٠</span></b> <span lang="en">designs</span><span lang="ar">تصميم</span></li><li><b><span lang="en">2</span><span lang="ar">٢</span></b> <span lang="en">languages, LTR + RTL</span><span lang="ar">لغتان، يمين ويسار</span></li><li><b><span lang="en">1</span><span lang="ar">١</span></b> <span lang="en">HTML file each</span><span lang="ar">ملف واحد لكل قائمة</span></li></ul>
</div>
</header>
<div class="bar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
<input id="q" type="search" lang="en" placeholder="Search by name, cuisine or number" aria-label="Search menus"><input id="qa" type="search" lang="ar" placeholder="ابحث بالاسم أو المطبخ أو الرقم" aria-label="ابحث في القوائم">
<span class="count"><span id="shown">100</span> / 100</span></div>
<main class="grid" id="grid">
${cards}
<p class="empty" id="empty" hidden><span lang="en">Nothing matches that search.</span><span lang="ar">لا توجد نتائج مطابقة.</span></p>
</main>
<footer><span><span lang="en">All restaurants are fictional. Artwork is inline SVG and CSS.</span><span lang="ar">جميع المطاعم خيالية. الرسومات مصنوعة بـ SVG و CSS.</span></span><span><span lang="en">Tap any menu, then switch language inside it.</span><span lang="ar">افتح أي قائمة وبدّل اللغة من داخلها.</span></span></footer>
<script>
(function(){var d=document.documentElement,cards=[].slice.call(document.querySelectorAll('.card')),q=document.getElementById('q'),qa=document.getElementById('qa'),shown=document.getElementById('shown'),empty=document.getElementById('empty');
document.getElementById('langToggle').addEventListener('click',function(){var l=d.lang==='ar'?'en':'ar';d.lang=l;d.dir=l==='ar'?'rtl':'ltr';try{localStorage.setItem('menu-lang',l)}catch(e){}});
function norm(s){return s.toLowerCase().replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c)}).trim()}
function run(e){var v=norm(e.target.value),n=0;(e.target===q?qa:q).value=e.target.value;cards.forEach(function(c){var ok=!v||c.dataset.q.indexOf(v)>-1;c.hidden=!ok;if(ok)n++});shown.textContent=n;empty.hidden=n>0}
q.addEventListener('input',run);qa.addEventListener('input',run)})();
</script>
</body>
</html>
`;
fs.writeFileSync('index.html', html);
console.log('index.html', (html.length / 1024).toFixed(1) + ' KB', items.length, 'cards');
