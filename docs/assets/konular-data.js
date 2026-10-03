/* ============================================================
   Konu Anlatımları — içerik ağacı
   base: konu_anlatimlari/
   ============================================================ */
window.KONULAR = {
  base: "konu_anlatimlari/",
  categories: [
    {
      id: "salterden_bilgisayara",
      label: "Şalterden Bilgisayara (NAND'dan CPU'ya)",
      accent: "var(--d-low)",
      tag: "26 ders · Memory ünitesi tamam",
      blurb: "NandGame yolculuğundan doğan kurs — şalter/röleden NAND'a, NAND'dan mantık kapılarına, kapılardan toplayıcıya (half/full adder). İşlemciyi 'nedir' diye değil, parçalarından kendin kurarak öğren. Aritmetik (00–10), yönlendirme (11), ALU (12–15) ve Memory (16–21) üniteleri tamamlandı. Sırada işlemci.",
      files: [
        { f: "salterden_bilgisayara/00_buradan_basla.md",        n: "→",    t: "Buradan Başla",        h: "Kurs haritası; şalterden CPU'ya (🚧 yazılıyor)" },
        { f: "salterden_bilgisayara/01_akim_salter_role.md",     n: "01",   t: "Akım · Şalter · Röle", h: "Elektrik → şalter → röle = ilk mantık" },
        { f: "salterden_bilgisayara/01.5_yasak_bolge.md", n: "01.5", t: "Yasak Bölge", h: "ara ders: gerilim · gürültü payı · MOSFET · CMOS · P ≈ C·V²·f" },
        { f: "salterden_bilgisayara/02_nanddan_kapilar.md",      n: "02",   t: "NAND'dan Kapılar",     h: "NAND evrensel: NOT/AND/OR/XOR türet" },
        { f: "salterden_bilgisayara/03_xor_iki_fedai.md",        n: "03",   t: "XOR: İki Fedai",       h: "XOR'u OR+NAND+AND ile kurmak" },
        { f: "salterden_bilgisayara/03.5_soyutlama_merdiveni.md",n: "03.5", t: "Soyutlama Merdiveni",  h: "Kapı = kapalı kutu; bir üst kata çıkmak" },
        { f: "salterden_bilgisayara/04_teller_sayi_olunca.md",   n: "04",   t: "Teller Sayı Olunca",   h: "Tellere değer biçmek; jeton mantığı" },
        { f: "salterden_bilgisayara/05_half_adder.md",           n: "05",   t: "Half Adder",           h: "XOR+AND = toplamın tohumu (sum/carry)" },
        { f: "salterden_bilgisayara/06_full_adder.md",           n: "06",   t: "Full Adder",           h: "a+b+carry-in; iki half adder" },
        { f: "salterden_bilgisayara/07_multibit_adder.md",       n: "07",   t: "Multi-bit Adder",      h: "Zinciri kurmak; carry-in ile carry-out aynı tel" },
        { f: "salterden_bilgisayara/08_increment.md",            n: "08",   t: "Increment",            h: "16-bit demet · taşma · kimsenin bakmadığı tel" },
        { f: "salterden_bilgisayara/08.5_sayac_basa_donunce.md", n: "08.5", t: "Sayaç Başa Dönünce", h: "Ara ders: modüler aritmetik · ℤ/2ⁿℤ · CWE-190" },
        { f: "salterden_bilgisayara/09_subtraction.md",          n: "09",   t: "Subtraction",          h: "İkinin tümleyeni; toplayıcıya çıkarma yaptırmak" },
        { f: "salterden_bilgisayara/10_bayraklar.md",            n: "10",   t: "Bayraklar (ZF/SF)",    h: "Sıfır ve işaret; makinenin 'eğer' demesi" },
        { f: "salterden_bilgisayara/11_selector_switch.md",     n: "11",   t: "Selector & Switch",    h: "Kontrol teli · vana olarak AND · multiplexer" },
        { f: "salterden_bilgisayara/12_logic_unit.md",          n: "12",   t: "Logic Unit",           h: "Emir bir sayıdır · hepsi hesaplanır, biri seçilir" },
        { f: "salterden_bilgisayara/13_arithmetic_unit.md",     n: "13",   t: "Arithmetic Unit",      h: "Seçiciyi girişe taşımak · 16 bitlik sabiti imal etmek" },
        { f: "salterden_bilgisayara/14_alu.md",                 n: "14",   t: "ALU",                  h: "Kontrol sözcüğü · işlemi değil malzemeyi değiştirmek" },
        { f: "salterden_bilgisayara/15_condition.md",           n: "15",   t: "Condition",            h: "Vana olarak AND · trikotomi · N XOR OF" },
        { f: "salterden_bilgisayara/16_sr_latch.md",            n: "16",   t: "SR Latch",             h: "Geri besleme · çift ters hafıza, tek ters salınım" },
        { f: "salterden_bilgisayara/17_d_latch.md",             n: "17",   t: "D Latch",              h: "Hafızanın kapıcısı · yasak satır zaman kuralına döner · neden select değil · şeffaf latch" },
        { f: "salterden_bilgisayara/18_data_flip_flop.md",      n: "18",   t: "Data Flip-Flop",       h: "Saat · almak ile göstermeyi ayırmak · alıcı ile vitrin · kutular insan için, nand'lar çip için" },
        { f: "salterden_bilgisayara/19_register.md",            n: "19",   t: "Register",             h: "Bir sayının hafızası · veri telleri ayrı, kontrol telleri ortak · bitler aynı zilde" },
        { f: "salterden_bilgisayara/20_counter.md",             n: "20",   t: "Counter",              h: "Her zilde bir adım · seçim teli ile yazma izni · PC ← PC + 1 artık bir kez" },
        { f: "salterden_bilgisayara/21_ram.md",                 n: "21",   t: "RAM",                  h: "Numarası olan sözcükler · register adres bilmez · yazarken dağıt, okurken topla" },
        { f: "salterden_bilgisayara/21.5_sayi_mi_komut_mu.md",  n: "21.5", t: "Sayı mı, Komut mu?",   h: "Ara ders: kontrol telleri nereden gelir · zil · döngü · saklanmış program" }
      ]
    },
    {
      id: "cwe",
      label: "👾 CWE Haritası",
      accent: "var(--magenta)",
      tag: "meraklısına",
      blurb: "Derslerde karşına çıkan zayıflık türleri: CWE ile CVE farkı, zincirler ve her zayıflığın kendi sayfası — ne olduğu, hangi devrede doğduğu, gerçek hayatta ne yaptığı, nasıl önlendiği.",
      files: [
        { f: "cwe/README.md",  n: "→",   t: "CWE Haritası",      h: "CWE nedir, CVE nedir, farkları · hangi ders hangi CWE" },
        { f: "cwe/cwe_190.md", n: "190", t: "Integer Overflow",  h: "BEC Token · Y2038 · Boeing 787 · Pac-Man" },
        { f: "cwe/cwe_191.md", n: "191", t: "Integer Underflow", h: "0 − 1 · MITRE vakaları · Gandhi efsanesi" },
        { f: "cwe/cwe_680.md", n: "680", t: "Overflow → Buffer Overflow", h: "iki kutu modeli · Stagefright" },
        { f: "cwe/cwe_787.md", n: "787", t: "Out-of-bounds Write", h: "bellekte taban yok · ayır(0)" },
        { f: "cwe/cwe_681.md", n: "681", t: "Hatalı Tip Dönüşümü", h: "Ariane 5 · ölü kod" },
        { f: "cwe/cwe_196.md", n: "196", t: "İşaretsiz → İşaretli Dönüşüm", h: "aynı desen, yeni okuyucu · zincirin ilk halkası" },
        { f: "cwe/cwe_839.md", n: "839", t: "Alt Sınırsız Aralık Kontrolü", h: "tavana bakıldı, taban boş · eksi sipariş" },
        { f: "cwe/cwe_195.md", n: "195", t: "İşaretli → İşaretsiz Dönüşüm", h: "hata değeri boyut sanılınca · CVE-2025-27363" },
        { f: "cwe/cwe_1300.md", n: "1300", t: "Fiziksel Yan Kanal", h: "akım · elektromanyetik dalga · ses" },
        { f: "cwe/cwe_1247.md", n: "1247", t: "Voltaj ve Saat Sıçraması", h: "fault attack · Xbox 360 reset glitch" },
        { f: "cwe/cwe_1261.md", n: "1261", t: "Tek Olay Bozulması", h: "bit dönmesi · Belçika 4096 · Mario 64" },
        { f: "cwe/cwe_480.md", n: "480", t: "Yanlış İşleç", h: "& ile && · 2003 çekirdek girişimi · = ile ==" },
        { f: "cwe/cwe_193.md", n: "193", t: "Off-by-one", h: "çit direği · 10 aralık 11 direk · tek bayt yeter" },
        { f: "cwe/cwe_194.md", n: "194", t: "İşaret Uzatması", h: "dar → geniş · 0xFF neden −1 olur" },
        { f: "cwe/cwe_197.md", n: "197", t: "Kırpma", h: "geniş → dar · üst bitler sessizce gider · Y2K" },
        { f: "cwe/cwe_682.md", n: "682", t: "Hatalı Hesap (sütun)", h: "190/191/193'ün çatısı · Pillar → Class → Base → Variant" },
        { f: "cwe/cwe_1384.md", n: "1384", t: "Fiziksel Koşullar (sınıf)", h: "1247 + 1261'in çatısı · kasıtlı sıçrama vs parçacık" },
        { f: "cwe/cwe_704.md", n: "704", t: "Tip Dönüşümü (sınıf)", h: "681'in üstü · Type Confusion dalı" },
        { f: "cwe/cwe_362.md", n: "362", t: "Yarış Koşulu (sınıf)", h: "367'nin üstü · yazılım ve donanımın buluştuğu çatı" },
        { f: "cwe/cwe_1023.md", n: "1023", t: "Eksik Karşılaştırma (sınıf)", h: "839'un üstü · kontrol var ama kapsamı eksik" },
        { f: "cwe/cwe_670.md", n: "670", t: "Hatalı Akış (sınıf)", h: "480'in üstü · niyet ile kodun ayrışması" },
        { f: "cwe/cwe_697.md", n: "697", t: "Hatalı Karşılaştırma (sütun)", h: "682'nin kardeşi · neyi · yeterince mi · nasıl" },
        { f: "cwe/cwe_1242.md", n: "1242", t: "Chicken Bits", h: "belgelenen uzay ⊂ gerçek uzay · vazgeçme biti" },
        { f: "cwe/cwe_1254.md", n: "1254", t: "Karşılaştırma Tanecikliği", h: "erken çıkış süreyi sızdırır · sabit zamanlı kıyas" },
        { f: "cwe/cwe_119.md", n: "119", t: "Tampon Sınırları (sınıf)", h: "787'nin üstü · dört köşe: oku/yaz × önce/sonra" },
        { f: "cwe/cwe_1245.md", n: "1245", t: "Hatalı Durum Makinesi", h: "iki durumlu durum makinesi · don't care satırı · ① ve ② katman" },
        { f: "cwe/cwe_1271.md", n: "1271", t: "Reset'te Tanımsız Kilit", h: "kimse seçmeden uyanmak · ilk yazma pencerenin sonu" },
        { f: "cwe/cwe_1298.md", n: "1298", t: "Donanımda Yarış", h: "aynı telden iki yol · geçici iğne, kalıcı hata · MITRE'nin seçicisi" }
      ]
    }
  ]
};
