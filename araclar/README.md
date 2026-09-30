# 🧰 Araçlar — Derslerdeki İddiaları Sınamak İçin

> Bu klasördeki her dosya, [Şalterden Bilgisayara](../konu_anlatimlari/salterden_bilgisayara/)
> serisindeki **belirli bir cümleyi** sınamak için yazıldı. Genel amaçlı araçlar
> değiller. Bir ders "şart", "yeter", "olamaz" ya da "simüle edildi" diyorsa, o
> cümlenin arkasındaki sınama burada durur ve herkes kendi makinesinde
> tekrarlayabilir.

📘 English: [README.en.md](./README.en.md)

---

## Neden Var

Dersler tek başına, yapay zekâyla birlikte öğrenilerek yazılıyor. Öğrenen de
yanındaki yapay zekâ da aynı yanlış cümleyi "mantıklı" bulabiliyor. Bu yüzden kural
şu: **hakem ne yazan, ne yapay zekâ, ne de ikinci bir yapay zekâ. Hakem oyun ve
simülasyon.**

Buradaki araçlar o hakemliğin makinede yapılabilen kısmı. Oyunun kendisiyle ilgili
iddialar (bir bağlantıya izin veriyor mu, bir parçayı kaç nand sayıyor) yalnızca
oyunda sınanabiliyor. Onlar elle, oyunda denendi ve ekran görüntüsüyle karara
bağlandı.

---

## Kurulum

| araç | ne için | kurulum |
|---|---|---|
| **Python 3** | bütün `.py` dosyaları; yalnızca standart kütüphane | çoğu sistemde hazır |
| **gcc** ya da **clang** | `08-09_c/` ve `12_c/` içindeki `.c` dosyaları | Arch: `pacman -S gcc clang` · Debian/Ubuntu: `apt install gcc clang` |
| **iverilog** (Icarus Verilog) | `16-17_latch/verilog/` | Arch: `pacman -S iverilog` · Debian/Ubuntu: `apt install iverilog` |
| **Digital** | yalnızca `15_condition/digital/` | Java + [Digital](https://github.com/hneemann/Digital); `Digital.jar` yolu `DIGITAL_JAR` ile verilebilir |
| **yosys** | henüz kullanılmadı | kuruldu, aşağıda neden durduğu yazıyor |

---

## Hangi Ders, Hangi İddia, Hangi Araç

| ders | sınanan iddia | dosya | sonuç | derse etkisi |
|---|---|---|---|---|
| 06 · Full Adder | "OR'lu ve XOR'lu çözüm birebir aynı davranır"; "iki elde aynı anda 1 olamaz" | `06_full_adder/fa_gecis.py` | kararlı durumda doğru; ama `abc` 011 → 111 ve 101 → 111 geçişlerinde `h1 = h2 = 1` üç tik sürüyor: OR'lu çıkış 1'de kalıyor, XOR'lu çıkış üç tik 0'a düşüyor | "kararlı durumda" kaydı ve geçiş notu; aynı not 15'teki `xor`'a da (`X` 0000 → 8000) |
| 08 · Increment · CWE-680 | `n = 65535` iken `malloc(n + 1)` sarar mı? | `08-09_c/c_iddialar.c` | sarmaz: C 16 bitlik `n`'yi `int`'e büyütür, `n + 1 = 65536`; sarma sonuç 16 bitlik bir değişkene konunca oluyor | örnek `uint16_t boyut = n + 1` ile yazıldı |
| 08.5 · Sayaç Başa Dönünce | "`a + b > MAX` hiçbir zaman tetiklenmez" | `08-09_c/c_iddialar.c` | 16 bitlik tiplerle C'de tetikleniyor (`int`'e büyütme); 32 bitlik `unsigned int`'te hiç tetiklenmiyor | `MAX` tanımlandı, C notu eklendi |
| 09 · Subtraction · CWE-195 · 196 · 839 | İşaretli `−1` `memcpy`'ye kaç bayt olarak gider? `−1 > MAX` her zaman mı yanlış? | `08-09_c/c_iddialar.c` | 18446744073709551615 (2⁶⁴ − 1), 65535 değil; `MAX` işaretsizse (`sizeof`) kontrol tesadüfen tutuyor | örnek ve zincir tabloları düzeldi, 839'a işaretsiz `MAX` notu |
| CWE-190 | "Derleyici taşma kontrolünü siler" | `08-09_c/ub_silme.c` | `a + 1 < a` siliniyor, fonksiyon hep 0 döndürüyor; `a + b < a` silinmiyor, `b < 0`'a iniyor | örnek `a + 1 < a` oldu, `a + b` için not |
| CWE-191 | "Sonradan sormak işe yaramaz" | `08-09_c/c_iddialar.c` | `a − b < 0` işe yaramıyor; `r = a − b; r > a` sarmayı yakalıyor | cümle `a − b < 0` sorusuna daraltıldı |
| CWE-787 | `malloc(0)`'dan sonra 65536 bayt yazınca ne olur? | `08-09_c/malloc_sifir.c` | glibc 2.44: adres veriyor (24 bayt), yazma sessiz geçiyor, sonraki `malloc` "corrupted top size" deyip durduruyor; AddressSanitizer ilk taşan baytta yakalıyor | "Bozulma ancak sonra fark edilebiliyor" paragrafı |
| 08.5 · Sayaç Başa Dönünce · CWE-190 · 191 | "Toplamada taşmak için iki büyük sayı gerekir"; "hata kümesi dar" | `08.5_sayac/tasma_kumesi.py` | 16 bitte çiftlerin %49,9992'si taşıyor; ikisi de 32768'den küçükse hiç taşmıyor, `65535 + 1` taşıyor; çarpmada %99,98; 0–1000 arası sayılarla hiç taşma yok | "en az bir büyük sayı"; "`H` çiftlerin yarısı, testler küçük sayılarla yazılır" |
| CWE-190 | "Saat 137 yıl geri gider" | `08.5_sayac/tasma_kumesi.py` | 2038-01-19 03:14:07 → 1901-12-13 20:45:52: 136,1 yıl | 136 yıl |
| CWE-1261 | "2'nin kuvveti kadar sapma = tek bit dönmesi" | `08.5_sayac/tasma_kumesi.py` | tek bit dönmesi hep tam 2ᵏ fark yapıyor; ama +4096 sayıların yalnız yarısında tek bit değiştiriyor (4096 + 4096 = 8192: iki bit) | yön düzeldi: sapma bir iz, kanıt değil |
| 11 · Selector ve Switch | "Her an tam biri açık"; "ikisi aynı anda dolu olamaz" | `16-17_latch/verilog/mitre_1298.v` | MITRE'nin 1298 örneği 11'deki seçicinin birebir aynısı: `s` 1'den 0'a inerken, `d0 = d1 = 1` iken çıkış bir tik 0 | "kararlı durumda" kaydı ve kapı gecikmesi notu |
| 12 · Logic Unit | `X=0, Y=ffff` satırında `ffff` veren işlemler; `X=Y=6553` girişi dört işlemi ayırt ediyor mu? | `14_alu/alu_sayim.py` | `or`, `xor` **ve `inv X`**; `6553`'te `xor` 0 veriyor, deney ayırt edemiyor | listeye `inv X` eklendi, deney girişi `00FF`/`0F0F` oldu ([13bf01e](https://github.com/waitaseC137/nand2shell/commit/13bf01e), [f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 12 · Logic Unit · CWE-480 · 670 | "Derleyici susar"; "derleyici girintiye bakmaz" | `12_c/derleyici_uyarilari.c` | gcc 16 ve clang 22 `-Wall`: koşulda atama, `&`/`==` önceliği ve yanıltıcı girinti uyarı veriyor; gcc'de `-Wextra` eksik `break`'i de yakalıyor. Uyarmayan iki yer: meşru görünen bit maskesi ve fazladan parantezli atama (2003'teki `(current->uid = 0)`) | 480'de "Derleyici Ne Zaman Susar", 670'te "Derleyici Neden Hepsini Yakalayamaz" |
| 14 · ALU | 32 kombinasyon kaç farklı işlem, belge kaçını yazıyor? | `14_alu/alu_sayim.py` | 19 işlem · 11 belgeli · 8 listelenmemiş | ders "8 belgeli" diyordu, düzeldi ([5d7c451](https://github.com/waitaseC137/nand2shell/commit/5d7c451)) |
| 14 · ALU | "Sıfırı yanlış bayrağa bağlamak" tuzağı neye benzer? | `14_alu/sifir_tuzagi.py` | aynı belirtiyi veren 60 kurulum; `X=5, Y=3` tablosu | tuzak tam kurulumuyla yeniden yazıldı ([f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 15 · Condition | "Never ve Always tutarsa aradaki altı satır da tutar" | `15_condition/never_always.py` · `15_condition/digital/` | iki yanlış devre de iki testi geçiyor, 24 satırın 8'inde yanlış | test bölümü tek izinli satırlarla yeniden yazıldı ([5d7c451](https://github.com/waitaseC137/nand2shell/commit/5d7c451)) |
| 15 · Condition | OF kuralı: işaretler farklı **ve** sonucun işareti `a`'nınkinden farklı | `15_condition/of_kurali.py` | 256 çiftte uyuşmazlık 0 | "OF nereden biliyor?" bölümü ([f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 15 · Condition | Çıkarıcının eldesi x86'nın CF'sinin tersi; 09'daki `inc`'li yolda `B = 0` iken elde kaybolur | `15_condition/cf_borc.py` | tek geçişte 0/256 uyuşmazlık; `inc`'li yolda 16 satır, hepsi `B = 0` | "CF'yi 09'daki elde sanma" kutusu yazıldı ([7b94374](https://github.com/waitaseC137/nand2shell/commit/7b94374)), sonra x86'nın kendi sırasına bırakılıp dersten çıkarıldı; sınama duruyor |
| 16 · SR Latch | `0 0`'dan çıkışta kim kazanır; parite kuralı ne zaman geçerli; `and+and`; `or(s, q)`; neden çapraz bağlantı | `16-17_latch/sr_latch_16.py` | son kalkanın komutu kazanır; kural yalnız `1 1`'de; `and+and` 1 yazamaz | tersler kuralı ve yarış ([dc754b6](https://github.com/waitaseC137/nand2shell/commit/dc754b6)); çapraz bağlantı türetmesi ([7552a3b](https://github.com/waitaseC137/nand2shell/commit/7552a3b)) |
| 17 · D Latch | "Yasak satır fiziksel olarak imkânsız"; test tablosu; `select`'li latch | `16-17_latch/d_latch_17.py` | bir tiklik `s = r = 0` iğnesi; `d`'den 1 tik sonra inen `st` titretiyor; önce `d` çevrilirse doğru devre bozuk görünüyor | "Bir anlık iğne", tek anahtarlı test tablosu ([271d06f](https://github.com/waitaseC137/nand2shell/commit/271d06f)) |
| 17 · D Latch | `select`'li latch gecikmeye göre ne yapar; SR'li çözüm her gecikmede tutar mı; oyundaki kara kutu neden geçti? | `16-17_latch/verilog/select_latch.v` · `sr_dlatch_delays.v` · `kutu_vs_kapi.v` | üç sonuç (bit kaybı · titreme · sorunsuz); SR'li çözüm 8 düzende hatasız; tek adımda karar veren kutu biti tutuyor | "Neden Select Değil?" ([282fdbf](https://github.com/waitaseC137/nand2shell/commit/282fdbf)) |
| 17 · D Latch · CWE-1271 | İlk yazmayı beklemek pencereyi kapatır mı; reset girişli latch | `16-17_latch/reset_latch_17.py` · `verilog/reset_latch.v` | resetsiz devre ilk yazmaya kadar `x`; reset girişli devre her açılışta 1 | reset doğru anlatıldı ([144d061](https://github.com/waitaseC137/nand2shell/commit/144d061)) |
| CWE-1298 | MITRE'nin örnek kodu gerçekten iğne üretiyor mu; düzeltme satırı çalışıyor mu? | `16-17_latch/verilog/mitre_1298.v` | hatalı kodda bir tiklik 0; düzeltme satırı yazıldığı gibi geçerli Verilog değil, geçerli hâli çalışıyor | [CWE-1298](../konu_anlatimlari/cwe/cwe_1298.md) sayfası ([877b16e](https://github.com/waitaseC137/nand2shell/commit/877b16e)) |
| 18 · Data Flip-Flop | `d latch` kutuları çıplak nand'a açılınca yarış çıkıyor mu? | `18_dff/dff_sim.py` | her nand'a 1–3 tik gecikme, 400 deneme: ilk gösterimden (saklamadan sonraki ilk inişten) sonraki 9 851 adımda yanlış 0, kararsız 0; kararsızlık yalnız ilk gösterimden önce | "Kutular Açılınca" ve "Açılışta Yine Tanımsız" |

Her dosyanın başında sınadığı iddia, beklenen çıktı ve çalıştırma komutu yazıyor.

---

## Neden Bu Araçlar

**Python — "hepsini dene".** Sayılarla ilgili iddialar ("32 kombinasyonun kaçı
farklı?", "256 çiftin hepsinde tutuyor mu?") en kısa yoldan bütün girişleri tek
tek deneyerek sınanıyor. Kanıt aramaya gerek kalmıyor, sayıyorsun.

**Python — birim gecikmeli kapı simülatörü** (`16-17_latch/kapi_sim.py`). Latch'lerde
soru artık "hangi değer?" değil, "hangi **sırayla**?". Her kapının çıkışı bir tik
sonra değişince döngülerdeki titreme ve bir anlık iğneler görünür oluyor. Sınırı:
bütün kapılar **aynı** hızda. Gerçek bir çipte öyle değil.

**Digital — ikinci hakem ve göz.** 15'teki test iddiası önce Python'da sınandı. Ama
Python simülatörünü de biz yazdık, hatası bizim olabilirdi. Aynı üç devre
[Digital](https://github.com/hneemann/Digital)'de kapı kapı kuruldu ve Digital'in kendi
test motoruyla koşturuldu. Sonuç aynı çıktı. Bir de `.dig` dosyaları açılıp devre
gözle görülebiliyor.

**iverilog — farklı gecikmeler ve "tanımsız".** Python simülatörünün sınırı 17'de
önemli oldu: `select`'li latch'in sonucu kapıların **göreli** hızına bağlıydı.
iverilog her kapıya ayrı gecikme vermeye izin veriyor, ve aynı devre üç farklı sonuç
verdi. İkinci özelliği dört durumlu mantık: değeri belli olmayan bir tel `x`
gösteriyor. 1271'deki "pencere" böylece çıktıda görünür oldu. Üçüncüsü, MITRE'nin
örnek kodu Verilog'da yazılı. Kodu doğrudan çalıştırınca düzeltme satırının geçerli
Verilog olmadığı ortaya çıktı.

**gcc ve clang — C gerçekte ne yapıyor?** Derslerdeki C örnekleri 16 bitlik bir
makineyi düşünerek yazılmıştı. Ama C o makine değil: 16 bitlik sayıları toplamadan
önce `int`'e büyütür, işaretli bir sayıyı `size_t`'ye çevirirken 64 bite genişletir,
işaretli taşmayı tanımsız sayar. Bu yüzden her örnek derlenip çalıştırıldı, gerekince
derleyicinin ürettiği koda bakıldı.

**NandGame — oyunla ilgili her şey.** Oyunun ne yaptığı yalnızca oyunda
sınanabiliyor, ve bu iş elle yapıldı. Bu klasörde dosyası yok ama derslerde izi
var. 1 bitlik telin 16 bite nasıl genişletildiği, `add 16`'nın elde çıkışı, SR
Latch'te `0 0`'dan çıkış sırası, `select`'in kara kutu ve açılmış hâli bu yolla
karara bağlandı.

**yosys — kuruldu, henüz kullanılmadı.** Düşünülen iş: bir devreyi yalnızca `nand`
kapılarına indirip saymak, sonucu NandGame'in "şu kadar nand" sayısıyla
karşılaştırmak. 17'deki nand sayısı hatası oyunda ölçülerek bulundu, o yüzden
gerek kalmadı. Gerektiği gün buraya eklenecek.

---

## Dürüst Olmak Gerekirse

- Bu simülatörler fiziği değil, **basit gecikme modellerini** gösteriyor. Bir
  sonucun anlamı "bu modelde böyle". Derslerde de öyle yazıldı.
- Bir latch'in iki değer arasında bir süre asılı kalmasını hiçbiri göstermiyor.
- "Oyun kutuyu tek adımda hesaplıyor" bir **çıkarım.** Oyunun kodu okunmadı.
  `kutu_vs_kapi.v` yalnızca bu çıkarımın oyunda görülenle uyuştuğunu gösteriyor.
- C sonuçları derleyiciye, kütüphaneye ve makineye bağlı: gcc 16.2, clang 22.1,
  glibc 2.44, x86-64 (`int` 32 bit, `size_t` 64 bit). `int`'i 16 bit olan eski ya da
  gömülü bir sistemde `malloc(n + 1)` gerçekten sarar.

---

## Klasör Yapısı

```
araclar/
├── 06_full_adder/           fa_gecis.py
├── 08-09_c/                 c_iddialar.c · ub_silme.c · malloc_sifir.c
├── 08.5_sayac/              tasma_kumesi.py
├── 12_c/                    derleyici_uyarilari.c
├── 14_alu/                  alu_sayim.py (12'nin iki satırı da burada) · sifir_tuzagi.py
├── 15_condition/            never_always.py · of_kurali.py · cf_borc.py
│   └── digital/             uret.py · dig_uretici.py · 15_condition_*.dig
├── 16-17_latch/             kapi_sim.py (ortak) · sr_latch_16.py · d_latch_17.py · reset_latch_17.py
│   └── verilog/             select_latch.v · sr_dlatch_delays.v · kutu_vs_kapi.v · reset_latch.v · mitre_1298.v
└── 18_dff/                  dff_sim.py
```

Python dosyaları kendi klasörlerinin içinden çalıştırılır (`cd 16-17_latch && python3 d_latch_17.py`),
çünkü `kapi_sim.py`'yi yanlarında arıyorlar.

---

## Tuzaklar

- **Digital** etiketlerde `_` işaretini alt simge yapar; adlarda boşluk kullanıldı.
- **Digital**'in test tablosu eksi sayı okumuyor: `−3` yerine 16 bitte `65533` yazıldı.
- **Digital**, Java'nın yeni sürümlerinde `sun.misc.Unsafe` uyarısı veriyor, zararsız.
  Bacak konumları `dig_uretici.py`'nin başında, Digital 0.31'de ölçüldü.
- **iverilog**, `reset_latch.v`'de "procedural continuous assignments" uyarısı veriyor.
  Zararsız: açılış değerini zorlamak için `force` kullanılıyor.
- `select_latch.v` ile `kutu_vs_kapi.v`'de ekranın sonundaki tek değer o anın
  fotoğrafı. Titreyen devreyi görmek için tik tik ize bak.

---

*Bu klasör [Şalterden Bilgisayara](../konu_anlatimlari/salterden_bilgisayara/) serisinin parçası. Lisans: kod MIT, metin CC BY-SA 4.0 ([ana README](../README.md)).*
