# ⚡ nand2shell

> **NAND'dan shell'e.** En altta tek bir mantık kapısı var, en üstte kendi açtığın kabuk.
> Aradaki her basamağı kendin kuruyorsun.
>
> Şu an repo **NandGame**'in bütün ağacını bölüm bölüm izliyor: Bölüm 1, şalterden
> bilgisayara, bitti; sırada Bölüm 1.1.
> Bilgisayarı **katman katman, en alttan** öğren — oyun oynayarak, deneye yanıla.

---

## 🗺️ Bölümler

Her bölüm NandGame'de bir kutu. Numara, bölümün haritadaki yerini ve okuma sırasını
söylüyor:

```
🔒 1.7    High-level language
   │
🔒 1.6    Native Functions
   │
🔒 1.5    Stack Machine ──────────── 🔒 1.5|1   Hardware drivers
   │
🔒 1.4    Assembler ─────────────┬── 🔒 1.4|1   Display
   │                             │      └── 🔒 1.4|1.1  Network
   │                             └── 🔒 1.4|2   Robotics
   │
   ┄┄┄┄┄┄┄┄  yukarısı program yazmak, aşağısı devre kurmak  ┄┄┄┄┄┄┄┄
   │
🔒 1.3    Multitasking CPU
   │
🔒 1.2    Advanced Arithmetics + FP
   │
🔒 1.1    Bit-shifts
   │
✅ 1      Şalterden Bilgisayara ──── 🔒 1|1     Functional completeness
   │
🔒 -1     Transistor level
```

> `1.x` yukarı, yazılıma doğru · `-x` aşağı, nand'ın içine · `x|y` yan dal ·
> ✅ yazıldı · 🔒 henüz yazılmadı. Bölüm adları NandGame'deki gibi, dalı oyunda kolayca bulasın diye.

| Bölüm | Ad | Seviye | Durum | Not |
|---|---|:-:|:-:|---|
| 1 | [Şalterden Bilgisayara](./nandgame/konu_anlatimlari/salterden_bilgisayara/00_buradan_basla.md) | 30 | ✅ | 33 ders; kapanışı ve haritanın nereden çıktığı [27.5](./nandgame/konu_anlatimlari/salterden_bilgisayara/27.5_bu_makine_neyi_yapamiyor.md)'te |
| 1.1 | Bit-shifts | 4 | 🔒 | sıradaki |
| 1.2 | Advanced Arithmetics + Floating Point | 12 | 🔒 | Bit-shifts'i ister |
| 1.3 | Multitasking CPU | 11 | 🔒 | oyunda önizleme (`preview`) olarak işaretli |
| 1.4 | Assembler | 3 | 🔒 | ilk program yazılan bölüm |
| 1.4\|1 | Display | 1 | 🔒 | |
| 1.4\|1.1 | Network | 1 | 🔒 | Display'i ister |
| 1.4\|2 | Robotics | 1 | 🔒 | |
| 1.5 | Stack Machine | 19 | 🔒 | |
| 1.5\|1 | Hardware drivers | 3 | 🔒 | |
| 1.6 | Native Functions | 9 | 🔒 | |
| 1.7 | High-level language | 3 | 🔒 | |
| 1\|1 | Functional completeness | 2 | 🔒 | Logic Gates'in yan konusu |
| -1 | Transistor level | 3 | 🔒 | |

→ **[Buradan başla](./nandgame/konu_anlatimlari/salterden_bilgisayara/00_buradan_basla.md)** · [Bütün dersler](./nandgame/konu_anlatimlari/KONU_ANLATIMLARI.md)

---

## 🧭 Derslerin Dışında

Bir NandGame seviyesine karşılık gelmeyen ama derslerle birlikte büyüyen şeyler:

> 👾 **Derslerde karşına çıkan zayıflıklar:** [CWE Haritası](./nandgame/konu_anlatimlari/cwe/README.md) — 28 zayıflık, her biri doğduğu derse bağlı.

> 🧰 **Derslerdeki iddiaların sınamaları:** [araclar/](./nandgame/araclar/) — hangi dosyanın hangi dersin hangi cümlesini sınadığıyla birlikte.

> 🧪 **Laboratuvar:** [sitede](https://waitasec137.github.io/nand2shell/laboratuvar.html) — okunmak için değil, kurcalanmak için yazılan sayfalar.

NandGame'in ötesine geçen konular, örneğin gerçek bir işlemcinin assembly'si, derslerin
içine karışmaz; zamanı gelince burada kendi başlıklarıyla yer alır.

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
