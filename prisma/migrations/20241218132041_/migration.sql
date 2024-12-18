/*
  Warnings:

  - You are about to alter the column `waktu_kirim` on the `pesanchatbotmahasiswa` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `pesanchatbotmahasiswa` MODIFY `waktu_kirim` DATETIME(0) NOT NULL;
