#!/usr/bin/env python3
"""17 · D Latch ve CWE-1271 — reset girişli D Latch.

Sınanan iddia: "Açılışta bir kez st=1 yapıp bilinen d yazmak" pencereyi kapatmaz (ilk yazma
pencerenin sonudur). Kapatan şey, değerin reset sürerken donanımla zorlanması.
Devre (kilitli = 1, rst_n aktif düşük): r = and(nand(st, d), rst_n) · s = nand(st, r, rst_n)
Beklenen çıktı: 8 açılış durumunun hepsinde reset sürerken 1, reset bitince st=0 iken d'yi
duymadan 1; reset bittikten sonra normal D Latch gibi yazıyor. Hatalı durum sayısı 0.
Resetsiz devrenin ilk yazmaya kadar "x" (tanımsız) göründüğü hâli: verilog/reset_latch.v
Çalıştır: python3 reset_latch_17.py
"""
from kapi_sim import NAND, NAND3, AND, run, settled

G = {'rr': (NAND, ['st', 'd']), 'r': (AND, ['rr', 'rst_n']), 's': (NAND3, ['st', 'r', 'rst_n']),
     'n1': (NAND, ['s', 'n2']), 'n2': (NAND, ['n1', 'r'])}
hata = 0
for q0 in (0, 1):
    for st in (0, 1):
        for d in (0, 1):
            bas = {'st': st, 'd': d, 'rst_n': 0, 'rr': 1, 'r': 0, 's': 1, 'n1': 1 - q0, 'n2': q0}
            s1, iz = run(G, bas, [({'rst_n': 0}, 10)], 'n2')
            sirasinda = settled(iz)
            _, iz2 = run(G, s1, [({'rst_n': 1, 'st': 0}, 10), ({'d': 1 - d}, 10)], 'n2')
            sonra = settled(iz2)
            iyi = sirasinda == 1 and sonra == 1; hata += not iyi
            print(f"açılış değeri {q0}, st={st} d={d}: reset sürerken {sirasinda}, reset bitince {sonra} {'✓' if iyi else '✗'}")
cur = {'st': 0, 'd': 0, 'rst_n': 1, 'rr': 1, 'r': 1, 's': 1, 'n1': 0, 'n2': 1}
sira = [({'st': 1, 'd': 0}, 10), ({'st': 0}, 10), ({'d': 1}, 10), ({'st': 1}, 10), ({'st': 0}, 10), ({'d': 0}, 10)]
beklenen = [0, 0, 0, 1, 1, 1]; gorulen = []
for adim in sira:
    cur, iz = run(G, cur, [adim], 'n2'); gorulen.append(settled(iz))
print("normal çalışma:", gorulen, "beklenen", beklenen, "✓" if gorulen == beklenen else "✗")
print("hatalı durum sayısı:", hata + (gorulen != beklenen))
