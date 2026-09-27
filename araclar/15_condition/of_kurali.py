#!/usr/bin/env python3
"""15 · Condition — OF kuralını 4 bitin bütün (a, b) çiftleriyle sınar.
Kural: a − b için OF = 1 ⟺ a ile b'nin işareti farklı VE sonucun işareti a'nınkinden farklı.
Beklenen çıktı: 256 çiftte uyuşmazlık: 0.   Çalıştır: python3 of_kurali.py"""
def isaretli(v): v &= 0xF; return v - 16 if v & 8 else v
uyusmazlik = 0
for a in range(-8, 8):
    for b in range(-8, 8):
        tasma = not (-8 <= a - b <= 7)
        kural = ((a < 0) != (b < 0)) and ((isaretli(a - b) < 0) != (a < 0))
        uyusmazlik += (kural != tasma)
print("256 çiftte uyuşmazlık:", uyusmazlik)
