/*
  Warnings:

  - You are about to drop the column `is_bot` on the `pesanchatbotmahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `pesanchatbotmahasiswa` table. All the data in the column will be lost.
  - You are about to drop the `responbot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pesanchatbotmahasiswa` DROP FOREIGN KEY `PesanChatbotMahasiswa_mahasiswa_id_fkey`;

-- AlterTable
ALTER TABLE `pesanchatbotmahasiswa` DROP COLUMN `is_bot`,
    DROP COLUMN `mahasiswa_id`;

-- DropTable
DROP TABLE `responbot`;

-- CreateTable
CREATE TABLE `PesanBot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PesanBot` ADD CONSTRAINT `PesanBot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `SesiChatbotMahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
