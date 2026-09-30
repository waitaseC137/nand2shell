/*
 * 08 · CWE-680 · CWE-787 — malloc(0)'dan sonra 65536 bayt yazınca ne oluyor?
 *
 * Sınanan iddialar:
 *   08 / 680   uint16_t boyut = n + 1 (n = 65535) → 0 → malloc(0)
 *   787        "Sistem 0 bayt için olmaz demiyor, geçerli bir adres veriyor.
 *               Yazma işlemleri başarılı oluyor, program duraksamıyor bile."
 *
 * Sonuç (glibc 2.44, x86-64):
 *   malloc(0) gerçek bir adres döndürüyor (glibc'de kullanılabilir alan 24 bayt).
 *   65536 bayt yazılıyor, yazarken hata yok, program çalışmaya devam ediyor.
 *   Bozulma sonra fark ediliyor: sonraki malloc "malloc(): corrupted top size"
 *   deyip programı durduruyor (çıkış kodu 134).
 *   AddressSanitizer ile derlenince ilk taşan baytta durdurur: heap-buffer-overflow.
 *   C standardı malloc(0) için NULL döndürmeye de izin verir; o zaman ilk yazmada çöker.
 *
 * Çalıştır:  gcc -O0 -o malloc_sifir malloc_sifir.c && ./malloc_sifir; echo "çıkış: $?"
 *            gcc -O0 -g -fsanitize=address -o malloc_sifir_asan malloc_sifir.c && ./malloc_sifir_asan
 */
#include <malloc.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    uint16_t n = 65535;
    uint16_t boyut = n + 1;                  /* 65536 16 bite sığmaz: 0 */
    char *buf = malloc(boyut);
    printf("boyut = %u · malloc(0) -> %p · glibc'nin verdiği gerçek alan: %zu bayt\n",
           boyut, (void *)buf, buf ? malloc_usable_size(buf) : 0);
    fflush(stdout);
    for (int i = 0; i <= n; i++)
        buf[i] = 'A';                        /* 65536 kez yazıyor */
    printf("65536 bayt yazıldı, program hâlâ çalışıyor\n");
    fflush(stdout);
    char *sonraki = malloc(100);             /* bellek yöneticisine bir sonraki istek */
    printf("sonraki malloc(100) -> %p\n", (void *)sonraki);
    return 0;
}
