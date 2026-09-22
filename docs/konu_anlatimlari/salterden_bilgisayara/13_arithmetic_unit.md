# 🧮 Şalterden Bilgisayara — Arithmetic Unit: Seçiciyi Girişe Taşımak

> `12`'de dört işlem tuvalde yan yana duruyordu, sen de çıkışta birini seçtin.
> Bu seviyede tablo yine dört satır, elindeki parçalar yine aynı. Kurulum
> tanıdık.
>
> Ama bu sefer tabloya biraz daha uzun bakarsan, dört ayrı işlem **görmezsin.**
> İki işlem görürsün — ve seçimin çıkışta olmak zorunda olmadığını fark edersin.
>
> Bu ders bir işlem öğretmiyor. **Aynı işi daha az parçayla yapmayı** öğretiyor.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Her Bayrak Ayrı Bir Soru Sorar](#her-bayrak-ayrı-bir-soru-sorar)
- [Seçiciyi Girişe Taşımak](#seçiciyi-girişe-taşımak)
- [Sabit 1'i Kim Üretecek?](#sabit-1i-kim-üretecek)
- [16 Bitlik "1" Tek Tel Değildir](#16-bitlik-1-tek-tel-değildir)
- [Tuzak: Çıkarma Değişmeli Değil](#tuzak-çıkarma-değişmeli-değil)
- [Tuzak: D0 ve D1 Sadece Soket Adıdır](#tuzak-d0-ve-d1-sadece-soket-adıdır)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Testi Nasıl Seçersin?](#testi-nasıl-seçersin)
- [Her Komutta Çalışan Devre](#her-komutta-çalışan-devre)

---

## Bu Parça Ne Yapıyor?

x86 serisinin [9. dersinde](../x86_assembly/09_aritmetik.md) şu satırları
yazmıştın:

```nasm
add eax, ebx
sub eax, ebx
inc eax
dec eax
```

Dördü de bu derste kuracağın devrede çalışır. `12`'deki yolculuğun aynısı, sadece
işlemler aritmetik:

```
add eax, ebx
   │
   ①  assembler satırı bitlere çevirir
   │
   ②  kontrol birimi bitleri okur, "topla" der    →  op1 = 0, op0 = 0
   │
   ③  eax ile ebx'in değerleri X ve Y tellerine gelir
   │
   ④  ARITHMETIC UNIT: emre göre doğru sonuç çıkar   ← bu ders
   │
   ⑤  sonuç eax'a geri yazılır
```

`12` ile aradaki tek fark ④. Ama o kutunun **içi** bambaşka kurulacak — ve farkın
sebebi tabloda saklı.

---

## Her Bayrak Ayrı Bir Soru Sorar

Seviyenin verdiği tablo şu:

| op1 | op0 | çıkış |
|:-:|:-:|---|
| 0 | 0 | X + Y |
| 1 | 0 | X − Y |
| 0 | 1 | X + 1 |
| 1 | 1 | X − 1 |

Dört satır, dört işlem. `12`'deki refleksle bakarsan dört kutu kurup çıkışta
seçmek istersin. Çalışır da. Ama önce tabloyu **satır satır değil, sütun sütun**
oku.

`op1` değişince ne oluyor? `op0`'ı sabit tutup bak:

```
op0 = 0 sabitken:   X + Y   →   X − Y        işaret değişti
op0 = 1 sabitken:   X + 1   →   X − 1        işaret değişti
```

`op1` her iki durumda da **aynı şeyi** yapıyor: toplamayı çıkarmaya çeviriyor.
İkinci sayıya hiç dokunmuyor.

Şimdi `op0` için aynısını yap:

```
op1 = 0 sabitken:   X + Y   →   X + 1        ikinci sayı değişti
op1 = 1 sabitken:   X − Y   →   X − 1        ikinci sayı değişti
```

`op0` da her iki durumda aynı şeyi yapıyor: ikinci sayıyı Y'den 1'e çeviriyor.
İşleme hiç dokunmuyor.

Tabloyu dört satır yerine **iki eksenli bir ızgara** olarak yazınca görünür hâle
geliyor:

```
                op0 = 0      op0 = 1
              ┌──────────┬──────────┐
     op1 = 0  │  X + Y   │  X + 1   │     toplama satırı
              ├──────────┼──────────┤
     op1 = 1  │  X − Y   │  X − 1   │     çıkarma satırı
              └──────────┴──────────┘
                  Y           1
              ikinci sayı  ikinci sayı
```

> 🔑 `op1` **hangi işlem** olduğunu, `op0` **ikinci sayının ne olduğunu** seçiyor.
> İkisi birbirine karışmıyor; iki ayrı soruya iki ayrı cevap.

Bu, `12`'dekinden **farklı bir yapı.** Orada iki bayrak bir hiyerarşi kuruyordu:
`op1` grubu, `op0` grubun içindeki işlemi seçiyordu — onluk/birlik gibi. Burada
hiyerarşi yok, **iki bağımsız eksen** var.

Ve üçüncü bir gözlem: X dört satırın dördünde de solda, hep aynı yerde. X hiçbir
seçime girmiyor.

> ⚠️ "X bazı durumlarda sabit kalıyor" diye okumak yanlış olur. X **hiçbir
> durumda** değişmiyor. Değişen, onunla işleme giren ikinci sayı.

---

## Seçiciyi Girişe Taşımak

Kaba yol şu olurdu: dört işlemi de kur, çıkışta seç.

```
X+Y   X−Y   X+1   X−1        →  4 aritmetik birim
  │     │     │     │
  └──┬──┘     └──┬──┘
     A           B           →  2 seçici
     └─────┬─────┘
           C                 →  1 seçici daha
```

Çalışır. `12`'nin şeması bu. Ama ızgaraya bir daha bak: `X + Y` ile `X + 1`
**aynı işlem.** İkisi de toplama. Neden iki toplayıcı kurasın?

Sırayı değiştir. Önce ikinci sayıyı seç, sonra işlemi yap:

```
  Y ────────→ D0 ┐
                 ├─ seçici (kol = op0) ──┬──→ toplayıcı ──┐
  1 ────────→ D1 ┘                       │                ├─ seçici (kol = op1) → çıkış
                                         └──→ çıkarıcı ───┘
  X ──────────────────────────────────────→ (ikisinin de birinci girişi)
```

| | kaba yol | bu yol |
|---|:-:|:-:|
| aritmetik birim | 4 | **2** |
| seçici | 3 | **2** |

Aynı tablo, yarı parça.

> 🔑 Seçici çıkışta durmak zorunda değil. **Girişte seçersen, arkasındaki her şeyi
> bir kere kurman yeter.**

Sebebi ızgaranın kendisi: toplama satırındaki iki hücre *aynı işlem*, sadece ikinci
sayıları farklı. Farkı **işlemden önce** halledersen, işlemi bir kez kurarsın.

> 💡 Bu bir "numara" değil, tekrar eden bir tasarım refleksi. Bir tasarımda aynı
> parçadan birden fazla varsa, sor: *farkı daha erken halledebilir miyim?*

`12`'nin "hepsi çalışır, biri seçilir" kuralı burada da geçerli — ama artık
**dördü değil ikisi** çalışıyor. Toplayıcı da çıkarıcı da her an hesap yapıyor,
ikisi de ikinci sayı olarak aynı teli görüyor, üstteki seçici birini geçiriyor.

---

## Sabit 1'i Kim Üretecek?

Girişteki seçicinin iki kaynağa ihtiyacı var: **Y** ve **1**.

Y hazır, aşağıda giriş olarak duruyor. Peki 1 nereden gelecek?

Toolbox'a bak. `nand`, `select 16`, `add 16`, `sub 16`, `inv`, `16 bit bundler`,
ve bir de sabit **`0`** var.

`1` yok.

Bu bir eksiklik değil, seviyenin sorusu. Sabit 0'ı ters çevirirsen ne olur?

```
  0  ──→  inv  ──→  1
```

`02`'de NAND'lardan kurduğun `inv`, girişindeki teli ters çevirir. Girişi 0 ise
çıkışı 1. Sabit 1 buradan geliyor.

> 🔑 Donanımda sabitler bir yerde **saklanmaz, imal edilir.** "1" dediğin şey
> gerilimde tutulan bir teldir; onu ya doğrudan beslemeye bağlarsın ya da elindeki
> bir 0'ı ters çevirirsin.

Bir eksik kaldı: `inv`'in çıkışı **tek tel.** Seçicinin girişi ise 16 tel. Bunlar
doğrudan birbirine bağlanmaz.

---

## 16 Bitlik "1" Tek Tel Değildir

Bu seviyenin asıl dersi burada.

Yazılımda `1` yazarsın, biter. Donanımda böyle bir şey yok. 16 bitlik sayı
sisteminde `1` şudur:

```
  bit   15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
        ─────────────────────────────────────────────────
         0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  1
         └──────────────── 15 tel alçak ───────────┘   └─ 1 tel yüksek
```

**On altı tel.** On beşi 0'da, biri 1'de. `inv` sana bunlardan sadece birini
veriyor — bit 0'ı. Geri kalan on beşin de var olması ve 0'da durması gerekiyor.

`16 bit bundler` tam bu iş için var: 16 ayrı tek-bitlik teli alır, tek bir
16 bitlik değer hâline getirir.

```
  bit 0  ←── inv çıkışı (1)
  bit 1  ←── boşta (0)
  bit 2  ←── boşta (0)
    ⋮                          ═══>  16 bitlik değer:  0x0001
  bit 15 ←── boşta (0)
```

Bağlanmamış girişler 0 sayıldığı için (`08`'deki kural) sadece bit 0'ı bağlaman
yeterli. Ama on beşi **kavramsal olarak oradalar** — bundler onları da üretiyor.

> 🔑 Bundler bir hesap yapmaz. **Genişlik adaptörüdür:** tek tellerden bir yol
> örer.

Şunu ayırmak önemli, çünkü işlemcide ikisi hep birlikte ama işleri ayrı:

| parça | işi |
|---|---|
| `0` + `inv` + `bundler` | sabit 1'i **imal etmek** |
| birinci `select 16` | Y ile o sabit arasında **seçmek** |

Biri üretici, biri seçici.

Ve şuna dikkat et: bundler olmasaydı 16 bitlik sabiti seçicinin girişine
koyamazdın. Koyamazsan girişte seçim yapamazsın; girişte seçemezsen dört
aritmetik birim kurmak zorunda kalırdın. **Ucuz tasarımı mümkün kılan şey,
genişlik adaptörü.**

> 💡 Bu genişlik meselesi bir daha karşına çıkacak. 8 bitlik bir değeri 16 bitlik
> bir yere yüklediğinde geri kalan 8 biti neyle doldurursun? Negatif sayılarda
> bunun iki farklı doğru cevabı var — bellek ünitesinde açacağız.

---

## Tuzak: Çıkarma Değişmeli Değil

`add 16` ve `sub 16`'nın ikişer girişi var: `A` ve `B`.

```
  add 16   →   A + B
  sub 16   →   A − B
```

Toplamada sıra önemsiz: `A + B` ile `B + A` aynı. Ama çıkarmada değil:

```
   5 − 3  =  2
   3 − 5  = −2        aynı şey değil
```

Tablo `X − Y` diyor, `Y − X` demiyor. Dolayısıyla:

> ⚠️ **X her zaman `A`'ya, seçicinin çıkışı her zaman `B`'ye.** İkisinde de.

Ters bağlarsan toplama satırları **doğru** çıkar (çünkü toplama değişmeli),
çıkarma satırları ters işaret verir. Yarısı çalışan bir devre, hiç çalışmayandan
daha kafa karıştırıcıdır — çünkü "bağlantılar doğru galiba" diye düşünürsün.

---

## Tuzak: D0 ve D1 Sadece Soket Adıdır

`select 16`'nın iki veri girişi `D0` ve `D1` diye adlandırılmış. Bu isimler
**kolun değeriyle** ilgili:

| kol (s) | çıkışa geçen |
|:-:|:-:|
| 0 | **D0** |
| 1 | **D1** |

`D1`'in tablodaki `1` ile, `X` ile, `Y` ile hiçbir ilgisi yok. Soketin adı, o
kadar. İçine ne koyacağına sen karar veriyorsun.

`11`'den gelen kural burada da geçerli ve tek soruya iner:

> 🔑 **Kol 0 iken geçmesi gereken şey D0'a bağlanır.**

Girişteki seçici için: kol `op0`. Tabloya bak — `op0 = 0` iken ikinci sayı
**Y**. Demek ki Y → `D0`, sabit 1 → `D1`.

Çıkıştaki seçici için aynı soruyu sen sor: *kolu ne, o kol 0 iken hangi sonuç
geçmeli?*

---

## 🎮 Şimdi Sen Kur

**Görev:** NandGame → **Arithmetic Logic Unit → Arithmetic Unit** seviyesi.

Elindekiler: `nand`, `select 16`, `add 16`, `sub 16`, `0`, `inv`,
`16 bit bundler`.

Sırayla git, tek hamlede kurmaya çalışma:

1. Önce **sabit 1'i imal et** (`0` → `inv` → bundler'ın **bit 0**'ı). Bundler'ın
   çıkışında `Hex 0001` yazdığını gör. Yazmıyorsa ileri gitme.
2. Sonra **giriş seçicisini** kur (kol `op0`, Y ve sabit 1).
3. Sonra `add 16` ve `sub 16` — **X ikisinin de `A`'sına**, seçicinin çıkışı
   ikisinin de `B`'sine.
4. En son **çıkış seçicisi** (kol `op1`).

> 💡 Sabit 1'i bundler'ın yanlış bacağına takmak bu seviyenin en sık hatası.
> Bit 11'e takarsan devre `X + 2048` hesaplar — çünkü 2¹¹ = 2048. İyi haber:
> bundler'ın çıkışında `0800` yazar, yani **alet hatayı sana söyler.** Telin
> üstündeki sayıyı okumayı alışkanlık hâline getir.

<details>
<summary>🔒 Çözüm şeması — önce kendin dene, sonra aç</summary>

1. `0` → `inv` → `16 bit bundler`'ın **bit 0** girişi. Diğer 15 bit boşta (0).
2. `select 16` (giriş): `D0` ← **Y**, `D1` ← bundler çıkışı, `s` ← **op0**.
3. `add 16`: `A` ← **X**, `B` ← giriş seçicisinin çıkışı.
4. `sub 16`: `A` ← **X**, `B` ← giriş seçicisinin çıkışı. *(aynı tel iki kutuya
   birden gider — `11`'deki fan-out)*
5. `select 16` (çıkış): `D0` ← `add 16`, `D1` ← `sub 16`, `s` ← **op1** →
   **çıkışa**.

</details>

---

## Testi Nasıl Seçersin?

`Check solution`'a basmadan önce devreyi kendin sına. Ama nasıl bir test?

Şu dört satırı çalıştır:

| X | Y | op1 | op0 | beklenen |
|:-:|:-:|:-:|:-:|:-:|
| 5 | 3 | 0 | 0 | **8** |
| 5 | 3 | 1 | 0 | **2** |
| 5 | 3 | 0 | 1 | **6** |
| 5 | 3 | 1 | 1 | **4** |

Asıl soru şu: **neden 5 ve 3?**

Çünkü dört sonuç da birbirinden farklı: 8, 2, 6, 4. Hangi satırın bozuk olduğunu
çıkışa bakınca ayırt edebilirsin.

Kötü bir seçim yapsaydın bunu kaybederdin. Mesela X = 2, Y = 1 dene:

```
X + Y = 3        X − Y = 1
X + 1 = 3        X − 1 = 1        ← iki çift aynı sayıyı veriyor
```

Bu testte `op0` bozuk olsa bile **dört satır da doğru görünür.** Devre yanlış,
test yeşil. En kötü durum bu.

> 🔑 Bir test sadece "çalıştı mı" diye sormaz. Asıl işi, **bozuk olsaydı
> farkederdim** diyebilmektir. Sonuçları birbirinden ayırt edilemeyen bir test,
> hiç test yapmamaktan daha kötüdür — çünkü sana sahte güven verir.

`12`'deki "sıfırdan farklı sonuç veren giriş seç" kuralının bir adım ilerisi bu.
Orada bir kutunun çalıştığını görmek istiyordun; burada **dört durumu birbirinden
ayırmak** istiyorsun.

---

## Her Komutta Çalışan Devre

Tablodaki `X + 1` satırı masum duruyor. Aslında makinedeki **en sık yapılan
aritmetik işlem** o.

İşlemci bir komutu bitirdiğinde "sıradaki komut nerede?" diye sorar. Cevap:

```
PC ← PC + 1
```

`PC` = program sayacı, sıradaki komutun adresini tutan kayıt. Bu toplama **her
komutta**, makine açık olduğu sürece durmadan yapılır.

Sadece o da değil:

| nerede | ne |
|---|---|
| [döngüler](../x86_assembly/12_donguler.md) | `i++` — her turda bir artırma |
| [yığın](../x86_assembly/14_stack.md) | her `push`/`pop`'ta yığın işaretçisi bir kayar |
| dizi gezmek | "sonraki elemana geç" = adresi bir artır |

Bu yüzden `+1` ve `−1`, `+Y` kadar meşru bir işlem olarak tabloya girmiş. Bugün
kurduğun devre, ilerideki **Processor** ünitesinde program sayacını işletecek
olan devre.

> 💡 x86'da aynı gerekçeyle `add`'den ayrı `inc` ve `dec` komutları var. Komik
> son: modern işlemcilerde `inc` bazen `add reg, 1`'den **yavaş** çalışıyor,
> çünkü bayrakların hepsini güncellemiyor ve bu eksik güncelleme boru hattında
> takılmaya yol açıyor. Bir zamanlar hızlandıran şey, mimari değişince yük
> hâline gelmiş.

### Sırada

**ALU**, bu ünitede kurduğun iki birimi — Logic Unit ile Arithmetic Unit — tek
kutuda birleştirecek. Ardından **Condition**'da `10`'da söz verilen taşma bayrağı
(OF) gelecek.

---

## Özet — Aklında Tut

```
☐ Tabloyu satır satır değil SÜTUN sütun oku: her bayrak ayrı bir soru sorar.
☐ op1 = hangi işlem (toplama/çıkarma) · op0 = ikinci sayı ne (Y / sabit 1).
☐ 12'den farkı: orada hiyerarşi vardı (grup + eleman), burada İKİ BAĞIMSIZ EKSEN var.
☐ X hiçbir seçime girmez — dört satırda da solda, hep aynı yerde.
☐ Seçici çıkışta durmak zorunda DEĞİL. Girişte seçersen arkasındakini bir kere kurarsın.
☐ Kaba yol 4 aritmetik birim + 3 seçici · bu yol 2 + 2. Aynı tablo, yarı parça.
☐ Refleks: aynı parçadan birden fazla varsa "farkı daha erken halledebilir miyim?" diye sor.
☐ Donanımda sabit saklanmaz, İMAL EDİLİR. Sabit 1 = inv(0).
☐ 16 bitlik "1" tek tel değil, ON ALTI teldir: 15'i alçak, 1'i yüksek.
☐ bundler hesap yapmaz, GENİŞLİK ADAPTÖRÜdür. Onsuz girişte seçim kurulamazdı.
☐ ⚠️ sub değişmeli değil: X HER ZAMAN A'ya. Ters bağlarsan toplama doğru, çıkarma ters çıkar.
☐ D0/D1 sadece soket adı — tablodaki 1 ile ilgisi yok. Kol 0 iken geçecek şey D0'a.
☐ Sabit 1 yanlış bite giderse devre X + 2048 yapar; teldeki 0800 sayısı hatayı söyler.
☐ İyi test = "bozuk olsaydı farkederdim" diyebildiğin test. 5 ve 3 → dört sonuç da farklı.
☐ Sonuçları ayırt edilemeyen test, hiç test yapmamaktan kötüdür: sahte güven verir.
☐ X + 1 makinedeki en sık aritmetik işlem: PC ← PC + 1, her komutta.
```

---

## 🔗 İlgili Konular

- 👾 **Meraklısına:** [CWE-193 — Off-by-one](../cwe/cwe_193.md) — bu dersteki `X + 1`'in bir birim yanlış yere düşmesi: `<` mi `<=` mi
- 👾 **Genişlik ekseni:** [CWE-194 — İşaret uzatması](../cwe/cwe_194.md) (dar → geniş) ve [CWE-197 — Kırpma](../cwe/cwe_197.md) (geniş → dar) — bundler bölümünün güvenlik karşılığı
- [12_logic_unit.md](./12_logic_unit.md) — Aynı fikrin mantık işlemleriyle hâli; emir, seçim, "hepsi çalışır biri seçilir"
- [11_selector_switch.md](./11_selector_switch.md) — Seçicinin kendisi ve fan-out
- [09_subtraction.md](./09_subtraction.md) — `sub 16`'nın içindeki devre
- [08_increment.md](./08_increment.md) — Bağlanmamış giriş neden 0 sayılır
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Tellerin sayı olması; bit ağırlıkları (2¹¹ = 2048)
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — `inv` kutusunun içindeki devre
- [../x86_assembly/09_aritmetik.md](../x86_assembly/09_aritmetik.md) — **Aynı işlemler, yazılım tarafından**

---

**Önceki konu:** [12_logic_unit.md](./12_logic_unit.md)
**Sonraki konu:** *(yolda — ALU)*

*Bu ders, "Şalterden Bilgisayara" serisinin bir parçasıdır. Seri, [nandgame.com](https://nandgame.com) eşliğinde ilerler.*
