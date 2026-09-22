# CWE Haritası — NandGame Ağacı (tasarım taslağı)

> **Durum: ONAY BEKLİYOR.** Bu bir tasarım belgesi, uygulanmadı.
> Tarih: 2026-09-22

## Amaç

CWE haritası dağınıklaşmaya başladı. Yeni kapsam kuralı:

1. **Birinci öncelik NandGame** — başından ALU ünitesinin sonuna kadar
2. **İşlenmemiş konunun CWE'si olmaz** — katalog müfredatın önüne geçmez
3. İşlenmiş ama NandGame dışı konular (Leviathan) ayrı grupta durur

---

## 1. Henüz dersi yazılmamış iki seviye

NandGame'in ALU ünitesi dört seviye: Logic Unit ✅ · Arithmetic Unit ✅ ·
**ALU** ⬜ · **Condition** ⬜. Son ikisinin dersi yok; CWE bağlantısı burada kuruluyor.

### 1a. ALU seviyesi → **CWE-1242**

**Seviyenin yapısı** (oyundan okundu):

```
girişler:  u · op1 · op0 · zx · sw · X · Y
  u        mantık birimi mi, aritmetik birim mi
  op1/op0  o birimin içinde hangi işlem
  zx       sol operandı 0 ile değiştir      ┐ birimlerden ÖNCE
  sw       X ile Y'yi takas et              ┘ operandları değiştirir
```

**Bağlantı:** Belge **8 satır** tanımlıyor (u·op1·op0), artı zx/sw için **4 satırlık**
ayrı bir tablo. Ama kontrol sözcüğü **5 bit = 32 durum.** Çapraz çarpımın tamamı
tarif edilmemiş.

→ **CWE-1242 — Inclusion of Undocumented Features or Chicken Bits** (Temel,
üstü CWE-912 Hidden Functionality).

MITRE'nin tanımı: *"bir cihazda, belirli güvenlik özelliklerini devre dışı
bırakabilen belgelenmemiş bitler kullanmak yaygın bir tasarım pratiğidir."*
Tipik örneği: hata ayıklama için bırakılmış, belgelenmemiş UART komutları.

**Dersin vereceği cümle:** NandGame'de belgelenmemiş durumlar zararsızdır —
bir değer üretirler, o kadar. Gerçek bir çipte, belgelenmemiş bir kontrol biti
kombinasyonu bir güvenlik özelliğini kapatıyorsa ona **chicken bit** denir.
Kural: **belgelenmiş durum uzayından geniş her kontrol sözcüğü, bakılacak bir
yerdir.** Tersine mühendisliğin tam olarak yaptığı iş budur.

**Not — değerlendirilip elenen aday:** CWE-1256 (Improper Restriction of Software
Interfaces to Hardware Features, Plundervolt'un CWE'si). Çok cazip ama **buraya
ait değil**: 1256 *ayrıcalıklı* donanım kontrollerine yazılımın erişmesiyle ilgili,
NandGame'in ALU'sunda henüz ayrıcalık kavramı yok. **Yeri: microcode / Durak 4.**

### 1b. Condition seviyesi → **CWE-697**

**Seviyenin yapısı:**

```
girişler:  lt · eq · gt · X        çıkış: 1 bit
kutu:      nand · inv · and · or · xor · is neg · is zero
           ⚠️ SEÇİCİ YOK
```

Üç bayrak bir sayı değil, **üç bağımsız izin**; sonuçlar OR ile birleşiyor.
`000 = hiçbir zaman`, `111 = her zaman`.

→ **CWE-697 — Incorrect Comparison** (**Sütun**, 682 ile aynı kademe).

Çocukları arasında kataloğunda zaten olan **1023** (eksik karşılaştırma) ve daha
önce konuşulan **1254** (karşılaştırma tanecikliği) var.

**Dersin vereceği cümle:** Karşılaştırma = çıkarma + bayrağa bakma. Hangi bayrağa
bakacağını sen seçersin. Ve taşma olduğunda işaret biti yalan söyler — işaretli
"küçüktür" testinin doğrusu **N XOR OF**. 10. derste verilen OF sözü burada kapanır.

---

## 2. İki sütun, ALU'nun iki yarısı

Ağacın omurgası bu:

```
NandGame ALU ünitesi
   │
   ├─ HESAP YAPAR        →  CWE-682  Incorrect Calculation  (sütun) ✅ yazılı
   │     └─ 190 · 191 · 193
   │
   └─ KARŞILAŞTIRIR      →  CWE-697  Incorrect Comparison   (sütun) ⬜ yazılacak
         └─ 1023 · (1254)
```

Kataloğun geri kalanı bu iki sütunun etrafına diziliyor.

---

## 3. Üç kademeli ağaç

Ölçüt: **NandGame'i anlamak için ne kadar gerekli?**

### 🔴 Kademe 1 — Bilinmesi gereken

*Kurduğun devrenin kendisi bu zayıflık. Bilmezsen, ne yaptığını bilmeden kurmuşsun.*

| CWE | Ders | Neden 1. kademe |
|---|---|---|
| **190** Integer Overflow | 08 · 08.5 | 17. bitin gidecek yeri yok — devreyi sen kurdun |
| **191** Integer Underflow | 09 | Aynı duvarın öbür yönü |
| **193** Off-by-one | 13 | `X+1` / `X−1` devresi; her dilde, her kod tabanında |
| **681** Incorrect Conversion | 04 · 09 | "Desen aynı, anlam okuyanın kararı" — serinin omurga cümlesi |
| **787** Out-of-bounds Write | 08 | Sonuç bu olmasa taşma önemsiz kalırdı; Top-25'in 1 numarası |

### 🟡 Kademe 2 — Bilinirse bölümler anlaşılır, önemi vurgulanır

*Devreyi anlamak için şart değil, ama "bu niye önemli" sorusunun cevabı burada.*

| CWE | Ders | Ne ekliyor |
|---|---|---|
| **680** Overflow→Buffer Overflow | 08 | 190 ile 787 arasındaki telin adı: zincir kavramı |
| **196** unsigned→signed | 09 | Güvenlik köprüsü üçlüsünün ilki |
| **839** Eksik aralık kontrolü | 09 | "Kontrol vardı ama yarısı eksikti" |
| **195** signed→unsigned | 09 | Üçlünün kapanışı: aynı sayı üç kez farklı okundu |
| **1023** Eksik karşılaştırma | 10 | Bayraklar: hangi bayrağa bakmadığın |
| **194** İşaret uzatması | 13 | Genişlik ekseni — bundler'ın güvenlik karşılığı |
| **197** Kırpma | 13 | 194'ün aynası |
| **480** Yanlış işleç | 12 | `&` ile `&&`: kurduğun bit bit devrenin yazılımdaki karşılığı |

### 🟢 Kademe 3 — Bilinmezse kayıp yok, ileride işe yarar

*NandGame'i anlamak için gerekmiyor. Assembly ve tersine mühendislikte karşına çıkacak.*

| CWE | Ders | İleride nerede |
|---|---|---|
| **1300** Fiziksel yan kanal | 01 · 01.5 | Donanım RE, gömülü sistem analizi |
| **1247** Voltaj/saat sıçraması | 02 | Fault injection, glitch saldırıları |
| **1261** Tek olay bozulması | 04 | Bit dönmesi izini sürmek |
| **1384** Fiziksel koşullar (çatı) | — | Yukarıdaki üçünü birleştirir |
| **1242** Belgelenmemiş özellikler | ALU ⬜ | **RE'nin tam kalbi** — belgelenmemiş durum avı |
| **704** Tip dönüşümü (çatı) | — | → 843 Type Confusion, binary exploitation |
| **670** Hatalı akış (çatı) | — | → 783 öncelik hatası, decompile kod okurken |

---

## 4. NandGame dışı — ayrı grup

İşlenmiş konular ama NandGame değil. Silinmiyor, **ayrı başlık altına alınıyor:**

```
Leviathan / binary analizi
   78 · 59 · 367          (dersleri var)
   77 · 706 · 362         (üç çatı)
```

---

## 5. Uygulama adımları (onaydan sonra)

1. `cwe/README.md` yeniden düzenlenir: üç kademe başlığı + NandGame dışı ayrı bölüm
2. Her CWE sayfasının bilgi tablosuna **kademe** satırı eklenir
3. `cwe_697.md` yazılır (Condition dersiyle birlikte)
4. `cwe_1242.md` yazılır (ALU dersiyle birlikte)
5. "Yolda" tablosu sadeleştirilir: 203 · 208 · 1303 · 1254 · 1256 · 416 · 1298

## 6. Onayınla netleşecek iki soru

- **Kademe satırı sayfalara girsin mi**, yoksa sadece README'deki ağaçta mı dursun?
- **NandGame dışı grup** aynı dosyada mı kalsın, yoksa `cwe/README.md` sadece
  NandGame'i mi göstersin (Leviathan ayrı sayfaya)?
