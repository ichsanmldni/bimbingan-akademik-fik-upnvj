/*
  Warnings:

  - You are about to drop the column `waktu_mulai` on the `chatpribadi` table. All the data in the column will be lost.
  - Added the required column `is_pesan_terakhir_read` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pesan_terakhir` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_pesan_terakhir` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatpribadi` DROP COLUMN `waktu_mulai`,
    ADD COLUMN `is_pesan_terakhir_read` BOOLEAN NOT NULL,
    ADD COLUMN `pesan_terakhir` VARCHAR(191) NOT NULL,
    ADD COLUMN `waktu_pesan_terakhir` DATETIME(3) NOT NULL;
