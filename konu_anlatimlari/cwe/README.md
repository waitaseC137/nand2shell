# 👾 CWE Haritası

> Bir dersteki **👾 Meraklısına** bağlantısından geldiysen doğru yerdesin.
> Bu sayfa önce CWE ile CVE'nin ne olduğunu kısaca anlatıyor, sonra derslerde
> karşına çıkan zayıflıkları tek yerde listeliyor.
>
> Burası bir **dizin**. Her zayıflığın kendi sayfası var: ne olduğu, hangi devrede
> doğduğu, gerçek hayatta ne yaptığı ve nasıl önlendiği orada anlatılıyor.
> Dersler ise sadece devreyi ve matematiği anlatır.

---

## 📋 İçindekiler

- [CWE Nedir?](#cwe-nedir)
- [CVE Nedir?](#cve-nedir)
- [CWE ile CVE Farkı](#cwe-ile-cve-farkı)
- [CWE'ler Arasındaki Hiyerarşi](#cweler-arasındaki-hiyerarşi)
- [Zincirler: Hatalar Arasındaki Tel](#zincirler-hatalar-arasındaki-tel)
- [NandGame Ağacı](#nandgame-ağacı)
- [Yolda](#yolda)
- [Askıda — OverTheWire](#askıda--overthewire)

---

## CWE Nedir?

**CWE** (*Common Weakness Enumeration*), yazılımda ve donanımda tekrar tekrar ortaya
çıkan **hata türlerinin** kataloğudur. MITRE tarafından tutulur ve her türün bir
numarası vardır.

Örnek: **CWE-190 — Integer Overflow or Wraparound.** 08. derste 16 bitlik
toplayıcının 17. bitinin gidecek yeri olmadığını gördün. O hatanın türünün adı bu.

> 🔑 CWE bir **zayıflıktır**, kendi başına açık değildir. Bir sayaç sarabilir ve
> hiçbir şey olmaz. Taşan sayı bir bellek boyutuna, bir sınır kontrolüne ya da bir
> dizi indeksine gittiğinde tehlikeli hâle gelir.

---

## CVE Nedir?

**CVE** (*Common Vulnerabilities and Exposures*), **belirli bir üründe** bulunmuş
**tek bir açığa** verilen kimlik numarasıdır. Biçimi `CVE-yıl-sıra` şeklindedir.

Örnek: **CVE-2018-10299.** BEC Token akıllı sözleşmesinde gönderilecek toplam
`alıcı sayısı × miktar` diye hesaplanıyordu. Saldırgan bu çarpımı 256 bitte sardırdı
(`2 × 2²⁵⁵ = 2²⁵⁶` → `0`); bakiye kontrolü sıfır gördü ve geçti. Bu açığın türü:
**CWE-190.**

---

## CWE ile CVE Farkı

| | CWE | CVE |
|---|---|---|
| **Neyi adlandırır?** | Hatanın **türünü** | Tek bir **vakayı** |
| **Örnek** | CWE-190: tam sayı taşması | CVE-2018-10299: BEC Token'daki taşma |
| **Cevapladığı soru** | "Bu ne tür bir hata?" | "Hangi üründe, hangi sürümde?" |
| **Ne işe yarar?** | Kodu denetlerken **neyi arayacağını** bilmek | **Neyi güncelleyeceğini** bilmek |

> 🔑 Bir CWE'nin altında çok sayıda CVE toplanabilir. CVE'ler olmuş olanı kaydeder;
> CWE'yi tanımak ise bir sonraki hatayı daha CVE olmadan bulmanı sağlar.

---

## CWE'ler Arasındaki Hiyerarşi

Sayfalarda sık sık **Üst sınıf** diye bir satır göreceksin. Çünkü CWE listesi düz
bir liste değil, **dört kademeli bir ağaç:**

```
Sütun (Pillar)       en soyut  ·  bir temayı adlandırır       ·  ör. CWE-682
   └─ Sınıf (Class)            ·  teknolojiden bağımsız tür   ·  ör. CWE-119
        └─ Temel (Base)        ·  tespit/önleme yöntemi verilebilecek kadar somut  ·  ör. CWE-190
             └─ Türev (Variant)  ·  belirli bir dile/teknolojiye özgü
```

Bu sayfadaki sayfaların çoğu **Temel** seviyededir — o kademede "şuna dikkat et,
şöyle önle" denebilir.

> 🔑 **Gerçek bir açığa numara verirken mümkün olan en SOMUT kademe seçilir.**
> Sütunlar ve sınıflar etiketlemek için değil, **yönelmek** içindir: yeni bir hata
> gördüğünde hangi aileye düştüğünü, ve aynı savunmanın başka neleri birden
> kapattığını onlar söyler.

Ayrıca **Bileşik** (*Compound*) diye bir kategori var: tek bir zayıflık değil,
birbirine bağlı birkaç zayıflığın oluşturduğu kalıp. [CWE-680](./cwe_680.md) böyle
bir **zincirdir** — aşağıda anlatılıyor.

---

## Zincirler: Hatalar Arasındaki Tel

Bazı CWE numaraları tek bir hatayı değil, bir hatanın diğerini nasıl doğurduğunu
adlandırır. MITRE bunlara **zincir** (*chain*) der.

```
   CWE-190                                      CWE-787
  sayı taşar   ─────────  CWE-680  ─────────►  sınır dışına yazma
                       (bu telin adı)
```

`CWE-680` üçüncü bir olay değil, iki olayın arasındaki telin adıdır: taşan sayının
bellek boyutu olarak kullanıldığı an. İki kutu modeliyle ayrıntısı →
[CWE-680](./cwe_680.md#burada-i̇ki-kutu-var)

---

## NandGame Ağacı

Bu harita **NandGame'in başından ALU ünitesinin sonuna kadar** olan konuları
kapsıyor. Kural basit: **işlenmemiş konunun CWE'si burada olmaz.** Katalog
müfredatın aynasıdır, önüne geçmez.

### Ünitenin İki Yarısı

ALU ünitesi iki iş yapar, ve MITRE'nin en üst kademesinde ikisinin de karşılığı var:

```
NandGame ALU ünitesi
   │
   ├─ HESAP YAPAR       →  CWE-682  Incorrect Calculation   (sütun)
   │                          └─ 190 · 191 · 193
   │
   └─ KARŞILAŞTIRIR     →  CWE-697  Incorrect Comparison    (sütun)
                              └─ 1023 · 1254
```

| CWE | Resmî adı | Nerede doğdu | link |
|---|---|---|---|
| [**CWE-682**](./cwe_682.md) | Incorrect Calculation — **sütun** | [08 · Increment](../salterden_bilgisayara/08_increment.md) · [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/682.html) |
| [**CWE-697**](./cwe_697.md) | Incorrect Comparison — **sütun** | [15 · Condition](../salterden_bilgisayara/15_condition.md) | [📄](https://cwe.mitre.org/data/definitions/697.html) |

Kataloğun geri kalanı bu iki sütunun etrafına diziliyor. Aşağıdaki üç kademenin
ölçütü tek soru: **NandGame'i anlamak için ne kadar gerekli?**

---

### 🔴 Kademe 1 — Bilinmesi Gereken

> Kurduğun devrenin kendisi bu zayıflık. Bilmezsen, ne yaptığını bilmeden kurmuşsun.

| CWE | Resmî adı | Nerede doğdu | link |
|---|---|---|---|
| [**CWE-190**](./cwe_190.md) | Integer Overflow or Wraparound | [08 · Increment](../salterden_bilgisayara/08_increment.md) · [08.5](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) | [📄](https://cwe.mitre.org/data/definitions/190.html) |
| [**CWE-191**](./cwe_191.md) | Integer Underflow (Wrap or Wraparound) | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md) · [08.5](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) | [📄](https://cwe.mitre.org/data/definitions/191.html) |
| [**CWE-193**](./cwe_193.md) | Off-by-one Error | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/193.html) |
| [**CWE-681**](./cwe_681.md) | Incorrect Conversion between Numeric Types | [04 · Teller Sayı Olunca](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/681.html) |
| [**CWE-787**](./cwe_787.md) | Out-of-bounds Write | [08 · Increment](../salterden_bilgisayara/08_increment.md#-güvenlik-köprüsü) | [📄](https://cwe.mitre.org/data/definitions/787.html) |

**787 neden burada?** Taşmanın kendisi bir şey bozmaz. Sonuç bu olmasaydı 190 bir
merak konusu olarak kalırdı — Top-25'in birinci sırasında olmasının sebebi bu.

---

### 🟡 Kademe 2 — Anlamayı Pekiştiren

> Devreyi kurmak için şart değil. "Bu niye önemli" sorusunun cevabı burada.

| CWE | Resmî adı | Nerede doğdu | link |
|---|---|---|---|
| [**CWE-680**](./cwe_680.md) | Integer Overflow to Buffer Overflow | [08 · Increment](../salterden_bilgisayara/08_increment.md#-güvenlik-köprüsü) | [📄](https://cwe.mitre.org/data/definitions/680.html) |
| [**CWE-196**](./cwe_196.md) | Unsigned to Signed Conversion Error | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-güvenlik-köprüsü) | [📄](https://cwe.mitre.org/data/definitions/196.html) |
| [**CWE-839**](./cwe_839.md) | Numeric Range Comparison Without Minimum Check | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-güvenlik-köprüsü) | [📄](https://cwe.mitre.org/data/definitions/839.html) |
| [**CWE-195**](./cwe_195.md) | Signed to Unsigned Conversion Error | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-güvenlik-köprüsü) | [📄](https://cwe.mitre.org/data/definitions/195.html) |
| [**CWE-1023**](./cwe_1023.md) | Incomplete Comparison with Missing Factors | [10 · Bayraklar](../salterden_bilgisayara/10_bayraklar.md) | [📄](https://cwe.mitre.org/data/definitions/1023.html) |
| [**CWE-194**](./cwe_194.md) | Unexpected Sign Extension | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#16-bitlik-1-tek-tel-değildir) | [📄](https://cwe.mitre.org/data/definitions/194.html) |
| [**CWE-197**](./cwe_197.md) | Numeric Truncation Error | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#16-bitlik-1-tek-tel-değildir) | [📄](https://cwe.mitre.org/data/definitions/197.html) |
| [**CWE-480**](./cwe_480.md) | Use of Incorrect Operator | [12 · Logic Unit](../salterden_bilgisayara/12_logic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/480.html) |

**Üçü bir zincir.** 09'un Güvenlik Köprüsü'ndeki örnekte aynı sayı üç kez farklı
sözleşmeyle okunuyor: değişkene girerken [196](./cwe_196.md), kontrolde
[839](./cwe_839.md), kullanımda [195](./cwe_195.md).

**İki eksen.** [196](./cwe_196.md) ile [195](./cwe_195.md) aynı bitlerin **yorumu**
değişince ne olduğunu anlatıyor — genişlik sabit kalıyor. [194](./cwe_194.md) ile
[197](./cwe_197.md) ise **genişliğin kendisi** değişince.

| | genişlik | yorum |
|---|---|---|
| [196](./cwe_196.md) · [195](./cwe_195.md) | sabit | değişir |
| [194](./cwe_194.md) · [197](./cwe_197.md) | değişir | sabit kalmaya çalışır |

Genişlik ekseni kataloğa sonradan girdi, ve sebebi öğretici: bu konu müfredata
ancak [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#16-bitlik-1-tek-tel-değildir)'te
bundler'la geldi. Katalog yanlış değildi — o günkü kapsamın dürüst aynasıydı.

---

### 🟢 Kademe 3 — İleride İşe Yarayan

> NandGame'i anlamak için gerekmiyor. Assembly ve tersine mühendislikte karşına çıkacak.

| CWE | Resmî adı | Nerede doğdu | link |
|---|---|---|---|
| [**CWE-1300**](./cwe_1300.md) | Improper Protection of Physical Side Channels | [01 · Akım, Şalter, Röle](../salterden_bilgisayara/01_akim_salter_role.md) | [📄](https://cwe.mitre.org/data/definitions/1300.html) |
| [**CWE-1247**](./cwe_1247.md) | Improper Protection Against Voltage and Clock Glitches | [02 · NAND'dan Kapılar](../salterden_bilgisayara/02_nanddan_kapilar.md) | [📄](https://cwe.mitre.org/data/definitions/1247.html) |
| [**CWE-1261**](./cwe_1261.md) | Improper Handling of Single Event Upsets | [04 · Teller Sayı Olunca](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/1261.html) |
| [**CWE-1384**](./cwe_1384.md) | Improper Handling of Physical or Environmental Conditions — **çatı** | 01 · 02 · 04 | [📄](https://cwe.mitre.org/data/definitions/1384.html) |
| [**CWE-704**](./cwe_704.md) | Incorrect Type Conversion or Cast — **çatı** | [04 · Teller Sayı Olunca](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/704.html) |
| [**CWE-670**](./cwe_670.md) | Always-Incorrect Control Flow Implementation — **çatı** | [12 · Logic Unit](../salterden_bilgisayara/12_logic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/670.html) |
| [**CWE-1242**](./cwe_1242.md) | Inclusion of Undocumented Features or Chicken Bits | [14 · ALU](../salterden_bilgisayara/14_alu.md) | [📄](https://cwe.mitre.org/data/definitions/1242.html) |
| [**CWE-1254**](./cwe_1254.md) | Incorrect Comparison Logic Granularity | [15 · Condition](../salterden_bilgisayara/15_condition.md) | [📄](https://cwe.mitre.org/data/definitions/1254.html) |
| [**CWE-119**](./cwe_119.md) | Improper Restriction of Operations within the Bounds of a Memory Buffer — **çatı** | [08 · Increment](../salterden_bilgisayara/08_increment.md) | [📄](https://cwe.mitre.org/data/definitions/119.html) |

**1254 bir ilk:** kataloğundaki tek **çift üstlü** CWE. MITRE onu hem
[697](./cwe_697.md)'nin (karşılaştırma yanlış biçimde kuruldu) hem de **208**'in
(süre farkı dışarıdan gözlenebiliyor) altına koymuş. Tam kavşakta durduğu için,
208 yazıldığında bu sayfa iki taraftan da erişilebilir olacak.

**1242 neden bu kademede ama önemli?** ALU seviyesinin kontrol sözcüğü 5 bit,
yani **32 durum** — ama belge 8 işlem tanımlıyor. Aradaki fark NandGame'de
zararsızdır. Gerçek bir çipte, belgelenmemiş bir kontrol biti bir güvenlik
özelliğini kapatıyorsa adı **chicken bit**'tir. Kural: *belgelenmiş durum
uzayından geniş her kontrol sözcüğü, bakılacak bir yerdir.* Tersine mühendisliğin
yaptığı iş tam olarak budur.

---

## Yolda

🔜 Dersler yazıldıkça gelecek. Sıra müfredata bağlı.

| Nerede | CWE | Resmî adı |
|---|---|---|
| Bellek ünitesi · adresleme | **125** | Out-of-bounds Read |
| Bellek ünitesi | **416** | Use After Free |
| Saat (clock) | **1298** | Hardware Logic Contains Race Conditions |
| Boru hattı / spekülasyon | **208** | Observable Timing Discrepancy |
| SMT / paylaşılan birimler | **1303** | Non-Transparent Sharing of Microarchitectural Resources |
| Yukarıdaki ikisinden sonra | **203** | Observable Discrepancy (çatı) |
| Microcode / ayrıcalıklı kontroller | **1256** | Improper Restriction of Software Interfaces to Hardware Features |

> 📌 **Buradaki "nerede" sütunu bir tahmindir, söz değildir.** Ders yazıldıkça
> keskinleşir. `125` için bilinen tek kesin şart şu: sınır dışına okumak için
> önce bir **adres** gerekir — *"kaçıncı gözü okuyayım?"* sorusu ortaya çıkmadan
> o zayıflık doğamaz. Hangi seviyede doğacağını o seviyeye gelince yazarız.
>
> 🔑 **203'ü şimdi yazmıyoruz, bilerek.** Dersi olmayan konunun CWE'si olmaz.
> 203, ancak 208 ile 1303 yazıldığında anlamlı hâle gelir — iki çocuğu birden
> olmadan çatı kurmak, haritayı müfredatın önüne geçirmek olur.
>
> 697 ve 1242 bu listede duruyordu; dersleri yazıldığı için ağaca taşındılar.

---

## Askıda — OverTheWire

Şu an OverTheWire çözülmüyor, o yüzden bu sayfalar **haritadan çıkarıldı.** Sayfalar
duruyor ve kendi derslerinden erişilebiliyor; o serilere dönüldüğünde buraya
geri alınacaklar.

[78](./cwe_78.md) · [59](./cwe_59.md) · [367](./cwe_367.md) ·
[77](./cwe_77.md) · [706](./cwe_706.md) · [362](./cwe_362.md)

---

## 🔗 İlgili Konular

- [08.5_sayac_basa_donunce.md](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) — Taşmanın matematiği: `ℤ/2ⁿℤ`, hata kümesi, doğru kontrolün türetilmesi
- [CWE-680](./cwe_680.md#burada-i̇ki-kutu-var) — 680'in neden bir olay değil tel olduğu: iki kutu modeli
- [KONU_ANLATIMLARI.md](../KONU_ANLATIMLARI.md) — Tüm konu indeksi

---

*Numaralar, resmî adlar ve soyutlama seviyeleri MITRE'nin CWE listesinden alınmıştır: [cwe.mitre.org](https://cwe.mitre.org).*
