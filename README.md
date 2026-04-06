# Library Management System

Sistem manajemen perpustakaan sederhana berbasis REST API. Dibuat untuk Final Project mata kuliah Software Testing dengan fokus pada automated testing dan continuous integration.

## Deskripsi Aplikasi

Aplikasi menyediakan REST API untuk mengelola buku, anggota, dan peminjaman. Stack: Node.js + Express + Jest + Supertest.

## Fitur Utama

1. Manajemen Buku - tambah, list, cari buku
2. Manajemen Anggota - registrasi dengan validasi
3. Peminjaman & Pengembalian - maksimal 3 pinjaman aktif, hitung denda

## Business Rules

- ISBN valid (10 atau 13 digit)
- Email valid
- Tahun terbit 1800 sampai sekarang
- Maksimal 3 pinjaman aktif per anggota
- Stok otomatis berkurang saat dipinjam dan bertambah saat dikembalikan
- Denda = Rp1.000 x hari telat

## Cara Menjalankan

Install dependencies:

    npm install

Jalankan server di localhost:3000:

    npm start

Jalankan semua test dengan coverage:

    npm test

## Strategi Pengujian

Pengujian dibagi menjadi tiga lapisan:

1. Unit Test Validators (tests/validators.test.js) - 19 test untuk fungsi murni validasi ISBN, email, nama, tahun, dan perhitungan denda.
2. Unit Test Services (tests/services.test.js) - 11 test untuk logika bisnis BookService, MemberService, dan LoanService dengan in-memory database.
3. Integration Test API (tests/api.test.js) - 6 test untuk full HTTP flow menggunakan Supertest.

Total 36 test dengan coverage 94% (target minimal 60%).

## Continuous Integration

GitHub Actions otomatis menjalankan test pada setiap push dan pull request. Pipeline: checkout kode, setup Node 20, install dependencies, run tests dengan coverage, dan upload coverage artifact.

## Struktur Repository

- .github/workflows/ci.yml - konfigurasi GitHub Actions
- src/app.js - Express app dan routes
- src/db.js - in-memory database
- src/services.js - business logic
- src/validators.js - input validators
- tests/validators.test.js - unit test validators
- tests/services.test.js - unit test services
- tests/api.test.js - integration test API
- package.json - konfigurasi npm dan jest
- README.md - dokumentasi ini
- LAPORAN.md - laporan proyek