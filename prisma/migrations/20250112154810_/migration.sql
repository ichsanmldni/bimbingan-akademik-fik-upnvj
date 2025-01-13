/*
  Warnings:

  - You are about to drop the column `is_pesan_terakhir_read` on the `chatpribadi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chatpribadi` DROP COLUMN `is_pesan_terakhir_read`,
    ADD COLUMN `is_dosenpa_pesan_terakhir_read` BOOLEAN NULL,
    ADD COLUMN `is_mahasiswa_pesan_terakhir_read` BOOLEAN NULL;
