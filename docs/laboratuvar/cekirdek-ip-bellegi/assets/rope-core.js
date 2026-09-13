/* ============================================================================
   rope-core.js — çekirdek: durum, AGC kelime matematiği, çözümleyici, SVG
   yardımcıları. DOM'a HİÇ dokunmaz.

   Neden ayrı: ders ve tezgâh aynı kelimeyi, aynı matematiği ve aynı çizim
   yardımcılarını paylaşıyor. İkisine de aynı dosya yüklenir; hangi widget'ın
   çalışacağını sayfadaki id'ler belirler (bkz. rope-widgets.js).

   Yayın modeli: durumu değiştiren tek yol buradaki mutator'lar. Her mutator
   emit() çağırır, aboneler KENDİNİ çizer. Hiçbir widget başka bir widget'ı
   çağırmaz — eski render() zincirinin yerini bu aldı.
   ========================================================================== */
window.RopeCore = (function () {
  'use strict';

  const ROWS = 2, COLS = 8;
  const DATA_BITS = 15;            // AGC kelimesi: bit 15..1
  const WIRE_COUNT = ROWS * COLS;  // 16 sense teli = 15 veri + 1 parite

  function intToBits(val, n) {
    const out = [];
    for (let b = n - 1; b >= 0; b--) out.push((val >>> b) & 1);
    return out;
  }

  // Luminary 099'dan — Apollo 11 Ay Modülü uçuş programının gerçek kelimeleri.
  const presets = {
    EXTEND: 0o00006, // 04005 INTERRUPT_LEAD_INS — ipteki en sık geçen kelime
    ALARM:  0o01202, // 01,2703 EXECUTIVE — 'OCT 1202', iniş alarmının numarası
    CAZERO: 0o34755, // 322 kez: 299'u CA ZERO, 23'ü DCA NEG0
    BZF:    0o13247, // 32,3241 THE_LUNAR_LANDING — P63
    NEG0:   0o77777, // 4754 FIXED_FIXED_CONSTANT_POOL — 'OCT -0'
    ZERO:   0o00000, // 4755
  };

  // Varsayılan bilerek EXTEND: Z'ye dokunmaz, böylece çevrim düğmesi
  // 03250 -> 03251 -> 03252 diye görünür biçimde yürür. ALARM (TC 1202) kendi
  // operandına atlayıp orada donar, o da düğmeyi bozukmuş gibi gösterir.
  let bits = intToBits(presets.EXTEND, DATA_BITS);  // 15 girdi. Parite ASLA burada tutulmaz.
  let pulsing = false;
  let Z = 0o3250;
  let dtNs = 200;   // akı dönüş süresi; kaydırıcı varsa onu günceller

  // "Şu anda okuma darbesi geçiyor." Bu bir MODEL durumu, widget işi değil:
  // radyal onu kurar, osiloskop okur, ikisi birbirini hiç tanımaz. Eski kodda
  // firePulse doğrudan drawScope(true) çağırıyordu — kaldırmak istediğimiz bağ
  // tam olarak oydu.
  let firing = false;

  /* ---- yayın ------------------------------------------------------------- */
  const subs = [];
  function subscribe(fn) { subs.push(fn); return fn; }

  // Bir abonenin patlaması diğerlerini öldürmesin. Eski koddaki tek zincirde
  // ilk hata sayfadaki her şeyi durduruyordu.
  function emit() {
    for (const fn of subs) {
      try { fn(); }
      catch (err) { console.error('[rope] abone çizim hatası:', err); }
    }
  }

  /* ---- kelime matematiği ------------------------------------------------- */

  // 16 çekirdek boyunca tek parite. Bu biti donanım sahiplenir; gerçek AGC'de
  // yazılım onu ne okuyabilir ne yazabilir — 15. yuvanın tıklanamaz olma sebebi.
  function parityBit() {
    return bits.reduce((a, b) => a + b, 0) % 2 === 1 ? 0 : 1;
  }

  // i teli üzerinde görünen değer: veri bitleri `bits`ten, 15. yuva hesaplanır.
  function wireValue(i) {
    return i === DATA_BITS ? parityBit() : bits[i];
  }

  const word = () => bits.reduce((a, b) => a * 2 + b, 0);   // 0 .. 32767
  const oct5 = v => v.toString(8).padStart(5, '0');
  const oct4 = v => v.toString(8).padStart(4, '0');

  const decimal = () => word();
  const octal   = () => oct5(word());
  const bitsText = () => bits.join('').match(/.{1,3}/g).join(' ');

  // Birler tümleyeni, 15 bit. İki sıfır var: 00000 artı sıfır, 77777 eksi sıfır.
  function signed() {
    const val = word();
    return val === 0     ? '+0'
         : val === 32767 ? '−0'
         : (val >> 14) === 0 ? '+' + val
         : '−' + (32767 - val);
  }

  /* ---- darbe şekli ------------------------------------------------------- */
  // Bilerek bir GERİLİM değil. Faraday yasası doğru ama burada kullanılamaz:
  // bant sarımlı rope çekirdeğinin etkin kesit alanı Ae hiçbir birincil
  // kaynakta yok, dolayısıyla üretilecek her volt rakamı uydurma olur.
  // Δt bunun yerine sense darbesinin ŞEKLİNİ sürüyor.
  function pulseShape() {
    const t = dtNs / 1000;                 // 0.05 .. 1.0
    return {
      dtNs,
      halfWidth: 2.5 + t * 13,             // osiloskop dikeninin yarı genişliği
      flashMs:   Math.round(280 + t * 320) // çekirdek halkasının parlama süresi
    };
  }

  /* ---- mutator'lar ------------------------------------------------------- */
  function toggleBit(i) {
    if (i >= DATA_BITS) return;   // parite donanımın
    bits[i] = bits[i] ? 0 : 1;
    emit();
  }
  function setBits(val) { bits = intToBits(val, DATA_BITS); emit(); }
  function setPreset(name) {
    if (name === 'rand') {
      let v = 0;
      for (let k = 0; k < DATA_BITS; k++) v = v * 2 + (Math.random() < 0.5 ? 0 : 1);
      setBits(v);
    } else if (name in presets) {
      setBits(presets[name]);
    }
  }
  function setDtNs(v) { dtNs = v; emit(); }
  function setZ(v) { Z = v; emit(); }

  /* ---- SVG yardımcıları -------------------------------------------------- */
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  const f = n => Math.round(n * 100) / 100;

  // ---- Radyal geometri ----------------------------------------------------
  // 20 derecelik 18 yuva: yuva 0 = sürücü sargısı (saat 12), yuva 9 = boş
  // (akı oku, nefes payı), kalan 16'sı kelimeyi taşır.
  const CX = 290, CY = 290;
  const SLOTS = WIRE_COUNT + 2, PITCH = 360 / SLOTS;
  const R_START = 224, R_CAP = 236, R_DIGIT = 262, IDX_DY = 16;
  const R_OUT = 152, R_HOLE = 86;
  const R_TIP1 = [58, 72], R_TIP0 = 178, TIP_BULGE = 1.9;
  const W_START = 18, W_TIP1 = 5.5, W_TIP0 = 16;
  const R_DRIVE = 278, RT_DRIVE = 44, W_DRIVE_S = 14, W_DRIVE_T = 6;
  const HIT_R0 = 92, HIT_R1 = 282, HIT_HALF = 9.3;

  const D2R = Math.PI / 180;
  const pt = (r, d) => [CX + r * Math.cos(d * D2R), CY + r * Math.sin(d * D2R)];
  const slotAngle = k => -90 + PITCH * k;
  const S = a => f(a[0]) + ' ' + f(a[1]);

  function wHalf(u, RT, WT, RS, WS) {
    const t = Math.max(0, Math.min(1, (u - RT) / (RS - RT)));
    return WT + (WS - WT) * Math.pow(t, 0.78);
  }
  function strand(u0, u1, RT, WT, RS, WS, sign) {
    const d = u0 - u1, p = u => [CX + sign * wHalf(u, RT, WT, RS, WS), CY - u];
    return { P0: p(u0), C1: p(u0 - 0.34 * d), C2: p(u1 + 0.34 * d), P3: p(u1) };
  }
  // TEK sürekli firkete. Alt/üst diye ikiye bölmek, uç noktası ortak ama
  // teğeti ortak olmayan iki kübik verir ve her uç sivrilerek çizilir.
  // Örtme bunun yerine bir kopyayı kırparak yapılıyor.
  function hairpin(RT, WT, RS, WS, bulge) {
    const L = strand(RS, RT, RT, WT, RS, WS, -1), R = strand(RT, RS, RT, WT, RS, WS, +1);
    const b = WT * (bulge === undefined ? 1.55 : bulge);
    return 'M ' + S(L.P0) + ' C ' + S(L.C1) + ' ' + S(L.C2) + ' ' + S(L.P3)
         + ' C ' + f(CX - WT) + ' ' + f(CY - RT - b) + ' ' + f(CX + WT) + ' ' + f(CY - RT - b) + ' ' + S(R.P0)
         + ' C ' + S(R.C1) + ' ' + S(R.C2) + ' ' + S(R.P3);
  }
  const ringPath = r => 'M ' + (CX - r) + ' ' + CY + ' A ' + r + ' ' + r + ' 0 1 0 ' + (CX + r) + ' ' + CY
                      + ' A ' + r + ' ' + r + ' 0 1 0 ' + (CX - r) + ' ' + CY;
  function wedge(deg, r0, r1, half) {
    const a = [pt(r1, deg - half), pt(r1, deg + half), pt(r0, deg + half), pt(r0, deg - half)];
    return 'M ' + S(a[0]) + ' A ' + r1 + ' ' + r1 + ' 0 0 1 ' + S(a[1])
         + ' L ' + S(a[2]) + ' A ' + r0 + ' ' + r0 + ' 0 0 0 ' + S(a[3]) + ' Z';
  }
  function arcPath(d0, d1, r) {
    return 'M ' + S(pt(r, d0)) + ' A ' + r + ' ' + r + ' 0 0 1 ' + S(pt(r, d1));
  }

  /* ---- AGC Block II çözümleyicisi ---------------------------------------- */
  // Algoritma Luminary 099 listelerinden 3.161 gerçek komut kelimesiyle
  // denetlendi: uçuş çeviricisiyle %99,72 uyum. Dokuz uyuşmazlığın hepsi
  // "INDEX temel kelimesi" durumu — tasarımı gereği tek başına çözülemez,
  // hiçbir tek-kelime görünüşü onu ayırt edemez.

  // Sekizlik 00-023 silinebilir gözler RAM değil, kayıttır. 07 donanımsal
  // olarak +0'a bağlıdır; "ZL"nin sadece LXCH 7 olmasının sebebi bu.
  const REGS = {
    0: 'A', 1: 'L', 2: 'Q', 3: 'EB', 4: 'FB', 5: 'Z', 6: 'BB', 7: '+0',
    8: 'ARUPT', 9: 'LRUPT', 10: 'QRUPT', 11: 'SAMPTIME', 12: 'SAMPTIME',
    13: 'ZRUPT', 14: 'BBRUPT', 15: 'BRUPT',
    16: 'CYR', 17: 'SR', 18: 'CYL', 19: 'EDOP'
  };

  // Birebir eşleşen sözde-komutlar. Genel dağıtımdan ÖNCE denenmeli:
  // 00006 harfiyen "TC 6" diye kodlanmıştır ama hiçbir yere dallanmaz,
  // bunun yerine extracode bayrağını kurar.
  const IMPLIED_BASIC = {
    0o00000: 'XXALQ', 0o00001: 'XLQ',    0o00002: 'RETURN', 0o00003: 'RELINT',
    0o00004: 'INHINT', 0o00006: 'EXTEND', 0o20001: 'DDOUBL', 0o22007: 'ZL',
    0o30000: 'NOOP',  0o40000: 'COM',    0o50017: 'RESUME', 0o52005: 'DTCF',
    0o52006: 'DTCB',  0o54000: 'OVSK',   0o54005: 'TCAA',   0o60000: 'DOUBLE'
  };
  const IMPLIED_EXTRA = { 0o22007: 'ZQ', 0o40001: 'DCOM', 0o70000: 'SQUARE' };
  const CHAN_OPS = ['READ', 'WRITE', 'RAND', 'WAND', 'ROR', 'WOR', 'RXOR', 'EDRUPT'];
  const JUMPERS  = { TC: 1, TCF: 1, BZF: 1, BZMF: 1 };

  function disassemble(w, extend) {
    const implied = (extend ? IMPLIED_EXTRA : IMPLIED_BASIC)[w];
    // RETURN dallanır, ama Q'da ne varsa oraya — ve bu sayfa Q'yu modellemiyor,
    // o yüzden döngü görünüşü onu hedef uydurmak yerine dallanmayan sayıyor.
    // Bu tablodaki her şey gerçekten Z'ye dokunmuyor.
    if (implied) return { mnemonic: implied, operand: null, text: implied, jumps: false, target: null };

    const op = (w >> 12) & 7, qc = (w >> 10) & 3, pc = (w >> 9) & 7;
    const a12 = w & 0o7777, a10 = w & 0o1777, a9 = w & 0o777;
    const m1  = k => (k - 1) & 0o1777;   // DAS/DXCH, K+1'i 10 bitlik alanda kodlar
    const m1w = k => (k - 1) & 0o7777;   // DCA/DCS, K+1'i 12 bitlik alanda kodlar
    let mn, k, chan = false;

    if (!extend) {
      if      (op === 0)             { mn = 'TC';    k = a12; }
      else if (op === 1 && qc === 0) { mn = 'CCS';   k = a10; }
      else if (op === 1)             { mn = 'TCF';   k = a12; }
      else if (op === 2 && qc === 0) { mn = 'DAS';   k = m1(a10); }
      else if (op === 2 && qc === 1) { mn = 'LXCH';  k = a10; }
      else if (op === 2 && qc === 2) { mn = 'INCR';  k = a10; }
      else if (op === 2)             { mn = 'ADS';   k = a10; }
      else if (op === 3)             { mn = 'CA';    k = a12; }
      else if (op === 4)             { mn = 'CS';    k = a12; }
      else if (op === 5 && qc === 0) { mn = 'INDEX'; k = a10; }
      else if (op === 5 && qc === 1) { mn = 'DXCH';  k = m1(a10); }
      else if (op === 5 && qc === 2) { mn = 'TS';    k = a10; }
      else if (op === 5)             { mn = 'XCH';   k = a10; }
      else if (op === 6)             { mn = 'AD';    k = a12; }
      else                           { mn = 'MASK';  k = a12; }
    } else {
      if      (op === 0)             { mn = CHAN_OPS[pc]; k = a9; chan = true; }
      else if (op === 1 && qc === 0) { mn = 'DV';    k = a10; }
      else if (op === 1)             { mn = 'BZF';   k = a12; }
      else if (op === 2 && qc === 0) { mn = 'MSU';   k = a10; }
      else if (op === 2 && qc === 1) { mn = 'QXCH';  k = a10; }
      else if (op === 2 && qc === 2) { mn = 'AUG';   k = a10; }
      else if (op === 2)             { mn = 'DIM';   k = a10; }
      else if (op === 3)             { mn = 'DCA';   k = m1w(a12); }
      else if (op === 4)             { mn = 'DCS';   k = m1w(a12); }
      else if (op === 5)             { mn = 'INDEX'; k = a12; }
      else if (op === 6 && qc === 0) { mn = 'SU';    k = a10; }
      else if (op === 6)             { mn = 'BZMF';  k = a12; }
      else                           { mn = 'MP';    k = a12; }
    }

    // Operandlar her zaman sekizliktir. AGC'de onaltılık bir anakronizmdir.
    const oct = k.toString(8).padStart(chan ? 2 : 4, '0');
    const operand = chan ? 'CH' + oct : (REGS[k] ? oct + ' (' + REGS[k] + ')' : oct);
    return {
      mnemonic: mn, operand, text: mn + ' ' + operand,
      jumps: !!JUMPERS[mn], target: JUMPERS[mn] ? k : null, viaQ: false
    };
  }

  // Döngü görünüşü temel kümeyi okur: inceleyecek bir önceki kelimesi yok.
  function controlFlow(w) { return disassemble(w, false); }

  // Kısaltma bir başka anlaşılmaz simge olarak kalmasın diye düz Türkçe karşılık.
  const GLOSS = {
    TC: "oraya git, dönüş adresini Q'ya bırak", TCF: 'sabit hafızaya atla, dönüş bırakma',
    CCS: 'say, karşılaştır, atla — tek koşullu dal', CA: "şunu al, A'ya yaz",
    CS: "şunun tersini A'ya yaz", AD: "A'ya ekle", MASK: 'A ile bit bit VE',
    TS: "A'yı şuraya yaz", XCH: 'A ile şurayı takas et', LXCH: 'L ile şurayı takas et',
    DXCH: '(A,L) çiftiyle şurayı takas et', INCR: 'şurayı bir artır', ADS: "A'yı şuraya ekle",
    INDEX: 'sıradaki komutu şununla topla', DAS: 'çift kelimeyi topla',
    BZF: 'A sıfırsa atla', BZMF: 'A sıfır ya da eksiyse atla', SU: 'çıkar', MP: 'çarp', DV: 'böl',
    MSU: 'modüler çıkar', QXCH: 'Q ile şurayı takas et', AUG: 'sıfırdan uzaklaştır',
    DIM: 'sıfıra yaklaştır', DCA: 'çift kelimeyi al', DCS: 'çift kelimenin tersini al',
    READ: 'G/Ç kanalını oku', WRITE: 'kanala yaz', RAND: 'kanalı oku ve VE-le',
    WAND: 'kanalla VE-le, ikisine de yaz', ROR: 'kanalı oku ve VEYA-la',
    WOR: 'kanalla VEYA-la, ikisine de yaz', RXOR: 'kanalı oku ve XOR-la',
    EDRUPT: 'fabrika testi komutu',
    EXTEND: 'sıradaki kelimeyi öbür tablodan oku', RELINT: 'kesmeleri aç', INHINT: 'kesmeleri kapat',
    RESUME: 'kesmeden dön', RETURN: 'alt programdan dön', ZL: "L'yi sıfırla", ZQ: "Q'yu sıfırla",
    COM: "A'yı tersle", DCOM: '(A,L) çiftini tersle', DOUBLE: "A'yı ikiye katla",
    DDOUBL: '(A,L) çiftini ikiye katla', SQUARE: "A'nın karesi", NOOP: 'hiçbir şey yapma',
    OVSK: 'taşma var mı diye bak', TCAA: "A'daki adrese git",
    DTCF: 'banka değiştirerek atla', DTCB: 'her iki bankayı değiştirerek atla',
    XXALQ: "A'daki komutu çalıştır", XLQ: "L'deki komutu çalıştır"
  };

  /* ---- dışarı açılan yüz -------------------------------------------------- */
  return {
    // sabitler
    ROWS, COLS, DATA_BITS, WIRE_COUNT, presets,

    // durum — okuma
    getBits: () => bits,
    isPulsing: () => pulsing,
    isFiring: () => firing,
    getZ: () => Z,
    getDtNs: () => dtNs,

    // durum — yazma (setPulsing hariç hepsi emit eder; o yalnızca düğme
    // kilidi, çizimi ilgilendirmiyor)
    toggleBit, setBits, setPreset, setDtNs, setZ,
    setPulsing: v => { pulsing = v; },
    setFiring: v => { firing = v; emit(); },

    // türetilmiş değerler
    parityBit, wireValue, word, octal, decimal, signed, bitsText, oct5, oct4,
    pulseShape,

    // çözümleyici
    disassemble, controlFlow, GLOSS,

    // SVG yardımcıları + geometri
    NS, el, f, pt, S, slotAngle, wHalf, strand, hairpin, ringPath, wedge, arcPath,
    geom: {
      CX, CY, SLOTS, PITCH, R_START, R_CAP, R_DIGIT, IDX_DY, R_OUT, R_HOLE,
      R_TIP1, R_TIP0, TIP_BULGE, W_START, W_TIP1, W_TIP0,
      R_DRIVE, RT_DRIVE, W_DRIVE_S, W_DRIVE_T, HIT_R0, HIT_R1, HIT_HALF
    },

    // yayın
    subscribe, emit
  };
})();
