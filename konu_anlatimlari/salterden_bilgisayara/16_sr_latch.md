# 🧮 Şalterden Bilgisayara — SR Latch: Kuyruğunu Tutan Devre

> Dersteki yanlış denemeler de uydurma değil, gerçekten bu sırayla yapıldı. Önce
> iki kapının dört ayağına da iki giriş verildi ve geri dönecek tele yer kalmadı.
> Sonra yapı doğru kuruldu ama kapılardan biri yanlış seçildi ve devre
> **titremeye** başladı. O titreme bu dersin en değerli yeri, çünkü bellek ile
> kararsızlık arasındaki farkı herhangi bir açıklamadan daha iyi gösterdi.
>
> Hatalar bu yüzden silinmedi.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [On Sekiz Seviyelik Sessiz Kural](#on-sekiz-seviyelik-sessiz-kural)
- [Geri Dönen Tel](#geri-dönen-tel)
- [Komut Sıfırdır](#komut-sıfırdır)
- [Set Göndermek Değildir](#set-göndermek-değildir)
- [Sıfır Gelince Kesin Konuşan Kapı](#sıfır-gelince-kesin-konuşan-kapı)
- [Birinci Deneme: Boş Ayak Kalmadı](#birinci-deneme-boş-ayak-kalmadı)
- [Devre Titriyor](#devre-titriyor)
- [Tersleri Say](#tersleri-say)
- [Neden Kimse Yanlış Demedi](#neden-kimse-yanlış-demedi)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Aynı Girdi, Farklı Cevap](#aynı-girdi-farklı-cevap)
- [Kullanılmayan Satır](#kullanılmayan-satır)
- [Kimse Seçmeden Uyanmak](#kimse-seçmeden-uyanmak)

---

## Bu Parça Ne Yapıyor?

Memory bölümünün ilk kapısındasın. Manzara şu:

```
girişler:   s · r   (1'er bit)
çıkış:      1 bit
kutu:       nand · and · or · inv · xor
```

Kutu tanıdık. Tablo da ilk bakışta tanıdık:

| s | r | çıkış |
|---|---|---|
| 1 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 1 | **önceki çıkış** |
| 0 | 0 | kullanılmıyor |

İlk iki satırda yeni bir şey yok. On sekiz seviyedir bu tür tablolar kuruyorsun.

Yeni olan **üçüncü satır.** Orada çıkışı bulmak için girişler yetmiyor. **Çıkışın
kendisini** de bilmen gerekiyor.

Bu tek satır, şimdiye kadar kurduğun her şeyden farklı bir devre istiyor.

---

## On Sekiz Seviyelik Sessiz Kural

Şimdiye kadar kurduğun her devrede bir kural vardı. Hiç söylenmedi, çünkü hep
geçerliydi:

> **Çıkış yalnızca o anki girişe bağlıdır.**

Girişleri söyle, çıkışı hesaplarım. Devrenin bir dakika önce ne yaptığı önemli
değil, geçmişi yok. Bu tür devrelere **birleşimsel** (*combinational*) deniyor.
Toplayıcı, ALU, Condition, hepsi böyleydi.

Bu kural bir eksikliği gizliyordu, ve onu görmek için
[13](./13_arithmetic_unit.md)'e dönmek yeterli. Orada şu satır geçmişti:

```
PC ← PC + 1
```

Artırma devresini kurdun, `+ 1` kısmı hazır. Peki **PC nerede duruyor?**

Hiçbir yerde. Öyle bir şey yok. ALU'ya `X` ve `Y`'yi hep elle girdin. Sonucu
okudun, sonra sonuç kayboldu.

> 🔑 Şu ana kadar kurduğun şey bir **hesap makinesi.** Bilgisayar ise kendi
> sonucunu saklayıp üstüne yeni bir hesap koyabilen şey. Aradaki farkın ilk
> parçası: **hatırlamak.**

Hatırlayan devrelere **ardışık** (*sequential*) deniyor. Bu bölümün bütün
seviyeleri o yeteneği kuruyor, ve hepsi bu seviyedeki tek fikrin üstüne
oturuyor.

---

## Geri Dönen Tel

Şimdiye kadar sinyal hep **tek yöne** aktı: girişten kapılara, kapılardan çıkışa.
Hiçbir tel geriye dönmedi.

Tablonun üçüncü satırı "çıkış, önceki çıkıştır" diyor. Elindeki kapılarla
önceki çıkışı devreye sokmanın tek yolu var: **çıkışı bir kapının girişine geri bağlamak.**

Buna **geri besleme** (*feedback*) deniyor. Ve bu fikir kulağa geldiğinden
tuhaftır.

Birleşimsel bir devreye "çıkış ne?" diye sorarsan tek bir cevabı vardır. Geri
beslemeli bir devrede bu sorunun **birden fazla cevabı** olabilir. Aynı girişlerle
devre hem 0'da hem 1'de durabilir, ve hangisinde olduğunu **geçmişi** belirler.

> 🔑 Bu tür hatırlamak mürekkeple yazmak gibi bir şey değil. Devre kendi
> kuyruğunu tutuyor: döngüdeki kapılar birbirini aynı değerde tutuyor. Orada
> dönüp duran bir şey yok, besleme sürdükçe ayakta duran bir **denge** var.
> Elektrik kesilirse denge çöker ve bit gider.

---

## Komut Sıfırdır

Kapı seçmeden önce tabloyu bir kez daha, bu sefer farklı bir soruyla oku.

İsimler şunu söylüyor: *"s=1 set eder, r=1 reset eder."* Ama iki giriş de `1`
olunca **hiçbir şey olmuyor**, devre sadece bekliyor.

> Devre o bekleme hâlindeyken (`1 1`) çıkışın 1 olması için hangi giriş
> değişmeli, ve neye? 0 olması için hangisi?

Cevap:

```
çıkış 1 olsun   →   r 0'a düşmeli
çıkış 0 olsun   →   s 0'a düşmeli
```

Aynı satırı iki şekilde okuyabilirsin:

| satır | ismin okuması | düşüşe göre okuma |
|---|---|---|
| `s=1 r=0 → 1` | "yalnız s kalkık → **set**" | "r düştü → 1" |
| `s=0 r=1 → 0` | "yalnız r kalkık → **reset**" | "s düştü → 0" |

İkisi de doğru. İsimler "hangisi 1'de kaldı?" diye soruyor. Devreyi kurmak için
ise ikinci okuma daha kullanışlı: devre **`1 1`'de dinleniyor**, ve bir şey
olması için bir girişin **0'a düşmesi** gerekiyor.

> 🔑 Bu devrede komut `1` değil, `0`. Elektronikte buna **aktif düşük**
> (*active low*) deniyor. İleride bir **veri sayfasında** (*datasheet*: üreticinin
> bir çip için yayımladığı teknik belge) sinyal adının üstünde bir çizgi görürsen
> (`S̄`, `R̄`) ya da adın sonunda `_n` / `#` görürsen (`RESET#`), anlamı bu: "bu
> sinyal 0 olduğunda iş yapar."

> ⚠️ **Bir veri sayfasına bakarken dikkat: isimler oyunla ters eşleşiyor.** Veri
> sayfalarındaki `nand` latch'te `S̄` düşünce `Q = 1` olur, yani "set". Oyunda
> çıkışı 1 yapan ise **`r`'nin** düşmesi. Oyundaki `r`, veri sayfasındaki `S̄`'nın
> işini yapıyor, `s` de `R̄`'nin. Sebep adlandırmada: oyun isimleri yukarıdaki
> tablonun ilk okumasıyla koymuş ("hangisi 1'de kaldı"), veri sayfası ikincisiyle
> ("hangisi düştü").
>
> Bu tuzağa ders yazıldıktan sonra da düşüldü: SR Latch'in sözleşmesi bir kez
> "s düşerse 1, r düşerse 0" diye ters söylendi. İsme güvenme, düşünce ne
> yaptığına bak.

---

## Set Göndermek Değildir

Burada akla şu soru gelebilir: *"Reset sıfırlıyorsa, set de değeri bir sonraki
devreye mi gönderiyor?"*

Hayır. **Set "saklanan biti 1 yap"**, **reset "saklanan biti 0 yap"** demek.
İkisinin de göndermeyle ilgisi yok.

Latch hiçbir şeyi itmiyor. Çıkış teli saklanan biti **sürekli gösteriyor**, tıpkı
açık ya da kapalı duran bir lamba gibi. Sonraki devre ne zaman bakarsa o anki
değeri görüyor.

Değerin *ne zaman* alınacağına karar vermek ayrı bir iş, bu devrenin işi değil.

---

## Sıfır Gelince Kesin Konuşan Kapı

Tabloyu okuduğuna göre kapıyı arayabilirsin. Bulduğun davranış şu:

```
bir giriş 0'a düşünce  →  devre öbür girişi dinlemeden bir değer dayatıyor
iki giriş de 1'ken     →  devre kararı başka bir yere bırakıyor
```

Soru da buna göre:

> Hangi kapı, girişlerinden biri **0** olunca öbür girişe bakmadan kesin bir
> cevap verir, ve girişi **1** olunca kararı öbür girişe bırakır?

Kutudaki beş kapıyı bu soruyla tek tek dene.

Bu dersin yazıldığı denemede cevap **`and`** oldu. Ve cevap doğruydu, çünkü
tarife `and` gerçekten uyuyor. Ama uyan tek kapı o değil:

| kapı | bir giriş 0 → | bir giriş 1 → |
|---|---|---|
| `and` | zorla **0** | öbür girişi **aynen** geçirir |
| `nand` | zorla **1** | öbür girişi **ters** geçirir |

Tarife ikisi de uyuyor. Aralarındaki fark, 0 gelince **hangi değeri**
dayattıkları.

Bunu bir önceki bölümde bulduğunla yan yana koy:

```
s düşünce  →  çıkış 0 olmalı   →  zorla 0 veren: and ✓
r düşünce  →  çıkış 1 olmalı   →  zorla 1 veren: ?
```

`and` işin yarısını kusursuz yapıyor. `s`'yi bir `and`'e verirsen, `s` düştüğü an
çıkış ne olursa olsun 0 olur.

Öbür yarı için `r` düştüğünde 1 dayatan bir kapı lazım, ve tablo onun `nand`
olduğunu söylüyor. Yani `and` + `nand`.

Bu mantıklı bir devre, her kapı kendi işine göre seçilmiş. Kur.

---

## Birinci Deneme: Boş Ayak Kalmadı

İlk kurulumda iki kapının da iki ayağı girişlere bağlandı:

```
and:   a ← r    b ← s
nand:  a ← r    b ← s
```

`1 1` satırında ne olduğuna bak:

```
and (1, 1)  = 1
nand(1, 1)  = 0
```

Her seferinde **aynı** cevap. Tablo bu satırda "**önceki** çıkış" istiyor, ama
devrede önceki çıkışı taşıyan bir tel yok. Olamaz da, çünkü dört ayağın dördü
de girişlere gitmiş. Geri beslemenin takılacağı **boş bir ayak** kalmamış.

Bir önceki bölümde bulduğun şey burada yol gösteriyor: her giriş **tek bir işe**
komuta ediyor.

```
s  →  "0 yap" komutu
r  →  "1 yap" komutu
```

Her girişin tek bir kapıya gitmesi yeterli. O zaman her kapının bir ayağı boşa
çıkıyor, ve boş ayaklar geri dönen telleri bekliyor.

Peki boş ayağa **hangi** tel gelmeli, kapının kendi çıkışı mı, öbür kapınınki mi?
Bunu da tablodan türetebilirsin:

- `Output` tek bir kapıdan çıkıyor, ama **iki** girişi de duyması gerekiyor: `s`
  düşünce 0, `r` düşünce 1.
- `s`'nin kapısı `r`'yi doğrudan görmüyor. `r`'den haberi, ancak `r`'nin kapısının
  çıkışı kendi boş ayağına gelirse olur. Öbür taraf için de aynısı geçerli.
- Kapı kendi çıkışını dinlerse öbür girişten hiç haber alamaz. İki kapı birbirinden
  kopuk iki ayrı döngü olur. Simülasyonda `and`'in çıkışı `r`'yi hiç duymadı,
  `nand` ise kendi kendini ters çevirip titredi.

Yani her kapı öbürünü dinlemeli: **çapraz bağlantı.** Bu bir ezber değil, "çıkış
iki girişi de duysun" ihtiyacının sonucu.

---

## Devre Titriyor

İkinci kurulum:

```
s              →  and.a
r              →  nand.b
and çıkışı     →  nand.a       ← geri besleme
nand çıkışı    →  and.b        ← geri besleme
```

İki kapı çapraz bağlanmış, birbirinin kuyruğunu tutuyor. Yapı tam olarak
istenen yapı.

Test et:

```
s=1  r=0   →   and = 1   ✓
s=0  r=1   →   and = 0   ✓
```

İki satır tutuyor. Bir giriş 0'a düşünce bir kapı cevabını dayatıyor, döngü de o
değerde duruyor.

Şimdi `s=1 r=1` yap ve ekrandaki iki sayıya dikkatle bak:

```
and'in çıkışı      →  1
nand'ın a ayağı    →  0      ← aynı tel!
```

Tek bir telin bir ucu 1, öbür ucu 0 gösteriyor. Gerçek bir telde bu olamaz.
Simülatör döngüyü dengeye getirememiş ve bir yerde durdurmuş. Gördüğün şey o anın
fotoğrafı.

Neden dengeye gelmediğini görmek için turu elle dolaş:

```
and = 1  →  nand(1, 1) = 0  →  and(1, 0) = 0
and = 0  →  nand(0, 1) = 1  →  and(1, 1) = 1
and = 1  →  ...                               sonsuza kadar
```

Hangi değerle başlarsan başla, bir tur sonra **tersine** dönmüş oluyorsun.
Devrenin durabileceği bir değer yok.

---

## Tersleri Say

Turda her kapının değere ne yaptığına bak:

```
and   (s = 1 iken)  →  değeri AYNEN geçiriyor
nand  (r = 1 iken)  →  değeri TERS çeviriyor
```

Turda **bir** ters çevirme var. Devre kendine *"benim değerim, benim değerimin
tersi"* diyor. Hiçbir bit bu cümleyi doğru yapamaz, ne 0 ne 1.

Peki kaç ters çevirme olursa devre *"benim değerim, benim değerim"* der?

Burada doğru cevap çoğu zaman **açıklamadan önce hissedilir**: iki `nand`. Bu his
doğru. Onu açıklamak için tek bir kural yetiyor:

```
(−) × (−) = (+)
```

`s=1 r=1` iken iki `nand`'ın da bir ayağında sabit `1` var. Bir ayağı 1 olan
`nand`, öbür ayağının tersini verir, yani bir `inv` gibi davranır.
[02](./02_nanddan_kapilar.md)'de `inv`'i `nand`'ın iki ayağına aynı teli vererek
kurmuştun. Bir ayağı `1`'e sabitlemek de aynı işi görüyor. Döngü aslında şuna
dönüşüyor:

```
   ┌──→ inv ──→ inv ──┐
   └──────────────────┘
```

Değer turun ilk yarısında ters dönüyor, ikinci yarısında geri dönüyor, ve
başladığı yere **aynı** değerle varıyor:

```
1  →  0  →  1   ✓ durur
0  →  1  →  0   ✓ durur
```

İki değerde de rahat duruyor. Hangisinde olduğuna, en son hangi girişin düştüğü
karar veriyor. **Hafıza bu.**

> 🔑 **Girişler dinlenirken (`1 1`) döngünün kaderini ters çevirme sayısı belirler.**
>
> **Çift** sayıda → döngü kendini onaylar → iki kararlı durum → **hafıza**
> **Tek** sayıda → döngü kendini yalanlar → hiç kararlı durum yok → **salınım**

Kutudaki koşul önemli. `and`'li devre de `1 0` ve `0 1` satırlarında kararlıydı
(yukarıdaki test), titreme yalnızca `1 1`'de çıktı. Bir giriş 0'a düşünce o kapı
öbür ayağını dinlemiyor, döngü kırılıyor, sayılacak bir tur kalmıyor. Sayma
kuralı ancak iki kapı da dinlerken, yani dinlenme satırında işliyor.

Çift sayı da tek başına yetmiyor. İki `and`'i çapraz bağlarsan döngüde hiç ters
çevirme olmaz, sıfır da çift sayıdır: döngü hafıza tutar. Ama `and` 0 gelince
yalnızca **0** dayatabiliyor. Hiçbir giriş bu devreye 1 yazdıramıyor, `s=1 r=0`'da
bile çıkış 0'da kalıyor. Sayı hafızanın olup olmayacağını söylüyor. Hangi
değerlerin yazılabileceğini ise
[yukarıda gördüğün](#sıfır-gelince-kesin-konuşan-kapı) şey, kapının 0 gelince
dayattığı değer belirliyor.

---

## Neden Kimse Yanlış Demedi

Devre titremeye başladığında "`and`'i `nand` yap" demek tek bir cümle tutardı.
Denmedi, ve bu bilinçli bir tercihti.

Sebebi şu: doğru devre sana **neyin** çalıştığını gösterir. Yanlış devre ise
**neden** çalıştığını gösterir.

İlk seferde iki `nand` kurulsaydı devre çalışırdı ve seviye geçilirdi. Ama "ters
çevirme sayısı" diye bir şeyin var olduğu hiç ortaya çıkmazdı. Bir telin iki
ucunun farklı değer gösterdiği o ekranı görmezdin. Hafıza ile salınımın aynı
yapıdan çıktığını, aralarında tek bir kapının farkı olduğunu öğrenmezdin.

`and` seçimi bir dikkatsizlik de değildi. Tarife uyuyordu, gerekçesi sağlamdı, ve
kendi işini, yani `s` düşünce 0 dayatmayı, kusursuz yapıyordu. Sorun kapının
kendisinde değil, **döngünün bütününde** çıktı. Bu tür bir sorunu kapılara tek
tek bakarak bulamazsın, döngüyü dolaşman gerekir.

> 🔑 Doğruyu bulmak için bazen hatayı düşünmek yetmez, **yaşamak** gerekir.
> Kapılara tek tek bakınca `and` hiçbir kuralı çiğnemiyordu. Hatayı görmek için
> turu dolaşmak gerekiyordu, ve turu dolaştıran şey titremenin kendisi oldu.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **2 × `nand`**. Başka bir şey yok.

1. Birinci `nand`: `a` ayağını `s`'ye bağla.
2. İkinci `nand`: `b` ayağını `r`'ye bağla.
3. Çapraz bağla: birincinin çıkışı ikincinin boş ayağına, ikincinin çıkışı
   birincinin boş ayağına.
4. `Output`'u bağla. Ama hangi kapıya?

### Output nereye?

`and`'li devrede `Output` `s`'nin kapısına bağlıydı. İki `nand`'lı devrede bu
**değişiyor.** Hangi kapıya bağlayacağını ezberleme, test ederek bul: `s=1 r=0`
yap, hangi kapı `1` veriyor?

Sebebi de bir önceki bölümde: `nand` değeri ters geçiriyor. `s`'nin kapısı artık
saklanan bitin **tersini** tutuyor. İki kapı (`0 0` dışında) kararlı durumda birbirinin
zıddını taşıyor, ve gerçek latch'ler bu yüzden iki çıkış verir: `Q` ve `Q̄`.

Buradaki üst çizgi, [yukarıdaki](#komut-sıfırdır) `S̄`'daki çizgiyle aynı anlamda
değil. `S̄`'daki çizgi "0 olduğunda iş yapar" (aktif düşük) diyor, `Q̄`'daki ise
"`Q`'nun tersi". Veri sayfaları iki anlamı da aynı işaretle yazar, hangisi olduğunu
bağlamdan anlarsın.

### Hafızayı nasıl test edersin

Tek tek satırlara bakmak yetmez. Hafızayı sınamak için bir **sıra** gerekiyor:

| adım | `s` `r` | beklenen | ne sınanıyor |
|---|---|---|---|
| 1 | `1` `0` | `1` | set |
| 2 | `1` `1` | **`1`** | 1'i hatırlıyor mu |
| 3 | `0` `1` | `0` | reset |
| 4 | `1` `1` | **`0`** | 0'ı hatırlıyor mu |

Adım 2 ile adım 4'e bak: **girişler aynı, çıkışlar farklı.** Devrenin hafızası
olduğunun kanıtı bu iki satır.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
nand1:  a ← s              b ← nand2 çıkışı
nand2:  a ← nand1 çıkışı   b ← r              →  Output
```

`Output` `r`'nin kapısında. `nand1` ise (`0 0` dışında) bunun tersini tutuyor.

</details>

---

## Aynı Girdi, Farklı Cevap

Test tablosundaki adım 2 ile adım 4'ü bir kez daha düşün. Bu, bundan sonra
kurduğun her şeyi etkileyecek bir değişim.

On sekiz seviye boyunca yanlış bir devre **yanlış bir değer** verdi, ve hep aynı
yanlış değeri verdi. Girişi tekrar verdiğinde hatayı tekrar görürdün. Hata **yalnızca girişe**
bağlıydı.

Artık devrenin bir geçmişi var. Aynı giriş, aynı devre, **iki farklı sonuç**
verebiliyor. Hangisinin çıkacağı, oraya hangi sırayla gelindiğine bağlı.

> 🔑 Zaman devreye girdi. Zamanla birlikte yeni bir hata sınıfı da geldi:
> **sıraya bağlı hatalar.** Girişlere tek tek bakan bir test bunları bulamaz.
> Bulmak için sırayı sınaman gerekir.

Buradaki sıra testi yapanın elinde: aynı sırayı her verdiğinde aynı sonucu
alırsın. Sıranın **kimsenin elinde olmadığı**, iki sinyalin kendi aralarında
yarıştığı durum ise bir sonraki bölümde çıkıyor. Yarış koşulu orada.

---

## Kullanılmayan Satır

Tablonun son satırı `0 0` için "kullanılmıyor" diyor. Kullanılmıyor olması
devrenin o satırda bir şey yapmadığı anlamına gelmiyor. Kurduğun devrede ne
olduğuna bak:

```
nand1(s = 0, ·) = 1
nand2(·, r = 0) = 1
```

İki kapı da `1`. Birbirinin zıddını taşıması gereken iki çıkış **aynı** değeri
gösteriyor. Devre kendi kuralını bozmuş durumda.

Asıl sorun bu satırdan **çıkarken** başlıyor. İki giriş aynı anda `0`'dan `1`'e
dönerse, iki kapı da aynı anda `nand(1, 1)` hesaplar ve aynı anda `0`'a düşer.
Sonra ikisi de aynı anda `1`'e döner. Döngü titremeye başlar.

Bu, "çift sayı → hafıza" kuralıyla çelişmiyor. Kural döngünün **nerede
durabileceğini** söylüyor, oraya **nasıl varılacağını** söylemiyor. İki kararlı
durum hâlâ var, ama tam simetrik bir çıkışta devre ikisinden birini seçemiyor.

Gerçek bir çipte iki sinyal hiçbir zaman tam aynı anda gelmez. Hangisinin önce
kalktığı sonucu belirler, ve kazanan **son kalkan girişin komutu** olur:

```
önce s kalkar  →  r hâlâ 0, "1 yap" komutu sürüyor   →  çıkış 1
önce r kalkar  →  s hâlâ 0, "0 yap" komutu sürüyor   →  çıkış 0
```

Hangisinin önce kalkacağını **önceden bilemezsin.** Sonucu iki telin yarışı
belirler. (Fark çok küçükse devrenin karar vermesi de zaman alır.)

NandGame'de bunu kendin görebilirsin. `0 0`'dan `1 1`'e geçmek için iki anahtarı
**tek tek** çevirmen gerekiyor. Oyunda denendi:

| sıra | çıkış |
|---|---|
| önce `s`, sonra `r` | `1` |
| önce `r`, sonra `s` | `0` |

Sonucu, anahtarlara basma sıran belirliyor.

> 🔑 Belge bu satır için "kullanılmıyor" diyor, devre ise yine bir şey yapıyor.
> Bu, [15](./15_condition.md)'teki fikrin karanlık yüzü: **bir devrenin
> yapabildikleri, tarif edilenlerle aynı şey değildir.** Kullanılmaması gereken
> bir durumun güvenli olması, onu gerçekten kimsenin kullanmamasına bağlı.
>
> 👾 Bu satırın zayıflık kataloğundaki adı
> [CWE-1245](../cwe/cwe_1245.md) — *Improper Finite State Machines (FSMs) in
> Hardware Logic*. Kurduğun latch iki durumlu bir **durum makinesi**: girişe ve o
> anki durumuna bakıp bir durumdan ötekine **geçen** bir devre. `0 0` satırı onun
> tanımlanmamış geçişi. MITRE'nin tarifi bu satıra uyuyor: *"undefined states
> (left as don't cares) … drive the system into an unstable state."* (*Don't
> care*, "umurumda değil" demek.) Bir farkla: MITRE'nin makinesi o durumdan ancak
> reset ile çıkıyor, latch ise bir sonraki geçerli komutla kurtuluyor.
> Tasarımcının umursamadığı satırı saldırgan umursar.
>
> Sırayı kimsenin seçmediği bu duruma **yarış koşulu** deniyor:
> [CWE-362](../cwe/cwe_362.md). `0 0`'dan çıkıştaki yarış, bu ailenin donanımdaki
> üyesi.
>
> Donanımda sinyallerin yarışmasından doğan zayıflığın adı
> [CWE-1298](../cwe/cwe_1298.md) — *Hardware Logic Contains Race Conditions*.
> İlk tohumu burada; sayfası, [17](./17_d_latch.md#neden-select-değil)'deki
> seçicili latch deneyiyle birlikte yazıldı.

---

## Kimse Seçmeden Uyanmak

Seviye açıklamasında bir cümle daha vardı: *"İlk set ya da reset sinyaline kadar
çıkış tanımsızdır."*

Neden tanımsız? Çünkü devrenin iki kararlı durumu var ve ikisi de eşit derecede
kararlı. Elektrik geldiği an iki kapı da bir yöne düşecek, ve hangi yöne
düşeceğini **hiçbir tasarım kararı seçmiyor.** Tellerdeki küçük farklar, sıcaklık,
üretimden kalan minik dengesizlikler seçiyor.

Masum bir detay gibi görünüyor, ama bir de şöyle düşün: bu bit bir **kilidi**
tutuyor olsun. "Hata ayıklama modu açık mı?", "Bu bellek bölgesi korumalı mı?"
gibi bir kilidi.

Çip her açıldığında o kilit rastgele bir değerle uyanırsa, bazı açılışlarda kapalı
olması gereken kapı **açık** başlar.

> 👾 Bunun zayıflık kataloğundaki adı
> [CWE-1271](../cwe/cwe_1271.md) — *Uninitialized Value on Reset for Registers
> Holding Security Settings*. MITRE'nin örneğinde saldırgan cihazı **tekrar tekrar
> resetliyor** ve kilidin açık uyandığı bir açılışa denk gelmeyi bekliyor. Çözüm
> basit ama unutulması kolay: güvenlikle ilgili her biti, reset sürerken, **bilinen**
> bir değere zorla. İlk yazmayı bekleme, tanımsız bırakma.
>
> Yazılımda karşılığı çok daha tanıdık: ilk değer verilmemiş bir değişkeni
> kullanmak. Bellekte ne kaldıysa onu okursun.

Latch "tanımsız" başladığında sorun yok, çünkü NandGame bunu açıkça kabul ediyor.
Bir güvenlik ayarı tanımsız başladığında ise kimse o ayarın ne olduğunu bilmiyor.

### Sırada

**D Latch.** SR Latch'in iki komutu var ve kötü bir satırı var. Bir sonraki
seviye bu ikisini tek bir veri teline ve bir "şimdi al" teline dönüştürüyor. O
kötü satır da böylece, girişler durulduğunda, hiç oluşamaz hâle geliyor.

---

## Özet — Aklında Tut

```
☐ Şimdiye kadarki her devre BİRLEŞİMSELDİ: çıkış yalnız o anki girişe bağlı, geçmiş yok.
☐ Hesap makinesi hesaplar, bilgisayar HATIRLAR. 13'teki PC ← PC + 1'in PC'si hiçbir yerde durmuyordu.
☐ Hatırlayan devre ARDIŞIKTIR. Tek yeni fikir: GERİ BESLEME, yani çıkışı bir kapının girişine geri bağlamak.
☐ Geri beslemeli devrede "çıkış ne?" sorusunun birden fazla cevabı olabilir. Hangisi olduğunu GEÇMİŞ belirler.
☐ 🔑 Kapılarla kurulan bellek bir defter değil, beslemeyle ayakta duran bir DENGE. Elektrik kesilince denge çöker, bit gider.
☐ Bu devrede komut 0'dır: devre 1-1'de dinlenir, bir giriş 0'a DÜŞÜNCE iş yapar (aktif düşük).
☐ r düşerse çıkış 1, s düşerse çıkış 0. İsimler "hangisi 1'de kaldı" der; ikisi aynı satırın iki okuması.
☐ ⚠️ Veri sayfasında S̄ düşünce Q = 1: oyundaki r, veri sayfasındaki S̄'nın işini yapar. İsme değil davranışa bak. Q̄'daki çizgi ise "tersi" demek.
☐ Set "gönder" değil, "biti 1 yap" demektir. Çıkış biti SÜREKLİ gösterir; ne zaman alınacağı ayrı bir iş.
☐ 0 gelince kesin konuşan iki kapı var: and zorla 0, nand zorla 1 verir. Farkları DAYATTIKLARI DEĞER.
☐ Her giriş tek kapıya gider → her kapının bir ayağı boşa çıkar → geri besleme o boş ayağa takılır.
☐ Boş ayağa ÖBÜR kapının çıkışı gelir (çapraz): çıkış iki girişi de duymalı. Kendi çıkışını dinleyen kapı öbür girişi hiç duymaz.
☐ ⚠️ and + nand çapraz: iki satır doğru, 1-1'de devre TİTRER. Aynı telin iki ucu farklı değer gösterir.
☐ 🔑 Girişler dinlenirken (1-1) belirleyen şey TERS ÇEVİRME SAYISI. Çift → kendini onaylar → HAFIZA. Tek → kendini yalanlar → SALINIM.
☐ ⚠️ Sayı hafızanın olup olmayacağını söyler, hangi değerin yazılacağını KAPININ TÜRÜ söyler: and+and çift ama 1 yazamaz.
☐ Bir ayağı 1 olan nand bir inv gibi davranır. İki nand'lı döngü = inv → inv = (−)×(−) = (+).
☐ Doğru devre NEYİN çalıştığını, yanlış devre NEDEN çalıştığını gösterir.
☐ and hiçbir kuralı çiğnemiyordu; sorun kapıda değil DÖNGÜNÜN BÜTÜNÜNDEYDİ. Döngü hataları tek tek kapıya bakarak bulunmaz.
☐ Çözüm: 2 nand, optimal. Output r'nin kapısında; s'nin kapısı tersini tutar (Q ve Q̄), 0-0 hariç.
☐ Hafıza testi bir SIRADIR: set → 1-1 → reset → 1-1. Aynı giriş (1-1), farklı çıkış. Kanıt bu.
☐ 🔑 Zaman devreye girdi: aynı girdi, aynı devre, iki farklı sonuç. Yeni hata sınıfı: SIRAYA BAĞLI hatalar.
☐ Testteki sırayı sen seçersin, sonuç hep aynı: bu yarış DEĞİL. Yarış, sırayı kimsenin seçmediği yerde: 0-0'dan çıkış.
☐ "Kullanılmıyor" satırı (0-0) yine bir şey yapar: iki çıkış da 1, kural bozuk.
☐ 0-0'dan 1-1'e çıkarken sonucu iki sinyalin YARIŞI belirler: SON kalkanın komutu kazanır (önce s → 1, önce r → 0; oyunda denendi).
☐ 👾 Sırayı kimsenin seçmediği durum: yarış koşulu, CWE-362. 0-0'dan çıkıştaki yarış onun donanımdaki üyesi.
☐ 👾 Latch iki durumlu bir DURUM MAKİNESİ; 0-0 onun tanımsız geçişi: CWE-1245 (MITRE'ninki reset ister, latch sonraki komutla kurtulur). Tasarımcının umursamadığı satırı saldırgan umursar.
☐ 👾 Donanımda sinyal yarışı: CWE-1298. Belge "kullanılmıyor" der, devre yine bir şey yapar.
☐ Açılışta latch tanımsız: iki kararlı durum eşit, hangisine düşeceğini HİÇBİR TASARIM KARARI seçmez, fizik seçer.
☐ 👾 O bit bir güvenlik kilidiyse bazı açılışlarda kapı açık başlar: CWE-1271. Güvenlik bitini reset sürerken bilinen değere zorla.
```

---

## 🔗 İlgili Konular

- 👾 **Yarışın kendisi:** [CWE-362 — Race Condition](../cwe/cwe_362.md) — aynı kaynağa senkronize olmadan uzanan iki iş
- 👾 **Donanımdaki yarış:** [CWE-1298](../cwe/cwe_1298.md) — `0 0`'dan çıkış burada tohumlandı, seçicili latch 17'de büyüttü
- 👾 **Bu dersin ana CWE'si:** [CWE-1245 — Hatalı durum makinesi](../cwe/cwe_1245.md) — "kullanılmıyor" diye bırakılan satır; D Latch'in neden var olduğu
- 👾 **Tanımsız uyanış:** [CWE-1271](../cwe/cwe_1271.md) — açılışta değeri belirlenmemiş güvenlik biti; tekrar tekrar reset saldırısı
- [15_condition.md](./15_condition.md) — Bir devrenin yapabildikleri ile tarif edilenler arasındaki fark
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — `PC ← PC + 1`: saklanacak yeri olmayan sayaç
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — `inv` = `nand`; burada aynı sonuca bir ayağı `1`'e sabitleyerek varılıyor

---

**Önceki konu:** [15_condition.md](./15_condition.md)
**Sonraki konu:** [17_d_latch.md](./17_d_latch.md)
