---
name: apk-fly-dev-client
description: Menulis atau mengubah klien/integrasi ke backend Platform Digital Bandung (https://apk.fly.dev) — frontend crootjs, skrip, bot, atau webhook. Muat sebelum memanggil rute /api mana pun; sumber rute dan skema adalah openapi.yaml di folder yang sama.
---

# Klien backend Platform Digital Bandung

## Sumber kebenaran
- Rute + skema: `openapi.yaml` (folder ini; publik di https://platform.digitalbdg.ac.id/apidocs/openapi.yaml). Jangan menebak rute; kalau rute yang dibutuhkan tidak ada di sana, rute itu memang tidak ada.
- Commit backend yang berjalan: `GET https://apk.fly.dev/api/version` → `commit`.
- Pedoman proyek (peran, konvensi frontend, aturan menambah rute): README repo `pdb`.

## Autentikasi
- Satu-satunya jalur: WhatsAuth di `https://platform.digitalbdg.ac.id/login/`. Tidak ada password, signup, atau API key pengguna. Jangan membuat form login/QR sendiri.
- Token PASETO v4.public, 18 jam, klaim `Id` (nomor WA), `Alias` (nama), `Data.role` (`[]string`, mis. `["dosen","kaprodi"]`; mahasiswa tanpa role — dikenali lewat roster).
- Klien web: token di cookie `login` (`path=/`), dikirim `Authorization: Bearer <token>`. Tanpa cookie → simpan halaman asal di cookie `login_redirect`, lalu `redirect("/login/")`. Logout = `deleteCookie("login")`.
- Rute bot WhatsApp warisan (`botregister`, `device/*`, `send/message/*`, `numbers/isonwa`, `whatsauth/request`) memakai header `token` (token operator nomor bot), bukan Bearer.
- WebSocket `wss://apk.fly.dev/ws/whatsauth/public` hanya menerima `Origin https://platform.digitalbdg.ac.id`; klien non-web tidak bisa login sendiri.

## Peran → hak (ringkas; rincian per rute di `openapi.yaml`)
| Peran | Boleh |
|---|---|
| mahasiswa (roster) | baca/kerjakan hanya prodi rosternya: materi, kuis, tugas, forum, nilai, rapor, dasbor, proyek kerja, RPL |
| dosen | baca semua prodi; roster & email kampus; tinjau RPL, rapor per NIM, ujian, proyek blok, proyek kerja bimbingan |
| dosen pengampu (`dosentugas.prodi_kode`) | + kuis, materi, tugas, rekaman untuk prodi itu |
| kaprodi | + kurikulum, kalender, centang pengampu, laporan prodinya |
| admin | tetapkan kaprodi, prodi baru, laporan semua prodi — TIDAK mengubah kurikulum/kalender/kuis/materi/tugas |

Kode: `401` tanpa token · `403` nomor tak terdaftar / peran kurang · `404` tidak ada · `422` isian salah. Body galat rute platform `{"detail": "..."}`; rute bot lama `{"error": "..."}`.

## Aturan klien web (wajib, dari README pdb)
- Semua panggilan REST lewat crootjs (`getJSON`, `postJSON`, `putJSON`, `deleteJSON`, `postFileJSON`) dari `https://cdn.jsdelivr.net/gh/crootjs/lib@<versi dipatok>/...` — bukan `fetch()`, bukan `@latest`, bukan `jscroot/lib`. HTML/CSS/JS terpisah; tanpa `<style>`/`<script>` inline, `style=""`, atau `onclick=`.
- `API_BASE` tetap `https://apk.fly.dev`, tidak boleh diganti dari sisi pengguna (localStorage, prompt, parameter URL).
- Pemakai di repo frontend: `assets/js/api.js` (pembungkus + `arahkanKeLogin()`), `akun.js` (tombol Masuk/Keluar, pemilih peran), `menu.js` (menu per peran).

## Batas & format
- Body ≤ 24 MiB; PDF materi ≤ 20 MiB. Unggah = `multipart/form-data` satu field berkas, field teks lewat query string. Berkas dibaca balik sebagai base64 dalam JSON.
- Kode prodi huruf kecil `[a-z][a-z0-9-]{1,19}`, ambil dari `GET /kurikulum/prodi`. Waktu WIB; tanggal `YYYY-MM-DD`; id dokumen ObjectID 24 heksadesimal.

## Alur tipikal
- Kaprodi menyiapkan prodi: `PUT /kurikulum/prodi/{prodi}` → rumpun/CPL → `PUT /kurikulum/ritme/{nama}` → `POST /kalender` → `PUT /kalender/{id}` → `POST /kalender/{id}/terbitkan` → `PUT /jabatan/dosen/{email}/prodi`.
- Tugas: `POST /tugas` (wajib `prodi_kode`, pengampu/kaprodi) → `GET /tugas` → `POST /tugas/{id}/kirim` (mahasiswa roster) → `GET /tugas/{id}/laporan`.
- Materi & kuis mingguan: `POST /materi` (+`/berkas`) → `GET /materi?rumpun=&minggu=` → `POST /progresmateri`; `POST /kuisgerbang` → `GET /kuisgerbang/{rumpun}/{minggu}` → `POST /kuisgerbang/{id}/submit` → `GET /mahasiswa/{nim}/kuisgerbang/status`.
- Autograder: GitHub Actions (`pull_request_target`, binari repo `telemetri`) → `POST /autograder/webhook` (HMAC `X-Hub-Signature-256`, event `workflow_run`) → `GET /autograder`. Rincian: `apkflydev/README.md` "Modul Autograder".

## Menambah rute di backend
1. Fungsi domain di `apkflydev/mod/<modul>/` (dipakai bot dan API), handler di `controller/`, rute di `url/` dengan awalan `/api/<modul>/...`; rute statis didaftarkan sebelum rute berparameter (dijaga tes `url/ruteguard`).
2. Struct dokumen/request/response di `apkflydev/model/` dulu; rahasia hanya lewat `buildvars` (ldflags), bukan `os.Getenv`.
3. Setiap handler memanggil pemeriksa token/peran (dijaga `controller/polaguard/rutepublik_test.go`); rute publik hanya `/api/version`, `/health`, webhook autograder, tautan tinjauan atasan.
4. Perbarui `openapi.yaml` (naikkan `info.version`, catat di tabel README apidocs) dan panduan peran yang terdampak di repo `panduan` pada commit yang sama.

## Verifikasi
```
curl -s https://apk.fly.dev/api/version
python3 -c "import yaml; yaml.safe_load(open('openapi.yaml'))"
grep -hE 'page\.(Get|Post|Put|Delete)\(' ../apkflydev/url/*.go | grep -v '/ws/' | wc -l   # harus = jumlah operasi di openapi.yaml
```
