# 👾 CWE-77 — Command Injection

> **Veri ile komut aynı kanaldan gidiyor.** Program bir komutu, dışarıdan gelen
> girdiyi içine koyarak kuruyor. Girdideki özel karakterler etkisiz hâle
> getirilmezse, veri olarak gönderilen şey **komutun kendisini değiştirir**.

| | |
|---|---|
| **Resmî ad** | Improper Neutralization of Special Elements used in a Command ('Command Injection') |
| **Soyutlama seviyesi** | Sınıf (*Class*) |
| **Üst sınıf** | CWE-74 — Injection (genel) |
| **Kataloğundaki çocuğu** | [78](./cwe_78.md) — işletim sistemi komutu |

---

## Tek Kanal Problemi

Bütün enjeksiyon ailesinin kökü tek bir cümledir:

> **Veri ile talimat aynı yoldan gidiyorsa, alıcı ikisini ayırt etmek zorundadır.
> Ayırt etme kuralını bilen, veriyi talimata dönüştürebilir.**

Bir komut satırı düşün:

```
  kastedilen:   ara  "kullanıcının yazdığı kelime"
  gelen girdi:  kelime; başka_komut
  oluşan:       ara kelime; başka_komut
                            └─ artık ikinci bir KOMUT
```

Noktalı virgül veri değildi — **ayırıcıydı.** Kabuk onu gördüğü anda "burada bir
komut bitti, yenisi başlıyor" diye okudu.

> 🔑 Kusur girdide değil, **girdinin konduğu yerde.** Aynı metin bir dosyaya
> yazılsa zararsızdı; komut satırına konduğu için anlam kazandı.

[Leviathan'ın 3. dersi](../leviathan_komutlari/leviathan_ne_ogretiyor.md) bunun
uygulamalı hâli: `system()` çağrısına giren kullanıcı girdisi.

---

## Beş Çocuk, Beş Ayrı "Komut"

Bu sınıfın çocukları, "komut"un ne kadar farklı şeyler olabileceğini gösteriyor:

| CWE | Komut nerede çalışıyor |
|---|---|
| [**78**](./cwe_78.md) — OS Command Injection | İşletim sistemi kabuğunda ✓ *sende* |
| **88** — Argument Injection | Komut aynı kalıyor, **argümanları** değişiyor |
| **917** — Expression Language Injection | Uygulama sunucusunun ifade dilinde |
| **624** — Executable Regular Expression | Düzenli ifadenin çalıştırılabilir kısmında |
| **1427** — LLM Prompting | Bir dil modelinin **istemi** içinde |

**88 (argüman enjeksiyonu)** ile **78** arasındaki fark ince ama önemli:

```
  78:  yeni bir KOMUT ekleniyor      →  ara kelime; rm ...
  88:  aynı komuta yeni BAYRAK       →  ara --output=/etc/...
```

88'de kabuk devreye hiç girmez. Program `system()` yerine `execv()` kullanıyor
olabilir — ve yine de savunmasızdır, çünkü sorun kabuk değil, **argüman listesinin
kullanıcı tarafından şekillendirilebilmesidir.** Bu yüzden "kabuğu kullanma"
tavsiyesi 78'i kapatır, 88'i kapatmaz.

**1427 (LLM istemi)**, MITRE'nin aynı kalıbı yeni bir kanalda tanıması. Model için
talimat ile veri aynı metin akışında gidiyor; ayırt etme kuralı belirsiz olduğu
sürece kalıp aynen çalışıyor. 1978'deki kabuk ile aynı problem, yeni bir alıcı.

---

## Neden "Etkisizleştirme" Deniyor

Resmî adda *neutralization* geçiyor, "filtreleme" değil. Fark önemli:

- **Filtreleme:** tehlikeli görünenleri sil. Eksik kalmaya mahkûm — kaç karakterin
  özel olduğunu tam bilemezsin, ve alıcının kuralları değişebilir.
- **Etkisizleştirme:** karakterin **özel anlamını kaldır** — kaçış koy, ya da o
  kanaldan hiç geçirme.

En güçlü biçimi kanalı ayırmaktır: veriyi komut metninin içine hiç koymamak.

```
  zayıf:    system("ara " + girdi)              tek kanal
  güçlü:    execv("/bin/ara", ["ara", girdi])   veri ayrı parametre
```

İkincisinde girdi ne olursa olsun bir **argüman**tır; ayırıcı olarak okunacağı bir
bağlam yoktur.

---

## Neden Kendi Sayfası Var

Gerçek bir açığı 77 ile etiketlemezsin; en somut kademe seçilir
([hiyerarşi kuralı](./README.md#cweler-arasındaki-hiyerarşi)). İşletim sistemi
komutuysa [78](./cwe_78.md), argümansa 88.

Sayfası olmasının sebebi, yukarıdaki 78/88 ayrımı: kataloğunda yalnız 78 yazılı ve
onun savunması *"kabuğu aradan çıkar"* diyor. Bu doğru ama **yetersiz** — 88
kabuksuz da çalışır. Çatıyı görmeden bu boşluk fark edilmiyor.

---

## Nasıl Önlenir

- **Kanalı ayır.** Veriyi komut metnine hiç gömme; ayrı parametre olarak geçir
  (`execv` ailesi, hazırlanmış sorgular, API çağrıları).
- **Argüman listesini de denetle.** Kabuğu çıkarmak yeterli değil — kullanıcı
  girdisi bir bayrağa dönüşebiliyorsa 88 açıktır. `--` ayıracı kullan, girdiyi
  tire ile başlatma.
- **İzin listesi kullan.** Beklenen girdi sınırlıysa (dosya adı, kimlik numarası)
  kalıbı tanımla ve dışındakini reddet.
- **Ayrıcalığı düşür.** Komut yine de çalışacaksa, çalıştığı yetkiyi en aza indir.
- **Alıcının kurallarını bil.** Hangi karakterin özel olduğu **alıcıya göre**
  değişir: kabuk, SQL, ifade dili, dil modeli — hepsinin ayrı sözleşmesi var.

---

## Özet — Aklında Tut

```
☐ CWE-77 bir SINIF: dışarıdan gelen girdi komutun içine konuyor, özel karakterler etkisizleştirilmiyor.
☐ Kökü tek cümle: VERİ İLE TALİMAT AYNI KANALDAN gidiyorsa alıcı ayırt etmek zorunda.
☐ Kusur girdide değil, girdinin KONDUĞU YERDE — aynı metin dosyada zararsızdı.
☐ Çocukları: 78 (OS kabuğu) · 88 (argüman) · 917 (ifade dili) · 624 (regex) · 1427 (LLM istemi).
☐ 78 ile 88 farkı: 78 yeni KOMUT ekler, 88 aynı komuta yeni BAYRAK ekler.
☐ ⚠️ "Kabuğu kullanma" tavsiyesi 78'i kapatır, 88'i KAPATMAZ — execv ile de savunmasız olabilirsin.
☐ 1427: aynı kalıbın dil modeli istemindeki hâli. Yeni alıcı, eski problem.
☐ "Etkisizleştirme" ≠ "filtreleme": tehlikeliyi silmek değil, ÖZEL ANLAMINI kaldırmak.
☐ En güçlü savunma kanalı ayırmak: veriyi komut metnine hiç koymamak.
☐ Hangi karakterin özel olduğu ALICIYA göre değişir — kabuk, SQL, ifade dili, model.
```

---

## 🔗 İlgili Konular

- [CWE-78](./cwe_78.md) — Bu sınıfın kataloğundaki çocuğu: OS komut enjeksiyonu
- [CWE-706](./cwe_706.md) — Komşu kalıp: adın başka şeye çözülmesi
- [Leviathan'ın Dersleri · Ders 3](../leviathan_komutlari/leviathan_ne_ogretiyor.md) — Uygulamalı hâli
- [👾 CWE Haritası](./README.md) — Bütün CWE'lerin dizini

---

*Numaralar, resmî adlar ve soyutlama seviyeleri MITRE'nin CWE listesinden alınmıştır: [cwe.mitre.org](https://cwe.mitre.org).*
