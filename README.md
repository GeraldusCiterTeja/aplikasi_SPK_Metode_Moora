# Sistem Pendukung Keputusan (SPK) MOORA Berbasis Web

## Gambaran Umum Aplikasi

Aplikasi ini adalah alat **Sistem Pendukung Keputusan (SPK)** berbasis *website* yang mengimplementasikan metode **MOORA (Multi-Objective Optimization on the basis of Ratio Analysis)**. Tujuannya adalah membantu pengguna dalam proses pengambilan keputusan multikriteria secara **objektif** dan **transparan** dengan menghasilkan perangkingan alternatif terbaik.

## Fitur Utama

Aplikasi ini memiliki fitur lengkap untuk manajemen data dan pemrosesan perhitungan:

* **Manajemen Kriteria (CRUD):** Tambah, lihat, ubah bobot, dan tentukan jenis kriteria (**Benefit** / **Cost**).

* **Manajemen Alternatif (CRUD):** Tambah dan hapus objek keputusan (alternatif).

* **Input Matriks Keputusan:** Formulir dinamis untuk memasukkan nilai (skor) setiap alternatif terhadap setiap kriteria.

* **Perhitungan MOORA Otomatis:** Menjalankan algoritma MOORA dengan satu klik untuk normalisasi dan optimasi.

* **Tampilan Perangkingan:** Menampilkan hasil akhir berupa tabel yang mencakup nilai optimasi ($\mathbf{Y_i}$) dan peringkat akhir.

## Teknologi yang Digunakan

Aplikasi ini bersifat *client-side* murni, dibangun menggunakan dasar web standard:

| Komponen | Teknologi | Keterangan | 
 | ----- | ----- | ----- | 
| **Frontend/Logika** | **HTML5, CSS3, JavaScript** | HTML untuk struktur, CSS untuk *styling* responsif, dan JavaScript untuk logika perhitungan MOORA dan manipulasi DOM. | 
| **Metode SPK** | **MOORA** | Inti algoritma untuk menentukan nilai optimal. | 

## Algoritma Perhitungan MOORA

Metode MOORA digunakan untuk menentukan nilai optimasi ($\mathbf{Y_i}$) bagi setiap alternatif.

### 1. Normalisasi Matriks (Ratio System)

Setiap nilai ($X_{ij}$) dinormalisasi ($X_{ij}^*$) menggunakan rumus vektor untuk menghilangkan dimensi kriteria:

$$
X_{ij}^* = \frac{X_{ij}}{\sqrt{\sum_{i=1}^{m} X_{ij}^2}}
$$

Kemudian, dihitung Matriks Normalisasi Terbobot ($\mathbf{V_{ij}}$) dengan mengalikan $X_{ij}^*$ dengan bobot kriteria ($W_j$).

$$
\mathbf{V_{ij}} = W_j \cdot X_{ij}^*
$$

### 2. Perhitungan Optimasi ($\mathbf{Y_i}$)

Nilai $\mathbf{Y_i}$ dihitung sebagai **selisih** antara total nilai terbobot kriteria **Benefit** dan total nilai terbobot kriteria **Cost**:

$$
\mathbf{Y_i} = \sum_{j=1}^{g} V_{ij} \text{ (Benefit)} - \sum_{j=g+1}^{n} V_{ij} \text{ (Cost)}
$$

### 3. Perangkingan

Alternatif dengan nilai $\mathbf{Y_i}$ **tertinggi** (paling positif) adalah alternatif terbaik dan mendapatkan Peringkat 1.

## Cara Penggunaan

1. **Kloning/Unduh Proyek:** Dapatkan ketiga file (`index.html`, `style.css`, `script.js`).

2. **Jalankan:** Buka file `index.html` menggunakan *web browser* apa pun.

3. **Input Data:** Masukkan atau ubah data Kriteria, Bobot, dan Alternatif.

4. **Isi Matriks:** Masukkan nilai (skor) setiap alternatif pada tabel Matriks Keputusan.

5. **Hitung:** Klik tombol **HITUNG PERANGKINGAN MOORA**.

6. **Lihat Hasil:** Hasil perangkingan akhir akan muncul di bagian bawah halaman.

## Desain Responsif

Aplikasi ini dibuat responsif menggunakan **Media Queries** di `style.css` agar tampilan tetap rapi dan *user-friendly* di berbagai ukuran layar (**desktop**, **tablet**, hingga **handphone**). Tabel lebar akan mengaktifkan *scroll* horizontal di layar kecil.

*Dibuat menggunakan JavaScript untuk solusi SPK yang cepat dan efisien.*
```eof