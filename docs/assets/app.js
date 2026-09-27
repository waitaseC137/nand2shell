/* ============================================================
   nand2shell — interactions
   ============================================================ */

/* ---------- 1. hero: terminal yazma demosu ---------- */
const SCRIPT_DESKTOP = [
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'tree -L 1' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">konu_anlatimlari/</span> <span class="td">NandGame dersleri · CWE kataloğu</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">araclar/</span>          <span class="td">derslerdeki iddiaların sınamaları</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">docs/</span>             <span class="td">bu site</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'python3 araclar/14_alu/alu_sayim.py' },
  { t: 'raw', html: '<span class="tg">✓</span> <span class="td">farklı işlem:</span> <span class="tc">19</span> <span class="td">· belgelenmiş 11 · listelenmemiş 8</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'cat 00_buradan_basla.md', last: true },
];

/* mobil: kısa, hizaya dayanmayan satırlar (sarma/taşma olmaz) */
const SCRIPT_MOBILE = [
  { t: 'prompt', text: '~/n2s $ ', cmd: 'tree -L 1' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">konu_anlatimlari/</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">araclar/</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">docs/</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/n2s $ ', cmd: 'python3 alu_sayim.py' },
  { t: 'raw', html: '<span class="tg">✓</span> <span class="td">farklı işlem: 19</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/n2s $ ', cmd: 'cat 00_buradan_basla.md', last: true },
];

const SCRIPT_DESKTOP_EN = [
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'tree -L 1' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">konu_anlatimlari/</span> <span class="td">NandGame lessons · CWE catalogue</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">araclar/</span>          <span class="td">tests for the claims in the lessons</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">docs/</span>             <span class="td">this site</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'python3 araclar/14_alu/alu_sayim.py' },
  { t: 'raw', html: '<span class="tg">✓</span> <span class="td">distinct operations:</span> <span class="tc">19</span> <span class="td">· 11 documented · 8 unlisted</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/nand2shell $ ', cmd: 'cat 00_buradan_basla.md', last: true },
];

const SCRIPT_MOBILE_EN = [
  { t: 'prompt', text: '~/n2s $ ', cmd: 'tree -L 1' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">konu_anlatimlari/</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">araclar/</span>' },
  { t: 'raw', html: '<span class="tm">▸</span> <span class="tw">docs/</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/n2s $ ', cmd: 'python3 alu_sayim.py' },
  { t: 'raw', html: '<span class="tg">✓</span> <span class="td">distinct operations: 19</span>' },
  { t: 'blank' },
  { t: 'prompt', text: '~/n2s $ ', cmd: 'cat 00_buradan_basla.md', last: true },
];

const IS_EN = document.documentElement.lang === 'en';
const isMobileVP = window.matchMedia && window.matchMedia('(max-width: 560px)').matches;
const SCRIPT = IS_EN
  ? (isMobileVP ? SCRIPT_MOBILE_EN : SCRIPT_DESKTOP_EN)
  : (isMobileVP ? SCRIPT_MOBILE : SCRIPT_DESKTOP);

function typeTerminal(el) {
  let i = 0;
  el.innerHTML = '';

  function addLine() {
    if (i >= SCRIPT.length) { return; }
    const step = SCRIPT[i];

    if (step.t === 'blank') {
      const l = document.createElement('span');
      l.className = 'line'; l.innerHTML = '\u00A0';
      el.appendChild(l); i++; setTimeout(addLine, 130); return;
    }
    if (step.t === 'raw') {
      const l = document.createElement('span');
      l.className = 'line'; l.innerHTML = step.html; l.style.opacity = '0';
      el.appendChild(l);
      requestAnimationFrame(() => { l.style.transition = 'opacity .25s'; l.style.opacity = '1'; });
      i++; setTimeout(addLine, 230); return;
    }
    if (step.t === 'prompt') {
      const l = document.createElement('span');
      l.className = 'line';
      l.innerHTML = '<span class="tg">' + step.text + '</span><span class="cmd"></span>';
      el.appendChild(l);
      const target = l.querySelector('.cmd');
      typeChars(target, step.cmd, () => {
        i++;
        if (step.last) {
          const cur = document.createElement('span');
          cur.className = 'cursor'; target.appendChild(cur);
        } else { setTimeout(addLine, 240); }
      });
      return;
    }
  }
  addLine();
}

function typeChars(el, text, done) {
  let j = 0;
  (function step() {
    if (j > text.length) { done && done(); return; }
    el.innerHTML = '<span class="ty">' + text.slice(0, j) + '</span><span class="cursor"></span>';
    j++; setTimeout(step, 34 + Math.random() * 40);
  })();
}

/* ---------- 2. Kopyala butonları ---------- */
function wireCopy() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-copy');
      const pre = document.querySelector(sel);
      if (!pre) return;
      const txt = pre.innerText.replace(/^\$\s?/gm, '').trim();
      navigator.clipboard && navigator.clipboard.writeText(txt);
      const old = btn.textContent;
      btn.textContent = IS_EN ? '✓ copied' : '✓ kopyalandı'; btn.classList.add('ok');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('ok'); }, 1600);
    });
  });
}

/* ---------- 3. Wargame zorluk filtresi ---------- */
function wireFilter() {
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.wg');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('on'));
      chip.classList.add('on');
      const f = chip.getAttribute('data-filter');
      cards.forEach(card => {
        const band = card.getAttribute('data-band');
        card.style.display = (f === 'all' || f === band) ? '' : 'none';
      });
    });
  });
}

/* ---------- 4. Scroll reveal ---------- */
function wireReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ---------- 5. Kart 3B tilt ---------- */
function wireTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.wg').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        'translateY(-3px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- 6. Footer mini kedi (göz kırpan) ---------- */
function wireFootCat() {
  const el = document.getElementById('footCat');
  if (!el) return;
  const open = ' /\\_/\\\n( o.o )\n  > ω <';
  const shut = ' /\\_/\\\n( -.- )\n  > ω <';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.textContent = open;
  if (reduce) return;
  (function loop() {
    setTimeout(() => {
      el.textContent = shut;
      setTimeout(() => { el.textContent = open; loop(); }, 160);
    }, 2400 + Math.random() * 3000);
  })();
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const term = document.getElementById('hero-term');
  if (term) typeTerminal(term);
  wireCopy();
  wireFilter();
  wireReveal();
  wireTilt();
  wireFootCat();
});
