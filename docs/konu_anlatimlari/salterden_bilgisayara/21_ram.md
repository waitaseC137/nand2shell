# 🧮 Şalterden Bilgisayara — RAM: Numarası Olan Sözcükler

> Bu seviyede bir bağlantı önce ters kuruldu: adres ile yazma izni, `switch`'in
> bacaklarına yer değiştirerek bağlandı. Yanlışlık, küçük bir örnek tabloyla
> sınanınca ortaya çıktı. Bir de şu soru soruldu: adres iki register'a birden
> giderse ikisi birden yazmaz mı? Cevabı, bu seviyenin asıl fikri oldu.

---

## 📋 İçindekiler

- [Bu Parça Ne Yapıyor?](#bu-parça-ne-yapıyor)
- [Adres](#adres)
- [Hangi Tel Paylaşılmaz?](#hangi-tel-paylaşılmaz)
- [Register Adres Bilmez](#register-adres-bilmez)
- [Yazarken Dağıt](#yazarken-dağıt)
- [Okurken Topla](#okurken-topla)
- [🎮 Şimdi Sen Kur](#-şimdi-sen-kur)
- [Daha Büyük RAM](#daha-büyük-ram)
- [Memory Bitti](#memory-bitti)

---

## Bu Parça Ne Yapıyor?

Memory bölümünün altıncı ve son kapısındasın. Manzara şu:

```
girişler:   ad (1 bit) · st (1 bit) · X (16 bit) · cl (1 bit)
çıkış:      16 bit
kutu:       nand · inv · and · register · switch · select 16
```

Seviyenin tanımı: *"Tek bitlik bir adresle adreslenebilen ve yazılabilen, iki
tane 16 bitlik register'dan oluşan bir hafıza birimi kur."*

| giriş | ne |
|---|---|
| `ad` | **adres:** hangi birime erişiyoruz |
| `st` | yazılsın mı: 1 ise `X` birime saklanır, 0 ise `X` duyulmaz |
| `X` | 16 bitlik veri |
| `cl` | zil: `X`, `cl` 0'dan 1'e çıkarken saklanır, 1'den 0'a inerken çıkışa verilir |

**Çıkış:** `ad`'nin gösterdiği birimde o an saklanan değer.

---

## Adres

Açılan pencere seviyenin fikrini anlatıyor:

> *"Artık 16 bitlik bir sözcüğü bir register'da saklayabiliyorsun. Bu
> register'ları üst üste koyarak daha çok hafıza elde edebiliriz. Ama işlemci
> her seferinde bir sözcükle çalıştığı için, büyük bir hafıza bankasında tek tek
> sözcükleri seçip değiştirebilmemiz lazım. Bunun için hafıza adresleri
> kullanırız. Hafızadaki her sözcüğe bir numara veririz, böylece o sözcüğü bu
> numarayla okuyabilir ya da üstüne yazabiliriz."*

Bu fikir yeni değil. [14](./14_alu.md#kat-ve-daire-kontrol-bitleri-bir-adrestir)'te
bir bölümün adı "Kat ve Daire: Kontrol Bitleri Bir Adrestir" idi. Orada kontrol
bitleri ALU'nun içinde bir **işlemi** seçiyordu. Burada adres biti bir
**sözcüğü** seçiyor.

Adres tek bit olduğu için iki sözcük var: 0 numaralı ve 1 numaralı register.

---

## Hangi Tel Paylaşılmaz?

[19](./19_register.md#ortak-mı-ayrı-mı)'da kural "kontrol telleri ortak, veri
telleri ayrı" idi. Burada durum değişiyor. İlk soru şu oldu: `X`, `cl` ve `st`
tellerinden hangisi iki register'a **birden** gitmemeli?

Cevap: **`st`.** İki register'a birden giderse `st = 1` olduğunda ikisi birden
yazılır. `st` doğru register'a **yönlendirilmeli.**

`X` ile `cl` ise ikisine birden gidebilir. `X`'in iki register'ın kapısına kadar
gelmesi sorun değil: yalnızca `st`'si 1 olan register onu alıyor, öbürü duymuyor.

---

## Register Adres Bilmez

Burada bir endişe dile getirildi: *"`ad` register'ı seçiyorsa ortak olmamalı.
İki register da aynı adresi görüp birlikte yazmaz mı?"*

Endişe yerinde, ama cevabı şu: **`ad` register'lara hiç girmiyor.** `register`'ın
bacaklarına bak: `st`, `X`, `cl`. Adres bacağı yok. Register kendi numarasını
bilmiyor.

Adresi dışarıda iki parça okuyor ve ona göre karar veriyor:

- **Yazarken:** `st`'yi doğru register'a götüren parça.
- **Okurken:** iki register'ın çıkışından birini seçip Output'a veren parça.

Kat ve daire benzetmesiyle: daireler hangi numarada olduklarını bilmek zorunda
değil. Numaraya bakıp mektubu doğru daireye bırakan, binanın girişindeki
dağıtıcı.

---

## Yazarken Dağıt

Tek bir girişi iki çıkıştan birine gönderen parça: **`switch`.**
[11](./11_selector_switch.md#switch-aynadaki-yansıma)'deki kural:

```
 s = 0   →   d, c0'a gider   (c1 = 0)
 s = 1   →   d, c1'e gider   (c0 = 0)
```

`switch`'in iki bacağının iki ayrı işi var:

| bacak | işi |
|---|---|
| `s` | **yön:** gönderilen şey hangi çıkışa gitsin? |
| `d` | **gönderilen:** yönlendirilen tel |

Burada ilk cevap ters geldi: *"`ad` `d`'ye girer, gönderilen şey o; `st` `s`'ye
girer, yönlendirme için."* Hangisinin doğru olduğunu bir örnek tablo söyledi.

Durum: **register 0'a yazmak istiyoruz**, yani `ad = 0`, `st = 1`. Beklenen:
`c0 = 1` (register 0 yazsın), `c1 = 0`.

| bağlantı | ne oluyor | sonuç |
|---|---|---|
| `s ← st`, `d ← ad` | `s = 1` → `d` `c1`'e gider; `d = ad = 0` → `c1 = 0`, `c0 = 0` | hiçbir register yazmıyor ✗ |
| `s ← ad`, `d ← st` | `s = 0` → `d` `c0`'a gider; `d = st = 1` → `c0 = 1`, `c1 = 0` | register 0 yazıyor ✓ |

Karışıklığın kaynağı "gönderilen" kelimesiydi. Gönderilen şey, **register'a
ulaşan** şey. Register'ın `st` bacağına ulaşması gereken de yazma izni. Adres
register'a hiç ulaşmıyor: yolu gösteriyor, sonra işi bitiyor.

```
switch:   s ← ad    d ← st    c0 → register 0'ın st'si    c1 → register 1'in st'si
```

---

## Okurken Topla

İki register'ın çıkışından birini seçip Output'a veren parça: **`select 16`.**
Bacakları `switch`'in aynası:

```
select 16:   s ← ad    D1 ← register 1'in çıkışı    D0 ← register 0'ın çıkışı    →  Output
```

Devrenin simetrisine bak. Aynı `ad` teli iki yere gidiyor:

```
yazarken:   switch     →  st'yi DAĞITIR     (bir → iki)
okurken:    select 16  →  çıkışı TOPLAR     (iki → bir)
```

Okumanın zile bağlı olmadığına da dikkat et. `select 16` bir hafıza parçası
değil, bir seçici. `ad` değiştiği anda çıkış öbür register'ın değerine geçiyor.
Zil yalnızca **yazmayı** yönetiyor.

---

## 🎮 Şimdi Sen Kur

Parça listesi: **2 × `register`**, **1 × `switch`**, **1 × `select 16`**.

1. `switch`: `s`'ye `ad`, `d`'ye `st`.
2. `switch`'in `c0`'ını register 0'ın `st`'sine, `c1`'ini register 1'in `st`'sine
   bağla.
3. `X`'i iki register'ın `X`'ine de bağla.
4. `cl`'yi iki register'ın `cl`'sine de bağla.
5. `select 16`: `s`'ye `ad`, `D0`'a register 0'ın çıkışı, `D1`'e register 1'in
   çıkışı. Çıkışını Output'a bağla.

### RAM'i nasıl test edersin

Her adımda **tek** bir anahtar değişiyor:

| adım | değişen | beklenen çıkış | ne sınanıyor |
|---|---|---|---|
| 1 | `X = 5` | | `ad = 0` |
| 2 | `st = 1` | | |
| 3 | `cl = 1` | **değişmez** | 5 alındı, gösterilmedi |
| 4 | `cl = 0` | `5` | 0 numaralı sözcüğe 5 yazıldı |
| 5 | `ad = 1` | tanımsız (1 numaralı register'a henüz yazılmadı) | okuma zil beklemiyor |
| 6 | `X = 9` | tanımsız | |
| 7 | `cl = 1` | tanımsız | 9 alındı, gösterilmedi |
| 8 | `cl = 0` | `9` | 1 numaralı sözcüğe 9 yazıldı |
| 9 | `st = 0` | `9` | |
| 10 | `ad = 0` | **`5`** | 0 numaralı sözcük bozulmadı |
| 11 | `ad = 1` | **`9`** | |
| 12 | `X = 7` | `9` | |
| 13 | `cl = 1` | `9` | |
| 14 | `cl = 0` | **`9`** | `st = 0`: yazılmadı |

Adım 10 ve 11'e bak: iki sözcük birbirinden bağımsız duruyor, adres hangisini
gösterirse o okunuyor.

<details>
<summary>🔑 Takıldıysan — bağlantı listesi</summary>

```
switch:        s ← ad    d ← st
register 0:    st ← switch.c0    X ← X    cl ← cl
register 1:    st ← switch.c1    X ← X    cl ← cl
select 16:     s ← ad    D0 ← register 0    D1 ← register 1    →  Output
```

</details>

Oyunun cevabı:

> *"4 components used. 632 nand gates in total. This is the simplest possible
> solution!"*

![RAM devresi: iki register, bir switch, bir select 16](./gorseller/21_devre.png)
*Geçen devre. Ortada `switch`, üstte `select 16`, ikisine de `ad` gidiyor.*

![RAM seviyesi geçti: 4 bileşen, 632 nand, en basit çözüm](./gorseller/21_basari.png)
*Oyun bir cümle daha ekliyor: bu tasarım özyinelemeli olarak tekrarlanıp daha büyük RAM'ler yapılabilir.*

---

## Daha Büyük RAM

Oyunun son cümlesi: *"Bu adreslenebilir RAM tasarımı, özyinelemeli olarak
tekrarlanıp daha büyük RAM birimleri kurmak için kullanılabilir."*

"Özyinelemeli" şu demek: az önce kurduğun iki sözcüklük RAM de artık bir parça.
Onun iki tanesini yan yana koyup önlerine yeni bir `switch`, arkalarına yeni bir
`select 16` koyarsan ve onları yeni bir adres bitine bağlarsan, dört sözcüklük bir
RAM elde edersin. Onun ikisinden sekiz sözcük, ve böyle devam eder.

Her yeni adres biti sözcük sayısını ikiye katlıyor. [04](./04_teller_sayi_olunca.md#kaç-tel-kaç-sayı)'teki
kural burada da geçerli: `n` tel `2ⁿ` farklı sayı taşıyabilir, `n` adres biti de
`2ⁿ` sözcüğe numara verebilir.

---

## Memory Bitti

Memory bölümünün altı kapısı tek bir yol:

| ders | ne kuruldu |
|---|---|
| [16](./16_sr_latch.md) | iki NAND birbirini tutuyor: bit döngünün içinde |
| [17](./17_d_latch.md) | önüne bir çevirmen: yasak satır kararlı durumda ulaşılamaz |
| [18](./18_data_flip_flop.md) | almak ile göstermek ayrıldı: saat |
| [19](./19_register.md) | bitler yan yana: bir sayının hafızası |
| [20](./20_counter.md) | her zilde bir adım: `PC ← PC + 1` |
| 21 | numarası olan sözcükler: adres |

Tek bir kapıdan, adresle okunup yazılan bir hafızaya.

### Sırada

**Processor ünitesi.**

---

## Özet — Aklında Tut

```
☐ RAM: adresle seçilen sözcüklerin hafızası. Her sözcüğe bir numara (adres) verilir.
☐ Adres fikri 14'teki "kat ve daire": orada bir işlemi, burada bir sözcüğü seçiyor.
☐ Tek bitlik adres → iki sözcük (register 0 ve register 1).
☐ ⚠️ st iki register'a birden gitmez: ikisi birden yazılırdı. st YÖNLENDİRİLİR.
☐ X ve cl ikisine birden gidebilir: X'i yalnızca st'si 1 olan register alır.
☐ 🔑 Register adres bilmez: bacakları st, X, cl. Adresi dışarıda switch ve select okur.
☐ Yazarken DAĞIT: switch, s ← ad (yön), d ← st (gönderilen). c0 → register 0, c1 → register 1.
☐ ⚠️ "Gönderilen" = register'a ULAŞAN şey = yazma izni. Adres yalnızca yolu gösterir.
☐ Ters bağlantı (s ← st, d ← ad): ad = 0, st = 1 iken hiçbir register yazmıyor.
☐ Okurken TOPLA: select 16, s ← ad, D0 ← register 0, D1 ← register 1.
☐ Aynı ad teli iki yöne: switch dağıtır, select toplar.
☐ Okuma zil beklemez: select bir seçici, ad değişince çıkış hemen değişir. Zil yalnız yazmayı yönetir.
☐ Çözüm: 4 bileşen, 632 nand, en basit.
☐ Özyinelemeli büyüme: her yeni adres biti sözcük sayısını ikiye katlar. n adres biti → 2ⁿ sözcük.
```

---

## 🔗 İlgili Konular

- [20_counter.md](./20_counter.md) — Memory'nin bir önceki kapısı; sayıyı tutan register
- [19_register.md](./19_register.md) — RAM'in her sözcüğü; kontrol telleri ortak, veri telleri ayrı
- [14_alu.md](./14_alu.md) — "Kat ve Daire: Kontrol Bitleri Bir Adrestir"
- [11_selector_switch.md](./11_selector_switch.md) — Selector toplar, switch dağıtır
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — `n` tel, `2ⁿ` sayı

---

**Önceki konu:** [20_counter.md](./20_counter.md)
**Sonraki konu:** *(yolda — Processor ünitesi)*

*Bu ders, "Şalterden Bilgisayara" serisinin bir parçasıdır. Seri, [nandgame.com](https://nandgame.com) eşliğinde ilerler.*
