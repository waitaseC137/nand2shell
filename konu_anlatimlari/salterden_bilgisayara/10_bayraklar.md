# 🔗 Şalterden Bilgisayara — Bayraklar: Makinenin "Eğer" Demesi

> Bu seride bugüne kadar kurduğun her şey **hesapladı**: topladı, artırdı, çıkardı.
> Hepsi sayı alıp sayı verdi.
>
> Bu derste kuracağın iki devre sayı üretmiyor. **Soru soruyor** ve tek bitlik cevap
> veriyor: evet ya da hayır. İşlemcinin `eğer` diyebilmesi tam olarak buradan başlıyor.

> İki seviyeyi birlikte alıyoruz çünkü ikisi de aynı şeyi üretiyor: **bayrak.**
> Biri sıfırlığı, diğeri negatifliği bildiriyor. Bu iki tel, bilgisayarındaki her
> `if` ve her `while`'ın altında duruyor.

---

## 📋 İçindekiler

- [Hesaplamaktan Karar Vermeye](#hesaplamaktan-karar-vermeye)
- ["Hepsi Sıfır" Sorusunu Ters Çevir](#hepsi-sıfır-sorusunu-ters-çevir)
- [Ağaç mı, Zincir mi?](#ağaç-mı-zincir-mi)
- [Zero Flag (ZF)](#zero-flag-zf)
- [İşaret: Devre Bile Gerekmiyor](#i̇şaret-devre-bile-gerekmiyor)
- [İşaret Biti Neden 15?](#i̇şaret-biti-neden-15)
- [Karşılaştırmanın Tamamı](#karşılaştırmanın-tamamı)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Kapanış: Bayrakları Kendin Kurdun](#kapanış-bayrakları-kendin-kurdun)

---

## Hesaplamaktan Karar Vermeye

Bir hesap devresi ile bir **dedektör** arasındaki farkı gör:

| | girişi | çıkışı | ne yapıyor |
|---|---|---|---|
| toplayıcı | iki sayı | bir sayı | **hesaplıyor** |
| dedektör | bir sayı | **tek bit** | **karar veriyor** |

Dedektörün çıkışına **bayrak** (flag) denir: yukarı kalkmışsa bir durum var, inikse yok.

İlk görevin şu: 4 bit giriyor, tek bit çıkıyor.

```
   hepsi 0        →  çıkış 1
   başka her şey  →  çıkış 0
```

16 ihtimalin **sadece biri** 1 veriyor. Yani devre tek bir deseni arıyor.

---

## "Hepsi Sıfır" Sorusunu Ters Çevir

İlk refleks "hepsi 0 mı?" diye bir kapı aramaktır. Yok öyle bir kapı — elindekiler
ikili çalışıyor, "dördü birden" diye bir şey bilmiyorlar.

O yüzden soruyu çevir:

```
"bütün bitler 0"     ⟺     "hiçbir bit 1 DEĞİL"
```

İki cümle aynı şeyi söylüyor. Ama ikincisinin içinde kurabileceğin bir soru saklı:

> 🔑 **"En az bir bit 1 mi?"** — bu soruyu cevaplayan kapının adı **OR.**

Ve cevabı bulduğunda tam tersini istiyorsun, çünkü "en az biri 1" ile "hiçbiri 1
değil" birbirinin zıddı. Sonuna bir `inv` koyarsın.

> 💡 `OR` + `inv` birleşimi zaten bir kapıdır: **NOR.** Sen 4 girişli bir NOR
> kurdun. 02. derste NAND'dan kapı türetirken tanıştığın aileye bir üye daha.

**Genel kalıp bu:** bir soruyu doğrudan kurmak zorsa, **zıddını** kur ve sonucu
çevir. Devre tasarımında en çok işe yarayan tek numara budur.

---

## Ağaç mı, Zincir mi?

OR iki girişli, senin dört bitin var. Üç OR gerekiyor — ama **nasıl dizeceksin?**
İki geçerli şekil var ve ikisi de doğru cevabı verir:

```
        AĞAÇ                          ZİNCİR

   b3 b2   b1 b0                 b3 b2
    └OR┘    └OR┘                  └OR┘ b1
      └──OR──┘                      └OR┘ b0
         │                             └OR┘
        inv                              │
                                        inv

  3 kapı derinliği              4 kapı derinliği
```

Sonuç aynı. Fark, sinyalin kaç kapıdan geçtiğinde.

Her kapının küçük bir gecikmesi var (giriş değişince çıkışın oturması zaman alır) ve
bu gecikmeler **üst üste biner.** Dört bitte fark önemsiz. Ama:

| bit sayısı | ağaç derinliği | zincir derinliği |
|:-:|:-:|:-:|
| 4 | 3 | 4 |
| 16 | 5 | 16 |
| 64 | 7 | 64 |

Ağaç **logaritmik** büyüyor, zincir **doğrusal.** Gerçek işlemcilerde bu seçim
doğrudan saat hızını belirler.

> ⚠️ 07. dersteki ripple-carry ile karıştırma. Oradaki zincirin gerçek bir sebebi
> vardı: her basamak sağındakinin eldesine **bağlıydı.** (Bu bağımlılık bile zinciri
> tek yol yapmıyor; 07'nin sonundaki carry-lookahead eldeyi önceden hesaplıyor. Ama
> bağımlılık gerçek.) Burada öyle bir bağımlılık yok — bitlerin hepsi aynı anda
> hazır, hiçbiri diğerini beklemiyor.
>
> 🔑 **Gerçek bir bağımlılıktan doğan zincir ile alışkanlıktan kurulan zincir farklı
> şeylerdir.** Bir
> devrede sıra görürsen sor: bu gerçekten bir bağımlılık mı, yoksa öylesine mi
> böyle dizildi?

---

## Zero Flag (ZF)

Kurduğun telin gerçek bir adı var: **zero flag**, kısaca **ZF.**

x86'da `jz` / `jnz` (jump if zero / not zero) komutları tam olarak bu bite bakar.
Yazdığın her `if (x == 0)` bu telden geçiyor.

Ve asıl güzeli, 09. dersle birleşince ortaya çıkıyor:

> 🔑 **Eşitlik için ayrı bir devre gerekmiyor.** `a == b` sorusunu makine şöyle
> cevaplayabilir: `a − b` hesapla, **sonuç sıfır mı** diye sor. x86'nın karşılaştırma
> komutu `cmp` tam bunu yapar.
>
> Sıfırsa ZF = 1: eşit. Sıfır değilse (1 de olsa, 1000 de olsa) ZF = 0: eşit değil.
> Hangisinin büyük olduğunu ZF söylemez; onu birazdan işaret biti söyleyecek.
>
> (Ayrı bir eşitlik devresi de kurulabilir: iki sayının bitlerini tek tek XOR'la
> karşılaştır, sonucun sıfır olup olmadığına bak. [03](./03_xor_iki_fedai.md)'teki
> farklılık dedektörü, 16 kez.)

Çıkarıcı + sıfır dedektörü = karşılaştırma. İki dersin çarpımı.

---

## İşaret: Devre Bile Gerekmiyor

İkinci görev: *"bu 16-bitlik sayı negatif mi?"*

Kapı arama. Cevap zaten hazır bekliyor.

09'da `−1`'in `65535`, `−2`'nin `65534` olduğunu gördün. Aynı kuralla devam edersen
desenler tam ortadan ikiye bölünür: en soldaki biti 0 olan yarı (0–32767) sıfır ve
artılar, 1 olan yarı (32768–65535) eksiler. Bir sayının negatif olup olmadığı **en
soldaki bite bakılarak** anlaşılıyor.

Yani bütün seviye tek bir telden ibaret: 16'lık demeti aç, **bit 15**'i çıkışa bağla.

> 💡 Bu, iyi bir gösterimin gücü. Ayrı bir "işaret hanesi" ve mutlak değerle yazsaydık
> da işaret en soldaki telde dururdu, ama bir tuzakla: `−0` diye ikinci bir sıfır olurdu
> ve tek tele bakan test ona "negatif" derdi. İkinin tümleyeninde tek bir sıfır var; iş
> **gösterimin içine** gömüldü, geriye tek tel kaldı.
>
> İyi tasarım, işi devreden alıp temsile yıkar.

---

## İşaret Biti Neden 15?

Önce numaralandırma: bitler **sağdan sola** sayılır, en sağdaki `bit 0`.

```
 bit:      15    14    13   ...    2     1     0
değer:  32768 16384  8192   ...    4     2     1
```

Tanıdık geldi mi — bu 04. dersteki jeton tablosu. `bit n` = `2ⁿ` jeton. `bit 15`
demetin **en solundaki**, en pahalı jeton.

Şimdi neden işareti o söylüyor:

| desen | bit 15 | signed değeri |
|---|:-:|---:|
| `0000000000000000` | 0 | 0 |
| `0111111111111111` | 0 | **+32767** ← en büyük pozitif |
| `1000000000000000` | 1 | **−32768** ← en küçük negatif |
| `1111111111111111` | 1 | −1 |

65536 desenin tam **yarısı** (bit 15 = 0) sıfır ve pozitifler, diğer **yarısı**
(bit 15 = 1) negatifler.

> 🔑 İkinin tümleyeninde işaret biti ayrıca seçilmiş bir bit değil. 0'dan yukarı sayarken bit 15
> kapalı kalır, 0'dan aşağı inince anında açılır. **İşaret biti, sarma sınırının
> geçtiği yerdir** — sonradan eklenmiş bir etiket değil.

Bu telin adı da var: **sign flag (SF).**

---

## Karşılaştırmanın Tamamı

İki bayrağı ve çıkarıcıyı birleştir:

```
a == b   →   a − b yap,  ZF'ye bak
a <  b   →   a − b yap,  SF'ye bak
a >  b   →   a − b yap,  ikisine bak: ZF = 0 ve SF = 0
```

Üçüncü satırın kendi bayrağı yok: eşit değilse ve küçük değilse, büyüktür.

x86'da bu tam olarak şu iki satır:

```asm
cmp  eax, ebx      ; eax − ebx yap, sonucu ATMA ama bayrakları ayarla
je   esitse_git    ; ZF = 1 ise atla
```

`cmp`, sonucu hiçbir yere yazmayan bir `sub`'dır. Tek işi bayrakları kurmaktır.

> ⚠️ **Tam doğrusu için bir uyarı:** `a < b` testinde sadece SF'ye bakmak her zaman
> yetmez, çünkü **çıkarmanın kendisi taşabilir.** Örnek: `a = −32768`, `b = 1`.
> Gerçek sonuç `−32769`, 16 bite sığmıyor, sarıp `+32767` oluyor — işaret biti 0.
> SF'ye bakan devre "a küçük değil" der, oysa küçük.
>
> Gerçek işlemciler bu yüzden bir **overflow flag (OF)** daha tutar ve işaretli
> karşılaştırmada `SF ≠ OF` koşuluna bakar. Sen bu derste temeli kuruyorsun.

---

## 🎮 Şimdi Sen Kur

**İki seviye:**

**1. Equal to Zero** — 4 bit giriyor, hepsi 0 ise 1 ver.

<details>
<summary>🔒 Çözüm şeması — önce kendin dene, sonra aç</summary>

1. `OR₁`: girişleri `b3`, `b2`
2. `OR₂`: girişleri `b1`, `b0`
3. `OR₃`: girişleri `OR₁` ve `OR₂`'nin çıkışları → *"en az biri 1"*
4. `inv`: `OR₃`'ün çıkışını çevir → **çıkış**

Ağaç şeklinde diz, zincir değil — aynı sonuç, bir kapı daha sığ.

</details>

**2. Less than Zero** — 16 bit giriyor, negatifse 1 ver.

<details>
<summary>🔒 Çözüm şeması — önce kendin dene, sonra aç</summary>

1. **16 bit splitter**'a girişi bağla.
2. **`bit 15`** bacağını doğrudan çıkışa bağla.

Hepsi bu. Kapı yok. Zorluk devrede değil, **neden bit 15 olduğunu bilmekte.**

</details>

---

## Kapanış: Bayrakları Kendin Kurdun

Yazılımdan bakınca bayraklar **verilmiş** şeylerdir: işlemcinin bir yerinde duran,
komutların ayarladığı gizemli bitler. Bugün onları **kendin kurdun.** ZF, üç OR
ile bir inv'in çıkışı. SF, bir demetten çekilen tek tel. Assembly'de "sonuç sıfır
mı?" diye soran her `jz`, bugün kurduğun bu devreye bakıyor.

Aradaki boşlukta ne kaldı? Bütün bu işlemleri tek bir kutuya toplayıp "hangisini
yapacağını" dışarıdan seçtirmek — yani **ALU.** Bunun için önce devrenin **seçebilmesi**
gerekiyor; sıradaki dersin konusu tam bu.

---

## Özet — Aklında Tut

```
☐ Bayrak = tek bitlik cevap. Hesaplayan devre sayı verir, dedektör KARAR verir.
☐ Kurulması zor soruyu ZIDDINA çevir, sonucu inv ile döndür. (en verimli numara)
☐ "hepsi 0" ⟺ "hiçbiri 1 değil" → OR ağacı + inv = NOR = ZF
☐ Ağaç logaritmik, zincir doğrusal derinlik. 64 bitte 7'ye karşı 64.
☐ Gerçek bağımlılıktan doğan zincir (ripple-carry) ile alışkanlıktan kurulan zincir aynı şey değildir.
☐ Eşitlik için ayrı devre GEREKMEZ: a − b yap, ZF'ye bak (x86'nın cmp'si böyle). Ayrısı da kurulabilir: XOR'lar + sıfır dedektörü.
☐ Negatiflik testi tek tel: bit 15. Kapı gerekmiyor.
☐ İşaret biti sonradan eklenmedi — sarma sınırının geçtiği yer orası.
☐ İyi tasarım işi devreden alıp TEMSİLE yıkar (ikinin tümleyeni tam bunu yapar).
☐ a < b için tek başına SF yetmez; çıkarma taşarsa yanıltır → OF gerekir.
```

---

## 🔗 İlgili Konular

- 👾 **Meraklısına:** Karşılaştırıcı yanılmaz, ona verilen bitler yanılabilir — işaret dönüşümü [CWE-196](../cwe/cwe_196.md), [CWE-195](../cwe/cwe_195.md)
- [09_subtraction.md](./09_subtraction.md) — Bayrakların baktığı sonucu üreten devre
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — Ağacın kapıları: NOT, AND, OR
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Jeton değerleri: 1, 2, 4, 8 …

---

**Önceki konu:** [09_subtraction.md](./09_subtraction.md)
**Sonraki konu:** [11_selector_switch.md](./11_selector_switch.md) — Devrenin ilk kararı

*Bu ders, "Şalterden Bilgisayara" serisinin bir parçasıdır. Seri, [nandgame.com](https://nandgame.com) eşliğinde ilerler.*
