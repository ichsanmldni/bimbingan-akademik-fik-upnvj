-- AlterTable
ALTER TABLE `pesanbot` MODIFY `pesan` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatbotmahasiswa` MODIFY `pesan` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatdosenpa` MODIFY `pesan` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatmahasiswa` MODIFY `pesan` VARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE `historymessagechatbot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesi_chatbot_mahasiswa_id` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `pesan` VARCHAR(1000) NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historymessagechatbot` ADD CONSTRAINT `historymessagechatbot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
