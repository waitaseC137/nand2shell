# 📚 Konu Anlatımları

> NandGame ile şalterden bilgisayara giden dersler ve bu derslerde karşına çıkan zayıflıkların kataloğu.

---

## 🔌 Şalterden Bilgisayara (NAND'dan CPU'ya)

> 🚧 **Bu kurs yazım aşamasında** — NandGame yolculuğundan doğdu; **aritmetik, yönlendirme ve ALU üniteleri tamamlandı, Memory ünitesi sürüyor** (21 dosya: 00–17, ara dersler dâhil): şalter/röleden toplayıcıya, çıkarıcıya, bayraklara (ZF/SF), veri yönlendirmeye (multiplexer), hesap çekirdeğine (ALU) ve ilk hafıza devrelerine (SR Latch, D Latch) kadar. Devamı (hafızanın geri kalanı, saat, kontrol birimi) NandGame ilerledikçe eklenecek.
>
> 🧭 **Yeni mi başlıyorsun?** → [00_buradan_basla.md](./salterden_bilgisayara/00_buradan_basla.md) — işlemciyi "nedir?" diye değil, **parçalarından kurarak** öğrenmek isteyenler için. Burası işçiyi transistörden kurar: assembly'de yazılan her emrin altındaki devreyi.

| Dosya | Konular |
|---|---|
| [00_buradan_basla.md](./salterden_bilgisayara/00_buradan_basla.md) | Kurs haritası; şalterden CPU'ya yolculuk |
| [01_akim_salter_role.md](./salterden_bilgisayara/01_akim_salter_role.md) | Akım, şalter, röle — ilk "mantık" |
| [01.5_yasak_bolge.md](./salterden_bilgisayara/01.5_yasak_bolge.md) | **Ara ders:** gerilim ve gürültü payı, yasak bölge, MOSFET ve CMOS, `P ≈ C·V²·f` |
| [02_nanddan_kapilar.md](./salterden_bilgisayara/02_nanddan_kapilar.md) | NAND evrensel: NOT/AND/OR/XOR türetmek |
| [03_xor_iki_fedai.md](./salterden_bilgisayara/03_xor_iki_fedai.md) | XOR'u kurmak — "iki fedai" (OR + NAND + AND) |
| [03.5_soyutlama_merdiveni.md](./salterden_bilgisayara/03.5_soyutlama_merdiveni.md) | Kapı = kapalı kutu; bir üst kata çıkmak |
| [04_teller_sayi_olunca.md](./salterden_bilgisayara/04_teller_sayi_olunca.md) | Tellere değer biçmek; jeton mantığı |
| [05_half_adder.md](./salterden_bilgisayara/05_half_adder.md) | XOR+AND = toplamın tohumu (sum + carry) |
| [06_full_adder.md](./salterden_bilgisayara/06_full_adder.md) | a+b+carry-in; iki half adder = ALU'nun iskeleti |
| [07_multibit_adder.md](./salterden_bilgisayara/07_multibit_adder.md) | Zinciri kurmak; carry-in ile carry-out **aynı tel** |
| [08_increment.md](./salterden_bilgisayara/08_increment.md) | 16-bit demet · taşma · kimsenin bakmadığı tel (carry flag) |
| [08.5_sayac_basa_donunce.md](./salterden_bilgisayara/08.5_sayac_basa_donunce.md) | **Ara ders:** modüler aritmetik, `ℤ/2ⁿℤ` ve taşmanın matematiği |
| [09_subtraction.md](./salterden_bilgisayara/09_subtraction.md) | İkinin tümleyeni; toplayıcıya çıkarma yaptırmak |
| [10_bayraklar.md](./salterden_bilgisayara/10_bayraklar.md) | ZF ve SF; makinenin "eğer" demesi — `cmp`'in altındaki devre |
| [11_selector_switch.md](./salterden_bilgisayara/11_selector_switch.md) | Selector & Switch; veri/kontrol teli ayrımı, multiplexer |
| [12_logic_unit.md](./salterden_bilgisayara/12_logic_unit.md) | Logic Unit; emir bir sayıdır, dört işlemden birini seçmek |
| [13_arithmetic_unit.md](./salterden_bilgisayara/13_arithmetic_unit.md) | Arithmetic Unit; seçiciyi girişe taşımak, sabiti imal etmek |
| [14_alu.md](./salterden_bilgisayara/14_alu.md) | ALU; kontrol sözcüğü, bayrakların operandı değiştirmesi |
| [15_condition.md](./salterden_bilgisayara/15_condition.md) | Condition; vana olarak AND, trikotomi ve OF borcunun kapanması |
| [16_sr_latch.md](./salterden_bilgisayara/16_sr_latch.md) | SR Latch; geri besleme, ters çevirme sayısı: hafıza mı salınım mı |
| [17_d_latch.md](./salterden_bilgisayara/17_d_latch.md) | D Latch; SR Latch'in önüne çevirmen, yasak satırın kararlı hâlde imkânsızlaşıp zaman kuralına dönmesi, neden select değil |
| [18_data_flip_flop.md](./salterden_bilgisayara/18_data_flip_flop.md) | Data Flip-Flop; saat, almak ile göstermeyi ayırmak, iki kapının asla aynı anda açık olmaması, bileşen ile nand sayısı |
| [19_register.md](./salterden_bilgisayara/19_register.md) | Register; bir sayının hafızası, veri telleri ayrı ve kontrol telleri ortak, bitlerin aynı anda değişmesi |
| [20_counter.md](./salterden_bilgisayara/20_counter.md) | Counter; her zilde bir adım, aynı adı taşıyan iki telin farklı görevi, döngünün neden bir kez döndüğü |

---

## 👾 CWE Haritası

> Derslerde karşına çıkan zayıflık türlerinin tek yerde toplandığı sayfa. Derslerdeki **👾 Meraklısına** bağlantıları buraya çıkar.

| Dosya | Konular |
|---|---|
| [README.md](./cwe/README.md) | CWE nedir, CVE nedir, farkları · zincirler · Şalterden Bilgisayara derslerinin CWE'leri |

---
