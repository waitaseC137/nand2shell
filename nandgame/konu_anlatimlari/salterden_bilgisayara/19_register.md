# 🧮 Şalterden Bilgisayara — Register: Bir Sayının Hafızası

> Bu seviyede kurulacak devre küçük: iki parça. Ama kurmadan önce iki soru
> soruldu. Biri, tek bir saat telinin iki parçayı birden yönetmesinin yeni bir
> yarış doğurup doğurmayacağıydı. Öbürü, `st`'nin her bitin kendi `d`'siyle
> eşleşip eşleşmediği. İkisinin cevabı da bu seviyenin asıl konusu.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Bir Sayının Hafızası](#bir-sayının-hafızası)
- [Veri Teli, Kontrol Teli](#veri-teli-kontrol-teli)
- [Neden Hepsi Aynı Anda?](#neden-hepsi-aynı-anda)
- [Ortak mı, Ayrı mı?](#ortak-mı-ayrı-mı)
- [Tek Zil, Kutular Yarışır mı?](#tek-zil-kutular-yarışır-mı)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [On Altı Bit](#on-altı-bit)

---

## Bu Parça Ne Yapıyor?

Memory bölümünün dördüncü kapısındasın. Manzara şu:

```
girişler:   st · d1 · d0 · cl   (1'er bit)
çıkışlar:   d1 · d0             (1'er bit)
kutu:       nand · inv · and · or · xor · dff
```

Kutuda yine yeni bir parça var: **`dff`.** Bir önceki derste kurduğun Data
Flip-Flop kapatılmış, tek parça olarak duruyor.

Seviyenin tanımı tek cümle: *"2 bitlik bir DFF, Data Flip-Flop gibi çalışır;
yalnız bir yerine iki bit (`d1` ve `d0`) saklar ve çıkışa verir."*

Açılan pencere de şunu söylüyor:

> *"Artık tek bir bit saklayabiliyorsun. Bu görevde iki Data Flip-Flop'u
> birleştirip **iki** biti **tek işlemde** saklayacak ve geri okuyacaksın. (Sonunda
> 16 bitlik sözcükleri bir seferde saklamak istiyoruz, ama iki biti nasıl
> saklayacağını bulursan daha büyük kümeleri saklamak kolay.)"*

---

## Bir Sayının Hafızası

Şimdiye kadar hafıza hep **tek bir bit**ti. SR Latch, D Latch, Data Flip-Flop:
hepsi bir tel tutuyordu.

Ama bilgisayar tek bitle iş yapmıyor. [04](./04_teller_sayi_olunca.md)'te
birkaç teli yan yana koyup onları **tek bir sayı** gibi okumayı öğrendin. ALU'da
16 teli hep birlikte taşıdın.

**Register, o sayının hafızası.** Birkaç biti bir bütün olarak tutan parça.
Pencerede geçen **sözcük** (*word*) kelimesi de bu bütünün adı: birlikte taşınan,
birlikte saklanan bitler.

> 📌 Burada iki kelime karışmasın. **Bit** bir birim: bir telin taşıyabildiği en
> küçük bilgi, 0 ya da 1. **Veri** o birimlerden oluşan içerik. Tek bir bit de
> veri olabilir, 16 bitlik bir sayı da. "SR Latch bir veri tutar" belirsiz kalır.
> Doğrusu: "SR Latch 1 bitlik veri tutar", register ise 2 (ya da 16) bitlik.

---

## Veri Teli, Kontrol Teli

Girişlerin adları tanıdık ama iki ayrı gruba ayrılıyorlar:

| giriş | ne taşıyor | kaç tane |
|---|---|---|
| `d1`, `d0` | **veri:** saklanacak sayının bitleri | her bit için bir tane |
| `st`, `cl` | **kontrol:** "yazılsın mı" ve "ne zaman" | sözcüğün tamamı için bir tane |

**`d1` ve `d0` adları basamaktan geliyor.** `d0` en sağdaki bit, 1'ler basamağı.
`d1` onun solundaki, 2'ler basamağı. İkisi birlikte 0'dan 3'e bir sayı:

```
d1 d0
 0  0   = 0
 0  1   = 1
 1  0   = 2
 1  1   = 3
```

**`st` ile `cl` bir önceki dersteki anlamlarında.** Değişen tek şey, artık tek bir
bite değil, **sözcüğün tamamına** emir vermeleri.

Bu ayrımı daha önce gördün. [14](./14_alu.md#veri-biti-ve-kontrol-biti)'te ALU'nun
kontrol sözcüğü 16 bitin hepsine **aynı** emri veriyordu, veri ise her bitte
ayrıydı. Orada söylenen cümle burada da geçerli: kontrol biti ile veri biti
arasında fiziksel bir fark yok, fark telin **nereye bağlandığında**.

---

## Neden Hepsi Aynı Anda?

Pencere "iki biti **tek işlemde** sakla" diyor. Bunun neden önemli olduğunu bir
örnek gösteriyor.

Register'da `01` (1) var. Oraya `10` (2) yazılıyor. İki bit de değişiyor: `d1`
0'dan 1'e, `d0` 1'den 0'a.

Bu iki bit **farklı anlarda** değişseydi, çıkışa bakan biri arada ne görürdü?

```
d1 önce değişirse:   01  →  11  →  10       arada 3 görünür
d0 önce değişirse:   01  →  00  →  10       arada 0 görünür
```

Kimsenin yazmadığı bir sayı bir anlığına çıkışta belirir. Bitlerden biri doğru,
ama sayı yanlış.

[18](./18_data_flip_flop.md#çıkış-neden-beklemeli)'de çıkışın neden beklemesi
gerektiği sorulmuştu. Burada bir adım daha var: tek bir bit bile zamanını
şaşırmamalı. **Bütün bitler aynı zilde değişmeli.**

---

## Ortak mı, Ayrı mı?

İki `dff` konacak. Her birinin üç bacağı var: `st`, `d`, `cl`. Toplam altı bacak.
Soru şu: hangileri iki `dff` için **ortak**, hangileri **ayrı**?

Önce `cl` bulundu: tek zil, iki `dff`'ye birden. Sonra `d`'ler: `d1` bir `dff`'ye,
`d0` öbürüne. Her bit kendi `d`'sini okuyor.

`st` için ise bir karışıklık yaşandı. `st`'nin de bit bit ayrıldığı, `st1`'in
`d1`'le, `st0`'ın `d0`'la eşleştiği sanıldı. Oysa girişlere bakınca bu seviyede
**tek bir `st`** var. `st`, bir bitin değil sözcüğün tamamının "yazılsın mı"
emri.

Karışıklığın kaynağı da anlaşılır: `st` ile `d`'nin birleştiği bir yer gerçekten
var, ama **kutunun içinde** ve tek bir yerde: [18](./18_data_flip_flop.md#kapılar-ne-zaman-açık)'deki
alıcı latch'in çevirmeni ([17](./17_d_latch.md)'deki çevirmen). `st` oraya da
doğrudan değil, `and(st, cl)` üzerinden ulaşıyor; vitrin `st`'yi hiç görmüyor.
Dışarıdan bakınca `dff`'nin bacakları ayrı: `st` emir, `d` veri. Onları
birleştirmek kutunun kendi işi.

| bacak | nereye |
|---|---|
| `st` | iki `dff`'ye **ortak** |
| `cl` | iki `dff`'ye **ortak** |
| `d1` | yalnız birinci `dff` |
| `d0` | yalnız ikinci `dff` |

> 🔑 **Kontrol telleri ortak, veri telleri ayrı.** Bu seviyenin bütün fikri bu
> tablo.

---

## Tek Zil, Kutular Yarışır mı?

`cl`'nin iki `dff`'ye birden gitmesi bir soru doğurdu: tek bir sinyalin iki parçayı
birden yönetmesi yine bir yarışa yol açmaz mı?

Cevap için yarışın tanımına dönmek gerekiyor. [CWE-1298](../cwe/cwe_1298.md)'de
tanım şuydu: aynı kaynaktan çıkan **iki yol, aynı kapıda buluşuyor**, ve sonuç
hangisinin önce geldiğine bağlı oluyor.

Burada `cl`'nin iki yolu **hiçbir yerde buluşmuyor.** Biri bir `dff`'ye, öbürü
öbürüne gidiyor. İki `dff` birbirine bağlı değil, biri öbürünün çıkışını
dinlemiyor. Her biri yalnızca kendi `d`'sini alıyor, o `d`'ler de oyunun kuralına
göre `cl = 1` iken değişmiyor.

Yani zil birine bir an geç ulaşsa bile ikisi de **aynı sabit değeri** alır. Sonuç,
kimin önce geldiğine bağlı değil. MITRE'nin tarif ettiği yapı oluşmuyor. Oyunda
ise tel zaten ideal: zil ikisine aynı anda ulaşıyor.

Gerçek bir çipte ise zil birine bir an geç ulaşırsa çıkışta bir an `11` ya da `00`
görünür, ama çıkışa bakan devre de değeri ancak bir sonraki zilde alır ve o
zamana kadar iki bit oturmuş olur.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **2 × `dff`**.

1. `st`'yi iki `dff`'nin `st` bacağına da bağla.
2. `cl`'yi iki `dff`'nin `cl` bacağına da bağla.
3. `d1`'i birinci `dff`'nin `d`'sine, `d0`'ı ikincisinin `d`'sine bağla.
4. Birinci `dff`'nin çıkışını Output `d1`'e, ikincisininkini Output `d0`'a bağla.

Output'ta da **iki** gösterge var, yan yana küçük duruyorlar. Gözden kaçırma.

### Register'ı nasıl test edersin

Her adımda **tek** bir anahtar değişiyor:

| adım | değişen | beklenen çıkış `d1 d0` | ne sınanıyor |
|---|---|---|---|
| 1 | `d0 = 1` | tanımsız | |
| 2 | `st = 1` | tanımsız | |
| 3 | `cl = 1` | **değişmez** | `01` alındı, gösterilmedi |
| 4 | `cl = 0` | `0 1` | iki bit birlikte gösterildi |
| 5 | `d1 = 1` | **`0 1`** | `cl = 0` iken veri duyulmuyor |
| 6 | `d0 = 0` | **`0 1`** | |
| 7 | `cl = 1` | **`0 1`** | `10` alındı, gösterilmedi |
| 8 | `cl = 0` | `1 0` | iki bit **aynı anda** değişti |
| 9 | `st = 0` | `1 0` | |
| 10 | `d1 = 0` | `1 0` | |
| 11 | `cl = 1` | `1 0` | çıkış değişmez, vitrin kapalı |
| 12 | `cl = 0` | **`1 0`** | `st = 0`: bu devirde alınmadı, eski sayı tutuluyor |

Adım 8'e bak: iki bit de değişti ve ikisi aynı adımda göründü.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
dff (bit 1):  st ← st    d ← d1    cl ← cl    →  Output d1
dff (bit 0):  st ← st    d ← d0    cl ← cl    →  Output d0
```

Toplam: 2 bileşen, 26 `nand`.

</details>

Oyunun cevabı:

> *"2 components used. 26 nand gates in total. This is the simplest possible
> solution!"*

![Register seviyesi geçti: 2 bileşen, 26 nand, en basit çözüm](./gorseller/19_basari.png)
*Register geçti. Sağdaki listede Memory bölümünün dördüncü seviyesi işaretli.*

26'ya dikkat et: iki `dff`, her biri **13** nand. [18](./18_data_flip_flop.md#kutular-açılınca)'de
kutuları açıp ulaşılan optimal sayı. Oyun `dff` kutusunu o en iyi çözüm kadar
sayıyor.

---

## On Altı Bit

Seviye bitince oyun bir şey daha söylüyor:

> *"2 bitlik bir saklama birimi kolayca tekrarlanıp 8, 16 ya da 32 bitlik bir birim
> yapılabilir. 16 bitlik bir bilgisayar kurduğun için, 16 bitlik bir saklama
> birimi (adı **register**) üretildi ve araç kutuna eklendi."*

İçinde ne olduğunu artık biliyorsun: 16 `dff` yan yana. `st` ve `cl` on altısına
da ortak, `d0`'dan `d15`'e kadar her bit kendi yolundan giriyor ve kendi yolundan
çıkıyor. İki bitte kurduğun tablo on altı satıra uzuyor, fikir değişmiyor.

Bu, [03.5](./03.5_soyutlama_merdiveni.md)'teki merdivenin bir basamağı daha:
kurduğun şey kapatılıp tek parça oluyor.

### Sırada

**Counter.**

---

## Özet — Aklında Tut

```
☐ Kutuda artık dff var: bir önceki dersin devresi kapatıldı.
☐ Register = bir SAYININ hafızası. Birlikte saklanan bitlere SÖZCÜK (word) denir.
☐ Bit bir birim (0 ya da 1), veri içerik. SR Latch 1 bitlik veri tutar, register 2 (ya da 16) bitlik.
☐ d1 ve d0 adları basamaktan: d0 1'ler, d1 2'ler basamağı. d1 d0 birlikte 0–3.
☐ 🔑 Veri telleri (d1, d0) bit bit AYRI. Kontrol telleri (st, cl) sözcüğe ORTAK.
☐ Kontrol biti ile veri biti arasında fiziksel fark yok; fark telin nereye bağlandığında (14).
☐ Neden tek işlemde: bitler farklı anlarda değişirse kimsenin yazmadığı bir sayı görünür (01 → 11 ya da 00 → 10).
☐ ⚠️ st bit bit ayrılmaz; tek st var. st ile d'nin birleştiği yer dff kutusunun İÇİ: yalnız alıcının çevirmeni, st oraya and(st, cl) üzerinden ulaşır.
☐ Tek cl iki dff'yi yönetince yarış yok: cl'nin iki yolu hiçbir kapıda BULUŞMUYOR, her dff kendi sabit d'sini alıyor.
☐ Çözüm: 2 bileşen, 26 nand, en basit. dff kutusu 13 nand = 18'deki optimal.
☐ Oyun 16 bitlik register kutusunu üretti: 16 dff, st ve cl ortak, d0–d15 ayrı.
```

---

## 🔗 İlgili Konular

- [18_data_flip_flop.md](./18_data_flip_flop.md) — Register'ın her biti; "çıkış neden beklemeli?"
- [14_alu.md](./14_alu.md) — Veri biti ve kontrol biti; kontrol sözcüğü 16 bitin hepsine aynı emri verir
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Birkaç tel, tek bir sayı; basamak değeri
- [17_d_latch.md](./17_d_latch.md) — `st` ile `d`'nin kutunun içinde birleştiği çevirmen
- 👾 **Yarışın tanımı:** [CWE-1298](../cwe/cwe_1298.md) — aynı kaynaktan çıkan iki yol, aynı kapıda buluşunca
- [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md) — Kurduğun şeyi kapatıp üstüne çıkmak

---

**Önceki konu:** [18_data_flip_flop.md](./18_data_flip_flop.md)
**Sonraki konu:** [20_counter.md](./20_counter.md)

*Bu ders, "Şalterden Bilgisayara" serisinin bir parçasıdır. Seri, [nandgame.com](https://nandgame.com) eşliğinde ilerler.*
