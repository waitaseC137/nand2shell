/* ============================================================================
   rope-boot.js — bütün widget'ları çağırır. Sayfada karşılığı olmayan sessizce
   çekilir (her init kendi id'sini arar), o yüzden ders.html ve tezgah.html
   aynı üç dosyayı yükler.

   Üçüncü koruma katı burada: bir widget kurulurken patlarsa konsola yazılır,
   diğerleri kurulmaya devam eder.
   ========================================================================== */
(function () {
  'use strict';

  const C = window.RopeCore, W = window.RopeWidgets;
  if (!C || !W) {
    console.error('[rope] çekirdek ya da widget dosyası yüklenmedi — script sırasına bak');
    return;
  }

  [['radyal', W.initRadial], ['osiloskop', W.initScope], ['okuma', W.initReadout],
   ['presetler', W.initPresets], ['komut', W.initInstr], ['çevrim', W.initLoop],
   ['sinyal', W.initSignal], ['şerit', W.initStrip], ['adres', W.initAddr],
   ['bütçe', W.initBudget]]
    .forEach(function (pair) {
      try { pair[1](); }
      catch (err) { console.error('[rope] "' + pair[0] + '" widget kurulumu patladı:', err); }
    });

  C.emit();   // ilk çizim — abone olan herkes kendini bir kez çizsin
})();
