[![CI](https://github.com/Delvintan/library-management/actions/workflows/ci.yml/badge.svg)](https://github.com/Delvintan/library-management/actions/workflows/ci.yml)

[![codecov](https://codecov.io/gh/Delvintan/library-management/branch/main/graph/badge.svg)](https://codecov.io/gh/Delvintan/library-management)

# Library Management System

**Live Demo:** https://library-management-production-597a.up.railway.app

[![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/ci.yml)

[![codecov](https://codecov.io/gh/Delvintan/library-management/branch/main/graph/badge.svg)](https://codecov.io/gh/Delvintan/library-management)

Sistem manajemen perpustakaan sederhana berbasis REST API. Dibuat untuk Final Project mata kuliah Software Testing dengan fokus pada automated testing dan continuous integration.

## Deskripsi Aplikasi

Aplikasi menyediakan REST API untuk mengelola buku, anggota, dan peminjaman. Stack: **Node.js + Express + Jest + Supertest**.

### Fitur Utama
1. **Manajemen Buku** - tambah, list, cari buku
2. **Manajemen Anggota** - registrasi dengan validasi
3. **Peminjaman & Pengembalian** - maks 3 pinjaman aktif, hitung denda

### Business Rules
- ISBN valid (10/13 digit)
- Email valid
- Tahun terbit 1800 s/d sekarang
- Maks 3 pinjaman aktif per anggota
- Stok otomatis berkurang/bertambah
- Denda = Rp1.000 x hari telat

## Cara Menjalankan
```bash

