# Bellek Eğitimi — kaynaklar ve yasak listesi

Bu sayfalara kaynaksız cümle girmez. Aşağıdaki her iddia ya açık bir kaynağa ya da
vakadaki makinede yapılmış bir ölçüme dayanır.

## Kaynaklar
- openSIL (AMD): https://github.com/openSIL/openSIL — `xUSL/Include/ApobCmn.h`, `Apob.h`:
  APOB grup/tür numaraları, `APOB_TYPE_HEADER` (16 bayt kimlik + 32 bayt HMAC),
  `APOB_APCB_BOOT_INFO_STRUCT.LastPmuTrainTime`, `EVENT_LOG_STRUCT`.
- coreboot PSP entegrasyon kılavuzu: https://doc.coreboot.org/soc/amd/psp_integration.html —
  APOB'un anlamı ve BIOS çipindeki kalıcı kopyası.
- PSPTool: https://github.com/PSPReverse/PSPTool — PSP dizini ve imza denetimi.
- Linux spd5118: https://docs.kernel.org/hwmon/spd5118.html — DDR5 SPD okuma.

## Vakadaki ölçümler (tek makine: Ryzen 9 8940HX'li dizüstü, 32 GB DDR5 tek modül)
- Bellek 5200 MT/s'de çalışıyor (modül 5600 için) → bit süresi 1/5,2e9 s ≈ 192 ps.
- Firmware süresi: tam eğitim ≈ 57,5 s, kayıttan ≈ 7 s (systemd-analyze).
- APOB kopyası: `APOB` imzası, sürüm 0x18, 62 256 bayt, 25 giriş; zincir tam boyutta bitiyor.
- SPD: kayıttaki DIMM SPD girişi ile spd5118'den okunan 1024 bayt birebir aynı.
- `LastPmuTrainTime` BCD YYMMDD; deneylerde RTC tarihiyle birlikte değişti.
- Saat deneyi: 9 satırlık tablo (E1–E5 ve dönüşleri) + öncesindeki iki kazara açılış.
- Gürültü: 7 eğitim kaydı; eğitim giriş 16 384 bayt; 552'si oynadı; oynayanların ≈ %75'i ≤ 2 adım;
  iki durumlu alan 0x55/0x44 (4'e 3); halka (sarma) mantığıyla ölçüldü.

## Yasak listesi (bu sayfalarda YAZILMAZ)
- Firmware'in/BIOS çipinin nasıl okunduğu, hangi adreslerden ve hangi araçlarla. Sayfa yalnız bulunanları anlatır.
- Firmware görüntüsünün kendisi ya da ondan çözülmüş kod parçaları.
- Seri numaraları (modül, işlemci), HMAC ya da imza değerleri, özet (hash) değerleri, NVRAM içeriği.
- "Bu kural bütün AMD makinelerinde geçerli" iddiası. Tek makinede ölçüldü.
- "Şu bayt şu pinin gecikmesi" iddiası. Yerleşim bilinmiyor.
- Yılın tek başına değişmesinin eğitim tetiklediği iddiası. Denenmedi.
- "Kural sıcaklığı sormuyor" ya da "kimliğe bakıyor" iddiası. İkisi de denenmedi; kayıtta kimlik alanlarının bulunması yeterli kanıt değil.
- Göz tezgâhının katsayılarını ölçüm gibi sunmak. Model temsilî, sıcaklık etkisi bilerek abartılı.
- Hazır betik ya da kopyalanıp çalıştırılacak komut.
