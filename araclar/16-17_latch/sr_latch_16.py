#!/usr/bin/env python3
"""16 · SR Latch — dersteki döngü iddialarının sınaması.

Sınanan iddialar ve beklenen çıktı:
  1. 0 0'dan çıkış: önce s kalkarsa çıkış 1, önce r kalkarsa 0, ikisi aynı anda kalkarsa salınım.
     (Son kalkan girişin komutu kazanır. Oyunda da denendi: aynı sonuç.)
  2. and+and çapraz: ters çevirme sayısı çift (0) ama s=1 r=0'da bile 1 yazılamıyor.
     → sayı hafızanın olup olmadığını söyler, hangi değerin yazılacağını kapının türü.
  3. and+nand çapraz (tek ters çevirme): 1 0 ve 0 1'de kararlı, yalnız 1 1'de salınıyor.
     → parite kuralı yalnız girişler dinlenirken (1 1) geçerli.
  4. q = or(s, q): tek kapıyla iki durum → latch "en küçük durum makinesi" değil.
  5. Her kapı KENDİ çıkışını dinlerse: and'in çıkışı r'yi hiç duymuyor, nand kendini
     ters çevirip titriyor → çapraz bağlantı ezber değil, "çıkış iki girişi de duysun" ihtiyacı.
Çalıştır: python3 sr_latch_16.py
"""
from kapi_sim import NAND, AND, OR, run, settled

# Dersin bağlantısı: n1 = nand(s, n2)  n2 = nand(n1, r)  Output = n2
SR = {'n1': (NAND, ['s', 'n2']), 'n2': (NAND, ['n1', 'r'])}
bas = {'s': 1, 'r': 1, 'n1': 1, 'n2': 0}
print("1 · 0 0'dan çıkış")
for ad, sira in [("önce s, sonra r", [({'s': 0, 'r': 0}, 6), ({'s': 1}, 6), ({'r': 1}, 8)]),
                 ("önce r, sonra s", [({'s': 0, 'r': 0}, 6), ({'r': 1}, 6), ({'s': 1}, 8)]),
                 ("ikisi aynı anda", [({'s': 0, 'r': 0}, 6), ({'s': 1, 'r': 1}, 10)])]:
    _, iz = run(SR, bas, sira, 'n2')
    print(f"   {ad:16s} → çıkış {settled(iz)}   son tikler {iz[-8:]}")

print("2 · and+and (çift sayı) — s=1 r=0'da 1 yazılıyor mu?")
AA = {'a1': (AND, ['s', 'a2']), 'a2': (AND, ['a1', 'r'])}
for q0 in (0, 1):
    _, iz = run(AA, {'s': 1, 'r': 1, 'a1': q0, 'a2': q0}, [({'s': 1, 'r': 0}, 8)], 'a1')
    print(f"   başlangıç {q0} → çıkış {settled(iz)}   (tablo 1 istiyor)")

print("3 · and+nand (tek sayı)")
AN = {'x': (AND, ['s', 'y']), 'y': (NAND, ['x', 'r'])}
for s, r in [(1, 0), (0, 1), (1, 1)]:
    _, iz = run(AN, {'s': 1, 'r': 1, 'x': 0, 'y': 1}, [({'s': s, 'r': r}, 10)], 'x')
    print(f"   s={s} r={r} → {settled(iz)}")

print("4 · q = or(s, q), tek kapı")
_, iz = run({'q': (OR, ['s', 'q'])}, {'s': 0, 'q': 0}, [({'s': 0}, 3), ({'s': 1}, 3), ({'s': 0}, 5)], 'q')
print(f"   0'da tut → s=1 → s=0: {iz}")

print("5 · her kapı kendi çıkışını dinlerse")
KENDI = {'a': (AND, ['s', 'a']), 'n': (NAND, ['r', 'n'])}
for s, r in [(1, 0), (0, 1), (1, 1)]:
    _, iz_a = run(KENDI, {'s': 1, 'r': 1, 'a': 0, 'n': 1}, [({'s': s, 'r': r}, 10)], 'a')
    _, iz_n = run(KENDI, {'s': 1, 'r': 1, 'a': 0, 'n': 1}, [({'s': s, 'r': r}, 10)], 'n')
    print(f"   s={s} r={r}: and çıkışı {settled(iz_a)}   nand çıkışı {settled(iz_n)}")
