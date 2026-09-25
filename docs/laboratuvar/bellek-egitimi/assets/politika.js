/* Politika oyunu — "firmware sensin".
 *
 * Her açılışta firmware'in önünde aynı soru var: kayıtlı eğitim sonucuna
 * güvenip ~7 saniyede mi açılsın, yoksa belleği baştan eğitip ~50 saniye mi
 * beklesin? Kartlar birer olay; okur kararı verir, ardından bedel ve sebep
 * açılır. Oyunun sonunda gerçek bir firmware'in (bu laboratuvarın vakası)
 * ölçülen davranışı gösterilir.
 *
 * Riskler TEMSİLÎDİR, ölçüm değil: "bu durumda kayıtlı ayar ne kadar
 * yanlış olabilir" sorusunun kaba bir sıralaması.
 *
 *   <div data-politika></div>
 */
(function () {
  'use strict';

  const EGITIM_S = 50, KAYIT_S = 0;

  // vaka: bu laboratuvarın vakasında ne oldu. olcum=true → 9 açılışlık deneyde ölçüldü.
  const KARTLAR = [
    { ev: 'Aynı gün, ikinci açılış',
      ds: 'Öğlen kapattın, akşam açıyorsun. Hiçbir parça değişmedi, oda aynı oda.',
      risk: 'çok düşük', r: 0.001,
      neden: 'Kayıt birkaç saat önce, aynı donanımda, aynı koşullarda alındı. Yeniden ölçmek büyük ihtimalle aynı sonucu verir, yalnız zaman kaybedersin.',
      vaka: { k: 'kaydı kullandı', olcum: true } },
    { ev: 'Ertesi gün',
      ds: 'Dün akşam kapattın, bu sabah açıyorsun. Donanım aynı.',
      risk: 'çok düşük', r: 0.002,
      neden: 'Bir gecede değişen tek şey sıcaklık olabilir. Göz yeterince genişse kayıtlı ayar hâlâ ortada durur.',
      vaka: { k: 'kaydı kullandı', olcum: true } },
    { ev: 'Ayın ilk günü',
      ds: 'Dün ayın son günüydü, bugün yeni ay başladı. Donanım aynı, bir gün geçti.',
      risk: 'düşük', r: 0.003,
      neden: 'Fizik açısından "ertesi gün"den farkı yok. Ama tarihe bakan bir kural için takvimde bir sınır geçildi. Bazı firmware\'ler kaydın ömrünü takvimle sınırlar: "bu ay alınmış ölçüme güvenirim, geçen ayınkine değil."',
      vaka: { k: 'baştan eğitti', olcum: true } },
    { ev: 'Saat geriye gitti',
      ds: 'Anakarttaki saat bir yıl geride görünüyor. Belki saat pili bitti, belki biri ayarları sıfırladı.',
      risk: 'orta', r: 0.03,
      neden: 'RAM\'in kendisi değişmemiş olabilir. Ama saatin geriye gitmesi "bu makinenin başına bir şey geldi" demek: pil sökülmüş, parça değişmiş olabilir. Temkinli firmware kanıt ister.',
      vaka: { k: 'baştan eğitti', olcum: true } },
    { ev: 'Sıcaklık çok farklı',
      ds: 'Dizüstü gece arabada kaldı, 0 °C\'de açıyorsun. Kayıt oda sıcaklığında alınmıştı. Tarih aynı gün.',
      risk: 'orta', r: 0.08,
      neden: 'Sıcaklık gözü kaydırır: tezgâhta sıcaklık düğmesini çevirince kayıtlı ayarın kenara düştüğünü görürsün. Yalnız tarihe bakan bir kural bunu hiç sormaz.',
      vaka: { k: 'denenmedi (kural tarihe bakıyor; sıcaklığı sorup sormadığı bilinmiyor)', olcum: false } },
    { ev: 'BIOS güncellendi',
      ds: 'Üretici yeni bir BIOS yayımladı, yükledin. Bellek eğitim yazılımı da yenilenmiş olabilir.',
      risk: 'orta', r: 0.2,
      neden: 'Eski kayıt eski yazılımın ölçtüğü değerler. Yeni yazılım aynı değerleri farklı yorumlayabilir; çoğu firmware güncellemeden sonra baştan eğitir.',
      vaka: { k: 'test edilmedi', olcum: false } },
    { ev: 'İşlemci değişti',
      ds: 'Anakart aynı, işlemci başka bir örnekle değiştirildi.',
      risk: 'yüksek', r: 0.6,
      neden: 'Bellek denetleyicisi işlemcinin içinde. Yeni işlemcinin kendi transistörleri, kendi gecikmeleri var: eski ölçüm onun için geçersiz.',
      vaka: { k: 'kayıtta işlemci seri numarası alanı var (test edilmedi)', olcum: false } },
    { ev: 'RAM modülü değişti',
      ds: 'Yeni bir bellek modülü taktın. Farklı üretici, farklı çipler.',
      risk: 'çok yüksek', r: 0.9,
      neden: 'Kayıt başka bir modülün hatlarına göre alındı. Onunla açılmak tahminle açılmak demek. Her makul firmware burada baştan eğitir.',
      vaka: { k: 'kayıtta modülün seri numarası var (test edilmedi)', olcum: false } },
  ];

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function mount(root) {
    root.classList.add('tool');
    let k = 0, sure = 0, risk = 0;
    const secim = [];

    const score = el('div', 'score');
    const kart = el('div', 'card');
    root.appendChild(kart);
    root.appendChild(score);

    function puan() {
      score.innerHTML = `<span>fazladan bekleme: <b>${sure} s</b></span>` +
        `<span>göze alınan risk: <b>${risk.toFixed(2)}</b></span>` +
        `<span>kart: <b>${Math.min(k + 1, KARTLAR.length)}/${KARTLAR.length}</b></span>`;
    }

    function goster() {
      puan();
      if (k >= KARTLAR.length) { son(); return; }
      const c = KARTLAR[k];
      kart.innerHTML = '';
      kart.appendChild(el('div', 'c-no', `olay ${k + 1}`));
      kart.appendChild(el('div', 'c-ev', c.ev));
      kart.appendChild(el('p', 'c-ds', c.ds));
      const btns = el('div', 'c-btns');
      const b1 = el('button', 'chip', 'kayda güven (~7 s)');
      const b2 = el('button', 'chip main', 'baştan eğit (~57 s)');
      b1.type = b2.type = 'button';
      btns.appendChild(b1); btns.appendChild(b2);
      kart.appendChild(btns);
      const v = el('div', 'verdict');
      kart.appendChild(v);

      function karar(egit) {
        b1.disabled = b2.disabled = true;
        sure += egit ? EGITIM_S : KAYIT_S;
        if (!egit) risk += c.r;
        secim.push(egit);
        v.innerHTML = `<span class="tag">${egit ? `+${EGITIM_S} s bekleme` : `göze alınan risk: ${c.risk}`}</span><br>${c.neden}`;
        const ileri = el('button', 'chip', k + 1 < KARTLAR.length ? 'sonraki olay →' : 'sonucu gör →');
        ileri.type = 'button';
        ileri.addEventListener('click', () => { k++; goster(); });
        v.appendChild(el('div', 'c-btns')).appendChild(ileri);
        puan();
      }
      b1.addEventListener('click', () => karar(false));
      b2.addEventListener('click', () => karar(true));
    }

    function son() {
      kart.innerHTML = '';
      kart.appendChild(el('div', 'c-ev', 'Senin politikan ve gerçek bir firmware\'inki'));
      kart.appendChild(el('p', 'c-ds',
        'Doğru cevap yok, bir denge var: her "baştan eğit" yaklaşık 50 saniye fazladan kara ekran demek; her "kayda güven" küçük bir hata riski. ' +
        'Aşağıda bu laboratuvarın vakasındaki makinenin ne yaptığı var. <b>Ölçüldü</b> yazanlar 9 açılışlık deneyden, gerisi kayıttaki alanlardan çıkarım.'));
      const w = el('div', 'tbl-wrap');
      let t = '<table><tr><th>olay</th><th>sen</th><th>vaka makinesi</th></tr>';
      KARTLAR.forEach((c, i) => {
        t += `<tr><td>${c.ev}</td><td>${secim[i] ? 'baştan eğit' : 'kayda güven'}</td>` +
             `<td>${c.vaka.k}${c.vaka.olcum ? ' · <b>ölçüldü</b>' : ''}</td></tr>`;
      });
      w.innerHTML = t + '</table>';
      kart.appendChild(w);
      kart.appendChild(el('p', 'c-ds',
        'Vaka makinesinin kuralı tek cümle: <b>saat son eğitimden geride ya da ay/yıl farklıysa baştan eğit.</b> ' +
        'Sıcaklığı sorup sormadığı denenmedi. Sormuyorsa, bir karşılaştırmanın atladığı etkenler ayrı bir zayıflık sınıfı (CWE-1023).'));
      const bas = el('button', 'chip', 'baştan oyna');
      bas.type = 'button';
      bas.addEventListener('click', () => { k = 0; sure = 0; risk = 0; secim.length = 0; goster(); });
      kart.appendChild(el('div', 'c-btns')).appendChild(bas);
      puan();
    }

    goster();
  }

  function boot() { document.querySelectorAll('[data-politika]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
