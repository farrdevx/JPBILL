# PteroCloud | Panduan Instalasi Lokal

PteroCloud adalah dashboard billing dan manajemen premium untuk Pterodactyl Panel. Ikuti panduan ini untuk menjalankan aplikasi di komputer lokal Anda.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:
1. **Web Browser Modern**: Google Chrome, Brave, atau Firefox versi terbaru.
2. **Local Web Server**: Karena aplikasi menggunakan ES Modules dan JSX, Anda tidak bisa membukanya langsung dengan klik kanan `index.html` (protokol `file://` akan memicu CORS error).
   - Rekomendasi: Ekstensi **Live Server** di VS Code, atau **Vite**, atau **SimpleHTTPServer** (Python).
3. **Pterodactyl API Key**: 
   - **Application API Key** (dimulai dengan `ptla_`) untuk fitur Admin.
   - **Client API Key** (dimulai dengan `ptlc_`) untuk fitur User/Client.

---

## 🚀 Langkah Instalasi

### 1. Persiapkan Direktori
Unduh atau salin seluruh file proyek ini ke dalam satu folder (misalnya: `C:/Projects/PteroCloud`). Struktur folder harus terlihat seperti ini:
```text
PteroCloud/
├── components/
├── services/
├── App.tsx
├── index.html
├── index.tsx
├── types.ts
└── metadata.json
```

### 2. Jalankan Local Server
Pilih salah satu metode di bawah ini:

#### Metode A: VS Code (Paling Mudah)
1. Buka folder proyek di Visual Studio Code.
2. Instal ekstensi **Live Server** oleh Ritwick Dey.
3. Klik kanan pada `index.html` dan pilih **"Open with Live Server"**.
4. Browser akan terbuka di `http://127.0.0.1:5500`.

#### Metode B: Node.js (Vite)
Jika Anda ingin performa lebih cepat dan fitur hot-reload:
1. Buka terminal di folder proyek.
2. Jalankan perintah: `npx vite`
3. Ikuti URL yang muncul (biasanya `http://localhost:5173`).

---

## ⚙️ Konfigurasi API

Setelah aplikasi berjalan, buka menu **Settings** di sidebar untuk menghubungkan ke panel Anda:

1. **Panel URL**: Masukkan alamat Pterodactyl Anda (Contoh: `https://panel.jpshop.tech/`).
2. **API Key**: Masukkan Client API Key Anda.
3. **CORS Proxy**: Secara default, aplikasi menggunakan `corsproxy.io`. Jika panel Anda berada di domain yang berbeda dengan aplikasi, fitur ini wajib **ON** agar permintaan API tidak diblokir browser.

---

## 🛠️ Troubleshooting

- **Error: Failed to fetch**: Pastikan URL panel benar (harus diawali `https://`) dan API Key valid. Periksa juga apakah **CORS Proxy** sudah aktif di pengaturan aplikasi.
- **Tampilan Putih (Blank Screen)**: Tekan `F12` untuk membuka Console. Jika ada error `process is not defined`, pastikan environment Anda sudah menyediakan `process.env.API_KEY` untuk fitur AI Gemini.
- **AI Tidak Merespon**: Fitur PteroAI (Gemini) membutuhkan API Key Google Cloud yang valid yang dikonfigurasi pada environment hosting Anda.

---

## 🎨 Kustomisasi Tema
Warna utama dikonfigurasi melalui variabel CSS di `index.html`. Anda dapat mengubah `--bg-deep` dan `--accent-indigo` untuk menyesuaikan estetika brand Anda.

---
*Dibuat dengan ❤️ untuk komunitas Pterodactyl Indonesia.*