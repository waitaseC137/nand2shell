# 🧮 Şalterden Bilgisayara — Condition: Seçici Değil, Vana

> Bu ders diğerlerinden farklı yazıldı. Karşında oturmuş, seni seyreden biri
> varmış gibi. Sana sorular soracak, sen kurarken bekleyecek, yanlış bağladığında
> "dur bir bakalım" diyecek.
>
> Ve dersteki yanlış denemeler uydurma değil. Gerçekten bu sırayla yapıldı: önce
> doğru mantık yanlış kapıya verildi, sonra doğru parça yanlış tele bağlandı,
> sonra "çalışıyor ama yanlış sebeple çalışıyor" durumuna girildi. Üçü de
> düzeltildi — ve her biri, düz anlatımın öğretemeyeceği bir şey öğretti.
>
> O yüzden hatalar silinmedi. Ders onların üstüne kuruldu.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [lt, eq, gt Bir Sayı Değildir](#lt-eq-gt-bir-sayı-değildir)
- [Neden Her Şey Sıfıra Göre?](#neden-her-şey-sıfıra-göre)
- [Kutuda Olmayan Parça](#kutuda-olmayan-parça)
- [Birinci Deneme ve Neden Tutmadı](#birinci-deneme-ve-neden-tutmadı)
- [Değili Girişe Taşımak](#değili-girişe-taşımak)
- [xor Neden Çalışır ve Neden Yazılmaz](#xor-neden-çalışır-ve-neden-yazılmaz)
- [Tuzak: Doğru Parça, Yanlış Tel](#tuzak-doğru-parça-yanlış-tel)
- [Vana Olarak and](#vana-olarak-and)
- [Üç Şeyi Çift Bacakla Birleştirmek](#üç-şeyi-çift-bacakla-birleştirmek)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Tabloyu Hiç Kurmadın](#tabloyu-hiç-kurmadın)
- [Kapanan Borç: OF](#kapanan-borç-of)

---

## Bu Parça Ne Yapıyor?

Seviyeyi açtın. Manzara şu:

```
girişler:   lt · eq · gt   (1'er bit)     X   (16 bit)
çıkış:      1 bit
kutu:       nand · inv · and · or · xor · is neg · is zero
```

Ve hemen iki şey dikkatini çekiyor — ikisi de **eksiklik**:

**① `select 16` kutuda yok.**

Üç seviyedir her tabloyu seçiciyle çözdün. `12`'de dört işlemden birini seçtin,
`13`'te seçiciyi girişe taşıdın, `14`'te dört seçici birden kullandın. Şimdi o
alet elinden alınıyor. Yerine ne koyacağın, bu dersin asıl konusu.

**② Üçüncü koşul kutuda yok.**

`is neg` var (negatif mi), `is zero` var (sıfır mı). Ama "pozitif mi" diye bir
parça **yok**. Onu kendin imal edeceksin — ve malzemen elindeki iki parça.

---

## lt, eq, gt Bir Sayı Değildir

Başlamadan önce tek bir soru var, ve devrenin şekli onun cevabından çıkıyor.

Adları kısaltma:

```
lt  =  less than       küçüktür
eq  =  equal           eşittir
gt  =  greater than    büyüktür
```

Yazıda `lt` bazen `IT` gibi görünür — o büyük İ değil, küçük L. Bu üçlü karşına
ömür boyu çıkacak: assembly'de, C'de, veritabanı sorgularında, hepsinde aynı
kısaltmalar.

Ama asıl soru şu: **bu üç bit ne söylüyor?**

Bir sayı değiller. Yani "0 = küçüktür, 1 = eşittir, 2 = büyüktür" diye
okunmuyorlar. Üçü birden gelebiliyor. Hiçbiri gelmeyebiliyor.

İki uç durumu düşün: `lt=0, eq=0, gt=0` ne demek? Ya da `lt=1, eq=1, gt=1`?

Belge cevabı veriyor: ilki **Never**, ikincisi **Always**. Hiçbir zaman ve her
zaman. Bu ikisi bir karşılaştırma operatörü değil.

Öyleyse cevap şu: iki sayıyı karşılaştırdığında ortaya çıkabilecek sonuç sayısı
**tam olarak üçtür.**

```
küçük    eşit    büyük
```

Dördüncüsü yok. Bir sayı ya küçüktür, ya eşittir, ya büyüktür — üçünden biri, ve
sadece biri. Bu üçlüye matematikte **üçlem** (*trichotomy*) deniyor.

`lt`, `eq`, `gt` "hangi karşılaştırmayı yap" demiyor. Şunu diyor:

> **Bu üç sonuçtan hangileri "başarı" sayılacak?**

Her bayrak bir **izin**. Açıksa o sonuç kabul, kapalıysa ret.

### Bileşik operatörler yeni operatör değil

Belgede sekiz satır var: `<`, `=`, `>`, `≥`, `≤`, `≠`, artı iki uç. Sekiz
operatör için sekiz ayrı devre yok — üç bit var. Çünkü `≥`, `≤`, `≠` ayrı birer
şey değil, üç temel sonucun **birleşimi**:

| operatör | hangi sonuçlara izin veriyor | `lt eq gt` |
|---|---|---|
| `X > 0` | sadece büyük | `0 0 1` |
| `X = 0` | sadece eşit | `0 1 0` |
| `X ≥ 0` | eşit **veya** büyük | `0 1 1` |
| `X < 0` | sadece küçük | `1 0 0` |
| `X ≠ 0` | küçük **veya** büyük | `1 0 1` |
| `X ≤ 0` | küçük **veya** eşit | `1 1 0` |
| `Never` | hiçbiri | `0 0 0` |
| `Always` | hepsi | `1 1 1` |

Üç şeyin alt kümeleri: 2³ = **8**. Tablodaki sekiz satır bu. Bir tane fazla, bir
tane eksik değil.

> 🔑 `≥` diye bir karşılaştırma kurmuyorsun. "Eşit"e ve "büyük"e ayrı ayrı izin
> veriyorsun, ikisi de geçerli sayılıyor. **Operatör, izinlerin toplamından
> doğuyor.**

---

## Neden Her Şey Sıfıra Göre?

Tabloya bir daha bak. Her satır sıfıra göre yazılmış: `X > 0`, `X = 0`, `X < 0`.
"X, Y'den büyük mü" diye bir satır yok. Neden?

Çünkü karşılaştırma zaten **çıkarmadır**.

```
a ile b'yi karşılaştırmak   =   X = a − b hesaplamak
                                sonra X'in sıfıra göre yerine bakmak

a = b   →   a − b = 0      →   X = 0
a < b   →   a − b negatif  →   X < 0
a > b   →   a − b pozitif  →   X > 0
```

Yani bu seviye [ALU](./14_alu.md)'dan bağımsız değil. Dün kurduğun ALU çıkarmayı
yapıyor, bu seviye sonucu **okuyor**. İkisi birleşince "a, b'den küçük mü"
sorusu cevaplanabiliyor — ve iki ayrı devreye gerek kalmıyor.

Gerçek işlemcide bunun adı var. x86'da `cmp a, b` komutu tam olarak `a − b`
yapar ve **sonucu atar** — sadece bayrakları tutar. Ardından gelen `jl` / `je` /
`jg` / `jge` / `jne` komutları da tam olarak burada kuracağın devrenin işini
yapar. Yazılım tarafını
[10_bayraklar_ve_cmp.md](../x86_assembly/10_bayraklar_ve_cmp.md)'de görmüştün;
işte donanım tarafı.

---

## Kutuda Olmayan Parça

Üç sonucu tespit etmen lazım. Kutuya bakalım:

```
is zero   →  X = 0 mı?        ✅ hazır
is neg    →  X < 0 mı?        ✅ hazır
   ?      →  X > 0 mı?        ❌ YOK
```

İki tanesi verilmiş, üçüncüsü verilmemiş. Ama üçüncüsü de aslında elinde —
çünkü üç sonuç **birbirini dışlıyor**.

> Bir sayı negatif değilse ve sıfır değilse, geriye ne kalıyor?

Bunu cevaplayınca üçüncü parçayı iki mevcut parçadan imal edebilirsin. Önce onu
kur; izinler sonra.

---

## Birinci Deneme ve Neden Tutmadı

Şartı doğru kurduğunu varsayalım:

> `X > 0`  ⟺  *sıfır **değil*** **VE** *negatif **değil***

Bu tam olarak doğru, gerekçesi de doğru: üç sonuç birbirini dışlıyor, ikisini
eleyince üçüncüsü kalıyor. Ve evet, "iki şart aynı anda" = **AND**.

Buraya kadar geldiysen, şu çok makul görünür: `and` kutuda var ama `nand` da
var, ve `nand` + `inv` = `and`. İki parçanın çıkışını `nand`'a ver, sonucu `inv`
ile çevir.

Kuruldu. Ama çalışmıyor. Neden?

### Dur, üç satırı yazalım

Önce şunu ayır:

```
verilen:             is zero        ve   is neg
şartın söylediği:    is zero DEĞİL  ve   is neg DEĞİL
```

"Değil"ler kayıp. Üç durumu yürütelim:

| X | `is zero` | `is neg` | `nand` | `inv(nand)` = and | istenen |
|---|---|---|---|---|---|
| `X > 0` | `0` | `0` | `1` | `0` | **1** |
| `X = 0` | `1` | `0` | `1` | `0` | `0` |
| `X < 0` | `0` | `1` | `1` | `0` | `0` |

`nand` sütunu üç satırda da `1`. Ters çevirince üçü de `0`. Yani devre ya **hep
1** ya **hep 0** diyor — hiçbir şey ayırt etmiyor.

Sebebi şu: `is zero` ile `is neg` **asla aynı anda 1 olamaz.** Bir sayı hem sıfır
hem negatif olamaz. `and` kapısına birbirini dışlayan iki şey verirsen çıkış
sonsuza kadar `0` kalır.

> ⚠️ Burada öğrenilecek şey kapı seçimi değil. **Mantık doğru, bağlantı yanlış**
> olabiliyor — ve ikisi dışarıdan aynı görünüyor. Devre kurulmuş, teller bağlı,
> ekran bir sayı gösteriyor. Yanlış olduğunu ancak üç satırı yazınca görüyorsun.

---

## Değili Girişe Taşımak

Şart iki "değil" içeriyor. `inv` çıkışa kondu. Peki "değil"ler nerede duruyor
cümlede?

```
(sıfır DEĞİL)  ve  (negatif DEĞİL)
      ↑                   ↑
   burada              burada
```

Parantezlerin **içinde**. Yani `inv` kapılarının yeri de orası — birleştirmeden
**önce**.

> 🔑 `13`'te seçiciyi çıkıştan alıp girişe taşımıştık. Burada aynı hareket:
> **değili girişe taşı.**

Her iki parçanın çıkışına birer `inv`, sonra ikisi `and`'e. Üç satırı tekrar
yürüt — bu sefer tutuyor. Üç parça: `inv`, `inv`, `and`.

### Ama aynı işi iki parçayla yapabilirsin

Şartı Türkçe kur. İki ayrı olumsuzlama olarak değil, **tek cümle** olarak:

> *"X ne sıfır, ne de negatif."*

Bu cümlede kaç tane "değil" var? Bir tane — ve o "değil" **cümlenin tamamını**
olumsuzluyor.

Öyleyse iki soru:

**①** "X sıfır **ya da** negatif" — bu bir devre olarak hangi kapı?
**②** O kapının çıkışına ne yaparsan "ne sıfır ne negatif" olur?

```
is zero  ─┐
          ├─ or ──► "X sıfır YA DA negatif"  (X ≤ 0)  ──► inv ──► X > 0
is neg   ─┘
```

İki parça, üç değil.

Bu bir tasarruf numarası değil, bir **kural**. Adı **De Morgan** ve `02`'de
görmüştün:

```
(A değil) VE (B değil)   ≡   (A VEYA B) değil
```

İkisi aynı devre. Hangisini kuracağın elindeki parçalara bağlı — ama ikisinin
**aynı şey olduğunu bilmek** şart. Çünkü kod okurken `!a && !b` ile `!(a || b)`
karşına ikisi de çıkacak, ve aynı olduklarını göremezsen aynı mantığı iki farklı
şey sanırsın.

> ⚠️ Tuzağı da not et: `!(a || b)` ile `!a || !b` **aynı değil.** De Morgan'da
> kapı da değişir — `and` ↔ `or`. Yalnız "değil"leri dağıtıp kapıyı aynı
> bırakmak, yazılımdaki en sessiz mantık hatalarından biri.
> Kataloğundaki karşılığı: [CWE-480](../cwe/cwe_480.md) — yanlış işleç.

---

## xor Neden Çalışır ve Neden Yazılmaz

Burada güzel bir tuzak var, ve dile takılıyor.

"X ne sıfır ne negatif" şartını düşünürken insanın aklına şu gelebilir: *"bize en
az biri gelmiş olsun ama ikisi birden olmasın diyen biri lazım."*

İlk yarısı doğru — "en az biri" = `or`. İkinci yarısı ise bir şart değil, zaten
**imkânsız**. Bir sayı aynı anda hem sıfır hem negatif olamaz. Yani "ikisi birden
olmasın" senin koyman gereken bir kural değil, `X`'in doğası hakkında bir
**gerçek**.

Ama "en az biri ama ikisi birden değil" dediğin şeyin de bir adı var: `xor`. Ve
kutuda o da duruyor. Denersen — **çalışır**:

| X | `is zero` | `is neg` | `or` | `xor` |
|---|---|---|---|---|
| `X > 0` | `0` | `0` | `0` | `0` |
| `X = 0` | `1` | `0` | `1` | `1` |
| `X < 0` | `0` | `1` | `1` | `1` |

İki sütun birebir aynı. Çünkü `or` ile `xor` sadece **ikisi de 1 olduğunda**
ayrışır — ve o satır bu devrede hiç oluşmuyor.

> 🔑 `xor` burada **doğru cevabı yanlış sebeple** verir. "En az biri" demek
> istiyorsan `or` yaz. Devrenin doğru çalışması yetmez; **niyetini söylemesi**
> gerekir.

Bu, ileride sık göreceğin bir kalıp: bir devre ya da kod parçası, arkada duran
bir **varsayım** sayesinde çalışır. Varsayım tutarken kimse fark etmez. Varsayım
bir gün bozulursa — mesela bu iki sinyal başka bir yerden beslenmeye başlarsa —
`or` sürümü aynı kalır, `xor` sürümü sessizce başka bir şey yapmaya başlar.

Hata o gün doğmaz. Hata, `xor` yazıldığı gün doğar; sadece yıllar sonra ortaya
çıkar.

---

## Tuzak: Doğru Parça, Yanlış Tel

`is zero` ve `is neg`'i koydun, `or` ve `inv`'i kurdun, yapı doğru. Ama bir yerde
şu olabilir: bu iki parçanın girişleri `X` yerine `eq` ve `gt` bayraklarına
bağlanır.

Görünürde her şey yolundadır. Devre çalışır, ekran bir değer gösterir, hatta
çıkış `1` verir.

Ama iki parçanın işi **`X`'i incelemek**. "Sayı sıfır mı", "sayı negatif mi" diye
soruyorlar. Onlara bayrak verirsen, *izinleri* incelerler — *sayıyı* değil.

### Tel bunu söylüyordu

`is zero`'nun giriş bacağının yanında küçük bir **`16`** yazar. `is neg`'de de
öyle. O bacaklar 16 bit bekliyor. `eq` ve `gt` ise **1 bit**.

### Ama NandGame itiraz etmedi

Bağlantıyı kabul etti. Neden? Çünkü 1 bitlik `1`'i sessizce 16 bitlik
`0000000000000001`'e **genişletti**.

Sayı olarak yanlış değil. **Anlam olarak tamamen yanlış** — devre "eq bayrağı
sıfır mı" diye sordu, oysa sorması gereken "X sıfır mı".

> 🔑 `13`'teki bundler bölümünün açtığı soru tam olarak buydu: *dar bir değeri
> geniş bir yere koyarsan ne olur?* İşte oldu. Genişletme sessizce yapıldı, hata
> mesajı çıkmadı, sayı da geçerli göründü. Yakalamanın tek yolu **ne bağladığına
> bakmak**.
>
> 👾 Bu sessizliğin yazılımdaki karşılığı: [CWE-194](../cwe/cwe_194.md) (işaret
> uzatması) ve [CWE-197](../cwe/cwe_197.md) (kırpma). İkisinin de ortak yanı
> şudur: dönüşüm **başarılı** olur. Uyarı yoktur, istisna yoktur, sonuç geçerli
> bir sayıdır. Yanlış olan şey sayı değil, **anlamıdır**.

---

## Vana Olarak and

Şimdi asıl iş. Elinde üç tespit var ve bunlar **X hakkında**. Her an tam olarak
biri `1`:

```
is neg        →  X < 0
is zero       →  X = 0
or + inv      →  X > 0
```

Karşısında üç izin var ve bunlar **X hakkında değil** — senin neyi kabul ettiğin
hakkında:

```
lt · eq · gt
```

Eşleşme apaçık:

| izin | hangi tespiti serbest bırakıyor |
|---|---|
| `lt` | `X < 0` |
| `eq` | `X = 0` |
| `gt` | `X > 0` |

Tek bir çifti ele al — `lt` ile `X < 0`. Çıkışın `1` olması için **ikisinin de**
doğru olması lazım: izin verilmiş olmalı **ve** sayı gerçekten negatif olmalı.

Bu cümleyi kuran kapı `and`. Ama burada `and`'in işi hesap yapmak değil:

```
izin = 0   →   and hiçbir şey geçirmez, o dal ölü
izin = 1   →   and tespiti aynen geçirir
```

Bir **vana**. Açıksa akıtır, kapalıysa tutar. Kendi başına bir şeye karar vermez.

> 🔑 `11`'de seçiciyi kurmuştun ve o **soruyordu**: "hangisini vereyim?" Vana
> hiçbir şey sormaz. Yanındakilerden habersizdir, sadece kendi iznine bakar.
>
> Seçici merkezî bir karardır — tek yerden, her şeyi bilerek. Vana dağıtık bir
> karardır: üç ayrı yerde, üç ayrı izin, birbirinden habersiz.

Kutuda seçici olmamasının sebebi bu. Bu seviye seçicinin **alternatifini**
öğretmek için tasarlanmış.

---

## Üç Şeyi Çift Bacakla Birleştirmek

Üç dalı kurduğunda elinde üç sonuç olacak:

```
and(lt, X<0)   ·   and(eq, X=0)   ·   and(gt, X>0)
```

Bunlardan **herhangi biri** `1` ise çıkış `1`. Üçü birden tutmak zorunda değil —
zaten olamaz, `X < 0` ise diğer ikisi yanlıştır.

Kapı belli: `or`. Tek engel şu — kutudaki `or`'un **iki** bacağı var, üç tane
şeyin var.

Cevabı `06`'da vermiştin. Üç biti toplarken de aynı sorun çıkmıştı ve çözüm
**zincirlemekti**: ikisini birleştir, sonucu üçüncüyle birleştir.

```
and(lt,·) ─┐
           ├─ or ─┐
and(eq,·) ─┘      ├─ or ──► çıkış
and(gt,·) ────────┘
```

İki `or`, üç giriş. Aynı numara dört, beş, yirmi giriş için de çalışır — her yeni
giriş bir kapı ekler.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **1 × `is zero`**, **1 × `is neg`**, **1 × `inv`**,
**3 × `and`**, **3 × `or`**. Toplam dokuz parça.

Sırayla:

1. `is zero` ve `is neg`'i koy, **ikisinin de girişini `X`'e** bağla.
2. `X > 0` parçasını imal et: ikisinin çıkışı bir `or`'a, `or`'un çıkışı bir
   `inv`'e. Test et: `X=5` → `1`, `X=0` → `0`, `X=−3` → `0`.
3. Üç vanayı kur: `and(lt, is neg)`, `and(eq, is zero)`, `and(gt, inv çıkışı)`.
4. Üç vanayı iki `or` ile zincirle, çıkışı `Output`'a ver.

### Fan-out'u unutma

`is zero` ve `is neg`'i **ikişer kez koyma**. Her birinin çıkışı iki yere birden
gidiyor:

```
              ┌──►  or   (X > 0 hesabı için)
is neg(X) ────┤
              └──►  and  (lt dalı için)
```

`11`'de öğrendiğin fan-out. Bir çıkış, istediğin kadar girişi besler. İkinci
kopya kurarsan devre yine çalışır ama bütçe şişer — bu seviyede hedef 50 nand ve
bu iki parça ucuz değil.

### Testi nasıl seçersin

İki uç satır bütün devreyi sınar:

| `lt` `eq` `gt` | `X` | beklenen |
|---|---|---|
| `0` `0` `0` | `5`, `0`, `−3` | hep **`0`** (Never) |
| `1` `1` `1` | `5`, `0`, `−3` | hep **`1`** (Always) |

Bu ikisi tutuyorsa aradaki altı satır da tutar — çünkü aradakiler zaten bu
ikisinin parçaları. `Never` bütün vanaların kapandığını, `Always` hepsinin
açıldığını kanıtlar.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
is zero:  giriş ← X
is neg:   giriş ← X

or1:  a ← is zero    b ← is neg          (X ≤ 0)
inv:  giriş ← or1                        (X > 0)

and1: a ← lt   b ← is neg
and2: a ← eq   b ← is zero
and3: a ← gt   b ← inv

or2:  a ← and1  b ← and2
or3:  a ← or2   b ← and3   →  Output
```

`is zero` ve `is neg`'in çıkışları **ikişer yere** gidiyor: hem `or1`'e, hem
kendi vanasına.

</details>

---

## Tabloyu Hiç Kurmadın

Devre bitti. Şimdi geriye dön ve ne yaptığına bak.

Belgede sekiz satır vardı: `Never`, `X>0`, `X=0`, `X≥0`, `X<0`, `X≠0`, `X≤0`,
`Always`.

**Sen bunların hiçbirini devreye yazmadın.**

Üç vana kurdun, çıkışlarını birleştirdin. Sekiz satır kendiliğinden ortaya çıktı:

```
000  →  üç vana da kapalı         →  hiçbir şey geçmez        =  Never
111  →  üç vana da açık           →  hangisi doğruysa o geçer =  Always
011  →  eq ve gt açık, lt kapalı  →  X = 0 veya X > 0         =  X ≥ 0
```

`≥` diye bir kapı kurmadın. İki vanayı açtın, `≥` oradan **doğdu**.

Buna **beliren davranış** (*emergent behavior*) deniyor: parçaların hiçbirinde
yazmayan, ama bir araya gelince ortaya çıkan davranış. Sekiz satırlık tablo
devrenin hiçbir yerinde durmuyor; devrenin **sonucu**.

> 🔑 Bu, `14`'te konuştuğumuz meselenin öbür yüzü. Orada kontrol sözcüğü 5 bitti,
> belge 8 satır tarif ediyordu, ve aradaki fark **belgelenmemiş davranış**
> olarak duruyordu. Burada sekiz durumun hepsi belgeli — ama hiçbiri devrede
> yazılı değil.
>
> İkisi aynı gerçeğin iki yüzü: **bir devrenin yapabildikleri, tarif edilenlerle
> aynı şey değildir.** Bazen daha azını tarif edersin, bazen hiç tarif etmezsin;
> devre yine yapar.

Tersine mühendisliğin işi tam olarak bu boşlukta duruyor. Belgeye değil, devreye
bakmak.

---

## Kapanan Borç: OF

`10`'da bayrakları kurarken bir söz verilmişti: taşma bayrağı (OF) ileride
anlatılacaktı. Borç burada kapanıyor.

Kurduğun devrede `is neg` bir şeye bakıyor: sayının **işaret biti**, yani 16
bitlik değerin en soldaki biti. `1` ise negatif, `0` ise değil.

Bu `X` doğrudan bir değerse doğru çalışır. Peki `X` bir **çıkarmadan** geldiyse
ve o çıkarma **taştıysa**?

### İşaret biti yalan söyleyebilir

Okunabilir olsun diye 4 bitle bakalım (aralık: `−8` … `+7`):

```
  5 − (−4)  =  9        gerçek sonuç, pozitif
  
  4 bitte:   0101 − 1100
           = 0101 + 0100      (çıkarma = eksisini ekleme)
           = 1001

  1001  →  işaret biti 1  →  "negatif"
  1001  →  ikiye tümleyen olarak okunursa  −7
```

Gerçek sonuç `+9`, devrenin verdiği sonuç `−7`. `9`, 4 bitlik aralığa sığmıyor;
**taşma** oldu. Ve taştığı için işaret biti gerçeği söylemiyor.

Şimdi bunun anlamını düşün. `a − b` yapıp işaret bitine bakarak "a, b'den küçük
mü" diye karar veriyorsan, taşma olduğu anda **cevabın tersini** alırsın.

`5 > −4` olmasına rağmen devre "küçük" der.

### Doğrusu: N XOR OF

Gerçek işlemciler bu yüzden iki bayrağı birlikte kullanır:

```
işaretli "küçüktür"  =  N XOR OF

N  = sonucun işaret biti (negatif mi görünüyor)
OF = taşma oldu mu (işaret biti yalan söylüyor mu)
```

Taşma yoksa (`OF = 0`) sonuç `N`'in kendisidir. Taşma varsa (`OF = 1`) `N` ters
çevrilir — çünkü yalan söylediğini biliyoruz.

`5 − (−4)` örneğinde: `N = 1` (negatif görünüyor), `OF = 1` (taştı),
`1 XOR 1 = 0` → "küçük değil" → **doğru cevap.**

x86'da bu yüzden iki ayrı komut ailesi var:

| komut | kullandığı bayrak | ne zaman |
|---|---|---|
| `jl` / `jge` | `SF ≠ OF` | **işaretli** karşılaştırma |
| `jb` / `jae` | `CF` | **işaretsiz** karşılaştırma |

Aynı iki sayı, aynı çıkarma, **iki farklı doğru cevap** — hangisini istediğin
sayıları nasıl okuduğuna bağlı. `04`'ün ve
[CWE-681](../cwe/cwe_681.md)'in cümlesi burada da geçerli: desen aynı, anlam
okuyanın kararı.

> ⚠️ NandGame'in bu seviyesinde OF yok, çünkü `X` doğrudan sıfırla
> karşılaştırılıyor — arada bir çıkarma adımı olmadığı için işaret biti hep
> doğru. Ama gerçek bir işlemcide `cmp` bir çıkarmadır ve taşabilir. Bu yüzden
> "işaret bitine bak" tek başına **eksik bir karşılaştırmadır**:
> [CWE-1023](../cwe/cwe_1023.md).

### Sırada

**SR Latch** ile **Memory** bölümü açılıyor. Şimdiye kadar kurduğun her devre
girdisine anında cevap veriyordu; girdi değişince çıkış değişiyordu, hafıza
yoktu. Sırada bunun tersi var: **çıkışı kendine geri bağlamak** ve bir devrenin
bir şeyi *hatırlamasını* sağlamak.

---

## Özet — Aklında Tut

```
☐ lt / eq / gt = less than · equal · greater than. lt'deki ilk harf küçük L, büyük İ değil.
☐ Bu üç bit bir SAYI DEĞİL. "Hangi karşılaştırma" demiyorlar, "hangi sonuçlar başarı sayılsın" diyorlar.
☐ Karşılaştırmanın sonucu tam üç tanedir: küçük · eşit · büyük. Dördüncüsü yok (üçlem).
☐ 8 satır = üç sonucun alt kümeleri (2³). Never = boş küme, Always = hepsi.
☐ ≥ diye bir kapı kurmuyorsun: eq ve gt izinlerini birlikte açıyorsun, ≥ oradan doğuyor.
☐ Her şey sıfıra göre çünkü KARŞILAŞTIRMA ZATEN ÇIKARMADIR: a ? b → X = a − b → X'in sıfıra göre yeri.
☐ x86'da cmp a,b tam olarak a−b yapar ve SONUCU ATAR, sadece bayrakları tutar.
☐ Kutuda "is pos" yok: negatif DEĞİL ve sıfır DEĞİL → pozitif. Üç sonuç birbirini dışlar.
☐ ⚠️ Mantık doğru, bağlantı yanlış olabilir. is zero ile is neg'i and'e verirsen çıkış SONSUZA KADAR 0.
☐ Sebebi: birbirini dışlayan iki şey asla aynı anda 1 olmaz. and onları hiç birleştiremez.
☐ "Değil"ler cümlede parantezin İÇİNDE → inv de birleştirmeden ÖNCE gelir. Değili girişe taşı.
☐ De Morgan: (A değil) VE (B değil) ≡ (A VEYA B) değil. inv+inv+and = or+inv. Üç parça yerine iki.
☐ ⚠️ !(a || b) ile !a || !b AYNI DEĞİL — De Morgan'da kapı da değişir (and ↔ or).
☐ xor burada or ile aynı sonucu verir, çünkü "ikisi de 1" satırı hiç oluşmuyor.
☐ 🔑 Ama xor DOĞRU CEVABI YANLIŞ SEBEPLE verir. Devrenin çalışması yetmez, NİYETİNİ söylemesi gerekir.
☐ Varsayıma yaslanan devre, varsayım bozulduğu gün sessizce başka şey yapar. Hata o gün değil, yazıldığı gün doğar.
☐ ⚠️ is zero / is neg girişleri X'e bağlanır. Bayrağa bağlarsan NandGame itiraz ETMEZ — 1 biti 16 bite sessizce genişletir.
☐ 👾 Sayı geçerli, anlam yanlış. Yazılımdaki karşılığı CWE-194 / CWE-197: dönüşüm BAŞARILI olur, uyarı çıkmaz.
☐ and burada hesap yapmaz, VANA olur: izin 0 ise dal ölü, izin 1 ise tespit aynen geçer.
☐ 🔑 Seçici SORAR ("hangisini vereyim"), vana SORMAZ. Seçici merkezî karar, vana dağıtık karar.
☐ Üç şeyi iki bacaklı kapılarla birleştirmek = zincirleme (06'daki numara). Her yeni giriş bir kapı ekler.
☐ Fan-out: is zero ve is neg'in çıkışları İKİŞER yere gider. İkinci kopya kurma, bütçe şişer.
☐ Test: 000 (Never) ve 111 (Always) satırları bütün devreyi sınar — aradaki altısı bunların parçası.
☐ 🔑 Sekiz satırlık tabloyu HİÇ KURMADIN. Üç vana kurdun, sekiz satır kendiliğinden belirdi.
☐ Bir devrenin yapabildikleri, tarif edilenlerle aynı şey değildir. Belgeye değil devreye bak.
☐ OF borcu: is neg işaret bitine bakar. X bir çıkarmadan geldiyse ve TAŞTIYSA işaret biti YALAN söyler.
☐ 4 bitte 5 − (−4) = 9 sığmaz → 1001 → "−7" görünür. Gerçek sonuç pozitif, işaret biti negatif diyor.
☐ 🔑 İşaretli "küçüktür" = N XOR OF. Taşma yoksa N'in kendisi, taşma varsa N'in tersi.
☐ x86: jl/jge işaretli (SF≠OF), jb/jae işaretsiz (CF). Aynı çıkarma, iki farklı doğru cevap.
☐ 👾 Tek başına işaret bitine bakmak EKSİK bir karşılaştırmadır: CWE-1023.
```

---

## 🔗 İlgili Konular

- 👾 **Sessiz genişletme:** [CWE-194 — İşaret uzatması](../cwe/cwe_194.md) ve [CWE-197 — Kırpma](../cwe/cwe_197.md) — 1 bitlik bayrağı 16 bitlik bacağa bağladığında olan şey
- 👾 **Eksik karşılaştırma:** [CWE-1023](../cwe/cwe_1023.md) — bayrakların yarısına bakmak; OF'suz işaretli karşılaştırma
- 👾 **Yanlış işleç:** [CWE-480](../cwe/cwe_480.md) — De Morgan'ı yarım uygulamak, `&&` ile `||` karıştırmak
- 👾 **Anlam okuyanda:** [CWE-681](../cwe/cwe_681.md) — aynı bit deseninin işaretli/işaretsiz okunması
- 👾 **Taşmanın kendisi:** [CWE-190](../cwe/cwe_190.md) · [CWE-191](../cwe/cwe_191.md) — OF'un doğduğu yer
- [14_alu.md](./14_alu.md) — Bu devrenin okuduğu sonucu üreten parça
- [11_selector_switch.md](./11_selector_switch.md) — Seçici ve fan-out; bu dersin karşıt kutbu
- [10_bayraklar.md](./10_bayraklar.md) — Bayrakların kurulduğu yer; OF sözünün verildiği ders
- [09_subtraction.md](./09_subtraction.md) — Karşılaştırmanın altındaki çıkarma
- [06_full_adder.md](./06_full_adder.md) — Zincirleme numarası
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — De Morgan ve temel kapılar
- [../x86_assembly/10_bayraklar_ve_cmp.md](../x86_assembly/10_bayraklar_ve_cmp.md) — `cmp` ve bayraklar, yazılım tarafı
- [../x86_assembly/11_ziplamalar.md](../x86_assembly/11_ziplamalar.md) — `jl` / `jge` / `jb` / `jae`: bu devrenin komut karşılıkları

---

**Önceki konu:** [14_alu.md](./14_alu.md)
**Sonraki konu:** *(yolda — SR Latch)*
