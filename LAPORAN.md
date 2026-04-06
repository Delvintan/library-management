# Laporan Final Project - Software Testing
## Library Management System

**Nama:** _(isi nama kamu)_  
**NIM:** _(isi NIM kamu)_  
**Mata Kuliah:** Software Testing

---

## 1. Deskripsi Sistem

Library Management System adalah REST API sederhana untuk mengelola aktivitas perpustakaan. Sistem menyediakan tiga fitur utama: manajemen buku, manajemen anggota, dan peminjaman & pengembalian buku. Aplikasi dibangun menggunakan Node.js dengan framework Express dan in-memory database.

Sistem menerapkan aturan bisnis yang dapat diuji otomatis: validasi format ISBN (10/13 digit), validasi email, validasi tahun terbit (1800 sampai sekarang), batas maksimum 3 pinjaman aktif per anggota, larangan meminjam buku yang sama dua kali, manajemen stok otomatis, dan perhitungan denda keterlambatan Rp1.000 per hari.

## 2. Arsitektur Aplikasi

Aplikasi menggunakan arsitektur berlapis (layered architecture) untuk memisahkan tanggung jawab dan memudahkan pengujian. Terdapat empat lapisan utama:

- **Express Routes** pada `src/app.js` sebagai HTTP layer yang menerima request dari client.
- **Services** pada `src/services.js` yang berisi business logic (BookService, MemberService, LoanService).
- **Validators** pada `src/validators.js` yang berisi fungsi-fungsi pure untuk validasi input.
- **Database** pada `src/db.js` sebagai in-memory store untuk data buku, anggota, dan peminjaman.

Pemisahan ini membuat setiap layer dapat diuji secara independen: validator diuji sebagai fungsi murni, service diuji langsung dengan in-memory DB, dan routes diuji via Supertest.

## 3. Strategi Pengujian

Strategi pengujian mengikuti prinsip testing pyramid: banyak unit test di lapisan bawah, lebih sedikit integration test di lapisan atas.

### 3.1 Unit Testing (30 test case)

**a. Validator Tests** pada `tests/validators.test.js` terdiri dari 19 test yang menguji fungsi murni: validateIsbn, validateEmail, validateName, validateYear, dan calculateLateFee. Mencakup kasus valid, invalid, boundary, dan error handling.

**b. Service Tests** pada `tests/services.test.js` terdiri dari 11 test yang menguji logika bisnis pada BookService, MemberService, dan LoanService dengan in-memory DB yang direset di setiap test. Kasus yang diuji meliputi pembuatan buku, duplikasi ISBN, registrasi anggota, alur peminjaman, batas 3 pinjaman, pencegahan pengembalian ganda, dan pencarian.

### 3.2 Integration Testing (6 test case)

File `tests/api.test.js` menggunakan Supertest untuk menguji alur lengkap HTTP sampai database. Skenario yang diuji: endpoint GET /health, POST dan GET /books, validation error handling dengan status 400, full borrow-return flow end-to-end, peminjaman buku yang tidak ada, dan search endpoint dengan query parameter.

### 3.3 Rekapitulasi

Total terdapat **36 test case**: 30 unit test (melebihi target minimum 15) dan 6 integration test (melebihi target minimum 5).

## 4. Test Coverage

Coverage diukur menggunakan Jest built-in coverage (Istanbul). Hasil pengukuran menunjukkan line coverage keseluruhan mencapai **94.11%**, statement coverage 87.16%, branch coverage 82.71%, dan function coverage 94.11%.

Rinciannya: file `db.js` mencapai 100% di semua metrik, `validators.js` 100% line coverage, `services.js` 98.18% line coverage, dan `app.js` 84.21% line coverage. Angka 94.11% ini jauh di atas target minimum 60% yang ditetapkan dalam tugas. Baris yang belum tercover sebagian besar merupakan cabang error handler yang sulit dipicu dari skenario normal. Laporan HTML detail dapat dibuka di `coverage/lcov-report/index.html` setelah menjalankan `npm test`.

## 5. Pipeline Continuous Integration

File workflow berada di `.github/workflows/ci.yml`. Pipeline otomatis berjalan pada setiap push dan pull request ke branch main atau master, dengan tahapan sebagai berikut:

1. Checkout kode sumber menggunakan actions/checkout@v4
2. Setup Node.js versi 20 menggunakan actions/setup-node@v4
3. Install dependencies via npm install
4. Menjalankan seluruh test dengan coverage via npm test
5. Upload laporan coverage sebagai GitHub artifact
6. Upload coverage ke Codecov

Pipeline ini memastikan setiap perubahan kode langsung diverifikasi. Jika ada test yang gagal atau build error, pull request tidak akan mendapat ceklis hijau. Ini mensimulasikan praktik Continuous Integration di industri dan menjaga kualitas kode seiring bertambahnya fitur.

## 6. Kesimpulan

Proyek ini berhasil memenuhi seluruh ketentuan tugas. Aplikasi memiliki 3 fitur utama dengan validasi input, logika bisnis, dan penyimpanan data. Terdapat 30 unit test dan 6 integration test (total 36, melebihi minimum 20). Coverage mencapai 94.11% (jauh di atas target 60%). Pipeline CI berjalan otomatis pada setiap push dan pull request. Proyek ini mendemonstrasikan bagaimana arsitektur berlapis memudahkan pengujian dan bagaimana CI/CD menjaga kualitas perangkat lunak modern.