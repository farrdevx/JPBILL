# PteroCloud | Modern Billing & Management Dashboard

PteroCloud adalah solusi billing premium dan dashboard manajemen yang dirancang khusus untuk ekosistem **Pterodactyl Panel**. Dibangun dengan estetika **Purple-Indigo** yang modern, aplikasi ini menawarkan pengalaman manajemen infrastruktur yang intuitif bagi admin dan pengguna.

## 🚀 Fitur Utama

- **Authority Dashboard**: Statistik real-time pendapatan, pengguna aktif, dan sinkronisasi SQL Node.
- **Server Orchestrator**: Kontrol penuh atas instance (Start, Stop, Restart, Kill) dengan grafik penggunaan resource.
- **File Management**: Penjelajahan file, upload, download, pembuatan folder, dan dialog konfirmasi destruktif.
- **Billing & Store Hub**: Sistem pembelian paket otomatis yang terintegrasi dengan limit Pterodactyl.
- **AI-Powered Support**: Asisten AI (Gemini) terintegrasi untuk membantu troubleshooting teknis.
- **Infrastructure Monitoring**: Sinkronisasi database SQL eksternal untuk redundansi data transaksi.

---

## 🛠️ Cara Menjalankan (Local Development)

### Prasyarat
- Browser modern yang mendukung ES6 Modules.
- Koneksi internet (untuk mengunduh library via ESM.sh).

### Langkah-langkah
1. Letakkan seluruh file proyek dalam satu direktori root.
2. Buka `index.html` menggunakan Live Server (seperti extension VS Code Live Server).
3. Pastikan `process.env.API_KEY` (untuk Gemini) telah terkonfigurasi di lingkungan eksekusi Anda.

---

## ⚙️ Daftar Konfigurasi (Configuration List)

Konfigurasi disimpan secara aman di `localStorage` untuk persistensi sesi.

### 1. Pterodactyl Application API
Digunakan di **Admin Panel** untuk manajemen node, user, dan pembuatan server.
- **Base URL**: Alamat panel Anda (Contoh: `https://jpshop.tech/`)
- **API Key**: API Key dari menu `Application API` di Pterodactyl (Prefix: `ptla_`).

### 2. Pterodactyl Client API
Digunakan di **Client Area** untuk kontrol console dan file server.
- **API Key**: API Key dari menu `User Settings` -> `API Credentials` (Prefix: `ptlc_`).

### 3. SQL Master Database
Konfigurasi database pusat untuk penyimpanan data billing `jpshop`.
- **Host**: `159.89.170.25`
- **User**: `jpshop`
- **Password**: `ikanasin`
- **Database**: `jpshop`

---

## 📡 Dokumentasi API & Integrasi

### Pterodactyl Integration
Aplikasi ini melakukan `fetch` langsung ke endpoint Pterodactyl:
- **List Nodes**: `GET /api/application/nodes?include=location,allocations`
- **List Users**: `GET /api/application/users`
- **Server Resources**: `GET /api/client/servers/{id}/resources`
- **File Operations**: Menggunakan endpoint `/api/client/servers/{id}/files`.

### Gemini AI Integration
Terletak di `services/gemini.ts`. Menggunakan model `gemini-3-flash-preview` untuk memberikan respon teknis dengan instruksi sistem khusus:
```typescript
{
  model: 'gemini-3-flash-preview',
  systemInstruction: "You are PteroAI, a helpful assistant for PteroCloud..."
}
```

### CORS Proxy
Karena kebijakan keamanan browser (CORS), aplikasi menggunakan `corsproxy.io` secara default untuk menjembatani permintaan ke panel Pterodactyl. Ini dapat dinonaktifkan di menu **System Settings** jika panel Anda sudah mengizinkan domain aplikasi di whitelist CORS.

---

## 🎨 Palet Warna (Theme)
- **Background**: `#09090b` (Deep Zinc)
- **Surface**: `#18181b` (Glassmorphism effect)
- **Primary**: `Indigo-600` (`#4f46e5`)
- **Secondary**: `Purple-500` (`#a855f7`)
- **Accent**: `Emerald-500` (Online Status) / `Rose-500` (Destructive Actions)

---

## ⚠️ Peringatan Keamanan
API Key Anda disimpan di browser. Jangan pernah membagikan tautan yang berisi kredensial sensitif. Gunakan koneksi HTTPS untuk seluruh komunikasi data.