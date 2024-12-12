/*
  Warnings:

  - You are about to drop the `pesanchatbotdosenpa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sesichatbotdosenpa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pesanchatbotdosenpa` DROP FOREIGN KEY `PesanChatbotDosenPA_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatbotdosenpa` DROP FOREIGN KEY `PesanChatbotDosenPA_sesi_chatbot_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `sesichatbotdosenpa` DROP FOREIGN KEY `SesiChatbotDosenPA_dosen_pa_id_fkey`;

-- DropTable
DROP TABLE `pesanchatbotdosenpa`;

-- DropTable
DROP TABLE `sesichatbotdosenpa`;
