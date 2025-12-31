# 🎙️ Tech Interpreter AI

**Gerçek zamanlı İngilizce-Türkçe çeviri uygulaması**

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status)](https://akseltechai.netlify.app)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-green.svg)

> 🌐 **Canlı Demo:** [https://akseltechai.netlify.app](https://akseltechai.netlify.app)

---

## 📚 İçindekiler

- [Başlamadan Önce](#-baslamadan-once)
- [API Key Alma](#-api-key-alma)
- [Arayüz Tanıtımı](#%EF%B8%8F-arayuz-tanitimi)
- [Ayarlar Paneli](#%EF%B8%8F-ayarlar-paneli)
- [English Study Guide](#-english-study-guide)
- [Temel Kullanım](#-temel-kullanim)
- [Kullanım Senaryoları](#-kullanim-senaryolari)
- [Sesame Entegrasyonu](#-sesame-entegrasyonu)
- [İpuçları](#-ipuclari)
- [Sorun Giderme](#-sorun-giderme)
- [Hızlı Başvuru](#-hizli-basvuru-karti)

---

## 🚀 Baslamadan Once

### Gereksinimler

| Gereksinim          | Açıklama                             |
| :------------------ | :----------------------------------- |
| 🌐 **Tarayıcı**      | Google Chrome veya Microsoft Edge    |
| 🎤 **Mikrofon**      | Dahili veya harici mikrofon          |
| 🔊 **Hoparlör**      | Sesli çeviri dinlemek için           |
| 📧 **Google Hesabı** | API key almak için                   |
| 🌍 **İnternet**      | Stabil internet bağlantısı           |

### ⚠️ Önemli Notlar

- **Safari ve Firefox** tam desteklenmez → **Chrome** kullanın.
- **Mobil cihazlarda** Tab Audio özelliği çalışmaz.
- **İlk kullanımda** mikrofon izni vermeniz gerekecek.
- **Sessiz ortamda** çalışmak daha iyi sonuç verir.

---

## 🔑 API Key Alma

> Bu işlem sadece **bir kez** yapılır. Key tarayıcınızda güvenle saklanır.


### Uygulamayı ilk açtığınızda bu ekran karşınıza çıkacak:

![API Key Ekranı](https://i.imgur.com/pkjdQCy.png)

---

### Adım 1: Google AI Studio'ya Giriş

1. Tarayıcınızda şu adresi açın: `https://aistudio.google.com/app/apikey`
2. Google hesabınızla giriş yapın.

### Adım 2: API Key Oluşturma

1. Sağ üstteki **"Create API key"** butonuna tıklayın.
2. Açılan pencerede:

| Alan               | Yazılacak    |
| :----------------- | :----------- |
| **Name your key**  | `techai`     |
| **Choose project** | Boş bırakın  |

3. **"Create key"** butonuna basın.
4. Oluşturulan key'i **kopyalayın** (📋 ikonuna tıklayın).

> 💡 **İpucu:** Key'i bir yere not edin, tekrar gerekebilir.

---

## 🖥️ Arayuz Tanitimi

### Ana Ekran
![Ana Ekran](screenshots/main-screen.png)

### Üst Menü Butonları

| Buton           | İşlev                 | Açıklama                               |
| :-------------- | :-------------------- | :------------------------------------- |
| **Auto Detect** | Otomatik dil algılama | Her iki dili de algılar (önerilen)     |
| **EN**          | İngilizce giriş       | Sadece İngilizce konuşacaksanız        |
| **TR**          | Türkçe giriş          | Sadece Türkçe konuşacaksanız           |
| 🔊              | Ses açık/kapalı       | AI sesini açar/kapatır                 |
| 🗑️              | Geçmişi temizle       | Sohbet geçmişini siler                 |
| ⬇️              | İndir                 | Konuşmayı TXT olarak indirir           |
| 📊              | İstatistikler         | English Study Guide'ı açar             |
| ⚙️              | Ayarlar               | Uygulama ayarlarını açar               |

---

## ⚙️ Ayarlar Paneli

Sağ üstteki **⚙️** ikonuna tıklayarak erişebilirsiniz.

### 🔑 Gemini API Key

| Alan                  | İşlev                                     |
| :-------------------- | :---------------------------------------- |
| **Key Alanı**         | API key'iniz gizli gösterilir (●●●●)      |
| **Save Key**          | Yeni key kaydetmek için                   |
| **Clear**             | Mevcut key'i silmek için                  |
| **How to get API Key**| Google AI Studio'ya yönlendirir           |

### 🎤 Microphone Source

| Seçenek                | Ne Zaman Kullanılır                       |
| :--------------------- | :---------------------------------------- |
| **Varsayılan**         | Normal kullanım için                      |
| **Dahili Mikrofon**    | Laptop kullanıyorsanız                    |
| **Harici Mikrofon**    | USB/Bluetooth mikrofon bağlıysa           |
| **Kulaklık Mikrofonu** | Kulaklık takılıysa                        |

---

## 📊 English Study Guide

Üst menüdeki **📊** ikonuna tıklayarak açılır.

### İstatistik Kartları

| Kart                   | Açıklama                                      |
| :--------------------- | :-------------------------------------------- |
| **TOTAL SPOKEN WORDS** | Toplam konuştuğunuz kelime sayısı             |
| **TARGET VOCABULARY**  | Paul Nation listesinden kullanım miktarınız   |
| **Yüzde (%)**          | İlerleme oranınız                             |

### Sekmeler

| Sekme            | İçerik                                     |
| :--------------- | :----------------------------------------- |
| **Top Usage**    | En çok kullandığınız kelimeler             |
| **Target Words** | Paul Nation akademik kelime listesi        |

---

## 📖 Temel Kullanım

1. 🎤 **Başlatma:** Mikrofon butonuna tıklayın ve izin verin.
2. 🗣️ **Konuşma:** İngilizce söyleyin → Türkçe çeviri, Türkçe söyleyin → İngilizce çeviri.
3. ⏹️ **Durdurma:** Kırmızı butona basın. Geçmişi ⬇️ ile indirebilirsiniz.

---

## 🎯 Kullanım Senaryoları

### 🎬 Senaryo: Video/YouTube Çevirisi
1. Yan sekmede videoyu açın.
2. ⚙️ **Ayarlar** → **Include System Audio** → **ON**.
3. **"Capture Tab Audio"** işaretleyin.
4. Mikrofon butonuna basın ve ilgili sekmeyi seçerken **"Sesi de paylaş"** kutusunu işaretleyin.

---

## 🎤 Sesame Entegrasyonu

[Sesame](https://app.sesame.com) platformu ile avatar diyaloglarını anlık çevirebilirsiniz. **Open Sesame** butonunu kullanarak hızlı geçiş yapabilirsiniz.

---

## 🔧 Sorun Giderme

| Sorun                     | Çözüm                                           |
| :------------------------ | :---------------------------------------------- |
| **Mikrofon İzni**         | Adres çubuğundaki 🔒 ikonuna basıp "İzin Ver" deyin. |
| **API Key Hatası**        | Key'in başında/sonunda boşluk olmadığından emin olun. |
| **Ses Gelmiyor**          | 🔊 ikonunun ve bilgisayar sesinin açık olduğunu kontrol edin. |
| **Tab Audio Sorunu**      | Paylaşım ekranında "Sesi de paylaş" kutusunu unutmayın. |

---

## 📋 Hızlı Başvuru Kartı

```text
╔══════════════════════════════════════════════════════════════╗
║           TECH INTERPRETER AI - HIZLI BAŞVURU                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🚀 BAŞLATMA                                                 ║
║     1. akseltechai.netlify.app adresini aç                   ║
║     2. Gemini API key'ini gir (AI Studio'dan al)             ║
║     3. 🎤 butonuna bas ve konuşmaya başla                    ║
║                                                              ║
║  ⚙️ AYARLAR                                                  ║
║     • System Audio → Tab/Video sesi için ON                  ║
║     • Ambient Mode → Oda/TV sesi için ON                     ║
║                                                              ║
║  📊 KELİME ÇALIŞMASI                                         ║
║     • 📊 ikonu → English Study Guide'ı aç                    ║
║     • Update AI Guide → Akademik öneriler al                 ║
║     • Export TXT → Çalışma kağıdını indir                    ║
║                                                              ║
║  📺 VİDEO ÇEVİRİSİ                                           ║
║     1. Include System Audio ayarını aç                       ║
║     2. Capture Tab Audio işaretle                            ║
║     3. Ekran paylaşırken "Sesi de paylaş"ı seç! ⚠️            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📄 Lisans & Geliştirici

**Lisans:** MIT  
**Geliştirici:** Cemil Aksel (ESMEK - Eskişehir Büyükşehir Belediyesi & UNDP İşbirliği)

<p align="center">
  <b>🌟 İyi Çalışmalar! 🌟</b><br>
  <i>Her gün 10 dakika pratik, büyük fark yaratır!</i>
</p>

**Versiyon:** 2.0 | **Son Güncelleme:** 31.12.2025