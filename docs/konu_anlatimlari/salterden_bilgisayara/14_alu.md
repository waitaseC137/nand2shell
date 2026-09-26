# 🧮 Şalterden Bilgisayara — ALU: İşlemi Değil Malzemeyi Değiştirmek

> `12`'de emri dinleyen ilk devreyi kurdun. `13`'te seçiciyi çıkıştan alıp
> girişe taşıdın. Bu seviyede iki birim de rafta hazır duruyor — yapılacak tek
> şey onları birleştirmek gibi görünüyor.
>
> Ama tablonun altında iki satır daha var: `zx` ve `sw`. Bu ikisi hiçbir işlem
> seçmiyor. Ünitelerin içine de girmiyor.
>
> Bu ders serinin son çevirme hareketini yapıyor: seçici girişe taşınabiliyorsa,
> **girişin kendisi de değiştirilebilir.** Ve sekiz satırlık bir tablo, tek bir
> yeni kapı eklenmeden tablodakinden çok daha fazlasını yapmaya başlıyor.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Veri Biti ve Kontrol Biti](#veri-biti-ve-kontrol-biti)
- [Kat ve Kapı: Kontrol Bitleri Bir Adrestir](#kat-ve-kapı-kontrol-bitleri-bir-adrestir)
- [Aynı Tel Çifti, Ayrı Sözleşmeler](#aynı-tel-çifti-ayrı-sözleşmeler)
- [Bayraklar Malzemeyi Değiştirir](#bayraklar-malzemeyi-değiştirir)
- [Neden Bir Bayrağa Çift, Ötekine Tek Seçici?](#neden-bir-bayrağa-çift-ötekine-tek-seçici)
- [Tuzak: Sıra Zorunludur](#tuzak-sıra-zorunludur)
- [Tuzak: Sıfırı Yanlış Bayrağa Bağlamak](#tuzak-sıfırı-yanlış-bayrağa-bağlamak)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Hepsini Üret, Sonra Seç](#hepsini-üret-sonra-seç)
- [Sekiz Satır, 32 Durum](#sekiz-satır-32-durum)

---

## Bu Parça Ne Yapıyor?

ALU = **Arithmetic Logic Unit**, aritmetik ve mantık birimi. İşlemcinin hesap
yapan tek parçası. Bu seviyede onu kuruyorsun — ve ünitenin üçüncü seviyesinde
olduğun için, iki yarısı da elinde hazır.

Girişler:

```
X, Y          16'şar bit    üzerinde işlem yapılacak sayılar
u             1 bit         hangi birim
op1, op0      2 bit         o birimde hangi işlem
zx, sw        2 bit         operandlara ne olacak
```

Çıkış tek: 16 bit sonuç.

Tabloda geçen **operand**, bir işleme giren sayı demek: `X − Y`'de X de Y de birer
operand. `13`'te buna "ikinci sayı" diyorduk.

Belgedeki ilk tablo sekiz satır:

| `u` | `op1` | `op0` | sonuç |
|---|---|---|---|
| `0` | `0` | `0` | `X and Y` |
| `0` | `0` | `1` | `X or Y` |
| `0` | `1` | `0` | `X xor Y` |
| `0` | `1` | `1` | `invert X` |
| `1` | `0` | `0` | `X + Y` |
| `1` | `1` | `0` | `X − Y` |
| `1` | `0` | `1` | `X + 1` |
| `1` | `1` | `1` | `X − 1` |

Üst dört satır `12`'de kurduğun **logic unit**, alt dört satır `13`'te kurduğun
**arithmetic unit**. İkisi de kutuda hazır parça olarak duruyor. Yani bu seviyede
tek bir mantık kapısı kurmuyorsun — **kurduklarını birleştiriyorsun.**

Ardından ikinci bir tablo geliyor, ve bu tablo ilkine hiç benzemiyor:

| `zx` | `sw` | `X − Y` ne oluyor |
|---|---|---|
| `0` | `0` | `X − Y` |
| `0` | `1` | `Y − X` |
| `1` | `0` | `0 − Y` |
| `1` | `1` | `0 − X` |

Dikkat et: **işlem değişmedi.** Dört satırda da çıkarma yapılıyor. Değişen şey
çıkarmaya *ne verildiği*.

---

## Veri Biti ve Kontrol Biti

Bu devreye giren yedi şey var ve ikiye ayrılıyorlar. Ayrım serinin geri kalanı
boyunca geçerli olacak:

| | | ne taşıyor |
|---|---|---|
| **veri** | `X`, `Y` | üzerinde işlem yapılan **sayılar** |
| **kontrol** | `u`, `op1`, `op0`, `zx`, `sw` | ne yapılacağını söyleyen **talimat** |

`X` ve `Y` malzeme. Diğer beşi sayı değil — emir. Devreye "şunu yap" diyorlar.

Beşi bir arada bir **kontrol sözcüğü** oluşturuyor:

```
  u  op1  op0  zx  sw
  └──────── 5 bit ────────┘
```

Bu, seride ilk defa karşına çıkan şey: bir devrenin bütün bir **komutu** girdi
olarak alması. `12`'de iki bitlik bir emir vardı, `13`'te yine iki. Burada beş.
İlerideki **Processor** ünitesinde bu sözcük bellekten okunacak ve adı
**makine komutu** olacak.

> 🔑 Kontrol biti ile veri biti arasında fiziksel hiçbir fark yok. İkisi de tel,
> ikisi de yüksek ya da alçak. Fark tamamen **nereye bağlandığında**. `11`'deki
> kontrol telinin bir başka görünümü: anlam telde değil, telin gittiği yerde.

---

## Kat ve Kapı: Kontrol Bitleri Bir Adrestir

`u`, `op1` ve `op0` birlikte bir **adres** kuruyor. Apartman gibi düşün:

```
u        →  hangi kat            1 bit  →  2 kat
op1 op0  →  o katta hangi kapı   2 bit  →  4 kapı
```

2 kat × 4 kapı = **8 daire**. Tablodaki sekiz satır tam olarak bu.

| kat (`u`) | kapılar (`op1 op0`) |
|---|---|
| `0` — mantık katı | `and` · `or` · `xor` · `invert` |
| `1` — aritmetik kat | `X+Y` · `X+1` · `X−Y` · `X−1` |

Adres mantığı devreye doğrudan yansıyor: `op1` ve `op0` **iki üniteye birden**
gidiyor, `u` ise en sondaki seçicide oturuyor. Yani önce iki kat da cevabını
hazırlıyor, sonra `u` hangi kattan alınacağını söylüyor.

---

## Aynı Tel Çifti, Ayrı Sözleşmeler

Burası dersin en kolay atlanan yeri.

`op1` ve `op0` tek bir tel çifti. Ama iki farklı yere gidiyorlar ve iki farklı
şey anlatıyorlar:

```
op1 op0 = 1 0    logic unit için        →  xor
op1 op0 = 1 0    arithmetic unit için   →  X − Y
```

Sinyal aynı. Voltaj aynı. Anlamı **kimin dinlediğine** göre değişiyor.

İki ünitenin sözleşmesi şöyle:

| | `op1` ne diyor | `op0` ne diyor |
|---|---|---|
| **logic unit** | grup: `and/or` mu, `xor/invert` mi | gruptaki hangi eleman |
| **arithmetic unit** | işlem: toplama mı çıkarma mı | ikinci sayı: `Y` mi sabit `1` mi |

Alttaki satırı `13`'te sen bulmuştun — tabloya bakıp *"`op1` işlemin ne
olduğunu değiştiriyor, `op0` ikinci operandın ne olduğunu"* demiştin. O gözlem
hâlâ geçerli. Yeni olan, **üstteki satırın aynı tellerle başka bir şey söylemesi.**

> 👾 Bu, `09`'daki *"desen aynı, anlam okuyanın kararı"* cümlesinin en saf hâli
> ve [CWE-681](../cwe/cwe_681.md)'in devre tarafı. Orada aynı bit deseni iki
> farklı sayı olarak okunuyordu; burada aynı bit deseni iki farklı **komut**
> olarak okunuyor. Yanlış ünite dinlerse ortaya çıkan şey hatalı değil —
> **başka bir işlem.**

---

## Bayraklar Malzemeyi Değiştirir

`zx` ve `sw` yukarıdaki adresin parçası değil. Sekiz daireden hiçbirini seçmiyor.

Adları ne yaptıklarını söylüyor:

```
zx  =  zero X     sol operandı 0 yap
sw  =  swap       X ile Y'nin yerini değiştir
```

Ve ikisi de ünitelerin **önünde** duruyor:

| | ne söylüyor |
|---|---|
| `u`, `op1`, `op0` | **hangi makine** çalışacak |
| `zx`, `sw` | o makineye **ne verilecek** |

İkinci tabloyu, eksinin solundaki ve sağındaki ayrı ayrı yazınca devrenin şekli
görünür hâle geliyor:

| `zx` | `sw` | sol operand | sağ operand |
|---|---|---|---|
| `0` | `0` | `X` | `Y` |
| `0` | `1` | `Y` | `X` |
| `1` | `0` | `0` | `Y` |
| `1` | `1` | `0` | `X` |

**Bütün seviye bu tabloda.** Geri kalan her şey hazır parça.

Ve buradaki asıl fikir `13`'ün bir adım ötesi:

```
12:  dört işlem çalışır, ÇIKIŞTA biri seçilir
13:  seçici GİRİŞE taşınır, arkadaki devre bir kere kurulur
14:  giriş SEÇİLMEZ, DEĞİŞTİRİLİR — işlem hiç haberdar olmaz
```

Üniteler bu bayraklardan haberdar değil. `arithmetic unit` hâlâ kendisine gelen
iki sayıyı çıkarıyor; onlardan birinin `0` olduğunu bilmiyor. Bilmesine de gerek
yok — ve dersin verimi tam olarak buradan geliyor.

---

## Neden Bir Bayrağa Çift, Ötekine Tek Seçici?

Ön katmanı kurarken insanın ilk takıldığı yer bu: `sw` için iki `select 16`
gerekiyor, `zx` için bir. Neden simetrik değil?

Tek cümlelik cevap:

> **`sw` iki tarafa birden dokunuyor, `zx` sadece bir tarafa.**

`sw` "yer değiştirsinler" diyor. Hem sol hem sağ yeni bir değer alıyor. İki değer
üretmek için iki seçici gerekiyor.

`zx` ise "**sol** operand 0 olsun" diyor. Sağ tarafa hiç bakmıyor. Tek değer,
tek seçici.

Devreyi iki ayrı boru hattı olarak çizince yerleşiyor:

```
SAĞ OPERAND  —  tek katman, zx'i hiç görmüyor

   X ── D1 ┐
           ├── S2  (s = sw) ──────────────────►  sağ operand
   Y ── D0 ┘                                      → iki ünitenin de Y bacağı


SOL OPERAND  —  iki katman, iki soru

                     0 ────── D1 ┐
   Y ── D1 ┐                      ├── S3  (s = zx) ──►  sol operand
           ├── S1  (s = sw) ── D0 ┘                      → iki ünitenin de X bacağı
   X ── D0 ┘
```

`S2` doğrudan ünitelere gidiyor, çünkü sağ tarafın tek sorusu vardı ve
cevaplandı. `S1` ünitelere gitmiyor, önce `S3`'e uğruyor, çünkü sol tarafın
**bir sorusu daha var.**

Sol taraf iki soruya cevap vermek zorunda: *kim solda?* ve *silinsin mi?*
İki soru, iki kat.

---

## Tuzak: Sıra Zorunludur

`sw` ile `zx` hangi sırayla uygulanacak? Bu bir tercih değil — tablo zorluyor.

Turnusol kâğıdı son satır:

| `zx` | `sw` | sonuç |
|---|---|---|
| `1` | `1` | `0 − X` |

`sw` "X ile Y yer değiştirir" diyor. `zx` "**soldaki** operand 0 olur" diyor.
İkisi de 1 iken ortaya `0 − X` çıkıyor — `Y` değil, **`X`**.

Önce takas edersen: `X` sağa geçer, sol `Y` olur, sonra sol silinir →
`0 − X` ✅

Önce silersen: sol `0` olur, sonra takas → `0` sağa geçer, sol `X` olur →
`X − 0` ❌

Sebebi oyunun açıklamasında: `zx` için *"the left operand is replaced with 0"*,
yani "**soldaki** operand 0 olur" yazıyor. Adındaki X, X girişi değil, ünitelerin
X bacağı, yani soldaki operand. Birinin solda olması için önce pozisyonların belli
olması gerekiyor. `sw` pozisyonları belirler, `zx`
belirlenmiş pozisyona dokunur.

> 💡 Genel kural: bir katman **"şuradaki"** diye konum tarif ediyorsa, konumu
> belirleyen katman ondan önce gelmek zorundadır.

---

## Tuzak: Sıfırı Yanlış Bayrağa Bağlamak

Ön katmanda üç seçici var ve hepsinin boşta duran veri bacakları var. `0`
sabitini bunlardan birine takmak çok kolay — ve yanlış olanına takmak daha da
kolay.

Yanlış kurulum şöyle görünür: `0`, `sw` ile sürülen S1'in boş veri bacağına
takılır. Oraya gelmesi gereken `Y` açıkta kalır ve S3'ün boşta kalan bacağına
gider. İkisi yer değiştirmiş olur:

```
S1:  s = sw,  D0 = X,   D1 = 0     ← 0 burada YANLIŞ yerde (Y olmalıydı)
S3:  s = zx,  D0 = S1,  D1 = Y     ← Y de (0 olmalıydı)
```

Bu devrede `0`, `sw` çevrildiğinde ortaya çıkar. Ama tabloya bak: `0` yalnızca
`zx = 1` satırlarında var. `sw` satırlarında hiç yok.

Benzetmeyle:

```
sw  bir MAKAS   →  yerleri değiştirir
zx  bir SİLGİ   →  soldakini siler
```

Silgiyi makasın koluna bağlarsan, makası her çevirdiğinde silgi de devreye girer.

**Belirtisi şu** (X = 5, Y = 3 ile):

| `zx` | `sw` | görülen | beklenen | |
|---|---|---|---|---|
| `0` | `0` | `2` | `5 − 3 = 2` | ✓ |
| `0` | `1` | `−5` | `3 − 5 = −2` | ✗ |
| `1` | `0` | `0` | `0 − 3 = −3` | ✗ |
| `1` | `1` | `−2` | `0 − 5 = −5` | ✗ |

Dört satırdan yalnızca biri doğru, o da başlangıç satırı (`zx=0, sw=0`). Ekrana
ilk baktığında her şey yolunda görünür. `0`'ı `sw` seçicilerinden birine takan
başka kurulumlar da çoğu zaman aynı belirtiyi verir. `13`'teki ölçüyü hatırla — *"bozuk olsaydı
farkederdim"* diyebilmek için **dört satırı da** yürütmek gerekiyor.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **4 × `select 16`**, **1 × `0`**, **1 × `logic unit`**,
**1 × `arithmetic unit`**. `nand`, `and 16`, `add 16`, `inv 16` hiç girmiyor —
hepsi ünitelerin içinde zaten var.

Sırayla git, tuval karışmasın:

1. **Sağ operandı üret.** Tek seçici, `s = sw`. Bittiğinde `X=5, Y=3` yazıp
   `sw`'yi gezdir: `3` ve `5` görmelisin.
2. **Sol operandın ilk katını kur.** İkinci seçici, `s = sw`, ama veri bacakları
   birincinin **tersi**.
3. **Sol operandın ikinci katını kur.** Üçüncü seçici, `s = zx`. Veri
   bacaklarından biri `0` sabiti, diğeri ikinci adımın çıkışı.
4. **Ön katmanı doğrula.** Üniteleri koymadan önce, dört satırı da yürüt:

   | `zx` | `sw` | sol | sağ |
   |---|---|---|---|
   | `0` | `0` | `5` | `3` |
   | `0` | `1` | `3` | `5` |
   | `1` | `0` | `0` | `3` |
   | `1` | `1` | `0` | `5` |

5. **Üniteleri koy.** İkisinin de `X` bacağına sol operand, `Y` bacağına sağ
   operand. `op1` ve `op0` ikisine birden.
6. **Son seçici.** `s = u`, iki ünitenin çıkışı iki veri bacağına. Çıkışı
   `Output`'a bağla.

Ünitelerden önce ön katmanı doğrulamak, bu seviyenin tek gerçek yöntem dersi.
Sonda yanlış bir sayı gördüğünde, hata yedi parçanın herhangi birinde olabilir.
Ön katman (S1, S2, S3 ve `0`) doğrulanmışsa şüpheli üçe iner: iki ünitenin
bağlantıları ve son seçici.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
S1 (sol aday):   s ← sw    D0 ← X           D1 ← Y
S2 (sağ operand):s ← sw    D0 ← Y           D1 ← X
S3 (sol operand):s ← zx    D0 ← S1 çıkışı   D1 ← 0 sabiti

logic unit:      op1 ← op1   op0 ← op0   X ← S3   Y ← S2
arithmetic unit: op1 ← op1   op0 ← op0   X ← S3   Y ← S2

S4 (sonuç):      s ← u     D0 ← logic unit   D1 ← arithmetic unit
                 çıkış → Output
```

`S1` ile `S2`'nin veri bacakları birbirinin tersi — aynı `sw` teli ikisini de
sürüyor ama biri `X`'i, diğeri `Y`'yi öne çıkarıyor. Takas bundan doğuyor.

</details>

---

## Hepsini Üret, Sonra Seç

Devre bittiğinde ekranda şunu görürsün: `u = 0` iken bile `arithmetic unit`'in
çıkışında bir sayı durur. `zx = 1` iken bile `S1` bir sayı üretir.

İkisi de kullanılmaz. Ama ikisi de **hesaplanır.**

```
u = 0  →  arithmetic unit yine de X+Y'yi hesapladı, sonuç atıldı
zx = 1 →  S1 yine de sw'nin cevabını üretti, sonuç atıldı
```

Bu bir hata değil, donanımın çalışma biçimi. Bir devre "acaba bana ihtiyaç var
mı?" diye bekleyemez — beklemek için de bir devre gerekir ve o devre de zaman
alır. Daha ucuz olan yol şu:

> **Hepsini üret, sonra birini seç.**

`12`'de bu fikirle ilk defa tanışmıştın (*"dördü de hep çalışır"*). Burada
ölçeği büyüyor: artık iki koca birim ve bir ön katman, her komutta sonucunun bir
kısmını çöpe atıyor.

Ve tam burada dersin ikinci yüzü açılıyor:

> 🔑 Çöpe atılan sonuç **yok olmuyor.** Sadece *kullanılmıyor*. Hesaplandığı
> sırada kapılar anahtarlandı, akım aktı, ısı çıktı, zaman geçti. Sonucu
> okuyamazsın — ama hesaplandığının **izlerini** okuyabilirsin.

Bu cümle şu an sadece bir merak. İleride, işlemcinin içindeki ölçülebilir izlere
geldiğimizde bir yöntemin adı olacak.
[CWE-1300](../cwe/cwe_1300.md) — fiziksel yan kanal — tam olarak bu boşluğu
tarif ediyor: mantıksal olarak gizli olan bir şeyin, fiziksel olarak ölçülebilir
kalması.

---

## Sekiz Satır, 32 Durum

Şimdi kontrol sözcüğüne geri dön ve say.

```
u  op1  op0  zx  sw     =  5 bit  →  2⁵ = 32 kombinasyon
```

Belgede kaç tanesi yazılı?

- Birinci tablo: `u`, `op1`, `op0` için **8 satır**
- İkinci tablo: `zx`, `sw` için **4 satır** — ve sadece `X − Y` örneği üzerinden.
  Biri (`X − Y`) birinci tabloda zaten var, üçü yeni: `Y − X`, `0 − Y`, `0 − X`.

Yani belge iki ekseni **ayrı ayrı** anlatıyor. Çapraz çarpımın tamamı hiçbir
yerde yazmıyor. 32 kombinasyonun her biri bir sonuç üretiyor, ama belgede
on birinin karşılığı var.

### 🔍 Say bakalım

Devren toplamda kaç **farklı** işlem yapabiliyor? Sekiz işlem × dört bayrak
durumu = 32 kombinasyon; ama bazıları aynı sonucu veriyor (`X and Y` ile
`Y and X` aynı şey). Tekrar edenleri eleyip listeyi çıkar.

<details>
<summary>🔑 Cevap — önce kendin say</summary>

**On dokuz.**

```
sabitler        0        1        −1
kopyalar        X        Y
eksiler         −X       −Y
tersler         not X    not Y
komşular        X+1      X−1      Y+1      Y−1
toplama         X+Y
çıkarmalar      X−Y      Y−X
mantık          X and Y  X or Y   X xor Y
```

Belgede yazılı olan **on bir** tanesi: birinci tablonun sekizi, ikinci tablonun
`Y − X`, `0 − Y` ve `0 − X`'i. Geri kalan **sekiz** tanesi iki tablonun
çarpımından doğuyor ve hiçbir yerde listelenmiyor: `0`, `1`, `−1`, `X`, `Y`,
`not Y`, `Y+1`, `Y−1`.

En çarpıcıları:

| nasıl çıkıyor | sonuç |
|---|---|
| `X + 1` işlemi, `zx = 1` | `0 + 1` = sabit **1** |
| `X − 1` işlemi, `zx = 1` | `0 − 1` = sabit **−1** |
| `X and Y` işlemi, `zx = 1` | `0 and Y` = sabit **0** |
| `X or Y` işlemi, `zx = 1` | `0 or Y` = **`Y`**, olduğu gibi geçirme |
| `X + 1` işlemi, `sw = 1` | `Y + 1`, **Y'yi artırma** |

`13`'te sabit `1`'i imal etmek için `0` + `inv` kullanmıştın. Burada sabit `1`,
`−1` ve `0` **bedava** geliyor — tek bir ek kapı olmadan, sadece bayrak
kombinasyonu olarak. Aynı şekilde "olduğu gibi geçir" ve "Y'yi artır" işlemleri
de listede yokken devrede var.

</details>

### Listelenmemiş Durumlar

Şimdi asıl noktaya gelelim. NandGame'de listelenmemiş bu sekiz işlem **iyi
haber** — bedava işlem. Gerçek bir çipte aynı manzara başka anlama gelir.

Ama önce bir incelik. NandGame `zx` ve `sw` için bir **kural** veriyor: "`sw`
X ile Y'yi takas eder, `zx` soldaki operandı 0 yapar." Bu kuralla 32
kombinasyonun hepsini kâğıt üstünde türetebilirsin. Yani bu sekiz işlem **gizli
değil, sadece listelenmemiş.** Belge çarpımı saymıyor, ama çarpımı hesaplamak
için gereken her şeyi veriyor.

Bir donanım parçasının kontrol sözcüğü `n` bit genişse, o parça `2ⁿ` duruma
girebilir. Belge bunlardan yalnız bir kısmını tarif ediyorsa, geri kalanı yok
olmaz — **tarif edilmemiş olarak var olur.** Gerçek çiplerde bu çoğu zaman
NandGame'deki gibi masum değildir: bazı bitlerin **kuralı bile** yazılmaz,
varlıkları bile bilinmez.

Üretimden sonra riskli bir özelliği kapatabilmek için bırakılan bitlere
**chicken bit** denir. Böyle bir bit belgelenmemişse, erişilebilir durumdaysa ve
bir güvenlik özelliğini kapatıyorsa, zayıflık doğar.

MITRE bunu ayrı bir zayıflık olarak katalogluyor: **[CWE-1242](../cwe/cwe_1242.md) —
Inclusion of Undocumented Features or Chicken Bits**. Tipik örneği, hata ayıklama için
bırakılmış ve üretime kadar temizlenmemiş kontrol bitleri.

Buradan çıkan çalışma kuralı:

> **Belgelenmiş durum uzayından geniş her kontrol sözcüğü, bakılacak bir yerdir.**

Tersine mühendisliğin donanım tarafında yaptığı iş tam olarak budur: belgenin
saydığı durumlarla, sözcüğün izin verdiği durumları yan yana koymak ve aradaki
farkı denemek. Bugün NandGame'de yaptığın sayma işlemi — 32 kombinasyon, 11
belgelenmiş — o işin en küçük hâli.

> 📄 Ayrıntısı kendi sayfasında: [CWE-1242](../cwe/cwe_1242.md) — chicken bit'in
> ne olduğu, neden bırakıldığı, ve belgelenmemiş olmanın neden bir koruma
> sayılmadığı.

### Sırada

**Condition**, ALU ünitesinin son seviyesi. Kutuda bu sefer **seçici yok** —
üç seviyedir her şeyi `select` ile çözüyordun, o alışkanlık burada kırılıyor.
Ve `10`'da verilen taşma bayrağı (OF) sözü orada kapanıyor.

---

## Özet — Aklında Tut

```
☐ Bu seviyede tek kapı kurmuyorsun: 12 ve 13'te kurduklarını BİRLEŞTİRİYORSUN.
☐ İki tür bit var: VERİ (X, Y) ve KONTROL (u, op1, op0, zx, sw). Fark telde değil, bağlandığı yerde.
☐ Beş kontrol biti bir KONTROL SÖZCÜĞÜ — Processor ünitesinde adı "makine komutu" olacak.
☐ u · op1 · op0 bir ADRES: 2 kat × 4 kapı = tablodaki 8 satır.
☐ ⚠️ op1/op0 iki üniteye birden gidiyor ve İKİ FARKLI SÖZLEŞMEYLE okunuyor. Sinyal aynı, anlam ayrı.
☐ zx ve sw hiçbir işlem seçmez: "hangi makine" değil, "makineye NE verilecek" derler.
☐ zx = zero X (sol operandı sıfırla) · sw = swap (X ile Y'yi takas et).
☐ 12: çıkışta seç · 13: girişte seç · 14: GİRİŞİ DEĞİŞTİR. Üniteler bayraklardan habersiz.
☐ sw iki tarafa dokunur → iki seçici. zx tek tarafa dokunur → tek seçici. Asimetri buradan.
☐ Sağ operand zx'i HİÇ görmez: tek katman. Sol operand iki soruya cevap verir: iki katman.
☐ ⚠️ Sıra zorunlu: önce sw, sonra zx. "Soldaki" diyen katman, konumu belirleyen katmandan SONRA gelir.
☐ ⚠️ 0 sabiti zx'in seçicisine bağlanır. sw'nin boş bacağına takarsan makasa silgi bağlamış olursun.
☐ 0 ile Y yer değiştirirse (S1'e 0, S3'e Y) dört satırdan yalnız BİRİ doğru çıkar: başlangıç satırı. Dört satırı da yürüt.
☐ Üniteleri koymadan önce ön katmanı doğrula: şüpheli parça yediden üçe iner.
☐ Hepsini üret, sonra seç: u=0 iken de aritmetik birim hesaplar, zx=1 iken de S1 çalışır.
☐ 🔑 Çöpe atılan sonuç YOK OLMAZ, sadece kullanılmaz. Kapı anahtarlandı, ısı çıktı, zaman geçti.
☐ Kontrol sözcüğü 5 bit = 32 durum. Belge 8 satır + 4 satırı AYRI AYRI veriyor; çarpımı hiç yazmıyor.
☐ Devrenin gerçek kapasitesi 19 farklı işlem — 11'i belgede yazılı, 8'i hiçbir yerde listelenmiyor.
☐ Listelenmemiş ≠ gizli: oyun zx/sw KURALINI veriyor, 32'nin hepsi kâğıt üstünde türetilebilir. Chicken bit'te kural bile yok.
☐ 13'te 0 + inv ile imal ettiğin sabit 1, burada zx=1 ile BEDAVA geliyor. Sabit 0 ve −1 de öyle.
☐ 👾 Belgelenmiş durum uzayından geniş her kontrol sözcüğü bakılacak bir yerdir (CWE-1242).
```

---

## 🔗 İlgili Konular

- 👾 **Anlam okuyanda:** [CWE-681 — Hatalı sayısal dönüşüm](../cwe/cwe_681.md) — aynı desenin iki farklı sözleşmeyle okunması
- 👾 **Atılan sonucun izi:** [CWE-1300 — Fiziksel yan kanal](../cwe/cwe_1300.md) — hesaplanan ama kullanılmayan şeyin ölçülebilir kalması
- 👾 **Belgelenmemiş uzay:** [CWE-1242 — Chicken Bits](../cwe/cwe_1242.md) — 32 durum, 11 belgelenmiş: aradaki fark
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — Seçiciyi girişe taşımak; `op1`/`op0`'ın aritmetik sözleşmesi
- [12_logic_unit.md](./12_logic_unit.md) — Emri dinleyen ilk devre; "dördü de hep çalışır"
- [11_selector_switch.md](./11_selector_switch.md) — `select 16`'nın kendisi ve fan-out
- [10_bayraklar.md](./10_bayraklar.md) — Bayrak kavramı; OF borcu
- [09_subtraction.md](./09_subtraction.md) — "Desen aynı, anlam okuyanın kararı"
- [../x86_assembly/09_aritmetik.md](../x86_assembly/09_aritmetik.md) — Aynı işlemlerin yazılım tarafı
- [../x86_assembly/13_bit_islemleri.md](../x86_assembly/13_bit_islemleri.md) — Mantık katının komut karşılıkları

---

**Önceki konu:** [13_arithmetic_unit.md](./13_arithmetic_unit.md)
**Sonraki konu:** [15_condition.md](./15_condition.md)
