# 🧮 Şalterden Bilgisayara — Logic Unit: Emri Dinleyen İlk Devre

> Şimdiye kadar kurduğun her devrenin **tek bir işi** vardı. Toplayıcı toplar,
> çıkarıcı çıkarır. Onlara "şimdi başka bir şey yap" diyemezsin.
>
> İşlemci öyle değil. Bir an toplar, sonraki an AND'ler, ardından XOR'lar.
> Hangisini yapacağına **program** karar verir. Bu derste devrenin ilk kez
> **emir aldığı** yeri kuruyorsun.

> Yeni bir işlem öğrenmiyoruz; dört işlem toolbox'ta hazır duruyor. Bu derste
> öğreneceğin şey, **emre göre birini seçmek.**

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Emir Bir Sayıdır](#emir-bir-sayıdır)
- [Dördü de Hep Çalışır](#dördü-de-hep-çalışır)
- [Or Ne Yapacağını Nereden Biliyor?](#or-ne-yapacağını-nereden-biliyor)
- [Dört Seçenek, Üç Seçici](#dört-seçenek-üç-seçici)
- [Hangi Kol Hangi Tele?](#hangi-kol-hangi-tele)
- [Tuzak: Hangi Bacak?](#tuzak-hangi-bacak)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Anlam Kimde?](#anlam-kimde)

---

## Bu Parça Ne Yapıyor?

x86 serisinin [13. dersinde](../x86_assembly/13_bit_islemleri.md) şu komutları
yazmıştın:

```nasm
and eax, ebx
or  eax, ebx
xor eax, eax
```

Bunlara bir de bitleri ters çeviren `not eax`'i ekle. İşlemci `and eax, ebx`
satırına geldiğinde AND'i yapan devre, **bu derste kuracağın devre.**

O tek satırın baştan sona yolculuğu şöyle:

```
and eax, ebx
   │
   ①  assembler satırı bitlere çevirir            →  21 D8
   │
   ②  kontrol birimi bitleri okur, "AND" der      →  op1 = 0, op0 = 0
   │
   ③  eax ile ebx'in değerleri X ve Y tellerine gelir
   │
   ④  LOGIC UNIT: dört sonuç hazır, emir "AND",
   │  AND'in sonucu dışarı çıkar                     ← bu ders
   │
   ⑤  sonuç eax'a geri yazılır
```

`21 D8`, bu satırın gerçek x86 kodlaması (`nasm` ile derleyip bakıldı).
NandGame'in makinesi kendi bit düzenini kullanacak, ama iskelet aynı. ② kontrol
biriminde, ③ ile ⑤ bellek ünitesinde gelecek. Gerçek x86'da araya daha fazla
katman giriyor, ama iskelet bu.

> 🔑 Arkadaki soru şu: **assembly'de bir komut yazınca makinenin içinde nerede ne
> oluyor?** Bu ders o sorunun ilk cevabı: işlemin kendisinin yapıldığı yer.

---

## Emir Bir Sayıdır

Seviyenin dört girişi var:

```
X, Y        →   16'şar tel     üstünde çalışılacak sayılar     (veri)
op1, op0    →   birer tel      hangi işlem yapılacak           (kontrol)
```

`11`'deki ayrımın aynısı: veri teli hesaba girer, kontrol teli hesabı **seçer.**

Şimdi [04](./04_teller_sayi_olunca.md)'teki kuralı hatırla: `n` tel, `2ⁿ` farklı
desen verir. İki kontrol teli varsa `2² = 4` desen, yani 4 işlem. Demek ki op1 ile
op0 birlikte 0 ile 3 arasında bir **sayı** oluşturuyor, ve bu sayı bir **emir**:

| op1 | op0 | sayı | işlem |
|:-:|:-:|:-:|---|
| 0 | 0 | 0 | X and Y |
| 0 | 1 | 1 | X or Y |
| 1 | 0 | 2 | X xor Y |
| 1 | 1 | 3 | invert X |

Son satırda Y hiç kullanılmıyor. Ters çevirme tek sayı üstünde çalışır.

> ⚠️ "op = 1" gibi bir ifade iki türlü okunabilir: **op0 teli 1** mi, yoksa **iki
> telin oluşturduğu sayı 1** mi? Bu derste "op = sayı" dediğimizde hep ikincisini
> kastediyoruz: op = 1 demek op1 = 0, op0 = 1, yani **or**. Tek bir teli
> kastettiğimizde adını yazacağız.

---

## Dördü de Hep Çalışır

Bir deney yap. Tuvale sadece `and 16` koy, X'i ve Y'yi ona bağla. Emri **or**'a
ayarla (op1 = 0, op0 = 1). Sonra X'e ve Y'ye aynı sayıyı yaz, mesela hex `6553`.

`and 16` ne gösteriyor? **6553.** X AND X yine X eder. Emir "or" dediği hâlde AND
hesaplamaya devam ediyor.

Neden? `and 16`'ya bak: op1'den de op0'dan da ona **hiçbir tel gelmiyor.** Kutu
emrin varlığından habersiz. Ona sadece X ve Y geliyor, o da onları durmadan
AND'liyor.

> 💡 Deneyi X = Y = 0 ile yapsaydın ekranda 0 görürdün. Ama bu kutunun durduğunu
> göstermezdi, çünkü 0 AND 0 zaten 0 eder. Bir şeyin çalışıp çalışmadığını görmek
> için, çalışıyorsa **sıfırdan farklı** bir sonuç verecek bir giriş seç.

Dört işlemi de tuvale koyarsan dördü **aynı anda ve sürekli** hesaplar. `08`'deki
cümle burada da geçerli: bilgi kaybolmuyor, **kimse bakmıyor.** `11`'in sonunda
da söylemiştik: *hepsini yapar, birini seçer.*

Televizyon gibi düşün: bütün kanallar aynı anda yayında. Kumanda yayını
**başlatmaz**, hangisinin ekrana geleceğini **seçer.** Emir de bir kanal numarası.

> 🔑 Emir "şunu **yap**" demiyor, dördü zaten yapılmış durumda. Emir "bunlardan
> şunu **geçir**" diyor.
>
> ```
> yanlış resim :  emir gelir  →  o işlem yapılır
> doğru resim  :  dördü hep yapılır  →  emir gelir  →  biri geçirilir
> ```

> 💡 Gerçek işlemciler enerji kazanmak için o an kullanılmayan birimleri bazen
> kapatır. Ama tasarımın ana fikri bu: sonuçları hazır tutup seçmek, önce karar
> verip sonra hesaplamaya başlamaktan hızlıdır.

---

## Or Ne Yapacağını Nereden Biliyor?

Burada doğal bir soru çıkıyor: emri or'a vermiyorsak, **or ne yapacağını nereden
biliyor?**

Hiçbir yerden. **Bilmesine gerek yok, çünkü başka bir şey yapamaz.**

[02](./02_nanddan_kapilar.md)'de OR'u NAND'lardan kendin kurdun. `or 16` kutusunu
açsan içinde o devrenin 16 kopyasını bulursun. Kimse o devreye "OR yap" demiyor;
tellerin nasıl bağlandığı, çıkışın ne olacağını zaten belirliyor. O bağlantı başka
bir şey yapamaz.

> 🔑 Bilgisayarda hiçbir parça bir şey **bilmez.** Bir parçanın ne yaptığı,
> **nasıl bağlandığıdır.**

Emir bu yüzden **sadece seçim olan yerde** gerekiyor. or'un yapabileceği tek bir
şey var, ona sormaya gerek yok. Seçicinin ise iki seçeneği var; "hangisi?"
sorusunu birinin cevaplaması lazım. op telleri tam oraya bağlanır.

---

## Dört Seçenek, Üç Seçici

Toolbox'ta seçici var: `select 16`. `11`'de kurduğun Selector'ın 16 tel
genişliğindeki hâli:

```
        ┌───────────┐
  D1 ───┤           │
        │ select 16 ├─── çıkış
  D0 ───┤           │
        └─────┬─────┘
              s
```

| s | çıkışa geçen |
|:-:|:-:|
| 0 | D0 |
| 1 | D1 |

D1 ve D0 16'şar tel, **s ise tek tel.** Yani 16 seçici yan yana duruyor ve hepsi
aynı s ile dönüyor.

Sorun şu: seçicinin iki yolu var, bizim dört sonucumuz var.

Çözüm iki adımlı. İki seçici dört sonucu ikiye indirir, üçüncüsü de o ikisinden
birini seçer:

```
   and     or           xor    inv
    │      │             │      │
  ┌─┴──────┴─┐         ┌─┴──────┴─┐
  │    A     │         │    B     │
  └────┬─────┘         └────┬─────┘
       └─────────┐  ┌───────┘
               ┌─┴──┴─┐
               │  C   │
               └──┬───┘
                çıkış
```

`06`'daki katlara ayırma numarası: 4 seçenek, 2 × 2 oldu.

Bir apartman düşün: iki katlı, her katta iki daire. Alt katta and ile or, üst
katta xor ile inv oturuyor. Bir daireyi bulmak için adresin iki parçası yeter:
**kat** ve **kapı.**

---

## Hangi Kol Hangi Tele?

Üç seçicinin üç tane s bacağı var. Bunlara **kol** diyelim, seçiciyi çeviren şey
onlar. Elinde ise iki emir teli var. Hangi tel hangi kola gidecek?

Önce iki şeyi netleştirelim:

1. **Kolu boşta bırakamazsın.** Bağlanmamış bir giriş 0 sayılır (`08`'de boş
   bıraktığın B girişi gibi). Kolu boşta kalan seçici hep D0'da kalır.
2. **Emir devreye başka bir yerden giremez.** Dört işlem kutusunun emirden habersiz
   olduğunu gördük. Kollar, emrin devreye girebildiği tek yer.

Yöntem şu: **seçicinin ayırt etmesi gereken satırları alt alta koy. Değişen tel,
o seçicinin kolunun bağlanacağı teldir.**

**A: and mı, or mu?**

```
            op1   op0
X and Y  →   0     0
X or  Y  →   0     1
             ↑     ↑
           aynı  FARKLI
```

op1 iki satırda da 0, and ile or'u ayırt edemez. Değişen op0. **A'nın kolu op0.**

**B: xor mu, inv mi?**

```
            op1   op0
X xor Y  →   1     0
invert X →   1     1
```

Yine op0 değişiyor. **B'nin kolu da op0.** Bir tel iki kola birden gidebilir
(`11`'de gördüğün fan-out). op0 değişince A ile B aynı anda döner.

**C: A'nın grubu mu, B'nin grubu mu?**

```
            op1   op0
X and Y  →   0     0   ┐
X or  Y  →   0     1   ┘  A'nın grubu
X xor Y  →   1     0   ┐
invert X →   1     1   ┘  B'nin grubu
```

İki grubu birbirinden ayıran op1. **C'nin kolu op1.**

> 🔑 İki bitlik emir ikiye bölündü: **op1 grubu**, **op0 grubun içindeki işlemi**
> seçiyor. Onluk sayılarda da aynısı var: 23'te 2 hangi onlukta olduğunu, 3 o
> onluğun içinde hangisi olduğunu söyler.

---

## Tuzak: Hangi Bacak?

Kolları doğru bağlasan da devre çalışmayabilir. Bu seviyede en sık yapılan hata,
bir işlemi seçicinin **yanlış bacağına** takmak. Kural tek cümle:

> 🔑 **Kol 0 iken geçmesi gereken şey D0'a bağlanır.**

A'da deneyelim: A'nın kolu op0. op0 = 0 iken emir **and** oluyor. O zaman and
**D0**'a, or **D1**'e bağlanır. B ve C'yi aynı soruyla sen bul: *"kol 0 iken
hangisi geçmeli?"*

### Hatalı satırı okumak

Yanlış bağlarsan oyun sana hatalı satırı gösterir. Örneğin:

```
op1  op0    X      Y       çıktı    beklenen
 0    0     0    ffff   →  ffff        0       ✗
```

Bu satır sadece "yanlış" demiyor, ipucu da veriyor:

1. Emir 0 0, yani **and**. 0 AND ffff = 0 olmalıydı.
2. Gelen **ffff.** 0 ile ffff'ten ffff çıkaran işlemler: **or** ve **xor.**
3. Demek ki emir and iken or ya da xor geçiyor. Sorun kolların bağlandığı tellerde
   değil, işlemlerin takıldığı **bacaklarda.**

Sonra o satırı elle kur (op1 = 0, op0 = 0, X = 0, Y = ffff) ve yanlış değeri
**geriye doğru izle.** Her kutunun üstünde o anki çıkışı yazıyor. C'nin
çıkışında ne var, o değer C'nin hangi bacağından geliyor? O bacaktaki seçicinin
çıkışında ne var? Yanlış değerin ilk ortaya çıktığı seçici, hatanın olduğu yer.

> 💡 Hatalı bir test satırı, sonucu bilinen bir deneydir. "Ne bekleniyordu, ne
> geldi, hangi işlemler bunu verir?" diye sorarsan hatanın yeri çoğu zaman
> satırın kendisinden okunur.

---

## 🎮 Şimdi Sen Kur

**Görev:** NandGame → **Arithmetic Logic Unit → Logic Unit** seviyesi.

Elindekiler: `nand`, `select 16`, `inv 16`, `and 16`, `or 16`, `xor 16`.

- `inv 16`'nın tek girişi var, ona sadece **X** bağlanır.
- Kurduktan sonra "Dördü de Hep Çalışır" deneyini yap. Emir "or" iken `and 16`'nın
  hâlâ hesap yaptığını kendi gözünle gör.

Oyun 7 parçalı çözümü *"mümkün olan en basit çözüm"* diye onaylıyor.

<details>
<summary>🔒 Çözüm şeması — önce kendin dene, sonra aç</summary>

1. `and 16`, `or 16`, `xor 16`: girişleri **X** ve **Y**.
2. `inv 16`: girişi **X**.
3. `select 16` (A): D0 ← `and`, D1 ← `or`, s ← **op0**.
4. `select 16` (B): D0 ← `xor`, D1 ← `inv`, s ← **op0**.
5. `select 16` (C): D0 ← A'nın çıkışı, D1 ← B'nin çıkışı, s ← **op1** → **çıkışa**.

</details>

---

## Anlam Kimde?

Son bir soru: "op 00 = and" kuralını kim koydu?

Doğa değil. Seviyeyi tasarlayan biri öyle karar verdi. 00'a xor da denebilirdi;
o zaman devre başka türlü bağlanırdı, o kadar. Bu bir **sözleşme.**

Aslında her kat, bir alttakiyle böyle bir sözleşme yapıyor:

```
a & b             C, Python      derleyicinin sözleşmesi : "& demek and komutu demek"
and eax, ebx      assembly       assembler'ın sözleşmesi : "and demek şu bitler demek"
21 D8             makine kodu    tasarımcının sözleşmesi : "bu bitler şu seçicileri çevirir"
op1 = 0, op0 = 0  teller         buradan aşağısı fizik   : akım bağlantının izin verdiği yoldan geçer
```

Burada iki şeyi ayırmak gerekiyor:

- **Davranış bağlantıdan gelir.** or'un OR yapmasını hiçbir dil değiştiremez.
- **Anlam sözleşmeden gelir.** 16 teli bir sayı, 2 teli bir emir olarak okumak;
  "00 = and" demek. Bunlar bizim kararlarımız.

> 🔑 Parçalar ne yapacaklarını bağlantılarından biliyor. Anlamı biz veriyoruz, ama
> tek bir yerde değil, her katta bir sözleşmeyle. Üst seviye diller o
> sözleşmelerin en üst katı. [03.5](./03.5_soyutlama_merdiveni.md)'teki merdiven
> tam olarak bu.

### Sırada

**Arithmetic Unit** aynı fikri dört **aritmetik** işlemle kuruyor: X + Y, X − Y,
X + 1, X − 1. Ardından **ALU** bu iki birimi tek kutuda birleştirecek. Ünitenin
son seviyesi **Condition**'da da `10`'da söz verdiğimiz taşma bayrağı (OF)
gelecek.

---

## Özet — Aklında Tut

```
☐ Logic Unit, devrenin ilk kez EMİR aldığı yer. x86'daki and/or/xor/not'u işleten devre bu.
☐ op1 op0 = 2 tel = 2² = 4 desen = 0–3 arası bir SAYI. O sayı bir emir.
☐ "op = 1" → sayı 1 (op1 = 0, op0 = 1), tek tel değil. Hangisini kastettiğini söyle.
☐ Dört işlem kutusu emirden HABERSİZ; onlara op'tan tel gelmiyor. Dördü hep hesaplar.
☐ Emir "yap" demez, "geçir" der. Hepsi yapılır, biri seçilir (televizyon kanalları).
☐ Bir şeyin çalışıp çalışmadığını görmek için sıfırdan farklı sonuç verecek giriş seç.
☐ or ne yapacağını bilmez; bağlantısı onun ne yaptığıdır. Emir sadece SEÇİM olan yerde gerekir.
☐ select 16: s = 0 → D0, s = 1 → D1. D1/D0 16'şar tel, s tek tel.
☐ 4 seçenek = 2 × 2: iki seçici (A, B) + üstte bir seçici (C).
☐ Kolu bulmak: ayırt edilecek satırları alt alta koy, DEĞİŞEN tel koldur. A, B ← op0 · C ← op1.
☐ op1 grubu seçer, op0 grubun içinden seçer (23: onluk + birlik).
☐ ⚠️ Kol 0 iken geçmesi gereken şey D0'a bağlanır.
☐ Hatalı test satırı bir deneydir: beklenen ne, gelen ne, hangi işlem bunu verir → sonra geriye izle.
☐ Davranış bağlantıdan gelir, anlam sözleşmeden. Her kat bir sözleşme; üst seviye dil en üst kat.
```

---

## 🔗 İlgili Konular

- 👾 **Meraklısına:** [CWE Haritası — ALU ünitesi](../cwe/README.md#yolda--alu-ünitesi-ve-sonrası) — işleçleri karıştırmak: bit bit çalışan `&` yerine mantık işleci `&&` (CWE-480, yolda)
- [11_selector_switch.md](./11_selector_switch.md) — Seçicinin kendisi; "hepsini yapar, birini seçer"
- [06_full_adder.md](./06_full_adder.md) — Katlara ayırma numarası
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — `n` tel → `2ⁿ` desen
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — or kutusunun içindeki devre
- [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md) — Katlar ve sözleşmeler
- [../x86_assembly/13_bit_islemleri.md](../x86_assembly/13_bit_islemleri.md) — **Aynı işlemler, yazılım tarafından**

---

**Önceki konu:** [11_selector_switch.md](./11_selector_switch.md)
**Sonraki konu:** [13_arithmetic_unit.md](./13_arithmetic_unit.md)

*Bu ders, "Şalterden Bilgisayara" serisinin bir parçasıdır. Seri, [nandgame.com](https://nandgame.com) eşliğinde ilerler.*
