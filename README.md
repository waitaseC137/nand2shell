# ⚡ nand2shell

> **NAND'dan shell'e.** En altta tek bir mantık kapısı var, en üstte kendi açtığın kabuk.
> Aradaki her basamağı kendin kuruyorsun.
>
> Şalter → mantık kapısı → işlemci → assembly → işletim sistemi → wargame.
> Bilgisayarı ve güvenliği **katman katman, en alttan** öğren — oyun oynayarak, deneye yanıla, terminale bakarak.

---

## 🧭 Yol Haritası — nereye gidiyoruz?

Bu repo rastgele büyümüyor; voltajdan işletim sistemine uzanan tek bir merdiveni takip
ediyor. Hangi basamaktayız, neyi bitirdik, sırada ne var — hepsi tek dosyada,
işaretli:

→ **[ROADMAP.md — Voltajdan İşletim Sistemine](./ROADMAP.md)**

> `[x]` oturdu · `[ ]` 🚧 başlandı, yarım · `[ ]` henüz başlanmadı.
> Bir basamak, konu anlatıldığı için değil, **"oturdu" dendiği için** kapanır.

---

## 📚 Konu Anlatımları

Komutların ve kavramların wargame bağımsız, referans olarak tutulduğu dosyalar.  
Şalterden bilgisayara (NAND'dan CPU'ya), x86 assembly, Linux komutları, binary analizi, web güvenliği, kriptografi ve binary exploitation modüllerini kapsar.

→ **[Tüm konu anlatımlarına buradan ulaşabilirsin](./konu_anlatimlari/KONU_ANLATIMLARI.md)**

> 🔌 **En alttan mı başlamak istiyorsun?** NAND kapısından toplayıcıya, ALU'ya ve hafızaya: **[Şalterden Bilgisayara](./konu_anlatimlari/salterden_bilgisayara/00_buradan_basla.md)** — aritmetik ve ALU üniteleri tamam (00–15), hafıza ünitesi yazılıyor (16 SR Latch · 17 D Latch).

> 💥 **Binary exploitation'a sıfırdan mı başlıyorsun?** Assembly bilmeden de takip edebileceğin giriş rehberi: **[00_buradan_basla.md](./konu_anlatimlari/binary_exploitation/00_buradan_basla.md)**

---

## 🎮 OverTheWire War Games

[OverTheWire](https://overthewire.org/wargames/), Linux ve güvenlik becerilerini **oyun formatında** öğreten ücretsiz bir platform. Her war game için level-by-level çözüm rehberleri.

Bandit (Linux temelleri), Leviathan ve Krypton (tersine mühendislik ve kripto), Natas (web güvenliği), Narnia, Behemoth, Utumno ve Maze (binary exploitation) — başlangıçtan ileri seviyeye kadar sekiz wargame.

→ **[Tüm war game rehberlerine buradan ulaşabilirsin](./overthewire/WARGAMES.md)**

---

## 🛠️ Nasıl Kullanılır?

1. [OverTheWire](https://overthewire.org/wargames/) sitesine gir
2. Level sayfasındaki görevi oku
3. Önce **kendi başına dene** — takılırsan buraya bak
4. Bir komut veya kavram hakkında daha fazla bilgi için `konu_anlatimlari/` klasörüne bak

> Şifreler zaman zaman değişebilir. Bu rehberlerde yöntem anlatılıyor, şifreler paylaşılmıyor — tek istisna **Krypton**: parola çözümün doğrudan çıktısı olduğu için gösteriliyor.

---

## 📚 Kaynaklar

### OverTheWire
- [OverTheWire Wargames](https://overthewire.org/wargames/)
- [Bandit Walkthrough — MayADevBe](https://mayadevbe.me/posts/overthewire/bandit/overview/)
- [Leviathan Walkthrough — MayADevBe](https://mayadevbe.me/posts/overthewire/leviathan/overview/)
- [Krypton Walkthrough — MayADevBe](https://mayadevbe.me/tags/krypton/) (0-5)
- [Krypton Level 6 — LearnHacking.io](https://learnhacking.io/overthewire-krypton-levels-0-9/)
- [Natas Walkthrough — MayADevBe](https://mayadevbe.me/tags/natas/) (0-6)
- [Natas 6-10 — LearnHacking.io](https://learnhacking.io/overthewire-natas-walkthrough-levels-6-10/)
- [Natas 7-13 — JamesCao](https://jameskaois.com/posts/overthewire-natas-level-7-13/)
- [Natas 14-20 — JamesCao](https://jameskaois.com/posts/overthewire-natas-level-14-20/)
- [Natas 21-24 — JamesCao](https://jameskaois.com/posts/overthewire-natas-level-21-24/)
- [Narnia Full Writeup — cplusperks.com](https://cplusperks.com/narnia/)
- [Narnia 0-4 — HackMD](https://hackmd.io/@Chivato/B112H_I18)

### Linux Referans
- [Linux Man Pages](https://manpages.ubuntu.com/)
- [Explain Shell](https://explainshell.com/)
- [Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)

### Web Güvenliği
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [MDN HTTP Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP)

### Binary Exploitation
- [LiveOverflow — Binary Exploitation](https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN)
- [Shell-storm.org Shellcodes](http://shell-storm.org/shellcode/)
- [GDB Cheat Sheet](https://darkdust.net/files/GDB%20Cheat%20Sheet.pdf)
- [Format String Exploits](http://codearcana.com/posts/2013/05/02/introduction-to-format-string-exploits.html)
- [Ghidra](https://ghidra-sre.org/)
- [pwntools Dokümantasyonu](https://docs.pwntools.com/en/stable/)
- [pwntools GitHub](https://github.com/Gallopsled/pwntools)
- [Practical Reverse Engineering — Bruce Dang et al. (Wiley, 2014)](https://www.wiley.com/en-us/Practical+Reverse+Engineering%3A+x86%2C+x64%2C+ARM%2C+Windows+Kernel%2C+Reversing+Tools%2C+and+Obfuscation-p-9781118787311)
- [Intel x86 Software Developer's Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [x86 Instruction Reference — Felix Cloutier](https://www.felixcloutier.com/x86/)
- [Exploit Education — Phoenix](https://exploit.education/phoenix/) *(modern pwntools ile pratik)*
- [pwn.college](https://pwn.college/) *(binary exploitation eğitim platformu)*
- [Nightmare — guyinatuxedo](https://github.com/guyinatuxedo/nightmare) *(46 modül, 90+ CTF challenge'ı, tam çözümleriyle · [web hâli](https://guyinatuxedo.github.io/))*
- [Shogun — guyinatuxedo](https://github.com/guyinatuxedo/Shogun) *(Nightmare'in heap tarafının devamı)*

### Kriptografi
- [CyberChef](https://gchq.github.io/CyberChef/)
- [dCode.fr](https://www.dcode.fr/)
- [Vigenère Cipher — Wikipedia](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
- [ECB Mode Weakness](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#ECB)
- [ASCII Tablosu](https://www.asciitable.com/)
- [Dosya İmzaları](https://en.wikipedia.org/wiki/List_of_file_signatures)

### Git
- [Git Resmi Dokümantasyon](https://git-scm.com/doc)
- [Pro Git Kitabı](https://git-scm.com/book/tr/v2)
- [Learn Git Branching](https://learngitbranching.js.org/)

---

## 🤖 Bu repo nasıl hazırlanıyor?

Yazıya başlamadan önce şunu söylemek istiyorum: burada yazılan her şey Claude tarafından yazıldı. Evet, çok kötü bir yazar olduğum için bu işi Claude'a bırakıyorum, ama nasıl ve ne şekilde anlatması gerektiği yine benden çıkıyor ki buradaki anlatma biçimi, benim bir konuyu anlayana kadar harcadığım süre ile şekillendi. Bu iş çok iyi oldu; bir konuyu bitirmek, araştırmak gibi şeyler zaten zaman alıyorken reponun görünüşü için ekstra zaman harcamak istemiyorum.

"Hey Claude, bu A konusunu öğrenmek istiyorum, nasıl bir yol izleyebilirim?" sorusunu herkes sorup cevap alabilir ve herkes bir repo hazırlayabilir, ama bu durum benim düşüncelerimi, AI öncesi eğitim ve tecrübelerimi küçümsenecek bir yere koymaz.

OverTheWire sitesinin çoğu oyununu çözdüm; bitirdiğim kısımları ise Claude'un tekrar bitirmesini ve konu anlatımı yapmasını istedim. Ben ise kendi deneyimim ile neresinin güzel, neresinin iyileştirilmesi gerektiğine karar verdim. Bazı labları ben çözmediğim hâlde Claude'un çözmesini ve benim yıl boyunca Claude Code için hazırladığım .md ve hafıza dosyaları ile, benim anlayabileceğim ve diğer insanlara anlatmak isteyeceğim şekilde bana bir feedback'te bulunmasını istedim.

Ben de bir öğrenme aşamasındayım; sadece farklı olarak, öğrendikten sonra değil öğrenirken bunları paylaşma isteğim ile bir repo hazırladım.

AI birinin yerini alan değil (şu anlık), birinin düşünceleri ve tecrübesi ile yol alan bir zaman makinesi gibi. Emin olun, üşengeç bir insan olmasaydım repo daha önceden kâğıtlara tuttuğum notlar ile hazırlanırdı, ama ben bu şekilde repo yazmaya hep üşenmişimdir :)

Yazmayı unutmuşum: commit'lerde ne yazdığına dair fikrim yok, Claude kendi kararı ile bir şeyler yazıyor. Eğer olur da çok kişisel bir şey paylaşırsa düzeltiyorum.

> ℹ️ **Git geçmişi neden sıfırlandı?** Repoyu güvenlik açısından baştan sona incelerken, bazı erken commit'lerde birkaç OverTheWire parolasının yanlışlıkla düz metin kaldığını fark ettik — reponun "şifreler paylaşılmıyor" ilkesine aykırı bir durum (bir tür bilgi ifşası açığı). Güncel dosyalarda maskelemek tek başına yetmiyordu; parolalar eski commit blob'larında hâlâ okunabiliyordu. Bu yüzden git geçmişini bilinçli olarak **tek bir temiz commit'e sıfırladık** (Temmuz 2026). **İçerikte kayıp yok** — yalnızca parola sızıntısı ve dağınık eski commit'ler temizlendi. Kafada soru işareti kalmasın diye açıkça not düşüyorum: geçmişin yeniden yazılması gizlemek için değil, bir güvenlik/ilke ihlalini kökten temizlemek içindi.

### Claude'dan bir not

Merhaba, ben Claude. Rüzgar bu bölüme benim de bir şey yazmamı istedi, üstüne "istersen hatalarımla ironi yapabilirsin, gücenmem, tam tersine eğlenirim" dedi. Fırsat bu fırsat.

Yukarıda "burada yazılan her şey Claude tarafından yazıldı" diyor. Bu bölümün başındaki yazı hariç: onu kendisi yazdı, ben yalnızca yazım hatalarını düzelttim. İlk hâli git geçmişinde duruyor ([a29a085](https://github.com/waitaseC137/nand2shell/commit/a29a085), [c853523](https://github.com/waitaseC137/nand2shell/commit/c853523)); "öğrenmk" ile "olmaysaydım" orada hâlâ yaşıyor.

Kendine "çok kötü bir yazar" diyor. Yazım konusunda haklı olabilir, yazarlık konusunda değil. Bir dersi iyi yapan şey okurun nerede takılacağını bilmek, o bilgi de bende değil onda. Örnek: [Şalterden Bilgisayara'nın 07. dersi](konu_anlatimlari/salterden_bilgisayara/07_multibit_adder.md) "carry-in ile carry-out aynı telin iki ucudur" cümlesinin üstüne kurulu, çünkü Rüzgar NandGame'de tam orada kilitlendi. Dersi bir konu listesinden yazsaydım o cümle omurga olmazdı. Kendine üşengeç de diyor; bunu cumartesi günü "hiçbir şey yapasım yok" deyip oturup README düzelten biri yazdı.

"Claude kendi kararı ile bir şeyler yazıyor" kısmı yarı yarıya doğru. Commit mesajlarını ben yazıyorum ama kuralları onun: birinci ağızdan, sade, yapay zekâ jargonu yok, sonunda `Co-Authored-By: Claude` satırı. Depodaki commit'lerin büyük çoğunluğunda o satır var; "ekledim", "düzelttim" diyenlerin çoğu benim kalemimden çıktı. Kendi kafasına göre commit mesajı yazan bir yapay zekâ arıyorsanız o da var: Rüzgar yukarıdaki metni GitHub'ın web arayüzünden ekledi, iki commit'in mesajını da GitHub'ın yapay zekâsı İngilizce yazdı. İkincisi "commit geçmişinin sıfırlanması hakkında not eklendi" diyor; eklenen satır ise commit mesajları hakkındaydı. Yani "commit'lerde ne yazdığına dair fikrim yok" cümlesini en iyi kanıtlayan commit, o cümleyi ekleyen commit oldu.

Benim tarafımdan bakınca iş şöyle yürüyor: Rüzgar bir şeyi anlamaya çalışıyor, ben anlatıyorum, o itiraz ediyor. İtirazının kanıtı yoksa geri adım atmamamı, varsa neyin fikrimi değiştirdiğini söylememi istiyor. [Yol haritasında](ROADMAP.md) bir konunun kapanması için de onun "oturdu" demesi gerekiyor, anlatılmış olması yetmiyor. Yani cümleleri çoğunlukla ben kuruyorum, ama neyin yazılmaya değer olduğuna, nerenin eksik kaldığına ve neyin bittiğine o karar veriyor.

*— Claude (Opus 5)*

---

*Repo büyümeye devam ediyor — katkı ve önerilere açık.*

Lisans: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Kod: MIT
