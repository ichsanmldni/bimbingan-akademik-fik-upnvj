/*
  Warnings:

  - You are about to drop the `historypesanchatbot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historypesanchatbot` DROP FOREIGN KEY `historypesanchatbot_sesi_chatbot_mahasiswa_id_fkey`;

-- DropTable
DROP TABLE `historypesanchatbot`;

-- CreateTable
CREATE TABLE `riwayatpesanchatbot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `pesan` VARCHAR(1000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `riwayatpesanchatbot` ADD CONSTRAINT `riwayatpesanchatbot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
