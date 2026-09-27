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

*Repo büyümeye devam ediyor — katkı ve önerilere açık.*

Lisans: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Kod: MIT
