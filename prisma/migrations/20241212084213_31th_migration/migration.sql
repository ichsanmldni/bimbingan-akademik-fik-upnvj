/*
  Warnings:

  - Added the required column `pengirim_pesan_terakhir` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatpribadi` ADD COLUMN `pengirim_pesan_terakhir` VARCHAR(191) NOT NULL;
