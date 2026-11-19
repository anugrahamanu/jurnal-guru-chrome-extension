# Ekstensi Google Chrome - Jurnal Guru Digital & LMS

Ekstensi resmi Google Chrome (Manifest V3) untuk platform **Jurnal Guru Digital & LMS**. Mempermudah pendidik, staf sekolah, dan siswa mengakses sistem manajemen pembelajaran, pengisian jurnal mengajar, absensi kelas, dan bank soal secara instan dari browser tanpa perlu mengingat URL atau membuka tab manual.

---

## 🌟 Fitur Utama

1. **Side Panel Pintar (Bilah Samping)**:
   - Terbuka di bilah samping browser Chrome berdampingan dengan halaman web apa pun.
   - Pendidik dapat melihat absensi atau membuat catatan jurnal sambil membaca referensi atau menonton video edukasi di tab utama.
   - Shortcut keyboard instan: **`Alt + J`**.

2. **Quick Launcher Popup**:
   - Status indikator real-time koneksi server (Localhost / Web Hosting).
   - Pintasan langsung 1-klik:
     - 📊 **Dashboard Guru** (Jurnal & Absensi)
     - 📚 **LMS Guru** (Modul & Tugas Kelas)
     - ❓ **Kelola Soal & CBT** (Bank Soal, Ujian, Nilai)
     - 🎓 **Portal Siswa** (Ruang Belajar & Tugas Siswa)
     - 📁 **Administrasi Guru** (CP, TP, ATP, Modul Ajar)
     - 📺 **Layar Jadwal TV** (Display Informasi Sekolah)

3. **Menu Klik Kanan (Context Menu)**:
   - Klik kanan di tab mana pun untuk langsung meluncurkan Side Panel atau membuka Dashboard.

4. **Multi-Server & Fleksibel**:
   - Mendukung lingkungan lokal XAMPP (`http://localhost/Jurnal Guru`) maupun server hosting sekolah (`https://jurnal.sekolah.sch.id`).

---

## 🚀 Panduan Instalasi (Hanya 1 Menit)

1. Buka browser **Google Chrome**.
2. Masuk ke halaman ekstensi dengan mengetik `chrome://extensions` di kolom URL.
3. Nyalakan sakelar **Mode Pengembang (Developer Mode)** di pojok kanan atas.
4. Klik tombol **Muat yang belum dibongkar (Load unpacked)** di kiri atas.
5. Pilih folder:
   ```
   c:\Xampp V7.33\htdocs\Jurnal Guru\chrome-extension
   ```
6. Ekstensi langsung terpasang! Sematkan *(Pin)* ikon ekstensi di toolbar Chrome agar mudah diakses setiap saat.

---

## 📁 Struktur File Ekstensi

```text
chrome-extension/
├── manifest.json            # Konfigurasi Manifest V3
├── rules.json               # Aturan declarativeNetRequest (penyesuaian frame header)
├── background.js            # Background service worker (shortcut Alt+J, context menu)
├── popup.html               # Antarmuka popup cepat toolbar
├── popup.js                 # Logika popup & pengecekan status server
├── sidepanel.html           # Antarmuka Chrome Side Panel
├── sidepanel.js             # Logika bilah samping & integrasi iframe
├── PANDUAN_PEMASANGAN.txt   # Panduan teks ringkas bagi pengguna
└── icons/                   # Ikon ekstensi resolusi 16px, 32px, 48px, 128px
```
