/* Göz diyagramı tezgâhı — bellek eğitiminin evrensel modeli.
 *
 * Bu bir ÖLÇÜM değil, bir MODEL. Tek bir veri hattını taklit eder:
 * her bit sabit bir süre (1 UI, "unit interval") boyunca 0 ya da 1 seviyesinde
 * durur, seviyeler arasında sonlu hızla geçer; geçiş anı biraz titrer (zaman
 * gürültüsü), seviye biraz dalgalanır (gerilim gürültüsü). Alıcı her biti tek
 * bir anda ve tek bir eşikle okur: "o anda gerilim eşiğin üstündeyse 1".
 *
 * Eğitim, o "an" (gecikme, tap) ile "eşik"in (Vref) her birleşimini deneyip
 * hatasız okunan bölgeyi — gözü — bulmak ve ortasına oturmaktır.
 *
 * Sayfalara iki biçimde gömülür:
 *   <div data-goz="mini"></div>   ders: tara + yeniden eğit
 *   <div data-goz="tam"></div>    tezgâh: + sıcaklık, gürültü, kayıtla çalıştır, yokla
 */
(function () {
  'use strict';

  // ---- Tekrarlanabilir rastgelelik -----------------------------------------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) {
    let u = 0;
    while (u === 0) u = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
  }

  // ---- Model -----------------------------------------------------------------
  const TAPS = 48;          // gecikme adımı sayısı (yatay)
  const VREFS = 32;         // eşik adımı sayısı (dikey)
  const LO = 0.14, HI = 0.86;
  const RISE = 0.30;        // geçiş süresi, UI cinsinden
  const K_RISE = 2.4 / RISE;
  const T_REF = 45;         // "oda + çalışma" sıcaklığı, °C
  // Pencere bir bitten geniş: iki yandaki geçişler de görünsün (osiloskop gibi).
  const T0 = -0.25, SPAN = 1.5;

  // Sıcaklık, verinin saate göre gecikmesini kaydırır (tel ve transistör hızı
  // sıcaklıkla değişir) ve titremeyi biraz büyütür. Katsayılar temsilî ve
  // bilerek abartılı: gerçek kayma daha küçüktür, ama yön aynıdır.
  function drift(temp) { return (temp - T_REF) * 0.0105; }
  function sig(c) {
    const heat = 1 + Math.max(0, c.temp - T_REF) / 160;
    return { t: 0.062 * c.noise * heat, v: 0.028 * c.noise };
  }
  function lvl(b) { return b ? HI : LO; }
  function sgm(x) { return 0.5 * (1 + Math.tanh(x)); }

  // Bir bitin, önceki (p) ve sonraki (n) bitle birlikte, t anındaki gerilimi.
  function volt(t, p, b, n, j0, j1, vn) {
    return lvl(p)
      + (lvl(b) - lvl(p)) * sgm(K_RISE * (t - j0))
      + (lvl(n) - lvl(b)) * sgm(K_RISE * (t - 1 - j1))
      + vn;
  }

  function tapToT(i, c) { return T0 + (i + 0.5) / TAPS * SPAN - drift(c.temp); }
  function vrefToV(j) { return (j + 0.5) / VREFS; }

  // (i, j) noktasında `n` bit oku, kaç hata olduğunu say.
  function errors(i, j, c, n, r) {
    const s = sig(c), t = tapToT(i, c), v = vrefToV(j);
    let e = 0;
    for (let k = 0; k < n; k++) {
      const b = k & 1;                       // 0 ve 1 dengeli denensin
      const p = r() < 0.5 ? 0 : 1, nx = r() < 0.5 ? 0 : 1;
      const u = volt(t, p, b, nx, gauss(r) * s.t, gauss(r) * s.t, gauss(r) * s.v);
      if ((u > v ? 1 : 0) !== b) e++;
    }
    return e;
  }

  // Tarama: her noktada kısa bir deneme; tek hata bile "kaldı" demek.
  function scan(c, seed, trials) {
    const r = mulberry32(seed);
    const map = new Uint8Array(TAPS * VREFS);
    for (let j = 0; j < VREFS; j++)
      for (let i = 0; i < TAPS; i++)
        map[j * TAPS + i] = errors(i, j, c, trials, r) === 0 ? 1 : 0;
    return map;
  }

  // Merkez seçimi, gerçek eğitim yazılımlarının kaba mantığıyla:
  // önce en geniş yatay açıklığın olduğu eşik satırı, o satırda açıklığın ortası;
  // sonra o gecikmede dikey açıklığın ortası.
  function longestRun(get, len) {
    let best = [-1, -1], s = -1;
    for (let x = 0; x <= len; x++) {
      const ok = x < len && get(x);
      if (ok && s < 0) s = x;
      if (!ok && s >= 0) {
        if (x - s > best[1] - best[0] + 1 || best[0] < 0) best = [s, x - 1];
        s = -1;
      }
    }
    return best;
  }
  function center(map) {
    let bestRow = -1, bestRun = [-1, -1];
    for (let j = 0; j < VREFS; j++) {
      const run = longestRun(i => map[j * TAPS + i], TAPS);
      if (run[0] >= 0 && (bestRow < 0 || run[1] - run[0] > bestRun[1] - bestRun[0])) {
        bestRow = j; bestRun = run;
      }
    }
    if (bestRow < 0) return null;
    const ci = Math.round((bestRun[0] + bestRun[1]) / 2);
    const vr = longestRun(j => map[j * TAPS + ci], VREFS);
    const cj = vr[0] >= 0 ? Math.round((vr[0] + vr[1]) / 2) : bestRow;
    return { i: ci, j: cj, w: bestRun[1] - bestRun[0] + 1, h: vr[1] - vr[0] + 1 };
  }

  // ---- Çizim -----------------------------------------------------------------
  const W = 640, H = 400, PAD_L = 40, PAD_B = 30, PAD_T = 10, PAD_R = 10;
  const PW = W - PAD_L - PAD_R, PH = H - PAD_T - PAD_B;

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function cellX(i) { return PAD_L + i * PW / TAPS; }
  function cellY(j) { return PAD_T + PH - (j + 1) * PH / VREFS; }

  function draw(cv, st) {
    const g = cv.getContext('2d');
    const dpr = cv.width / W;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);

    const cPass = css('--pass'), cFail = css('--fail'), cTrace = css('--trace');
    const cText = css('--text-3'), cGrid = css('--grid-line'), cAcc = css('--accent-bright');

    // Tarama sonucu: geçen hücreler dolu, kalanlar boş.
    if (st.map) {
      g.globalAlpha = 0.30;
      g.fillStyle = cPass;
      for (let j = 0; j < VREFS; j++)
        for (let i = 0; i < TAPS; i++)
          if (st.map[j * TAPS + i]) g.fillRect(cellX(i), cellY(j), PW / TAPS + 0.5, PH / VREFS + 0.5);
      g.globalAlpha = 1;
    }

    // Osiloskop izleri: aynı hattan geçen birçok bit üst üste çizilir.
    const r = mulberry32(st.traceSeed), s = sig(st.c), d = drift(st.c.temp);
    g.strokeStyle = cTrace; g.lineWidth = 1.2;
    for (let k = 0; k < 70; k++) {
      const p = r() < 0.5 ? 0 : 1, b = r() < 0.5 ? 0 : 1, n = r() < 0.5 ? 0 : 1;
      const j0 = gauss(r) * s.t, j1 = gauss(r) * s.t, vn = gauss(r) * s.v;
      g.beginPath();
      for (let x = 0; x <= 90; x++) {
        const tc = T0 + x / 90 * SPAN;      // saate göre konum
        const u = volt(tc - d, p, b, n, j0, j1, vn);
        const px = PAD_L + (x / 90) * PW, py = PAD_T + PH - u * PH;
        if (x === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.stroke();
    }

    // Çerçeve ve eksen yazıları.
    g.strokeStyle = cGrid; g.lineWidth = 1;
    g.strokeRect(PAD_L + 0.5, PAD_T + 0.5, PW, PH);
    g.fillStyle = cText; g.font = '11px ' + css('--mono');
    g.textAlign = 'center';
    g.fillText('gecikme (tap) →', PAD_L + PW / 2, H - 8);
    for (let i = 0; i <= TAPS; i += 12) g.fillText(String(i), cellX(i), PAD_T + PH + 14);
    g.save(); g.translate(12, PAD_T + PH / 2); g.rotate(-Math.PI / 2);
    g.fillText('eşik (Vref) →', 0, 0); g.restore();
    g.textAlign = 'right';
    for (let j = 0; j <= VREFS; j += 8) g.fillText(String(j), PAD_L - 6, cellY(j - 1) + 4);

    // Yoklama imleci.
    if (st.probe) {
      g.strokeStyle = cText; g.lineWidth = 1.5;
      g.strokeRect(cellX(st.probe.i), cellY(st.probe.j), PW / TAPS, PH / VREFS);
    }
    // Kayıtlı ayar (eğitimin seçtiği nokta).
    if (st.saved) {
      const x = cellX(st.saved.i) + PW / TAPS / 2, y = cellY(st.saved.j) + PH / VREFS / 2;
      g.strokeStyle = st.savedBad ? cFail : cAcc; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(x - 9, y); g.lineTo(x + 9, y); g.moveTo(x, y - 9); g.lineTo(x, y + 9); g.stroke();
      g.beginPath(); g.arc(x, y, 6, 0, 2 * Math.PI); g.stroke();
    }
  }

  // ---- Arayüz ------------------------------------------------------------------
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  function mount(root) {
    const full = root.getAttribute('data-goz') === 'tam';
    const st = { c: { temp: T_REF, noise: 1 }, map: null, saved: null, savedBad: false,
                 savedTemp: null, probe: null, seed: 1, traceSeed: 7, hist: [] };

    root.classList.add('tool');
    const cv = el('canvas', { width: W * 2, height: H * 2, 'aria-label': 'Göz diyagramı: gecikme ve eşik düzleminde gürültülü sinyal izleri' });
    root.appendChild(cv);
    root.appendChild(el('div', { class: 'legend' },
      '<span style="--c:var(--trace)">sinyal izleri</span>' +
      '<span style="--c:var(--pass)">taramada hatasız okunan nokta</span>' +
      '<span style="--c:var(--accent-bright)">eğitimin seçtiği ayar</span>'));

    const ctr = el('div', { class: 'controls' });
    const bTrain = el('button', { class: 'chip main', type: 'button' }, full ? 'eğit ve kaydet' : 'tara ve eğit');
    const bAgain = el('button', { class: 'chip', type: 'button' }, 'yeniden eğit');
    ctr.appendChild(bTrain); ctr.appendChild(bAgain);

    let rTemp, rNoise, oTemp, oNoise, bRun;
    if (full) {
      bRun = el('button', { class: 'chip', type: 'button' }, 'kayıtla çalıştır');
      ctr.appendChild(bRun);
      const l1 = el('label', null, 'sıcaklık');
      rTemp = el('input', { type: 'range', min: '0', max: '95', step: '1', value: String(T_REF) });
      oTemp = el('output', null, T_REF + ' °C'); l1.appendChild(rTemp); l1.appendChild(oTemp);
      const l2 = el('label', null, 'gürültü');
      rNoise = el('input', { type: 'range', min: '0.4', max: '2.2', step: '0.1', value: '1' });
      oNoise = el('output', null, '×1.0'); l2.appendChild(rNoise); l2.appendChild(oNoise);
      ctr.appendChild(l1); ctr.appendChild(l2);
    }
    root.appendChild(ctr);

    const out = el('div', { class: 'readout', 'aria-live': 'polite' },
      full ? 'Önce <b>eğit ve kaydet</b>. Sonra sıcaklığı değiştir, <b>kayıtla çalıştır</b>. Izgaraya tıklarsan o noktayı yoklarsın.'
           : 'Izgarada şimdilik yalnız izler var. <b>tara ve eğit</b>e bas.');
    root.appendChild(out);
    const hist = el('div', { class: 'history' });
    root.appendChild(hist);

    function redraw() { draw(cv, st); }
    function showHist() {
      hist.innerHTML = st.hist.map((h, k) =>
        `<span class="${k === st.hist.length - 1 ? 'last' : ''}">#${k + 1} tap ${h.i} · Vref ${h.j}</span>`).join('');
    }

    function train() {
      st.map = scan(st.c, st.seed++, 16);
      const ce = center(st.map);
      if (!ce) {
        st.saved = null;
        out.innerHTML = '<span class="bad">Göz kapalı:</span> hiçbir noktada hatasız okunamadı. Gürültüyü azalt.';
        redraw(); return;
      }
      st.saved = ce; st.savedTemp = st.c.temp; st.savedBad = false;
      st.hist.push(ce); if (st.hist.length > 12) st.hist.shift();
      const prev = st.hist.length > 1 ? st.hist[st.hist.length - 2] : null;
      let m = `Seçilen ayar: <b>tap ${ce.i}</b>, <b>Vref ${ce.j}</b> · göz ${ce.w} tap geniş, ${ce.h} adım yüksek.`;
      if (prev) {
        const di = ce.i - prev.i, dj = ce.j - prev.j;
        m += di || dj
          ? ` Bir öncekinden fark: tap ${di >= 0 ? '+' : ''}${di}, Vref ${dj >= 0 ? '+' : ''}${dj}. Aynı hat, aynı koşul, <b>farklı merkez</b>: ölçüm gürültülü.`
          : ' Bir öncekiyle aynı çıktı.';
      }
      if (full) m += ` Kayıt ${st.savedTemp} °C'de alındı.`;
      out.innerHTML = m;
      showHist(); redraw();
    }

    function runSaved() {
      if (!st.saved) { out.innerHTML = 'Önce <b>eğit ve kaydet</b>: çalıştıracak bir kayıt yok.'; return; }
      const r = mulberry32(st.seed++ * 977);
      const n = 4000, e = errors(st.saved.i, st.saved.j, st.c, n, r);
      st.savedBad = e > 0;
      const dt = st.c.temp - st.savedTemp;
      out.innerHTML = `Kayıtlı ayarla (tap ${st.saved.i}, Vref ${st.saved.j}) ${n} bit okundu: ` +
        (e === 0 ? '<span class="ok">hata yok.</span>' : `<span class="bad">${e} hata</span> (${(100 * e / n).toFixed(2)} %).`) +
        ` Kayıt ${st.savedTemp} °C'de alınmıştı, şimdi ${st.c.temp} °C (fark ${dt >= 0 ? '+' : ''}${dt}).` +
        (e > 0 ? ' Göz kaydı, ayar kenarda kaldı: <b>kayıt bayatladı</b>.' : '');
      redraw();
    }

    function probe(ev) {
      if (!full) return;
      const b = cv.getBoundingClientRect();
      const x = (ev.clientX - b.left) * W / b.width, y = (ev.clientY - b.top) * H / b.height;
      const i = Math.floor((x - PAD_L) / (PW / TAPS)), j = Math.floor((PAD_T + PH - y) / (PH / VREFS));
      if (i < 0 || i >= TAPS || j < 0 || j >= VREFS) return;
      const n = 2000, e = errors(i, j, st.c, n, mulberry32(st.seed++ * 131));
      st.probe = { i, j };
      out.innerHTML = `Yoklama: tap ${i}, Vref ${j} → ${n} bitte ` +
        (e === 0 ? '<span class="ok">hata yok</span>' : `<span class="bad">${e} hata</span> (${(100 * e / n).toFixed(1)} %)`) + '.';
      redraw();
    }

    bTrain.addEventListener('click', train);
    bAgain.addEventListener('click', () => { if (!st.hist.length) { train(); return; } train(); });
    if (full) {
      bRun.addEventListener('click', runSaved);
      const upd = () => {
        st.c.temp = +rTemp.value; st.c.noise = +rNoise.value;
        oTemp.textContent = st.c.temp + ' °C'; oNoise.textContent = '×' + st.c.noise.toFixed(1);
        st.map = null; st.savedBad = false; st.probe = null; st.traceSeed++;
        redraw();
      };
      rTemp.addEventListener('input', upd); rNoise.addEventListener('input', upd);
      cv.addEventListener('click', probe);
    }

    // Tema değişince renkler CSS'ten yeniden okunur.
    new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    redraw();
  }

  function boot() { document.querySelectorAll('[data-goz]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Sayfa dışı sınama için (node): model fonksiyonları dışa açık.
  if (typeof module !== 'undefined') module.exports = { scan, center, errors, mulberry32, TAPS, VREFS, T_REF };
})();
