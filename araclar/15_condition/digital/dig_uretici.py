# Digital .dig üreticisi — bağlantılar Tunnel ile (aynı NetName = aynı tel)
# Bacak konumları Digital 0.31'de CLI testiyle ölçüldü (2026-09-26):
#   And/Or 2 giriş: (0,0) (0,40) → çıkış (60,20)   ·  Not: (0,0) → (40,0)
#   Comparator: a (0,0) b (0,20) → '>' (60,0) '=' (60,20) '<' (60,40)
#   Splitter '1,15'→'16': girişler (0,0) (0,20) → çıkış (20,0)
from xml.sax.saxutils import escape
class Devre:
    def __init__(s): s.el=[]; s.wires=[]; s.n=0
    def _add(s,name,x,y,attrs=None):
        s.el.append((name,x,y,attrs or {}))
    def _tun(s,net,px,py,dx):
        # pin (px,py)'ye kısa tel + ucunda tünel
        tx=px+dx
        s.wires.append(((px,py),(tx,py)))
        s._add('Tunnel',tx,py,{'NetName':net,**({'rotation':'2'} if dx<0 else {})})
    def comp(s,name,x,y,pins,nets,attrs=None):
        # pins: [(dx,dy,yön)] yön=-1 giriş (tünel solda), +1 çıkış (tünel sağda)
        s._add(name,x,y,attrs)
        for (dx,dy,d),net in zip(pins,nets):
            if net is None: continue
            s._tun(net,x+dx,y+dy,-20 if d<0 else 20)
    def inp(s,label,x,y,bits=1):
        s._add('In',x,y,{'Label':label,**({'Bits':str(bits)} if bits>1 else {})})
        s._tun(label,x,y,20)
    def out(s,label,x,y,net,bits=1):
        s._add('Out',x,y,{'Label':label,**({'Bits':str(bits)} if bits>1 else {})})
        s._tun(net,x,y,-20)
    def test(s,name,data,x,y):
        s._add('Testcase',x,y,{'Label':name,'__test__':data})
    def xml(s):
        o=['<?xml version="1.0" encoding="utf-8"?>','<circuit>','  <version>2</version>','  <attributes/>','  <visualElements>']
        for name,x,y,a in s.el:
            o.append('    <visualElement>'); o.append(f'      <elementName>{name}</elementName>')
            if not a: o.append('      <elementAttributes/>')
            else:
                o.append('      <elementAttributes>')
                for k,v in a.items():
                    if k=='__test__':
                        o.append(f'        <entry><string>Testdata</string><testData><dataString>{escape(v)}</dataString></testData></entry>')
                    elif k=='rotation':
                        o.append(f'        <entry><string>rotation</string><rotation rotation="{v}"/></entry>')
                    elif k=='Bits':
                        o.append(f'        <entry><string>Bits</string><int>{v}</int></entry>')
                    elif k in ('Signed',):
                        o.append(f'        <entry><string>{k}</string><boolean>{v}</boolean></entry>')
                    elif k=='Value':
                        o.append(f'        <entry><string>Value</string><long>{v}</long></entry>')
                    else:
                        o.append(f'        <entry><string>{k}</string><string>{escape(v)}</string></entry>')
                o.append('      </elementAttributes>')
            o.append(f'      <pos x="{x}" y="{y}"/>'); o.append('    </visualElement>')
        o.append('  </visualElements>'); o.append('  <wires>')
        for (a,b) in s.wires:
            o.append(f'    <wire><p1 x="{a[0]}" y="{a[1]}"/><p2 x="{b[0]}" y="{b[1]}"/></wire>')
        o.append('  </wires>'); o.append('  <measurementOrdering/>'); o.append('</circuit>')
        return '\n'.join(o)+'\n'
