/*
  Warnings:

  - You are about to drop the column `dosen_id` on the `chatpribadi` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `dosen_id` on the `laporanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `dosen_id` on the `pengajuanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the `jadwaldosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifikasidosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pesanchatbotdosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pesanchatdosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sesichatbotdosen` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dosen_pa_id` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dosen_pa_id` to the `PengajuanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chatpribadi` DROP FOREIGN KEY `ChatPribadi_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwaldosen` DROP FOREIGN KEY `JadwalDosen_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `Mahasiswa_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifikasidosen` DROP FOREIGN KEY `NotifikasiDosen_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `pengajuanbimbingan` DROP FOREIGN KEY `PengajuanBimbingan_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatbotdosen` DROP FOREIGN KEY `PesanChatbotDosen_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatbotdosen` DROP FOREIGN KEY `PesanChatbotDosen_sesi_chatbot_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatdosen` DROP FOREIGN KEY `PesanChatDosen_chat_pribadi_id_fkey`;

-- DropForeignKey
ALTER TABLE `sesichatbotdosen` DROP FOREIGN KEY `SesiChatbotDosen_dosen_id_fkey`;

-- AlterTable
ALTER TABLE `chatpribadi` DROP COLUMN `dosen_id`,
    ADD COLUMN `dosen_pa_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `kaprodi` DROP COLUMN `profile_image`;

-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `dosen_id`,
    ADD COLUMN `dosen_pa_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `pengajuanbimbingan` DROP COLUMN `dosen_id`,
    ADD COLUMN `dosen_pa_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `jadwaldosen`;

-- DropTable
DROP TABLE `notifikasidosen`;

-- DropTable
DROP TABLE `pesanchatbotdosen`;

-- DropTable
DROP TABLE `pesanchatdosen`;

-- DropTable
DROP TABLE `sesichatbotdosen`;

-- CreateTable
CREATE TABLE `DosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotifikasiDosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `read` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalDosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jam_mulai` DATETIME(3) NOT NULL,
    `jam_selesai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SesiChatbotDosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatbotDosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_dosen_pa_id` INTEGER NOT NULL,
    `dosen_pa_id` INTEGER NOT NULL,
    `is_bot` BOOLEAN NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesanChatDosenPA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_pribadi_id` INTEGER NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DosenPA` ADD CONSTRAINT `DosenPA_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotifikasiDosenPA` ADD CONSTRAINT `NotifikasiDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengajuanBimbingan` ADD CONSTRAINT `PengajuanBimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanBimbingan` ADD CONSTRAINT `LaporanBimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalDosenPA` ADD CONSTRAINT `JadwalDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SesiChatbotDosenPA` ADD CONSTRAINT `SesiChatbotDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotDosenPA` ADD CONSTRAINT `PesanChatbotDosenPA_sesi_chatbot_dosen_pa_id_fkey` FOREIGN KEY (`sesi_chatbot_dosen_pa_id`) REFERENCES `SesiChatbotDosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatbotDosenPA` ADD CONSTRAINT `PesanChatbotDosenPA_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatPribadi` ADD CONSTRAINT `ChatPribadi_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `DosenPA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesanChatDosenPA` ADD CONSTRAINT `PesanChatDosenPA_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `ChatPribadi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
