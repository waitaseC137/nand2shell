#!/usr/bin/env python3
"""15 · Condition — "Never ve Always tutuyorsa aradaki altı satır da tutar" iddiasını Digital'de sınar.
Üç devre üretir (doğru · ters eşleme · dersin 'yanlış tel' tuzağı), her birinde üç test tablosu var:
  1_Never_Always  → dersin önerdiği test
  2_tek_izinli    → 100 / 010 / 001 satırları
  3_tam_tablo     → 8 izin × 3 X = 24 satır
Sonra Digital'in komut satırı test moduyla hepsini koşturur.
Beklenen çıktı: doğru devre üç testi de geçer; iki hatalı devre "1 Never+Always" testini geçer, 2 ve 3'ü geçemez.
Gereken: Java + Digital (github.com/hneemann/Digital). Çalıştır: python3 uret.py"""
import subprocess, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dig_uretici import Devre
JAR = os.environ.get('DIGITAL_JAR', os.path.expanduser('~/Digital/Digital.jar'))   # Digital.jar başka yerdeyse: DIGITAL_JAR=/yol/Digital.jar
HEDEF = os.path.dirname(os.path.abspath(__file__))
IKI = [(0,0,-1),(0,40,-1),(60,20,1)]
NOT = [(0,0,-1),(40,0,1)]
CMP = [(0,0,-1),(0,20,-1),(60,0,1),(60,20,1),(60,40,1)]
SPL = [(0,0,-1),(0,20,-1),(20,0,1)]
XS = [(5,'5'),(0,'0'),(-3,'65533')]          # Digital test tablosu eksi sayı okumuyor: −3 = 65533 (16 bit)
def beklenen(lt,eq,gt,x): return int((lt and x<0) or (eq and x==0) or (gt and x>0))
def tablo(satirlar): return "lt eq gt X Y\n" + "".join(f"{a} {b} {c} {xs} {beklenen(a,b,c,x)}\n" for a,b,c,x,xs in satirlar)
T1 = tablo([(a,a,a,x,xs) for a in (0,1) for x,xs in XS])
T2 = tablo([(a,b,c,x,xs) for (a,b,c) in [(1,0,0),(0,1,0),(0,0,1)] for x,xs in XS])
T3 = tablo([(a,b,c,x,xs) for a in (0,1) for b in (0,1) for c in (0,1) for x,xs in XS])

def kur(tur):
    d = Devre()
    d.inp('lt',60,60); d.inp('eq',60,140); d.inp('gt',60,220); d.inp('X',60,320,16)
    d._add('Const',60,420,{'Value':'0','Bits':'16'}); d._tun('0 (16 bit)',60,420,20)
    if tur == 'yanlis_tel':      # is zero ← eq, is neg ← gt (NandGame'in yaptığı gibi 1 bit → 0000000000000001)
        d._add('Const',60,500,{'Value':'0','Bits':'15'}); d._tun('0 (15 bit)',60,500,20)
        d.comp('Splitter',240,480,SPL,['eq','0 (15 bit)','eq 16 bit'],{'Input Splitting':'1,15','Output Splitting':'16'})
        d.comp('Splitter',240,560,SPL,['gt','0 (15 bit)','gt 16 bit'],{'Input Splitting':'1,15','Output Splitting':'16'})
        zin, nin = 'eq 16 bit', 'gt 16 bit'
    else:
        zin, nin = 'X', 'X'
    d.comp('Comparator',240,300,CMP,[zin,'0 (16 bit)',None,'is zero',None],{'Bits':'16','Signed':'true'})
    d.comp('Comparator',240,380,CMP,[nin,'0 (16 bit)',None,None,'is neg'],{'Bits':'16','Signed':'true'})
    d.comp('Or',440,300,IKI,['is zero','is neg','X ≤ 0'])
    d.comp('Not',640,320,NOT,['X ≤ 0','X > 0'])
    if tur == 'ters_eslesme':    # lt ↔ is zero, eq ↔ is neg
        v1, v2 = 'is zero', 'is neg'
    else:
        v1, v2 = 'is neg', 'is zero'
    d.comp('And',440,60,IKI,['lt',v1,'vana lt'])
    d.comp('And',440,140,IKI,['eq',v2,'vana eq'])
    d.comp('And',440,220,IKI,['gt','X > 0','vana gt'])
    d.comp('Or',720,80,IKI,['vana lt','vana eq','or2'])
    d.comp('Or',920,120,IKI,['or2','vana gt','Y'])
    d.out('Y',1120,140,'Y')
    d.test('1 Never+Always',T1,60,760); d.test('2 tek izinli',T2,300,760); d.test('3 tam tablo',T3,540,760)
    NOTLAR = {'dogru':'DOĞRU DEVRE (15. dersin bağlantı listesi)',
              'ters_eslesme':'HATALI: lt ↔ is zero, eq ↔ is neg ters eşlendi',
              'yanlis_tel':'HATALI (dersin kendi tuzağı): is zero ← eq, is neg ← gt; 1 bit sessizce 16 bite genişletildi'}
    d._add('Text',60,-60,{'Description':NOTLAR[tur]})
    d._add('Text',240,260,{'Description':'is zero = (X = 0)'})
    d._add('Text',240,450,{'Description':'is neg = (X < 0)'})
    d._add('Text',60,700,{'Description':'Testi çalıştır: Simulation → Run tests (ya da F8). Tabloyu görmek için Test kutusuna çift tıkla. −3 = 65533 (16 bit).'})
    return d

if __name__ == '__main__':
    os.makedirs(HEDEF, exist_ok=True)
    for tur in ('dogru','ters_eslesme','yanlis_tel'):
        yol = os.path.join(HEDEF, f'15_condition_{tur}.dig')
        open(yol,'w').write(kur(tur).xml())
        r = subprocess.run(['java','-cp',JAR,'CLI','test','-circ',yol],capture_output=True,text=True)
        satirlar = [l for l in (r.stdout+r.stderr).splitlines() if not l.startswith('WARNING') and 'Tests have' not in l]
        print(f"{tur:13} → " + " · ".join(satirlar))
