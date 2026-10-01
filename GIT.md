# Panduan Lengkap Penggunaan Git dan GitHub

Panduan ini berisi langkah-langkah dasar penggunaan Git dan GitHub.

## Daftar Isi

- Persiapan Proyek Lokal 
- Konfigurasi Identitas Git
- Commit ke Repositori Lokal
- Menghubungkan ke GitHub
- Rangkuman Perintah Utama

## Persiapan Proyek Lokal

Perbedaan Git dan GitHubGit: Sistem kontrol versi yang berjalan secara lokal di komputer.GitHub: Layanan berbasis cloud untuk menyimpan dan membagikan repositori.Hal yang Perlu DiperhatikanGunakan file .gitignore untuk mengabaikan file sensitif seperti .env dan node_modules.Pastikan penamaan folder dan file konsisten.

## Konfigurasi Identitas Git

Atur nama dan email pengguna di terminal:
```bash
Bashgit config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```
Cek versi Git:
```bash
git --version
```

## Commit ke Repositori Lokal

Inisialisasi Repositori 
```bash
git init
```
Menambahkan File ke Staging Area
```bash
git add .
```
Membuat Commit
```bash
git commit -m "feat: inisialisasi proyek"
```

## Menghubungkan ke GitHub

Buat repositori baru di GitHub.Hubungkan repositori lokal ke remote:
```bash
Bashgit remote add origin [https://github.com/username/nama-repo.git](https://github.com/username/nama-repo.git)
```
Ubah nama branch utama menjadi `main`:
```bash
Bashgit branch -M main
```
Kirim (push) kode ke GitHub:
```bash
git push -u origin main
```

## Rangkuman Perintah Utama

| Perintah Git            | Fungsi Utama                        |
| ----------------------- | ----------------------------------- |
| `git status`            | Memeriksa status file               |
| `git log`               | Melihat riwayat commit              |
| `git add . `            | Menambahkan seluruh perubahan file  |
| `git commit -m "pesan"` | Menyimpan riwayat perubahan         |
| `git push`              | Mengirim commit ke GitHub           |