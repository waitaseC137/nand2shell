#!/usr/bin/env python3
"""17 · D Latch — gecikmenin ortaya çıkardığı üç şey.

Sınanan iddialar ve beklenen çıktı:
  1. "Yasak satır fiziksel olarak imkânsız" değil, KARARLI DURUMDA imkânsız: st=1 iken d 0'dan
     1'e geçince bir tik boyunca s=r=0 oluyor (ters d bir kapı geç geliyor). inv'li ve inv'siz
     iki çözümde de "VAR".
  2. d'den k tik sonra st inerse: k=1'de salınım, k≥2'de sorunsuz → zaman kuralı (setup/hold).
  3. Test tablosunda bir adımda iki giriş birden değişirse (1 0 → 0 1): önce d çevrilirse
     doğru devre 0 yerine 1 gösteriyor. Ders bu yüzden her adımda tek anahtar değiştiriyor.
  4. select'li latch parçalarına açıkken st inince salınıyor; and(d, çıkış) terimi (Earle)
     eklenince kararlı. Farklı gecikmelerle sınama: verilog/select_latch.v
Çalıştır: python3 d_latch_17.py
"""
from kapi_sim import NAND, NAND3, AND, INV, run, settled, settle

D_INV = {'i': (INV, ['d']), 's': (NAND, ['st', 'i']), 'r': (NAND, ['st', 'd']),      # dersin ilk çözümü
         'n1': (NAND, ['s', 'n2']), 'n2': (NAND, ['n1', 'r'])}
D_OPT = {'r': (NAND, ['st', 'd']), 's': (NAND, ['st', 'r']),                         # inv'siz çözüm
         'n1': (NAND, ['s', 'n2']), 'n2': (NAND, ['n1', 'r'])}

print("1 · st=1, d 0→1: (s, r) tik tik")
for ad, G in [("inv'li", D_INV), ("inv'siz", D_OPT)]:
    cur = settle(G, {'st': 1, 'd': 0}, 'n2'); cur['d'] = 1; iz = []
    for _ in range(6):
        new = dict(cur)
        for g, (f, ins) in G.items(): new[g] = f(*[cur[i] for i in ins])
        cur = new; iz.append((cur['s'], cur['r']))
    print(f"   {ad:8s} {iz}  → s=r=0 anı: {'VAR' if (0, 0) in iz else 'yok'}")

print("2 · d kalktıktan k tik sonra st iner")
for ad, G in [("inv'li", D_INV), ("inv'siz", D_OPT)]:
    for k in range(0, 5):
        st = settle(G, {'st': 1, 'd': 0}, 'n2')
        sira = [({'d': 1}, k), ({'st': 0}, 12)] if k > 0 else [({'d': 1, 'st': 0}, 12)]
        _, iz = run(G, st, sira, 'n2')
        print(f"   {ad:8s} k={k}: çıkış {settled(iz)}")

print("3 · test tablosunda 1 0 → 0 1, anahtarlar tek tek (beklenen 0)")
for ad, G in [("inv'li", D_INV), ("inv'siz", D_OPT)]:
    for sira in (["st", "d"], ["d", "st"]):
        st = settle(G, {'st': 1, 'd': 0}, 'n2')
        hedef = {'st': 0, 'd': 1}
        _, iz = run(G, st, [({sira[0]: hedef[sira[0]]}, 10), ({sira[1]: hedef[sira[1]]}, 10)], 'n2')
        print(f"   {ad:8s} önce {sira[0]:2s} sonra {sira[1]:2s} → {settled(iz)}")

print("4 · select'li latch: st=1 d=1 yaz, sonra st=0")
SEL = {'ns': (INV, ['st']), 'a': (NAND, ['st', 'd']), 'b': (NAND, ['ns', 'q']), 'q': (NAND, ['a', 'b'])}
EARLE = {'ns': (INV, ['st']), 'a': (NAND, ['st', 'd']), 'b': (NAND, ['ns', 'q']), 'c': (NAND, ['d', 'q']),
         'q': (NAND3, ['a', 'b', 'c'])}
for ad, G in [("select, parçalarına açık", SEL), ("select + and(d, çıkış) (Earle)", EARLE)]:
    st = settle(G, {'st': 1, 'd': 1}, 'q')
    _, iz = run(G, st, [({'st': 0}, 14)], 'q')
    print(f"   {ad:31s} → {settled(iz)}   {iz}")
