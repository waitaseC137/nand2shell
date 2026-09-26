# 🧮 Şalterden Bilgisayara — D Latch: Hafızanın Kapıcısı

> Bu ders de bir öncekiler gibi yazıldı: karşında seni seyreden biri varmış gibi.
> Sana soru soruyor, sen kurarken bekliyor.
>
> Bu seviyede devre tek seferde çalıştı. Takılınan yerler devrede değil,
> kavramlardaydı: "0 gelince ortada veri yok" sanıldı, bir ayağı 1 olan `nand`'ın
> öbür ayağını dinlemediği sanıldı. İkisi de bu dersin en öğretici yerleri oldu,
> çünkü ikisi de bir önceki seviyeden taşınan küçük bir boşluğu gösterdi.
>
> Yanılgılar bu yüzden silinmedi.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Vizör ve Deklanşör](#vizör-ve-deklanşör)
- [Sıfır da Veridir](#sıfır-da-veridir)
- [Veri Nerede Duruyor?](#veri-nerede-duruyor)
- [Yeni Bir Hafıza Kurulmuyor](#yeni-bir-hafıza-kurulmuyor)
- [Çeviri Tablosu](#çeviri-tablosu)
- [Komut Neden Sıfır?](#komut-neden-sıfır)
- [Bir Ayağı 1 Olan Nand Dinler](#bir-ayağı-1-olan-nand-dinler)
- [Sütun Sütun](#sütun-sütun)
- [Neden Ters d?](#neden-ters-d)
- [Yasak Satır Artık Yok](#yasak-satır-artık-yok)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Kapı Açıkken](#kapı-açıkken)
- [Değişmeyen Tek Şey](#değişmeyen-tek-şey)

---

## Bu Parça Ne Yapıyor?

Memory bölümünün ikinci kapısındasın. Manzara şu:

```
girişler:   st · d   (1'er bit)
çıkış:      1 bit
kutu:       sr latch · nand · inv · and · or · xor · select
```

Kutuda yeni bir şey var: **`sr latch`.** Bir önceki derste iki `nand`'la kurduğun
devre artık tek bir parça olarak duruyor. [03.5](./03.5_soyutlama_merdiveni.md)'te
adını koyduğun hareket yine işte: kurduğun şeyi kapatıp üstüne çıkıyorsun.

Tablo:

| st | d | çıkış |
|---|---|---|
| 1 | 0 | 0 |
| 1 | 1 | 1 |
| 0 | 1 | **öncekiyle aynı** |
| 0 | 0 | **öncekiyle aynı** |

Bir de not var: *"`st` ilk kez 1 olmadan önce çıkış tanımsızdır, herhangi bir
değer olabilir."*

---

## Vizör ve Deklanşör

Tabloya bakmadan önce iki ismi yerine oturt, çünkü ilk soru buydu: *"`st` ve `d`
ne?"*

- **`d` = data (veri).** Saklanmak istenen bit. Sürekli değişebilir.
- **`st` = store (sakla).** "Şimdi `d`'de ne varsa al" diyen tetik.

Bir fotoğraf makinesi düşün. `d` vizörde gördüğün manzara, durmadan değişiyor.
`st` deklanşör. Basılıyken çıkış o anki manzarayı gösteriyor. Bıraktığında son
kare kalıyor, manzara ne kadar değişirse değişsin.

Tabloyu bu gözle tekrar oku:

```
st = 1   →   d ne ise çıkış o          (deklanşör basılı)
st = 0   →   d duyulmuyor, eski kare   (deklanşör bırakıldı)
```

SR Latch'ten farkı şurada: orada iki ayrı düğme vardı, "1 yap" ve "0 yap". Burada
tek bir veri teli ve tek bir "şimdi" düğmesi var.

---

## Sıfır da Veridir

Tablonun alt iki satırına ilk bakışta şu düşünce geliyor: *"`d` 0, `st` 0,
ortada veri yok. O zaman çıkış neyi tutuyor?"*

Bu cümlede iki ayrı şey birbirine karışıyor.

**Birincisi: 0 "veri yok" demek değil.** 0 da 1 kadar geçerli bir bit. "Bu
bölge korumalı mı? Hayır." cevabı bir bilgi. `st=0` iken hiçbir şey
saklanmamasının sebebi `d`'nin 0 olması değil, **`st`'nin 0 olması.** `d=1`
olsaydı da hiçbir şey saklanmazdı. Tabloda bunun kanıtı yan yana duruyor: `0 1`
ve `0 0` satırları aynı cevabı veriyor.

**İkincisi: "önceki" dışarıdan gelmiyor.** Çıkışın tuttuğu değer o an hiçbir
telden gelmiyor, SR Latch'in döngüsünün **içinde** dönüyor. Bir önceki derste
bunun adı konmuştu: bellek bir defter değil, sürekli devam eden bir hareket.

> *"Döngüye girmedik mi?"* Girdik, ama **iyi** döngüye. Döngüde çift sayıda ters
> çevirme var, yani kendini onaylıyor. Titreyen döngü tek sayılı olandı.

Döngüye hiç değer yazılmadıysa ne olacak? Tablonun altındaki not bunu önceden
söylüyor: ilk `st`'ye kadar çıkış serbest.

---

## Veri Nerede Duruyor?

Buradan daha derin bir soru çıkıyor: *"Veri dediğimiz şey `d`'den gelen 0 ve 1
mi, yoksa kapıların o anki durumu mu?"*

Memory'den önceki seviyelerde bu soruyu sormaya gerek yoktu. Sinyal hep tek yöne
akıyordu, kapıların durumu o anki girişlerden hesaplanıyordu. Girişi bilen, her
kapının durumunu da bilirdi. "Veri" ile "o an tellerde olan" aynı şeydi.

Geri besleme bunu bozdu. Artık aynı girişlerle (`st=0`) çıkış 0 da olabilir 1 de.
Hangisi olacağını geçmiş belirliyor, ve geçmiş başka hiçbir yerde değil,
**döngüdeki tellerin durumunda** saklanıyor.

Bu seviyede her telin rolü farklı:

| tel | rolü |
|---|---|
| `d` | **aday** — "saklanacak bu olabilir" |
| `st` | **karar** — "şimdi al" |
| `s`, `r` | **komut** — SR Latch'e ne yapacağını söyler |
| döngünün telleri | **asıl veri** — saklanan bit burada yaşıyor |

Buradaki en önemli satır üçüncüsü. `s` ve `r` hiçbir zaman veri değildi, bir
önceki seviyede de değildi. İkisi de **komuttu**: "1 yap", "0 yap", "dokunma".

> 🔑 Latch'in sakladığı şey şu anki `d` değil, **`st`'nin en son 1 olduğu
> andaki `d`.** O andan sonra `d` istediği kadar değişsin, döngü duymaz.

---

## Yeni Bir Hafıza Kurulmuyor

Peki `d` değişince döngü neden duymuyor?

Çünkü `d` döngüye **hiç doğrudan değmiyor.** Bu seviyede yeni bir hafıza
kurmuyorsun. Hafıza zaten var, SR Latch'in içinde. Bu seviyede kurduğun şey onun
önüne koyduğun bir **çevirmen:**

```
d, st  →  [ çevirmen ]  →  s, r  →  [ SR Latch döngüsü ]  →  çıkış
 aday      dil çevirisi     komut       asıl veri burada
```

SR Latch `st` ile `d`'nin dilini bilmiyor, yalnızca `s` ile `r`'yi anlıyor.
Çevirmenin işi `st` ile `d`'yi o dile çevirmek. `st=0` iken çevirmen `d` ne
olursa olsun "dokunma" komutu üretiyorsa `d`'nin sesi döngüye hiç ulaşmaz.

> 🔑 Her parça bir öncekinin mirasını taşır. D Latch'in kendine ait bir hafızası
> yok, SR Latch'inkini kullanıyor. Yeni olan yalnızca kapıcılık.

---

## Çeviri Tablosu

Çevirmeni kurmak demek şu tabloyu doldurmak demek. SR Latch'in kuralını
hatırla: **komut 0'dır, devre 1-1'de dinlenir.** `r` düşerse çıkış 1, `s`
düşerse çıkış 0.

| st | d | s | r | olması gereken |
|---|---|---|---|---|
| 0 | 0 | ? | ? | dokunma |
| 0 | 1 | ? | ? | dokunma |
| 1 | 0 | ? | ? | 0 yaz |
| 1 | 1 | ? | ? | 1 yaz |

Kendin doldur, sonra devam et.

İlk iki satır kolay: "dokunma" SR Latch'in dilinde `1 1`. Alt iki satır için
hangi telin düşeceğini bulman gerekiyor, ve ezberden gitmek yerine kutudaki
`sr latch`'in **`i`** düğmesine basıp kendi tablosuna bakmak en sağlamı.

```
0 yaz   →   s düşmeli   →   s=0  r=1
1 yaz   →   r düşmeli   →   s=1  r=0
```

| st | d | s | r |
|---|---|---|---|
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | **0** | 1 |
| 1 | 1 | 1 | **0** |

Üçüncü satırda şu soru geliyor: *"Reset'in orada bir etkisi yok, o zaman neden
1?"*

Çünkü bu dilde **1 "sustum" demek.** `r=1`, "reset hiçbir şey söylemiyor"
demek. Etkisiz olmanın değeri zaten 1. `r` de 0 olsaydı iki komut aynı anda
gelirdi, ve bu da SR Latch'in yasak `0 0` satırı olurdu.

---

## Komut Neden Sıfır?

Burada yolun ortasında durup sorulması gereken bir soru var: *"1 ve 0 SR Latch
için neden ters? Günlük hayatta 1 açık, 0 kapalı."*

Kimse "komut 0 olsun" diye keyfi bir karar vermedi. Sebep SR Latch'in **`nand`'dan
yapılmış olması.** `nand`'a bir girişi 0, bir girişi 1 olarak bak:

```
bir giriş 0   →   çıkış öbür girişe bakmadan 1        (emir)
bir giriş 1   →   çıkış öbür girişin tersi             (iletir)
```

Döngüyü zorlayabilen tek şey 0. 1 gelince `nand` hiçbir şeye karar vermiyor,
döngünün kendi değerini iletiyor. Bu yüzden `1 1` "dinlen", tek bir 0 ise
"komut".

> 🔑 `nand`'ın sözü geçen değeri 0. Onu yalnızca 0 ile zorlayabilirsin.

Aynı latch **`nor`** ile de kurulabilir. `nor`'un sözü geçen değeri 1, yani o
latch'te komut 1, dinlenme `0 0` olur. Mantık aynı, işaretler ters.

> 💡 SSD'lerde geçen **"NAND flash"** adı da buradan mı geliyor? Kısmen. İsim,
> bellek hücrelerinin zincir gibi **seri dizilmesinden** geliyor, çünkü bu
> dizilim `nand` kapısının transistör düzenine benziyor. Ama NAND flash, bu
> dersteki gibi `nand` kapılarından kurulmuş bir hafıza değil. İsimdeki "NAND"
> bir benzerlik, yapının kendisi değil.

---

## Bir Ayağı 1 Olan Nand Dinler

Bir önceki bölümü okurken şu yanılgı ortaya çıktı: *"Bir girişi 0 olan `nand`
öbür tarafa bakmıyorsa, bir girişi 1 olan `nand` da bakmaz."*

Bakar. `a=1` olan iki satırı yan yana koy:

| a | b | nand |
|---|---|---|
| 1 | 0 | **1** |
| 1 | 1 | **0** |

`a` iki satırda da aynı, ama çıkış değişiyor. Değiştiren yalnızca `b`. Çıkış tam
olarak `b`'nin tersi, yani bir `inv`.

Şimdi `a=0` olan satırlar:

| a | b | nand |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |

`b` değişiyor, çıkış değişmiyor. **Öbür tarafa bakmayan durum yalnızca bu.**

```
a = 0   →   nand b'yi DUYMAZ          (çıkış 1'e kilitli)
a = 1   →   nand b'yi TERS çevirip iletir   (inv)
```

Bir önceki derste de aynı şey vardı: `1 1`'de iki `nand` da `inv` gibi
davranıyor ve döngü kendini tutuyordu. Bu seviyede aynı özellik bir kez daha
işe yarayacak, bu sefer kapıcı olarak:

```
st = 0   →   d duyulmaz
st = 1   →   d (tersiyle) geçer
```

---

## Sütun Sütun

Çeviri tablosunu tek tek sütunlara ayır. Önce `r`:

| st | d | r |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | **0** |

> Girişleri `st` ve `d` olan hangi kapının tablosu bu?

0 yalnızca iki giriş de 1 iken çıkıyor. Bu, bir önceki bölümde yan yana koyduğun
tablonun ta kendisi: **`r = nand(st, d)`.**

Şimdi `s`. Yanına bir yardımcı sütun ekle:

| st | d | ters d | s |
|---|---|---|---|
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | **0** |
| 1 | 1 | 0 | 1 |

`s`'deki 0 `d=0` satırında çıkıyor. `st` ile **ters d**'yi giriş olarak alırsan
tablo yine `nand` oluyor: **`s = nand(st, inv(d))`.**

İki kapıyı da `st` besliyor. `st=0` iken ikisi de 1 veriyor, yani çeviri
tablosunun üst yarısı kendiliğinden çözülmüş oluyor.

---

## Neden Ters d?

Bu da gerçekten sorulan bir soru: *"`s` için neden ters d lazım?"*

Üç adımda:

1. `nand` yalnızca iki girişi de 1 iken 0 verir. Başka hiçbir durumda 0 vermez.
2. `s`'nin 0'a düşmesi gereken an, `d=0` olduğu an ("0 yaz").
3. O anda `d` 0 olduğu için `nand`'a `d`'yi doğrudan verirsen `nand` asla 0
   vermez. `d`'yi ters çevirince `d=0`, `nand`'ın gözünde 1 olur ve `nand`
   ateşlenir.

Kısacası `r` "d 1 mi?" diye soruyor, `s` "d 0 mı?" diye soruyor. İkinci soruyu
`nand`'ın anlayacağı dile çevirmek için `inv` gerekiyor.

---

## Yasak Satır Artık Yok

Bu bölümdeki fark devre kurulup seviye geçildikten sonra, dersi anlatmaya
çalışırken ortaya çıktı.

`inv` olmasaydı ne olurdu? İki `nand`'ın ikisine de `st` ve `d` giderdi:

```
st=1  d=1   →   s = nand(1,1) = 0   r = nand(1,1) = 0   →   0 0  ⚠️ yasak satır
st=1  d=0   →   s = nand(1,0) = 1   r = nand(1,0) = 1   →   1 1     hiçbir şey yazılmaz
```

Yani `inv` iki iş birden yapıyor: 0 yazmayı mümkün kılıyor, ve iki komutun aynı
anda gelmesini engelliyor.

İkincisini daha yakından gör. `d` ile `ters d` **asla aynı anda 1 olamaz.** Bu
yüzden `s` ile `r` asla aynı anda 0'a düşemez.

> 🔑 SR Latch'in yasak `0 0` satırı bu devrede **fiziksel olarak imkânsız.** İki
> komut tek bir veri telinden türediği için iki zıt emrin aynı anda gelmesi
> mümkün değil.

Bir önceki derste o satırın adı [CWE-1245](../cwe/cwe_1245.md) olarak konmuştu:
tanımlanmamış bir geçişi "kullanılmıyor" diye bırakıp kimsenin kullanmamasına
güvenmek. D Latch aynı soruna başka bir cevap veriyor: **tanımsız satırı
kullanmamayı rica etmek yerine, ona ulaşılamayan bir yapı kurmak.** Kuralı
kullanıcıya bırakmıyor, devrenin şekline gömüyor.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **1 × `sr latch`**, **2 × `nand`**, **1 × `inv`**.

1. `d`'yi `inv`'e bağla.
2. Birinci `nand`: bir ayağı `st`, öbür ayağı `inv`'in çıkışı. Çıkışı
   `sr latch`'in **`s`** ayağına.
3. İkinci `nand`: bir ayağı `st`, öbür ayağı `d`. Çıkışı `sr latch`'in **`r`**
   ayağına.
4. `sr latch`'in çıkışını `Output`'a bağla.

`r`'ye giden kapı ile `s`'ye giden kapıyı karıştırma. Karıştırırsan çıkış hep
`d`'nin tersini tutar.

### Hafızayı nasıl test edersin

Bir önceki dersteki gibi tek tek satırlara bakmak yetmez, **sıra** gerekiyor:

| adım | `st` `d` | beklenen | ne sınanıyor |
|---|---|---|---|
| 1 | `1` `1` | `1` | 1 yazılıyor mu |
| 2 | `0` `1` | **`1`** | tutuyor mu |
| 3 | `0` `0` | **`1`** | `d` değişti, duymadı mı |
| 4 | `1` `0` | `0` | 0 yazılıyor mu |
| 5 | `0` `1` | **`0`** | `d` değişti, duymadı mı |

Adım 3 ile 5'e bak: `d` değişiyor, çıkış değişmiyor. Kapıcının kanıtı bu iki
satır.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
inv:       ← d
nand1:     a ← st    b ← inv çıkışı    →  sr latch.s
nand2:     a ← st    b ← d             →  sr latch.r
sr latch:  çıkış  →  Output
```

Toplam: 4 bileşen, 6 `nand` (`sr latch` içinde 2, `inv` içinde 1).

</details>

### Bir parça fazla

Bu devre seviyeyi geçiyor, ama NandGame şunu da söylüyor: *"daha az bileşenle
çözmek mümkün."*

Önce kendin dene. Bir ipucu var: **yeni bir parça eklemen gerekmiyor.** Kurduğun
devrede, `inv`'in yaptığı işi zaten yapan bir tel var.

Bu yol, ders ilk yazıldığında denenmemişti. Sonradan denendi ve çalıştı.

<details>
<summary>🔑 Cevap — inv'siz devre</summary>

Aranan tel **`r`**. `d` ile beslenen nand zaten doğal olarak ters d üretiyor, ama
yalnızca `st=1` iken:

```
st = 1   →   r = nand(1, d) = ters d        (bir ayağı 1 olan nand = inv)
st = 0   →   r = nand(0, d) = 1
```

Yani `s`'ye giden nand'ın öbür ayağına `inv` yerine `r`'yi verebilirsin:

```
nand2:     a ← st    b ← d               →  sr latch.r
nand1:     a ← st    b ← nand2 çıkışı    →  sr latch.s
sr latch:  çıkış  →  Output
```

Üç durumu da dolaş:

```
st=1 d=1  →  r = nand(1,1) = 0   s = nand(1,0) = 1   →  1 yaz  ✓
st=1 d=0  →  r = nand(1,0) = 1   s = nand(1,1) = 0   →  0 yaz  ✓
st=0      →  r = 1               s = nand(0,1) = 1   →  tut    ✓
```

`st=0` iken `r`'nin 1 olması sorun çıkarmıyor, çünkü `nand1`'in `st` ayağı 0 ve
bir ayağı 0 olan nand öbür ayağını dinlemiyor.

Toplam: 3 bileşen, 5 `nand`. Aynı tel iki iş yapıyor: `sr latch`'e komut,
`nand1`'e ters d.

</details>

---

## Kapı Açıkken

Kapıcı `st=0` iken işini kusursuz yapıyor. Ama `st=1` iken ne oluyor?

`st=1` olduğu sürece çıkış `d`'yi **anında izliyor.** `d` titrerse çıkış da
titriyor. Deklanşör basılı kaldığı sürece makine fotoğraf çekmiyor, canlı
görüntü veriyor. Bu tür latch'lere bu yüzden **şeffaf** (*transparent*) latch
deniyor: kapı açıkken içinden her şey geçiyor.

Tek başına masum bir özellik. Şimdi [13](./13_arithmetic_unit.md)'teki satırı
hatırla:

```
PC ← PC + 1
```

PC'yi bir D Latch'te tuttuğunu, çıkışını artırma devresine verdiğini, sonucu da
aynı latch'in `d`'sine geri bağladığını düşün. `st=1` yaptığın an:

```
PC = 5  →  d = 6  →  kapı açık, PC = 6  →  d = 7  →  PC = 7  →  ...
```

Kapı açık kaldığı sürece sayı **durmadan** artar. Kaç kez arttığını kapının ne
kadar açık kaldığı ve kapıların ne kadar hızlı olduğu belirler, yani yine bir
**yarış.** İstediğin şey tek bir adımdı.

> 🔑 Şeffaf latch "ne zaman" sorusuna kaba bir cevap veriyor: "kapı açık olduğu
> sürece." Bilgisayarın ihtiyacı daha keskin bir cevap: **"tam şu anda, bir kez."**

Bir sonraki seviye, **Data Flip-Flop**, o keskin anı kuruyor. Adı da oradan
geliyor: saat.

---

## Değişmeyen Tek Şey

Seviyenin notu: *"`st` ilk kez 1 olmadan önce çıkış tanımsızdır."*

D Latch yasak satırı ortadan kaldırdı, ama bu notu ortadan kaldıramadı. İçerideki SR
Latch hâlâ iki eşit kararlı durumdan birine rastgele uyanıyor. Çevirmen ancak bir
komut geldiğinde işe karışabilir, ve açılış anında henüz hiçbir komut gelmemiş
oluyor.

Bir önceki derste bunun adı konmuştu: [CWE-1271](../cwe/cwe_1271.md), açılışta
değeri belirlenmemiş güvenlik biti. D Latch onu çözmüyor. Çözüm hâlâ aynı:
güvenlikle ilgili her biti açılışta **bilinen** bir değere zorla. Burada bunun
anlamı, açılışta bir kez `st=1` yapıp bilinen bir `d` yazmak.

### Sırada

**Data Flip-Flop.** Şeffaf kapıyı tek bir ana indirmek.

---

## Özet — Aklında Tut

```
☐ Kutuda artık sr latch var: bir önceki dersin devresi kapatıldı, üstüne çıkıldı.
☐ d = data, saklanmak istenen bit (vizör). st = store, "şimdi al" (deklanşör).
☐ st=1 → çıkış d'yi alır. st=0 → d duyulmaz, önceki değer kalır.
☐ ⚠️ 0 "veri yok" demek DEĞİL. st=0'da bir şey saklanmamasının sebebi st, d değil.
☐ "Önceki değer" dışarıdan gelmez, SR Latch'in döngüsünde döner. İyi döngü: çift ters çevirme.
☐ 🔑 Memory'de VERİ, döngü tellerinin durumu. d aday, st karar, s/r KOMUT. s ve r hiç veri değildi.
☐ 🔑 Latch şu anki d'yi değil, st'nin EN SON 1 olduğu andaki d'yi saklar.
☐ D Latch yeni hafıza kurmaz. SR Latch'in önüne bir ÇEVİRMEN (kapıcı) koyar.
☐ SR Latch dilinde 1 = "sustum", 0 = "komut". Dinlenme 1-1.
☐ 🔑 Komutun 0 olmasının sebebi nand: sözü geçen değeri 0. nor ile kurulsa komut 1 olurdu.
☐ ⚠️ Bir ayağı 1 olan nand öbür ayağı DİNLER ve ters çevirir (inv). Dinlemeyen yalnızca ayağı 0 olan.
☐ Çeviri tablosunu SÜTUN SÜTUN oku: r = nand(st, d), s = nand(st, inv(d)).
☐ Ters d gerekir çünkü nand yalnızca 1-1'de 0 verir; s'nin d=0'da ateşlenmesi lazım.
☐ inv olmasa: st=1 d=1'de s ve r ikisi de 0 → yasak satır. inv iki iş yapar.
☐ 🔑 d ile ters d asla ikisi birden 1 olamaz → s ve r asla ikisi birden 0 olamaz → YASAK SATIR İMKÂNSIZ.
☐ 👾 CWE-1245'e cevap: tanımsız satırı "kullanma" diye rica etmek yerine ulaşılamaz kılmak.
☐ Çözüm: 4 bileşen, 6 nand. Daha azı: inv'i sil, nand1'e r'yi ver (st=1 iken r = ters d) → 3 bileşen, 5 nand.
☐ Hafıza testi bir SIRADIR: yaz → st=0 → d'yi değiştir → çıkış değişmemeli.
☐ st=1 iken çıkış d'yi ANINDA izler: ŞEFFAF latch. PC ← PC + 1 bununla kurulursa sayı durmadan artar.
☐ İhtiyaç "kapı açıkken" değil "tam şu anda, bir kez" → Data Flip-Flop ve saat.
☐ 👾 Açılışta hâlâ tanımsız: D Latch CWE-1271'i çözmez. Güvenlik bitini açılışta bilinen değere zorla.
```

---

## 🔗 İlgili Konular

- [16_sr_latch.md](./16_sr_latch.md) — Kapıcının arkasındaki hafıza; komut 0, dinlenme 1-1, ters çevirme sayısı
- 👾 **Bu dersin cevap verdiği CWE:** [CWE-1245 — Hatalı durum makinesi](../cwe/cwe_1245.md) — tanımsız satırı yapıyla ulaşılamaz kılmak
- 👾 **Çözülmeden kalan:** [CWE-1271](../cwe/cwe_1271.md) — açılışta değeri belirlenmemiş güvenlik biti
- 👾 **Kapı açıkken yarış:** [CWE-362 — Race Condition](../cwe/cwe_362.md) — şeffaf latch'le kurulan sayaç tek adım yerine yarışa girer
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — `PC ← PC + 1`: şeffaf latch'le neden kurulamayacağı
- [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md) — Kurduğun şeyi kapatıp üstüne çıkmak; SR Latch artık tek parça
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — `inv` = `nand`; bir ayağı 1 olan `nand`'ın neden `inv` gibi davrandığı

---

**Önceki konu:** [16_sr_latch.md](./16_sr_latch.md)
**Sonraki konu:** *(yolda — Data Flip-Flop)*
