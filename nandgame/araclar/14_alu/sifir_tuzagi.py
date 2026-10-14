#!/usr/bin/env python3
"""14 · ALU — "sıfırı yanlış bayrağa bağlamak" tuzağı.

Sınanan iddia: 0'ı sw ile sürülen bir seçiciye takan kurulumlar hangi satırlarda doğru,
hangilerinde yanlış sonuç verir? Dersteki tuzak tablosu (X=5, Y=3) buradan geliyor.
Yöntem: 0'ın S1 ya da S2'ye takıldığı bütün bağlantıları dener, 31 (X, Y) çiftinde
dört (zx, sw) satırını beklenenle karşılaştırır.
Beklenen çıktı: yalnız başlangıç satırı doğru çıkan 60 kurulum; "0 ile Y yer değiştirmiş"
kurulumu (S1 D1=0, S3 D1=Y) bunlardan biri; X=5, Y=3 için görülen/beklenen tablosu.
Çalıştır: python3 sifir_tuzagi.py
"""
import itertools, random
M=0xFFFF
BEKLENEN={(0,0):lambda X,Y:(X-Y)&M,(0,1):lambda X,Y:(Y-X)&M,(1,0):lambda X,Y:(0-Y)&M,(1,1):lambda X,Y:(0-X)&M}
random.seed(3); ORNEK=[(5,3)]+[(random.randrange(65536),random.randrange(65536)) for _ in range(30)]
KAYNAK=['X','Y','0']
def sonuc(bag,zx,sw,X,Y):
    v={'X':X,'Y':Y,'0':0}
    s1=v[bag['S1'][1]] if sw else v[bag['S1'][0]]
    s2=v[bag['S2'][1]] if sw else v[bag['S2'][0]]
    v['S1']=s1
    s3=v[bag['S3'][1]] if zx else v[bag['S3'][0]]
    return (s3-s2)&M          # sol = S3, sağ = S2, işlem X − Y (sub)
dogru={'S1':('X','Y'),'S2':('Y','X'),'S3':('S1','0')}
def satirlar(bag):
    return [all(sonuc(bag,zx,sw,X,Y)==BEKLENEN[(zx,sw)](X,Y) for X,Y in ORNEK) for zx,sw in [(0,0),(0,1),(1,0),(1,1)]]
print("doğru devre:",satirlar(dogru))
# 0'ın sw ile sürülen bir seçiciye (S1 ya da S2) takıldığı bütün kurulumlar
bulunan=[]
for s1 in itertools.product(KAYNAK,repeat=2):
  for s2 in itertools.product(KAYNAK,repeat=2):
    for s3 in itertools.product(KAYNAK+['S1'],repeat=2):
      if '0' not in s1+s2: continue
      bag={'S1':s1,'S2':s2,'S3':s3}
      r=satirlar(bag)
      if r==[True,False,False,False]: bulunan.append(bag)
print("sadece başlangıç satırı doğru çıkan kurulum sayısı:",len(bulunan))
aday={'S1':('X','0'),'S2':('Y','X'),'S3':('S1','Y')}
print("aday (0 ile Y'nin yeri karışmış):",satirlar(aday), aday in bulunan)
for zx,sw in [(0,0),(0,1),(1,0),(1,1)]:
    X,Y=5,3; g=sonuc(aday,zx,sw,X,Y); b=BEKLENEN[(zx,sw)](X,Y)
    tr=lambda v: v-65536 if v&0x8000 else v
    print(f"zx={zx} sw={sw}  görülen {tr(g):>3}  beklenen {tr(b):>3}  {'✓' if g==b else '✗'}")
