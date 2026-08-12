# Sarıbay Özel Koçluk Sistemi 🎓

Özel öğretmenler, koçlar ve eğitim danışmanları için geliştirilmiş modern, responsive ve **Vercel uyumlu** öğrenci takip ve yönetim platformu.

> **Powered by Sarıbay Yazılım**  
> Destek Hattı & WhatsApp: 0551 031 10 29 | [saribayholding.github.io/Saribay-Yazilim](https://saribayholding.github.io/Saribay-Yazilim/)

---

## 🚀 Özellikler

- **Öğrenci Yönetimi**:
  - Detaylı öğrenci profilleri, sınıf, hedef sınav (YKS, LGS, KPSS) ve koçluk ücreti takibi.
  - Kart (Grid) ve Liste (Tablo) görünüm modları.
  - Tek tıkla Veli ve Öğrenciye WhatsApp üzerinden doğrudan bilgilendirme mesajı gönderme.
- **Haftalık Ödev & Çalışma Programı**:
  - Öğrenciye özel haftalık görev atama, hedef soru sayısı belirleme ve ilerleme çubuğu takibi.
- **Test & Net Analizi**:
  - Doğru, yanlış ve boş sayıları ile otomatik **Net = Doğru - (Yanlış / 4)** hesaplama.
- **Kitap Okuma Takibi**:
  - Okunan kitaplar, sayfa sayıları ve okuma yüzdesi ilerleme çubuğu.
- **Ödeme & Finans Takibi**:
  - Tahsil edilen ciro, bekleyen ve vadesi geçmiş ödemelerin takibi.
- **Yazdırılabilir Veli Raporu**:
  - Veli toplantıları için A4 / PDF formatında öğrenci durum çıktısı.
- **%100 LocalStorage Veri Desteği**:
  - Tüm veriler tarayıcı üzerinde çevrimdışı ve sunucusuz çalışır.
  - JSON formatında veri yedeği indirme (Export) ve yükleme (Import) imkanı.

---

## ⚡ Vercel İle Tek Tıkla Canlıya Alma (Deployment Guide)

Bu proje Vercel üzerinde sıfır yapılandırma ile sorunsuz çalışacak şekilde tasarlanmıştır.

### Adım 1: GitHub Reposunu Vercel'e Bağlayın
1. [Vercel Dashboard](https://vercel.com/dashboard) hesabınıza giriş yapın.
2. **Add New...** > **Project** butonuna tıklayın.
3. GitHub hesabınızı bağlayarak `SARIBAYHOLDING/SaribayKocluk` reposunu seçin.

### Adım 2: Yayınlama (Deploy)
- Framework Preset: **Next.js**
- Build Command: `npm run build` *(Otomatik algılanır)*
- **Deploy** butonuna tıklayın. 1 dakika içerisinde uygulamanız canlı ortamda yayına girecektir!

---

## 💻 Yerel Geliştirme (Local Development)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açarak uygulamayı kullanabilirsiniz.
