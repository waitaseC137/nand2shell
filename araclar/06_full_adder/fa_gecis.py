#!/usr/bin/env python3
"""06 · Full Adder — "OR'lu ve XOR'lu çözüm birebir aynı davranır" iddiasını kapı düzeyinde sınar.

Sınanan iddia: iki elde (h1, h2) aynı anda 1 olamaz, bu yüzden onları birleştiren OR yerine
XOR da kullanılabilir ve iki devre aynı davranır.
Yöntem: birim gecikmeli nand simülasyonu. Her kapının çıkışı t+1 anında, t anındaki
girişlerinden hesaplanır. half adder: l = XOR (03'teki gibi AND(OR, NAND)), h = AND.
Sekiz girişin bütün geçişleri (8 × 7 = 56) denenir; her geçişte h1 = h2 = 1 kaç tik
sürüyor ve kutunun h çıkışı yol boyunca ne gösteriyor, ona bakılır.
Beklenen çıktı: kararlı durumda iki devre aynı sonucu verir. Ama abc 011 → 111 ve
101 → 111 geçişlerinde h1 = h2 = 1 üç tik sürer: OR'lu çıkış 1'de kalır, XOR'lu çıkış
üç tik 0'a düşer.
Çalıştır: python3 fa_gecis.py
"""
import itertools

NAND = lambda a, b: 0 if (a and b) else 1
INV = lambda a: 0 if a else 1

def xor_kapilari(p, a, b):
    """03'teki XOR: AND(OR(a, b), NAND(a, b)), nand düzeyinde. Çıkış teli: p + 'x'."""
    return {p + 'na': (INV, [a]), p + 'nb': (INV, [b]), p + 'or': (NAND, [p + 'na', p + 'nb']),
            p + 'nd': (NAND, [a, b]), p + 'x0': (NAND, [p + 'or', p + 'nd']), p + 'x': (INV, [p + 'x0'])}

def half_adder(p, a, b):
    g = xor_kapilari(p + 'l', a, b)
    g.update({p + 'h0': (NAND, [a, b]), p + 'h': (INV, [p + 'h0'])})
    return g, p + 'h', p + 'lx'

def full_adder(birlestirici):
    g = {}
    g1, h1, l1 = half_adder('A', 'a', 'b'); g.update(g1)
    g2, h2, _ = half_adder('B', l1, 'c'); g.update(g2)
    if birlestirici == 'OR':
        g.update({'Hna': (INV, [h1]), 'Hnb': (INV, [h2]), 'H': (NAND, ['Hna', 'Hnb'])})
    else:
        g.update(xor_kapilari('C', h1, h2)); g['H'] = (INV, ['Cx0'])
    return g, h1, h2

def adim(g, st):
    yeni = dict(st)
    for ad, (f, girisler) in g.items():
        yeni[ad] = f(*[st[x] for x in girisler])
    return yeni

def otur(g, girisler, tik=40):
    st = {k: 0 for k in g}; st.update(girisler)
    for _ in range(tik):
        st = adim(g, st)
    return st

for birlestirici in ('OR', 'XOR'):
    g, h1, h2 = full_adder(birlestirici)
    print(f'== {birlestirici}')
    for s0, s1 in itertools.permutations(itertools.product((0, 1), repeat=3), 2):
        i0, i1 = dict(zip('abc', s0)), dict(zip('abc', s1))
        st = otur(g, i0); son = otur(g, i1)['H']
        st.update(i1); iz, ikisi = [], 0
        for _ in range(20):
            st = adim(g, st); iz.append(st['H'])
            ikisi += st[h1] and st[h2]
        if ikisi:
            yol = ''.join(map(str, iz[:12]))
            dusus = 'çıkış 1\'de kalıyor' if st['H'] == 1 and all(iz) else f'çıkış yolu {yol}'
            print(f"  abc {''.join(map(str, s0))} → {''.join(map(str, s1))}:  h1 = h2 = 1 {ikisi} tik · {dusus}")
