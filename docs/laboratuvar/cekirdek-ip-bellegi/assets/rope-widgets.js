/* ============================================================================
   rope-widgets.js — her widget, korumalı bir init fonksiyonu.

   Kural: her init kendi DOM id'sini arar, YOKSA sessizce çekilir. Böylece aynı
   dosya hem ders.html'e hem tezgah.html'e yüklenir; hangi widget'ın çalışacağını
   sayfadaki id'ler belirler. Eksik bir id artık sayfayı öldürmüyor.

   Hiçbir widget başka bir widget'ı çağırmaz. Paylaşılan her şey RopeCore'da;
   durum değişince core.emit() herkesi uyandırır, herkes KENDİNİ çizer.
   ========================================================================== */
window.RopeWidgets = (function () {
  'use strict';

  const C = window.RopeCore;
  const $ = id => document.getElementById(id);

  /* ==== Radyal görünüş: TEK çekirdek, 16 sense teli ======================= */
  function initRadial() {
    const rope = $('rope');
    if (!rope) return;

    const g = C.geom, el = C.el, f = C.f;
    const { CX, CY, R_START, R_CAP, R_DIGIT, IDX_DY, R_OUT, R_HOLE,
            R_TIP1, R_TIP0, TIP_BULGE, W_START, W_TIP1, W_TIP0,
            R_DRIVE, RT_DRIVE, W_DRIVE_S, W_DRIVE_T, HIT_R0, HIT_R1, HIT_HALF } = g;

    const defs = el('defs');
    defs.innerHTML =
      '<radialGradient id="ferrite" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0" stop-color="var(--fer-0)"/><stop offset="0.565" stop-color="var(--fer-1)"/>' +
        '<stop offset="0.78" stop-color="var(--fer-2)"/><stop offset="0.93" stop-color="var(--fer-3)"/>' +
        '<stop offset="1" stop-color="var(--fer-4)"/></radialGradient>' +
      '<clipPath id="cwR" clipPathUnits="userSpaceOnUse"><rect x="' + CX + '" y="0" width="' + (CX + 2) + '" height="' + (CY * 2) + '"/></clipPath>' +
      '<clipPath id="cwL" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="' + CX + '" height="' + (CY * 2) + '"/></clipPath>' +
      '<clipPath id="band" clipPathUnits="userSpaceOnUse"><path fill-rule="evenodd" d="' + C.ringPath(R_OUT + 2) + ' ' + C.ringPath(R_HOLE - 2) + '"/></clipPath>' +
      '<marker id="ah" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">' +
        '<path d="M0 0 L7 3.5 L0 7 z" fill="var(--text-2)" opacity=".5"/></marker>';
    rope.appendChild(defs);

    const gUnder = el('g'), gCore = el('g'), gOver = el('g'), gText = el('g'), gHit = el('g');
    [gUnder, gCore, gOver, gText, gHit].forEach(x => rope.appendChild(x));

    gCore.appendChild(el('path', { class: 'core-body', 'fill-rule': 'evenodd', d: C.ringPath(R_OUT) + ' ' + C.ringPath(R_HOLE) }));
    gCore.appendChild(el('circle', { class: 'core-rim', cx: CX, cy: CY, r: R_OUT }));
    gCore.appendChild(el('circle', { class: 'core-rim', cx: CX, cy: CY, r: R_HOLE }));
    const coreFlash = el('circle', { class: 'core-flash', cx: CX, cy: CY, r: (R_OUT + R_HOLE) / 2 });
    gCore.appendChild(coreFlash);
    gCore.appendChild(el('path', { class: 'flux', d: C.arcPath(78, 102, (R_OUT + R_HOLE) / 2), 'marker-end': 'url(#ah)' }));

    const wave = el('circle', { class: 'wavefront', cx: CX, cy: CY, r: R_HOLE });
    gOver.appendChild(wave);

    // Delikten geçen bir tel, ferrit bandın bir yanında arkaya dalar, öbür
    // yanında üstünden geçer. Bir kez çiz, üst yarısı için bir kopyayı kırp,
    // gizli kalan koşuyu kesik çizgili hayaletle izle.
    function placeThreaded(rot, d, cls) {
      const gu = el('g', { transform: rot }), pu = el('path', { class: 'strand ' + cls, d });
      gu.appendChild(pu); gUnder.appendChild(gu);
      const go = el('g', { transform: rot }), po = el('path', { class: 'strand ' + cls, d, 'clip-path': 'url(#cwR)' });
      go.appendChild(po); gOver.appendChild(go);
      const gbw = el('g', { 'clip-path': 'url(#band)' }), gb = el('g', { transform: rot });
      const pg = el('path', { class: 'ghost', d, 'clip-path': 'url(#cwL)' });
      gb.appendChild(pg); gbw.appendChild(gb); gOver.appendChild(gbw);
      return { pu, po, gu, go, gbw };
    }

    placeThreaded('rotate(0 ' + CX + ' ' + CY + ')',
                  C.hairpin(RT_DRIVE, W_DRIVE_T, R_DRIVE, W_DRIVE_S, 1.5), 'drive');
    const bolt = el('text', { class: 'bolt', x: CX, y: 34 }); bolt.textContent = '⚡';
    gText.appendChild(bolt);

    // bit sırası -> yuva; yuva 0 (sürücü) ve yuva 9 (boşluk) atlanır
    const slotOfBit = j => (j < 8 ? j + 1 : j + 2);
    const W = [];

    for (let j = 0; j < C.WIRE_COUNT; j++) {
      const isParity = (j === C.DATA_BITS);
      const k = slotOfBit(j), th = C.slotAngle(k);
      // Uç kaydırması BİT'e değil YUVA'ya göre: yuva 1 ve 17 sürücünün iki
      // yanında ve ikisi de tek, bu da sürücü açıklığını simetrik kaldırıyor.
      const RT = R_TIP1[k % 2];
      const rot = 'rotate(' + f(th + 90) + ' ' + CX + ' ' + CY + ')';
      const cls = 'one' + (isParity ? ' par' : '');
      const one = placeThreaded(rot, C.hairpin(RT, W_TIP1, R_START, W_START, TIP_BULGE), cls);

      const gz = el('g', { transform: rot });
      const pz = el('path', { class: 'strand zero' + (isParity ? ' par' : ''),
                              d: C.hairpin(R_TIP0, W_TIP0, R_START, W_START, -0.95) });
      gz.appendChild(pz); gOver.appendChild(gz);
      gOver.appendChild(el('path', { class: 'capArc', d: C.arcPath(th - 4.9, th + 4.9, R_CAP) }));

      const xy = C.pt(R_DIGIT, th);
      const dig = el('text', { class: 'digit', x: f(xy[0]), y: f(xy[1] + 7) });
      const idx = el('text', { class: 'idx' + (isParity ? ' par' : ''), x: f(xy[0]), y: f(xy[1] + 7 + IDX_DY) });
      idx.textContent = isParity ? 'P' : 'b' + (C.DATA_BITS - j);
      gText.appendChild(dig); gText.appendChild(idx);

      const rec = { one, pz, dig, idx, j, hit: null };
      W.push(rec);

      if (isParity) continue;   // parite telini donanım sahiplenir: hedef yok

      const hit = el('path', { class: 'hit', d: C.wedge(th, HIT_R0, HIT_R1, HIT_HALF),
                               tabindex: '0', role: 'switch', 'aria-label': 'bit ' + (C.DATA_BITS - j) });
      gHit.appendChild(hit);
      rec.hit = hit;

      const hot = on => {
        [one.pu, one.po, pz].forEach(e => e.classList.toggle('hot', on));
        idx.classList.toggle('hotT', on); dig.classList.toggle('hotT', on);
      };
      hit.addEventListener('mouseenter', () => hot(true));
      hit.addEventListener('mouseleave', () => hot(false));
      hit.addEventListener('focus', () => hot(true));
      hit.addEventListener('blur',  () => hot(false));
      hit.addEventListener('click', () => { if (!C.isPulsing()) C.toggleBit(j); });
      hit.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!C.isPulsing()) C.toggleBit(j); }
        // Halka biçiminde dizilmiş 16 sekme durağı, ok tuşu olmadan yön duygusunu kaybettiriyor
        else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); W[(j + 1) % C.DATA_BITS].hit.focus(); }
        else if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); W[(j + C.DATA_BITS - 1) % C.DATA_BITS].hit.focus(); }
      });
    }

    [['TEK ÇEKİRDEK', 16, 30, 's'], ['= 1 AGC kelimesi', 16, 48, 's'],
     ['16 sense teli', 16, 552, 's'], ['→ okuma yükselteci', 564, 552, 'e']]
      .forEach(function (c) {
        const e = el('text', { class: 'corelabel ' + c[3], x: c[1], y: c[2] });
        e.textContent = c[0]; gText.appendChild(e);
      });

    /* --- darbe: tek çekirdek, bütün teller aynı anda --- */
    const driveBtn = $('driveBtn');
    if (driveBtn) {
      driveBtn.addEventListener('click', function firePulse() {
        if (C.isPulsing()) return;
        C.setPulsing(true);
        driveBtn.disabled = true;
        driveBtn.textContent = 'okunuyor…';
        const shape = C.pulseShape();

        setTimeout(() => {
          coreFlash.classList.remove('on'); void coreFlash.getBBox(); coreFlash.classList.add('on');
          wave.classList.remove('on');      void wave.getBBox();      wave.classList.add('on');
          C.setFiring(true);                // osiloskop bunu kendi okur

          setTimeout(() => {
            C.setFiring(false);
            C.setPulsing(false);
            driveBtn.disabled = false;
            driveBtn.textContent = '⚡ DARBE GÖNDER — belleği oku';
          }, shape.flashMs + 260);
        }, 420);
      });
    }

    C.subscribe(function drawRadial() {
      const firing = C.isFiring();
      for (const w of W) {
        const on = C.wireValue(w.j) === 1;
        [w.one.gu, w.one.go, w.one.gbw].forEach(x => { x.style.display = on ? '' : 'none'; });
        w.pz.parentNode.style.display = on ? 'none' : '';
        w.dig.textContent = on ? '1' : '0';
        w.dig.classList.toggle('d1', on);
        if (w.hit) w.hit.setAttribute('aria-checked', on ? 'true' : 'false');
        const lit = firing && on;
        w.one.pu.classList.toggle('fired', lit);
        w.one.po.classList.toggle('fired', lit);
      }
    });
  }

  /* ==== Osiloskop: 16 iz, TEK ortak zaman ekseni ========================== */
  function initScope() {
    const scope = $('scope');
    if (!scope) return;

    const el = C.el, f = C.f;
    const SX0 = 54, SX1 = 688, ROWH = 17, SY0 = 16, TPULSE = 0.52;
    const traces = [];

    for (let j = 0; j < C.WIRE_COUNT; j++) {
      const y = SY0 + j * ROWH;
      const t = el('path', { class: 'trace', d: 'M ' + SX0 + ' ' + y + ' L ' + SX1 + ' ' + y });
      const l = el('text', { class: 'tlabel', x: SX0 - 8, y: y + 4 });
      l.textContent = (j === C.DATA_BITS) ? 'P' : 'b' + (C.DATA_BITS - j);
      scope.appendChild(t); scope.appendChild(l); traces.push(t);
    }
    const SBOT = SY0 + (C.WIRE_COUNT - 1) * ROWH + 14;
    const cursor = el('line', { class: 'tcursor', x1: 0, y1: 4, x2: 0, y2: SBOT });
    scope.appendChild(cursor);
    const taxis = el('text', { class: 'taxis', x: SX0 + (SX1 - SX0) * TPULSE + 8, y: SBOT + 11 });
    taxis.textContent = 't = SET kenarı — 16 bit aynı anda';
    scope.appendChild(taxis);
    scope.setAttribute('viewBox', '0 0 700 ' + (SBOT + 18));

    C.subscribe(function drawScope() {
      const fire = C.isFiring();
      const xp = SX0 + (SX1 - SX0) * TPULSE;
      for (let j = 0; j < C.WIRE_COUNT; j++) {
        const y = SY0 + j * ROWH, t = traces[j];
        if (fire && C.wireValue(j) === 1) {
          t.setAttribute('d', 'M ' + SX0 + ' ' + y + ' L ' + f(xp - 11) + ' ' + y + ' L ' + f(xp - 4) + ' ' + (y - 12)
                            + ' L ' + f(xp + 5) + ' ' + (y + 2) + ' L ' + f(xp + 13) + ' ' + y + ' L ' + SX1 + ' ' + y);
          t.classList.add('hi');
        } else {
          t.setAttribute('d', 'M ' + SX0 + ' ' + y + ' L ' + SX1 + ' ' + y);
          t.classList.remove('hi');
        }
      }
      cursor.setAttribute('x1', xp); cursor.setAttribute('x2', xp);
      cursor.classList.toggle('on', fire);
    });
  }

  /* ==== Kelime okuması: ikilik / oktal / ondalık / işaretli / parite ====== */
  function initReadout() {
    const bitsOut = $('bitsOut'), octOut = $('octOut'), decOut = $('decOut'),
          signOut = $('signOut'), parOut = $('parOut');
    if (!bitsOut && !octOut && !decOut && !signOut && !parOut) return;

    C.subscribe(function drawReadout() {
      if (bitsOut) bitsOut.textContent = C.bitsText();
      if (decOut)  decOut.textContent  = C.decimal();
      if (octOut)  octOut.textContent  = C.octal();
      if (signOut) signOut.textContent = C.signed();
      if (parOut)  parOut.textContent  = C.parityBit();
    });
  }

  /* ==== Hazır örnek çipleri ============================================== */
  function initPresets() {
    const btns = document.querySelectorAll('[data-preset]');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (C.isPulsing()) return;
        C.setPreset(btn.getAttribute('data-preset'));
      });
    });
  }

  /* ==== Komut çözücü: aynı kelimenin iki okunuşu ========================= */
  function initInstr() {
    const disBasic = $('disBasic'), disExtra = $('disExtra'),
          glossBasic = $('glossBasic'), glossExtra = $('glossExtra');
    if (!disBasic && !disExtra) return;

    C.subscribe(function drawInstr() {
      const w = C.word();
      const b = C.disassemble(w, false), x = C.disassemble(w, true);
      if (disBasic)   disBasic.textContent   = b.text;
      if (disExtra)   disExtra.textContent   = x.text;
      if (glossBasic) glossBasic.textContent = C.GLOSS[b.mnemonic] || '';
      if (glossExtra) glossExtra.textContent = C.GLOSS[x.mnemonic] || '';
    });
  }

  /* ==== "Bu kelimeyi kim istiyor?" — getir-yap çevrimi ==================== */
  function initLoop() {
    const zOut = $('zOut'), lret = $('lret'), llbl = $('llbl');
    const lv = [0, 1, 2, 3].map(i => $('lv' + i));
    if (!zOut || lv.some(x => !x)) return;

    C.subscribe(function drawLoop() {
      const cf = C.controlFlow(C.word());
      zOut.textContent  = C.oct5(C.getZ());
      lv[0].textContent = C.oct5(C.getZ());
      lv[1].textContent = C.oct5(C.word());
      lv[2].textContent = cf.text;
      lv[3].textContent = cf.jumps ? "Z'ye yazdı" : "Z'ye dokunmadı";
      if (llbl) {
        llbl.textContent = cf.jumps ? 'Z := ' + C.oct5(cf.target) : 'Z := Z + 1';
        llbl.classList.toggle('live', cf.jumps);
      }
      if (lret) {
        lret.classList.toggle('live', cf.jumps);
        lret.setAttribute('marker-end', cf.jumps ? 'url(#ahl)' : 'url(#ahi)');
      }
    });

    // Bir tıklama dört adımı sırayla yürütür, SONRA Z'yi oynatır. 1-3 arasında
    // eski Z'yi göstermek doğru okuma: Z 1. adımda okunur, ancak 4'te yazılır.
    const cycleBtn = $('cycleBtn');
    if (!cycleBtn) return;
    const lpSteps = [].slice.call(document.querySelectorAll('#loop .lp-step'));
    const STEP_MS = 200;
    let cycling = false;

    cycleBtn.addEventListener('click', function runCycle() {
      if (cycling) return;
      cycling = true;
      cycleBtn.disabled = true;
      const cf = C.controlFlow(C.word());
      lpSteps.forEach(s => s.classList.remove('hot'));

      let i = 0;
      (function step() {
        if (i > 0) lpSteps[i - 1].classList.remove('hot');
        if (i < lpSteps.length) {
          lpSteps[i].classList.add('hot');
          i++;
          setTimeout(step, STEP_MS);
          return;
        }
        C.setZ(cf.jumps ? cf.target : ((C.getZ() + 1) & 0o7777));
        if (lret) lret.classList.add('pulse');
        if (llbl) llbl.classList.add('pulse');
        setTimeout(() => {
          if (lret) lret.classList.remove('pulse');
          if (llbl) llbl.classList.remove('pulse');
          cycling = false;
          cycleBtn.disabled = false;
        }, 340);
      })();
    });
  }

  /* ==== Sinyal paneli: Δt kaydırıcısı ==================================== */
  function initSignal() {
    const dtSlider = $('dtSlider'), dtOut = $('dtOut');
    if (!dtSlider || !dtOut) return;
    dtSlider.value = C.getDtNs();
    dtSlider.addEventListener('input', () => C.setDtNs(parseInt(dtSlider.value, 10)));
    C.subscribe(() => { dtOut.textContent = C.getDtNs(); });
  }

  /* ==== S7: bir tel, çok çekirdek (cordwood) ============================= */
  function initStrip() {
    const s = $('strip');
    if (!s) return;
    const el = C.el;
    const N = 9, PITCH = 72, X0 = 56, CY = 78, RO = 27, RH = 14;
    const cx = i => X0 + i * PITCH;

    const d = el('defs');
    d.innerHTML =
      '<radialGradient id="ferrite2" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0" stop-color="var(--fer-0)"/><stop offset="0.5" stop-color="var(--fer-1)"/>' +
        '<stop offset="0.8" stop-color="var(--fer-2)"/><stop offset="1" stop-color="var(--fer-5)"/></radialGradient>' +
      '<linearGradient id="fadeL"><stop offset="0" stop-color="var(--panel)"/><stop offset="1" stop-color="var(--panel)" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="fadeR"><stop offset="0" stop-color="var(--panel)" stop-opacity="0"/><stop offset="1" stop-color="var(--panel)"/></linearGradient>';
    s.appendChild(d);

    // bütün demet, her şeyin arkasında
    s.appendChild(el('path', { class: 'cw-band', d: 'M 8 ' + CY + ' L 712 ' + CY }));

    for (let i = 0; i < N; i++) {
      // düz dolgu, radyal gradyan değil: STROKE'a uygulanan gradyan bu boyutta
      // gözle görülür biçimde bantlanıyor ve iç içe halka gibi okunuyor.
      s.appendChild(el('circle', { class: 'cw-core', cx: cx(i), cy: CY, r: (RO + RH) / 2,
                                   fill: 'none', stroke: 'var(--core-inner)', 'stroke-width': (RO - RH) }));
      s.appendChild(el('circle', { class: 'cw-core', cx: cx(i), cy: CY, r: RO, fill: 'none' }));
      s.appendChild(el('circle', { class: 'cw-core', cx: cx(i), cy: CY, r: RH, fill: 'none' }));
      // bant, her deliğin içinde yeniden görünür
      s.appendChild(el('path', { class: 'cw-inhole',
        d: 'M ' + (cx(i) - RH + 1) + ' ' + CY + ' L ' + (cx(i) + RH - 1) + ' ' + CY }));
    }

    // demetten ayrılmış üç tel: aynı çekirdekler, farklı yollar
    const ROUTES = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1]
    ];
    ROUTES.forEach(function (route, r) {
      const off = (r - 1) * 6;
      const y = CY + off;
      let p = 'M 8 ' + y;
      for (let i = 0; i < N; i++) {
        p += ' L ' + (cx(i) - 32) + ' ' + y;
        p += route[i]
          ? ' L ' + (cx(i) + 32) + ' ' + y
          : ' Q ' + cx(i) + ' ' + (CY - RO - 22 + off) + ' ' + (cx(i) + 32) + ' ' + y;
      }
      p += ' L 712 ' + y;
      s.appendChild(el('path', { class: 'cw-str', d: p }));
    });

    s.appendChild(el('rect', { x: 0, y: 0, width: 46, height: 170, fill: 'url(#fadeL)' }));
    s.appendChild(el('rect', { x: 674, y: 0, width: 46, height: 170, fill: 'url(#fadeR)' }));
    const cap = el('text', { class: 'cw-cap', x: 360, y: 152 });
    cap.textContent = 'aynı çekirdekler — üç tel, üç ayrı yol';
    s.appendChild(cap);
  }

  /* ==== S7b: seçim, engellemeyle ========================================= */
  function initAddr() {
    const svg = $('addr'), bar = $('addrBits');
    if (!svg || !bar) return;
    const el = C.el;
    const N = 8, PITCH = 80, X0 = 96, CY = 238, RO = 26, RH = 13;
    const BUSY = [164, 108, 52];          // dizin = bit numarası (0 = LSB, en altta çizilir)
    const DROPX = [7, 0, -7];
    const cx = i => X0 + i * PITCH;
    let addr = 5;

    const d = el('defs');
    d.innerHTML = '<radialGradient id="ferrite3" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0" stop-color="var(--fer-0)"/><stop offset="0.5" stop-color="var(--fer-1)"/>' +
      '<stop offset="0.8" stop-color="var(--fer-2)"/><stop offset="1" stop-color="var(--fer-5)"/></radialGradient>';
    svg.appendChild(d);

    const gDrop = el('g'), gBus = el('g'), gCore = el('g'), gMark = el('g');
    [gDrop, gBus, gCore, gMark].forEach(x => svg.appendChild(x));

    // set hattı: hepsine birden ulaşır. Seçicilik onun işi değil.
    gCore.appendChild(el('path', { class: 'ad-set', d: 'M 20 ' + CY + ' L 700 ' + CY }));
    const setLab = el('text', { class: 'ad-lbl', x: 360, y: CY + 74 });
    setLab.textContent = 'sürücü (set) hattı — sekizini birden çevirmeye çalışır';
    gMark.appendChild(setLab);

    const rings = [], marks = [], labs = [], buses = [], blabs = [];
    for (let i = 0; i < N; i++) {
      gCore.appendChild(el('circle', { cx: cx(i), cy: CY, r: (RO + RH) / 2, fill: 'none',
                                       stroke: 'var(--core-inner)', 'stroke-width': (RO - RH) }));
      const ring = el('circle', { class: 'ad-core', cx: cx(i), cy: CY, r: RO, fill: 'none' });
      gCore.appendChild(ring); rings.push(ring);
      gCore.appendChild(el('circle', { class: 'ad-core', cx: cx(i), cy: CY, r: RH, fill: 'none' }));
      const m = el('text', { class: 'ad-x', x: cx(i), y: CY + 5 }); m.textContent = '×';
      gMark.appendChild(m); marks.push(m);
      const l = el('text', { class: 'ad-lbl', x: cx(i), y: CY + RO + 20 });
      gMark.appendChild(l); labs.push(l);
    }

    for (let b = 2; b >= 0; b--) {
      const bus = el('path', { class: 'ad-bus', d: 'M 20 ' + BUSY[b] + ' L 700 ' + BUSY[b] });
      gBus.appendChild(bus); buses[b] = bus;
      const t = el('text', { class: 'ad-bl', x: 700, y: BUSY[b] - 9, style: 'text-anchor:start' });
      t.setAttribute('x', 20); gBus.appendChild(t); blabs[b] = t;
    }

    function draw() {
      while (gDrop.firstChild) gDrop.removeChild(gDrop.firstChild);
      for (let b = 0; b < 3; b++) {
        const want = (addr >> b) & 1;
        // çiftin EŞLEŞMEYEN üyesini besle: b biti adresle uyuşmayan her
        // çekirdeği engeller.
        const hit = [];
        for (let i = 0; i < N; i++) if (((i >> b) & 1) !== want) hit.push(i);
        buses[b].classList.add('on');
        blabs[b].classList.add('on');
        blabs[b].textContent = 'engelle: bit ' + b + ' = ' + (1 - want) + ' olanlar';
        hit.forEach(i => gDrop.appendChild(el('path', { class: 'ad-drop',
          d: 'M ' + (cx(i) + DROPX[b]) + ' ' + BUSY[b] + ' L ' + (cx(i) + DROPX[b]) + ' ' + (CY - RO - 8) })));
      }
      for (let i = 0; i < N; i++) {
        const live = (i === addr);
        rings[i].classList.toggle('live', live);
        marks[i].style.display = live ? 'none' : '';
        labs[i].textContent = i.toString(2).padStart(3, '0');
        labs[i].classList.toggle('live', live);
      }
      [].slice.call(bar.querySelectorAll('.abit')).forEach((btn, k) => {
        const b = 2 - k;
        btn.classList.toggle('on', ((addr >> b) & 1) === 1);
        btn.textContent = (addr >> b) & 1;
      });
    }

    for (let k = 0; k < 3; k++) {
      const b = 2 - k;
      const btn = document.createElement('button');
      btn.className = 'abit'; btn.type = 'button';
      btn.setAttribute('aria-label', 'adres biti ' + b);
      btn.addEventListener('click', () => { addr ^= (1 << b); draw(); });
      bar.appendChild(btn);
    }
    const note = document.createElement('span');
    note.className = 'alab';
    note.textContent = '← bitlere bas, ayakta kalan çekirdeği izle';
    bar.appendChild(note);
    draw();
  }

  /* ==== S8: fazlalığın hesabı ============================================ */
  function initBudget() {
    const s = $('budget');
    if (!s) return;
    const el = C.el;
    const X0 = 14, W = 672, Y = 34, H = 30;
    const FREE = 180, TOTAL = 192;          // tek parite, 16'sının birden 1
    const wFree = W * FREE / TOTAL;         // olmasını yasaklıyor: 192'nin 12'si özgür değil

    s.appendChild(el('rect', { class: 'bg-track', x: X0, y: Y, width: W, height: H, rx: 5 }));
    s.appendChild(el('rect', { class: 'bg-free', x: X0, y: Y, width: wFree, height: H, rx: 5 }));
    s.appendChild(el('rect', { class: 'bg-red',  x: X0 + wFree, y: Y, width: W - wFree, height: H, rx: 5 }));

    const a = el('text', { class: 'bg-num', x: X0 + 12, y: Y + 20 });
    a.textContent = '180 bit özgür';
    s.appendChild(a);

    // Fazlalık dilim çubuğun yalnızca %6,25'i (~42px) — kendi etiketini
    // taşıyamayacak kadar dar, o yüzden bir etikete işaret ediyor.
    s.appendChild(el('path', { d: 'M ' + (X0 + W - 21) + ' ' + (Y + H) + ' L ' + (X0 + W - 21) + ' ' + (Y + H + 12),
                               stroke: 'var(--wire-copper-bright)', 'stroke-width': 1.2, fill: 'none' }));
    const b = el('text', { class: 'bg-lbl', x: X0 + W, y: Y + H + 24,
                           style: 'text-anchor:end;fill:var(--wire-copper-bright);font-weight:600' });
    b.textContent = '12 bit fazlalık';
    s.appendChild(b);

    const t1 = el('text', { class: 'bg-tick', x: X0, y: Y - 10 });
    t1.textContent = 'bir çekirdekten geçen 192 telin taşıyabildiği bilgi';
    s.appendChild(t1);

    const t2 = el('text', { class: 'bg-lbl', x: X0, y: Y + H + 24 });
    t2.textContent = '12 kelime × 15 serbest bit = 180';
    s.appendChild(t2);

    const t3 = el('text', { class: 'bg-tick', x: X0, y: Y + H + 46 });
    t3.textContent = 'yani 2¹⁹² değil, 2¹⁸⁰ farklı desen — çekirdeğin alabileceği biçim sayısı kodun kendisiyle kısıtlı';
    s.appendChild(t3);
  }

  return {
    initRadial, initScope, initReadout, initPresets, initInstr,
    initLoop, initSignal, initStrip, initAddr, initBudget
  };
})();
