/*
 * CWE-480 · CWE-670 — "Derleyici susar" doğru mu?
 *
 * Sınanan iddialar (düzeltmeden önceki hâlleri):
 *   480   "Kod derlenir, uyarı vermez, çalışır." · "Neden derleyici susar"
 *   670   "Girinti okuyucuyu kandırır, derleyici girintiye bakmaz."
 *
 * Sonuç (gcc 16.2 ve clang 22.1, x86-64):
 *   -Wall UYARIYOR:   if (x = 5)                     suggest parentheses around assignment
 *                     if (a & b == c)                 suggest parentheses around comparison in operand of '&'
 *                     if (p != 0 & p->deger > 0)      aynı uyarı (yalnız gcc)
 *                     parantezsiz if'in ikinci satırı misleading indentation
 *   -Wextra ekliyor:  case'in sonunda break yok       this statement may fall through (yalnız gcc)
 *   UYARMIYOR:        if (kullanici_yetkili & yonetici_modu)        meşru bir bit maskesi de olabilir
 *                     (current->uid = 0), 2003'teki satır           fazladan parantez uyarıyı susturur
 *
 * Çalıştır:  gcc   -Wall -Wextra -c -o /dev/null derleyici_uyarilari.c
 *            clang -Wall -Wextra -c -o /dev/null derleyici_uyarilari.c
 */
struct P { int deger; };
struct gorev { int uid; } *current;
int hata_yaz(void);

int f(int x, int a, int b, int c, int kullanici_yetkili, int yonetici_modu,
      struct P *p, int options, int kontrol_basarisiz) {
    int r = 0;
    if (x = 5) r++;                                      /* 480: = yerine == */
    if (a & b == c) r++;                                 /* 480 / 783: öncelik */
    if (kullanici_yetkili & yonetici_modu) r++;          /* 480: && yerine & — uyarı YOK */
    if (p != 0 & p->deger > 0) r++;                      /* 480: kısa devre kaybı */
    if ((options == (1 | 2)) && (current->uid = 0)) r++; /* 2003 — uyarı YOK */
    if (kontrol_basarisiz)
        hata_yaz();
        return -1;                                       /* 670 / 483: blokta değil */
    switch (x) { case 1: r++; case 2: r--; break; }      /* 670 / 484: eksik break */
    return r;
}
