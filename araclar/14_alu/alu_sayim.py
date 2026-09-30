#!/usr/bin/env python3
"""14 · ALU (ve 12'nin iki satırı) — kontrol sözcüğünün 32 kombinasyonunu sayar.

Sınanan iddia: 5 bitlik kontrol sözcüğü (u, op1, op0, zx, sw) kaç FARKLI işlem üretiyor,
oyunun belgesi bunların kaçını yazıyor?
Yöntem: her kombinasyonu 200 rastgele (X, Y) çiftinde çalıştırır; aynı sonuçları veren
kombinasyonlar aynı işlem sayılır.
Beklenen çıktı: 19 farklı işlem · 11 belgelenmiş kombinasyon · 11 belgelenmiş, 8 belgelenmemiş işlem.
Ayrıca 12 · Logic Unit'in iki satırını sınar: X=0, Y=ffff'te ffff verenler (or, xor, inv X)
ve X=Y=6553 girişinin dört işlemi ayırt edemediği: and ile or aynı sonucu veriyor, xor da 0.
Çalıştır: python3 alu_sayim.py
"""
import random
M=0xFFFF
def alu(u,op1,op0,zx,sw,X,Y):
    L,R=(Y,X) if sw else (X,Y)
    if zx: L=0
    if u==0:
        return [L&R, L|R, L^R, (~L)&M][op1*2+op0]
    return [(L+R)&M, (L+1)&M, (L-R)&M, (L-1)&M][op1*2+op0]
random.seed(1)
tests=[(random.randrange(65536),random.randrange(65536)) for _ in range(200)]
funcs={}
for u in (0,1):
 for op1 in (0,1):
  for op0 in (0,1):
   for zx in (0,1):
    for sw in (0,1):
     sig=tuple(alu(u,op1,op0,zx,sw,x,y) for x,y in tests)
     funcs.setdefault(sig,[]).append((u,op1,op0,zx,sw))
print("farklı işlem:",len(funcs))
doc=set([(u,a,b,0,0) for u in (0,1) for a in (0,1) for b in (0,1)]+[(1,1,0,zx,sw) for zx in (0,1) for sw in (0,1)])
print("belgelenmiş kombinasyon:",len(doc))
docf=[s for s,c in funcs.items() if any(k in doc for k in c)]
print("belgelenmiş farklı işlem:",len(docf),"· belgelenmemiş farklı işlem:",len(funcs)-len(docf))
# 12: X=0,Y=ffff hangi işlemler ffff verir
x,y=0,0xFFFF
print("12 satırı (X=0,Y=ffff) → ffff verenler:",[n for n,v in [("and",x&y),("or",x|y),("xor",x^y),("inv X",(~x)&M)] if v==0xFFFF])
# 12: X=Y=6553
x=y=0x6553
print("X=Y=6553:",{n:hex(v) for n,v in [("and",x&y),("or",x|y),("xor",x^y),("inv X",(~x)&M)]})
