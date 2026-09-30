/*
 * 08 · 08.5 · 09 ve bağlı CWE sayfaları — C örnekleri gerçekte ne yapıyor?
 *
 * Sınanan iddialar:
 *   08 / CWE-680   n = 65535 iken malloc(n + 1) sarar mı?
 *                  C, 16 bitlik n'yi toplamadan önce int'e büyütür: n + 1 = 65536,
 *                  sarma yok. Sarma, sonuç 16 bitlik bir değişkene konunca olur.
 *   08.5           "a + b > MAX hiçbir zaman tetiklenmez"
 *                  16 bitlik tiplerle C'de tetiklenir (yine int'e büyütme);
 *                  32 bitlik unsigned int'te birebir doğru.
 *   09 / 195 / 196 / 839
 *                  İşaretli −1, memcpy'ye kaç bayt olarak gider?
 *                  memcpy uzunluğu size_t (64 bit) okur: 18446744073709551615, 65535 değil.
 *   839            "−1 > MAX her zaman yanlış"
 *                  MAX işaretli bir sabitse doğru. MAX işaretsizse (sizeof) C −1'i
 *                  işaretsize çevirir ve kontrol tesadüfen tutar.
 *   191            "sonradan sormak işe yaramaz"
 *                  a − b < 0 gibi bir soru işe yaramaz (işaretsiz sonuç hiç eksi olmaz),
 *                  ama r = a − b; r > a sarmayı yakalar.
 *
 * Beklenen çıktı (x86-64 Linux, gcc ya da clang):
 *   08  uint16_t n: n + 1 = 65536 · uint16_t boyut = n + 1 → 0 · 32 bit UINT_MAX + 1 = 0
 *   08.5  16 bit 60000 + 10000 > 65535 → 1 · 32 bit a + b > UINT_MAX → 0 · a > UINT_MAX − b → 1
 *   09  short len = 65535 → −1 · len > 1024 → 0 · (size_t)len = 18446744073709551615
 *   839  len > 1024 → 0 · len > sizeof buf → 1
 *   191  0 − 1 = 18446744073709551615 · r = 3 − 5 > 3 → 1
 *
 * Çalıştır:  gcc -std=c17 -Wall -Wextra -o c_iddialar c_iddialar.c && ./c_iddialar
 *            -Wextra, 839 satırı için -Wsign-compare uyarısı verir. O uyarı da
 *            iddianın parçası: derleyici tesadüfen tutan kontrolü işaretliyor.
 */
#include <limits.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

int main(void) {
    puts("== 08 / CWE-680: malloc(n + 1), n = 65535");
    uint16_t n = 65535;
    printf("uint16_t n:        n + 1 = %d            (int'e büyütüldü, sarma yok)\n", n + 1);
    uint16_t boyut = n + 1;
    printf("uint16_t boyut = n + 1  ->  boyut = %u     (65536 16 bite sığmadı)\n", boyut);
    unsigned int m = UINT_MAX;
    printf("32 bit: unsigned m = UINT_MAX: m + 1 = %u\n\n", m + 1);

    puts("== 08.5: if (a + b > MAX)");
    uint16_t a16 = 60000, b16 = 10000;
    printf("16 bit: 60000 + 10000 > 65535 ?  %d   (toplam %d: int'e büyüdü, kontrol TETİKLENİYOR)\n",
           a16 + b16 > 65535, a16 + b16);
    unsigned int a = 4000000000u, b = 400000000u;
    printf("32 bit: a + b > UINT_MAX ?       %d   (toplam sarmış: %u)\n", a + b > UINT_MAX, a + b);
    printf("32 bit: a > UINT_MAX - b ?       %d   (taşmadan önce sorulmuş kontrol)\n\n", a > UINT_MAX - b);

    puts("== 09 / 195 / 196: işaretli -1 ve memcpy");
    short len = (short)65535;
    printf("short len = 65535  ->  len = %d\n", len);
    printf("len > 1024 ?  %d   (kontrol geçiyor)\n", len > 1024);
    printf("memcpy'nin gördüğü (size_t)len = %zu\n", (size_t)len);
    int eksi = -1;
    size_t s = eksi;
    printf("195: int -1 -> size_t = %zu\n", s);
    unsigned short us = 65535;
    short sh = us;
    printf("196: unsigned short 65535 -> short = %d\n\n", sh);

    puts("== 839: -1 > MAX");
    char buf[1024];
    int ln = -1;
    printf("MAX = 1024 (işaretli sabit):  -1 > 1024 ?       %d   (eksi değer geçiyor)\n", ln > 1024);
    printf("MAX = sizeof buf (işaretsiz): -1 > sizeof buf ? %d   (-1 dev bir sayıya döndü, tesadüfen tutuyor)\n\n",
           ln > sizeof buf);
    (void)buf;

    puts("== 191: sonradan sormak");
    size_t sifir = 0;
    printf("size_t len = 0: len - 1 = %zu\n", sifir - 1);
    unsigned int x = 3, y = 5, r = x - y;
    printf("r = 3 - 5 = %u:  r > 3 ?  %d   (sarmayı sonradan da yakalıyor)\n", r, r > x);
    return 0;
}
