# FINOVA Accounting System — Website Company Profile

Website statis responsif untuk company profile dan pintu masuk ke aplikasi FINOVA yang sudah ada.

## Isi paket
- `index.html` — halaman website satu halaman: beranda, tentang, modul, harga, demo, kontak.
- `styles.css` — desain responsif dengan tema premium biru-putih.
- `script.js` — navigasi mobile, tahun footer, validasi formulir demo di sisi browser.
- `assets/logo-header.png` — header lockup horizontal yang menggabungkan lambang asli dengan tulisan FINOVA ACCOUNTING SYSTEM dari gambar pengguna.
- `assets/favicon.png` — ikon tab browser dari lambang asli FINOVA.
- `assets/logo-finova.png` — file lambang asli yang tetap disertakan.
- `assets/dashboard-hero.jpg` — ilustrasi dashboard untuk bagian hero.

## Login aplikasi
Tombol login mengarah ke `https://finova-accounting-system.vercel.app`.

## Cara deploy di Vercel
1. Ekstrak ZIP ini ke folder tersendiri.
2. Buka Vercel dan buat project baru dengan mengimpor repository Git yang berisi file-file ini, atau deploy folder statis melalui metode Vercel yang biasa Anda gunakan.
3. Framework preset: `Other` (static site). Build command dapat dikosongkan; output/root directory adalah folder yang berisi `index.html`.
4. Deploy ke URL preview terlebih dahulu.
5. Uji desktop dan ponsel: menu navigasi, tautan anchor, tampilan logo, dan tombol login. Pastikan URL aplikasi terbuka sesuai harapan.
6. Hubungkan domain khusus setelah domain dibeli dan konfigurasi DNS selesai.

## Catatan yang belum diaktifkan
- Form demo saat ini hanya memvalidasi input di browser. Formulir belum mengirim atau menyimpan data. Sambungkan ke email resmi atau backend/Edge Function sebelum dipakai menerima permintaan calon klien.
- Harga pada bagian paket sengaja tidak menampilkan nominal karena harga final belum diberikan.
- Ilustrasi dashboard adalah visual promosi, bukan bukti tangkapan layar live dari aplikasi.
- Header memakai lambang dan wordmark FINOVA yang diberikan pengguna; favicon memakai lambang saja.
- Website ini terpisah dari project aplikasi FINOVA yang sedang berjalan; jangan menimpa deployment aplikasi saat menerbitkan website profil.

## Pengujian yang dilakukan saat paket dibuat
- Memeriksa struktur file dan integritas ZIP.
- Memastikan tautan login pada sumber mengarah ke URL aplikasi di atas.
- Belum dilakukan deploy ke Vercel atau pengujian browser live dari lingkungan ini.


## Pembaruan versi ini
- Gambar hero dashboard diganti dengan screenshot dashboard FINOVA yang diberikan pengguna.
- Bagian Tentang diperluas dengan visi, misi, pendekatan modular, peta proses, modul, dan gambaran teknologi yang bersumber dari company profile.
- Company profile dapat diunduh dalam format PDF dan PowerPoint melalui `assets/downloads/`.
- Form demo memvalidasi isian dan mengunduh ringkasan permintaan sebagai file TXT. Form belum mengirim data ke server/email karena alamat kontak resmi atau endpoint backend belum diberikan.
- Tombol login tetap menuju `https://finova-accounting-system.vercel.app`.


## Pembaruan tampilan dashboard hero
- Hero memakai komposisi mockup laptop dan ponsel, dengan screenshot dashboard FINOVA pengguna ditempatkan pada layar perangkat.
- Screenshot dashboard tidak lagi tampil sebagai gambar lebar yang memenuhi area hero.
- Tombol login, company profile download, dan perilaku formulir demo tetap dipertahankan.


## Pembaruan form demo dan tampilan ponsel
- Tampilan layar ponsel pada mockup hero memakai screenshot portrait yang diberikan pengguna.
- Form demo meminta nama, perusahaan, email bisnis, nomor WhatsApp calon klien, bidang usaha, jumlah karyawan, dan kebutuhan utama.
- Bidang usaha memiliki pilihan umum serta opsi "Lainnya" yang menampilkan kolom teks.
- Saat menekan "Siapkan Permintaan", website menyiapkan pesan dan membuka WhatsApp FINOVA (6285939108200) dengan isi pesan yang telah diisi. Tombol alternatif email membuka draft email ke finovaerp@gmail.com.
- Pengiriman tetap memerlukan konfirmasi calon klien dengan menekan tombol kirim di WhatsApp/email. Website statis tidak dapat mengirim email diam-diam; pengiriman otomatis memerlukan backend atau layanan formulir.


## Form demo — pengiriman email otomatis (Vercel + Resend)
WhatsApp sudah dihapus dari formulir. Tombol "Siapkan Permintaan" mengirim data ke endpoint `/api/demo-request` dan akan menampilkan sukses hanya setelah Resend mengonfirmasi email diterima untuk diproses.

### Konfigurasi wajib sebelum email aktif
1. Buat akun layanan email Resend dan verifikasi domain pengirim yang Anda miliki di dashboard Resend.
2. Di project Vercel website ini, buka **Settings → Environment Variables** lalu tambahkan:
   - `RESEND_API_KEY` = API key Resend (rahasia; hanya server-side)
   - `DEMO_FROM_EMAIL` = alamat pengirim dari domain yang sudah diverifikasi, contoh `Website FINOVA <demo@domain-anda.id>` (ganti dengan alamat yang benar-benar terverifikasi)
   - `DEMO_TO_EMAIL` = `finovaerp@gmail.com`
3. Deploy ulang website di Vercel.
4. Uji dengan mengisi formulir menggunakan alamat email yang Anda kontrol, lalu pastikan email benar-benar masuk ke inbox `finovaerp@gmail.com` (cek spam/promotions juga).

Jangan masukkan `RESEND_API_KEY` ke HTML atau JavaScript. Email otomatis belum aktif sampai variabel lingkungan, domain pengirim, dan deployment dikonfigurasi dan dites. Formulir tidak lagi meminta nomor WhatsApp dan tidak lagi membuka WhatsApp.

### Deployment
Jadikan folder `finova_website` sebagai Root Directory project Vercel (atau salin isi folder ini ke root project). API route berada di `api/demo-request.js`.
