# Dokumentasi OpenAPI Platform Digital Bandung

Dokumentasi API backend `https://apk.fly.dev`, di-serve lewat GitHub Pages di
[platform.digitalbdg.ac.id/apidocs/](https://platform.digitalbdg.ac.id/apidocs/)
(Swagger UI, versi dipatok di `index.html`).

- **`openapi.yaml`** — sumber kebenaran rute dan skema. Setiap rute di
  `apkflydev/url/` wajib ada di sini (nol selisih dua arah; rute WebSocket
  `/ws/...` dikecualikan dan didokumentasikan di `apkflydev/README.md` bagian
  "Rute WebSocket"). Pengantarnya (`info.description`) memuat cara mendapatkan
  token, tabel peran, bentuk galat, batas ukuran, dan urutan pemakaian tipikal.
- **`SKILL.md`** — paket instruksi untuk agen AI/developer yang menulis klien
  atau integrasi ke backend ini (aturan yang tidak termuat di OpenAPI: crootjs,
  cookie `login`, Origin WebSocket, cara menambah rute).
- Bisa ditempel ke [Swagger Editor](https://editor.swagger.io/) kalau mau dicoba
  interaktif; token diambil dari cookie `login` peramban yang sudah masuk lewat
  `https://platform.digitalbdg.ac.id/login/` (kata sandi atau WhatsAuth; tidak ada halaman login lain).

## Memperbarui

1. Ubah `openapi.yaml` di commit yang sama dengan perubahan rute di `apkflydev`
   (pedoman `pdb/README.md` bagian Backend poin 3), naikkan `info.version`.
2. Periksa: `python3 -c "import yaml; yaml.safe_load(open('openapi.yaml'))"` dan
   cocokkan daftar `method path` dengan `grep -E 'page\.(Get|Post|Put|Delete)' ../apkflydev/url/*.go`.
   Validasi skema penuh (rujukan `$ref` yang patah, deskripsi berkoma di mapping `{...}` yang
   diam-diam jadi kunci baru): `npm i @apidevtools/swagger-parser` di folder sementara, lalu dari
   folder itu `node -e "require('@apidevtools/swagger-parser').validate('<path>/apidocs/openapi.yaml').then(()=>console.log('VALID'))"`.
3. Catat padanannya di tabel versi di bawah.

| Versi | Tanggal | Backend (`/api/version`) | Catatan |
|---|---|---|---|
| 1.5.0 | 2026-09-25 | `apkflydev` `a7bcddb` | Pengumuman kelas (`/kelas/{id}/pengumuman`, opsi kirim ke grup WhatsApp kelas), `grup_wa` di detail kelas (grup WhatsApp per kelas); 3 operasi baru, 108 path, 137 skema |
| 1.4.0 | 2026-09-25 | `apkflydev` `6b466f4` | Kelas sebagai pusat pembelajaran (`/kelas/...`: kelas saya, kelola kelas, isi per minggu, tugas kelas, bobot & buku nilai), penilaian tugas (`/tugas/{id}/kiriman`, nilai & kembalikan, lampiran soal, ubah/hapus tugas), `mk_kode` di materi & kuis, hak tulis per kelas; skema akun/pengguna 1.3.0 dipindah dari `requestBodies` ke `schemas` (rujukannya sempat patah); 20 operasi baru, 106 path, 134 skema, lolos `swagger-parser validate` |
| 1.3.0 | 2026-09-25 | `apkflydev` (commit login kata sandi) | Masuk dengan NIM/email + kata sandi (`/akun/masuk`, `/akun/sandi`), halaman Pengguna (`/pengguna/...`: dosen, mahasiswa, reset kata sandi, aktif/nonaktif, jabatan admin); 11 operasi baru, 92 path, 100 skema |
| 1.2.0 | 2026-09-15 | `apkflydev` `be500df` | Pengantar untuk developer/AI (token, peran, galat, batas, alur), skema `whatsauthToken` (dulu `dosenToken`), semua parameter berdeskripsi, body galat untuk rute bot lama, `SKILL.md` |
| 1.1.0 | 2026-09-15 | `apkflydev` `9289958` | 100 operasi, 80 path, 98 skema; seed kurikulum hanya `trpl` |
