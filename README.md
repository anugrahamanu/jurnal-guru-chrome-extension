# 🎓 Jurnal Guru Digital & LMS - Google Chrome Extension

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Chrome%20Side%20Panel-orange)](https://gurugenz.my.id)

Ekstensi resmi Google Chrome (Manifest V3) untuk platform **Jurnal Guru Digital & LMS** (https://gurugenz.my.id). Mempermudah pendidik, staf sekolah, dan siswa mengakses sistem manajemen pembelajaran, pengisian jurnal mengajar, absensi kelas, dan bank soal secara instan dari bilah samping (*Chrome Side Panel*) tanpa perlu bolak-balik ganti tab saat browsing materi belajar.

---

## 🌟 Fitur Utama

1. **Bilah Samping Cerdas (*Chrome Side Panel*)**:
   - Terbuka di bilah samping browser Chrome berdampingan langsung dengan halaman web apa pun (misal YouTube Edukasi, Wikipedia, artikel materi).
   - Guru bisa langsung mengisi catatan jurnal mengajar atau absensi kelas secara *real-time*.
   - **Pintasan Keyboard Super Cepat:** Tekan **`Alt + J`**.

2. **Quick Launcher Popup**:
   - Status indikator *real-time* koneksi server (**Tersambung / Offline**).
   - Pintasan langsung 1-klik ke modul-modul penting:
     - 📊 **Dashboard Guru** &bull; Ringkasan KBM & Jadwal Hari Ini
     - 📖 **Jurnal KBM** &bull; Pengisian Jurnal Mengajar Harian
     - 📚 **LMS Guru** &bull; Modul Ajar & Tugas Kelas Siswa
     - ❓ **Buat Soal** &bull; Pembuat Lembar Soal Ujian (PG & Esai)
     - 🎓 **Portal Siswa** &bull; Ruang Akses Belajar Siswa
     - 📁 **Administrasi** &bull; Perangkat Ajar CP, TP, ATP & Rapor

3. **Menu Klik Kanan (*Context Menu*)**:
   - Klik kanan di mana saja pada halaman web untuk membuka Jurnal Guru di Side Panel atau Dashboard baru.

4. **Koneksi Multi-Server**:
   - Default langsung terhubung ke server cloud: `https://gurugenz.my.id`.
   - Mendukung peralihan ke server lokal XAMPP (`http://localhost/Jurnal Guru`) dengan 1-klik.

---

## 🚀 Panduan Instalasi (Hanya 1 Menit)

1. **Download & Ekstrak**:
   - Unduh file `chrome-extension.zip` dari tab [Releases](../../releases).
   - Klik kanan file zip tersebut lalu pilih **Extract All (Ekstrak Semua)**.
2. **Buka Menu Ekstensi di Chrome**:
   - Buka browser Google Chrome, ketik `chrome://extensions` di kolom alamat lalu tekan Enter.
3. **Nyalakan Mode Pengembang**:
   - Aktifkan sakelar **Mode Pengembang (Developer mode)** di pojok kanan atas hingga berwarna biru.
4. **Pasang Ekstensi**:
   - Klik tombol **Muat yang belum dibongkar (Load unpacked)** di pojok kiri atas.
   - Pilih folder `chrome-extension` hasil ekstrak tadi, lalu klik **Select Folder**.
5. **Selesai!**
   - Klik ikon puzzle di pojok kanan atas Chrome, lalu sematkan (*Pin*) ikon Jurnal Guru agar selalu tampil di toolbar browser Anda.

---

## 📁 Struktur Berkas Ekstensi

```text
chrome-extension/
├── manifest.json            # Konfigurasi Manifest V3 & Hak Akses
├── rules.json               # Aturan Declarative Net Request (penyesuaian frame header)
├── background.js            # Background service worker (Alt+J shortcut & context menu)
├── content-nav.js           # Skrip integrasi navigasi instan antarmuka LMS
├── popup.html               # Antarmuka popup cepat pada toolbar
├── popup.js                 # Logika popup & pengecekan status konektivitas
├── sidepanel.html           # Antarmuka Chrome Side Panel
├── sidepanel.js             # Logika bilah samping & integrasi iframe
├── panduan-instalasi.html   # Panduan visual interaktif pengguna
├── PANDUAN_PEMASANGAN.txt   # Panduan teks ringkas bagi pengguna
└── icons/                   # Ikon ekstensi (16px, 32px, 48px, 128px)
```

---

## 👨‍💻 Pengembang
Dikembangkan dengan ❤️ untuk kemudahan administrasi guru Indonesia.
- **Platform Web:** [https://gurugenz.my.id](https://gurugenz.my.id)
