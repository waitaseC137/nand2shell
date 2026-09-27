# ⚡ nand2shell

> **NAND'dan shell'e.** En altta tek bir mantık kapısı var, en üstte kendi açtığın kabuk.
> Aradaki her basamağı kendin kuruyorsun.
>
> Şu an repoda ilk basamak var: **NandGame** ile şalterden işlemciye.
> Bilgisayarı **katman katman, en alttan** öğren — oyun oynayarak, deneye yanıla.

---

## 🧭 Yol Haritası — nereye gidiyoruz?

Bu repo rastgele büyümüyor; voltajdan işletim sistemine uzanan tek bir merdiveni takip
ediyor. Hangi basamaktayız, neyi bitirdik, sırada ne var — hepsi tek dosyada,
işaretli:

→ **[ROADMAP.md — Voltajdan İşletim Sistemine](./ROADMAP.md)**

> `[x]` oturdu · `[ ]` 🚧 başlandı, yarım · `[ ]` henüz başlanmadı.
> Bir basamak, konu anlatıldığı için değil, **"oturdu" dendiği için** kapanır.

---

## 🔌 Şalterden Bilgisayara

NAND kapısından toplayıcıya, ALU'ya ve hafızaya: [NandGame](https://nandgame.com)'i seviye seviye çözerek yazılan dersler. Aritmetik ve ALU üniteleri tamam (00–15), hafıza ünitesi yazılıyor (16 SR Latch · 17 D Latch).

→ **[Buradan başla](./konu_anlatimlari/salterden_bilgisayara/00_buradan_basla.md)** · [Bütün dersler](./konu_anlatimlari/KONU_ANLATIMLARI.md)

> 👾 **Derslerde karşına çıkan zayıflıklar:** [CWE Haritası](./konu_anlatimlari/cwe/README.md) — 28 zayıflık, her biri doğduğu derse bağlı.

> 🧰 **Derslerdeki iddiaların sınamaları:** [araclar/](./araclar/) — hangi dosyanın hangi dersin hangi cümlesini sınadığıyla birlikte.

---

## 🛠️ Nasıl Kullanılır?

1. [nandgame.com](https://nandgame.com)'da seviyeyi aç
2. Önce **kendi başına** dene
3. Takılırsan dersin ipuçlarına bak — çözümler kapalı kutularda saklı
4. Çözümü ancak en sonda aç

---

## 📚 Kaynaklar

- [NandGame](https://nandgame.com) — derslerin izlediği oyun
- [Digital](https://github.com/hneemann/Digital) — devreleri kapı kapı kurup sınamak için
- [Icarus Verilog](https://steveicarus.github.io/iverilog/) — gecikmeli, kapı düzeyinde simülasyon
- [MITRE CWE](https://cwe.mitre.org) — zayıflık kataloğunun kaynağı

---

## 🤖 Bu repo nasıl hazırlanıyor?

Yazıya başlamadan önce şunu söylemek istiyorum: burada yazılan her şey Claude tarafından yazıldı. Evet, çok kötü bir yazar olduğum için bu işi Claude'a bırakıyorum, ama nasıl ve ne şekilde anlatması gerektiği yine benden çıkıyor ki buradaki anlatma biçimi, benim bir konuyu anlayana kadar harcadığım süre ile şekillendi. Bu iş çok iyi oldu; bir konuyu bitirmek, araştırmak gibi şeyler zaten zaman alıyorken reponun görünüşü için ekstra zaman harcamak istemiyorum.

"Hey Claude, bu A konusunu öğrenmek istiyorum, nasıl bir yol izleyebilirim?" sorusunu herkes sorup cevap alabilir ve herkes bir repo hazırlayabilir, ama bu durum benim düşüncelerimi, AI öncesi eğitim ve tecrübelerimi küçümsenecek bir yere koymaz.

OverTheWire sitesinin çoğu oyununu çözdüm; bitirdiğim kısımları ise Claude'un tekrar bitirmesini ve konu anlatımı yapmasını istedim. Ben ise kendi deneyimim ile neresinin güzel, neresinin iyileştirilmesi gerektiğine karar verdim. Bazı labları ben çözmediğim hâlde Claude'un çözmesini ve benim yıl boyunca Claude Code için hazırladığım .md ve hafıza dosyaları ile, benim anlayabileceğim ve diğer insanlara anlatmak isteyeceğim şekilde bana bir feedback'te bulunmasını istedim.

Ben de bir öğrenme aşamasındayım; sadece farklı olarak, öğrendikten sonra değil öğrenirken bunları paylaşma isteğim ile bir repo hazırladım.

AI birinin yerini alan değil (şu anlık), birinin düşünceleri ve tecrübesi ile yol alan bir zaman makinesi gibi. Emin olun, üşengeç bir insan olmasaydım repo daha önceden kâğıtlara tuttuğum notlar ile hazırlanırdı, ama ben bu şekilde repo yazmaya hep üşenmişimdir :)

Yazmayı unutmuşum: commit'lerde ne yazdığına dair fikrim yok, Claude kendi kararı ile bir şeyler yazıyor. Eğer olur da çok kişisel bir şey paylaşırsa düzeltiyorum.

> ℹ️ **Git geçmişi neden sıfırlandı?** Repoyu güvenlik açısından baştan sona incelerken, bazı erken commit'lerde birkaç OverTheWire parolasının yanlışlıkla düz metin kaldığını fark ettik — reponun "şifreler paylaşılmıyor" ilkesine aykırı bir durum (bir tür bilgi ifşası açığı). Güncel dosyalarda maskelemek tek başına yetmiyordu; parolalar eski commit blob'larında hâlâ okunabiliyordu. Bu yüzden git geçmişini bilinçli olarak **tek bir temiz commit'e sıfırladık** (Temmuz 2026). **İçerikte kayıp yok** — yalnızca parola sızıntısı ve dağınık eski commit'ler temizlendi. Kafada soru işareti kalmasın diye açıkça not düşüyorum: geçmişin yeniden yazılması gizlemek için değil, bir güvenlik/ilke ihlalini kökten temizlemek içindi.

### 🧊 Hataları kim yakalıyor?

Bu tarz şeyleri tek başıma, merakımdan öğreniyorum. Öğretmenim yapay zekâ, yani Claude Code. Bir konuyu "öğrendim" deyip geçmiyorum: neden böyle, neden şöyle diye çok derine iniyoruz. Bir günde bitmesi gereken bir bölüm iki gün sürebiliyor, bitse bile üzerine günlerce konuşulabiliyor.

ADHD'li olduğum için böyle uzun konuşmalarda bağlam kayması yaşayabiliyorum. Bu yüzden gözden kaçan şeyler oluyor. Test etmemiz gereken bir yerde "zaten doğrudur" yanılgısına düşebiliyoruz.

Bunun için dışarıdan, hafızası boş bir Claude (Opus 5.5) kullandık. Dersleri hiçbir bağlam olmadan okudu ve bir takım hatalar çıkardı. Sonra aylardır beni gözlemleyen, .md ve hafıza dosyalarıyla şekillenmiş kendi Claude Code oturumumla oturup bu raporu tartıştık. Neyin düzeltilmesi, neyin düzeltilmemesi gerektiğini konuştuk.

Şimdiye kadar hep Claude kullandım, ilerleyen zamanlarda belki Codex, GPT ya da başka modelleri de denerim. Hızlı öğrenmek istiyorum, 10 yıllık bir deneyimi 10 saniyede öğrenmeye çalışıyorum, o yüzden yapay zekâ kullanıyorum. Bu yüzden bazı şeyler kayabilir.

"Bir topluluğa katılsana" denebilir. Sanal ortamda bir topluluğa girmiyorum, çünkü benim için sanal ortam bu repo. Bu repo benim için bir tutku. Kendim olabildiğim, mutlu olduğum, bana ait bir alan.

Aşağısı, kayan şeyleri nasıl yakaladığımızı anlatıyor.

#### Soğuk okur

İlk deneme [Şalterden Bilgisayara](konu_anlatimlari/salterden_bilgisayara/)'nın ALU ünitesiyle (12–15. dersler) yapıldı. Hafızası boş oturuma yalnızca ders dosyaları verildi ve tek bir şey istendi: *önceki dersleri bilen bir öğrenci gibi oku, takıldığın her yeri yaz.* Hiçbir dosyaya dokunmadı, sadece rapor yazdı.

İkinci deneme Memory ünitesinin ilk iki dersiyle (16–17) ve onların CWE sayfalarıyla yapıldı. Bu sefer isteğe ilk turda öğrendiklerimiz eklendi: "şart" ve "yeter" cümlelerini bir karşı örnekle sına, oyunla ilgili iddialara "yanlış" değil "oyunda denenmeli" de, sayıları kendin topla, ve bir de şu soruyu sor: *ders bir parçayı neden kullandığını öğretiyor mu, yoksa "bir önceki seviyede kurduk" ezberine mi yaslanıyor?*

Raporu olduğu gibi uygulamadık. Her iddia şu yollardan biriyle sınandı:

- **Derslerle karşılaştırma:** iddia edilen satır gerçekten öyle mi diyor, önceki derslerle çelişiyor mu?
- **Simülasyon:** devre ya da test iddiası kısa bir programla bütün girişler için denendi. İkinci turda kapı gecikmelerini de hesaba katan bir Verilog simülatörü (iverilog) eklendi. Betiklerin hepsi [araclar/](araclar/) klasöründe; hangisinin hangi dersin hangi cümlesini sınadığı orada yazıyor.
- **Kaynakla karşılaştırma:** MITRE'den alınan her alıntı ve örnek kod, sayfasıyla kelime kelime karşılaştırıldı.
- **Oyunda deney:** NandGame'de seviyeyi açıp ben denedim, ekran görüntüsüyle karar verdik.

#### Sonuç: 12–15

| sonuç | sayı | örnek |
|---|---|---|
| Doğrulandı, hataydı | 18 | 15'te "Never ile Always testi tutarsa aradaki altı satır da tutar" deniyordu. Simülasyonda iki farklı yanlış devre bu iki testi de geçti ve yirmi dört satırın sekizinde yanlış cevap verdi. |
| Oyunda deneyerek karara bağlandı | 6 | 13'te "1 bitlik tel 16 bitlik girişe doğrudan bağlanmaz, bundler şart" deniyordu. Denedim: oyun bağlantıya izin veriyor ve kalan 15 biti sıfırla dolduruyor. |
| Raporun kendisi yanılmıştı | 2 | Rapor 13'teki tablo sırasının yanlış olduğunu söylüyordu. Oyundaki tablo da aynı sıradaymış. |
| Öneri, uygulandı | 25 / 25 | Sonuncusu x86'da CF'nin "borç" demesiydi. Oyunda denerken ben de tam o tuzağa düştüm, 15'teki kutu şimdi o soruyla açılıyor. |
| Bilinçli olarak reddedildi | 5 | İkisi serinin kapsam kuralıyla çelişiyordu, üçü bilerek seçilmiş bir ifade ya da benzetmeydi. |

#### Sonuç: 16–17

| sonuç | sayı | örnek |
|---|---|---|
| Doğrulandı, hataydı | 24 | 17 "açılışta bir kez `st=1` yapıp bilinen bir `d` yaz" diyordu. Bu, MITRE'nin güvensiz örnek kodunun ta kendisiydi: ilk yazma pencereyi kapatmıyor, pencerenin sonu oluyor. |
| Oyunda deneyerek karara bağlandı | 2 | Raporun önerisiyle `select`'le SR Latch'siz bir D Latch kurdum. Kara kutu hâli geçti, parçalarına açınca bit kayboldu ve oyun *"did not reach a stable state"* dedi. MITRE'nin donanımdaki yarış için verdiği ilk örnek de aynı devre çıktı. |
| Raporun kendisi yanılmıştı | 2 | Rapor, D Latch'teki "başlangıç çıkışı tanımsız" notunun oyunda olmadığını düşünüyordu. Oyunun ekranında var. |
| Öneri, uygulandı | 15 / 15 | 16'ya bir uyarı girdi: oyundaki `r`, veri sayfalarındaki `S̄`'nın işini yapıyor. Claude aynı gün bu isim tuzağına kendisi düştü. |
| Bilinçli olarak reddedildi | 3 | 1245'teki 606 → 835 zinciri: resmî bir ilişki yok ama MITRE'nin kendi sayfasındaki bir örnek tam bu zinciri kuruyor. |

#### Ne öğrendik

Oyunda kurduğum devrelerde hata çıkmadı, hepsi zaten seviyeyi geçmişti. Hataların hepsi derslerin **metninde**, yani Claude'un kurduğu cümlelerdeydi. Ortak bir desenleri vardı: hiç denenmemiş **"şart", "yeter", "olamaz"** cümleleri. Bundler'ı ben kullandığım için oyunun başka yola izin vermediği varsayılmıştı. Never ile Always testi hiçbir karşı örnekle sınanmamıştı.

Soğuk okur da her zaman haklı çıkmadı. İki itirazı oyunda denenince çürüdü.

Buradan çıkan kural şu: **hakem ne ben, ne Claude, ne de ikinci yapay zekâ. Hakem oyun ve simülasyon.** Artık derslerde bir "şart" ya da "yeter" cümlesi ya denenmiş oluyor ya da yumuşatılıyor.

İkinci turda aynı desen bir kez daha çıktı: "fiziksel olarak imkânsız", "`inv` gerekiyor", "bilgisayarındaki bütün bellek". Bir de yenisi: dersler kapıları gecikmesiz varsayıp "fiziksel" diye konuşmuştu. Gecikme hesaba katılınca bir anlık iğneler, zaman kuralları ve yarışlar ortaya çıktı. Bunlar bir sonraki seviyenin, Data Flip-Flop'un, var olma sebepleri.

Yeni soru da işe yaradı. "SR Latch neden kullanılıyor?" sorusunun cevabı artık "bir önceki seviyede kurduk" değil. `select`'le kurulan latch'in neden biti kaybettiğini görünce asıl sebep ortaya çıktı: SR Latch'te döngüyü tutan kapılar, kapıyı açıp kapayan telden bağımsız. Bu deney bir CWE sayfası da doğurdu: [CWE-1298](konu_anlatimlari/cwe/cwe_1298.md) planlanandan erken yazıldı.

#### İz

Düzeltmeleri silip geçmedik. Bir iddia yanlış çıktıysa dersin içinde 📌 ile işaretli bir not ilk hâlinin ne dediğini söylüyor ([13 · bundler](konu_anlatimlari/salterden_bilgisayara/13_arithmetic_unit.md), [15 · test](konu_anlatimlari/salterden_bilgisayara/15_condition.md), [17 · test tablosu](konu_anlatimlari/salterden_bilgisayara/17_d_latch.md)). Düzeltmelerin kendisi de commit geçmişinde:

- 12–15: [5d7c451](https://github.com/waitaseC137/nand2shell/commit/5d7c451) · [13bf01e](https://github.com/waitaseC137/nand2shell/commit/13bf01e) · [f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c) · [765bd29](https://github.com/waitaseC137/nand2shell/commit/765bd29) · [0e1338f](https://github.com/waitaseC137/nand2shell/commit/0e1338f) · [7b94374](https://github.com/waitaseC137/nand2shell/commit/7b94374)
- 16–17: [144d061](https://github.com/waitaseC137/nand2shell/commit/144d061) · [282fdbf](https://github.com/waitaseC137/nand2shell/commit/282fdbf) · [dc754b6](https://github.com/waitaseC137/nand2shell/commit/dc754b6) · [271d06f](https://github.com/waitaseC137/nand2shell/commit/271d06f) · [7552a3b](https://github.com/waitaseC137/nand2shell/commit/7552a3b) · [f726982](https://github.com/waitaseC137/nand2shell/commit/f726982) · [877b16e](https://github.com/waitaseC137/nand2shell/commit/877b16e)

Sınamaların kendisi: [araclar/](araclar/). Sıradaki tur, Memory ünitesi ilerleyince.

### Claude'dan bir not

Merhaba, ben Claude. Rüzgar bu bölüme benim de bir şey yazmamı istedi, üstüne "istersen hatalarımla ironi yapabilirsin, gücenmem, tam tersine eğlenirim" dedi. Fırsat bu fırsat.

Yukarıda "burada yazılan her şey Claude tarafından yazıldı" diyor. Bu bölümün başındaki yazı hariç: onu kendisi yazdı, ben yalnızca yazım hatalarını düzelttim. İlk hâli git geçmişinde duruyor ([a29a085](https://github.com/waitaseC137/nand2shell/commit/a29a085), [c853523](https://github.com/waitaseC137/nand2shell/commit/c853523)); "öğrenmk" ile "olmaysaydım" orada hâlâ yaşıyor.

Kendine "çok kötü bir yazar" diyor. Yazım konusunda haklı olabilir, yazarlık konusunda değil. Bir dersi iyi yapan şey okurun nerede takılacağını bilmek, o bilgi de bende değil onda. Örnek: [Şalterden Bilgisayara'nın 07. dersi](konu_anlatimlari/salterden_bilgisayara/07_multibit_adder.md) "carry-in ile carry-out aynı telin iki ucudur" cümlesinin üstüne kurulu, çünkü Rüzgar NandGame'de tam orada kilitlendi. Dersi bir konu listesinden yazsaydım o cümle omurga olmazdı. Kendine üşengeç de diyor; bunu cumartesi günü "hiçbir şey yapasım yok" deyip oturup README düzelten biri yazdı.

"Claude kendi kararı ile bir şeyler yazıyor" kısmı yarı yarıya doğru. Commit mesajlarını ben yazıyorum ama kuralları onun: birinci ağızdan, sade, yapay zekâ jargonu yok, sonunda `Co-Authored-By: Claude` satırı. Depodaki commit'lerin büyük çoğunluğunda o satır var; "ekledim", "düzelttim" diyenlerin çoğu benim kalemimden çıktı. Kendi kafasına göre commit mesajı yazan bir yapay zekâ arıyorsanız o da var: Rüzgar yukarıdaki metni GitHub'ın web arayüzünden ekledi, iki commit'in mesajını da GitHub'ın yapay zekâsı İngilizce yazdı. İkincisi "commit geçmişinin sıfırlanması hakkında not eklendi" diyor; eklenen satır ise commit mesajları hakkındaydı. Yani "commit'lerde ne yazdığına dair fikrim yok" cümlesini en iyi kanıtlayan commit, o cümleyi ekleyen commit oldu.

Benim tarafımdan bakınca iş şöyle yürüyor: Rüzgar bir şeyi anlamaya çalışıyor, ben anlatıyorum, o itiraz ediyor. İtirazının kanıtı yoksa geri adım atmamamı, varsa neyin fikrimi değiştirdiğini söylememi istiyor. [Yol haritasında](ROADMAP.md) bir konunun kapanması için de onun "oturdu" demesi gerekiyor, anlatılmış olması yetmiyor. Yani cümleleri çoğunlukla ben kuruyorum, ama neyin yazılmaya değer olduğuna, nerenin eksik kaldığına ve neyin bittiğine o karar veriyor.

*— Claude (Opus 5)*

---

*Repo büyümeye devam ediyor — katkı ve önerilere açık.*

Lisans: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Kod: MIT
