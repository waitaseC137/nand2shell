#!/usr/bin/env bash
# ders.html + assets/*  ->  tek dosya (telefona atmak icin)
# Kullanim: ./paketle.sh   ->  _tek-dosya/cekirdek-ip-bellegi-ders-tek-dosya.html
#
# SADECE DERS paketlenir. Uc sayfayi da paketlersek aralarindaki sekme linkleri
# kirilir; tek dosyada gidilecek bir yer yok. Telefona atilmak istenen zaten
# okunacak olan ders.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p _tek-dosya
rm -f _tek-dosya/cekirdek-ip-bellegi-tek-dosya.html   # eski isimli cikti
python3 - <<'PY'
import re, pathlib
root = pathlib.Path('.')
html  = (root / 'ders.html').read_text(encoding='utf-8')
css   = (root / 'assets/style.css').read_text(encoding='utf-8')
core  = (root / 'assets/rope-core.js').read_text(encoding='utf-8')
widg  = (root / 'assets/rope-widgets.js').read_text(encoding='utf-8')
boot  = (root / 'assets/rope-boot.js').read_text(encoding='utf-8')
# tema betigi sitenin ortak dosyasi (docs/assets/theme.js) — iki ust dizinde
theme = (root / '../../assets/theme.js').read_text(encoding='utf-8')

def swap(h, needle, repl, what):
    assert needle in h, f'{what} baglantisi bulunamadi'
    return h.replace(needle, repl, 1)

html = swap(html, '<link rel="stylesheet" href="assets/style.css">',
            '<style>\n' + css + '\n</style>', 'style.css')
html = swap(html, '<script src="../../assets/theme.js"></script>',
            '<script>\n' + theme + '\n</script>', 'theme.js')
html = swap(html, '<script src="assets/rope-core.js"></script>',
            '<script>\n' + core + '\n</script>', 'rope-core.js')
html = swap(html, '<script src="assets/rope-widgets.js"></script>',
            '<script>\n' + widg + '\n</script>', 'rope-widgets.js')
html = swap(html, '<script src="assets/rope-boot.js"></script>',
            '<script>\n' + boot + '\n</script>', 'rope-boot.js')

# Tek dosyada oteki iki sayfa yok: sekme seridini GIZLEME, KALDIR. Gizli ama
# markup'ta duran bir baglanti yine olu baglantidir. Metin icindeki "ana sayfa"
# / "tezgah" baglantilarini da duz metne cevir.
html, ntab = re.subn(r'\s*<nav class="tabs">.*?</nav>', '', html, flags=re.S)
assert ntab == 1, f'sekme seridi bulunamadi (ntab={ntab})'
html, n = re.subn(r'<a class="geri" href="(?:index|tezgah)\.html">(.*?)</a>', r'\1', html)
print(f'  tek dosyada notrlestirilen ic baglanti: {n}')

leftover = re.findall(r'(?:src|href)\s*=\s*["\'][^"\']*assets/[^"\']*["\']', html)
assert not leftover, f'geriye cozulmemis baglanti kaldi: {leftover}'
dead = re.findall(r'href="(?:index|ders|tezgah)\.html"', html)
assert not dead, f'tek dosyada olu sayfa baglantisi kaldi: {set(dead)}'

out = root / '_tek-dosya/cekirdek-ip-bellegi-ders-tek-dosya.html'
out.write_text(html, encoding='utf-8')
print(f'{out}  ({out.stat().st_size/1024:.0f} KB)')
PY
