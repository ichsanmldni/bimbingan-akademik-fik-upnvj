/*
  Warnings:

  - You are about to drop the column `kendala_mahasiswa` on the `laporanbimbingan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `kendala_mahasiswa`,
    ADD COLUMN `permasalahan` VARCHAR(191) NULL;
