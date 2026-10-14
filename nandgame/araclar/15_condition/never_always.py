#!/usr/bin/env python3
"""15 · Condition — "Never ve Always testi tutarsa aradaki altı satır da tutar" iddiası.

Sınanan iddia: iki uç test (000 ve 111) devreyi sınamaya yeter mi?
Yöntem: doğru devreyi ve iki hatalı kurulumu (lt ↔ is zero ters eşleme; dersin kendi
"yanlış tel" tuzağı) 8 izin × 3 X (5, 0, −3) = 24 satırda çalıştırır.
Beklenen çıktı: iki hatalı devre de Never ve Always'i geçiyor ama 24 satırın 8'inde
yanlış; tek izinli satırlar (100, 010, 001) ikisini de yakalıyor.
Çalıştır: python3 never_always.py
"""
M=0xFFFF
def is_zero(v): return int((v&M)==0)
def is_neg(v): return (v>>15)&1
def dogru(lt,eq,gt,X):
    return int((lt and X>=0x8000) or (eq and X==0) or (gt and 0<X<0x8000))
def devre(lt,eq,gt,X,hata=None):
    zin=X; nin=X
    if hata=="yanlis_tel": zin,nin=eq,gt          # 15'in kendi tuzağı: girişler eq/gt'ye
    z,n=is_zero(zin),is_neg(nin)
    pos=1-(z|n)
    if hata=="ters_eslesme":                       # lt↔is zero, eq↔is neg
        a1,a2=lt&z,eq&n
    else:
        a1,a2=lt&n,eq&z
    a3=gt&pos
    return a1|a2|a3
Xs=[5,0,(-3)&M]
for hata in [None,"ters_eslesme","yanlis_tel"]:
    never=all(devre(0,0,0,x,hata)==0 for x in Xs)
    always=all(devre(1,1,1,x,hata)==1 for x in Xs)
    bozuk=[(lt,eq,gt,x) for lt in (0,1) for eq in (0,1) for gt in (0,1) for x in Xs if devre(lt,eq,gt,x,hata)!=dogru(lt,eq,gt,x)]
    tek=[(r,x) for r in [(1,0,0),(0,1,0),(0,0,1)] for x in Xs if devre(*r,x,hata)!=dogru(*r,x)]
    print(f"{str(hata):14} Never:{never} Always:{always}  yanlış satır:{len(bozuk)}  tek-izinli testte yakalanır:{bool(tek)}")
