/*
  Warnings:

  - Added the required column `pesan_pertama` to the `SesiChatbotMahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sesichatbotmahasiswa` ADD COLUMN `pesan_pertama` VARCHAR(191) NOT NULL;
