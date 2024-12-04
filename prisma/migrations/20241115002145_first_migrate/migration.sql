-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `no_whatsapp` VARCHAR(191) NOT NULL,
    `peminatan` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nama_dosen_PA` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mahasiswa_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dosen_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kaprodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nama_dosen_PA` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Kaprodi_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artikel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `isi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotifikasiMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `read` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotifikasiDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `read` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotifikasiKaprodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kaprodi_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `read` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuInformasiAkademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubmenuInformasiAkademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_informasi_akademik_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengajuanBimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `no_whatsapp` VARCHAR(191) NOT NULL,
    `jadwal_bimbingan` VARCHAR(191) NOT NULL,
    `jenis_bimbingan` VARCHAR(191) NOT NULL,
    `sistem_bimbingan` VARCHAR(191) NOT NULL,
    `tanggal_pengajuan` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanBimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NULL,
    `kaprodi_id` INTEGER NULL,
    `tanggal_bimbingan` VARCHAR(191) NOT NULL,
    `jumlah_mahasiswa` INTEGER NOT NULL,
    `jenis_bimbingan` VARCHAR(191) NOT NULL,
    `sistem_bimbingan` VARCHAR(191) NOT NULL,
    `kendala_mahasiswa` VARCHAR(191) NOT NULL,
    `solusi` VARCHAR(191) NOT NULL,
    `kesimpulan` VARCHAR(191) NOT NULL,
    `dokumentasi` VARCHAR(191) NOT NULL,
    `feedback_kaprodi` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jam_mulai` DATETIME(3) NOT NULL,
    `jam_selesai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SesiChatbotMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SesiChatbotDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatbotMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `is_bot` BOOLEAN NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatbotDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_dosen_id` INTEGER NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `is_bot` BOOLEAN NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatPribadi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_pribadi_id` INTEGER NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_pribadi_id` INTEGER NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResponBot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `respon` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotifikasiMahasiswa` ADD CONSTRAINT `NotifikasiMahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotifikasiDosen` ADD CONSTRAINT `NotifikasiDosen_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotifikasiKaprodi` ADD CONSTRAINT `NotifikasiKaprodi_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `Kaprodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmenuInformasiAkademik` ADD CONSTRAINT `SubmenuInformasiAkademik_menu_informasi_akademik_id_fkey` FOREIGN KEY (`menu_informasi_akademik_id`) REFERENCES `MenuInformasiAkademik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengajuanBimbingan` ADD CONSTRAINT `PengajuanBimbingan_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanBimbingan` ADD CONSTRAINT `LaporanBimbingan_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanBimbingan` ADD CONSTRAINT `LaporanBimbingan_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `Kaprodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalDosen` ADD CONSTRAINT `JadwalDosen_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SesiChatbotMahasiswa` ADD CONSTRAINT `SesiChatbotMahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SesiChatbotDosen` ADD CONSTRAINT `SesiChatbotDosen_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotMahasiswa` ADD CONSTRAINT `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `SesiChatbotMahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotMahasiswa` ADD CONSTRAINT `PesanChatbotMahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotDosen` ADD CONSTRAINT `PesanChatbotDosen_sesi_chatbot_dosen_id_fkey` FOREIGN KEY (`sesi_chatbot_dosen_id`) REFERENCES `SesiChatbotDosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotDosen` ADD CONSTRAINT `PesanChatbotDosen_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatPribadi` ADD CONSTRAINT `ChatPribadi_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatPribadi` ADD CONSTRAINT `ChatPribadi_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatDosen` ADD CONSTRAINT `PesanChatDosen_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `ChatPribadi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatMahasiswa` ADD CONSTRAINT `PesanChatMahasiswa_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `ChatPribadi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
