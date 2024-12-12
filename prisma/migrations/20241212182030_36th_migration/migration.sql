-- DropForeignKey
ALTER TABLE `pesanchatbotmahasiswa` DROP FOREIGN KEY `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey`;

-- AlterTable
ALTER TABLE `pesanchatbotmahasiswa` MODIFY `sesi_chatbot_mahasiswa_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PesanChatbotMahasiswa` ADD CONSTRAINT `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `SesiChatbotMahasiswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
