-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengajuan_bimbingan_id` INTEGER NOT NULL,
    `laporan_bimbingan_id` INTEGER NULL,
    `status_pengesahan_kehadiran` VARCHAR(191) NULL,
    `ttd_kehadiran` VARCHAR(191) NULL,
    `dokumentasi_kehadiran` VARCHAR(191) NULL,
    `status_kehadiran_mahasiswa` VARCHAR(191) NULL,
    `permasalahan` TEXT NULL,
    `solusi` TEXT NULL,

    INDEX `Bimbingan_laporan_bimbingan_id_fkey`(`laporan_bimbingan_id`),
    INDEX `Bimbingan_pengajuan_bimbingan_id_fkey`(`pengajuan_bimbingan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatpribadi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `dosen_pa_id` INTEGER NOT NULL,
    `is_mahasiswa_pesan_terakhir_read` BOOLEAN NULL,
    `is_dosenpa_pesan_terakhir_read` BOOLEAN NULL,
    `pesan_terakhir` TEXT NOT NULL,
    `waktu_pesan_terakhir` DATETIME(3) NOT NULL,
    `pengirim_pesan_terakhir` VARCHAR(191) NOT NULL,

    INDEX `ChatPribadi_dosen_pa_id_fkey`(`dosen_pa_id`),
    INDEX `ChatPribadi_mahasiswa_id_fkey`(`mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesansiaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `pesan_terakhir` TEXT NOT NULL,
    `waktu_pesan_terakhir` DATETIME(3) NOT NULL,

    INDEX `Dosen_dosen_pa_id_fkey`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanchatsiaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesan_siaran_id` INTEGER NOT NULL,
    `pesan` TEXT NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `PesanChatSiaran_pesan_siaran_id_fkey`(`pesan_siaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosenpa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NULL,
    `hp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dosen_email_key`(`email`),
    UNIQUE INDEX `Dosen_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kaprodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NULL,
    `kaprodi_jurusan` VARCHAR(191) NULL,
    `hp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dosen_email_key`(`email`),
    UNIQUE INDEX `Dosen_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwaldosenpa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jam_mulai` VARCHAR(191) NOT NULL,
    `jam_selesai` VARCHAR(191) NOT NULL,

    INDEX `JadwalDosenPA_dosen_pa_id_fkey`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laporanbimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah_beasiswa_bbm` INTEGER NULL,
    `jumlah_beasiswa_dll` INTEGER NULL,
    `jumlah_beasiswa_pegadaian` INTEGER NULL,
    `jumlah_beasiswa_ppa` INTEGER NULL,
    `jumlah_beasiswa_supersemar` INTEGER NULL,
    `jumlah_beasiswa_ykl` INTEGER NULL,
    `jumlah_ipk_a` INTEGER NULL,
    `jumlah_ipk_b` INTEGER NULL,
    `jumlah_ipk_c` INTEGER NULL,
    `jumlah_ipk_d` INTEGER NULL,
    `jumlah_ipk_e` INTEGER NULL,
    `kaprodi_id` INTEGER NULL,
    `nama_kaprodi` VARCHAR(191) NOT NULL,
    `kesimpulan` JSON NULL,
    `dosen_pa_id` INTEGER NULL,
    `nama_dosen_pa` VARCHAR(191) NOT NULL,
    `pendahuluan` JSON NULL,
    `semester` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `jenis_bimbingan` VARCHAR(191) NOT NULL,
    `jumlah_mahasiswa` INTEGER NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,
    `tanda_tangan_dosen_pa` VARCHAR(191) NULL,
    `dokumentasi` TEXT NULL,
    `jadwal_bimbingan` VARCHAR(191) NOT NULL,
    `feedback_kaprodi` VARCHAR(191) NULL,

    INDEX `LaporanBimbingan_dosen_pa_id_fkey`(`dosen_pa_id`),
    INDEX `LaporanBimbingan_kaprodi_id_fkey`(`kaprodi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `datastatusmahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_bimbingan_id` INTEGER NULL,
    `nama` VARCHAR(191) NULL,
    `nim` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,

    INDEX `DataStatusMahasiswa_laporan_bimbingan_id_fkey`(`laporan_bimbingan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestasiilmiahmahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_bimbingan_id` INTEGER NULL,
    `bidang_prestasi` VARCHAR(191) NULL,
    `lampiran` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NULL,
    `nim` VARCHAR(191) NULL,
    `tingkat_prestasi` VARCHAR(191) NULL,

    INDEX `PrestasiIlmiahMahasiswa_laporan_bimbingan_id_fkey`(`laporan_bimbingan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestasiporsenimahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_bimbingan_id` INTEGER NULL,
    `jenis_kegiatan` VARCHAR(191) NULL,
    `lampiran` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NULL,
    `nim` VARCHAR(191) NULL,
    `tingkat_prestasi` VARCHAR(191) NULL,

    INDEX `PrestasiPorseniMahasiswa_laporan_bimbingan_id_fkey`(`laporan_bimbingan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hp` VARCHAR(191) NOT NULL,
    `peminatan` VARCHAR(191) NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NULL,
    `ipk` VARCHAR(191) NULL,
    `dosen_pa_id` INTEGER NULL,

    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    UNIQUE INDEX `Mahasiswa_email_key`(`email`),
    INDEX `Mahasiswa_dosen_pa_id_fkey`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterjenisbimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_bimbingan` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastertopikbimbinganpribadi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topik_bimbingan` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterpeminatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peminatan` VARCHAR(191) NOT NULL,
    `jurusan_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastersistembimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sistem_bimbingan` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastertahunajaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasidosenpa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL,
    `waktu` DATETIME(3) NOT NULL,

    INDEX `NotifikasiDosenPA_dosen_pa_id_fkey`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasikaprodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kaprodi_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL,
    `waktu` DATETIME(3) NOT NULL,

    INDEX `NotifikasiKaprodi_kaprodi_id_fkey`(`kaprodi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasimahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL,
    `waktu` DATETIME(3) NOT NULL,

    INDEX `NotifikasiMahasiswa_mahasiswa_id_fkey`(`mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengajuanbimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `no_whatsapp` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `jadwal_bimbingan` VARCHAR(191) NOT NULL,
    `jadwal_bimbingan_reschedule` VARCHAR(191) NULL,
    `status_reschedule` VARCHAR(191) NULL,
    `keterangan_reschedule` VARCHAR(191) NULL,
    `jenis_bimbingan` VARCHAR(191) NOT NULL,
    `topik_bimbingan` VARCHAR(191) NULL,
    `sistem_bimbingan` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `dosen_pa_id` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `periode_pengajuan` VARCHAR(191) NULL,
    `permasalahan` TEXT NULL,

    INDEX `PengajuanBimbingan_dosen_pa_id_fkey`(`dosen_pa_id`),
    INDEX `PengajuanBimbingan_mahasiswa_id_fkey`(`mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanbot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `pesan` VARCHAR(5000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `PesanBot_sesi_chatbot_mahasiswa_id_fkey`(`sesi_chatbot_mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanchatbotmahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NULL,
    `pesan` VARCHAR(1000) NOT NULL,
    `waktu_kirim` DATETIME(0) NOT NULL,

    INDEX `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey`(`sesi_chatbot_mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanchatdosenpa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_pribadi_id` INTEGER NOT NULL,
    `pesan` VARCHAR(1000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `PesanChatDosenPA_chat_pribadi_id_fkey`(`chat_pribadi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanchatmahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_pribadi_id` INTEGER NOT NULL,
    `pesan` VARCHAR(1000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `PesanChatMahasiswa_chat_pribadi_id_fkey`(`chat_pribadi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesichatbotmahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,
    `pesan_pertama` VARCHAR(191) NOT NULL,

    INDEX `SesiChatbotMahasiswa_mahasiswa_id_fkey`(`mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayatpesanchatbot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `pesan` VARCHAR(5000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `riwayatpesanchatbot_sesi_chatbot_mahasiswa_id_fkey`(`sesi_chatbot_mahasiswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterbabinformasiakademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastersubbabinformasiakademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bab_informasi_akademik_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isi` TEXT NOT NULL,
    `order` INTEGER NOT NULL,

    INDEX `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey`(`bab_informasi_akademik_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `Bimbingan_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `Bimbingan_pengajuan_bimbingan_id_fkey` FOREIGN KEY (`pengajuan_bimbingan_id`) REFERENCES `pengajuanbimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatpribadi` ADD CONSTRAINT `ChatPribadi_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatpribadi` ADD CONSTRAINT `ChatPribadi_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesansiaran` ADD CONSTRAINT `PesanSiaran_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatsiaran` ADD CONSTRAINT `PesanChatSiaran_pesan_siaran_id_fkey` FOREIGN KEY (`pesan_siaran_id`) REFERENCES `pesansiaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwaldosenpa` ADD CONSTRAINT `JadwalDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `LaporanBimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `LaporanBimbingan_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datastatusmahasiswa` ADD CONSTRAINT `DataStatusMahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestasiilmiahmahasiswa` ADD CONSTRAINT `PrestasiIlmiahMahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestasiporsenimahasiswa` ADD CONSTRAINT `PrestasiPorseniMahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasidosenpa` ADD CONSTRAINT `NotifikasiDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasikaprodi` ADD CONSTRAINT `NotifikasiKaprodi_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasimahasiswa` ADD CONSTRAINT `NotifikasiMahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuanbimbingan` ADD CONSTRAINT `PengajuanBimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuanbimbingan` ADD CONSTRAINT `PengajuanBimbingan_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanbot` ADD CONSTRAINT `PesanBot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatbotmahasiswa` ADD CONSTRAINT `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatdosenpa` ADD CONSTRAINT `PesanChatDosenPA_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `chatpribadi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatmahasiswa` ADD CONSTRAINT `PesanChatMahasiswa_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `chatpribadi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesichatbotmahasiswa` ADD CONSTRAINT `SesiChatbotMahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayatpesanchatbot` ADD CONSTRAINT `riwayatpesanchatbot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mastersubbabinformasiakademik` ADD CONSTRAINT `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey` FOREIGN KEY (`bab_informasi_akademik_id`) REFERENCES `masterbabinformasiakademik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
