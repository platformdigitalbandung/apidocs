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
  `https://platform.digitalbdg.ac.id/login/` (tidak ada jalur login lain).

## Memperbarui

1. Ubah `openapi.yaml` di commit yang sama dengan perubahan rute di `apkflydev`
   (pedoman `pdb/README.md` bagian Backend poin 3), naikkan `info.version`.
2. Periksa: `python3 -c "import yaml; yaml.safe_load(open('openapi.yaml'))"` dan
   cocokkan daftar `method path` dengan `grep -E 'page\.(Get|Post|Put|Delete)' ../apkflydev/url/*.go`.
3. Catat padanannya di tabel versi di bawah.

| Versi | Tanggal | Backend (`/api/version`) | Catatan |
|---|---|---|---|
| 1.2.0 | 2026-09-15 | `apkflydev` `be500df` | Pengantar untuk developer/AI (token, peran, galat, batas, alur), skema `whatsauthToken` (dulu `dosenToken`), semua parameter berdeskripsi, body galat untuk rute bot lama, `SKILL.md` |
| 1.1.0 | 2026-09-15 | `apkflydev` `9289958` | 100 operasi, 80 path, 98 skema; seed kurikulum hanya `trpl` |
