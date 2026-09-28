#!/usr/bin/env python3
"""
18 · Data Flip-Flop — kutular açılınca yarış çıkıyor mu?

Sınanan iddia (18. ders, "Daha Az Nand"):
  İki d latch kutusu 4'er çıplak nand'a açılınca (çevirmen 2 + çapraz SR 2),
  devre farklı kapı hızlarında da doğru çalışıyor; kararsızlık yalnızca ilk
  saklamadan ÖNCE, yani seviyenin "tanımsız" dediği aralıkta görülüyor.

Neden gerekli: 17'de select'li latch kara kutu hâliyle geçti, parçalarına
açılınca bit kaybetti ("did not reach a stable state"). Kutuyu açmak yarışı
ortaya çıkarabilir. Bu betik aynı soruyu flip-flop için soruyor.

Model: her kapı nand; her kapının kendi gecikmesi var (1, 2 ya da 3 tik).
Bir kapının çıkışı, girişlerinin `gecikme` tik önceki değerinden hesaplanır.
Girişler oyunun varsayımına uyar: cl = 1 iken yalnız cl değişir.

Devre (oyunda 10 bileşen / 13 nand olarak geçen çözüm; burada and ile inv
çıplak nand'la yazıldığı için 11 nand):
  and(st, cl) = inv(nand(st, cl))   → alıcının kapısı   (burada 2 nand)
  inv(cl)     = nand(cl, cl)        → vitrinin kapısı   (burada 1 nand)
  her latch: s' = nand(en, d) · r' = nand(en, s') · q = nand(s', q') · q' = nand(r', q)

Beklenen çıktı (sayılar tohuma göre sabit):
  ilk saklamadan SONRA  yanlış 0 · kararsız 0
  ilk saklamadan ÖNCE   kararsız > 0   (rastgele açılış durumu, 16'daki titreşim)

Çalıştır:  python3 dff_sim.py
"""
import random


def nand(a, b):
    return 0 if (a and b) else 1


def latch(on_ek, en, d):
    """17'deki 4 nand'lık D Latch."""
    s, r, q, qn = on_ek + 's', on_ek + 'r', on_ek + 'q', on_ek + 'qn'
    return {s: (en, d), r: (en, s), q: (s, qn), qn: (r, q)}


def devre():
    g = {'x': ('st', 'cl'), 'en': ('x', 'x'), 'icl': ('cl', 'cl')}
    g.update(latch('alici_', 'en', 'd'))
    g.update(latch('vitrin_', 'icl', 'alici_q'))
    return g, 'vitrin_q'


def calistir(g, cikis, gecikme, adimlar, baslangic):
    sig = {'st': 0, 'd': 0, 'cl': 0}
    sig.update(baslangic)
    gecmis = [dict(sig)]

    def ilerle(n):
        for _ in range(n):
            t = len(gecmis)
            yeni = dict(gecmis[-1])
            for k, (a, b) in g.items():
                eski = gecmis[max(0, t - gecikme[k])]
                yeni[k] = nand(eski[a], eski[b])
            for k in ('st', 'd', 'cl'):
                yeni[k] = sig[k]
            gecmis.append(yeni)

    ilerle(40)
    sonuc = []
    for ad, deger in adimlar:
        sig[ad] = deger
        ilerle(60)
        son = gecmis[-12:]
        kararli = len({tuple(h[k] for k in g) for h in son}) == 1
        sonuc.append((son[-1][cikis], kararli))
    return sonuc


def beklenen(adimlar):
    """Seviyenin tablosu: cl 1'e çıkarken st = 1 ise d saklanır, cl 0'a inerken gösterilir."""
    st = d = cl = 0
    sakli = cikis = None
    out = []
    for ad, deger in adimlar:
        onceki = cl
        if ad == 'st': st = deger
        if ad == 'd': d = deger
        if ad == 'cl': cl = deger
        if ad == 'cl' and onceki == 0 and cl == 1 and st == 1:
            sakli = d
        if ad == 'cl' and onceki == 1 and cl == 0 and sakli is not None:
            cikis = sakli
        out.append(cikis)
    return out


OYUN = [('d', 1), ('st', 1), ('cl', 1), ('cl', 0), ('d', 0), ('cl', 1), ('cl', 0),
        ('st', 0), ('d', 1), ('cl', 1), ('cl', 0)]


def rastgele(n, rnd):
    a, cl = [], 0
    for _ in range(n):
        if cl == 1 or rnd.random() < 0.4:
            cl ^= 1
            a.append(('cl', cl))
        else:
            a.append((rnd.choice(['st', 'd']), rnd.randint(0, 1)))
    return a


def main():
    rnd = random.Random(7)
    g, c = devre()
    adim = sonra = yanlis = kararsiz_sonra = kararsiz_once = 0
    for tur in range(400):
        gecikme = {k: 1 for k in g} if tur == 0 else {k: rnd.randint(1, 3) for k in g}
        acilis = {k: rnd.randint(0, 1) for k in g}
        dizi = OYUN if tur < 50 else rastgele(40, rnd)
        for (s, kararli), b in zip(calistir(g, c, gecikme, dizi, acilis), beklenen(dizi)):
            adim += 1
            if b is None:
                kararsiz_once += not kararli
            elif not kararli:
                sonra += 1
                kararsiz_sonra += 1
            else:
                sonra += 1
                yanlis += s != b
    print(f'devre: {len(g)} nand (latch\'ler 8 + and 2 + inv 1; oyun and ile inv\'i 5 saydığı için orada 13) · 400 deneme (ilki eşit gecikme, gerisi 1–3 tik) · {adim} adım')
    print(f'ilk saklamadan SONRA  {sonra} adım · yanlış {yanlis} · kararsız {kararsiz_sonra}')
    print(f'ilk saklamadan ÖNCE   kararsız {kararsiz_once}  (seviye: "ilk saklamadan önce çıkış tanımsız")')


if __name__ == '__main__':
    main()
