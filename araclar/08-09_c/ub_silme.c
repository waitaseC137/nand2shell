/*
 * CWE-190 — "Derleyici taşma kontrolünü siler"
 *
 * Sınanan iddia: işaretli taşma C'de tanımsız davranış (UB). Derleyici taşmanın
 * olmadığını varsayabildiği için, taşmayı yakalamak için yazılmış bir kontrolü
 * silebilir.
 *
 * Sonuç (gcc 16.2 ve clang 22.1, -O2, x86-64):
 *   a + 1 < a   tamamen siliniyor. Fonksiyon her zaman 0 döndürüyor:  xor eax, eax
 *   a + b < a   silinmiyor, b < 0'a indirgeniyor:  mov eax, esi / sar eax, 31
 *               Kontrol artık taşmayı değil, b'nin eksi olup olmadığını soruyor.
 *               Sonuç aynı: taşma hiçbir zaman yakalanmıyor.
 *
 * Çalıştır:  gcc   -O2 -S -masm=intel -o - ub_silme.c
 *            clang -O2 -S -masm=intel -o - ub_silme.c
 */
int kontrol_1(int a)        { if (a + 1 < a) return -1; return 0; }
int kontrol_b(int a, int b) { if (a + b < a) return -1; return 0; }
