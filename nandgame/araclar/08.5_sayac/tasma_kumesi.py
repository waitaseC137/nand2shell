#!/usr/bin/env python3
"""
08.5 · Sayaç Başa Dönünce ve bağlı CWE sayfaları — taşma matematiği

Sınanan iddialar:
  08.5 / CWE-191  "Toplamada taşmak için iki büyük sayı gerekir"
                  Karşı örnek 65535 + 1. Gereken: sayılardan EN AZ BİRİ büyük olsun
                  (16 bitte 32768 ya da üstü). İkisi de küçükse toplam hiç taşmaz.
  08.5            "Çarpmada iki orta sayı yeter" · "H kümesi çarpmada çok daha büyük"
  CWE-190         "Hata kümesi dardır"
                  16 bitte bütün (a, b) çiftlerinin yarısı toplamada taşıyor. Dar olan
                  küme değil, testlerde kullanılan küçük sayılar.
  CWE-190         "Saat 137 yıl geri gider" (32 bitlik işaretli zaman sayacı)
  CWE-1261        "2'nin bir kuvveti kadar sapma = tek bit dönmesi"
                  Doğru yön: tek bit dönmesi sayıyı tam 2'nin bir kuvveti kadar değiştirir.
                  Ters yön her zaman doğru değil: 4096 + 4096 = 8192 iki bit değiştirir.

Beklenen çıktı:
  toplama: 2147450880 / 4294967296 çift taşıyor (%49.9992) · ikisi de < 32768 iken 0
  çarpma:  4294099268 / 4294967296 çift taşıyor (%99.98) · 256 × 256 = 65536 taşıyor
  0–1000 arası sayılarla: toplamada 0 taşma
  2038-01-19 03:14:07 UTC → 1901-12-13 20:45:52 UTC · 136.1 yıl
  +4096 tek bit değiştiriyor: 32768 / 65536 sayıda (yarısı) · 4096 + 4096: 2 bit

Çalıştır:  python3 tasma_kumesi.py
"""
from datetime import datetime, timedelta, timezone

N = 16
M = 1 << N          # 65536
MAX = M - 1

# 1) Toplama: kaç çift taşıyor? (b, 65536 − a ile 65535 arasındaysa taşar → a tane b)
toplama = sum(a for a in range(M))
print(f"toplama: {toplama} / {M * M} çift taşıyor (%{100 * toplama / (M * M):.4f})")
yarim = M // 2
kucuk_tasma = sum(max(0, a - (M - yarim)) for a in range(yarim))  # ikisi de < 32768
print(f"  ikisi de < {yarim} iken taşan çift: {kucuk_tasma}  (en büyük toplam {2 * (yarim - 1)})")
print(f"  karşı örnek: 65535 + 1 = {(MAX + 1) % M}  (biri büyük, öbürü 1)")

# 2) Çarpma: a · b ≤ 65535 olan çiftleri say, gerisi taşar
tasmayan = M + sum(MAX // a + 1 for a in range(1, M))   # a = 0 satırı hep taşmaz
carpma = M * M - tasmayan
print(f"çarpma:  {carpma} / {M * M} çift taşıyor (%{100 * carpma / (M * M):.2f})")
print(f"  iki orta sayı: 256 × 256 = {256 * 256} → taşar mı? {256 * 256 > MAX}")

# 3) Testlerin kullandığı küçük sayılar
kucuk = sum(1 for a in range(1001) for b in range(1001) if a + b > MAX)
print(f"0–1000 arası sayılarla toplamada taşan çift: {kucuk}")

# 4) 32 bitlik işaretli zaman: en büyük değer ve +1 saniye
epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
son = epoch + timedelta(seconds=2**31 - 1)
basa = epoch + timedelta(seconds=-2**31)
fark = (son - basa).total_seconds()
print(f"{son:%Y-%m-%d %H:%M:%S} UTC → {basa:%Y-%m-%d %H:%M:%S} UTC · "
      f"{fark / (365.2425 * 86400):.1f} yıl geri")

# 5) Tek bit dönmesi ve 2'nin kuvveti
tek = sum(1 for x in range(M) if bin(x ^ ((x + 4096) % M)).count("1") == 1)
print(f"+4096 tek bit değiştiriyor: {tek} / {M} sayıda")
print(f"  4096 + 4096 = 8192: değişen bit sayısı {bin(4096 ^ 8192).count('1')}")
print(f"  bit 12 dönerse fark: {abs((5 ^ (1 << 12)) - 5)}  (hep tam 4096)")
print(f"  C5 → C4: değişen bit sayısı {bin(0xC5 ^ 0xC4).count('1')}")
