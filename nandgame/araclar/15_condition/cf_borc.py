#!/usr/bin/env python3
"""15 · Condition (ve 09 · Subtraction) — çıkarıcının eldesi ile x86'nın CF'si.

Sınanan iddia: A − B'yi A + ~B + 1 diye tek geçişte hesaplayan toplayıcının eldesi,
x86'nın CF'sinin (borç) tam tersidir: elde 1 ⟺ A ≥ B ⟺ borç yok.
İkinci iddia: 09'daki inc'li yol (önce inc(inv B), sonra add) B = 0 iken eldeyi kaybeder,
çünkü inv(0) = 1111 ve inc onu 0000'a sararken taşan elde inc'in içinde kalır.
Yöntem: 4 bitin 256 (A, B) çiftinin hepsi.
Beklenen çıktı: tek geçişte uymayan satır 0; inc'li yolda uymayan 16 satır, hepsi B = 0.
Aynı dört durum oyunda da denendi (5−3 → c=1 · 3−5 → c=0 · 5−0 inc'li → c=0 · 5−0 tek geçiş → c=1).
Çalıştır: python3 cf_borc.py
"""
N = 4; M = (1 << N) - 1
tek_gecis_uymayan = 0; inc_uymayan = []
for a in range(1 << N):
    for b in range(1 << N):
        borc = 1 if a < b else 0                      # x86 CF
        c1 = (a + ((~b) & M) + 1) >> N                # tek geçiş: carry-in = 1
        t = (((~b) & M) + 1) & M                      # 09'daki yol: inc(inv b), taşma kaybolur
        c2 = (a + t) >> N
        tek_gecis_uymayan += (c1 != 1 - borc)
        if c2 != 1 - borc: inc_uymayan.append((a, b))
print(f"tek geçiş (A + ~B + 1): elde == ters(CF) olmayan satır: {tek_gecis_uymayan} / {(1 << N) ** 2}")
print(f"inc'li yol: uymayan satır: {len(inc_uymayan)}  · hepsi B = 0 mı: {all(b == 0 for _, b in inc_uymayan)}")
