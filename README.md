# Library Management System

**Live Demo:** https://library-management-production-597a.up.railway.app

---

Sistem manajemen perpustakaan sederhana berbasis REST API. Dibuat untuk Final Project mata kuliah Software Testing dengan fokus pada automated testing dan continuous integration.

---

## Deskripsi Aplikasi

Aplikasi menyediakan REST API dan UI web untuk mengelola buku, anggota, dan peminjaman buku di sebuah perpustakaan. Dibangun menggunakan Node.js dengan Express, diuji menggunakan Jest dan Supertest, serta menggunakan penyimpanan data berbasis file JSON.

---

## Fitur Utama

1. **Manajemen Buku** - menambah, melihat daftar, dan mencari buku berdasarkan judul atau penulis.
2. **Manajemen Anggota** - registrasi anggota dengan validasi nama dan email.
3. **Peminjaman dan Pengembalian** - meminjam buku dengan batas maksimal 3 pinjaman aktif per anggota, mengembalikan buku, dan menghitung denda keterlambatan.

---

## Business Rules

- ISBN harus valid (10 atau 13 digit).
- Email harus valid.
- Tahun terbit antara 1800 sampai tahun sekarang.
- Maksimal 3 pinjaman aktif per anggota.
- Tidak boleh meminjam buku yang sama dua kali sebelum dikembalikan.
- Stok otomatis berkurang saat dipinjam dan bertambah saat dikembalikan.
- Denda keterlambatan sebesar Rp1.000 per hari.

---

## Cara Menjalankan

**1. Install dependencies**

    npm install

**2. Jalankan server**

    npm start

Server berjalan di http://localhost:3000. Buka alamat tersebut di browser untuk mengakses UI web.

**3. Jalankan test**

    npm test

Perintah ini akan menjalankan seluruh 36 test case dan menghasilkan laporan coverage.

---

## Strategi Pengujian

Pengujian mengikuti prinsip testing pyramid dan dibagi menjadi tiga lapisan:

**Unit Test - Validators** (tests/validators.test.js) berisi 19 test untuk fungsi murni: validasi ISBN, email, nama, tahun, dan perhitungan denda.

**Unit Test - Services** (tests/services.test.js) berisi 11 test untuk logika bisnis: BookService, MemberService, dan LoanService dengan database yang direset setiap test.

**Integration Test - API** (tests/api.test.js) berisi 6 test untuk alur lengkap HTTP menggunakan Supertest: endpoint health, CRUD buku, registrasi anggota, alur peminjaman-pengembalian, dan pencarian.

**Total: 36 test case dengan line coverage 94% (target minimal 60%).**

---

## Continuous Integration

GitHub Actions otomatis menjalankan pipeline pada setiap push dan pull request ke branch main. Tahapan pipeline:

1. Checkout kode sumber
2. Setup Node.js versi 20
3. Install dependencies
4. Menjalankan seluruh test dengan coverage
5. Upload laporan coverage sebagai artifact
6. Upload coverage ke Codecov

---

## Struktur Repository

    library-management/
    +-- .github/workflows/ci.yml   (konfigurasi GitHub Actions)
    +-- src/
    |   +-- app.js                 (Express app dan routes)
    |   +-- db.js                  (file-based JSON database)
    |   +-- services.js            (business logic)
    |   +-- validators.js          (input validators)
    +-- public/
    |   +-- index.html             (UI web)
    +-- tests/
    |   +-- validators.test.js     (unit test validators)
    |   +-- services.test.js       (unit test services)
    |   +-- api.test.js            (integration test API)
    +-- package.json
    +-- README.md
    +-- LAPORAN.md
